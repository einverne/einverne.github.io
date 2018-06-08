---
layout: post
title: "Android Gradle 学习笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [android, androiddev, gradle, build-system,]
last_updated:
---

Gradle 是 Android 新的编译环境。随着 Android Studio 的发布，编译 Android 的环境逐渐转移到了 Gradle。

> an advanced build toolkit, to automate and manage the build process, while allowing you to define flexible custom build configurations

根据 [Android 官网](https://developer.android.com/studio/build/index.html) 的介绍，Gradle 是一个进阶的编译工具包，能够自动管理编译过程，并且允许用户配置编译过程。并且在后序的学习中可以通过大量的配置来对 Android 进行多渠道打包，自动打包持续集成。

Gradle 和它响应的 Android 插件可以独立于 Android Studio 运行，这也就意味着开发者可以在 Android Studio 内部编译生成应用，也可以通过[命令行来打包 APK](https://developer.android.com/studio/build/building-cmdline.html)。

对于新建的 Android 工程，一般会产生多个 gradle 文件，下面依次介绍。

## 根目录下 build.gradle

Android 项目最顶层，在项目根目录下的 `build.gradle` 如下：

    buildscript {
       repositories {
           jcenter()
       }
       dependencies {
           classpath 'com.android.tools.build:gradle:1.0.0'
       }
    }
    apply plugin: 'android'
    allprojects {
       repositories {
          jcenter()
       }
    }

各个字段含义：

- buildscript ：用于设置驱动构建过程的代码。
- jcenter()：声明使用 maven 仓库。在老版本中，此处为 mavenCentral()，远端仓库地址。

    - mavenCentral() ：表示依赖从 Central Maven 2 仓库中获取。
    - jcenter() ：表示依赖从 Bintary's JCenter Maven 仓库中获取。
    - mavenLocal() ：表示依赖从本地的 Maven 仓库中获取。

- dependencies ：声明了使用 Android Studio gradle 插件版本。一般升级 Android Studio 或者导入从 Eclipse 中生成的项目时需要修改下面 gradle 版本。具体的版本对应关系，请[点击](http://tools.android.com/tech-docs/new-build-system/version-compatibility)。
- allprojects：设置每一个 module 的构建过程。在此例中，设置了每一个 module 使用 maven 仓库依赖。

## settings.gradle

项目根目录下的 `settings.gradle` 中配置当前项目的 module

默认为：

    include ':app'

如果 module 不在 project 根目录下，可以设置：

    include ':app2'

    project(':app2').projectDir = new File('path/to/app2')

如果有多个 module ，可以依次在 include 后加入，比如 `include ':app', ':module1', ':module2'`  这样。

## (module)/build.gradle

在 module 下的 build.gradle 默认内容：

    apply plugin: 'com.android.application'
    android {

        compileSdkVersion 21
        buildToolsVersion "21.1.2"
        defaultConfig {
            applicationId "cc.bb.aa.myapplication"
            minSdkVersion 10
            targetSdkVersion 21
            versionCode 1
            versionName "1.0"
        }
        buildTypes {
            release {
                minifyEnabled true
                proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            }
        }
    }
    dependencies {
        compile fileTree(dir: 'libs', include: ['*.jar'])
        compile 'com.android.support:appcompat-v7:21.0.3'
    }

- apply plugin: 'com.android.application'：
表示使用 com.android.application 插件。也就是表示，这是一个 android application module 。
注：如果 Module 本身是一个依赖库，那么此时的 apply plugin 为 'com.android.library'
相应的，若是一个 Java project，apply plugin 为 'java'。对于库项目，与普通项目仅仅是 app plugin 不同，其他完全相同。

- android：
配置所有 Android 构建过程需要的参数。

- defaultConfig：
Android 项目默认设置。

- buildTypes:
编译类型。默认有两个： release 和 debug 。我们可以在此处添加自己的 buildTypes ，可在 Build Variants 面板看到。Android 项目规定必须至少定义一个 buildTypes。

- minifyEnabled：
是否使用混淆。在老版本中为 runProguard ，新版本之所换名称，是因为新版本支持去掉没使用到的资源文件，而 runProguard 这个名称已不合适了。

- proguardFiles：
使用的混淆文件，可以使用多个混淆文件。此例中，使用了 SDK 中的 proguard-android.txt 文件以及当前 module 目录下的 proguard-rules.pro 文件。更多关于代码混淆的以及 ProGuard 的内容可以参看我的另外一篇文章。

- dependencies：
用于配制引用的依赖。

- compile fileTree(dir: 'libs', include: ['*.jar'])  ：
引用当前 module 目录下的 libs 文件夹中的所有 .jar 文件。

- compile 'com.android.support:appcompat-v7:21.0.3'：
引用 21.0.3 版本的 appcompat-v7 （也就是常用的 v7 library 项目）。

在 Eclipse 中，使用 android support ，需要在 SDK 中下载 Android Support Library 。在 Android Studio 中，使用 android support ，需要在 SDK 中下载 Android Support Repository ，且项目中使用的版本不能大于 SDK 中的版本。


### buildTypes

默认情况，Android Studio 会给项目设置 debug 和 release 两个 buildTypes，当然开发者也可以定义自己的 buildTypes。

buildTypes 在 Gradle 中有如下作用：

#### 动态增加或修改 ApplicationId

可以使用 buildTypes 来给 application id 增加后缀，比如

    buildTypes {
        release {
            debuggable false
        }
        development {
            debuggable true
            applicationIdSuffix ".dev"
        }
        testing {
            debuggable true
            applicationIdSuffix ".qa"
        }
    }

最后得到的 applicationId 会是这样：

- `com.package.android` for release
- `com.package.android.dev` for development
- `com.package.android.qa` for testing

#### Signing Configuration 打包签名

如果想要使用 Gradle 来自动签名打包，可以使用这样的配置，避免在版本控制中提交密码。

在 `~/.gradle/gradle.properties` 中配置：

    RELEASE_STORE_FILE={path to your keystore}
    RELEASE_STORE_PASSWORD=*****
    RELEASE_KEY_ALIAS=*****
    RELEASE_KEY_PASSWORD=*****

并修改 `build.gradle` 文件：


    android {
    ...
    signingConfigs {

       release {
           storeFile file(RELEASE_STORE_FILE)
           storePassword RELEASE_STORE_PASSWORD
           keyAlias RELEASE_KEY_ALIAS
           keyPassword RELEASE_KEY_PASSWORD
       }
    }

    buildTypes {
            release {
                signingConfig signingConfigs.release
            }
    }
    ....
    }

之后就可以使用命令或者 Gradle 面板中的 `gradle assembleRelease` 来生成签名的 apk 文件

#### 混淆
关于 ProGuard 的内容可以参考[这篇文章](/post/2016/11/android-proguard.html)

    buildTypes {
        debug {
            minifyEnabled false
            proguardFile('proguard.cfg')
        }
        release {
            minifyEnabled true
            proguardFile('proguard.cfg')
        }
    }


#### 其他基本配置

以下是一些 buildTypes 的基本配置，举例：

    release {
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.txt'
        signingConfig  signingConfigs.myConfig
        debuggable false
        jniDebuggable false
        versionNameSuffix ".suffix"
        zipAlignEnabled true
        pseudoLocalesEnabled true
        renderscriptDebuggable true
    }

buildTypes 支持的配置：

配置名称   |    作用 |
-------------|---------------|
minifyEnabled   |  是否开启 Minify ，包括混淆和压缩代码 |
debuggable | 是否编译出可调试的 apk |
applicationIdSuffix     |  添加 application id 后缀  |
proguardFiles    |   添加 ProGuard 配置文件  |
jniDebuggable    |    Whether this build type is configured to generate an APK with debuggable native code.    |
renderscriptDebuggable   |  Whether the build type is configured to generate an apk with debuggable RenderScript code.   |
renderscriptOptimLevel    |   Optimization level to use by the renderscript compiler  |
versionNameSuffix    |   Version name suffix.   |
zipAlignEnabled   |    Whether zipalign is enabled for this build type.  |
testCoverageEnabled   |   Whether test coverage is enabled for this build type.
pseudoLocalesEnabled  |   Whether to generate pseudo locale in the APK.  |
embedMicroApp  |   Whether a linked Android Wear app should be embedded in variant using this build type.  |


### 外部依赖 compile

引用一个外部依赖需要使用 group, name 和 version 属性。根据你想要使用的库，group 和 version 可能会有所差别。

有一种简写形式，只使用一串字符串 `"group:name:version"` .

在 build.gradle 中，如下方式引入依赖：


```
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.android.support:appcompat-v7:22.2.1'
    compile files('libs/liba-3.4.5.jar')
    compile project(':libraryName')
}
```

代码解析：

- `compile fileTree(dir: 'libs', include: '*.jar')` ，可以将 libs 目录下所有 jar 文件进行编译打包。也可以使用 `compile fileTree(dir: 'libs', include: ['*.jar'], exclude: ['xx.jar'])` 中 exclude 这样的语法来排除某些指定的 jar
- 默认从远端 repository 中下载依赖并编译打包
- 第二个是从本地 libs 目录下寻找 jar 文件，并进行编译打包
- 将本地另一个 module 进行编译打包，被引用的 module 需要在 projectName/settings.gradle 中注册。

compile file、compile project、compile fileTree 都可以看成是 compile 的子命令，


    dependencies {
        provided files('libs/libb.jar')
        provided 'com.squareup.dagger:dagger-compiler:1.2.1'
        // 在测试环境下引用依赖。
        // 引用 jar 文件。
        androidTestCompile files('libs/xx.jar')
        // 引用 Maven。
        androidTestCompile 'junit:junit:4.11'

        // 在 release buildTypes 分支下引用依赖。
        // 引用 jar 文件。
        releaseCompile files('libs/xx.jar')
        // 引用 Maven。
        releaseCompile 'aaa:bbb:x.x.x'
    }

如果使用的是 `provided` 则表示该依赖只在编译时使用，不在最后打包时使用。

### Product Flavors
Product Flavors 用来管理不同的 release 版本，比如免费版和收费版。可以通过自定义 product flavors 来使用为不同的发行版设置不同的资源文件和代码，同时共享相同部分的资源和代码。 Product Flavor 设置是可选的，具体步骤可参考[官网](https://developer.android.com/studio/build/build-variants.html#product-flavors)。


## reference

- 最全的官方文档 <http://tools.android.com/tech-docs/new-build-system/user-guide>
- <https://www.gitbook.com/book/dongchuan/gradle-user-guide->
- <http://blog.csdn.net/dawnranger/article/details/43113137>
- <http://stackoverflow.com/questions/18328730/how-to-create-a-release-signed-apk-file-using-gradle>

---
layout: post
title: "Gradle 重复导入错误"
tagline: ""
description: ""
category: Android
tags: [android, androiddev, gradle, google]
last_updated:
---

记录一下纠结了两天的问题。

## 问题
项目中遇到如下错误：

```
Error:Execution failed for task ':mobile:packageAllDebugClassesForMultiDex'.
> java.util.zip.ZipException: duplicate entry:android/support/annotation/AnyRes.class
```

这个问题是因为项目中引入了 `support-annotations` 包，但是导入的其他 jar 包中包含了这个 package，重复导致了 `duplicate entry` 错误。
在 app 的 `build.gradle` 中加入：

```
android{
    ...
    configurations {
        all*.exclude group: 'com.android.support', module: 'support-annotations'
    }
}
```

## 总结
项目中尽量只导入一个库，在引用其他库时注意查看该库的依赖版本，在导入 support v4 包或者其他 v7 包时尽量考虑只在主项目中导入一次，在任何 library 中减少使用。
这个问题的由来，应该也是项目历史原因，在我接手时，项目 `build.gradle` 中 buildTypes 是这样的：

```
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-project.txt'
    }
    debug {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-project.txt'
    }
}
```

这里竟然 debug 和 release 使用了同样的 minifyEnabled 配置，默认情况下 minifyEnabled 应该是 false，设置成 true 之后，debug 下无法调试，无法设置断点。查看 git 历史这个问题竟然从项目初始就这样，真无法想象他们是怎么调试的。然后将 minifyEnabled 设置成 false 之后就产生了 multiDex 错误，然后是上面的错误。
buildTypes 下 `minifyEnabled` 选项， 设置为 true 情况下， debug 无法设置断点及调试 [^2], 但是这个选线在 release 下非常有用，可以减少包的大小，缩减无用代码（shrink unless codes）。


修改后的配置：

```
buildTypes {
   release {
       minifyEnabled true
       proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-project.txt'
   }
   debug {
       minifyEnabled false
       debuggable true
   }
}
```

multiDex 的错误倒是还好解决 [^1]，设置：

```
android {
    compileSdkVersion 22
    buildToolsVersion "23.0.0"

         defaultConfig {
             minSdkVersion 14 //lower than 14 doesn't support multidex
             targetSdkVersion 22

             // Enabling multidex support.
             multiDexEnabled true
         }
}

dependencies {
    compile 'com.android.support:multidex:1.0.1'
}
```

然后在 Application 类中设置：

```
public class YouApplication extends Application {

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

}
```

正是这个错误促使我看了 Gradle 中依赖的语法，总结如下：

## Dependencies, Android Libraries and Multi-project setup
Gradle 项目可能依赖其他组件，包括外部的二进制文件，或者另一个 Gradle 项目。

### 本地依赖
下面代码可以添加本地 `libs` 目录下所有 jar 包：

```
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
}


android {
    ...
}
```


如果想要配置本地 jar 包，可以依照下面顺序：


- 将 jar 包放入 libs 目录
- 右击 jar 包，选择 “Add as library”
- 确认 `compile files('libs/xxx.jar')` 在 `build.gradle` 文件中，或者 `compile fileTree(dir: 'libs', include: '*.jar')`
- rebuild


### 远程依赖
Gradle 支持从远端 Maven 或者 Ivy repositories 自动拉取依赖。首先远端 repository 需要加入列表，其次需要定义具体依赖。

```
repositories {
     jcenter()
}


dependencies {
    compile 'com.google.guava:guava:18.0'
}


android {
    ...
}
```

Note:
- `jcenter()` 是远端库的 URL 缩写， Gradle 支持本地和远程库。
- Gradle 如果发现依赖需要使用其他依赖会自动 pull 其他依赖。


### 多项目配置
通常用子目录来配置 libraries ，例如
```
MyProject/
 + app/
 + libraries/
    + lib1/
    + lib2/
```


三个项目， Gradle 通过如下指定：


```
:app
:libraries:lib1
:libraries:lib2
```
每一个项目都有自己的 `build.gradle` 文件，另外在跟目录下有 `settings.gradle` 来描述工程：

```
MyProject/
 | settings.gradle
 + app/
    | build.gradle
 + libraries/
    + lib1/
       | build.gradle
    + lib2/
       | build.gradle
```


`settings.gradle` 中的描述：


```
include ':app', ':libraries:lib1', ':libraries:lib2'
```


然后在 `:app` 项目中定义，依赖 library ：


```
dependencies {
    compile project(':libraries:lib1')
}
```


### 排除导入的包

可以使用如下的语法排除 v4 包：

```
compile ('com.android.support:recyclerview-v7:+') {
    exclude module: 'support-v4'
}
```

同样也可以在：

```
android{
    configurations {
        'com.android.support', module: 'support-v4'
    }
}
```

下排除。

更加系统的学习 Android Gradle build system 可以参考官方文档，或者中文译本 [^3]。

关于 `build.gradle` 文件中的字段属性，可以参考 [Android Plugin DSL Reference](http://google.github.io/android-gradle-dsl/current/).

## referencee

[^1]: [StackOverflow](http://stackoverflow.com/questions/26609734/how-to-enable-multidexing-with-the-new-android-multidex-support-library) 和 [官网](https://developer.android.com/studio/build/multidex.html)
[^2]: http://stackoverflow.com/questions/31926189/android-debugging-with-minifyenabled-true
[^3]: [Gradle for Android](https://chaosleong.gitbooks.io/gradle-for-android/)

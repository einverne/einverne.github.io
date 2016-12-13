---
layout: post
title: "Android ProGuard"
tagline: ""
description: ""
category: 学习笔记
tags: [Android, Java, AndroidDev,]
last_updated: 
---

根据[官网](http://proguard.sourceforge.net/)的注解：

> ProGuard is a free Java class file shrinker, optimizer, obfuscator, and preverifier.

原文非常简洁，翻译过来也很容易明白，ProGuard 能对 Java 字节码文件进行压缩、优化、混淆和预验证。ProGuard 几个典型的用法就是：1. 缩减应用的大小；2. 移动设备优化代码； 3. 防止恶意反编译或者篡改程序。

ProGuard 相较于其他 Java 混淆器优势的地方在于

- compact template-based configuration
- fast
- command-line tool with an optional graphical user interface

ProGuard 可以删除 Java 代码中无用的类、字段、方法和属性，并混淆代码 ，从而减小 APK 的大小,打包 apk 上线时，代码是一定要混淆的，有些情况下，部分代码是不能混淆的，否则就会导致程序功能不能正常运行

## 配置 ProGuard

ProGuard 四大功能的工作顺序是压缩->优化—>混淆—>预验证。

压缩：检测和删除项目中没有使用的类、字段、方法和属性。如果存在两个类互相调用，但项目实际上并没有使用到这两个类，这两个类也会被删除。

优化：优化代码的复杂调用，使代码运行顺序更为合理。

混淆：依据用户的配置，将代码的包名、类名、方法名和变量名等改成 a,b,c 等无意义的名称。Java 源代码编译后产生二进制 class 文件，这个 class 文件可以反编译成 Java 代码。反编译后生成的 Java 代码除了原来的注释外，其他代码比如变量名、类名和方法名等基本都能看到，和 Java 源代码几乎没有区别。为了防止项目代码被泄露，我们需要把项目代码中的包、类、方法和变量名等 Java 元素的名称改成无意义的名称。这个过程就是混淆。混淆之后的代码只是在一些名称上有修改，对代码的结构没有影响，所以混淆后的代码依然可以运行。项目经混淆后并不是说代码就不能被反编译了，只是反编译混淆后的项目后看到的代码将不是源码，变量名变得不再能一眼看懂其意思，此时想弄懂原有的项目代码架构很难。在混淆的过程中，不影响正常工作的信息将永久删除，使得反编译之后的代码变得更加难以理解。

预验证：在 Java 平台对处理后的代码进行预检，保证代码能够正常运行。这一步在 Android 项目中不需要。

Android Studio 已经集成了 ProGuard 工具。对 Android 项目进行混淆时，我们只需修改一些配置即可。
随便打开一个 Android 项目，在 app 目录下的 build.grade 文件中可以看到如下代码

    buildTypes {
        debug {
            minifyEnabled false
        }
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-project.txt'
        }
    }

以上述代码为例，minifyEnabled 置为 true 表示在 release 环境下启用 ProGuard 工具。在打包程序时，这一项必须置为 true, 否则 release 打出的包将没有压缩、优化、混淆。

proguardFiles 命令后面的两个文件是 ProGuard 的配置文件，启用 ProGuard 后， ProGuard 对项目的处理将遵循这两个文件的配置。`proguard-android.txt` 是 Android Studio 集成 ProGuard 工具时自带的 ProGuard 配置文件，该文件在 Android SDK `tools/proguard/` 目录下，`proguard-rules.pro` 是开发项目时由程序员添加的配置文件。

官网建议，为了更好地压缩代码，Android 还在SDK同目录中提供了 `proguard-android-optimize.txt` 文件，它包含了相同的规则，但是提供了额外针对 bytecode 的分析优化。而与此同时 `proguard-android.txt` 是不提供代码优化的。

`proguard-rules.pro` 文件可以在当前 Android 项目 app 目录下找到。初始时此文件是空白的，开发者可以在这个文件中添加自己项目的 ProGuard 配置，不要也不能在 `proguard-android.txt` 和 `proguard-android-optimize.txt` 中添加自定义规则。proguardFiles 后面可以加入多个文件名，意味着 ProGuard 工作会遵循多个文件的配置。

当在项目中配置了 minifyEnabled 为 true 时，如果不配置 ProGuard 文件，ProGuard 会混淆所有代码。而有些情况下，有些代码是不能混淆的，否则就会导致程序出错。常用的不能混淆的代码如下： 

1. 使用反射的地方
1. JNI 方法
1. 系统接口（Framework 层下所有的类），Manifest 中声明的所有类，四大组件，Application 子类不混淆
1. xml 中声明的所有资源名
1. 使用第三方开源库或者引用其他第三方的SDK包时，需要在混淆文件中加入对应的混淆规则
1. Parcelable的子类和Creator静态成员变量不混淆，否则会产生 Android.os.BadParcelableException 异常
1. 使用GSON、fastjson等框架时，所写的JSON对象类不混淆，否则无法将JSON解析成对应的对象
1. 有用到WebView 的 JS 调用也需要保证写的接口方法不混淆

Android Studio 启用 ProGuard 工具后，会默认不混淆系统接口、Manifest 中声明的所有类和 xml 中声明的所有资源名，因此这些情况下不需要手动配置 ProGuard 文件。而其他情况下不应该混淆的代码就需要对 ProGuard 文件进行配置。

## 常用的 ProGuard 配置语法
从给定的文件中读取配置参数

    -include {filename}

保护给定的可选属性，例如 Exceptions,InnerClasses,Signature,Deprecated,SourceFile,LineNumberTable,*Annotation*,EnclosingMethod

    -keepattributes Exceptions,InnerClasses,Signature,Deprecated,
                SourceFile,LineNumberTable,*Annotation*,EnclosingMethod

例如，在代码中使用了反射，加入以下混淆规则：

	-keepattributes Signature,EnclosingMethod

保护指定的类文件和类的成员（类中的方法和成员变量都是类的成员，下同）

    -keep {Modifier} {class_specification}

例如，保护指定包下面的类：

	-keep class info.einverne.jsonobject.** { *; }  // 不混淆 info.einverne.jsonobject 包下面类和所有类成员变量
    -keep class info.einverne.jsonobject.personinfo        // 不混淆具体类

保护指定类的成员

    -keepclassmembers {modifier} {class_specification}

例如，保护继承了 Serializable 接口的类：

    -keepclassmembers class * implements java.io.Serializable {
        static final long serialVersionUID;
        private static final java.io.ObjectStreamField[] serialPersistentFields;
        private void writeObject(java.io.ObjectOutputStream);
        private void readObject(java.io.ObjectInputStream);
        java.lang.Object writeReplace();
        java.lang.Object readResolve();
    }

或者,不混淆 enum 类:

    -keepclassmembers enum * {
        public static **[] values();
        public static ** valueOf(Java.lang.String);
    }

保护指定的类和类的成员，但条件是所有指定的类和类成员是要存在。

	-keepclasseswithmembers {class\_specification}

例如，不混淆 native 方法：

      -keepclasseswithmembernames class * {
          native <methods>;
      }

如果不在压缩步骤中删除，则保护指定的类和类的成员的名称

	-keepnames {class\_specification}

如果不在压缩步骤中删除，保护指定的类的成员的名称

    -keepclassmembernames {class\_specification}

如果不在压缩步骤中删除，保护指定的类和类的成员的名称

    -keepclasseswithmembernames {class\_specification}

忽略警告，避免打包时某些警告出现

    -ignorewarnings

是否使用大小写混合

    -dontusemixedcaseclassnames

其他选项

	-dontshrink    不压缩（不配的话默认是使用 ProGuard 的压缩功能）
    -dontoptimize    不优化（不配的话默认是使用 ProGuard 的优化功能）
    -dontobfuscate    不混淆（不配的话默认是使用 ProGuard 的混淆功能），需要注意 release 版本不要启用此选线
    -dontusemixedcaseclassnames    混淆时不会产生形形色色的类名


ProGuard 配置通配符

    ？ 匹配除包分隔符外的任意单个字符
    *  匹配除包分隔符外的所有符号
    ** 匹配多个字符(任意)
    %  匹配所有基本类型(不包含 void)
    ***  匹配任何类型
    !  不匹配
    <init>   匹配所有构造函数
    <fields>  匹配所有字段
    <methods> 匹配所有方法


## reference

- <https://developer.android.com/studio/build/shrink-code.html>
- 完整的命令配置指南 <http://proguard.sourceforge.net/index.html#manual/usage.html>
- <https://github.com/D-clock/Doc/blob/master/Android/Gradle/3_ProGuard%E5%9F%BA%E7%A1%80%E8%AF%AD%E6%B3%95%E5%92%8C%E6%89%93%E5%8C%85%E9%85%8D%E7%BD%AE.md>































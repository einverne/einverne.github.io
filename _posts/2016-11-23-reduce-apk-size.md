---
layout: post
title: "Android 减小 APK 大小"
tagline: ""
description: "缩减 Android APK 文件大小"
category: 学习笔记
tags: [Android, AndroidDev, TinyPNG,]
last_updated: 
---


## 了解 APK 结构

通常一个 APK 包括以下目录：

- META-INF/  包括 CERT.SF 和 CERT.RSA 证书文件， MANIFEST.MF
- assets/ 包含 App 的资源文件，可以通过  AssetManager 获取
- res/ 包括App 图片等等资源文件，不会被编译进 resources.arsc
- lib/ 包括编译的库文件，该目录包括一系列为不同平台打包的子目录，比如 armeabi, armeabi-v7a, arm64-v8a, x86, x86\_64, 和 mips

APK 还包括以下文件，AndroidManifest.xml 是强制必须的：

- resources.arsc 包括编译过的资源文件。这个文件包含了 /res/values/ 目录下定义好的所有的 XML 内容。Packaging Tool 提取 XML 内容，并压缩到二进制。该文件包含了不同语言的字符串，样式，还有不包含在 resources.arsc 文件中的资源路径，比如 layout 文件和图片。
- class.dex 包含编译过后的代码文件，可以被 Dalvik/ART 识别。如果开发者使用 **multidex** 来避免 [the 65536 method limit](http://developer.android.com/tools/building/multidex.html#about)  那么包中可能存在多个 Dex 文件。
- AndroidManifest.xml 包含 Android 的 manifest 文件。该文件包含了应用的名字，版本，权限申请和引用的库文件。



在谈到具体缩减APK大小步骤之前，可以使用 Android Studio 内置的 APK 分析工具来分析现有 APK 内容文件。入口位置在：Build -> Analyze Apk ，然后选择APK即可，然后会显示：

![apk size](https://lh4.googleusercontent.com/-Rvz8aL-ciRk/WDUKm27OVNI/AAAAAAABGgE/ejEoH5GFKM0OlgPbNFm9566biwgyvdMDwCL0B/w521-h240-no/%25E5%25B1%258F%25E5%25B9%2595%25E6%2588%25AA%25E5%259B%25BE%2B2016-11-18%2B11.55.03.png)

## 减少APK大小

APK 文件的大小影响着应用的加载，内存的使用，消耗多少电力。减小 APK 大小的最简单的方法就是减少资源文件数量和大小。比如，可以移除程序内不再使用的资源图片，或者可以使用可变大小的 [Drawable](https://developer.android.com/reference/android/graphics/drawable/Drawable.html) 来代替现有的图片文件。下面是一些常用做法。

### ProGuard

使用 ProGuard 来缩减代码大小，ProGuard 还有其他一些优化，混淆等等的功能，可以参考 [sourceforge](http://proguard.sourceforge.net/) 或者参考之前整理的[文章](/post/2016/11/android-gradle.html)。具体优化配置如下：

1. 在 buildTypes 下开启 minifyEnabled 和 shrinkResources

        buildTypes {
            debug {
                minifyEnabled false
            }
            release {
                minifyEnabled true
                shrinkResources true
                proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-project.txt'
            }
        }

    在开启 shrinkResources 之后效果还是挺明显，经过我的尝试，30M的App，能够缩减1M~3M大小，而只需要增加一行代码，何乐不为。而在平时开发中，如果遇到删减代码的时候，最好将资源文件一同删去，免去在打包时无用文件占用资源。

	具体参照 <https://developer.android.com/studio/build/shrink-code.html>

2. 关闭 png cruncher 在下面 PNG 手动压缩之后，关闭该压缩选项

        aaptOptions {
            cruncherEnabled = false
        }

### 移除无用资源文件

可以使用上面提到的 `shrinkResources` 来在发布 release 版本时让 Gradle 自动剔除没有使用的资源文件，也可以通过 [android-resource-remover](https://github.com/KeepSafe/android-resource-remover) 这个脚本来移除无用资源文件，这个脚本基于 [Android Lint](http://developer.android.com/tools/help/lint.html) 工具 。通过 Gradle 在打包时并没有从本地磁盘上删去文件，而使用后一种方法可以从根本上删除无用文件。

在 Android Studio 2.0 以后，使用菜单中 Refactor -> Remove Unused Resources .. 可以用来在项目中移除不在引用的资源。实际操作感觉 Android Studio 会列出不正确的无用资源，在使用时需要特别注意。对于不再需要的图片一定要及时删除，例如因功能更新老的图片不再使用等情形。

在 build.gradle 中定义

    android {
        defaultConfig {
            ...
            resConfigs "en", "fr"
        }
    }

可以只打包指定语言的资源文件。


### 缩减 PNG 图片大小

而缩减 PNG 图片大小的方法又可以细分为以下几类：

- 通过代码来实现图片，对于图片资源，能不用图片就不用图片，如果图片的效果可以通过代码来实现，例如用画布来画等方式，这样可以极大限度的降低因为图片的使用而造成的 APK 尺寸增大。能用矢量图就用矢量图，只支持 Android 4.1 以上的程序，
- 尽量多使用 WebP 格式，能用 JPEG 图片的就用 JPEG 图片

	- JPEG 图片使用了量化编码压缩的方式，可以极大程度减少图片的尺寸，但它有如下缺点：JPEG 图片无法支持 alpha 通道，如果需要透明效果就无法使用了；不同的压缩比（量化参数）会导致图片的质量非常不同，对于内容丰富、纹理较多的图片，由于分块压缩会导致 JPEG 压缩之后图片出现一些斑块
    - 对于 WebP 格式图片来说目前还有一些值得注意：1. Web 文件格式只支持 4+ 以上 Android 设备 2. WebP 文件相较于 PNG 图片需要消耗更多的系统额外时间去 decode 图片。并且 Google Play 只支持包含 PNG 格式图标的 APK，如果需要使用 Google Play 来发布应用，则不要使用 WebP 来制作应用图标。

- 在不影响效果的前提下可以尽量压缩图片资源，图片一定不要放到非 drawable 目录下，除非你有足够的理由，不放在 drawable 下的图片没有 png crunch
- 减少帧动画中图片帧，帧动画会明显的增加包大小，一般在 App 中使用一张 PNG 来表示动画的一帧。如果动画只有 15 FPS，那么在设计导出图片时尽量减少图片的数量，而不是使用30张图片来做15帧的动画，比如在程序中有个动画是用了60帧，后来使用bash，删去一般图片，并调整代码，而效果几乎看不出区别。

        for((a=1;a<62;a=a+2))
        do
          rm "filename"$a".png"
        done

- 还有方法就是使用 [VectorDrawable](https://developer.android.com/reference/android/graphics/drawable/VectorDrawable.html) 更多的内容可以参考官方文档。
- 尽量压缩 PNG 图片，可以使用如下的压缩工具

基本原理就是讲 24-bit 的图片压缩到 8-bit ，对于程序中小 icon 或者 低分辨率的图片几乎无法看出区别。

> When you upload a PNG (Portable Network Graphics) file, similar colours in your image are combined. This technique is called “quantisation”. Because the number of colours is reduced,24-bit PNG files can be converted to much smaller 8-bit indexed colour images. All unnecessary metadata is stripped too. The result: tiny 8-bit PNG files with 100% support for transparency. Have your cake and eat it too!
> It turns 24-bit RGB files into palettized 8-bit ones. You lose some color depth, but for small images it's often imperceptible.


网上有很多压缩工具，比如 [tinypng](https://tinypng.com/) ，[pngquant](http://pngquant.org/) ，[Pngcrush](http://pmt.sourceforge.net/pngcrush/) ，[OptiPNG](http://optipng.sourceforge.net/) ，[zopflipng](https://github.com/google/zopfli) from Google 。下面分别简单介绍下。

- TinyPNG uses smart lossy compression techniques to reduce the file size of your PNG files. By selectively decreasing the number of colors in the image, fewer bytes are required to store the data. The effect is nearly invisible but it makes a very large difference in file size!
- pngquant is a command-line utility and a library for lossy compression of PNG images.
- Pngcrush  Pngcrush is an optimizer for PNG (Portable Network Graphics) files. It can be run from a commandline in an MSDOS window, or from a UNIX or LINUX commandline.
- OptiPNG  OptiPNG is a PNG optimizer that recompresses image files to a smaller size, without losing any information. This program also converts external formats (BMP, GIF, PNM and TIFF) to optimized PNG, and performs PNG integrity checks and corrections.
- Zopfli Compression Algorithm is a compression library programmed in C to perform very good, but slow, deflate or zlib compression.


对于 tinypng 网上有人编写了[脚本](https://github.com/websperts/tinypng-cli) 在他们的[开发者网站上](https://tinypng.com/developers)  申请 API key 就能够使用，不过免费的版本每个月只能压缩 500 张图片，对于小程序可能已经足够使用了，但是对于稍微大一些的 App，可能需要付费或者用其他的 API key。

对于 JPG 的图片可以使用 [Paint.NET](http://www.getpaint.net/index.html) 或者 官方建议的 [packJPG](http://www.elektronik.htw-aalen.de/packjpg/)

[部分内容摘自 StackOverflow](http://stackoverflow.com/a/12146901/1820217)

### 避免重复

可以从以下方面避免程序使用重复内容：

- 不要包含重复代码
- 不要包含重复 assets，strings， bitmap 等等
- 使用 [Drawable](https://developer.android.com/reference/android/graphics/drawable/Drawable.html) 对象来重复使用图片资源文件，比如需要一个向左，一个向右的箭头，则可以使用同一张资源图片，而定义 Drawable 来在运行时构建图片

避免资源重复是最显而易见可以减少APK大小的方法，而如果产生了重复代码，则一定要考虑是否代码抽象不够，重复的内容是否能够抽象出单独的方法，然后重构产生重复的地方。


### 广泛地使用 Lint 工具

ProGuard 可以对 Java 进行优化，但是对于 Android 资源文件无能为力。因此，如果图片在 res/drawable 下， Proguard 可以从 R class 中移除引用，但是图片文件依然还在原地方。

Lint 是一个静态代码分析工具，帮助检测无用资源文件。使用命令 `./gradlew` 来生成 Lint 报告，在 `UnusedResources: Unused resources`  section 下就能查到所有没有被引用的资源文件。

Lint 工具分析 resources 比如 /res 下的文件，但是会跳过 assets 目录下的文件。事实上， assets 文件可以通过他们的名字而不是 Java 或者 XML 引用来在代码中使用，所以 Lint 工具不能决定 asset 目录下的文件是否被引用。所以在 assets 目录下的文件则需要开发者自己维护，保持干净和整洁。

在 Android Studio 中配置 Android Lint ，使用 Lint 工具检测在菜单 Analyze -> Inspect Code... ，点击之后等待分析完成即可查看分析报告。配置 Lint 工具检查内容可以在 Android Studio –> Preferences –> Editor –> Inspections (currently on Android Studio) 下配置。比如想要关闭 “Image without contentDescription” 检查，可以直接搜索并且关闭即可。

### 缩减 resource.arsc 文件大小

之前说过 resource.arsc 文件包含了 res/value/ 目录下定义的资源，还有 layout 和 string 等资源的路径。因此随着 App 的不断更新，该文件会越来越大。

资源混淆压缩以及 resource.arsc 文件，工具可以使用 andresguard <https://github.com/shwenzhang/AndResGuard/blob/master/README.zh-cn.md> ，但因为风险较大，目前并没有集成。

通过混淆资源，将 `r/drawable/login_background.png` 混淆为 `r/d/a.png`  这样就可以减少 resource.arsc 文件的大小极限压缩 jpg、png、resource.arsc 等文件，采用 7z 来对这类文件进行进一步的压缩，极大的降低包尺寸使用 andresguard 时清楚自己 app 哪些是不能混淆的，例如 `facebook_id`、`crashlytics key` 这些对应的 string 就不能混淆了，必须加入白名单；利用 getIdentifier 来获取的资源也必须加入白名单



### asset 等资源

- 音频文件：尽可能可以使用 AAC，mp3 等压缩格式，如果 midi 格式可以就用 midi 格式的，不要使用 wav 等无损格式
- 视频文件：尽可能使用 H264 AVC 文件格式
- JSON、数据库类的配置文件：要想办法节制，可以考虑放置一部分基础配置，其它从网络下载，做好“大而全”和“小而做出一些效果上的折中”两种决定间的权衡与选择
- 字体：尽可能控制程序中使用的字体、字形数目，确定需要额外引入字体的，如果显示的字符数目有限（比如只有数字或只有英文字母），使用 fontforge 等工具对字体进行裁剪后再放入程序，具体剪裁方法参考 <http://wiki.unity3d.com/index.php?title=Create_a_new_TrueType_font_using_a_subset_of_characters_from_an_existing_TrueType_font>

> Images: PNG or JPEG. Use PNGs; since it is a lossless format it is very suitable for textures and artwork as there will be no visual artefacts from the compression. If there are space constraints, use JPEGs or a combination of PNGs and JPEGs. A high quality JPEG image may work fine for large photo-realistic images, which the JPEG compression scheme is optimised for.

> Audio: AAC Audio is recommended for all audio resources. AAC achieves better compression at a given quality, compared to mp3 or Ogg Vorbis. Raw formats such as WAV should never be used. The common rational for using the WAV format is that decoding compressed audio streams usually means high latency at playback. However, Android provides the Sound Pool API which enables applications to use compressed audio streams without the penalty of high latency.

> Video: Use H264 AVC. Encode the video to a resolution no larger than the screen resolution of the target device (if known).

#### 使用 FFmpeg 缩减音频
AAC-LC is the default for all of the AAC encoders supported by ffmpeg.

可以使用如下 ffmpeg 转码:

    ffmpeg -i input.wav -codec:a aac output.aac


#### 使用 FFmpeg 缩减视频大小

Calculate the bitrate you need by dividing 1 GB by the video length in seconds. So, for a video of length 16:40 (1000 seconds), use a bitrate of 1000000 bytes/sec:

    ffmpeg -i input.mp4 -b 1000000 output.mp4

Additional options that might be worth considering is setting the Constant Rate Factor, which lowers the average bit rate, but retains better quality. Vary the CRF between around 18 and 24 — the lower, the higher the bitrate.

	ffmpeg -i input.mp4 -vcodec libx264 -crf 20 output.mp4


摘自[StackOverflow](http://unix.stackexchange.com/a/38380/115007)

### 缩减 Dex 文件大小

决定 dex 文件尺寸主要有两个方面（归根结底都是代码文件）

依赖的库文件，包括 gradle 依赖、引用的 jar 包、aar 包等自己的代码

针对 Google Play Service，在依赖时尽量分开，使用到某一部分时尽量只依赖使用到的部分，而不是把整个库都pull 下来。比如在项目中只需要使用到 GCM，和 Ads，那么在申明依赖时只引用两个即可。各个部分的依赖在[developers.google.com](https://developers.google.com/android/guides/setup) 上可以查到。

    compile 'com.google.android.gms:play-services-gcm:8.4.0'
    compile 'com.google.android.gms:play-services-ads:8.4.0'


## 总结

在总结完以上方法之后，我才发现这一系列文章，这系列的文章非常值得一看，几乎完全覆盖了上面提到的方法。

- [#SmallerAPK, Part 1: Anatomy of an APK](https://medium.com/google-developers/smallerapk-part-1-anatomy-of-an-apk-da83c25e7003)
- [#SmallerAPK, Part 2: Minifying code](https://medium.com/google-developers/smallerapk-part-2-minifying-code-554560d2ed40#.9cz5bx1va)
- [#SmallerAPK, Part 3: Removing unused resources](https://medium.com/google-developers/smallerapk-part-3-removing-unused-resources-1511f9e3f761#.6p1ds1tmd)
- [#SmallerAPK, Part 4: Multi-APK through ABI and density splits](https://medium.com/@wkalicinski/smallerapk-part-4-multi-apk-through-abi-and-density-splits-477083989006)
- [#SmallerAPK, Part 5: Multi-APK through product flavors](https://medium.com/@wkalicinski/smallerapk-part-5-multi-apk-through-product-flavors-e069759f19cd)
- [#SmallerAPK, Part 6: Image optimization, Zopfli & WebP](https://medium.com/@wkalicinski/smallerapk-part-6-image-optimization-zopfli-webp-4c462955647d)
- [#SmallerAPK, Part 7: Image optimization, Shape and VectorDrawables](https://medium.com/@wkalicinski/smallerapk-part-7-image-optimization-shape-and-vectordrawables-ed6be3dca3f)
- [#SmallerAPK, Part 8: Native libraries, open from APK](https://medium.com/@wkalicinski/smallerapk-part-8-native-libraries-open-from-apk-fc22713861ff#.la1mqpfpk)



## reference

- [Reduce APK size Android developer](https://developer.android.com/topic/performance/reduce-apk-size.html#reduce-resources)
- <https://developer.android.com/studio/write/lint.html>
- <https://medium.com/@fahimsakri/put-your-apks-on-diet-cc3f40843c84#.tovondiur>
- <http://stackoverflow.com/a/29619452/1820217>
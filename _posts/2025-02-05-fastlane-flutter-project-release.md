---
layout: post
title: "利用 Fastlane 自动化 Flutter 项目构建及发布"
aliases:
- "利用 Fastlane 自动化 Flutter 项目构建及发布"
tagline: ""
description: ""
category: 经验总结
tags: [fastlane, flutter, ipa, apk, ios, android, build-system]
create_time: 2025-02-16 18:32:20
last_updated: 2025-02-16 18:32:20
dg-home: false
dg-publish: false
---

[Fastlane](https://fastlane.tools) 是一个强大的自动化工具，可以帮助 Flutter 开发者简化应用程序的构建、测试和发布流程。本文将详细介绍如何在 Flutter 项目中配置和使用 Fastlane 进行自动化部署。

## Fastlane 简介

Fastlane 是一套 Ruby 编写的[开源](https://github.com/fastlane/fastlane)自动化 iOS 和 Android 应用测试，构建和发布的方案，可以处理比如生成截图，代码签名，打包应用等繁琐的步骤，大大提高开发效率。

- [文档](https://docs.fastlane.tools/)

## 安装 Fastlane

安装 Fastlane

```
brew install fastlane
```

或者直接使用 RubyGems 安装

```
sudo gem install fastlane
```

推荐使用 Gem 安装，Homebrew 安装的 Fastlane 可能会很难管理依赖版本，造成一些问题。

Fastlane 支持 Ruby 2.5 及之后的版本。

但是更推荐使用 rbenv 安装 Ruby，然后使用 [bundler](https://bundler.io/) 来安装 fastlane。

如果使用 `gem install fastlane` 安装的时候长时间没有反应，尝试使用 sudo 安装。在 macOS High Sierra 以及以后的版本可能有一些权限的问题。

## 功能

Fastlane 具有如下的功能

- 自动打包
- 截图
- 项目配置
- 代码签名
- 文档
- 内测
- 发布
- 通知

Fastlane 还支持很多 Actions，包括

- snapshot，生成多个设备截图
- frameit，对截图增加物理边框
- increment_build_number，自动增加 build number
- testflight，上传 ipa 到 testflight
- deliver，上传 ipa 到 AppStore

更多可以参考[官网](https://docs.fastlane.tools/actions/)。

## 使用

Flutter 项目下，各个平台的项目都在子文件夹下。

首先需要创建一个 `FLUTTER_ROOT` 指向 Flutter SDK 根目录。

首先我们来介绍一下 Android 项目

### Android

进入 Flutter 的 android 文件夹，然后进行初始化

```
cd android
fastlane init
```

输入应用的包名（可以在 `build.gradle` 文件的 defaultConfig 中找到。

如果不上传到 Google Play，可以跳过 JSON 密钥文件设置。如果要提供 Google Play JSON 密钥文件，可以根据[官方文档](https://docs.fastlane.tools/actions/supply/)生成。

```
bundle exec fastlane run validate_play_store_json_key json_key:/path/to/fastlane-supply.json
```

### iOS 平台

进入 iOS 目录，然后进行初始化

```
cd ios
fastlane init
```

选择合适的项目，比如 Automate beta distribution to TestFlight 或者 Automate App Store distribution。

按照提示完成 Apple ID 登录和其他设置。

### 配置 Fastlane

Fastfile 是 Fastlane 的核心配置文件，定义了不同的自动化任务（简称 lanes）。lanes 中可以定义 actions 组合，多个 actions 可以组合成一个 lanes。

```
lane :beta do
  increment_build_number
  build_app
  upload_to_testflight
end

lane :release do
  capture_screenshots
  build_app
  upload_to_app_store       # Upload the screenshots and the binary to iTunes
  slack                     # Let your team-mates know the new version is live
end
```

上面定义了两个不同的 lanes，一个是进行 beta 测试，一个是发布到 App Store。配置完成之后要做的就是

```
fastlane release
```

以下是一个简单的示例

```
default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do # beta是打包的脚本命令 打包上传时执行 fastlane beta
    build_app(workspace: "Runner.xcworkspace", scheme: "Runner") # 开始打包-打包时使用的配置文件
    upload_to_testflight #打包完成后-上传到testflight
  end
end
```

Android 示例

```
default_platform(:android)
platform :android do
  desc "构建 APK 并上传到 Firebase App Distribution"
  lane :beta do
    # 构建 Flutter Android 项目
    sh("flutter", "build", "apk")

    # 上传到 Firebase App Distribution
    firebase_app_distribution(
      app: "1:123456789:android:abcd1234",
      groups: "testers",
      release_notes: "新版本测试"
    )
  end
end
```

### 运行 Fastlane

配置完成之后，可以通过如下的命令运行 Fastlane

```
cd ios
fastlane beta

cd android
fastlane beta
```

## Flutter 项目配置 fastlane

分别在 android 和 ios 目录中初始化

```
# iOS 配置
cd ios
fastlane init

# Android 配置
cd ../android
fastlane init
```

iOS 的 `fastlane/Fastfile` 中配置

```
default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    build_flutter
    upload_to_app_store(
      skip_screenshots: true,
      skip_metadata: true,
      submit_for_review: true,
      automatic_release: true,
      ipa: "../build/ios/ipa/aki_dict.ipa"
    )
  end

  # 添加构建 Flutter 的任务
  private_lane :build_flutter do
    sh("flutter build ipa")
  end
end
```

android 下配置

```
default_platform(:android)

platform :android do
  desc "Submit a new Beta Build to Play Store"
  lane :beta do
    build_flutter
    gradle(
      task: "bundle",
      build_type: "Release"
    )
    upload_to_play_store(
      track: 'beta',
      aab: '../build/app/outputs/bundle/release/app-release.aab'
    )
  end

  private_lane :build_flutter do
    sh("flutter build appbundle")
  end
end
```

`track: 'beta'` 在 Fastlane 的 Play Store 部署配置中表示将应用发布到 Google Play Console 的 Beta 测试通道。 Google Play 提供了几个不同的发布通道（track）：

- internal - 内部测试通道
- alpha - 封闭测试通道
- beta - 开放测试通道
- production - 正式发布通道

## GitHub Actions 实现 Fastlane CI/CD

分别在 Android 和 iOS 的 Fastfile 中添加发布 lane

```
# Android/fastlane/Fastfile
lane :beta do
  gradle(task: "clean assembleRelease")
  upload_to_play_store(track: 'beta')
end

# iOS/fastlane/Fastfile
lane :beta do
  build_app(workspace: "Runner.xcworkspace", scheme: "Runner")
  upload_to_testflight
end
```

在项目根目录，创建 `.github/workflows/release.yml` 文件

```
name: Release
on:
  push:
    tags:
      - 'v*'

jobs:
  release_android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '12.x'
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.3.8'
      - run: flutter pub get
      - run: flutter build appbundle
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1.2'
      - run: cd android && bundle install && fastlane beta

  release_ios:
    runs-on: macos-latest
    steps:
      - uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: latest-stable
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.3.8'
      - name: Install Fastlane
        run: cd ios && bundle install && cd ..
      - name: Get Flutter dependency
        run: flutter pub get
      - name: Installl Pods
        run: cd ios && pod install && cd ..
      - run: flutter build ios --release --no-codesign
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1.2'
      - run: cd ios && bundle install && fastlane beta
```

需要添加必要的密钥和证书文件到 GitHub Secrets。

触发新的发布，创建 Git 标签并推送到 GitHub 可以出发自动发布流程

```
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## related

- <https://docs.flutter.dev/deployment/cd#fastlane>

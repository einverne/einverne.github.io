---
layout: post
title: "Flutter 项目中如何优雅地升级版本号"
aliases:
- "Flutter 项目中如何优雅地升级版本号"
tagline: ""
description: ""
category: 经验总结
tags: [ flutter, android, ios, version-code, version-number ]
create_time: 2025-02-23 17:35:45
last_updated: 2025-02-23 17:35:45
dg-home: false
dg-publish: false
---

在 Flutter 项目开发中，版本号管理是一个重要但常常被忽视的环节。合理的版本号管理不仅有助于跟踪应用的开发进度，还能为用户提供清晰的更新信息。本文将介绍几种在 Flutter 项目中优雅升级版本号的方法。

## 理解 Flutter 的版本号格式

Flutter 项目中的版本号通常遵循语义化版本控制（Semantic Versioning）规范，格式为 `X.Y.Z+B`，其中：

- X 表示主版本号
- Y 表示次版本号
- Z 表示修订号
- B 表示构建号

例如，版本号 `1.2.3+4` 表示主版本号为 1，次版本号为 2，修订号为 3，构建号为 4。

## 在 pubspec.yaml 文件中设置版本号

Flutter 项目的版本号主要在 `pubspec.yaml` 文件中进行设置。打开项目根目录下的 `pubspec.yaml` 文件，找到 `version` 字段，按照如下格式设置版本号：

```yaml
version: 1.2.3+4
```

这里的 `1.2.3` 对应 `X.Y.Z`，而 `4` 对应构建号 `B`。

- 加号前面 1.2.3 表示版本名字，相当于 Android 中的 versionName
- 加号后面 4 表示版本号，相当于 Android 中的 versionCode

## Android

将版本号写入到 android 工程下的 local.properties 配置文件中，打包的 Gradle 脚本 会自动读取这个配置文件中的版本作为应用的版本号。

```
flutter.versionName=1.2.3
flutter.versionCode=4
```

## iOS

在编译 iOS 的时候，Flutter 会自动将版本信息写入 `ios/Flutter/Generated.xcconfig` 配置文件中。

```
FLUTTER_BUILD_NAME=0.0.3
FLUTTER_BUILD_NUMBER=7
```

这个值最终会被 `info.plist` 使用

```
<key>CFBundleShortVersionString</key>
<string>$(FLUTTER_BUILD_NAME)</string>
<key>CFBundleVersion</key>
<string>$(FLUTTER_BUILD_NUMBER)</string>
```

- CFBundleShortVersionString（版本号）：通常显示给用户，如 1.2.3。
- CFBundleVersion（构建号）：用于 App Store 识别新版本，每次提交新版本时都需要增加。

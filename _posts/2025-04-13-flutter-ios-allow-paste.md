---
layout: post
title: "Flutter 中实现跳转到应用设置"
aliases:
- "Flutter 中实现跳转到应用设置"
tagline: ""
description: ""
category: 经验总结
tags: [ flutter, dart, ios, paste, permission, privacy, ]
create_time: 2025-06-20 10:50:11
last_updated: 2025-06-20 10:50:11
dg-home: false
dg-publish: false
---

iOS 16 开始，苹果引入了新的隐私政策，应用程序在访问 iPhone 粘贴板的时候，必须得到用户的许可，这个功能设计的初衷是为了保护用户的隐私，防止应用程序暗中读取从其他地方复制的内容。

在 iOS 16.1 之后，苹果在设置中添加了一个额外的「从其他应用程序粘贴」菜单，用户可以在「设置」-> 「应用名称」 -> 「从其他应用粘贴」进行设置，有三个选项

- 询问，应用必须继续请求用户允许从其他应用粘贴内容
- 拒绝，应用程序不能从其他应用程序粘贴内容
- 允许，应用程序可以从其他程序粘贴内容，无需再次请求

在我开发 [Aki 日语辞书](https://apps.apple.com/us/app/aki-japanese-dictionary/id6742093442)中有多个地方需要用户粘贴内容，刚好看到设置有这样的选项，如果用户设置了，就可以避免每一次都弹出提示。

## 在 Flutter 设置跳转

在 Flutter 中可以使用 `app_settings` 这样一个插件来跳转到 iOS 或 Android 的设置。[^1]

[^1]: <https://pub.dev/packages/app_settings>

```
flutter pub add app_settings
```

在代码中可以使用

```
// 跳转到应用设置页面
AppSettings.openAppSettings();
```

这个方法会直接跳转到当前应用在系统设置中的页面，用户可以在该页面找到粘贴权限相关的设置。

为了更好的体验， 可以在跳转前向用户解释为什么要设置允许粘贴。

```
void showPastePermissionGuide(BuildContext context) {
  showDialog(
    context: context,
    builder: (BuildContext context) => AlertDialog(
      title: Text('需要修改粘贴权限'),
      content: Text('为了避免每次粘贴时都出现权限请求，请在设置中将"从其他应用粘贴"选项设置为"允许"。'),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
            AppSettings.openAppSettings();
          },
          child: Text('前往设置'),
        ),
      ],
    ),
  );
}
```

- 由于 iOS 的限制，用户无法直接跳转到特定的粘贴权限设置页面，只能跳转到应用的总设置页面
- 粘贴权限设置仅在 iOS 16.1 及以上版本中可用，较低版本的 iOS 可能没有此选项
- 「从其他应用粘贴」菜单只会出现在之前已经请求过粘贴权限的应用中

## 功能设计

在应用的设置中新增一个设置，「iOS 粘贴设置」，并给出详细的描述。

```
避免每一次粘贴的时候系统都弹窗，允许粘贴
```

## related

- permission_handler 是另外一个功能强大的权限管理插件，用于权限请求
---
layout: post
title: "使用 uPic 快捷上传图片到图床"
aliases: 
- "使用 uPic 快捷上传图片到图床"
tagline: ""
description: ""
category: 经验总结
tags: [ upic, macos, mac-app , mac-application  ]
last_updated: 2022-05-31 07:55:35
create_time: 2022-05-31 07:54:43
---

[uPic](https://github.com/gee1k/uPic) 是一个 macOS 上的图片上传工具，使用 Swift 编写。支持对接非常多的对象存储，以及可以自定义使用 [[Chevereto]]，或者 Lsky Pro 作为图床。

## 安装
可以直接从 App Store 安装，或者：

    brew install bigwig-club/brew/upic --cask

## 自定义配置

### 配置 Lsky Pro
Lsky Pro 兰空图床是一个 PHP 编写的图床程序。Lsky Pro 升级了 2.0 版本，API 接口也进行了重写。

首先使用用户名，密码获取 Token：

    curl -X POST -F "email=email@address" -F "password=your_passwd" https://your.domain/api/v1/tokens

复制返回值中的 token 字段。

然后配置 uPic，创建一个自定义 Host：

- `POST /api/v1/upload`
- 文件字段填写 `file`
- URL `["data", "links", "url"]`

示意图：

![upic lsky pro config](https://img.gtk.pw/i/2022/05/30/6294a1c1228d3.png)

然后配置 Other fields，添加 Header，记得 Bearer 后面添加上面获取的 Token。

![upic other fields](https://img.gtk.pw/i/2022/05/30/6294a23a9ab47.png)

### 设置 Chevereto

根据 [Chevereto](https://v3-docs.chevereto.com/API/V1.html#api-key) 的官方文档，可以配置：

![upic chevereto settings](/assets/upic-host-chevereto-settings.png)

![upic host chevereto header setting](/assets/upic-host-chevereto-header-body-settings.png)

API:

	GET http://mysite.com/api/1/upload/?key=12345&source=http://somewebsite/someimage.jpg&format=json

参数：

- `key`, The API v1 key, can be found in admin dashboard.
- `action`, 值是 `upload`
- `source`, URL 或者是图片的 Base64
- `format`, 返回类型，可以是 `json`, `redirect`, `txt`

返回结果

```
{
    "status_code": 200,
    "success": {
        "message": "image uploaded",
        "code": 200
    },
    "image": {
        "name": "example",
        "extension": "png",
        "size": 53237,
        "width": 1151,
        "height": 898,
        "date": "2014-06-04 15:32:33",
        "date_gmt": "2014-06-04 19:32:33",
        "storage_id": null,
        "description": null,
        "nsfw": "0",
        "md5": "c684350d722c956c362ab70299735830",
        "storage": "datefolder",
        "original_filename": "example.png",
        "original_exifdata": null,
        "views": "0",
        "id_encoded": "L",
        "filename": "example.png",
        "ratio": 1.2817371937639,
        "size_formatted": "52 KB",
        "mime": "image/png",
        "bits": 8,
        "channels": null,
        "url": "http://127.0.0.1/images/2014/06/04/example.png",
        "url_viewer": "http://127.0.0.1/image/L",
        "thumb": {
            "filename": "example.th.png",
            "name": "example.th",
            "width": 160,
            "height": 160,
            "ratio": 1,
            "size": 17848,
            "size_formatted": "17.4 KB",
            "mime": "image/png",
            "extension": "png",
            "bits": 8,
            "channels": null,
            "url": "http://127.0.0.1/images/2014/06/04/example.th.png"
        },
        "medium": {
            "filename": "example.md.png",
            "name": "example.md",
            "width": 500,
            "height": 390,
            "ratio": 1.2820512820513,
            "size": 104448,
            "size_formatted": "102 KB",
            "mime": "image/png",
            "extension": "png",
            "bits": 8,
            "channels": null,
            "url": "http://127.0.0.1/images/2014/06/04/example.md.png"
        },
        "views_label": "views",
        "display_url": "http://127.0.0.1/images/2014/06/04/example.md.png",
        "how_long_ago": "moments ago"
    },
    "status_txt": "OK"
}
```


## 配置 Backblaze B2
[[Backblaze B2 Cloud Storage]]


## 同类产品
同类的图片上传工具还有：

- [PicGo](https://github.com/Molunerfinn/PicGo) 使用 Electron-vue 实现。
- [PicX](https://github.com/XPoet/picx)
- [PicUploader](https://github.com/xiebruce/PicUploader)

## reference

- <https://blog.svend.cc/upic/tutorials/chevereto/en/>
---
layout: post
title: "使用 Syncwise 来管理大量的社交媒体收藏和书签"
aliases:
- "使用 Syncwise 来管理大量的社交媒体收藏和书签"
tagline: ""
description: ""
category: 产品体验
tags: [syncwise, twitter, facebook, reddit, bookmark, chrome, collection]
create_time: 2024-08-12 15:13:51
last_updated: 2024-08-12 15:13:51
dg-home: false
dg-publish: false
---

[Syncwise](https://syncwise.xyz/) 是一款可以同步 Twitter，Reddit 等社交软件书签的工具，安装 Syncwise 的 [Chrome 扩展](https://chromewebstore.google.com/detail/syncwise/neggjnoghlcpfbblmhokbhadbnplcocg)，就可以一键将 Twitter 的书签同步到该平台中。可以在 Syncwise 中对书签的内容进行检索，打标签等。

Syncwise 支持多个平台，我个人最主要使用的就是 Twitter，因为 Twitter 自己的书签管理系统做得太差了，收藏的内容无法检索，也无法分类，经常无法找到自己收藏的内容，或者需要翻阅很久。

## 优点

Syncwise 解决了一直以来的一个管理 Twitter 书签栏的痛点，我常常收藏了很多的内容而来不及阅读，这些内容最后都成为了 Twitter 书签中「死掉」的内容，借助这个工具，一方面我可以试试得进行检索我当下关心的内容，另一方面常常去翻阅我的书签。

### 支持多个平台

Syncwise 支持包括 Twitter，Pinterest，YouTube，TikTok，Facebok，Quora 在内的很多个平台。

![yD5h](https://photo.einverne.info/images/2024/08/12/yD5h.png)

Syncwise 还支持导入浏览器书签。

### 检索速度快

即使像我这样有超过 1 万条记录，检索的结果返回也非常的快。

![yUhC](https://photo.einverne.info/images/2024/08/12/yUhC.png)

### 标签分类

Syncwise 支持对书签进行标签分类 （Label），方便用户更好地管理自己的收藏内容。

### 界面简洁

Syncwise 的界面设计简洁明了，操作起来非常直观，用户可以快速找到自己需要的功能。

## 缺点

- 这一款工具刚刚开发出来，目前还官网和后台管理之间还有一些没有关联上，比如登录官网之后没有立即跳转到 console 后台，并且页面没有提供任何的按钮到管理后台去，每一次只能我手动修改 URL 导航
- 另外一个就是 Syncwise 目前还不支持导出同步的内容
- 另外 Syncwise 目前还是依赖于 Twitter 自身的 Widget 来展示内容，有些担心如果 Twitter 帖子被删除有可能无法追回内容
- 最后一个就是隐私问题，收藏，书签的内容一般比较个人，如果不放心该平台，可以推荐采用另外的方式直接将书签导出成 CSV 文件保存

## 其他代替

- [twitter-web-exporter](https://github.com/prinsss/twitter-web-exporter) 是一个导出 Twitter 收藏，关注的用户脚本。导出用户推文、书签、点赞、关注列表、搜索结果、用户列表，支持 JSON/CSV/HTML 格式导出，支持批量下载原图和视频，完全免费，无需 OAuth 授权，纯浏览器端本地运行

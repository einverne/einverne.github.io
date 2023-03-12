---
layout: post
title: "如何在 Chrome 中使用 New Bing"
aliases:
- "如何在 Chrome 中使用 New Bing"
tagline: ""
description: ""
category: 经验总结
tags: [ new-bing, google, chatgpt, ai-powered, microsoft ]
create_time: 2023-03-12 08:35:41
last_updated: 2023-03-12 08:35:41
---

拿到 New Bing（新病）的体验，但是 Microsoft 却要让我下载 Edge 才能体验，这个体验真的很差，所以回去用 Google 搜了一下「如何在 Chrome 中使用 New Bing」，还在还是有方法的。

- 安装 [HeaderEditor](https://chrome.google.com/webstore/detail/header-editor/eningockdidmgiojffjmkdblpjocbhgh/related) 插件
- 按下图的方式添加两条规则

![2naD](https://photo.einverne.info/images/2023/03/12/2naD.png)

user-agent 规则，将`user-agent` 修改成 `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41`

![2s9L](https://photo.einverne.info/images/2023/03/12/2s9L.png)

将 `x-forwarded-for` 修改成 `8.8.8.8`。

然后访问 <https://bing.com/new> 就会从这个有着 「Download Microsoft Edge」 的页面

![2g5h](https://photo.einverne.info/images/2023/03/12/2g5h.png)

变成直接可以 Chat 的页面。

![2khC](https://photo.einverne.info/images/2023/03/12/2khC.png)

之后，在 New Bing 网页中的第一个问题就是问她「如何在 Chrome 中使用 New Bing」

![22HH](https://photo.einverne.info/images/2023/03/12/22HH.png)

好在回答的还算比较准确。

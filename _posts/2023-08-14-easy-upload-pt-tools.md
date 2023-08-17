---
layout: post
title: "PT 站点一键转载脚本 easy-upload"
aliases:
- "PT 站点一键转载脚本 easy-upload"
tagline: ""
description: ""
category: 学习笔记
tags: [pt, private-tracker, tracker, userscript, chrome, tampermonkey, ]
create_time: 2023-08-17 09:21:51
last_updated: 2023-08-17 09:21:51
---

[easy-upload](https://github.com/techmovie/easy-upload) 是一个支持在不同的 PT 站点之间转载，自动填写发布信息的用户脚本 Userscript，非常方便使用 PT 的朋友使用。自动填写上传页表单，支持内外站互转，支持 PT 站间快速检索。

如果不清楚 PT 是什么，可以注册[PT GTK](https://pt.gtk.pw) 来了解使用。我也会在站内不定期的发送其它站点的邀请。也欢迎其他爱好者加入站点之后一起讨论。

## easy-upload 使用

### 如何进行本地调试

首先要修改 Tampermonkey 扩展，允许访问文件网址。

![](https://photo.einverne.info/images/2022/12/05/ZDM9.jpg)

在浏览器的 [[Tampermonkey]] 扩展中创建一个新的空白用户脚本，然后将以下内容复制进去，再将 `@require` 下的文件路径修改为自己本地工程中 `.cache/easy-upload.user.js` 所在的路径。

```
// ==UserScript==
// @name         debug
// @namespace    https://github.com/techmovie/easy-upload
// @version      ${version}
// @description  ${description}
// @author       ${author}
// @require      https://cdn.bootcss.com/jquery/1.7.1/jquery.min.js
// @match        https://passthepopcorn.me/torrents.php?id=*
// @match        http://*/details.php?id=*
// @match        https://*/details.php?id=*
// @match        https://totheglory.im/t/*
// @match        https://beyond-hd.me/torrents/*
// @match        https://lemonhd.org/upload_*
// @match        https://lemonhd.org/details*
// @match        https://blutopia.xyz/torrents/*
// @match        https://blutopia.xyz/torrents?*
// @match        https://blutopia.xyz/upload/*
// @match        https://pt.hdpost.top/torrents?*
// @match        https://pt.hdpost.top/torrents/*
// @match        https://asiancinema.me/torrents/*
// @match        https://asiancinema.me/torrents?*
// @match        https://*/upload*
// @match        http://*/upload*
// @match        http://www.hd.ai/Torrents.upload
// @match        http://www.hd.ai/Torrents.index?*
// @match        https://broadcity.in/browse.php?imdb=*
// @match        https://ptpimg.me
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      file:///Users/einverne/Git/easy-upload/.cache/easy-upload.user.js
// ==/UserScript==
(function() {
    'use strict';
})();
```

然后到项目的跟目录下，执行 yarn install 安装依赖包，然后运行 `yarn dev` 启动工程，有文件改动，.cache 目录下的脚本会自动更新，刷新浏览器即可。

当调试完成，可以执行 `yarn build` 在 dist 目录中生成最后发布的脚本。同理也可以直接在上面的路径中使用 dist 下的文件，但此时每一次都需要 `yarn build` 来生成最新的文件。

当完成上述的配置之后，在浏览器中打开 PT 站点（NexusPHP），就会在种子对应的详情页面展示如下的画面，点击其中的 gtk，就可以将其他站点的信息一键补充到 [PT GTK](https://pt.gtk.pw) 中。

![](https://photo.einverne.info/images/2022/12/05/ZXV6.png)

更详细的编译好的版本，可以到[这里](https://pt.gtk.pw/forums.php?action=viewtopic&forumid=1&topicid=10) 下载使用。

### 开发流程

开发流程执行如下的命令

```
yarn install
yarn upgrade
yarn build
```

## related

- [[PT 常用工具]]

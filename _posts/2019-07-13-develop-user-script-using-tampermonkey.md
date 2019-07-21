---
layout: post
title: "使用 Tampermonkey 调试本地脚本"
tagline: ""
description: ""
category: 经验总结
tags: [tampermonkey, userscripts, userscript, ]
last_updated:
---

记录一下使用 Tampermonkey 调试本地脚本。


## Tampermonkey 加载开发调试本地 js

首先设置 Tampermonkey 插件的设置

- Chrome 中打开 chrome://extensions
- 搜索 Tampermonkey ，并且在设置中开启 `Allow access to file URLs`

然后在文件中使用 `@require` 引入外部文件。

    // ==UserScript==
    // @name         Debug Userscript
    // @namespace    https://github.com/einverne/userscripts
    // @version      0.1
    // @description  This is a debug script to load userscripts from local file system. NOTICE, you need to turn on Allow access to file URLs to @require local file https://www.tampermonkey.net/documentation.php
    // @author       Ein Verne
    // @match        http*://*
    // @include      http://*
    // @include      https://*
    // @include      *
    // @grant        GM_xmlhttpRequest
    // @grant        GM_addStyle
    // @grant        GM_getResourceText
    // @require      https://unpkg.com/dexie@latest/dist/dexie.js
    // @require      file:///home/einverne/Git/userscripts/douban_export/douban_exporter.user.js
    // ==/UserScript==

    (function () {
        'use strict';

        console.log("debug script start here");
        // Your code here...
    })();

## reference

- <https://github.com/einverne/userscripts/blob/master/debug/debug.user.js>

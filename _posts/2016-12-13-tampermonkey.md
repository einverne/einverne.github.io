---
layout: post
title: "Tampermonkey Chrome 下超神的插件"
tagline: ""
description: ""
category: 经验总结
tags: [chrome, tampermonkey, google, userscript, user-js, ]
last_updated:
---


根据 Tampermonkey 在<a href="https://code.google.com/p/tampermonkey/" target="_blank">Google Code</a>页面的介绍，Tampermonkey 是一款在 Google Chrome 和 Chromuim 浏览器中提供“<a href="http://zh.wikipedia.org/wiki/Greasemonkey" target="_blank">油猴子脚本</a>”支持的工具。Tampermonkey 是 Google Chrome 中<a href="http://tampermonkey.googlecode.com/svn/trunk/README" target="_blank">最流行</a>的一款脚本管理插件。它的 API 完全兼容“油猴子脚本”，它还加入更多的 Chrome 本身不支持的用户脚本功能，比如 `GM_registerMenuCommand` 和 `GM_xmlhttpRequest` 这两个函数。

安装地址： [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

<blockquote class="tr_bq">
Tampermonkey is a tool that provides Greasemonkey script support for Google Chrome and Chromium Browser. It's API is fully compatible to Greasemonkey, including GM_registerMenuCommand, GM_xmlhttpRequest with cross domain support and access to the unsafeWindow object.</blockquote>

### 什么是浏览器用户脚本 (Userscript)？
当用户浏览网页时，会从服务器上下载脚本，并在本地运行，这种脚本我们会称之为网页脚本。与网页脚本不同的，用户脚本本身就在客户机上，不需要下载，而且如果不对其做限制，可用在所有网页上。浏览器用户脚本通常使用 Javascript 语言编写。<br />
<br />
通过编写用户脚本，可以很大程度上提高上网体验。譬如使用 Userscript 可以实现网页自动翻页、文字翻译、页面预读、看图增强等等有用、有趣的功能。<br />
<br />
Userscript 虽然很自由很强大，但出于安全性原因，使用的时候会有些限制，如 Userscript 不能操作文件、不能操作剪贴板等。<br />
<a href="http://www.guokr.com/blog/57177/" target="_blank">参考</a><br />

### Tampermonkey 功能

<ol>
<li>管理和编辑所有的用户脚本</li>
<li>点击启动和禁用脚本</li>
<li>在不同 Chrome 中同步所有的脚本</li>
<li>通过 URL 搜索用户脚本（确保启用 TamperFire）</li>
</ol>
<br />
Features:<br />
&nbsp;- manage and edit all your userscripts<br />
&nbsp;- enable and disable your scripts with 2 clicks<br />
&nbsp;- easily sync you scripts between different Chrome instances<br />
&nbsp;- search scripts from userscripts.org by URL (with TamperFire enabled)<br />

### 使用 Tampermonkey 同步脚本
<ol>
<li>将"Config mode"切换到"Advanced"</li>
<li>找到"TESLA BETA"启动"Enable TESLA","type"选用“Chrome sync（Beta）”，save</li>
<li>这样所有的脚本都不会丢失了，不会发生我重装系统丢失所有脚本的情况了。</li>
</ol>
<br />
Tampermonkey 何时同步：<br />
1) before every TM update check<br />
2) whan a script is changed locally<br />
3) when TM starts<br />
4) every 5h (will become configurable)<br />
<a href="https://code.google.com/p/tampermonkey/issues/detail?id=99" target="_blank">参考</a><br />

### 安装脚本过程
找到你想要安装的用户脚本，例子中使用“<a href="http://userscripts.org/scripts/show/25105" target="_blank">Download YouTube Videos as MP4</a>”脚本，更多推荐脚本可以看我<a href="http://www.einverne.tk/2012/10/userscripts.html" target="_blank">这篇</a>文章，一下在 Chrome 中执行。<br />

![Tampermonkey install](https://3.bp.blogspot.com/-8SwMIO_z4Ds/UQfRnVIsstI/AAAAAAAASt4/FIXNPg1Kd3U/s1600/userscript_install_1.png)

到了这个界面可以点击右上角的“Install”，然后会自动调用 Tampermonkey<br />

![Tampermonkey install](https://4.bp.blogspot.com/-fAmXiRcdxYE/UQfSKcHtA7I/AAAAAAAASuI/jeFqZpuUbWs/s1600/userscript_install_2.png)

点击“OK”<br />

![Tampermonkey install](https://4.bp.blogspot.com/-sy1DLBsReSk/UQfSTofOVLI/AAAAAAAASuQ/-oc-3plUcBk/s1600/userscript_install_3.png)

这个界面可以看到脚本要求的权限和版本信息等等信息。点击“OK”整个安装过程就结束了。<br />
最后晒晒我的脚本<br />

![Tampermonkey](https://3.bp.blogspot.com/-1k-I1K4eX4M/UQfSlvmuNaI/AAAAAAAASuY/Oiyj85gGqeo/s1600/userscript_all.png)

<br />
如果想要深入了解一下油猴子用户脚本，可以参考一下这本书《<a href="https://www.dropbox.com/s/5i37l7u2gzwau11/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Greasemonkey%E4%BC%98%E5%8C%96.pdf" target="_blank">深入浅出 Greasemonkey</a>》<br />

### 参考以下文章

- <http://www.iplaysoft.com/greasemonkey.html>
- <http://pcedu.pconline.com.cn/soft/wl/brower/1206/2839052.html>
- <http://www.cnblogs.com/kuber/archive/2010/04/08/Why_Userscripts_Is_Not_Better_Than_Extensions.html>

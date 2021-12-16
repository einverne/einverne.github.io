---
layout: post
title: "给博客添加 PWA"
tagline: ""
description: ""
category: 经验总结
tags: [pwa, google, blog,]
last_updated:
---

改造网站支持 Progressive Web Apps （PWA），改善移动端体验。

主要分成一下几步：

1. 开启全站 HTTPS
2. Service Worker
3. Web App Manifest

## Service Worker
检测当前的浏览器是否支持 Service Worker

- <https://jakearchibald.github.io/isserviceworkerready/>

调试 Service Worker，可以在 Chrome 开发者选项 Application 看到 Service Worker.

创建 `sw.js` 并注册

	  <script>
		  if ('serviceWorker' in navigator) {
			  window.addEventListener('load', function () {
				  navigator.serviceWorker.register('/sw.js');

				  //navigator.serviceWorker.ready always resolve
				  navigator.serviceWorker.ready.then(function (registration) {
					  console.log('Service worker successfully registered on scope', registration.scope);
				  });
			  });
		  }
	  </script>

关于 `sw.js` 比较复杂， 可以参考文末 Google 的文档。

## Manifest

manifest 属性

- name —— 网页显示给用户的完整名称
- short_name —— 当空间不足以显示全名时的网站缩写名称
- description —— 关于网站的详细描述
- start_url —— 网页的初始 相对 URL（比如 /）
- scope —— 导航范围。比如，/app/ 的 scope 就限制 app 在这个文件夹里。
- background-color —— 启动屏和浏览器的背景颜色
- theme_color —— 网站的主题颜色，一般都与背景颜色相同，它可以影响网站的显示
- orientation —— 首选的显示方向：any, natural, landscape, landscape-primary, landscape-secondary, portrait, portrait-primary, 和 portrait-secondary。
- display —— 首选的显示方式：fullscreen, standalone （看起来像是 native app)，minimal-ui （有简化的浏览器控制选项） 和 browser （常规的浏览器 tab)
- icons —— 定义了 src URL, sizes 和 type 的图片对象数组，用来定义 PWA 的 icon。

页面中添加 manifest.json 使之生效。

	<link rel="manifest" href="/manifest.json">

[这里](https://app-manifest.firebaseapp.com/) 可以生成 manifest 和不同尺寸的 icon


## Test
部署后可以[测试一下](https://www.webpagetest.org/)

## reference

- <https://developers.google.com/web/fundamentals/codelabs/offline>
- <https://itnext.io/service-workers-your-first-step-towards-progressive-web-apps-pwa-e4e11d1a2e85>
- <https://gtk.pw/8ax4i>
- <https://github.com/Huxpro/huxpro.github.io>

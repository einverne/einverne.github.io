---
layout: post
title: "使用 netlify 托管静态网站"
aliases: "使用 netlify 托管静态网站"
tagline: ""
description: ""
category: 产品体验
tags: [github, git, ci, website, ]
last_updated:
---

netlify 是一个提供静态网站托管的服务，提供 CI 服务，能够将托管 GitHub，GitLab 等网站上的 Jekyll，Hexo，Hugo 等静态网站。

> Netlify is a unified platform that automates your code to create high-performant, easily maintainable sites and web apps.

Netlify 有如下的功能：

- 能够托管服务，免费 CDN
- 能够绑定自定义域名，支持 SSL 证书
- 支持自动构建
- 提供 Webhooks 和 API

## 使用
Netlify 的使用非常直观和简单，和网站的自我介绍和定位一样简答，使用 GitHub 登录，然后获取公开项目的授权，让其获取源码，然后指定编译命令，比如我的网站使用 Jekyll，那么编译命令就是

    jekyll build

将生成的静态网站放到

    _site

这个目录下，接下来的事情就是等着 Netlify 自动编译部署，默认情况下 Netlify 会分配一个随机的子域名 `https://《随机字符》.netlify.com` 这样的地址，可以在设置中设置为自己想要的域名，或者在设置中绑定自己的域名。

那接下来就是 Netlify 会在每一次提交 commit 时自动编译部署静态网站。最后来访问下 <https://blog.einverne.info>

## 联想
同类型的静态网站托管服务， GitHub Page 原生支持，绝大部分常用的功能 GitHub Page 也都支持，不过是 GitHub 在国内的访问一般。另外 [Pancake.io](/post/2015/07/dropbox-tips.html) 可以将 Dropbox 中的静态内容映射成网站也同样支持绑定域名，[Postach.io](https://postach.io/site/) 能够将 Evernote 作为 blog 发布的源。

其他一些同类型的服务，[now](https://zeit.co/now) 同样能够托管静态网站，不过也支持托管 Node.js。[Firebase Hosting](https://firebase.google.com/docs/hosting/) 随同 Firebase 一同提供，更加推荐作为产品介绍静态页面来托管，不要将其作为博客内容托管。[Surge](https://surge.sh/) 静态网站托管，支持命令行上传代码。

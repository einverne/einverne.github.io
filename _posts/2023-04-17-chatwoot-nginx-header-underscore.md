---
layout: post
title: "Chatwoot Nignx 代理丢失 Header 信息"
aliases:
- "Chatwoot Nignx 代理丢失 Header 信息"
tagline: ""
description: ""
category: 经验总结
tags: [chatwoot, online-business, self-hosted, nginx, http-header, http-request, postman]
create_time: 2023-04-17 13:20:30
last_updated: 2023-04-17 13:20:30
---

之前的一篇[文章](/post/2023/03/chatwoot-open-source-customer-engagement.html)介绍过如何使用 Docker 自建 [[Chatwoot]]，但是最近调用 API 的时候总是发现问题。在调用最普通的接口的时候，按照要求在 Header 中传了 `api_access_token`，但是接口返回 401 或者是

```
{"errors":["You need to sign in or sign up before continuing."]}
```

简单的查询了一下之后，发现问题出现在 Nginx 上，Nginx 默认情况下不允许带下划线的 Header，所以当请求到 Nginx，然后转发到后台 Chatwoot 的时候这个 `api_access_token` 就丢了。所以一直出现 401 和需要登录的状况。

解决办法非常容易，在 Nginx 的配置 `server` 块中增加如下的配置

```
underscores_in_headers on;
```

然后 Nginx 配置 reload 即可，因为我使用 [[HestiaCP]] 控制面板，所以后台修改一下配置模板即可。

## reference

- <https://www.chatwoot.com/docs/self-hosted/deployment/caprover#api-requests-failing-with-you-need-to-sign-in-or-sign-up-before-continuing>
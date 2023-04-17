---
layout: post
title: "chatwoot 开源的客户支持工具：在网站上加上聊天对话框"
aliases:
- "chatwoot 开源的客户支持工具：在网站上加上聊天对话框"
tagline: ""
description: ""
category: 产品体验
tags: [chatwoot, open-source, online-chat, customer-engagement, support, real-time-support]
create_time: 2023-03-31 13:12:37
last_updated: 2023-03-31 13:12:37
---

[Chatwoot](https://www.chatwoot.com/) 是一个 Ruby 编写的，开源的，可自建的即时消息的客户支持工具 [[Business Messaging Platform]]，可以嵌入到网页，集成 Telegram，电子邮件，帮助企业提供在线的客户服务支持。chatwoot 开始于 2016 年。

在接触到 Chatwoot 之前，陆陆续续了解过 [[crisp.chat]]，[tawk.to](/post/2023/03/tawk-to-usage.html)。而我昨天稍微了解了一下这个行业之后就发现原来对企业的在线实时聊天的服务已经竞争非常充分了。只简单的了解了一下就发现超过 10 家公司在做类似的事情，并且还有非常多的公司以开源的方式在进行。

比如已经作为商业产品在运作的：

- [[Intercom]]
- [[tawk.to]]
- [[crisp.chat]]
- [[Drift]]
- [[HelpCrunch]]
- [[Zendesk]]
- [[Help Scout]]
- [[Freshdesk]]
- [[chatfuel]]
- [[airchat]]
- [[PubNub]]
- [[Kustomer]]

等等

以开源的方式在进行的有：

- 文本介绍的重点 [[chatwoot]]
- [[papercups]]
- [[Chaskiq]]

这么多相类似的产品，大部分的商业产品所面向的客户都不太一样，有面向大客户的，比如 Intercom，Zendesk 等等，也有面向垂直电子商务的，也有面向创业公司的。

但总之上面的这些都不是本文的重点，下面就重点放在 Chatwoot 的使用上面。

## Installation

Chatwoot 官方提供了[很多种方式安装](https://www.chatwoot.com/docs/self-hosted)，还包括很多云服务提供商可以一键安装。但是我选择用 Docker(docker-compose) 安装。详情配置见[这里](https://github.com/einverne/dockerfile/tree/master/chatwoot)

```
git clone git@github.com:einverne/dockerfile.git
cd dockerfile/chatwoot
cp env .env
# modify .env
docker compose run --rm rails bundle exec rails db:chatwoot_prepare
docker compose up -d
```

默认配置下 Chatwoot 是只监听本地的 localhost:3000 端口，所以还需要前台用 Nginx 做一下反向代理。

```
server {
  server_name <yourdomain.com>;

  # Point upstream to Chatwoot App Server
  set $upstream 127.0.0.1:3000;

  # Nginx strips out underscore in headers by default
  # Chatwoot relies on underscore in headers for API
  # Make sure that the config is set to on.
  underscores_in_headers on;
  location /.well-known {
    alias /var/www/ssl-proof/chatwoot/.well-known;
  }

  location / {
    proxy_pass_header Authorization;
    proxy_pass http://$upstream;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Ssl on; # Optional

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_http_version 1.1;
    proxy_set_header Connection “”;
    proxy_buffering off;

    client_max_body_size 0;
    proxy_read_timeout 36000s;
    proxy_redirect off;
  }
  listen 80;
}
```

### 如何实时接受消息

因为我使用 [HestiaCP](/post/2022/07/web-server-control-panel-hestia-usage.html) 作为服务器面板，这里还遇到一个小坑，因为默认的 [HestiaCP 模板文件](/post/2023/01/hestiacp-web-template.html) 中 `stpl` 配置最下方有一个 Nginx 配置[^1]

[^1]: <http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_hide_header>

```
    proxy_hide_header Upgrade;
```

也就是说默认情况下会隐藏请求头。这导致了我在安装完 chatwoot 之后，发送消息，管理后台以及前端小插件，iOS 客户端都不能实时收到新消息，必需整页刷新才能收到新消息，这导致我 Debug 了好久。虽然在之前安装 [VS Code Server 在线版](/post/2023/03/visual-studio-code-server-usage.html) 的时候就遇到过一次，但还是掉进了这个坑里面。

## Agent

通过 Chatwoot 的 Agent API 可以自行编写回答机器人。如果接入了 OpenAI，Rasa 等聊天机器人就可以快速的搭建一套智能客服了。

## Super Admin
可以访问，`<chatwoot-installation-url>/super_admin`。



## reference

- <https://www.chatwoot.com/docs/self-hosted/deployment/docker>

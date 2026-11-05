---
layout: post
title: "Homepage：能显示服务状态的自托管导航面板"
aliases:
- "Homepage：能显示服务状态的自托管导航面板"
tagline: "从 2021 年的 Homer 到 2026 年的 Homepage，我的自托管导航页是怎么变的"
description: "Homepage（gethomepage.dev）是一个用 YAML 配置的自托管应用面板，支持 100 多个服务集成、Docker 和 Kubernetes 自动发现，API 请求由后端代理，密钥不会暴露给浏览器。本文介绍 Homepage 的核心功能、Docker 部署和配置方法，并与 2021 年介绍过的静态导航页 Homer 做详细对比。"
category: 产品体验
tags: [homepage, homer, dashboard, self-hosted, homelab, docker, kubernetes, navigation]
create_time: 2026-10-19 16:00:00
last_updated: 2026-10-19 16:00:00
---

最近整理我自己部署的服务，发现进入了一个比较难维护的状态，常常没有办法快速找到我想要访问的内容，家里有两台 PVE，上面运行着多个 VM，还有几台 VPS 上单独部署了 aaPanel，跑着网站，Appwrite，Chatwoot，Gitea，Umami, Nezha 等等服务，还有一个 Rancher 管理的 K8s 集群，上面也运行着十几个实际工作的网站，之前我都是在 Obsidian 中用一个笔记，记录着服务网址，部署在哪台机器，有没有备份，但是这个笔记越来越大，维护起来也越来越费劲，要查询某个服务的时候，手边没有 Obsidian 也非常不方便，虽然有一些地址记录在了 Chrome 里面，但是也常常域名，端口分不清，体验很差。

![Homepage 自托管服务导航面板](https://pic.einverne.info/images/2026-10-19-17-08-53-homepage-self-hosted-dashboard.png)

所以，我想起了 2021 年时我写过的一篇文章 [又一个简单漂亮的静态个人导航站 Homer](https://blog.einverne.info/post/2021/08/another-simple-static-homepage-homer.html)，当时觉得维护一个 YAML 生成的导航页就够用了。但是这次再梳理，我又搜索了一下，发现了一个比 Homer 更好用的个人导航站 Homepage。

## Homepage 是什么

[Homepage](https://gethomepage.dev) 是一个开源的自托管应用面板（application dashboard），基于 [[Next.js]] 编写，使用 GPL-3.0 协议。它最早是 Ben Phelps 的个人项目（仓库地址是 `benphelps/homepage`，我 2023 年的笔记里收藏的还是这个地址），后来迁移到了 `gethomepage` 组织下，由社区共同维护。截至目前，项目在 GitHub 上有大约 33200 个 Star。

它和 Homer 一样用 YAML 文件配置，但定位完全不一样。Homer 是纯静态的 HTML 和 JS，本质上是一个好看的书签页；Homepage 有自己的 Node.js 后端，可以替你去请求各个服务的 API，把 [[Proxmox VE]] 的 CPU 占用、[[Uptime Kuma]] 的在线状态、[[qBittorrent]] 的下载速度、[[Jellyfin]] 正在播放的内容直接显示在卡片上。官方说法是支持 100 多个服务集成，界面支持 40 多种语言，镜像同时提供 AMD64 和 ARM64 版本，树莓派上也能跑。

## 核心功能

### 服务卡片和服务组件

Homepage 的主体是 `services.yaml` 里定义的服务分组。每个服务至少有名字、图标和链接，可以再挂一个 widget 显示实时数据。比如下面这样，PVE 卡片会显示节点的 CPU 和内存，Uptime Kuma 卡片会显示在线和离线的监控项数量：

{% raw %}
```yaml
- 基础设施:
    - PVE:
        icon: proxmox.png
        href: https://192.168.2.100:8006
        description: ser8 主机
        widget:
          type: proxmox
          url: https://192.168.2.100:8006
          username: "{{HOMEPAGE_VAR_PVE_TOKEN_ID}}"
          password: "{{HOMEPAGE_VAR_PVE_TOKEN_SECRET}}"
    - Uptime Kuma:
        icon: uptime-kuma.png
        href: https://kuma.einverne.info
        widget:
          type: uptimekuma
          url: https://kuma.einverne.info
          slug: default
```

如果某个服务没有现成的 widget，也可以只加一个 `siteMonitor` 或 `ping` 字段，Homepage 会定期探测这个地址，在卡片右上角显示响应时间和在线状态。对我来说这一项就已经很有用了，几十个服务里哪个挂了一眼就能看到。

### 信息组件和书签

页面顶部可以放一排信息组件，在 `widgets.yaml` 里配置，包括搜索框、时间日期、天气、主机资源（CPU、内存、磁盘、网络）、Kubernetes 集群资源等。`bookmarks.yaml` 用来放不需要监控的普通链接，比如 GitHub、Cloudflare 后台这类外部网站。服务和书签分开放，页面看起来很清楚。

### Docker 和 Kubernetes 自动发现

如果服务都跑在 [[Docker]] 里，可以不写 `services.yaml`，直接在容器上加 `homepage.` 开头的 label，Homepage 读取 Docker socket 后会自动把它加到对应分组里：

```yaml
labels:
  - homepage.group=Media
  - homepage.name=Jellyfin
  - homepage.icon=jellyfin.png
  - homepage.href=https://jellyfin.example.com
  - homepage.description=媒体服务器
```

[[Kubernetes]] 的做法类似，在 Ingress 上加 `gethomepage.dev/enabled: "true"` 等注解，Homepage 会自动发现服务，除了标准 Ingress，还支持 [[Traefik]] 的 IngressRoute 和 Gateway API。这样服务的导航信息和部署配置写在一起，删掉一个服务，导航页上的卡片也会跟着消失，不会出现我那张 Markdown 表格那样越积越旧的问题。

### API 代理和密钥保护

这是 Homepage 和 Homer 在架构上最关键的区别。Homepage 里所有对后端服务的 API 请求都由它自己的服务端代理，浏览器只拿到最终结果，API Key 和密码不会出现在前端。配置文件里的敏感信息还可以用 `{{HOMEPAGE_VAR_XXX}}` 引用环境变量，或者用 `{{HOMEPAGE_FILE_XXX}}` 从文件里读取，配合 Docker secrets 用，YAML 文件本身就可以放心提交到 Git 仓库。
{% endraw %}

## 部署

官方推荐用 Docker Compose 部署，最简单的配置如下：

```yaml
services:
  homepage:
    image: ghcr.io/gethomepage/homepage:latest
    container_name: homepage
    ports:
      - 3000:3000
    volumes:
      - ./config:/app/config
      - /var/run/docker.sock:/var/run/docker.sock:ro # 可选，Docker 集成才需要
    environment:
      HOMEPAGE_ALLOWED_HOSTS: home.example.com
      HOMEPAGE_VAR_PVE_TOKEN_ID: root@pam!homepage
      HOMEPAGE_VAR_PVE_TOKEN_SECRET: xxxxxxxx
    restart: unless-stopped
```

第一次启动后，`config` 目录里会自动生成 `services.yaml`、`widgets.yaml`、`bookmarks.yaml`、`settings.yaml`、`docker.yaml` 等示例文件。修改服务和组件配置后刷新页面就能生效，不需要重启容器；`settings.yaml` 例外，改完要点一下页面右下角的刷新图标，让 Homepage 重新生成静态页面。

这里有个坑必须提一下：从 v1.0 开始，`HOMEPAGE_ALLOWED_HOSTS` 是必填项。除了 `localhost:3000` 和 `127.0.0.1:3000`，只要你用其他域名或 IP 访问，就必须把它加到这个列表里，多个值用逗号分隔且不能有空格，非 80 和 443 端口还要带上端口号。很多人升级后打开页面报错，原因就在这里。如果遇到 host validation 的报错，看一下容器日志，日志里会打印出实际收到的 Host，把它原样填进去就行。虽然可以设置成 `*` 关闭检查，但官方不推荐。

另一个要注意的是 Docker socket。直接把 `/var/run/docker.sock` 挂进容器等于把整台机器的 Docker 控制权交给它，哪怕加了 `:ro` 也一样。更稳妥的做法是在前面加一个 [docker-socket-proxy](https://github.com/Tecnativa/docker-socket-proxy)，只开放查看容器的只读接口，Homepage 再通过 `docker.yaml` 连接这个代理。

## 安全和访问控制

Homepage 2.0 加入了一个可选的登录功能，可以用简单密码，也可以接 OIDC（比如 [[authentik]]、Keycloak、Pocket ID）。开启方式是设置 `HOMEPAGE_AUTH_ENABLED=true`，同时提供至少 32 位的 `HOMEPAGE_AUTH_SECRET` 和 `HOMEPAGE_EXTERNAL_URL`。只用密码登录的话再加一个 `HOMEPAGE_AUTH_PASSWORD`，配置了 `HOMEPAGE_OIDC_ISSUER` 等变量后则会改用 OIDC 登录。

不过这个登录只是一个「登录了还是没登录」的开关，官方文档也写得很明白，它不做密码尝试的频率限制，公网部署时仍然需要在反向代理层做认证、TLS 和限流。我的做法是干脆不暴露到公网：Homepage 跑在家里的服务器上，只通过 [[Tailscale]] 访问。导航页上有大量内网地址和服务信息，放到公网上实在没有必要冒这个风险。

## 和 Homer 的对比

Homer 也还在维护，GitHub 上有大约 11700 个 Star。它的定位没有变，README 里第一句话就是「A dead simple static HOMepage for your servER」。下面这张表是我把两者放在一起对比的结果：

| 对比项 | Homer | Homepage |
| --- | --- | --- |
| 架构 | 纯静态 HTML/JS，基于 Vue | Next.js，有 Node.js 服务端 |
| 配置方式 | 单个 `config.yml` | 按用途拆成多个 YAML，支持 Docker label 和 K8s 注解 |
| 服务集成 | 50 多种 Smart Card | 100 多种服务 widget |
| 数据获取 | 浏览器直接请求各服务 API | 服务端代理请求 |
| API Key | 写在 `config.yml` 里，任何访问者都能下载 | 保存在服务端，支持环境变量和文件注入 |
| 跨域问题 | 受 CORS 限制，需要额外配置 | 没有，服务端请求不涉及 CORS |
| 自动发现 | 不支持 | 支持 Docker、Swarm、Kubernetes |
| 内置登录 | 无 | 可选密码或 OIDC 登录 |
| 资源占用 | 很低，任意静态服务器都能托管 | 需要运行一个 Node.js 进程 |
| 默认端口 | 8080 | 3000 |

最值得展开说的是数据获取方式。Homer 的 Smart Card 其实也支持不少服务，包括 Proxmox、Uptime Kuma、Gitea、Home Assistant、Nextcloud 等 50 多种，但因为它没有后端，所有请求都是浏览器直接发出去的。这带来两个问题。第一是 CORS，Homer 官方文档写得很直白，Smart Card 受跨域限制，要么把所有服务放在同一个域名下，要么去给每个服务加 CORS 头，要么额外部署一个代理，比如 Home Assistant 就需要把 Homer 的地址加进 `cors_allowed_origins` 才能用。第二是密钥泄露，Homer 的文档原话是 `config.yml` 会通过 `/assets/config.yml` 直接暴露出去，里面的 API Key 任何能访问这个页面的人都能看到。所以在 Homer 里用 Smart Card，前提是整个页面必须放在认证后面。

Homepage 走服务端代理，这两个问题都不存在了。代价就是多了一个常驻进程，也多了一个需要关注安全更新的组件。对于只想要一个漂亮书签页的人来说，Homer 仍然是更轻的选择，它的 release 包解压后用 `python -m http.server` 就能跑起来，扔到 [[Cloudflare Pages]] 这类静态托管上也完全没问题。

## 我的使用建议

如果你的服务只有十来个，并且不在意状态显示，Homer 足够了，配置文件一个人维护起来没有任何负担。如果服务多、分散在多台机器上，或者你希望打开页面就能看到服务健康状况，Homepage 明显更合适。

在服务分散在多台 VPS 上的场景下，我不推荐依赖 Docker label 自动发现。每台机器都需要暴露 Docker socket 给 Homepage，即使加上 socket proxy 也是额外的攻击面。我的做法是手写 `services.yaml`，放到 Git 仓库里管理，在 `description` 里写上服务部署在哪台机器、有没有备份，这样 Homepage 就同时承担了服务清单的角色，取代了我那张过时的 Markdown 表格。只有同一台机器上的容器我才用 label 自动发现。

状态监控方面，我没有给每个服务都配 `siteMonitor`，而是让 [Uptime Kuma](https://blog.einverne.info/post/2023/11/uptime-kuma-website-monitor.html) 统一负责探测和告警，Homepage 只挂一个 Uptime Kuma widget 显示总体状态，再给几个核心服务加上专属 widget。这样职责分得比较清楚：Uptime Kuma 管告警，Homepage 管导航和概览，不会两边重复探测。

图标方面，Homepage 可以直接使用 Dashboard Icons 图标库，`icon` 字段写 `proxmox.png`、`jellyfin.png` 这样的名字就行，也可以用 `mdi-`、`si-`、`sh-` 前缀分别引用 Material Design Icons、Simple Icons 和 selfh.st 图标。这比 Homer 时代自己下载 PNG 放进 assets 目录省事很多。需要注意的是这些图标是浏览器从远程 CDN 加载的，完全离线的内网环境要把图标下载下来挂载到 `/app/public/icons`，再用 `/icons/xxx.png` 引用。

## 最后

从 Homer 到 Homepage，变化的其实是我自己的需求。以前我只需要一个能把链接整理好的页面。到了 2026 年，我更需要的是一个能告诉我「现在一切正常吗」的地方。Homepage 的服务端代理、自动发现和丰富的 widget 正好补上了这一块。

Homepage 当然也不是终点。它不负责告警，也不会替你管理容器，这些交给 Uptime Kuma、[[Portainer]] 或者 Rancher 这样的专门工具更合适。把导航、监控和容器管理分开，每个工具只做好自己的那件事。


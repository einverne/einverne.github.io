---
layout: post
title: "呆呆面板 daidai-panel：轻量级青龙面板替代品介绍与 Docker 部署教程"
aliases:
- "呆呆面板 daidai-panel：轻量级青龙面板替代品介绍与 Docker 部署教程"
tagline: "Go + Vue3 + SQLite 写成的定时任务管理面板，兼容青龙脚本，还内置了 MCP"
description: "呆呆面板（daidai-panel）是一款用 Go、Vue3 和 SQLite 构建的开源定时任务管理面板，定位类似青龙面板，支持 Python、Node.js、Shell、TypeScript、Go 脚本的定时执行、订阅拉取、环境变量、依赖管理、22 种通知渠道、Open API 和 MCP。本文介绍它的功能与适用场景，并给出 Docker Compose 部署、镜像标签选择、反向代理、更新和账号恢复的实践经验。"
category: 经验总结
tags: [daidai-panel, qinglong, cron, self-hosted, docker, scheduled-task, mcp, homelab]
create_time: 2026-10-17 08:30:00
last_updated: 2026-10-17 09:00:46
---

Homelab 里跑久了，总会攒下一堆零散的小脚本：每天早上抓一次汇率发到 Telegram，定时检查几个网站的证书有没有快过期，隔一段时间把某个 API 的数据拉下来存一份，再加上各种网站的自动签到。最开始我都是直接写进服务器的 crontab，时间一长就发现问题很多，脚本散落在不同的机器上，日志不知道去哪看，失败了也没人通知，Python 依赖装在系统里还经常和别的东西打架。几年前我为此折腾过 [[qinglong|青龙面板]]，最近在 GitHub 上又看到一个定位几乎一样、但更轻量的新项目，叫呆呆面板（[[daidai-panel]]）。

![呆呆面板 daidai-panel](https://pic.einverne.info/images/2026-10-17-10-30-00-daidai-panel.png)

## 呆呆面板是什么

呆呆面板（Daidai Panel，英文仓库名 [daidai-panel](https://github.com/linzixuanzz/daidai-panel)）是一个开源的定时任务管理平台，采用 MIT 协议。用一句话概括，它就是一个带 Web 界面的 cron：你在浏览器里上传或在线编写脚本，配置 Cron 表达式，面板负责按时执行、记录日志、在失败时推送通知。它支持的脚本语言包括 Python、Node.js（含 `.js` 和 `.mjs`）、Shell、TypeScript 和 Go，基本覆盖了日常自动化脚本会用到的全部语言。

技术栈方面，后端是 Go 1.25 + Gin + GORM，数据库用 SQLite（选的是纯 Go 实现的 `glebarez/sqlite`，编译时 `CGO_ENABLED=0`），前端是 Vue 3 + TypeScript + Element Plus，编辑器默认用 CodeMirror 6，桌面端可以切换成 Monaco。Docker 镜像内部由 Nginx 对外提供 5700 端口，再把 `/api/*` 反代到 5701 端口的 Go 后端。项目在 2026 年 3 月创建，到我写这篇文章的时候已经迭代到 v3.3.7，GitHub 上有接近 600 个 Star，提交非常频繁，几乎每隔几天就有新版本。作者在 README 的致谢里写得很清楚，后端架构参考了 [[白虎面板]]（Baihu Panel），部分代码基于它改进，而定时任务、环境变量、订阅管理这些核心功能的设计则借鉴自青龙面板。

## 为什么不直接用青龙面板

用过青龙面板的人看到呆呆面板的界面会有很强的熟悉感，因为它本来就是冲着青龙的使用习惯来设计的。环境变量支持批量导入导出，格式兼容青龙；订阅管理里的白名单、黑名单、依赖规则三个字段，对应的就是青龙 `ql repo` 命令的第 2、3、4 个参数；甚至在 v3.2.0 之后还加了一层青龙脚本兼容层，Docker 部署时会在容器里模拟 `/ql/data/scripts`、`/ql/shell/env.sh` 这类路径，那些一上来就 `source $QL_DIR/shell/env.sh` 的老脚本可以直接跑起来。所以从青龙迁移过来的成本是比较低的。

既然功能差不多，为什么还要换？我看下来主要有这么几点差异。第一是体积和资源占用，青龙是 Node.js 全家桶，呆呆面板的后端是一个 Go 二进制，加上 SQLite 单文件数据库，整个面板的状态就是一个 `Dumb-Panel` 目录，备份和迁移非常省心。第二是运行环境的选择更细，官方镜像分 Alpine 和 Debian 两个基础系统、精简和完整两个工具档位，还可以指定 Python 3.10、3.11、3.12，甚至有三个 Python 版本共存的镜像，支持 amd64、arm64、386、arm/v7 四种架构，连树莓派 Zero 2W 这种老设备都照顾到了。第三是部署方式更多样，除了 Docker，还提供了 Windows 免安装版（解压后双击 `start.bat`）和 Android Magisk 模块（Root 手机上直接跑，不需要 Termux）。第四是它对 AI 时代的工具链跟得很紧，内置了 MCP 服务，这一点我后面单独说。

当然也要客观看待，青龙面板经过多年的社区打磨，生态和教程都远比呆呆面板丰富，呆呆面板毕竟是一个 2026 年才出现的新项目，更新节奏快也意味着可能会有变化和不稳定的地方。如果你现在的青龙用得好好的，没必要为了换而换；如果是新部署，或者对青龙的资源占用和维护状态有意见，呆呆面板值得试一试。

## 主要功能

呆呆面板的功能模块和青龙基本一一对应，但很多细节做得更深入，我挑几个自己比较在意的说一下。

定时任务是最核心的模块，除了标准的 Cron 表达式调度，还支持失败重试、执行超时、定时停止、多实例并发控制，以及前置和后置钩子，可以把多个任务串成依赖链。执行日志通过 SSE 实时推送到浏览器，会自动跟随最新输出，往上翻就暂停滚动，这种细节用起来很舒服。环境变量模块会自动识别名字里带 TOKEN、COOKIE、PASSWORD 之类关键词的变量，默认遮蔽显示，避免在别人面前打开面板时把敏感值直接露出来。任务执行时，环境变量会自动注入到脚本进程里。

依赖管理是我觉得做得最用心的部分。它可以可视化地安装和卸载 pip、npm 依赖，还能装 Linux 系统包，并且会自动识别容器里用的是 `apk`、`apt`、`dnf`、`yum`、`microdnf` 还是 `zypper`。README 里专门花了很大篇幅解释 pip 报 `Failed building wheel`、`gcc: not found`、`CMake must be installed` 时该怎么办，面板本身也会分析安装日志，在失败原因里直接告诉你是缺编译工具链还是 musl 上没有预编译包。对于经常在 Alpine 里被 Python 原生扩展折磨的人来说，这些提示能省下不少时间。

订阅管理可以从 Git 仓库定期拉取脚本，支持 SSH Key 和 Token 认证，脚本头部声明了 cron 的会自动建成定时任务。通知推送内置了 22 种渠道，常见的 Bark、Telegram、Server 酱、企业微信、钉钉、飞书都在里面。安全方面支持 2FA、IP 白名单、登录日志和多设备会话管理，备份可以一键执行，也能按天、周、月定时备份。另外还有 Open API，用 App Key 和 App Secret 认证，方便和第三方系统对接，作者还单独做了一个手机客户端 [Dumb-Panel-APP](https://github.com/linzixuanzz/Dumb-Panel-APP)。

还有一个很实用的设计是脚本内回调面板。任务执行时，面板会往脚本进程里注入 `DAIDAI_API_BASE` 和 `DAIDAI_TOKEN` 两个环境变量，前者是面板 API 的根地址，后者是一枚只在本次运行期间有效的临时令牌。脚本拿着它们就能直接发 HTTP 请求回调面板，比如发通知、更新环境变量、查询任务、触发订阅拉取，不需要另外申请 Open API 应用，也不用把账号密码写进脚本里。典型的场景是某个脚本刷新了 Token 之后，把新值写回面板的环境变量，下一次运行就能直接用。

## 内置 MCP 服务

这是呆呆面板和青龙最明显的代差。面板内置了一个 [[MCP]] 服务，[[Claude]]、[[Cursor]]、[[Cherry Studio]] 这些支持 MCP 的客户端连上之后，可以直接用自然语言查任务、看日志、巡检失败的任务。它提供两种连接方式，一种是 Streamable HTTP，地址是 `http://<面板地址>/api/v1/mcp`，适合大多数客户端；另一种是 stdio，在容器里执行 `ddp mcp` 命令，适合只支持拉起本地进程的客户端。

MCP 默认是关闭的，需要在「系统设置」里手动打开。所有 MCP 工具调用最终都走面板的开放 API，能访问哪些模块由 Open API 应用的权限范围决定，每次调用都会记进调用日志并计入频率限制。默认情况下只读，管理员放开写入之后，AI 才能运行任务、修改环境变量和脚本。我觉得这个默认值设得很合理，让 AI 帮忙看「昨晚哪些任务失败了、报的什么错」是非常省事的用法，至于让 AI 直接改线上脚本，还是谨慎一点比较好。

## 如何搭建

官方推荐用 Docker Compose 部署。如果想先看看界面再决定要不要装，可以直接打开作者提供的 [在线演示](https://linzixuanzz.github.io/daidai-panel/)，那是前端单独打包加浏览器内模拟数据做的，没有后端，所有操作只存在你自己的浏览器里，刷新就恢复，所以千万不要在里面填真实的 Cookie 或密钥。

### Docker Compose 部署

新建一个目录，比如 `~/dockerfile/daidai-panel`，在里面创建 `docker-compose.yml`。下面这份基于官方配置，我把时区改成了 `Asia/Tokyo`，并且把 Watchtower 的令牌改成从 `.env` 读取，你按自己的情况调整即可：

```yaml
name: daidai-panel

services:
  daidai-panel:
    image: ${DAIDAI_PANEL_IMAGE:-linzixuanzz/daidai-panel:latest}
    container_name: daidai-panel
    restart: unless-stopped
    ports:
      - "5700:5700"
    volumes:
      - ./Dumb-Panel:/app/Dumb-Panel
    environment:
      - TZ=Asia/Tokyo
      - CONTAINER_NAME=daidai-panel
      - IMAGE_NAME=${DAIDAI_PANEL_IMAGE:-linzixuanzz/daidai-panel:latest}
      - PANEL_UPDATE_MANAGER=watchtower
      - WATCHTOWER_HTTP_API_URL=http://watchtower:8080
      - WATCHTOWER_HTTP_API_TOKEN=${WATCHTOWER_HTTP_API_TOKEN}
      - WATCHTOWER_HTTP_API_PERIODIC_POLLS=true
    labels:
      - com.centurylinklabs.watchtower.enable=true

  watchtower:
    image: nickfedor/watchtower:latest
    container_name: daidai-watchtower
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    labels:
      - com.centurylinklabs.watchtower.enable=false
    environment:
      - WATCHTOWER_HTTP_API_TOKEN=${WATCHTOWER_HTTP_API_TOKEN}
      - WATCHTOWER_HTTP_API_PERIODIC_POLLS=true
      - WATCHTOWER_HTTP_API_ENDPOINTS=update
    command:
      - --label-enable
      - --cleanup
      - --interval
      - "3600"
```

同目录下创建 `.env`：

```bash
DAIDAI_PANEL_IMAGE=linzixuanzz/daidai-panel:latest
WATCHTOWER_HTTP_API_TOKEN=换成一串随机字符串
```

令牌可以用 `openssl rand -hex 16` 生成。然后启动：

```bash
docker compose up -d
```

浏览器访问 `http://服务器IP:5700`，第一次进入会让你初始化管理员账号。这份配置里有一个设计值得注意，`docker.sock` 只挂给了 Watchtower，没有挂给面板容器本身，面板需要更新时通过 Compose 内部网络调用 Watchtower 的 HTTP API，而这个 API 也没有映射到宿主机。官方 compose 里给令牌设了一个默认值 `daidai-panel-watchtower-token`，虽然它只在内部网络可达，但我还是建议换成自己的随机值。如果你不需要自动更新，可以参考后面不使用 Watchtower 的精简配置。

### Watchtower 版本的坑

这里有一个 README 用警告框反复强调的坑：Watchtower 必须是 v1.20.0 或更新的版本。上面配置里的 `WATCHTOWER_HTTP_API_ENDPOINTS=update` 是 v1.20.0 才引入的环境变量，旧版本遇到不认识的环境变量会静默忽略，容器照常启动，日志也不报错，但 8080 端口根本没开，面板里点「检查系统更新」只会得到 `connection refused`。更隐蔽的是，Watchtower 自己打了 `com.centurylinklabs.watchtower.enable=false` 标签避免自己更新自己，所以本地如果早就有一份旧的 `nickfedor/watchtower:latest`，它会一直停留在那个版本。如果你之前用过这个镜像，先手动拉一次再确认版本：

```bash
docker compose pull watchtower
docker compose up -d watchtower
docker logs daidai-watchtower 2>&1 | head -n 5
```

### 不使用 Watchtower 的精简配置

我自己其实不太喜欢让容器在半夜自动更新，尤其是这种迭代很快的项目，更希望看过更新日志之后再手动升级。另外 Watchtower 需要挂载 `docker.sock`，等于拿到了宿主机 Docker 的全部权限，能少一个这样的容器就少一个。如果你也是这么想的，可以把 `watchtower` 服务、`labels`、`PANEL_UPDATE_MANAGER` 和所有 `WATCHTOWER_*` 变量都删掉，`docker-compose.yml` 就只剩下面这几行：

```yaml
name: daidai-panel

services:
  daidai-panel:
    image: linzixuanzz/daidai-panel:latest
    container_name: daidai-panel
    restart: unless-stopped
    ports:
      - "5700:5700"
    volumes:
      - ./Dumb-Panel:/app/Dumb-Panel
    environment:
      - TZ=Asia/Tokyo
```

这样也就不需要 `.env` 文件了，想换镜像直接改 `image` 这一行，比如换成 `linzixuanzz/daidai-panel:debian`，或者固定到 `linzixuanzz/daidai-panel:3.3.7` 这样的具体版本。代价是面板里「检查系统更新」的一键更新用不了，因为精简版镜像里没有 Docker CLI，面板没法自己拉镜像重建容器。需要升级的时候，在 compose 所在目录手动执行：

```bash
docker compose pull
docker compose up -d
```

如果固定了版本号，先把 `image` 里的版本改成新版本再执行这两条命令即可。旧镜像不会自动清理，偶尔执行一下 `docker image prune` 释放磁盘空间。

### 选择合适的镜像标签

默认的 `latest` 是 Alpine + Python 3.12 精简版，跑普通的 Python、JavaScript、Shell 脚本完全够用，体积也最小。但有几种情况需要换标签，通过 `.env` 里的 `DAIDAI_PANEL_IMAGE` 修改即可，Compose 会同时作用到 `image` 和 `IMAGE_NAME`，不会出现运行标签和更新标签不一致的情况。

| 需求 | 推荐标签 |
| --- | --- |
| 普通 Python / Node.js / Shell 脚本 | `latest` |
| 需要跑 Go 任务，或现场编译原生扩展 | `latest-full` |
| Playwright、Chromium 浏览器自动化 | `debian` 或 `debian-full` |
| 依赖只发布 glibc 预编译包的 Python 库（如 `opencv-python`、`onnxruntime`） | `debian` |
| 指定 Python 3.10 或 3.11 | `latest-3.10`、`debian-3.11` 等 |
| 需要多个 Python 版本共存 | `latest-all`、`debian-all` |

我的建议是，只要涉及浏览器自动化或者科学计算类的 Python 包，就直接上 Debian 版。原因是 PyPI 上很多包只发布认 glibc 的 `manylinux` wheel，不发 `musllinux` wheel，在 Alpine 上要么报 `No matching distribution found`，要么回退到源码编译，而完整版镜像虽然多了 gcc、make，却同样没有 CMake，换档位往往解决不了问题，换成 Debian 反而能直接下载预编译包，几秒就装完。另外需要注意，Alpine 和 Debian 用的 C 库不同，沿用同一个数据目录切换镜像时，之前装好的 Python 原生扩展会加载失败，v3.3.3 之后面板启动时会自动检测并重装，更早的版本需要手动删除 `Dumb-Panel/deps/python/<版本>` 目录再重启。

NAS 用户可以额外设置 `PUID` 和 `PGID` 让容器以宿主机用户身份运行，这样 SMB 或 NFS 共享下的文件属主才对得上。两个变量要同时设置，代价是降权后面板里装不了 Linux 系统包，但 pip 和 npm 依赖不受影响。

### 反向代理

如果要通过域名访问，反代的目标应该是宿主机上的 5700 端口，而不是容器内部的 5701，绕过容器内的 Nginx 直连 Go 后端会导致 SSE 断流和鉴权丢失。另外 SSE 日志流要求关闭 `proxy_buffering`，一个最小的 Nginx 配置如下：

```nginx
location / {
    proxy_pass http://127.0.0.1:5700;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_read_timeout 300s;
}
```

用公网域名访问时，记得在环境变量 `CORS_ORIGINS` 里加上你的域名，私有和局域网 IP 面板已经自动放行了。我个人更倾向于不把这类面板暴露到公网，它本质上能在服务器上执行任意代码，依赖管理页甚至提供了网页版的系统命令行。放在内网，外部通过 [[Tailscale]] 或者 [[Cloudflare Tunnel]] 加一层 Access 认证来访问会更安心，如果一定要公网暴露，至少把 2FA 和 IP 白名单都打开。

## 日常运维与避坑

容器里预置了一个叫 `ddp` 的命令行工具（没叫 `dd` 是因为会和 Linux 自带的 `dd` 冲突），日常运维基本都可以通过它完成。最常用的是账号恢复，忘了密码不需要删数据重装：

```bash
docker exec -it daidai-panel ddp list-users
docker exec -it daidai-panel ddp reset-password admin NewPass123
docker exec -it daidai-panel ddp disable-2fa admin
docker exec -it daidai-panel ddp ip-whitelist clear
```

最后一条在 IP 白名单填错、把自己锁在门外的时候非常有用。除此之外，`ddp status` 可以查看版本、端口、任务数和资源占用，`ddp check` 会检查配置、数据库和运行时，`ddp task run 12` 可以同步执行某个任务并实时输出，`ddp backup create --name nightly` 用来手动备份。需要注意的是，如果想在脚本里触发另一个任务，官方文档明确要求走 HTTP 接口，而不是在脚本里调用 `ddp task run`。

更新方面，最省事的是在面板「系统设置」→「概览」里点「检查系统更新」，面板会识别当前的部署方式，Docker 部署走 Watchtower 拉新镜像重建容器，二进制部署自动下载对应平台的 Release 包替换程序。由于 `latest` 是浮动标签，配合 Watchtower 每小时检查一次，相当于一直跟着最新版跑。考虑到这个项目更新很快，如果你的任务比较重要，可以把标签固定到某个具体版本（比如 `3.3.7`），看过更新日志之后再手动升级，稳定性会好很多。

备份就更简单了，整个面板的状态都在 `Dumb-Panel` 目录里，包括 SQLite 数据库 `daidai.db`、自动生成的 JWT 密钥、脚本、依赖、日志和面板自己做的备份。迁移的时候把这个目录整个带走，在新机器上用同样的 compose 启动就行。不过要注意这个目录里有所有环境变量的明文和 JWT 密钥，备份到云端的时候最好加密一下。

还有一个 Node.js 脚本作者容易踩的坑值得一提：如果某个 Promise 永远不 resolve 也不 reject，事件循环排空后 node 会以退出码 0 正常退出，从外面看就像任务成功了。呆呆面板默认会检测这种「半路静默结束」，命中时把退出码置为 75 并判定失败，日志里会出现 `[任务疑似半路结束]`。如果你的脚本里有故意抛弃的 Promise 导致误报，可以在主流程末尾加一行 `globalThis.daidaiDone?.()` 声明脚本已经跑完。另外脚本末尾尽量不要调用 `process.exit()`，它不会等待 stdout 写完，经常导致日志最后那段汇总丢失。

## 最后

对于想在 Homelab 或者一台小 VPS 上统一管理定时脚本的人来说，一个 Go 二进制加一个 SQLite 文件的架构足够轻，Docker 一条命令就能起来，迁移只需要带走一个目录。呆呆面板把青龙面板的使用习惯用 Go 重新实现了一遍，并且文档写的非常详细。

不过它还是一个只有半年多历史的新项目，迭代速度很快，长期的维护情况还需要时间来验证，重要的任务建议固定版本号、定期备份 `Dumb-Panel` 目录。我接下来打算把散落在几台机器 crontab 里的脚本逐步收拢进来，再试试通过 MCP 让 Claude 每天帮我巡检一遍失败的任务，有新的体验再回来补充。

这篇主要讲的是面板本身是什么、怎么搭起来，而面板真正有意思的地方在于往里面放什么脚本。下一篇我会专门聊聊呆呆面板的各种玩法：比如用 [smzdm_script](https://github.com/hex-ci/smzdm_script) 完成什么值得买的每日签到和任务，给 PT 站点定时登录保活、避免因为长期不登录被清理账号，每天收盘后拉取自选股行情并交给大模型做一份分析推送到手机，再加上 B 站每日任务、网盘和论坛签到、网站与证书监控这类零碎但实用的自动化。也会顺带讲讲订阅白名单怎么写、Cookie 怎么抓、多账号怎么配，以及哪些玩法存在封号风险需要谨慎，感兴趣的话可以关注一下。

## 参考链接

- [linzixuanzz/daidai-panel](https://github.com/linzixuanzz/daidai-panel)
- [呆呆面板在线演示](https://linzixuanzz.github.io/daidai-panel/)
- [呆呆面板 MCP 使用说明](https://github.com/linzixuanzz/daidai-panel/blob/main/docs/mcp.md)
- [脚本内调用面板能力](https://github.com/linzixuanzz/daidai-panel/blob/main/docs/script-api.md)
- [whyour/qinglong](https://github.com/whyour/qinglong)

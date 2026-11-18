---
layout: post
title: "Semaphore UI：开源自托管的 Ansible 与 Terraform 可视化管理面板"
aliases: ["Semaphore UI：开源自托管的 Ansible 与 Terraform 可视化管理面板"]
tagline: "比 AWX 轻得多的自动化运维 Web 界面"
description: "介绍开源自托管的 Semaphore UI，它为 Ansible、Terraform、OpenTofu、Bash、PowerShell 等工具提供 Web 界面、定时任务、权限管理和 API，并给出 Docker 部署方式和使用建议。"
category: "产品体验"
tags: [semaphore-ui, ansible, terraform, opentofu, devops, self-hosted, homelab]
create_time: 2026-11-12 10:00:00
last_updated: 2026-11-12 10:00:00
---

我手上的 VPS 和 Homelab 日常维护基本交给 [[Ansible]]：初始化系统、加固 SSH、轮换密钥、装 Docker，一条 `ansible-playbook` 跑下去几十台机器就同步好了。用久了有两个问题越来越明显。第一，执行记录只存在于终端滚动缓冲区里，过两周再想知道某台机器上次是什么时候跑过哪个 playbook、结果如何，基本无从查起。第二，所有操作都绑在我自己的 MacBook 上，私钥、inventory、vault 密码都在本地，换台电脑或者想让别人帮忙执行一下就很麻烦。最近在找解决方案的时候，重新注意到了 [[Semaphore UI]] 这个项目，它正好就是为这类场景设计的。

![Semaphore UI](https://pic.einverne.info/images/2026-11-12-semaphore-ui-cover.png)

## Semaphore UI 是什么

Semaphore UI 是一个开源、自托管的基础设施自动化 Web 界面和 API，用 Go 编写，MIT 协议。项目最早叫 Ansible Semaphore，2014 年就在 GitHub 上创建了，定位很单纯，就是给 Ansible playbook 套一个好用的 Web 界面。后来项目改名为 Semaphore UI，支持的工具也从 Ansible 扩展到了 [[Terraform]]、[[OpenTofu]]、Terragrunt、PowerShell、Bash 和 Python。

Semaphore UI 的核心思路是自动化代码依然放在 Git 仓库里，Semaphore 负责“谁、在什么时候、用什么凭据、对哪些机器、执行了什么”这件事。你在界面上把 Git 仓库、SSH 密钥、主机清单和变量组合成一个任务模板，之后点一下按钮、设一个定时，或者用 API 和 Webhook 触发，就能执行，每次执行的完整日志和结果都会被记录下来。

说到 Ansible 的 Web 界面，绕不开的对比对象是 [[AWX]]（以及它的商业版 Ansible Tower，现在叫 Ansible Automation Platform）。AWX 功能很全，但它现在只支持部署在 Kubernetes 上，要通过 AWX Operator 安装，依赖 PostgreSQL、Redis 和一堆组件，对于个人或者小团队来说太重了。Semaphore 则是一个单独的 Go 二进制文件，数据库可以直接用 SQLite（v2.16 之后），一个容器就能跑起来，资源占用很低，这也是官网把自己称作“AWX 替代品”的底气所在。另外一个常被拿来比较的是 [[Rundeck]]，Rundeck 更偏通用作业调度，Java 写的，体量也不小；如果你的主力工具就是 Ansible 和 Terraform，Semaphore 的概念模型会更直接一些。

## 核心概念与功能

第一次打开 Semaphore 的界面，最好先理解它的几个核心对象，因为创建任务模板之前需要把这些东西准备好，顺序搞反了会来回跳页面。

Project 是最顶层的隔离单位，每个项目有自己的成员、密钥、仓库和模板，适合按业务或者环境划分，比如“个人 VPS”“Homelab”“公司测试环境”分别建一个项目。Key Store 用来存放 SSH 私钥、登录密码、Ansible Vault 密码和 API Token，数据会用 `SEMAPHORE_ACCESS_KEY_ENCRYPTION` 指定的密钥加密后存进数据库，执行任务时才解密注入，界面上看不到明文。Repository 指向你的 Git 仓库，支持 GitHub、GitLab、Bitbucket、Gitea 和 Azure Repos，私有仓库就在这里关联 Key Store 里的 SSH 密钥，也可以直接指向服务器本地的目录。Inventory 是主机清单，可以手写静态 inventory，也可以引用仓库里的文件，官网还提到支持 NetBox 和 Consul 作为动态 inventory 来源。Variable Group（旧版本叫 Environment）用来存放额外变量和环境变量，相当于执行时的 `--extra-vars`，敏感变量也可以标记为 secret。

把这些准备好之后，就可以创建 Task Template 了。一个模板就是“用哪个仓库里的哪个 playbook，搭配哪份 inventory、哪组变量、哪把密钥”的组合，类型可以选 Ansible、Terraform/OpenTofu、Bash、PowerShell 或 Python。模板创建好之后，日常使用就是点一下 Run，可以选择是否开启 `--check` 干跑和 `--diff`，执行过程会实时输出日志，结束后保留在历史记录里，谁触发的、耗时多久、成功还是失败都一目了然。

除了手动执行，下面这些功能是我觉得最实用的：

- Schedules：基于 cron 表达式的定时任务，可以用来替代散落在各台机器上的 crontab，比如每周跑一次系统更新、每天检查一次证书，好处是执行历史集中在一个地方
- Workflows：把多个模板串成多步骤流程，支持依赖关系和人工审批，比如先 Terraform 开机器，再 Ansible 初始化
- API 与 Webhook：完整的 REST API，提供 Swagger 文档和 Postman 集合，可以从 CI/CD 或者其他系统触发任务，也可以接收 GitHub 的 Webhook 在代码推送后自动执行
- 通知：任务失败或成功可以推送到 Slack、Teams、Telegram、邮件、Gotify、钉钉、Rocket.Chat 或者自定义 Webhook
- 权限与审计：基于角色的权限控制，支持 LDAP/AD 和 OIDC 单点登录（Keycloak、authentik、Authelia、Google、GitLab 等），v2.20 加入了审计日志并支持导出到 SIEM
- 自助执行：给非管理员授权运行指定模板，对方不需要 SSH 权限，也接触不到任何凭据

还有两个比较新的点值得一提。一个是官方提供了 Terraform Provider，可以用代码来管理 Semaphore 自身的项目、模板和密钥，实现配置即代码；另一个是提供了 MCP 服务器，可以让 AI Agent 通过 MCP 协议去查询和配置 Semaphore。后者我觉得很有想象空间，比如让 [[Claude Code]] 直接帮你查最近失败的任务日志，或者按描述创建一个新的模板。

## 版本与定价

Semaphore 分为 Community、Pro 和 Enterprise 三个版本，全部都是自托管。Community 版免费且 MIT 开源，Web 界面、API、任务模板、定时任务、Key Store、Git 集成、工作流、日志、通知、RBAC 和 MCP 服务器都包含在内，个人和 Homelab 用户完全够用。

Pro 版起价 $20 每月，按年付是 $199 每年，起步配置包含 50 个受管节点、500 个受管资源、1 个用户、1 个 Project Runner 和 1 个实例，可以免费试用 30 天，不需要绑卡。Pro 主要增加了 Project Runner 和按标签路由任务、Docker 隔离执行、内置的 Terraform/OpenTofu HTTP state 后端、HashiCorp Vault 和 OpenBao 密钥存储、任务执行摘要和日志导出，以及 48 小时工作日响应的技术支持。Enterprise 再往上加了 Kubernetes 执行、高可用（通过 Redis 协调）、离线授权、自定义角色和细粒度权限、AWS Secrets Manager 和 Azure Key Vault 等集成，价格需要找销售报价。

不过需要注意官网 2FA、TOTP、LDAP 和 OIDC 列，在购买之前确认是否在 Pro 中。

## 用 Docker 部署

官方提供了二进制包、Docker、Helm Chart 和 Snap 几种安装方式，Homelab 场景下我推荐 Docker。官方文档给出的 docker-compose 示例默认用 MySQL，对个人使用来说没有必要，直接用 SQLite 会简单很多，一个服务就够了：

```yaml
services:
  semaphore:
    image: semaphoreui/semaphore:latest  # 生产环境建议固定具体版本
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      SEMAPHORE_DB_DIALECT: sqlite
      SEMAPHORE_DB: /etc/semaphore/semaphore.sqlite
      SEMAPHORE_PLAYBOOK_PATH: /tmp/semaphore/
      SEMAPHORE_ADMIN: admin
      SEMAPHORE_ADMIN_NAME: admin
      SEMAPHORE_ADMIN_EMAIL: admin@localhost
      SEMAPHORE_ADMIN_PASSWORD: changeme
      SEMAPHORE_ACCESS_KEY_ENCRYPTION: 替换为下面命令生成的值
      TZ: Asia/Tokyo
    volumes:
      - semaphore_config:/etc/semaphore
      - semaphore_data:/var/lib/semaphore
      - semaphore_tmp:/tmp/semaphore

volumes:
  semaphore_config:
  semaphore_data:
  semaphore_tmp:
```

其中 `SEMAPHORE_ACCESS_KEY_ENCRYPTION` 是 Key Store 的加密密钥，用下面的命令生成，并且一定要妥善备份。这个值一旦丢失，数据库里加密保存的 SSH 私钥和密码就全部无法解密了。官方示例里写死了一个现成的值，千万不要照抄。

```bash
head -c32 /dev/urandom | base64
```

执行 `docker compose up -d` 之后访问 `http://服务器IP:3000`，用上面配置的管理员账号登录即可。如果需要从公网访问，官方文档有 Caddy、Nginx 和 Apache 的反向代理配置。不过 Semaphore 手里握着所有机器的 SSH 私钥，我个人不建议直接暴露在公网上，放在 [[Tailscale]] 内网里访问，或者通过 [Cloudflare Tunnel](https://blog.einverne.info/post/2023/09/cloudflare-tunnel.html) 再叠一层 [[Cloudflare Access]] 认证会更稳妥。

## 使用建议与避坑

第一个容易踩的坑是 Python 依赖。Semaphore 镜像里自带了 Ansible，但它运行在镜像内置的虚拟环境中，如果你的 playbook 用到了 `community.docker`、`netaddr`、`jmespath` 这类需要额外 Python 包的模块或过滤器，任务会直接报错。解决方法是把 `requirements.txt` 挂载到 `/etc/semaphore/requirements.txt`，容器启动时会自动 `pip install` 到这个虚拟环境里。需要注意每次容器启动都会重新安装一次，所以服务器必须能访问 PyPI，而且安装失败会导致容器起不来；镜像里也没有编译器，尽量选择有预编译 wheel 的包。如果对启动速度和稳定性有要求，更好的办法是基于官方镜像构建自己的镜像，把依赖提前装好。Ansible Galaxy 的 collection 和 role 则可以放在仓库的 `collections/requirements.yml` 和 `roles/requirements.yml` 里，Semaphore 在执行任务前会自动安装。

第二个是关于 SSH 主机密钥校验。Semaphore 在容器里执行 Ansible，容器里的 `known_hosts` 是空的，第一次连接新机器时会因为 host key 验证失败而中断。你可以在仓库的 `ansible.cfg` 里设置 `host_key_checking = False`，但这样会失去中间人攻击防护；更好的做法是把各台机器的公钥预先整理成 `known_hosts` 文件挂载进去。这个取舍需要根据自己的安全要求来决定，不要无脑关掉。

第三个是从命令行迁移过来时的习惯问题。我以前很多 playbook 依赖本地的 `~/.ssh/config` 来定义主机别名、端口和跳板机，搬到 Semaphore 之后这些配置都不存在了。建议把连接信息完整写进 inventory 里，比如用 `ansible_host`、`ansible_port` 和 `ansible_ssh_common_args` 明确指定，这样无论在本地还是在 Semaphore 里执行，行为都是一致的，这本身也是一个让 Ansible 仓库更规范的机会。

最后是数据备份。用 SQLite 的话，整个 Semaphore 的状态就是 `/etc/semaphore` 下的那个数据库文件，再加上前面说的加密密钥。定期备份这两样东西就够了，恢复时把文件放回去、用同一个加密密钥启动即可。如果后面用户和任务量大了，再按官方文档迁移到 MySQL 或 PostgreSQL 也不迟。

## 最后

对我来说，Semaphore UI 最大的价值在于把“在自己电脑上敲命令”变成了“在一个可追溯的平台上执行任务”。代码还在 Git 里，Ansible 和 Terraform 的用法一点没变，但执行历史、定时任务、凭据管理和权限控制都有了着落。和 AWX 比，它的部署成本低一个数量级，一个容器加一个 SQLite 文件就能跑起来，非常适合个人 Homelab 和中小团队。

当然它也不是没有缺点。Pro 和 Community 的功能边界在官网上还不太清晰，Docker 隔离执行、HTTP state 后端这类功能需要付费，复杂的权限场景也需要 Enterprise。但如果你的需求是“管好几十台机器，别再翻终端历史找执行记录”，免费的 Community 版已经绰绰有余。如果你也和我一样用 Ansible 管着一堆 VPS，可以先读一下我之前写的 [Ansible 入门篇一：简单介绍及使用](https://blog.einverne.info/post/2020/05/ansible-introduction.html) 和 [Terraform 使用笔记](https://blog.einverne.info/post/2021/10/terraform-usage.html)，再把 Semaphore 部署起来试一试，我接下来也打算把自己的初始化和密钥轮换 playbook 逐步迁移上去。

## 相关链接

- 官网：<https://semaphoreui.com/>
- GitHub：<https://github.com/semaphoreui/semaphore>
- 安装文档：<https://semaphoreui.com/docs/administration-guide/installation/docker/>


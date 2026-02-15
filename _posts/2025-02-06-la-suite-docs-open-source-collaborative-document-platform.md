---
layout: post
title: "La Suite Docs：法国政府主导的开源协作文档平台"
aliases:
- La Suite Docs：法国政府主导的开源协作文档平台
tagline: "Google Docs 和 Notion 的开源替代方案"
description: "La Suite Docs 是由法国和德国政府联合开发的开源协作文档平台，基于 Django 和 React 构建，支持实时协作编辑和自托管部署，是追求数据主权用户的理想选择"
category: 产品体验
tags: [la-suite-docs, open-source, collaborative-editing, document-management, self-hosted, django, react, notion-alternative, google-docs-alternative, real-time-collaboration, french-government, docker, knowledge-management, data-sovereignty]
last_updated: 2025-02-06
---

最近浏览网页的时候发现有人推荐了一款法国政府开源的实时文档协作工具 La Suite Docs，这是法国政府脱离 Google Docs 而主导开发的开源协作平台。Google Docs 虽然好用，但数据完全不在自己手里；Notion 功能强大，但免费版限制太多，而且同样存在数据主权的问题；Outline 作为开源方案确实不错，可惜编辑器功能相对基础，有时候觉得不够顺手。就在我纠结要不要继续忍受这些小毛病的时候，偶然看到了 La Suite Docs 这个项目，一个由法国和德国政府联合推动的开源协作文档平台，而且已经在 GitHub 上获得了超过 15000 个 Star。

## 什么是 La Suite Docs

[La Suite Docs](https://github.com/suitenumerique/docs) 是由法国政府数字化部门 DINUM（Direction Interministérielle du Numérique）主导开发的开源协作文档平台。这个项目的背景其实挺有意思的，它是 La Suite Numérique（法国政府数字化办公套件）的核心组件之一，而整个套件的开发是法国和德国政府的联合行动。德国那边是由 ZenDiS（Zentrum für Digitale Souveränität，数字主权中心）负责，两个国家的政府机构一起出钱出力，目标就是要打造一套完全开源、可以自托管的办公工具，让政府部门和企业都能掌握自己的数据主权。

这个项目于 2024 年 1 月正式启动，采用 MIT 许可证发布，这意味着不管是个人还是企业都可以自由使用、修改和分发。目前项目已经被认证为 Digital Public Good（数字公共产品），在 GitHub 上有超过 500 个 Fork，55 位核心贡献者参与开发。从代码活跃度和社区参与度来看，这个项目的发展势头相当不错。而且因为有政府资金支持，至少在可预见的未来不用担心项目会突然断更或者被商业公司收购后变质。

从技术栈的角度来看，La Suite Docs 采用了相当现代化的架构设计。后端基于 Django Rest Framework 构建，使用 Python 开发（占代码库约 48.2%），数据存储用的是 PostgreSQL，缓存用 Redis，文件存储则支持任何 S3 兼容的对象存储服务。前端使用 Next.js 框架和 TypeScript（占代码库约 41.8%），富文本编辑器用的是 BlockNote.js，实时协作功能则是基于 Yjs 这个 CRDT 库和 HocusPocus WebSocket 服务实现的。这套技术栈在当前来看是相当成熟且主流的选择，对于想要二次开发或者贡献代码的开发者来说，上手门槛并不高。

## 为什么值得关注

在聊具体功能之前，我想先说说为什么我觉得 La Suite Docs 值得关注。市面上的协作文档工具其实已经很多了，但大多数要么是完全商业化的 SaaS 服务，要么虽然开源但功能相对有限。La Suite Docs 的独特之处在于它试图在开源和功能丰富之间找到一个平衡点，而且背后有政府资金的长期支持，这在开源项目中是比较少见的。

从数据主权的角度来看，这个项目的意义更加重大。我们平时用 Google Docs 或者 Notion，数据都存储在他们的服务器上，虽然方便，但也意味着我们对数据的控制权是有限的。对于一些敏感的企业文档或者个人隐私内容，这种托管模式总让人有些不放心。La Suite Docs 支持完全的自托管部署，数据可以存储在自己的服务器上，这对于注重隐私和数据主权的用户来说是一个很大的吸引力。实际上，法国政府的实例就托管在 OutScale SecNumCloud 上，由 DINUM 团队自行运维，这本身就是对数据主权理念的一种实践。

另外一个让我感兴趣的点是它的定位。La Suite Docs 并不是要做一个大而全的工具，而是专注于协作文档这一个领域。相比 Notion 那种什么都想做的思路，La Suite Docs 更像是一个专注于写作和知识管理的工具，这种克制反而让它在核心功能上做得更加深入。如果你主要的需求就是团队协作写文档、建立知识库，而不需要那些复杂的数据库和项目管理功能，La Suite Docs 可能会是一个更简洁的选择。

## 核心功能体验

说了这么多背景，来聊聊实际的使用体验吧。La Suite Docs 的编辑界面给我的第一印象是干净、简洁，没有太多花里胡哨的东西，打开就能直接开始写。编辑器支持富文本格式和 Markdown 语法，对于习惯了 Markdown 写作的人来说，可以直接用熟悉的语法输入，系统会自动渲染成漂亮的格式。如果你更喜欢所见即所得的方式，通过斜杠命令（输入"/"）可以快速插入各种内容块，比如标题、列表、代码块、引用等等，操作逻辑和 Notion 很像，上手没什么难度。

实时协作是现代文档工具的标配功能，La Suite Docs 在这方面做得也相当不错。多人可以同时编辑同一个文档，你能看到其他人的光标位置和正在编辑的内容，修改会实时同步，整个体验很流畅。这背后用的是 Yjs 这个 CRDT（无冲突复制数据类型）库，技术上保证了即使在网络不稳定的情况下，多人的编辑也不会出现冲突。说到网络问题，La Suite Docs 还支持离线编辑，断网的时候可以继续写，等网络恢复后会自动同步，这个功能对于经常在移动场景下工作的人来说还是挺实用的。

让我比较惊喜的是 AI 功能的集成。La Suite Docs 内置了 AI 助手，可以帮你改写内容、生成摘要、纠正错误、甚至翻译成其他语言。你可以选中一段文字，然后让 AI 帮你润色或者换一种表达方式。虽然 AI 功能现在很多工具都有，但作为一个开源项目能把这个功能做进去，还是说明开发团队在功能上是很上心的。当然，具体的 AI 效果还是要看你用什么模型，自托管的话需要自己配置 AI 服务。

导出功能方面，La Suite Docs 支持多种格式的导出，包括 PDF、DOCX、ODT，而且支持自定义导出模板。这个功能对于需要把文档正式输出的场景很有用，比如生成正式的报告或者提案。不过需要注意的是，PDF 导出功能依赖于 BlockNote XL 包，这个包采用的是 GPL 许可证，和 MIT 不兼容。如果你的使用场景对许可证有严格要求，可以设置环境变量 `PUBLISH_AS_MIT=true` 来构建不含这个功能的版本。

从权限控制的角度来看，La Suite Docs 提供了细粒度的访问权限设置，你可以精确控制谁能查看、谁能编辑某个文档。对于团队使用来说，这种权限管理是必不可少的。系统还支持子页面功能，可以在文档下面建立层级结构，方便构建系统化的知识库。这一点和 Notion 的页面嵌套逻辑类似，用起来很直观。

## 本地部署实践

作为一个喜欢折腾的人，自托管部署自然是我最感兴趣的部分。La Suite Docs 提供了 Docker Compose 和 Kubernetes 两种部署方式，对于个人用户或者小团队来说，Docker Compose 是最简单的选择。官方的部署文档写得比较清晰，整个过程其实不算复杂，但还是有一些细节需要注意。

首先是环境要求。你需要有 Docker 20.10.2 或更新版本，以及 Docker Compose v2.32.4 或更新版本。如果你的服务器上还没有安装 Docker，需要先把这些基础环境准备好。建议把你的用户加入 docker 组，这样运行命令的时候就不需要每次都加 sudo 了。

部署的第一步是克隆代码仓库：

```bash
git clone https://github.com/suitenumerique/docs.git
cd docs
```

然后用 make 命令启动开发环境：

```bash
make bootstrap FLUSH_ARGS='--no-input'
```

这一个命令会自动完成很多事情，包括构建 `app-dev` 和 `frontend-dev` 容器、安装所有依赖、运行数据库迁移、编译翻译文件等等。整个过程可能需要几分钟，取决于你的网络和机器性能。完成之后，你就可以通过 `http://localhost:3000` 访问应用了，默认的登录凭据是用户名 `impress`，密码也是 `impress`。Django Admin 后台可以通过 `http://localhost:8071/admin` 访问。

如果你只想运行后端服务，可以用：

```bash
make run-backend
```

如果想在前端开发模式下运行，用：

```bash
make frontend-development-install
make run-frontend-development
```

关于存储配置，La Suite Docs 默认使用 Minio 作为 S3 兼容的对象存储方案，但你也可以换成其他的 S3 兼容服务，比如 AWS S3、阿里云 OSS 等等。生产环境部署的话，还需要配置 PostgreSQL 数据库、Redis 缓存服务、以及 OIDC 身份认证提供者。如果你打算用 Kubernetes 部署，项目提供了 Helm Chart 配置，但这个就需要你对 K8s 比较熟悉了。

我自己在本地试着跑了一下，整体还是比较顺利的。遇到的一个小坑是 Docker 镜像拉取的时候网络不太稳定，如果你也遇到这个问题，可以考虑配置一下 Docker 镜像加速。另外，第一次启动的时候 make bootstrap 会跑比较长时间，要有点耐心。

## 与同类产品对比

既然提到了 La Suite Docs 是 Google Docs 和 Notion 的替代方案，那就不得不做一下横向对比。这几个产品各有特点，选择哪个主要还是看你的具体需求和使用场景。

先说 Google Docs。作为最老牌的在线协作文档工具，Google Docs 的优势在于稳定、成熟、和 Google 生态的深度整合。如果你的团队已经在用 Google Workspace，那 Google Docs 几乎是无缝衔接的。但问题也很明显，数据完全托管在 Google 的服务器上，对于一些对数据安全有要求的企业或者个人来说，这是一个比较大的顾虑。而且 Google Docs 的 AI 功能现在需要额外付费。

Notion 是我用得比较多的工具，它的优势在于灵活性，数据库、看板、文档、Wiki 全都能做，界面也很漂亮。但 Notion 的问题在于它太想做一个全能工具了，导致有时候反而显得有些臃肿。免费版的限制也比较多，团队使用基本上都需要付费。另外，Notion 同样是完全托管的 SaaS 服务，不支持自托管。

Outline 是我之前比较看好的开源方案，它专注于做知识库和文档管理，界面简洁，支持自托管。但说实话，Outline 的编辑器功能相对基础，和 Notion 或者 La Suite Docs 比起来，在编辑体验上还是有差距的。另外 Outline 采用的是 BSL（Business Source License）许可证，虽然对个人和小团队来说影响不大，但和 MIT 许可证相比还是有一些限制的。

相比之下，La Suite Docs 的定位比较清晰：它就是要做一个好用的协作文档工具，支持自托管，完全开源，而且有政府资金的长期支持。在功能上，它的编辑器体验比 Outline 好，虽然没有 Notion 那么多花样，但核心的文档协作功能做得很扎实。对于那些主要需求就是团队协作写文档、建立知识库的用户来说，La Suite Docs 是一个值得认真考虑的选择。

当然，La Suite Docs 也有它的不足。作为一个相对较新的项目，它的生态还不如 Notion 或者 Google Docs 丰富，第三方集成比较有限。另外，虽然有政府支持，但长期来看项目的发展还是存在一定的不确定性。不过考虑到它是完全开源的，即使官方不再维护，社区也可以接手继续发展。

## 最后

体验了一段时间 La Suite Docs 之后，我觉得这是一个很有诚意的项目。它不是那种为了开源而开源的玩具项目，而是真正在尝试解决实际问题。政府主导开发开源软件这种模式在国内还比较少见，但在欧洲已经有越来越多的成功案例，La Suite Docs 就是其中之一。

对于个人用户来说，如果你对数据隐私比较在意，又想要一个功能完善的协作文档工具，La Suite Docs 是一个不错的选择。自托管部署虽然需要一些技术基础，但整体并不复杂，花半天时间就能搭起来。对于企业用户来说，尤其是那些对数据主权有要求的企业，La Suite Docs 提供了一个商业产品之外的开源选项。

我准备把 La Suite Docs 作为自己的主力文档工具用一段时间，看看长期使用下来的体验如何。如果你也对这个项目感兴趣，可以先去官方的[演示实例](https://notes.liiib.re)体验一下，或者直接拉代码在本地跑起来。项目的 [GitHub 仓库](https://github.com/suitenumerique/docs) 和 Matrix 聊天室（#docs-official:matrix.org）都是获取帮助和参与讨论的好地方。

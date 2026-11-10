---
layout: post
title: "Reminders MenuBar 搭配 NextCloud CalDAV：把菜单栏待办同步到所有设备"
aliases:
- "Reminders MenuBar 搭配 NextCloud CalDAV：把菜单栏待办同步到所有设备"
- "用 NextCloud CalDAV 让 macOS 提醒事项跨平台同步"
tagline: "数据留在自己的 NextCloud 上，Mac 菜单栏里随手记、随手勾"
description: "介绍如何把 NextCloud 的 CalDAV 账户加到 macOS 提醒事项，再用开源的 Reminders MenuBar 在菜单栏里管理待办，让 Apple 提醒事项走出 iCloud，同步到 Android、Windows 和网页端。并提醒避开 NextCloud Deck 生成的只读列表。"
category: 经验总结
tags: [macos, menubar, reminders, nextcloud, caldav, self-hosted, todo]
create_time: 2026-11-10 15:30:00
last_updated: 2026-11-10 15:30:00
---

最近想找一个常驻菜单栏的待办工具，要求很简单：点一下菜单栏就能看到今天要做的事，按个快捷键就能记一条，而且最好能同步到所有设备上。我在 2024 年写过一篇 [推荐一款 macOS 上的极简菜单栏提醒](https://blog.einverne.info/post/2024/05/reminders-menubar.html)，介绍的就是 [[Reminders MenuBar]]。它好用归好用，但数据就是 Apple 提醒事项，背后绑的是 [[iCloud]]：只要手边有一台 Android 手机或者 Windows 电脑，这条同步链路就断了；哪怕都是 Mac，只要某一台登录的不是同一个 iCloud 账号，待办也同步不过去。所以这次我换了个思路，把自己搭建的 [[NextCloud]] 当作 CalDAV 服务器，挂到 macOS 的提醒事项上。Reminders MenuBar 本身不用做任何改动，同步这件事交给 CalDAV，之后在其他平台上，只要找一个能读写 CalDAV 的客户端就能接进来。

![Mac 菜单栏里的待办清单，通过自托管服务器同步到手机和其他电脑](https://pic.einverne.info/images/2026-11-10-15-25-00-reminders-menubar-caldav.png)

## 为什么是 Reminders MenuBar 加 CalDAV

先聊聊我现在的 GTD 方案，其实非常简单：直接维护一个 `Todo.md`，用 Markdown 的无序列表把待办事项一条条列出来。在电脑上用 [[Vim]] 编辑这个文件非常高效，增删改都是几个按键的事，但它有两个绕不开的问题：一是多设备之间的同步，二是手机上缺一个顺手的管理工具。纯文本文件在手机上打开编辑都很别扭，更别说到点提醒了，结果就是出门在外想起什么事，往往没地方记，回到电脑前又忘了。

带着这两个问题，我又看了一圈现成的方案。真正全平台都有客户端的菜单栏待办，主流的还是 [[TickTick]] 和 [[Todoist]]：TickTick 在 Mac 上有菜单栏迷你窗口，在 Windows 上还能放常驻桌面的小组件；Todoist 的全局 Quick Add 很好用，不过在 Linux 上不支持全局快捷键。它们的问题在于数据都在别人的云上，高级功能也要订阅。开源的 [[Super Productivity]] 可以自托管同步，但它偏重时间追踪，作为一个只想随手记几条待办的工具有点重。

Reminders MenuBar 走的是另外一条路。它是一个用 SwiftUI 写的开源小工具，GPL-3.0 协议。它没有自己的账号体系，也没有自己的服务器，只是通过 macOS 的 EventKit 接口读写系统的提醒事项数据库。这一点恰好是它最大的优势：系统提醒事项接的是哪个账户，它就能读写哪个账户。macOS 的提醒事项除了 iCloud，本来就支持 CalDAV 账户，而 CalDAV 是一个开放协议，[[NextCloud]]、[[Radicale]] 都能当服务器，Android 上有 [[DAVx5]]，Windows 和 Linux 上有 [[Thunderbird]]。把这几样东西串起来，就得到了一个数据在自己手里、Mac 上体验原生、其他平台也能接入的待办系统。

当然这条路线也有代价。Apple 新版提醒事项的不少功能只在 iCloud 账户下可用，比如标签、智能列表、附件和基于位置的提醒，在 CalDAV 列表里要么用不了，要么不会同步。提醒事项 App 里那个“升级”提示也只针对 iCloud 列表，CalDAV 列表升级不了。如果你重度依赖标签和智能列表，这个方案就不太合适；如果像我一样只要标题、截止时间、优先级和完成状态，那完全够用。

## 安装 Reminders MenuBar

安装依然是一行 [[Homebrew]] 命令：

```bash
brew install --cask reminders-menubar
```

也可以从 GitHub Releases 下载 dmg 或 zip。第一次启动时它会申请提醒事项的访问权限，之后也可以在系统设置的“隐私与安全性 → 提醒事项”里修改。这两年它加了不少功能：可以用自然语言输入截止日期、列表和标签，可以直接编辑截止时间、优先级、重复规则，能按时间范围查看即将到期的提醒，支持跨列表搜索、按列表和标签筛选，菜单栏图标可以显示成图标、未完成计数或者下一条提醒，也可以用全局快捷键呼出。日常使用时，我基本只用快捷键呼出、输入一行、回车这三步，比打开完整的提醒事项 App 快得多。

## 在 macOS 添加 NextCloud 的 CalDAV 账户

第一步是在 NextCloud 网页上生成一个应用密码。进入头像菜单里的“个人设置 → 安全 → 设备与会话”，新建一个应用密码，名字可以叫 `macOS Reminders`。macOS 账户里填的是这个应用密码，不要填 NextCloud 的登录密码。开了两步验证的话，登录密码根本连不上；而且单独给这台 Mac 一个密码，以后换电脑或者丢电脑，直接在这里吊销就行，不影响其他设备。

第二步是在 macOS 里添加账户。打开“系统设置 → 互联网账户 → 添加账户 → 添加其他账户… → CalDAV 账户”，账户类型选“手动”，用户名填 NextCloud 的用户名，密码填刚才的应用密码，服务器地址填：

```
https://cloud.example.com/remote.php/dav
```

如果手动模式连不上，就改选“高级”。服务器地址只填域名 `cloud.example.com`，服务器路径填 `/remote.php/dav/principals/users/<用户名>/`，端口填 443，勾上“使用 SSL”。账户添加成功后，确认“日历”和“提醒事项”两个开关都打开，提醒事项 App 的侧边栏里就会多出这个账户的分组。

这里有两个细节值得提一下。一是“自动”模式依赖 NextCloud 的 `/.well-known/caldav` 重定向，如果前面套了反向代理或者 [[Cloudflare Tunnel]]，这个重定向很容易配错，比如被跳转到 `http://`，导致客户端在服务发现阶段降级成明文。所以我更推荐直接手动填完整路径，最稳。二是不要为了速度去填局域网地址，比如 `http://192.168.x.x:端口`：明文 http 会把凭据裸传，而且 Mac 一离开家就同步不上了。走公网 HTTPS 域名，在家在外都能用。

## 注意 NextCloud Deck 生成的只读列表

如果 NextCloud 上装了 [[NextCloud Deck]]，账户添加好以后，提醒事项里会多出几个以看板命名的列表。这些是 Deck 通过 CalDAV 自动暴露出来的，用途只是让日历和任务客户端能看到卡片的截止日期。它们在设计上就是只读的，Deck 的源码里新建、修改、删除操作都会直接返回 Forbidden，也没有任何设置可以打开写入。麻烦的是提醒事项分不出这类列表，会把它们当普通列表显示：在里面新建或勾选待办，客户端不报错，但服务器一律拒收，待办只会一直停在本地。

解决办法很简单，建一个普通的任务列表就行。可以在提醒事项侧边栏的 NextCloud 分组下点“添加列表”，也可以在 NextCloud 日历应用里选“新建日历 → 带任务列表的新日历”。建好以后，记得在提醒事项的设置里把“默认列表”改成这个新列表，这样 Reminders MenuBar 快速添加、Siri 添加的待办默认都会写进去。如果不需要在待办客户端里看 Deck 的卡片，还可以在 Deck 设置里关掉日历和任务集成，免得以后误用那些只读列表。

## 其他设备怎么接入

CalDAV 的好处是客户端选择很多，下面是我整理的接入方式。写这篇文章时，我只完整验证了 Mac 写入 NextCloud 这一个方向，下面这几种接入方式还在陆续测试中，大家可以作为参考。

iPhone 和 iPad 最简单，在系统设置里给提醒事项添加同一个 CalDAV 账户，填法和 Mac 一样，Siri 和 Apple Watch 也能顺带用上。Android 上可以用 [[DAVx5]] 同步 CalDAV 账户，它在 F-Droid 上免费，在 Google Play 上收费，然后用 [[Tasks.org]] 之类支持 CalDAV 的任务应用来管理待办。Windows 和 Linux 上可以用 [[Thunderbird]]，它自带任务功能，可以直接订阅 CalDAV 日历；不想装客户端的话，NextCloud 自己的 Tasks 应用在浏览器里就能用。

还有一点要有心理准备：CalDAV 不像 iCloud 那样有推送。在网页或者手机上改了待办，Mac 要等下一次轮询才会拉下来，中间可能隔上几分钟。对于待办这种场景，延迟几分钟问题不大，但如果你期待的是一边改另一边秒变，就会觉得慢。

## 最后

这套组合最让我满意的地方，是它几乎没有引入新东西：Reminders MenuBar 我两年前就在用，NextCloud 本来就跑在家里的服务器上，CalDAV 是一个用了十几年的开放协议，我要做的只是把它们接起来。数据存在自己的服务器上，Mac 上的体验依然是原生的提醒事项，想换客户端随时可以换，不会被任何一家待办服务锁死。和之前的 `Todo.md` 相比，它补上的正好是同步和手机端这两块短板，到点还能有系统级的提醒。


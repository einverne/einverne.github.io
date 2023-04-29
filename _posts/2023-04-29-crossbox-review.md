---
layout: post
title: "CrossBox 使用记录"
aliases:
- "CrossBox 使用记录"
tagline: ""
description: ""
category: 产品体验
tags: [crossbox, email-hosting, email-server, linux, mxroute]
create_time: 2023-04-29 21:54:48
last_updated: 2023-04-29 21:54:48
---

[CrossBox](https://crossbox.io/) 是一个 All-in-One 的，可自行架设的，的通信套件，包含了及时通信，邮件，文件存储等等组件。CrossBox 致力于为托管/电子邮件提供商提供一体化的、100%自托管的通信套件。它允许服务提供商利用现有的基础设施，为客户提供通常仅在 Gmail、Outlook 和其他大型 SaaS 平台上可用的通信功能（并且完全符合 GDPR 规定）。

![](https://photo.einverne.info/images/2023/04/29/Y8Ky.png)

## 服务提供商的特性

最值得注意的功能就是 [CrossBox Cluster](https://crossbox.io/cluster)。它使服务提供商能够为不同服务器上的所有客户提供单一的入口点。其中包括统一的 Webmail URL，统一的 IMAP，SMTP，POP3 主机名以及统一的 MX。在更复杂的线上环境中，提供商还可以选择构建高可用性，负载均衡和地理分布式设置 - 使得它可以轻松实现 100％可用性，水平扩展以及来自世界不同地区的用户获得快速访问。

## 终端用户的特性

CrossBox 集成了超过 40 多个工具和功能，包括了邮件，即时通信，音频和视频通话，会议，屏幕分享，文件存储分享，等等。可以从官方页面的介绍中[了解更多](https://crossbox.io/tour)。或者直接试用线上[版本](https://crossbox.io/demo) 进行体验。

- [Powerful Email Composer](https://crossbox.io/tour/email-composer "Powerful Email Composer")
- [Email Attachment Previewer Built-in](https://crossbox.io/tour/attachment-previewer "Email Attachment Previewer Built-in")
- [Email Scheduling](https://crossbox.io/tour/email-scheduling "Email Scheduling")
- [Email Snoozing](https://crossbox.io/tour/email-snoozing "Email Snoozing")
- [Send Large Email Attachments](https://crossbox.io/tour/send-large-email-attachments "Send Large Email Attachments")
- [Canned Responses](https://crossbox.io/tour/email-canned-responses "Canned Responses")
- [Email Reminders/Follow-ups](https://crossbox.io/tour/email-reminders "Email Reminders/Follow-ups")
- [Spam Learning](https://crossbox.io/tour/spam-learning "Spam Learning")
- [Email Filters](https://crossbox.io/tour/conditions-and-actions-filters "Email Filters")
- [External Email Accounts](https://crossbox.io/tour/external-accounts "External Email Accounts")
- [Auto-purge/auto-sweep Old Emails](https://crossbox.io/tour/purge-email "Auto-purge/auto-sweep Old Emails")
- [Chat, Audio/Video Calls](https://crossbox.io/tour/text-audio-video "Chat, Audio/Video Calls")
- [Screen-sharing](https://crossbox.io/tour/screen-sharing "Screen-sharing")
- [Real-time File Sharing](https://crossbox.io/tour/chat-file-sharing "Real-time File Sharing")
- [Private Files](https://crossbox.io/tour/private-files "Private Files")
- [Team Folder](https://crossbox.io/tour/team-folder "Team Folder")
- [Multi-account](https://crossbox.io/tour/multi-account "Multi-account")
- [Multitasking](https://crossbox.io/tour/multitasking "Multitasking")
- [2FA, Access Recovery](https://crossbox.io/tour/security "2FA, Access Recovery")
- [100+ languages](https://crossbox.io/tour/internationalization "100+ languages")
- [Android/iOS Apps](https://crossbox.io/tour/android-ios-apps "Android/iOS Apps")

CrossBox 的 [White-label Add-on](https://crossbox.io/white-label-branding) 也可以让服务提供商自定义应用的名字，Logo，主题颜色，登录地址，[[webmail]] 域名，IMAP/SMTP/POP3 hostnames，MX 等等细节。更甚至服务提供商可以利用 [在线的应用构建程序](https://crossbox.io/documentation/page/online-apps-builder) 直接生成 Android/iOS 的应用。

CrossBox 还提供了 [[DirectAdmin]]，[[cPanel]]，[[Plesk]] 控制面板的集成。服务提供商一键接入即可，无需任何的修改。[^2]

[^2]: <https://crossbox.io/control-panel>

现在 [EV Hosting](https://crossbox.io/control-panel) 也上线了[自定义域名邮箱服务](https://client.einverne.info/order.php?step=1&productGroup=9)，如果你想要一个可以自己控制的域名邮箱，欢迎订购使用，现在使用 EV_MAIL_INIT 可以享受年付 5 折优惠。

## reference

- <https://crossbox.io/control-panel>

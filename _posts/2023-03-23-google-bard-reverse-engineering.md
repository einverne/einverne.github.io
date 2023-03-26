---
layout: post
title: "Google 聊天机器人 Bard 逆向"
aliases:
- "Google 聊天机器人 Bard 逆向"
tagline: ""
description: ""
category: 学习笔记
tags: [ google-bard, chatbot, chatgpt, reverse-engineering, python, python-lib ]
create_time: 2023-03-23 21:41:59
last_updated: 2023-03-23 21:41:59
---

昨天晚上申请了 Google Bard 试用，今天下班了看到很多人都是几个小时就拿到了试用体验，我想我怎么没有收到邮件呢，我反复确认了邮箱确实没有，然后我想着再去网页上看看呢，登录了一下 <https://bard.google.com/> ，开始的时候没有使用代理，提示所在的地区暂时还不能用，然后加上[美国的代理](https://board.gtk.pw)，刷新一下就进去了。

> Bard 依托 Google 的一款大型语言模型，可以生成文字、撰写各种类型的创意内容，还可以根据它掌握的信息解答你的问题。

进去的第一个弹窗就是「警告」，Bard 是一个实验性的产品，可能不会一直都是正确的，并且 Google Bard 的每一条回复都会有赞同，否定，重新回答，或者直接 Google 的按钮。
![Od34](https://photo.einverne.info/images/2023/03/23/Od34.png)

大型语言模型是会犯错的
![ORxW](https://photo.einverne.info/images/2023/03/23/ORxW.png)

说实话 Google 做这个产品确实非常小心了，在下方的输入框下也有明确的注意事项。

![OZOQ](https://photo.einverne.info/images/2023/03/23/OZOQ.png)


## Python Lib
在调研的过程中发现已经有人[逆向了 Google Bard](https://github.com/acheong08/Bard)。通过如下的方法，然后执行 Python 即可在命令行使用 Bard，不过记住需要使用美国的 IP。

Go to [Google Bard](https://bard.google.com/)

- F12 打开 console
- Copy the values
- 找到 Application → Cookies → `__Secure-1PSID` 复制这个 Cookie 值
- 然后在 Chrome Console 中输入 `window.WIZ_global_data.SNlM0e`，复制结果


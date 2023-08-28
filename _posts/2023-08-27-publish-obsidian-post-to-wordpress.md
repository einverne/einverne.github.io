---
layout: post
title: "结合 WordPress 快速分享 Obsidian 中的笔记"
aliases:
- "结合 WordPress 快速分享 Obsidian 中的笔记"
tagline: ""
description: ""
category: 经验总结
tags: [ obsidian, wordpress, jekyll, hexo, obsidian-publish, share, ]
create_time: 2023-08-20 12:14:15
last_updated: 2023-08-28 17:54:35
---

如何快速分享 Obsidian 中的笔记是从我开始使用 Obsidian 之后一直在思考的问题，在之前，因为我所有的笔记都是通过 Markdown 来存放在本地的，如果我想要分享一个笔记，一般就是将笔记移动到 `Blog/_post` 目录下，因为我使用一个 Git 仓库来管理我所有的笔记（Vault）然后使用 git submodule 的方式来将我的 [Jekyll 博客](https://blog.einverne.info/)，[Hexo 博客](https://invest.einverne.info/) 放到我的统一的笔记库里面。所以当我想要发布一篇笔记的时候，就是将笔记移动到对应的博客的目录，然后在使用 git commit 提交，push 来发布，之后的过程都是通过 CI 自动完成的。

虽然这样的方式我已经使用了很多年了，也没有什么大的问题，唯一的问题就是因为发布博客对 Markdown 的标题有一些限制，所以发布之前都得进行重命名。并且我没有办法做到一键发布，大部分的情况下我都必需打开终端，然后进行提交。直到我发现了一款叫做 [[obsidian-wordpress]] 的插件。

这个[插件](https://github.com/devbean/obsidian-wordpress)完美的解决了我想要快速分享一篇笔记，然后还不需要我做任何调整，当完成初次的配置之后，基本上只需要点击一下就可以完成发布。

![U9pC](https://photo.einverne.info/images/2023/08/28/U9pC.png)

这个插件使用 WordPress 的接口（XML-RPC 或 REST）来发布文章。

## obsidian wordpress

[obsidian-wordpress](https://github.com/devbean/obsidian-wordpress) 是一款 Obsidian 下的插件，可以一键将笔记发布到 WordPress 站点中。该插件使用 XML-RPC 或 REST 接口进行发布。

XML-RPC 是默认启用的，但有些站点可能由于安全问题而禁用它。 虽然有些共享主机可能默认禁用 XML-RPC，但是您无法启用它。 因此，如果禁用 XML-RPC，这个插件将不起作用。

在 WodrPress 4.7 之后，REST API 会在默认情况下启用。 一些 REST API 需要额外的操作来保护可写 API。 历史上 REST 接口是通过安装插件实现的。 在 WordPress 5.6 版本之后，引入了应用程序密码来完成类似的工作。 因此在 WordPress 5.6 之后 ，应用程序密码是首选的。

## 初次设置

在插件的设置中，找到 Profile，这里可以配置站点的信息，包括地址，API 类型，用户名，密码等。

![UA2H](https://photo.einverne.info/images/2023/08/28/UA2H.png)

需要注意的是这里的密码，在最新版的 WordPress 中请使用应用程序密码，在用户管理下面生成。

当完成以上的设置之后，在任意的笔记中，都可以在侧边栏中找到 WordPress 的按钮，然后点击，选择分类，一键完成发布。最近我有在写我的 [日本生活](https://japan.einverne.info) ，其中所有的内容都是我在 Obsidian 中完成编写，然后发布的。我创建了一个单独的文件夹用来存放所有发布到该网站的内容，并且这些内容也可以很好的和我的其他笔记进行融合，并且在我修改了文章的内容之后，也可以快速进行一键发布。

在以前我使用 WordPress 的时候，非常不方面的一点就是对其中文章内容的修改非常不方便，我不喜欢在线的编辑器，而如今 Obsidian 就成为了我的 WordPress 的本地编辑器。

## 图片怎么办

文章中的图片我是我之前搭建的 [[Chevereto]] 图床，配合 macOS 下的 uPic，我设置了快捷键 Ctrl + Shift + U，就可以一键上传粘贴板中的内容。然后直接在 Obsidian 中使用即可。

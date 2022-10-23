---
layout: post
title: "Obsidian 未来的笔记应用"
aliases:
- "Obsidian 未来的笔记应用"
tagline: ""
description: ""
category: 产品体验
tags: [obsidian, note-taking, evernote, linux,]
last_updated: 2022-02-10 07:36:40
create_time: 2020-07-03 10:32:44
---

看过我过去文章的人都知道在此之前我都使用 WizNote 来作为本地笔记应用，但是这两年在记笔记这件事情上出现了非常多的可能性，虽然我本人一直在关注着不同类型的笔记应用，从传统的 Evernote，OneNote 到 Notion 等等模块化的笔记应用，多多少少也尝试了一下，但是一直没有深入的去用，因为就我目前的需求，WizNote + 本地的 markdown + vim + git 基本就满足了，直到昨天晚上我在豆瓣上阅读了 [笔记类软件的双向链新浪潮](https://www.douban.com/note/762552900/) 这篇文章，然后我发现原来我在记笔记的时候遇到的一些问题原来还有这样一种解决方式。

## 存在的问题
我在用纯手工方式管理笔记的时候遇到的这些问题，中间我也曾想使用 wiki 来代替笔记，尝试了 [[GitBook]], BookStack, [[TiddlyWiki]] 等等，都或多或少的有些问题。

### 多媒体管理
我用原来 markdown + vim + git 的方式存在的最大的问题就是多媒体文件的管理，如果我只简单的记录文本，没有那么多的媒体（图片，音视频） 需要管理，还是能够非常方便的进行管理的，而一旦图片等等媒体文件成倍增长时，这个时候我就陷入了管理困境。

而 Obsidian 将媒体文件和 markdown 文件存放到一起，并且可以简单的使用名字相互进行关联，这使得管理变的轻松。内建的录音器甚至可以直接录音后在文件中插入音频内容。

### 链接
关于内链，可能我的思路还停留在上个世纪的“超链接”，我文章的大部分链接都是通过超链接相互关联的，而在 WizNote 中，将不同的笔记内容进行关联，我就只能使用 tag，或者手工进行分类来实现。而分类和 Tag 存在一些缺点，比如有些内容可能并不能以某一个分类概括，又或者可能被划分到多个分类下，而 Tag 虽然可以一定程度上避免分类的问题，但是在确定 Tag 的时候就会遇到如何定义 Tag 的问题，比较笼统的定义还是比较精确的定义。

而在 Obsidian 中，只需要 `[[topic]]` 就可以非常方便的实现链接到名为 topic 的文章，而这一切都是 Obsidian 做的，并且 topic 的这篇笔记甚至可以不存在，在写的时候写下，然后 Obsidian 会生成链接，只需要点击就可以快速的创建这个 topic. 到这里我才发现原来我那种手工管理内部链接的方式简直太愚蠢了。更甚至通过链入和链出就形成了一个非常庞大完整的网状结构，这样就将历史的笔记也可以以这种形式激活起来，不断的丰富自己的知识网络。

在 Obsidian 中通过 internal link 和 graph view 完美的解决了笔记之间关联的问题。

## What is Obsidian?
Obsidian 这样介绍自己：

> Obsidian is a both a Markdown editor and a knowledge base app.

直接献上官网地址：

- <https://obsidian.md/>

再来看看预览图：

![obsidian note taking](/assets/obsidian-note-taking-screenshot.png)

## 安装
Linux 下官方默认给出的是 AppImage，还可以下载 snap 包，通过如下方式安装：

    sudo snap install obsidian.snap --dangerous

如果不添加 `--dangerous` 可能会报错：

> error: cannot find signatures with metadata for snap "obsidian_0.13.19_amd64.snap"

## 特性
Obsidian 这些功能是吸引我让我尝试的理由。

### 本地化数据
所有数据都以本地文本形式保存。其他一些软件使用私有的格式保存用户数据是让我避而远之的原因之一。

Obsidian 管理的所有数据都在本地，那也就意味着用户可以选用自己喜欢的任何同步工具进行数据加密，同步等等。比如现成的同步方案 Dropbox 等等，而我选择使用另一款 [分布式同步工具 Syncthing](/post/2019/10/syncthing.html)

![obsidian note taking create notes](/assets/obsidian-note-taking-create-notes.png)

### Links 是一等公民

如果上手使用 Obsidian，那么第一感受就是可以在笔记的任何地方非常快速的创建内链，通过内链的方式，系统里面的笔记就形成了网状的结构，这也是 bi-directional linking 双向内链的精髓之处。

Obsidian 在官方的 Demo 中引述了 [[洛克|约翰 洛克]] 在 1690 年发表的 《An Essay Concerning Human Understanding》来解释人类思想形成的方式：

> The acts of the mind, wherein it exerts its power over simple ideas, are chiefly these three:
> > 1. Combining several simple ideas into one compound one, and thus all complex ideas are made.
> > 2. The second is bringing two ideas, whether simple or complex, together, and setting them by one another so as to take a view of them at once, without uniting them into one, by which it gets all its ideas of relations.
> > 3. The third is separating them from all other ideas that accompany them in their real existence: this is called abstraction, and thus all its general ideas are made.

简单的翻译：

- 首先将几个简单的想法组合成一个复杂的想法，从而完成所有复杂的思维过程;
- 第二，是将简单或复杂的两个想法放到一起，相互设置关联，方便查看它们，而同时又不将它们融合到一起，从而可以一眼查看所有想法之间的关联。
- 第三，是将这些想法与实际存在的所有其他思想分开：这称为抽象思维，这是所有普适思想形成的过程。

笔记的层级关系 (Hierarchy) 实现了第一点，而内部链接 (linking) 正是第二点，而第三点如何在笔记中应用， Obsidian 的作者也没有想清楚，但他也说了，这可能是更高阶的抽象 ---- **but it might have something to do with programming or macros.**

### 用户拥有所有工具链
记笔记是一件非常个人化的事情，这也就意味着不可能有一个包容一切的解决方案适用于所有人。

> Note-taking is an incredibly personal thing

所以 Obsidian 并不会武断地尝试去提供一个完整的产品，而是提供一个基础功能以及很多的功能模块，用户可以自己创造并实现自己的需求。

最基础的功能包括，查看文件，编辑文件，搜索文件，而这对于一般的需求也已经完全足够。在此之上，你可以构建独立的功能模块来增加笔记的体验，比如：

- 如果是记录上课的笔记，那么可以使用 audio recorder 和 LaTex math
- 如果是记录工作笔记，可以使用 slides 和手写支持
- 而如果你是研究工作者，backlinks（反向链接）和字数统计就很重要

Obsidian 不期望有一个插件可以解决所有的问题，但 Obsidian 提供了足够的自由度，在能够实现不同需求的时候，也不会搞乱界面。

## 我的常用快捷键和 remapping

最常用的快捷键整理，下面有一些是我已经 remapping 过的，可以根据自己的习惯重新设置快捷键的。

新建笔记相关：

| Shortcut    | description           |
| ----------- | --------------------- |
| Cmd+n       | New note              |
| Cmd+Shift+n | New Zettelkasten note |
| Cmd+p       | Filter the command    |

编辑相关的：

| Shortcut   | description                        |
| ---------- | ---------------------------------- |
| Cmd+b      | bold                               |
| Cmd+i      | italic selection                   |
| Ctrl+Alt+L | format markdown (借助 Linter 插件) |

笔记间跳转：

| Shortcut         | description                                                 |
| ---------------- | ----------------------------------------------------------- |
| Cmd+o            | Open quick switcher, jump to different notes by fuzz search |
| Option+Enter     | follow the link under cursor                                |
| Cmd+Option+Enter | Open link under cursor in new pane                          |
| Cmd+`[`          | Back                                                        |
| Cmd+`]`          | Forward                                                     |
| Cmd+hjkl         | Navigate to left/below/above/right pane                     |
| Cmd+w            | Close active pane                                           |
| Cmd+`\`          | Split vertically                                            |
| Cmd+`-`          | Split horizontally                                          |

浏览模式：

| Shortcut | description              |
| -------- | ------------------------ |
| Cmd+e    | Toggle edit/preview mode |

Obsidian 的模板功能非常强大，我自定义了一个快捷键 <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>i</kbd> 来从模板中快速插入到当前的文档中。

## Zettelkasten method
卡片标签式笔记法，Obsidian 也可以兼容，启用插件后侧边栏点击就能够快速建立时间戳开头的笔记迅速进入编写。

## 延伸阅读

- [[Trilium Notes]] 基于网页的笔记
- [[Logseq]] 开源的基于块的双向链接笔记
- [[TiddlyWiki]] 单文件 Wiki

## 个人使用技巧

### 使用 GitHub 作为同步后端
都知道 Obsidian 其实是一个本地的离线客户端，官方截止 11 月份还没有推出同步的功能，但是优先推出了 Publish 服务，可以将笔记一键发布到 Obsidian 提供的网站上。但是对于我而言，我习惯将笔记在本地整理，然后将相关的内容整理成文章发布在这个博客中，所以剩下的问题就是我的本地笔记同步的问题了。

我个人是将 Obsidian 的本地仓库放到一个 Git 仓库中管理，并且每隔一定时间自动提交到 Git 中，这样即使我不在电脑边，也可以第一时间访问到我的内容。我使用 Hammerspoon 提供的 task api，写了一个 [简单的脚本](https://github.com/einverne/dotfiles/blob/master/hammerspoon/autoscript.lua) 自动提交仓库。

## Links
Obsidian 的开发 Roadmap

- <https://trello.com/b/Psqfqp7I/obsidian-roadmap>

## 对比其他产品

在整理了这篇文章半年后，我几乎每条都在使用 Obsidian，甚至用 Karabine [绑定了 ob 的快捷键](https://github.com/einverne/dotfiles/blob/master/karabiner/karabiner.edn) ，在任何情况，任何应用中，我只需要按下 o，不松开，然后快速按下 b，就可以 open Obsidian 了。

这是半年后的 Graph

![Obsidian graph](/assets/obsidian-graph.png)

虽然使用过程中从来没有遇到任何问题，但是却一直收到其他产品的推荐，比如 Logseq, RoamEdit 等等，虽然 Obsidian 已经足够满足我的使用了，但也经不住尝试了一下其他的产品，只能说今年因为 Roam Research 的创新激活了笔记应用的市场。

### Logseq

[[Logseq]] 在自己的官网将自己描述为一个受到 Roam Research, Org mode, Tiddlywiki, Workflowy 启发的开源的 Roam 笔记应用，我打开官网尝试了一下，虽然双向链，块引用，运行在浏览器，以 GitHub 作为笔记的存储，看起来很美好，似乎是 Roam Research 的代替品，但是我在使用的过程中，不清楚是以为网络问题还是因为我没有登录的关系，体验并不是很好，一来创建新页面的时候卡了，而来默认的显示状态和编辑状态的变化略大，使得视觉上的体验不是很好。在界面交互上甚至并不能和其提到 Workflowy 的网页应用流畅度相比。不过因为其开源属性使得每一个人都可以根据自己的喜好进行扩展和修改，其未来可期。

~~另外一个需要注意的就是目前的 Logseq 只有网页版，并且因为 Logseq 网络访问需要经过其代理才能将数据保存到 GitHub，相较于 Obsidian 直接使用本地 Markdown 文件保存，Logseq 并不占优势。不过有能力可以自行搭建。~~

Logseq 目前已经可以使用客户端，所有的数据都可以离线在本地。

### RoamEdit
看名字就知道又是一款 Roam Research 的仿作，不过让我惊奇的是其网页的流畅度相较于 Logseq 还是不错。但是问题依然是那样的，官网一行隐私说明都没有，一个备案号，一个交流群，看着就不想深入使用的样子。可能也是某位大神练手之作，值得鼓励。不过我就不去尝试使用了。

### Workflowy
Workflowy 和 RoamEdit 比较类似，并且在网页操作上也比较流畅，但两者虽然都支持导出数据，但依然需要联网才能使用，和我个人的情况并不相符，就算了。

往往有些时候鱼与熊掌不可兼得，当选择了网页版，就自然地获得了数据的同步，也自然可以期望未来的多客户端同步，但问题也就是在此，一旦这些网络的服务关闭，或者再一个没有网络的地方，那么一切都没有办法获取了。而 Obsidian 使用纯文本的方式，并且桌面客户端并不会发起网络连接，那么自然就丢失了同步的便利，而与此同时你也就获得了自己笔记的所有权，即使 Obsidian 未来不再更新了，那么也可以使用 Vim 或者 VS Code 的 [Foam](https://foambubble.github.io/foam/) 获得一份相差不多的体验，并且因为是纯文本，所以那些 [终端里的工具](/post/2020/10/my-favorite-cli-tools.html) ，比如 [fzf](/post/2019/08/fzf-usage.html) ， [Vim](/categories.html#Vim) ， [rg](/post/2019/09/ripgrep-recursively-searches-directories-using-regex-pattern.html) 等等都可以直接拾起来用。这样的体验反而要比等待网络连接，然后才能进行操作要来的快捷方便很多。另外 Obsidian 不能在移动端使用的问题，我通过 [Syncthing](/post/2019/10/syncthing.html) 加上 [Markor](https://play.google.com/store/apps/details?id=net.gsantner.markor&hl=en_US) 完美的解决了。其他移动端的可以参考官网给出的 [建议](https://forum.obsidian.md/t/how-do-i-work-with-obsidian-on-mobile/471) 。

再就是块应用，Obsidian 不支持，但是 Obsidian 可以对笔记的子标题进行引用，对我来说似乎也已经足够了。毕竟 [Zettelkasten](/post/2020/02/zettelkasten-note-taking-method.html) 的精髓部分就是每一则笔记的原子性。

## reference

- <https://github.com/joekroese/tiddlyroam>

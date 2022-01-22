---
layout: post
title: "Logseq 第一次试用记录以及发布 Logseq 到网页"
aliases: 
- "Logseq 第一次试用记录以及发布 Logseq 到网页"
tagline: ""
description: "Logseq 和 Obsidian 对比，发布 Logseq 到 GitHub Pages"
category: 产品体验
tags: [ logseq, notes, backlink, markdown, ]
last_updated:
---

早之前在使用 [[Obsidian]] 的时候就有了解过 [[Logseq]] 但一直没有找到机会去尝试一下，毕竟我从 [[WizNote]] 迁移到 Obsidian 之后使用一直没有遇到任何问题，毕竟 Obsidian 够简单，也足够扩展性，并且基于 Markdown 文件的笔记是我过去一直在使用的方式。但现在让我有尝试使用一下 Logseq 的契机是因为在以前我都是使用 Vault 存放所有的笔记，然后使用其中一个 Blog 目录存放我想[发布的内容](https://github.com/einverne/einverne.github.io)，这样每一次我想发布一个具体的文章的时候就可以直接将文件移动到 `Blog/_posts` 目录之下，然后 Git 提交即可，但这个发布存在的问题便是其中的特殊双向链接 `[[]]` 会在页面上有些违和，而我看到 Logseq 可以将页面直接以 HTML 方式发布，并且也可以非常好的处理双向链接的问题，于是想来试一试。

[Logseq 官方的文档](https://docs.logseq.com/#/page/Contents) 便是一个非常好的例子，展示界面几乎和用户的编辑页面是一致的，在线浏览也没有任何卡顿的情况。

## Logseq 和 Obsidian 存在的区别

### block
上手体验的第一个非常大的区别就在于 Logseq 有 block 的概念，这个概念可能是从 Roam Research 中借用而来，不像 Obsidian 整个文档就是一个 markdown 文件，所以每一行文字其实还是段落，但是 Logseq 中每一次 "Enter" 都创建了一个 block。Logseq 中使用 `((uuid))` 的语法来引用 block。有了 block 的概念之后就会发现其实文档内容的最小单元变成了 block，而在 Obsidian 中我能使用的最小单元也无非是通过 `#` 来划分出来的页面的段落。这可能是 Logseq 更加灵活的地方，但因为目前我还没有想好怎么使用这个 block 所以之后有了具体的使用场景再来分享。

### command
Obsidian 中的 Command 和 Logseq 中的 Command 在使用起来还有一些区别，我设定了 Ctrl + P 来调用 Obsidian 中的 Command Palette，而这其中的命令大部分是对整个文档，或者部分内容进行的调整。而在 Logseq 中，在任何页面中使用 `/` 都可以进行响应的插入，`/` 更像是 Notion 的方式，通过 `/` 来快捷调用复杂的输入操作，比如插入页面引用、块引用、标题、图片等等。

但我个人觉得在 `/` 中提示输入标题有些累赘，我个人的习惯一般不会在一篇文章中使用三级标题以上的子标题，那这也就意味着我只会使用 1~3 个 `#`，那么在纯 markdown 文档中，输入 `#` 要远比先输入 `/` 然后搜索对应的标题，选中要来的快，即使是输入三个 `#` 也会比 `/` 快。

`/` 让我觉得最重要的就应该是页面引用和块引用了，通过模糊搜索，在笔记和笔记之间建立关系使用 `/` 就大大简化的。而在 Obsidian 中我就只能使用 `[[` 来进行页面的关联。

### vim mode
Obsidian 让我直接上手的一个非常重要的原因就是开箱支持的 Vim 模式，我几乎没有想就启用了，并且一直使用到现在，这无非只是让我在终端的笔记转移到了 Obsidian，并且我熟悉而这个快捷键，命令都可以直接使用，这也让我在终端，[IntelliJ IDEA](/post/2020/07/idea-vim-usage.html)，浏览器 [Vimium](https://github.com/philc/vimium) 达成了统一。而 Logseq 开箱就是所见即所得的界面，当然普通使用起来是没有问题的，但用起来就慢慢地发现有些别扭，比如在上一行插入，或者快速跳转到页尾，以前非常熟悉的 `O` 或者 `G` 突然没有了就有些陌生。

然后再看到 Logseq 的 [Feature Request](https://discuss.logseq.com/t/vim-mode-powerful-shortcuts/275) ，大家对 Vim-mode 的讨论，要求支持还是挺多，不过截止目前还用不了。

### 分享
就像上面提到的一样，让我试用 Logseq 最重要的一个原因就是 Logseq 生成在线文档的能力，因为我之前使用 Jekyll 的文档分享部分 Obsidian Vault 中的内容就没有购买 Obsidian Publish 服务，因为一来我觉得 Jekyll 够用，然后 Obsidian Publish 服务的页面最初的时候访问优点慢，并且早鸟价 8$ 一个月的价格也有些高。但后来在使用的过程中还是会有一些些的不便，毕竟双向链接如果没有特殊的处理会显得有些奇怪。

### Tag 使用
在 Logseq 中使用 `#tag` 新建 tag，当点击 tag 的时候会创建新的页面，而在 Obsidian 中 `#tag` 就只是页面的一个元数据，标签。在 Logseq 中可以点击 `tag` 页面来查看所有该标签下的页面和块，而在 Obsidian 中我通常是使用搜索。

### Logseq 中特殊的语法
Logseq 中使用 `key:: value` 格式来对页面或块进行属性设置，页面的属性在页面的第一个块定义，作为 frontmatter，块属性可以在任何块中定义。

Logseq 中的 Properties 的两大作用：

- Query，可以通过查询语法来将带有 property 的内容检索出来
- 定义 Page/Block 的通用属性，比如想要有一个模板，当记录一本书的时候自动会有相应的属性

## Obsidian 搭配 Logseq 使用
在上面的使用过程中，我一直使用 Git 来追踪 Logseq 界面中修改了文档之后在原始文档中的体现，大体来看如果没有使用 Logseq 自身的特殊语法，大致还是兼容 markdown 语法的。

所以我想到了如果将 Logseq 仓库存放在 Obsidian Vault 中，那么其实和我之前使用 Jekyll 发布内容的方式就是一致的了，我只需要把需要发布的内容移动到 Logseq 文件夹下即可。比如说我的 Logseq 仓库叫做 notes，那么他下面会有一个 pages 文件夹，存放的都是 Logseq 中的笔记原始文件。那么我将整个 notes 作为我 Obsidian Vault 的一部分，那么我既可以在 Obsidian 中编辑这些笔记，也可以用 Logseq 打开这个子文件夹来编辑。我只需要使用 Logseq 兼容的语法，那么每一次提交，然后推送到 GitHub 之后，就可以利用 GitHub Actions 自动发布。

Obsidian Vault 是一个独立的仓库，然后使用 git submodule 将 Logseq 仓库添加到其中，还可以利用版本控制来管理。


## 将 Logseq 发布到 GitHub Pages
这里使用 [pengx17](https://github.com/pengx17/logseq-publish) 的 Logseq-publish 的 GitHub Action，在个人仓库下创建 `.github/workflows/main.yml` 文件，根据自己的情况填入配置：

```
name: CI

# Controls when the workflow will run
on:
  push:
    branches: [master]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
      - name: Logseq Publish
        uses: pengx17/logseq-publish@main
      - name: add a nojekyll file
        run: touch $GITHUB_WORKSPACE/www/.nojekyll
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages # The branch the action should deploy to.
          folder: www # The folder the action should deploy.
          clean: true
          single-commit: true
```

然后每一次 push 之后会自动触发 build，将静态 HTML 文件发布到 `gh-pages` 分支中。然后在 GitHub 仓库设置界面 Pages 中设置域名即可。

我发布的内容 <https://notes.einverne.info>

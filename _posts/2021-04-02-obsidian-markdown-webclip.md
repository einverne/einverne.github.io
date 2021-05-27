---
layout: post
title: "Obsidian 使用篇一：使用 markdown-clipper 全文保存网页"
aliases: "Obsidian 使用篇一：使用 markdown-clipper 全文保存网页"
tagline: ""
description: ""
category: Obsidian
tags: [ obsidian, markdown, note, note-taking,  ]
last_updated:
---


之前使用整理 [Evernote 代替品](/post/2016/07/evernote-alternative.html) 的时候就提出了我自己的一个需求，就是有一个完善的 Web Clip 系统，Evernote 和 WizNote 都做的比较不错。但 Obsidian 并没有提供类似的工具，不过幸好 Obsidian 使用 Markdown 来管理文档，这样的开放程度使得我可以寻找一个将网页变为 Markdown 的浏览器扩展就能做到。

经过一段时间的调研和搜索我发现了如下这些可选项：

- Enrico Kaack 写的 [markdown-clipper](https://github.com/enrico-kaack/markdown-clipper)
- deathau 再上面 markdown-clipper 的基础上修改的 [markdownload](https://github.com/deathau/markdownload)
- 以及在 [Reddit](https://www.reddit.com/r/ObsidianMD/comments/jhhp4r/obsidian_clipper_plugin/) 发现的 [obsidian-clipper](https://github.com/jplattel/obsidian-clipper)

这三个插件都是开源的，各自有各自的特点，markdown-clipper 是我最早使用的插件，点击一下就可以将整个网页保存成 markdown 文件并下载到本地，而 markdownload 则可以在点击之后先预览一下生成的 markdown 调整之后再下载本地。obsidian-clipper 则可以选中内容，然后点击之后自动打开 Obsidian，然后新建并保存内容，但该插件处于早期开发阶段可能会遇上一些问题。不过我个人在 Linux 下尝试还是非常不错的，并且开发者还挺[活跃](https://github.com/jplattel/obsidian-clipper/issues/10)。

## 全文存入到 Obsidian 并不是目的
不过一定要当心的是，别被可以无线膨胀的信息冲昏头脑，将网页内容存入 Obisidian 是为了后期阅读或消化，别放入之后便不再阅读。

所以我的方式是在 Obsidian 中单独新建了一个文件夹 `Web Clip` 所有摘录的文件第一站便是这个地方。一旦我有时间，就会向使用那个稍后阅读应用 Pocket/Instapaper 一样，将 Web Clip 文件夹中的内容按照次序阅读并拆解，并将重要的内容吸收到 Obsidian 之前的笔记体系中。一段时间之后 Web Clip 会自动清空。



## Obsidian Clipper 设置
我经过一段时间的使用之后，觉得 Obsidian Clipper 的使用最直接，选中，点击，然后就自动打开 Obsidian 新建了笔记。但目前为止唯一让我不太满意的就是有的时候无法调用起 Obsidian。这个时候就使用 markdownload 作为辅助。

配置：

```
{zettel}-{title}
```


```
#obsidian-clipper #web-clipper #markdown-clipper

{clip}

Clipped from [{title}]({url}) at {datetime}.
```



## 总结
在使用一段时间之后，最终选定了 MarkDownload ，因为转换的 Markdown 文件格式最好，并且可以批量下载文章中的图片。
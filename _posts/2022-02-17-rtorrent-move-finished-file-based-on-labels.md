---
layout: post
title: "rTorrent 配置之根据用户标签移动完成的下载文件"
aliases: 
- "rTorrent 配置之根据用户标签移动完成的下载文件"
tagline: ""
description: ""
category: 经验总结
tags: [ rtorrent, rutorrent, config, rtorrent-config, bittorrent, torrent, private-tracker, tracker, bt ]
last_updated: 2022-02-18 09:43:51
create_time: 2022-02-18 02:09:09
---


好几年前从接触了 [QNAP 上的 ruTorrent](/post/2019/05/qnap-rtorrent-bt-pt.html) 开始就一直在用 [[rTorrent]] 和 ruTorrent 的组合。在 QNAP 上运行稳定，后来又迁移到 [docker](https://github.com/einverne/dockerfile/tree/master/rtorrent-rutorrent) 上，中间还经历了从 LinuxServer 维护的 rTorrent 迁移到 crazymax/rtorrent-rutorrent 维护的镜像上。一直都没有出现过问题。

今天在 Twitter 上向人推荐的时候被问到能不能在完成之后将文件移动到特定的目录。我知道很多人会分门别类的管理自己的文件，并且希望在移动文件之后还能一直 seeding, 这个对于 rTorrent 来说也特别简单，这里就简单记录一下。

## 我个人对 rTorrent 的使用流程
之前的文章中也曾经提到过 rTorrent 是 C++ 实现的基于终端的 torrent 客户端，而 ruTorrent 是 rTorrent 的 WEB 界面。为了不引入更复杂的 ruTorrent 插件，这篇文章就仅仅围绕 rTorrent 的配置，通过几行简单的配置就能实现 rTorrent 在下载完成之后的目录规划。

我个人一般通过如下两种方式添加种子到 rTorrent：

- watch directory，通过监听硬盘上的某一个目录，只要发现 `*.torrent` 文件自动加载并开始下载
- 通过 Web 界面 ([[ruTorrent]])

而这两种方式都可以通过给种子文件添加 Label 的方式来实现。


## 配置 rTorrent 完成下载后移动目录
首先要先认识一下 rTorrent 的配置文件 `.rtorrent.rc` 文件，一般情况下会在 HOME 目录中，如果是通过 Docker 安装会出现在配置目录中。rTorrent 的文档非常详细，rTorrent 一般把这个配置称作 [rTorrent Scripting](https://rtorrent-docs.readthedocs.io/en/latest/scripting.html)。

比如说最简单的限制下载和上传的速度，可以通过如下两行实现：

```
# Global upload and download rate in KiB. "0" for unlimited¬
throttle.global_down.max_rate.set_kb = 102400¬
throttle.global_up.max_rate.set_kb = 102400¬
```

简单了解了 rTorrent 的配置之后，那么就直接进入正题，要实现完成之后自动移动到相应的目录，首先需要给种子自动加上标签。

### Watch directories
而我上面提到过，我通常使用 Watch 目录来自动添加种子。

通过配置不同的 watch 目录，每一个都对应着一个 category 或者 label，那么在 `/path/to/rtorrent/watch/tvshows` 中的 torrent 文件，就会自动有一个 `custom1` 的值，这个值在下一步会使用到。

注意下面的配置在 rTorrent 0.9 版本以后可用[^change]：

[^change]: <https://github.com/rakshasa/rtorrent/wiki/RPC-Migration-0.9>

```
# TV shows
schedule2 = watch_directory_1,10,10,"load.start_verbose=/path/to/rtorrent/watch/tvshows/*.torrent,d.custom1.set=tvshows"

# Movies
schedule2 = watch_directory_2,10,10,"load.start_verbose=/path/to/rtorrent/watch/movies/*.torrent,d.custom1.set=movies"

# Comics
schedule2 = watch_directory_3,10,10,"load.start_verbose=/path/to/rtorrent/watch/comics/*.torrent,d.custom1.set=comics"

# Music
schedule2 = watch_directory_4,10,10,"load.start_verbose=/path/to/rtorrent/watch/music/*.torrent,d.custom1.set=music"
```

这些配置中有两个关键部分：

- `/path/to/rtorrent/watch/x` 部分是 watch 的目录，注意这里需要根据自己的情况进行修改
- `set_custom1=`后面的内容是需要设置的标签

然后需要再进行如下配置，设置的目的就是让种子下载完成之后移动到上面打标签的目录：

```
# Add new method to get finished dir
method.insert = d.get_finished_dir,simple,"cat=/path/to/rtorrent/finished/,$d.custom1="
method.set_key = event.download.finished,move_complete,"d.directory.set=$d.get_finished_dir=;execute=mkdir,-p,$d.get_finished_dir=;execute=mv,-u,$d.base_path=,$d.get_finished_dir="
```

第一行 `method.insert` 定义了一个方法 `get_finished_dir` 每一个 torrent 都会返回一个字符串 `/path/to/rtorrent/finished/` 和一个标签(custom1 的值)。

带有标签 `tvshows` 的就会返回 `/path/to/rtorrent/finished/tvshows`，修改第一部分，就可以根据自己的需要移动到任何想要的目录。

第二行配置是，当发生下载完成事件的时候，移动完成的内容，然后调用上一步定义好的 `get_finished_dir` 方法返回这个文件最终应该在的目录，并且通过 `set_directory` 方法设置最终的目录，如果最终的目录不存在则自动创建，最后再将 torrent 文件移动到最终的目录中。

- 没有标签的 torrent 会被放到 rTorrent 定义的下载目录
- 带有标签的 torrent 文件会被以移动到标签定义的目录，如果目录不存在则会自动创建

还有另外一种写法，下面的配置中，第二行配置定义了 `move_to_complete` 方法，接受两个参数，第一个参数是下载完成后的文件实际路径，第二个参数是要移动到的目录。然后在第三行配置中就直接调用该方法了：

```
# Move finished (no need Autotools/Automove plugin on ruTorrent)
method.insert = d.get_finished_dir, simple, "cat=$cfg.download_complete=,$d.custom1="
method.insert = d.move_to_complete, simple, "d.directory.set=$argument.1=; execute=mkdir,-p,$argument.1=; execute=mv,-u,$argument.0=,$argument.1=; d.save_full_session="
method.set_key = event.download.finished,move_complete,"d.move_to_complete=$d.data_path=,$d.get_finished_dir="
```

当以上配置生效之后，每当我将一部电影的种子放入到 `/watch/movies` 文件夹中的时候，该种子会自动被添加到 `rTorrent` 中，并且自动添加标签 `movies`，当完成下载后，会被放置到 `/path/to/rtorrent/finished/movies` 文件夹中。

通过上面的方式可以不需要依赖 [[ruTorrent]] 的 Autotools/Automove 插件。

完成了上面的操作之后有人就要问，那怎么把 torrent 文件自动放到对应的 watch 目录呢？那不妨看看我是如何用 [flexget](/post/2020/02/flexget.html) 来实现的。

## reference

- [rTorrent 升级 0.9 的配置变更](https://github.com/rakshasa/rtorrent/blob/master/doc/scripts/update_commands_0.9.sed)
- <https://www.krank.se/2014/06/25/rtorrent-magic-moving-finished-torrents-based-on-labels/>
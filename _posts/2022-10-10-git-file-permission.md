---
layout: post
title: "Git 对文件权限的控制"
aliases:
- "Git 对文件权限的控制"
tagline: ""
description: ""
category: 经验总结
tags: [ git, file-mode, file-permission, linux ]
create_time: 2022-10-11 10:04:00
last_updated: 2022-10-11 02:31:30
---

因为一直使用 [assh](/post/2020/07/advanced-ssh-config-management.html) 来管理我的 ssh config，整个 SSH config 都是用 Git 仓库来管理的，但是每次一更新了 config 文件，`git pull` 之后 config 的文件权限都会出错：

> Bad owner or permissions on /path/to/.ssh/config

发现 git 拉取的文件丢失了权限，必须通过 `sudo chmod 600 ~/.ssh/config` 来修改才能使用。

于是就想要了解一下 Git 仓库中怎么来管理文件权限的。

## Git 只有一 bit 位来用存储文件权限
Git 只有一位用来记录权限，可执行还是不可执行。

这意味着，下面的权限是不会被 Git 追踪的：

- 文件所有者的读写权限（write, read）
- 文件所有者外的其他权限都不会被追踪，包括 group, other 中的 execute, write, read 权限都不会被记录

有了这个前提知识就能够解释为什么我们使用 `git diff` 命令的时候，Git 有些时候会显示类似如下的文件权限：

```
old mode 100644
new mode 100755
```

说明：

- 755, owner 可以 read/write/execute, group/others 可以 read/execute
- 644, owner 可以 read/write, group/others 只能 read

Git 会给予一个没有执行权限的文件 file mode 为 `100644` ，给一个可执行的文件 `100755` ，如果将文件的权限从 7xx 修改成 6xx，或者反过来（调整可执行权限），那么 Git 就会追踪到这个修改。

Git 中可以通过如下配置来忽略文件 mode

```
git config core.fileMode false
```

如果要全局忽略，可以添加 `--global` 参数：

```
git config --global core.fileMode false
```

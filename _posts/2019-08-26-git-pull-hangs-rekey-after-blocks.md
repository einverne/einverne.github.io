---
layout: post
title: "git pull hangs rekey after blocks 拉代码时卡住"
tagline: ""
description: ""
category: 经验总结
tags: [linux, git, git-pull, ssh, ssh-agent]
last_updated:
---

今天一天连续遇到奇怪的事情，先是早上电脑突然无法联网，各种问题排查一遍，重启电脑，拔网线，最后发现可能是 `/etc/network/interfaces` [配置问题](/post/2019/08/ubuntu-linux-mint-network-configuration.html).

然后中午就遇到了这个诡异的错误，那就是在使用 `git pull` 拉取代码的时候，突然就 hangs 挂住了。什么都没有反应，所以用

    ssh -vvvT git@github.com

来查看了一下发现

    debug1: rekey after 134217728 blocks
    debug1: SSH2_MSG_NEWKEYS sent
    debug1: expecting SSH2_MSG_NEWKEYS
    debug1: SSH2_MSG_NEWKEYS received
    debug1: rekey after 134217728 blocks

日志卡在了这几行，后面就不动了。经过一番搜索之后发现可能是和 ssh-agent 有关系，git 无法连接到 SSH Agent , 然后导致了卡住。

解决方案：

    SSH_AUTH_SOCK= ssh git@github.com

## reference

- <https://apple.stackexchange.com/a/280800/149497>

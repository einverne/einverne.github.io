---
layout: post
title: "gpg: keyserver receive failed: Server indicated a failure 解决"
tagline: ""
description: ""
category: 经验总结
tags: [gpg, ppa, ubuntu, apt-repository,]
last_updated:
---

在 `sudo add-apt-repository` 添加 PPA 时突然遇到 gpg 添加 key 失败，大概知道可能是因为网络问题，但是这个问题在我家里的网络一直存在，非常恼人。

	gpg: keyserver receive failed: Server indicated a failure

所以我想从根本上解决这个问题，这个问题的根源可能是因为网络问题导致 gpg key 没有被导入到本地。所以如果能够手动下载 gpg public key 然后手动导入不就可以了？

所以随意打开一个 PPA，比如

- <https://launchpad.net/~eosrei/+archive/ubuntu/fonts>

在页面中 `Technical details about this PPA` 下方有 `Signing key` 点击该链接会跳转到一个签名的 key 列表，在该列表中找到报错内容中的 KEY

	W: GPG error: http://ppa.launchpad.net/eosrei/fonts/ubuntu bionic InRelease: The following signatures couldn't be verified because the public key is not available: NO_PUBKEY ADA83EDC62D7EDF8

复制该链接，然后使用下面的命令：

	curl -sL https://keyserver.ubuntu.com/pks/lookup\?op\=get\&search\=0xada83edc62d7edf8  | sudo apt-key add -

等出现 OK 即可。注意这个 URL 中的 key 需要在前面加上 `0x`，否则会找不到该 key.

## reference

- <https://askubuntu.com/a/13078/407870>
- <https://unix.stackexchange.com/a/507581/115007>

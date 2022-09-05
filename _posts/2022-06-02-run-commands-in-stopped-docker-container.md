---
layout: post
title: "在停止的 Docker 中其中执行命令"
aliases:
- "在停止的 Docker 中其中执行命令"
tagline: ""
description: ""
category: 经验总结
tags: [ docker, linux, docker-compose, ]
create_time: 2022-09-05 12:56:17
last_updated: 2022-09-05 12:56:17
---

当 Docker 容器在执行的时候，可以通过 `exec` 命令来进入容器执行命令，那么如果一个容器已经停止了，或者想要查看一个构建好的镜像中的内容，那应该怎么办呢？`exec` 命令肯定是用不了的。

这个时候可以使用 `docker run --rm` 命令来起一个临时的容器，然后再其中执行 `/bin/sh` 

```
docker run -it --rm --entrypoint sh some/image
```


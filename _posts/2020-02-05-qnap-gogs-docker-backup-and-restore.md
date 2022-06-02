---
layout: post
title: "威联通折腾篇十八：Gogs Docker 容器备份及恢复"
aliases: "威联通折腾篇十八：Gogs Docker 容器备份及恢复"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, 威联通 , gogs, git, gitlab, github, docker, container, ]
last_updated:
---

年前我的 NAS [系统盘挂掉](/post/2020/01/backup-data-and-system.html)，数据倒是没丢，但让我的很多配置都要重来。

已经总结了：

- [QNAP 系统应用及数据的备份和恢复](/post/2019/07/qnap-moving-system-volume.html)
- [NextCloud 数据备份和恢复](/post/2020/01/qnap-nextcloud-docker-upgrade-and-backup.html)
- [QNAP 自带 MariaDB SQL server 数据备份和恢复](/post/2020/01/qnap-sql-server-backup.html)

剩下的其他就是应用数据的恢复和备份了。这里再总结一下 Gogs 数据的备份和恢复。

之前使用的是 Qnap club 上面 qpkg 文件来安装的 Gogs, 这次迁移到 Docker 中。

Gogs 的主要数据和其他很多应用类似，主要是数据库和本地配置文件。

## 数据库备份
关于 MySQL 数据库的备份就不再多说了，之前也有总结过文章。

## 本地数据

使用 qpkg 文件安装的 QNAP 应用都会将数据存储在 `/share/CACHEDEV1_DATA/.qpkg/` 目录下，找到该目录下的 `/share/CACHEDEV1_DATA/.qpkg/Gogs/` 文件夹，如果不知道要备份该目录下的哪一个文件，笨办法就是把整个目录打包备份。

不过如果简单的查看一下 Gogs 的 Docker [镜像使用](https://github.com/gogs/gogs/tree/master/docker) 就知道

	# Pull image from Docker Hub.
	$ docker pull gogs/gogs

	# Create local directory for volume.
	$ mkdir -p /var/gogs

	# Use `docker run` for the first time.
	$ docker run --name=gogs -p 10022:22 -p 10080:3000 -v /var/gogs:/data gogs/gogs

	# Use `docker start` if you have stopped it.
	$ docker start gogs

在 Gogs 的 Docker 镜像中 Gogs 只挂载了 `/data` 目录，所有的数据都保存在该目录中。

	/var/gogs
	|-- git
	|   |-- gogs-repositories
	|-- ssh
	|   |-- # ssh public/private keys for Gogs
	|-- gogs
		|-- conf
		|-- data
		|-- log

观察该目录，就能看到主要是三个目录，结构一目了然。但是 QNAP 应用中结构就不那么清晰了。

`/git/gogs-repositories` 目录对应着 `/home/gogs-repositories` 目录，里面保存着所有 git 仓库文件。等启动 Docker 容器后，可以将该目录中的文件全部拷贝到 Docker 容器挂载的目录，比如我就是 `/share/gogs/git` 目录。

拷贝后可能还有权限问题，使用 `chown user:group -R *` 来解决一下（这里的 user group 要换成你系统中对应的）。

另外注意 `/gogs/conf/` 目录下的配置文件，这是一个全局的配置，非常重要。

## ERROR
Docker 启动过程中可能遇到如下错误：

	error: kex_exchange_identification: client sent invalid protocol identifier

初步判断就是 Docker 端口配置错误，我[之前配置](/post/2018/06/qnap-container-station.html) 的 Gogs 服务，监听的两个端口分别是 10080 和 10022，所以在 Container Station 中配置的时候改一下即可。


## External

Gitea 是一个 Gogs 的社区 fork [^1]，看[对比](https://docs.gitea.io/en-us/comparison/) 是一个 Gogs 极好的代替品。

[^1]: https://blog.gitea.io/2016/12/welcome-to-gitea/

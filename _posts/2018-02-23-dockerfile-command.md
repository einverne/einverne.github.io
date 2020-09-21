---
layout: post
title: "dockerfile 指令"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, docker, docker-image,]
last_updated:
---

通常情况下，我们并不使用 `docker commit` 方法来构建镜像，而是使用 `Dockerfile` 的定义文件和 `docker build` 命令来构建镜像。更多 Docker [入门](/post/2017/07/docker-introduction.html) 的内容可以参考之前的文章。

每条指令都会创建一个新的镜像层并对镜像进行提交，Docker 大致上按照下面的流程执行 Dockerfile 中的指令：

- Docker 从基础镜像运行一个容器
- 执行指令，对镜像做出修改
- 执行类似 docker commit 的操作，提交一个新的镜像层
- Docker 再基于刚刚提交的镜像运行一个新容器
- 执行 Dockerfile 中下一个指令，直到所有指令执行完毕

常见的命令 `RUN`，`EXPOSE` 之外，Dockerfile 还支持其他很多指令。

## CMD
CMD 指令用于指定容器**启动时要运行的命令**，类似 RUN，但是 RUN 指令是指镜像**被构建时要运行的命令**，而 CMD 是指定容器被启动时要运行的命令。**运行的命令放在一个数组结构中**

`docker run` 命令可以覆盖 CMD 指令

如果 Dockerfile 有多个 CMD 指令，只有最后一个会生效。

CMD 指令有很多种格式，最常见，也是官方推荐的格式是：

	CMD ["executable", "param1", "param2", ...]

## ENTRYPOINT
ENTRYPOINT 指令和 CMD 指令非常类似，之前说过 CMD 指令会被 docker run 命令覆盖，而 ENTRYPOINT 指令提供的命令**不容易在启动容器时被覆盖**。实际上， docker run 命令行中的指定的任何参数都会被当做参数再次传递给 ENTRYPOINT 指令中指定的命令。

ENTRYPOINT 可以让容器以应用程序或者服务的形式运行。

ENTRYPOINT 也有很多使用方式，比较推荐的是：

	ENTRYPOINT ["executable", "param1", "param2" ]

## WORKDIR
WORKDIR 指令用来在从镜像创建一个新的容器时，在容器内部设置一个**工作目录**，ENTRYPOINT 或 CMD 指定的程序会在该目录下执行。

可以通过 `-w` 参数在运行时覆盖工作目录

    sudo docker run -it -w /var/log ubuntu pwd

## ENV

ENV 指令用来在镜像构建过程中设置环境变量，新的环境变量能在后续任何 RUN 指令中使用。

	ENV RVM_PATH /home/rvm

同样也可以使用 `-e` 参数赖在运行时添加环境变量。

## USER
USER 指令用来指定镜像会以什么用户去运行

    USER nginx

镜像会以 nginx 用户去运行，同样也可以使用 `-u` 选项来覆盖该指令

## VOLUME
VOLUME 指令用来像基于镜像创建的容器添加卷，一个卷可以存在一个或者多个容器内的特定目录，这个目录可以绕过联合文件系统，提供**共享数据或者对数据持久化功能**。

- 卷可以在容器间共享和重用
- 对卷的修改是立即生效的
- 对卷的修改不会对更新镜像产生影响
- 卷会一直存在直到没有任何容器使用

卷功能让我们可以将数据，比如源代码，数据库等其他持久化内容添加到镜像中，而不是预先将这些内容提交到镜像内部，卷允许我们在多个容器间共享内容，可以利用此功能测试容器和内部应用代码，管理日志，处理内部数据库等等。

    VOLUME ["/opt/project"]

该指令会基于此镜像创建的任何容器创建一个名为 `/opt/project` 的挂载点。

## ADD
ADD 指令用来将构建环境下的文件和目录复制到镜像中。

ADD 指令通过目的地址参数末尾的字符来判断文件源是目录还是文件，如果目标地址以 `/` 结尾，那么 Docker 就认为源地址指向的是一个目录，如果目的地址不是 `/` 结尾，那么源地址就是文件。

## COPY
COPY 指令和 ADD 很类似，根本不同是 COPY 只关心在构建上下文中复制本地文件，而不会去做文件提取和解压的工作。

如果目的位置不存在， Docker 会自动创建所需要的目录结构

## ONBUILD
ONBUILD 指令能为镜像添加触发器，当一个镜像被用作其他镜像的基础镜像时，该镜像中的触发器会被执行。触发器会在构建过程中插入新指令，我们认为这些指令是紧跟 FROM 之后执行的。触发器可以是任何构建指令。

## reference

- 《第一本 Docker 书》

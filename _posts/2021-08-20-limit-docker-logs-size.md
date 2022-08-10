---
layout: post
title: "限制 Docker 容器日志的大小"
aliases: 
- 限制 Docker 容器日志的大小
tagline: ""
description: ""
category: 经验总结
tags: [ docker, log, log-framework, vps, linux, du, file-size ]
last_updated:
---

今天回到家突然发现[刚买](/post/2021/08/a400-vps-test-and-usage.html)的一台 VPS 根目录空间 100% 被占用了，使用 [du](/post/2018/03/du-find-out-which-fold-take-space.html) 一层层查看占用最后发现是 `/var/lib/docker/containers` 下有一个 json 日志文件占用了 20G 大小。

![](/assets/linux-vps-disk-space-usage-20210820180339.png)

简单的查了一下发现 Docker 容器的日志都会被记录在宿主机的 `/var/lib/docker/containers/` 路径下。而我有一个容器因为不停地输出日志，没多久就占了很大空间。

## Docker 容器日志
在默认情况下 Docker 容器的日志会输出到一个 [json-file](https://docs.docker.com/config/containers/logging/json-file/) 文件中，容器输出到 `stdout` 和 `stderr` 的内容加上时间戳会被记录到宿主机。

这些日志文件在宿主机的 `/var/lib/docker/containers/` 文件夹下，以这样的形式命名：

    /var/lib/docker/containers/<container id>/<container id>-json.log

## 限制 Docker 容器日志大小
修改 Docker 配置 `vi /etc/docker/daemon.json`

```
{
  "log-driver": "json-file",
  "log-opts": {"max-size": "10m", "max-file": "3"}
}
```

注意修改之后需要重启 Docker 使之生效 `sudo systemctl restart docker`。

或者针对个别容器设置，在 docker-compose.yml 中：

注意需要版本2及以上

```
version: '2'
services:
  app:
    container_name: app
    image: node
    restart: always
    logging:
      driver: "json-file"
      options:
       max-file: "5"     // number of files or file count
       max-size: "10m"  // file size
```

或者命令行：

    docker run --log-opt max-size=10m --log-opt max-file=5 my-app:latest

## Docker 日志策略和最佳实践

### 通过应用自己管理日志
应用自己去管理自己的日志，比如使用 Logging Framework，在 Java 中通常使用 log4j 将日志打印到一个远端的中心化地方，这样就可以绕过 Docker 和操作系统。这种方式给予了开发者更多的控制权。

为了保存日志数据，你可以配置一个持久化的存储或将日志转发到一个远程日志的系统，比如 [Elastic Stack](https://sematext.com/guides/elk-stack/) 或 [Sematext Cloud](https://sematext.com/cloud/)，但是基于应用的日志框架存在的问题便是如果部署了多个容器，那么你需要一个方式来告诉日志系统，哪些日志属于哪个容器。

### 通过 Data Volumes 记录日志
你可以在容器内部创建一个目录，然后将该目录挂载到宿主机上，那么一些长期或共享使用的数据可以长久的存储。你可以复制，备份，或者从其他容器访问这些数据。也可以在多个容器之间共享这些 volume。

但是使用 Data Volume 存在的问题是，很难将这些容器迁移到其他宿主机而不丢失数据。


### 通过 Docker Logging Driver 记录日志
在 Docker 下，另外一个记录日志的方式是使用 logging drivers。不像 Data Volumes, Docker logging driver 会从容器的 stdout 和 stderr 输出中直接读取数据。默认的配置会将这些日志记录到宿主机的一个文件中，但是改变 logging driver 可以允许你将事件转发给 syslog, gelf, journald 或其他 endpoints。

因为容器不再需要读写日志文件，可以提升一定的性能。但是也有一些弊端，[Docker log 命令](/post/2018/03/docker-logs.html)只能在 `json-file` log driver 下使用；log diver 有一些功能限制，日志文件只能被传输而不能被解析；当 TCP 服务不可达时，容器会 shut down。

### 使用专用的日志容器记录日志

另一个解决方案是通过一个专用的、独立的日志容器来记录和手机日志，这非常适用于微服务架构。这个优势在于这完全不依赖与宿主机。相反，专用的日志容器可以允许你在 Docker 的环境中管理日志文件。他会自动从其他容器收集日志，监控，分析，并且将他们转存到一个中心存储上。

这种方式使得我们可以轻易地将容器在不同的宿主机中移动，并且可以非常轻松的扩展日志基础设施，只需要增加日志容器即可。

### Logging Using the Sidecar Approach
和专用的日志容器类似，使用日志容器，但是不同点在于，每一个应用容器都有专用的日志容器，允许你对每一个应用的日志进行自定义。第一个容器会将日志文件打印到 volume，然后日志文件会日志容器打上标签，然后再被传送到日志管理系统。

使用 sidecar 的一个主要的优势是，你可以为每一个 log 增加额外自定义的标签，可以更好地确定其来源。

同样也有一些劣势，设置或扩容可能会变得非常复杂和困难，并且需要更多的资源。你需要确保应用容器和 sidecar 容器是一起进行工作的，否则可能会造成数据丢失。

## 复习一下日志相关命令：

- docker logs containerName
- docker logs -f containerName
- 显示 CPU 和内存使用 docker stats
- 显示具体容器的 CPU 和内存使用 docker stats containerName1 Name2
- 显示容器中运行的进程 docker top containerName
- Docker events: docker events
- 显示存储使用：docker system df

## Logging Driver
Logging driver 是 Docker 用来才运行的容器和服务中收集数据的机制，这使得数据更容易进行分析。当一个新的容器被创建，Docker 会自动使用 json-file log driver 作为默认。同时，你可以使用 logging driver plugins 来和其他日志工具进行交互。

下面是一个通过自定义 [logging driver](https://docs.docker.com/engine/admin/logging/overview/) 来和 syslog 交互的例子：

    docker run -–log-driver syslog –-log-opt syslog-address=udp://syslog-server:514  alpine echo hello world

## 如何配置 Docker Logging Driver
有两个选项：

- 为所有的容器设置默认的 logging driver
- 为每一个容器设置 logging driver

上面提过，默认的 logging driver 是 JSON 文件，其他选项有 logagent, syslog, fluentd, journald, splunk 等等。你可以通过修改 [Docker configuration 文件](https://docs.docker.com/v17.09/engine/admin/logging/overview/) 来进行配置：

```
# /etc/docker/daemon.json
{
  "log-driver": "journald"
}
```

然后再执行：

    systemctl restart docker
    
使之生效。

或者，你可以通过命令来为每一个容器单独设置

    docker run --log-driver syslog --log-opt syslog-address=udp://syslog-server:514 alpine echo hello word

## Logging Driver 选项

选项解释：

- logagent：这是一个通用的 log shipper，[Logagent Docker image](https://hub.docker.com/r/sematext/logagent/) 是一个提前配置好 Log 收集的镜像，Logagent 不仅会收集日志，还会收集诸如镜像名字，容器ID，容器名字，Swarm service 等 meta-data 或 Kubernetes meta-data。并且它可以处理多行日志，可以解析容器的日志等等
- syslog: 将日志转发到 syslog 服务
- journald:将容器日志发送到 systemd journal
- fluentd: 将日志信息发送到 Fluentd 收集器
- elf：将容器的日志写到 Graylog Extended Log Format(GELF) 端，比如 GrayLog 或 Logstash
- awslogs：将日志发送到 AWS CloudWatch Logs
- splunk：通过 HTTP Event Collector（HEC）将日志写到 Splunk
- cplogs：将日志发送到 Google Cloud Platform（GCP）Logging
- logentries: 将日志写到 Rapid7 Logentries
- etwlogs: 将日志写到 Event Tracing for Windows（ETW）


## reference

- <https://sematext.com/guides/docker-logs/>

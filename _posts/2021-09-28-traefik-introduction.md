---
layout: post
title: "Traefik 入门使用"
aliases: 
- "Traefik 入门使用"
tagline: ""
description: ""
category: 学习笔记
tags: [ traefik, nginx, cloud-native, reverse-proxy, ]
last_updated:
---


## Traefik 是什么

[Traefik](https://github.com/traefik/traefik) （音同 traffic），是一个 Cloud Native 的 HTTP reverse proxy（反向代理） 和 load balancer（负载均衡），反向代理服务器就是可以拦截流量并根据规则把流量导到特定的服务上。

在没有 [[Traefik]] 之前，如果在 orchestrator （比如 Swarm 或 Kubernetes） 或 service registry（比如 etcd 或 consul）下开发了一系列的微服务，并要让用户可以访问这些服务，你可能需要手动配置一个反向代理。传统的反向代理服务器（比如 Nginx）需要为每一个子域名到微服务服务进行配置。在一个每一天需要进行很多次增加，移除，升级，扩容的微服务环境下，传统的配置方式（基于配置文件）会变得非常繁琐。

Traefik 可以很好的和现存的基础架构结合到一起，包括 [Docker](https://www.docker.com/), [Swarm mode](https://docs.docker.com/engine/swarm/), [Kubernetes](https://kubernetes.io/), [Marathon](https://mesosphere.github.io/marathon/), [Consul](https://www.consul.io/), [Etcd](https://coreos.com/etcd/), [Rancher](https://rancher.com/), [Amazon ECS](https://aws.amazon.com/ecs) 等等

Traefik 会监听 service registry/orchestrator API 并且立即产生一个路由规则，这样微服务可以直接连接到外部的世界，不再需要额外的干预。

Kubernetes 负责把 Pod 容器自动分配到 Node 节点处理。

功能：

- 持续的更新配置，无需重启 Traefik 即可更新配置
- 自动的服务发现与负载均衡
- 支持多样的负载均衡算法
- 完美支持 `docker` 基于 `label` 配置
- 借助 [Let's Encrypt](https://letsencrypt.org/) 实现 HTTPS
- Circuit breakers, retry
- 通过网页界面查看路由
- `Websocket`, `HTTP/2`, `GRPC` ready
- metrics 的支持，支持对 `prometheus` 和 `k8s` 集成
- 提供监控指标（Rest, Prometheus, Datadog, Statsd, InfluxDB）
- 访问日志（JSON, CLF）
- 提供 Rest API
- 单一的二进制文件（Go 编写），提供官方的 [docker 镜像](https://hub.docker.com/r/_/traefik/)
- Dashboard 界面

## 概念
在进一步学习 Traefik 之前有几个在 Traefik 中的概念需要提前了解一下。

- Providers 是 Traefik 的服务提供方，可以是 orchestrators 也可以是容器引擎，cloud prividers 或者 key-values 存储。Traefik 需要依赖这些服务的 APIs 来自动发现服务和路由，然后动态的更新路由。
- Entrypoints 监听传入的流量，接口请求的端口
- Routers 分析请求，将请求连接到对应的服务
- Services，将请求转发给应用（load balancing），配置如何将流量最终传入这些 Services
- Middlewares ，中间件，用来修改请求或根据请求来做判断（authentication，rate limiting，headers），Middlewares 附加在路由上，在请求发送到服务之前（或者在服务响应发送到客户端之前）对请求进行调整

### Traefik 是如何发现服务的？
Traefik 能够通过 cluster API 自动发现服务，在 Traefik 的配置中，被称为 [provider](https://doc.traefik.io/traefik/providers/overview/)。比如 provider 配置了 Docker，那么 Traefik 会自动根据 Docker 提供的 API 来获取发现服务，并自动根据配置更新路由策略。

## 在 Docker 环境下使用 docker-compose 安装使用

为了了解最基本的使用，最好的方法就是实践自己启动一下。

```
version: '3'

services:
  traefik:
    container_name: traefik
    image: traefik:latest
    restart: always
    command: --api.insecure=true --providers.docker
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./ssl/:/data/ssl/:ro
      - ./traefik.yml:/etc/traefik.yml:ro
      - ./config/:/etc/traefik/config/:ro
      
# 先创建外部网卡
# docker network create traefik
networks:
  traefik:
    external: true
```

启动之后可以访问

- <http://localhost:8080/api/rawdata> 检查 Traefik 暴露的 API rawdata

上面的方式开启了 Traefik 的 Dashboard，可以直接访问 8080 端口。

然后使用 `whoami` 镜像做一下验证，该镜像会将请求的 header 信息输出在请求结果中。

```
version: '3'

services:
  whoami:
    # A container that exposes an API to show its IP address
    image: traefik/whoami
    labels:
      - "traefik.enable=true"
      # 设置Host 为 whoami.docker.localhost 进行域名访问
      - "traefik.http.routers.whoami.rule=Host(`whoami.docker.localhost`)"

# 使用已存在的 traefik 的 network
networks:
  default:
    external:
      name: traefik
```

当 whoami 的服务启动之后 Traefik 会自动根据 label 的配置，然后将 `whoami.docker.localhost` 的请求自动转发到 whoami 这个服务中。

然后修改一下本地的 `/etc/hosts` 文件，增加

    127.0.0.1 whoami.docker.localhost

然后用浏览器访问 `http://whoami.docker.localhost` 就可以看到 whoami 这个服务的返回。

或者直接使用 curl 请求：

```
❯ curl http://whoami.docker.localhost/
Hostname: 20f1d26a6db0
IP: 127.0.0.1
IP: 172.30.0.3
RemoteAddr: 172.30.0.2:49750
GET / HTTP/1.1
Host: whoami.docker.localhost
User-Agent: curl/7.58.0
Accept: */*
Accept-Encoding: gzip
X-Forwarded-For: 172.30.0.1
X-Forwarded-Host: whoami.docker.localhost
X-Forwarded-Port: 80
X-Forwarded-Proto: http
X-Forwarded-Server: ab231307712a
X-Real-Ip: 172.30.0.1
```


## Configuration
[[traefik-configuration]] 有两种配置方式：

- 完全动态的配置 (dynamic configuration)
- 静态初始配置（static configuration)


### 自动重定向到 https

所有到 80 端口的流量都会被重定向到 443 端口。

```
--entrypoints.web.address=:80
--entrypoints.web.http.redirections.entryPoint.to=websecure
--entrypoints.web.http.redirections.entryPoint.scheme=https
--entrypoints.web.http.redirections.entrypoint.permanent=true
--entrypoints.websecure.address=:443
```


## 部署举例

- [[Traefik 部署 n8n]]
- [[Traefik 部署 miniflux]]

## reference

- <https://hub.docker.com/_/traefik>
- <https://doc.traefik.io/traefik/getting-started/quick-start/>
- <https://docs.n8n.io/getting-started/installation/advanced/server-setup.html>
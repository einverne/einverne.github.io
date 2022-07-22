---
layout: post
title: "使用 Docker 安装最新 8.x Elasticsearch 和 Kibana"
aliases:
- "使用 Docker 安装最新 8.x Elasticsearch 和 Kibana"
tagline: ""
description: ""
category: 学习笔记
tags: [ docker, elasticsearch, kibana, ]
create_time: 2022-07-10 18:32:16
last_updated: 2022-07-10 18:32:16
---

[[Elasticsearch]] 是基于 [[Lucene]] 开源的全文搜索引擎。提供 RESTful 接口，可以实现精确快速的实时检索。

[[Kibana]] 是一个基于 Web 的可视化前端。还有一个 [[elasticsearch-head]] 也是一个 Elasticsearch 的前端，不过这里因为 Kibana 使用场景更加广泛，就选择 Kibana。

## Installation

创建 network:

```
docker network create elastic
```

这里仅演示单节点的 Elasticsearch 搭建过程，如果要搭建集群模式，可以自行参考官网。

```
version: "3.0"

services:
  elasticsearch:
    container_name: es
    image: elasticsearch:8.3.2
    environment:
      - xpack.security.enabled=false
      - "discovery.type=single-node"
      - "ELASTIC_PASSWORD=${ELASTIC_PASSWORD}"
    networks:
      - elastic
    ports:
      - 9200:9200
  kibana:
    container_name: kibana
    image: kibana:8.3.2
    environment:
      - ELASTICSEARCH_HOSTS=http://es:9200
    networks:
      - elastic
    depends_on:
      - elasticsearch
    ports:
      - 5601:5601

networks:
  elastic:
    driver: bridge
```

Docker compose 会启动两个容器，一个容器运行 Elasticsearch，使用端口 9200，一个容器运行 Kibana 使用端口 5601.

两个镜像最新的版本可以分别在这里查看：

- <https://hub.docker.com/_/elasticsearch>
- <https://hub.docker.com/_/kibana>

使用如下的命令检查 Elasticsearch 的状态：

```
❯ curl http://localhost:9200
{
  "name" : "d9f0b969f13c",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "VRWzzZpISPugOCQadlC88A",
  "version" : {
    "number" : "8.3.2",
    "build_type" : "docker",
    "build_hash" : "8b0b1f23fbebecc3c88e4464319dea8989f374fd",
    "build_date" : "2022-07-06T15:15:15.901688194Z",
    "build_snapshot" : false,
    "lucene_version" : "9.2.0",
    "minimum_wire_compatibility_version" : "7.17.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "You Know, for Search"
}
```

当启动 Elasticsearch 之后会产生一些证书，这些证书用来安全的在 Kibana 中访问 Elasticsearch。

- `http_ca.crt`：CA 证书，用来签名 HTTP 请求
- `http.p12`：Keystore that contains the key and certificate for the HTTP layer for this node.
- `transport.p12`：Keystore that contains the key and certificate for the transport layer for all the nodes in your cluster.

`http.p12` 和 `transport.p12` 是密码保护的 PKSC#12 keystore。

可以使用如下命令获取 `http.p12` 密码：

```
bin/elasticsearch-keystore show xpack.security.http.ssl.keystore.secure_password
```

可以使用如下命令获取 `transport.p12` 密码：

```
bin/elasticsearch-keystore show xpack.security.transport.ssl.keystore.secure_password
```

等待容器启动之后可以直接访问 Kibana `http://localhost:5601/` 


## reference

- <https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html>
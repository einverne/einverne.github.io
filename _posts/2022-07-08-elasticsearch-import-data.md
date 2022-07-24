---
layout: post
title: "Elasticsearch 导入数据"
aliases:
- "Elasticsearch 导入数据"
tagline: ""
description: ""
category: 学习笔记
tags: [ elasticsearch, kibana, import-data, csv, ]
create_time: 2022-07-10 19:12:50
last_updated: 2022-07-24 07:53:40
---

Elasticsearch 既然作为一个全文检索引擎，那么自然需要将数据导入，让 Elasticsearch 去索引。

Elasticsearch(后简写为 ES) 的基本单元是文档，使用 JSON 来描述。

有很多方法可以把数据导入到 ES：

- RESTful 接口
- Bulk API 批量导入
- elasticsearch-dump
- Logstash 将收集的数据导入

## Prerequisite
导入数据前要了解的知识。

- Cluster，集群，通常由多个节点组成 ES 集群
- Index，通常称为索引，文档的属性
- Document，文档，JSON 格式定义的数据
- Shard，分片，索引会水平分片
- Replicas，ES 允许用户创建索引和分片的 Replicas

## RESTful 接口导入
如果数据文件比较简单，只有单层 JSON 结构，并且小于 1MB，可以使用 POST 请求直接将数据提交到 ES。

假设有数据 `accounts.json`：

```
{"account_number":1,"balance":39225,"firstname":"Amber","lastname":"Duke","age":32,"gender":"M","address":"880 Holmes Lane","employer":"Pyrami","email":"amberduke@pyrami.com","city":"Brogan","state":"IL"}
```

然后可以使用如下命令导入：

```
curl -u admin:my_elastic_pass -H 'Content-Type: application/json' -XPOST 'http://localhost:9200/accounts/_doc/_bulk?pretty' --data-binary @accounts.json
```

返回：

```
{
  "_index" : "accounts",
  "_id" : "_bulk",
  "_version" : 1,
  "result" : "created",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 0,
  "_primary_term" : 1
}
```

可以通过如下命令来查看所有索引的情况：

```
curl "localhost:9200/_cat/indices?v"
```

然后访问 Kibana，在后台就可以查询导入的内容：

![kibana](https://img.gtk.pw/i/2022/07/24/62dd2e9c827b7.png)

## Bulk

这里使用官方的样例数据：

```
wget https://download.elastic.co/demos/kibana/gettingstarted/accounts.zip
unzip accounts.zip
curl -XPOST 'localhost:9200/bank/account/_bulk?pretty' --data-binary @accounts.json
```

需要注意的是如果使用 Bulk 批量导入，那么格式需要按照：

```
action_and_meta_data\n
optional_source\n
action_and_meta_data\n
optional_source\n
....
action_and_meta_data\n
optional_source\n
```

或者可以在 Kibana 后台，点击侧边栏 Dev Tools，然后在编辑框中输入：

```
POST bank/_bulk
{"index":{"_id":"1"}}
{"account_number":1,"balance":39225,"firstname":"Amber","lastname":"Duke","age":32,"gender":"M","address":"880 Holmes Lane","employer":"Pyrami","email":"amberduke@pyrami.com","city":"Brogan","state":"IL"}
{"index":{"_id":"6"}}
{"account_number":6,"balance":5686,"firstname":"Hattie","lastname":"Bond","age":36,"gender":"M","address":"671 Bristol Street","employer":"Netagy","email":"hattiebond@netagy.com","city":"Dante","state":"TN"}
省略...
```

最后点击执行。

![kibana devtool bulk import](https://img.gtk.pw/i/2022/07/24/62dd30e2b1781.png)

执行成功后，可以运行 `curl localhost:9200/bank/_search`，如果返回值中 `value` 是导入的条数就表示成功了。

## elasticsearch-dump

- GitHub: <https://github.com/elasticsearch-dump/elasticsearch-dump>

## Logstash
Logstash 是开源的服务器端数据处理管道，能够同时从多个来源采集数据、转换数据，然后将数据发送到 Elasticsearch 中。Logstash 的官方文档请参见：<https://www.elastic.co/guide/en/logstash/current/getting-started-with-logstash.html>

## reference

- <https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html

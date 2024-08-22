---
layout: post
title: "Rust 编写的开源全文搜索引擎 Meilisearch"
aliases:
- "Rust 编写的开源全文搜索引擎 Meilisearch"
tagline: ""
description: ""
category: 产品体验
tags: [meilisearch, elasticsearch, rust, search, index, open-source, docker]
create_time: 2024-08-22 10:41:50
last_updated: 2024-08-22 10:41:50
dg-home: false
dg-publish: false
---

[meilisearch](https://www.meilisearch.com/) 是一个使用 Rust 编写的全文搜索引擎，高性能，易用，可扩展。虽然之前使用过 [[Elasticsearch]]，但是如果自己要维护一个分布式的实例还是挺困难的，正好在我的笔记里面之前有记录下来 meilisearch，Rust 编写，效率高，占用低，就正好学习总结一下。

有一个项目自己的服务器跑了好几年，抓取了超过一千万条下载信息，PostgreSQL 已经不堪重负，经常查询一条数据需要好几秒的时间，单纯的使用 SQL 查询已经完全满足不了需求，也就正好使用 meilisearch 重构一下。

## 功能

- **高性能**：Meilisearch 可以在任何规模的数据集上实现快速搜索，通常在 50 毫秒内返回结果。它支持“搜索即输入”（Search-as-you-type）功能，提供实时反馈，并具有拼写容错能力，即使查询中存在错误也能返回相关结果。
- **相关性优化**：支持自定义排序、分面搜索和同义词管理，使搜索结果更加灵活和相关。
- **多语言支持**：针对多种语言进行了优化，包括中文、日文等非拉丁语系，并支持停用词处理，忽略对搜索结果影响不大的常见词。
- **高级功能**：包括地理位置搜索、多租户支持、高亮显示匹配文本，以及文档管理功能（添加、更新、删除索引中的文档）。



## 安装

推荐使用 [Docker Compose](https://github.com/einverne/dockerfile) 的方式安装。

```
git clone https://github.com/einverne/dockerfile.git
cd dockerfile/meilisearch
cp env .env
# edit .env
docker-compose up -d
docker-compose logs -f
```

## 导入数据示范

准备数据 `movies.json`

```
[
  { "id": 1, "title": "Inception", "genre": "Sci-Fi", "release_year": 2010 },
  { "id": 2, "title": "Interstellar", "genre": "Sci-Fi", "release_year": 2014 },
  { "id": 3, "title": "The Dark Knight", "genre": "Action", "release_year": 2008 }
]
```

然后确保

```
curl -X POST 'http://localhost:7700/indexes/movies/documents' \
-H 'Authorization: Bearer YOUR_MASTER_KEY' \
-H 'Content-Type: application/json' \
--data-binary @movies.json
```

这里一定将 Authorization 替换成自己的 YOUR_MASTER KEY。提交成功之后创建了索引，并且可以直接通过界面进行查询。

## 查询数据

```
curl -X POST 'http://localhost:7700/indexes/movies/search' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer YOUR_MASTER_KEY' \
--data-binary '{
  "q": "Inter"
}'
```

可以查询获得结果。

## 缺点

Meilisearch 在中小数据集上的表现最好，但是根据 HackerNews 的测试，在测试导入 1.16 亿条 HackerNews 数据的时候 Meilisearch 性能显著下降。[^1]

[^1]: <https://hackernoon.com/comparing-meilisearch-and-manticore-search-using-key-benchmarks>


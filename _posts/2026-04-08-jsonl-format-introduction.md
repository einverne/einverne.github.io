---
layout: post
title: "JSONL 格式详解：为什么越来越多的数据工具都在用它"
aliases:
- "JSONL 格式详解：为什么越来越多的数据工具都在用它"
tagline: "一行一个 JSON 对象，简单却解决了大问题"
description: "介绍 JSONL（JSON Lines）格式的定义、与传统 JSON 格式的核心区别、适用场景，以及在日常数据处理中的实际使用方式。"
category: 学习笔记
tags: [jsonl, json, data-format, data-processing, streaming, log, ndjson]
create_time: 2026-04-08 15:00:00
last_updated: 2026-04-08 15:00:00
---

![JSONL 格式详解](https://pic.einverne.info/images/2026-04-08-jsonl-format.png)

最近在处理一批从 [[OpenAI]] API 导出的微调数据时，我注意到官方要求的训练数据格式不是普通的 JSON，而是 `.jsonl`。打开文件一看，每一行都是一个独立的 JSON 对象，没有外层的方括号，也没有逗号把它们串起来。一开始觉得这不过是把 JSON 数组拆开写罢了，但真正用起来之后才发现，这种看似简单的格式变化，在数据处理的效率和灵活性上带来了非常显著的提升。

## JSONL 是什么

JSONL 的全称是 JSON Lines，有时候也被叫做 Newline Delimited JSON（NDJSON）。它的规则可以用一句话概括：文件中的每一行都是一个合法的 JSON 值，行与行之间用换行符 `\n` 分隔。就这么简单，没有额外的语法，没有文件头或文件尾需要处理。

一个标准的 JSONL 文件长这样：

```json
{"name": "Alice", "age": 30, "city": "Tokyo"}
{"name": "Bob", "age": 25, "city": "Osaka"}
{"name": "Charlie", "age": 35, "city": "Kyoto"}
```

每一行都是完全自包含的，你可以单独解析任何一行而不需要知道其他行的内容。这一点是 JSONL 和传统 JSON 最本质的区别，后面会详细展开。

JSONL 的 MIME 类型是 `application/jsonl`，文件扩展名通常用 `.jsonl`。如果你见到 `.ndjson` 后缀，本质上也是同一回事，只不过名称来源于 NDJSON 规范，两者在格式定义上几乎完全一致。

## 和 JSON 格式的核心区别

直觉上 JSONL 和 JSON 差距不大，毕竟每一行都是合法的 JSON。但当数据量上去之后，两者在使用体验上差异就很明显了。

传统的 JSON 格式，当你要表示一组记录时，通常写成一个数组：

```json
[
  {"name": "Alice", "age": 30, "city": "Tokyo"},
  {"name": "Bob", "age": 25, "city": "Osaka"},
  {"name": "Charlie", "age": 35, "city": "Kyoto"}
]
```

这种写法在数据量小的时候完全没有问题，解析器把整个文件读进来，转换成内存中的数组，然后你随便遍历就好了。但一旦数据量达到几百 MB 甚至 GB 级别，问题就出来了。JSON 解析器通常需要把整个文件加载到内存中才能完成解析，因为它必须找到最外层数组的闭合括号 `]` 才能确认文件结构是完整的。这意味着一个 2GB 的 JSON 文件，你至少需要 2GB 以上的内存才能开始处理。

JSONL 则完全不同。因为每一行都是独立的 JSON 对象，你可以逐行读取、逐行解析。处理完一行就释放这一行的内存，再去读下一行。内存占用基本上只取决于单行数据的大小，和整个文件有多大没有关系。这对于日志分析、数据管道、机器学习训练集这类场景来说，几乎是刚需。

还有一个经常被忽略的区别：追加写入。如果你有一个不断增长的数据集——比如服务器每秒都在产生日志——用 JSON 格式就很麻烦。每次新增一条记录，你需要先读取整个 JSON 数组，在末尾追加新元素，再把整个文件写回去。而 JSONL 只需要在文件末尾直接追加一行，一个 `>>` 重定向就搞定了。这在高频写入场景下差距是巨大的。

另外在容错方面也值得一提。一个 JSON 文件如果中间某处格式出错，比如多了一个逗号或者少了一个括号，整个文件就解析不了了。JSONL 不会有这个问题，即使某一行有格式错误，其他行依然可以正常解析。你可以跳过出错的行继续处理，也可以把出错的行单独记录下来后续修复。这种天然的容错能力在生产环境中非常有价值。

## 为什么这么多工具在采用 JSONL

了解了 JSONL 的特点之后，就不难理解为什么越来越多的数据工具和 API 都在用它作为默认格式了。

[[OpenAI]] 的 Fine-tuning API 要求训练数据必须是 JSONL 格式，每一行是一组对话样本。[[BigQuery]] 在导入导出数据时原生支持 JSONL，而且在性能测试中 JSONL 的导入速度通常比等量的 JSON 快不少。[[Elasticsearch]] 的 Bulk API 也使用了类似的行分隔格式。[[AWS]] 的多个数据服务，包括 [[Athena]]、[[Glue]]、[[S3 Select]]，都把 JSONL 作为推荐的数据交换格式。

在日志和监控领域，JSONL 更是标配。[[Docker]] 的 json-file 日志驱动产生的就是 JSONL 格式。各种日志收集工具比如 [[Fluentd]]、[[Vector]]、[[Logstash]] 都对 JSONL 有一流的支持。原因很直接：日志天然就是一行一条记录，而且需要高频追加写入和流式读取，JSONL 完美匹配这些需求。

在数据科学和机器学习领域，[[Hugging Face]] 的 Datasets 库原生支持 JSONL 格式加载，[[pandas]] 的 `read_json` 函数通过设置 `lines=True` 参数就可以直接读取 JSONL 文件。这些工具之所以选择支持 JSONL，核心原因就是前面提到的内存效率——在处理大规模训练数据集时，你不可能把所有数据一次性加载到内存中。

## 实际使用中的注意事项

在 [[Python]] 中处理 JSONL 非常直观。读取一个 JSONL 文件只需要逐行读取加 `json.loads`：

```python
import json

with open("data.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        record = json.loads(line)
        # 处理每条记录
```

写入也一样简单：

```python
import json

records = [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25},
]

with open("data.jsonl", "w", encoding="utf-8") as f:
    for record in records:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
```

有几个实际使用中容易踩的坑值得提前说一下。第一个是编码问题，JSONL 规范推荐使用 UTF-8 编码，处理中文、日文等多字节字符时一定要确保编码正确，写入时建议加上 `ensure_ascii=False` 参数，否则中文字符会被转义成 `\uXXXX` 的形式，虽然技术上合法，但可读性很差。

第二个是空行处理。JSONL 规范允许文件末尾有一个空行，但中间不应该出现空行。读取时最好加一个 `line.strip()` 判断，跳过空行，避免解析报错。

第三个是单行数据的大小。虽然 JSONL 规范本身没有限制单行长度，但某些工具或系统可能对此有限制。比如某些日志系统默认最大行长度是 1MB，如果单条记录特别大，可能会被截断。遇到这种情况可以考虑对数据做拆分或压缩。

在命令行下处理 JSONL 也非常方便。[[jq]] 可以直接处理 JSONL 输入而不需要任何特殊参数，因为 jq 默认就是逐行解析 JSON 的：

```bash
# 从 JSONL 文件中提取所有 name 字段
cat data.jsonl | jq '.name'

# 过滤特定条件的记录
cat data.jsonl | jq 'select(.age > 30)'

# 统计记录数
wc -l data.jsonl
```

用 `wc -l` 就能知道文件有多少条记录，用 `head` 和 `tail` 就能查看前几条或后几条，用 `grep` 可以快速过滤包含特定关键词的行。这些 Unix 工具天然就是按行操作的，和 JSONL 配合起来几乎零学习成本。

## JSON 和 JSONL 之间的互转

在日常工作中经常需要在两种格式之间转换。用 jq 可以非常优雅地完成这件事。

把 JSON 数组转成 JSONL：

```bash
# 将 JSON 数组展开成 JSONL
jq -c '.[]' data.json > data.jsonl
```

`-c` 参数确保每个对象输出在一行上，`.[]` 把数组中的每个元素逐一输出。

反过来，把 JSONL 合并成 JSON 数组：

```bash
# 将 JSONL 合并成 JSON 数组
jq -s '.' data.jsonl > data.json
```

`-s`（slurp）参数让 jq 把所有输入行收集成一个数组。需要注意的是，这个操作会把整个文件读进内存，所以对于非常大的 JSONL 文件，这种转换方式可能不太合适。

在 Python 中做这个转换也很简单，JSON 转 JSONL：

```python
import json

with open("data.json", "r") as f:
    data = json.load(f)

with open("data.jsonl", "w") as f:
    for record in data:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
```

## 什么时候应该用 JSONL 而不是 JSON

并不是所有场景都适合用 JSONL 替代 JSON。JSONL 最适合的是那些数据结构扁平、记录之间相互独立、需要流式处理或高频追加写入的场景。典型的例子包括日志文件、事件流、数据库导出、机器学习训练数据、API 批量响应等。

而配置文件、嵌套结构复杂的文档、需要表示层级关系的数据，用传统的 JSON（或者 [[YAML]]、[[TOML]]）更合适。JSONL 的每一行都是独立的，它天然不擅长表达记录之间的层级或引用关系。

还有一个判断标准是数据的消费方式。如果数据需要被一次性整体加载然后做复杂查询，JSON 可能更方便，因为你可以直接得到一个完整的数据结构。但如果数据是被逐条消费的——比如一个数据管道中的中间格式，或者一个 API 的流式响应——JSONL 几乎总是更好的选择。

## 最后

JSONL 不是什么全新的发明，它本质上就是把 JSON 的使用方式做了一个很小但很关键的调整：从"一个文件就是一个完整的 JSON 值"变成了"一个文件中每一行都是一个完整的 JSON 值"。这个看似微不足道的变化，带来的是流式处理能力、内存效率、追加写入便利性和容错能力的全面提升。

在数据越来越大、实时性要求越来越高的今天，JSONL 这种简单直接的格式反而越来越受欢迎。理解它和 JSON 之间的区别，在合适的场景下选择合适的格式，是每个经常和数据打交道的人都值得掌握的基础知识。

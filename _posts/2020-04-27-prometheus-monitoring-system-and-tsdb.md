---
layout: post
title: "Prometheus: 监控系统和时序数据库"
aliases: "Prometheus: 监控系统和时序数据库"
tagline: ""
description: ""
category: 学习笔记
tags: [prometheus, monitor, tsdb, time-series,]
last_updated:
---

Prometheus 是一个用 Go 写的监控系统，最早由 SoundCloud 开发并开源，Prometheus 内置一个时序数据库。Prometheus 受到 Google borgmon 监控系统启发，2012 年起源于 SoundCloud 内部，后来成为第二个加入 Cloud Native Computing Foundation 的项目。

> It collects metrics from configured targets at given intervals, evaluates rule expressions, displays the results, and can trigger alerts if some condition is observed to be true.

Prometheus 以固定的频率从配置的目标采集监控指标信息，经过计算，显示结果，并且观察到某些条件成真时发出告警。

Prometheus 区别于其他监控系统的地方在于：

- 一个**多维**的数据模型（Dimensional data model 通过指标名字定义的时序以及键值的组合）

	- 时序数据通过 metric 和 key-value 区分
	- metric 可以设置任意维度标签
	- 双精度浮点，Unicode 标签

- 灵活强大的查询语言 ([[PromQL]])，可以轻易的利用其多维信息
- Prometheus 服务是一个单独的二进制文件，可以直接在本地工作
- 无需依赖分布式存储；单服务器节点是自治的 (single server nodes are autonomous)
- 高效：每个采样点只有 3.5 bytes 占用，单一服务每秒可以处理百万级别 metrics
- 通过在 HTTP 上的 pull 模型实现采集
- pushing timeseries 通过中间网关支持
- 监控目标可以通过服务发现 (service discovery) 或者静态配置 (static configuration) 实现
- 多种图形和仪表板支持，结合 [Grafana](https://prometheus.io/docs/visualization/grafana/) 可以实现更丰富的展示
- 支持分层和水平的联合 (federation)


SoundCloud 在其官方博客 [Prometheus: Monitoring at SoundCloud](https://developers.soundcloud.com/blog/prometheus-monitoring-at-soundcloud) 中提到设计这套监控系统的目标：

	A multi-dimensional data model, so that data can be sliced and diced at will, along dimensions like instance, service, endpoint, and method.
	Operational simplicity, so that you can spin up a monitoring server where and when you want, even on your local workstation, without setting up a distributed storage backend or reconfiguring the world.
	Scalable data collection and decentralized architecture, so that you can reliably monitor the many instances of your services, and independent teams can set up independent monitoring servers.
	Finally, a powerful query language that leverages the data model for meaningful alerting (including easy silencing) and graphing (for dashboards and for ad-hoc exploration).

除了上面提到的 Prometheus 特性，在后来的发展中，Prometheus 不断的新增特性，比如 [服务发现](https://prometheus.io/docs/operating/integrations/#file-service-discovery)，[外部存储](https://prometheus.io/docs/prometheus/latest/storage/#remote-storage-integrations)，[告警规则和多种通知方式](https://prometheus.io/docs/alerting/overview/)。

Prometheus 目前已经支持 Kubernetes, etcd, Consul 等多种服务发现机制。

为了扩展 Prometheus 的采集能力和存储能力，Prometheus 引入了"联邦"的概念。多个 Prometheus 组成两层联邦，上层定时从下层 Prometheus 节点获取数据并汇总，部署多个联邦节点实现高可用。下层节点分别负责不同区域的数据采集，下层 Prometheus 节点可以被部署到单独的机房充当代理。

## Prometheus 组成

Prometheus 有很多可选组件：

- Prometheus Server: 收集存储时间序列，并对外提供 API，提供 PromQL 查询语言
- Client：为需要监控的服务生成相应的 metrics 并暴露给 Prometheus Server，Server pull 时直接返回实时状态
- Push Gateway：用户可以主动向其中 push 数据，用于短期 job
- Exporters: 暴露已有的第三方服务 metrics，等待 server 拉取
- Alertmanager: 从 Prometheus server 接收到 alerts 后，进行数据处理，发出报警，报警方式有：邮件，Slack，pagerduty, OpsGenie, webhook 等

大致工作流：

- Prometheus Server 定期从配置的目标 (Target) 或者 exporters 中 pull 拉取 metrics，或者接收来自 Pushgateway 发送的 metrics
- Prometheus 在本地存储 metrics 数据，并通过一定规则清洗整理数据，把得到的结果记录到时间序列
- 得到数据后，根据制定的报警规则，计算报警指标
- Alertmanager 根据配置，对接收到的报警进行处理
- 在图形界面中可视化采集的数据

从上面的介绍能比较清晰的看到 Prometheus 定时从被监控的组件中获取监控数据，而任意的组件只要提供对应的 exporter (Prometheus 这里使用 HTTP 协议） 就可以快速接入监控。这种模式就特别适合微服务，或者容器。而目前常见的组件，Prometheus 都提供了对应的 [exporter](https://prometheus.io/docs/instrumenting/exporters/)，比如 Haproxy, Nginx, MySQL, Linux 系统信息等等。

## 相关概念

### 数据模型 {#model}

时间序列由 metric 名和一组 key-value 标签组成。

- metric 名：语义的名字，一般用来表示 metric 功能，比如： http_requests_total， http 总请求数。metric 名由 ASCII 字符，数字，下划线，冒号组成，必须满足 `[a-zA-Z_:][a-zA-Z0-9_:]*`[^name]
- 标签：一个标签就是一个维度，`http_requests_total{method="Get"}` 表示所有 http 请求中 Get 请求，method 就是一个标签，标签需要满足 `[a-zA-Z_:][a-zA-Z0-9_:]*`[^name]
- 样本：实际时间序列，每个序列包括 float64 值和一个毫秒级时间戳

组合样式：

	 <metric name>{<label name>=<label value>, ...}

举例：

	http_requests_total{method="POST",endpoint="/api/tracks"}

### metric 类型
Client 提供如下 metric 类型：[^metrictype]

[^metrictype]: [Metric types](https://prometheus.io/docs/concepts/metric_types/)

- Counter: 累加 metric，只增不减的计数器，默认值为 0，典型应用场景：请求个数，错误次数，执行任务次数
- Gauge: 计量器，与时间无关的瞬时值，值可增可减，比如：当前温度，CPU 负载，运行的 goroutines 个数，数值可以任意加减，node_memory_MemFree 主机当前空闲大小，node_memory_MemAvailable 可用内存
- Histogram：柱状图，直方图，表示一段时间内的资料信息，用于请求时间，响应大小，可以对结果进行采样，分组和统计
- Summary: 类似 Histogram，但提供了 quantiles 功能，昆虫安装百分比划分结果，比如 quantile 为 0.99，表示取采样数据中的 95 数据。

## Installation & Usage

### Prometheus Server
Prometheus Server 可以有很多安装方式，Docker，Ansible，Chef，Puppet，SaltStack 等等，具体可以参考官网。

通过 Docker 安装：

	docker run --name prometheus -d \
	-p 9090:9090 \
	-v ~/docker/prometheus:/etc/prometheus \
	prom/prometheus

如果把 Prometheus 的配置映射到了本地，可以直接去 `~/docker/prometheus/` 下查看配置。

或者使用 Docker compose:

```
version: '2'
services:
  prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'
  ports:
    - '9090:9090'
```

### Node exporter
Prometheus 主要用于监控 Web 服务，如果要监控物理机，则需要在机器上安装 node exporter, exporter 会暴露 metrics 给 Prometheus，包括 CPU 负载，内存使用，磁盘 IO，网络等等。[^exporter]

[^exporter](https://github.com/prometheus/node_exporter#enabled-by-default)

node exporter 安装步骤：[^exporterinstall]

[^exporterinstall]: <https://devopscube.com/monitor-linux-servers-prometheus-node-exporter/>

在[官网](https://prometheus.io/download/#node_exporter) 获取最新的 node exporter 地址：

	curl -LO https://github.com/prometheus/node_exporter/releases/download/v0.18.1/node_exporter-0.18.1.linux-amd64.tar.gz

解压

	tar -xzvf node_exporter-0.18.1.linux-amd64.tar.gz

移动到 `/usr/local/bin` 目录

	sudo mv node_exporter-0.18.1.linux-amd64/node_exporter /usr/local/bin/

创建 node exporter service，首先创建用户，然后添加服务

	sudo useradd -rs /bin/false node_exporter
	sudo vi /etc/systemd/system/node_exporter.service

保存如下内容：

```
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
```

重新加载 system daemon，启动服务：

	sudo systemctl daemon-reload
	sudo systemctl start node_exporter

	sudo systemctl status node_exporter

开机启动：

	sudo systemctl enable node_exporter

服务启动后会监听 9100 端口，使用如下命令验证：

	curl http://localhost:9100/metrics

或者查看 9100 端口是否起来 `netstat -anp | grep 9100`.

配置这台服务器作为 Prometheus Server 的 Target 监控目标。

	sudo vi /etc/prometheus/prometheus.yml

在 scrape 配置下，记得 IP 换成自己的

	- job_name: 'node_exporter_metrics'
	  scrape_interval: 5s
	  static_configs:
	    - targets: ['10.10.0.1:9100']

重启 Prometheus 服务，如果是 Docker 起的，则需要重启容器

	sudo systemctl restart prometheus

到 Prometheus 后台 Targes 下验证是否添加成功。

简单查询验证：

	node_memory_MemFree_bytes
	node_cpu_seconds_total
	node_filesystem_avail_bytes
	rate(node_cpu_seconds_total{mode="system"}[1m])
	rate(node_network_receive_bytes_total[1m])

### Alert Manger
Alert Manger 也可以通过 Docker 来安装使用：

	docker run -d -p 9093:9093 \
        -v /path/to/alertmanager/config.yml:/etc/alertmanager/config.yml \
		--name alertmanager \
		prom/alertmanager

### push gateway
Prometheus 默认的数据采集方式是通过 pull 模型，在配置中能看到 5 秒的配置，但是如果有些数据不适合使用这样的方式来监控，那么就需要使用 Push Gateway 将数据 Push 给 Prometheus 。

	docker run -d -p 9091:9091 --name pushgateway prom/pushgateway

通过浏览器访问 9091 端口，Prometheus 提供了多个语言的 SDK 用来想 Push Gateway 发送数据，为了测试可以使用 shell 命令：

	echo "cqh_metric 100" | curl --data-binary @- http://ip:9091/metrics/job/cqh

推送多个指标：

	cat <<EOF | curl --data-binary @- http://ip:9091/metrics/job/cqh/instance/test
	muscle_metric{label="gym"} 8800
	bench_press 100
	dead_lift 160
	deep_squal 160
	EOF


### Grafana

通过 Docker compose 安装：

```
grafana:
  image: grafana/grafana
  volumes:
      - grafana_data:/var/lib/grafana
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=pass
  depends_on:
    - prometheus
  ports:
    - '3000:3000'
```

## Prometheus config
在安装好 Prometheus 会有 yaml 格式的配置文件。主要分为这几个部分：

- `global`: 全局配置
- `scrape_configs`: 定义 Prometheus 需要 pull 的目标
- `alerting`: Alertmanager 配置
- `rule_files`: 告警规则

更多参数的解释可以参考[官网](https://prometheus.io/docs/prometheus/latest/configuration/configuration/).

### alert rules
告警配置样例。

```
# Alert for any instance that is unreachable for >5 minutes.
ALERT InstanceDown   # alert 名字
  IF up == 0           # 判断条件
  FOR 5m             # 条件保持 5m 才会发出 alert
  LABELS { severity = "critical" }  # 设置 alert 的标签
  ANNOTATIONS {             # alert 的其他标签，但不用于标识 alert
    summary = "Instance {{ $labels.instance }} down",
	description = "{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 5 minutes.",
  }
```


## 使用 Prometheus 监控 Flask 应用

我在最初寻找监控系统的时候就是为了给 Flask 应用使用。而 Prometheus 在各个方面都超出了我的预期，不过再回到原始的初衷。

Flask 中使用 Prometheus 需要引入 `prometheus_client` , Prometheus 的 Python 客户端。

```
import prometheus_client
from prometheus_client import Counter
from flask import Response, Flask, jsonify

app = Flask(__name__)

total_requests = Counter('request_count', 'Total webapp request count')

@app.route('/metrics')
def requests_count():
	total_requests.inc()
	return Response(prometheus_client.generate_latest(total_requests), mimetype='text/plain')

@app.route('/')
def index():
	total_requests.inc()
	return jsonify({
	    'status': 'ok'
	})

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5000)
```

修改 `prometheus.yml` 配置文件。

```
scrape_configs:
  - job_name: 'prometheus'
  static_configs:
    - targets: ['localhost:9090']
  - job_name: 'api_monitor'
  scrape_interval: 5s
  static_configs:
   - targets: ['web:5000']
```


## PromQL
Prometheus 内置了数据查询语言 `PromQL`，它提供对时间序列数据丰富的查询，聚合以及逻辑运算的能力。同时也可以利用 `PromQL` 做告警和数据可视化。利用 Prometheus 可以轻易的回答这些问题：[^answer]

[^answer]: <https://yunlzheng.gitbook.io/prometheus-book/parti-prometheus-ji-chu/>

- 访问量前 10 的 HTTP 地址 `topk(10, http_requests_total)`
- 计算 CPU 温度在两个小时内的差异 `delta(cpu_temp_celsius{host="zeus"}[2h])`
- 预测系统磁盘空间在 4 个小时之后的剩余情况 `predict_linear(node_filesystem_free{job="node"}[1h], 4 * 3600)`
- 过去 5 分钟占用 CPU 最高的应用服务


`PromQL` 是 Prometheus 中非常重要的概念。最简单的使用方式就是输入指标名称，比如

	up

指定 label 查询：

	up{job="prometheus"}

或者使用 [Instant vector selectors](https://prometheus.io/docs/prometheus/latest/querying/basics/#instant-vector-selectors):

	up{job!="prometheus"}
	up{job=~"server|mysql"}
	up{job=~"10\.10\.0\.1.+"}

`=~` 正则匹配，使用 RE2 [语法](https://github.com/google/re2/wiki/Syntax)

选择一段时间内所有数据，[Range vector selectors](https://prometheus.io/docs/prometheus/latest/querying/basics/#range-vector-selectors)，比如查询 5 分钟内所有的 HTTP 请求数：

	http_requests_total[5m]

Range vector selectors 返回的数据类型是 Range vector，一般需要和 `rate()` 或 `irate()` 函数一起使用。

```
# 计算的是每秒的平均值，适用于变化很慢的 counter
# per-second average rate of increase, for slow-moving counters
rate(http_requests_total[5m])

# 计算的是每秒瞬时增加速率，适用于变化很快的 counter
# per-second instant rate of increase, for volatile and fast-moving counters
irate(http_requests_total[5m])
```

PromQL 还支持 `count`, `sum`, `min`, `max`, `avg`, `stddev（标准差）`,`topk（前 k 条）`, `quantile（分布统计）`, 等[聚合操作](https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators)，支持 `rate`, `abs`, `ceil`, `floor` 等[内置函数](https://prometheus.io/docs/prometheus/latest/querying/functions/)，更多例子[见官网](https://prometheus.io/docs/prometheus/latest/querying/examples/).


## 和其他监控系统对比


## Prometheus 值得注意的点
上面这么多文字可以看到 Prometheus 是一个很强大的监控系统，同时部署也非常方便，但 Prometheus 也并非 Silver Bullet，它并不能用来解决一切问题。可以注意到的是 Prometheus 非常适合微服务架构，利用服务发现可以轻松的将监控目标扩展到成千成万。

### 数据非 100% 可靠
Prometheus 采集的数据可能有丢失，不适用于对采集数据要求 100% 精确的场景。Prometheus 只针对可用性及性能进行监控，不具备日志监控等功能。

### 存储有限
Prometheus 只认为最近的监控数据有查询需求，Prometheus 在设计之初将数据保存在本地就并非为大量数据存储。如果需要对历史数据进行分析，可以使用 Prometheus 提供的远端存储 OpenTSDB, M3db 等等。

### 无权限系统
Prometheus 没有任何权限管理的功能，它只专注于做好一件事情，那就是监控及告警，Prometheus 认为权限管理应该属于上层管理系统去维护，所以 Prometheus 在设计时没有考虑任何权限管理问题。




## reference

- <https://github.com/prometheus/prometheus/>
- <https://www.ibm.com/developerworks/cn/cloud/library/cl-lo-prometheus-getting-started-and-practice/index.html>
- <https://youtu.be/PDxcEzu62jk>
- <https://www.aneasystone.com/archives/2018/11/prometheus-in-action.html>
- <https://www.infoq.cn/article/275NDkYNZRpcTIL2R8Ms>

[^name]: [Metric and label naming](https://prometheus.io/docs/practices/naming/)

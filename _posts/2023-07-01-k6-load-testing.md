---
layout: post
title: "使用 k6 做一次负载性能测试"
aliases: 
- "使用 k6 做一次负载性能测试"
tagline: ""
description: ""
category: 学习笔记
tags: [ k6, grafana, load-testing, typescript, open-source, go-lang, jmeter, ]
last_updated:
---

负载测试（性能测试，压力测试）是一个较为复杂的任务，包括了测试目标，工具开发，脚本开发，CI 集成，结果分析，性能调优等等部分，可以衡量服务是否是一个高可用，高性能的服务。负载测试能检验在不同的工作负荷下，服务的硬件消耗和响应，从而得到不同负载情况下的性能指标。压力测试能检验软硬件环境下服务所能承受的最大负荷并帮助找出系统瓶颈所在。

## k6 是什么

k6 是用 Go 语言编写的一种高性能的负载测试工具。

- 开源地址： <https://github.com/grafana/k6>

k6 具有下面几个特点

- 可配置的负载生成（Configurable load generation），低配置的机器就可以生成大量流量
- 利用代码进行测试（Tests as code），重用测试脚本，模块化逻辑，版本控制，和 CI 集成
- 功能齐全的 API（A full-featured API），脚本 API 提供多种模拟真实应用程序流量的功能。
  - 强大的 CLI 工具。
- 内嵌的 JavaScript 引擎（An embedded JavaScript engine），提供了 Go 的性能，和 JavaScript 脚本的熟悉度灵活度
  - k6 嵌入了 JavaScript 运行时，可以使用 JavaScript ES2015/ES6 来编写脚本。
- 多种协议的支持（Multiple Protocol support），HTTP，WebSockets 和 gRPC
- 庞大的插件支持生态（Large extension ecosystem），借助 k6 来扩展需求，并且很多人通过社区分享他们的扩展
- 灵活的指标存储和可视化（Flexible metrics storage and visualization），汇总统计数据或粒度指标，导出到您选择的服务。
- 使用 Checks 和 Thresholds 可以更加轻松的做面向目标的自动化的负载测试。

## 为什么选择 k6

性能测试工具有很多

- [[Hey]] [Hey](https://github.com/rakyll/hey) 是一个使用 Golang 实现的 HTTP 压测工具。
- [[Apache Bench]] [Apache Bench](/post/2018/10/ab-apache-bench-tool-load-testing.html) 是一个轻量的 HTTP 压力测试工具。
- [[vegeta]] [vegeta](https://github.com/tsenart/vegeta) 是一个开源的 HTTP 压力测试工具。
- [[Apache JMeter]]，使用 Java 编写的开源的性能测试工具
- [[Tsung]] [Tsung](https://github.com/processone/tsung) 是一个 Erlang 编写的多协议支持的测试工具。
- [[LOCUST]]，[LOCUST](https://locust.io/) Python 编写的性能测试工具，基于代码的方式定义用户行为，支持分布式测试
- [[Gatling]]，Scala 编写，使用异步，非阻塞的方式模拟用户访问，提示实时的结果和报告
- [[Siege]]， [Siege](https://github.com/JoeDog/siege) 是一款使用 C 语言编写的性能测试工具
- [[Artillery]]，[Artillery](https://github.com/artilleryio/artillery) 是一个 JavsScript 编写的，基于云端的压力测试工具。
- [[Drill]]，[drill](https://github.com/fcsonline/drill) 是一个 [[Rust]] 编写的 HTTP 压力测试工具。

![DLFh](https://photo.einverne.info/images/2023/07/10/DLFh.png)

k6 的优势在于 ：

- k6 支持 TypeScript 编写脚本，如果熟悉 TypeScript 学习成本比较低
- 支持 metrics 输出，可以记录到 [[InfluxDB]] 等
- 可以与多种 CI 工具集成，可以于 Grafana 进行集成展示结果数据

#### k6 vs JMeter

虽然 JMeter 在支持的协议数量上要优于 k6，但是 K6 相对于 JMeter 还是有不少的优势的 ：

- 因为 k6 是 Go 编写的，相对于 Java 编写的 JMeter 有性能上的差距，K6 可以只用较少的资源就能达到指定数量的负载。
- 支持阈值
- TypeScript 的脚本可以更好的促进协作和版本管理
- 资源利用率远远强于 JMeter
- 丰富的可视化方案

## Load-testing

测试的类型

- [spike](https://k6.io/docs/test-types/spike-testing/)，尖峰测试，短时间内突然遭受到突发流量
- [stress](https://k6.io/docs/test-types/stress-testing/)，压力测试，将系统置于极限负载下
- [soak tests](https://k6.io/docs/test-types/soak-testing/)，持续性测试，连续时间内进行测试，通常是几小时或几天，这种测试旨在评估系统在长时间运行和持续负载下的稳定性，性能和资源管理能力

## **安装 k6**

Debian/Ubuntu 可以执行如下命令[^1]

[^1]: <https://k6.io/docs/get-started/installation/>

```
sudo apt-get update && sudo apt-get install ca-certificates gnupg2 -y
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

Docker

```
docker pull loadimpact/k6
```

## **HTTP 请求**

新建一个 script.js 文件

Get 请求 `get(url, [params])`

```
import http from 'k6/http';
// 默认控制选项
export let options = {
  vus: 10,         // 指定要同时运行的虚拟用户（VUs）数
  duration: '10s', // 指定测试运行的总持续时间
};
// default 默认函数
export default function() {
  // 标头
  let params = { headers: { 'Content-Type': 'application/json' } };

  var res=http.get("https://test.k6.io",params)
}
```

说明：

- VUs, virtual users, 虚拟用户，更多的虚拟用户意味着更高的并发流量

对于 options 也可以通过设置可变的形式来设置不同阶段

```
export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 10 },
    { duration: '20s', target: 0 },
  ],
};
```

Post 请求 `Post( url, [body],[params])`

```
import http from 'k6/http';
export let options = {
  vus: 100,
  duration: '10s',
};
// default 默认函数
export default function() {
  let json = { content: 'linhui', image: 'images' };
  let params = { headers: { 'Content-Type': 'application/json' } };
  var res = http.post("https://host/api/feedback", JSON.stringify(json), params)
  console.log(res.status);
}
```

del 请求 `del(url,[body],[params])`

```
import http from 'k6/http';
export let options = {
  vus: 1,
  duration: '10s',
};
// default 默认函数
export default function () {
  let json = {id:1};
  let params = { headers: { 'Content-Type': 'application/json' } };
  http.del('https://host/delete', json, params);
}
```

batch 批处理，可以用来做页面并发，批处理并不能保证执行顺序，`batch(method,url,[body],[params]) `

```
import http from 'k6/http';
export let options = {
  vus: 1,
  duration: '10s',
};
export default function () {
  let get = {
    method: 'GET',
    url: 'https://host/get',
  };
  let get1 = {
    method: 'GET',
    url: 'https://host/get',
  };
  let post = {
    method: 'POST',
    url: 'https://host/post',
    body: {
      hello: 'world!',
    },
    params: {
      headers: { 'Content-Type': 'application/json' },
    },
  };
  let res = http.batch([req1, req2, req3]);
}
```

使用 request 发送求 `request(method, url, [body], [params])`

```
import http from 'k6/http';
export let options = {
  vus: 1,
  duration: '10s',
};
export default function () {
  let json = { content: 'linhui', image: 'images' };
  let params = { headers: { 'Content-Type': 'application/json' } };
  let res = http.request('POST', 'http://host/post', JSON.stringify(json), params);
  let res1 = http.request('GET', 'http://host/get', null, params);
}
```

执行脚本，进入脚本根目录

```
k6 run test.js
# 使用 docker
docker run -i loadimpact/k6 run - <test.js
```

## **常见指标说明**

指标类型

<table><tbody><tr><td>名称</td><td>描述</td></tr><tr><td>Counter</td><td>计数器，对值进行累加</td></tr><tr><td>Gauge</td><td>最小值、最大值和最后一个值。</td></tr><tr><td>Rate</td><td>百分比</td></tr><tr><td>Trend</td><td>最小值、最大值、平均值和百分位数的统计数据指标</td></tr></tbody></table>

k6 一直都会收集的指标

<table><tbody><tr><td>名称</td><td>类型</td><td>描述</td></tr><tr><td>vue</td><td>Gauge</td><td>当前活动的虚拟用户数</td></tr><tr><td>vue_max</td><td>Gauge</td><td>虚拟用户的最大数量</td></tr><tr><td>iterations</td><td>Counter</td><td>脚本中的函数被执行的次数</td></tr><tr><td>data_received</td><td>Counter</td><td>接收到的数据量大小</td></tr><tr><td>data_sent</td><td>Counter</td><td>发送的数据量大小</td></tr><tr><td>iteration_duration</td><td>Trend</td><td>完成默认/主函数的一次完整迭代所花费的时间。</td></tr><tr><td>checks</td><td>Rate</td><td>checks 项的成功率</td></tr></tbody></table>

HTTP 协议特有的指标

<table><tbody><tr><td>名称</td><td>类型</td><td>描述</td></tr><tr><td>http_reqs</td><td>Counter</td><td>总请求数量</td></tr><tr><td>http_req_blocked</td><td>Trend</td><td>在发起请求之前被阻塞的时间</td></tr><tr><td>http_req_connecting</td><td>Trend</td><td>建立到远程主机的TCP连接所花费的时间。</td></tr><tr><td>http_req_tls_handshaking</td><td>Trend</td><td>与远程主机握手建立TLS会话所花费的时间</td></tr><tr><td>http_req_sending</td><td>Trend</td><td>将数据发送到远程主机所花费的时间</td></tr><tr><td>http_req_waiting</td><td>Trend</td><td>等待远程主机响应所花费的时间</td></tr><tr><td>http_req_receiving</td><td>Trend</td><td>从远程主机接收响应数据所花费的时间</td></tr><tr><td>http_req_duration</td><td>Trend</td><td>请求的总时间。它等于http_req_sending + http_req_waiting + http_req_receiving（即，远程服务器处理请求和响应花了多长时间，而没有初始DNS查找/连接时间）</td></tr><tr><td>http_req_failed</td><td>Rate</td><td>失败请求率</td></tr></tbody></table>

每一个 http 都会返回一个 HTTP Response 对象，下面是常用的一些属性。

<table><tbody><tr><td>属性</td><td>类型</td></tr><tr><td>Response.body</td><td>HTTP 响应正文</td></tr><tr><td>Response.cookies</td><td>响应 cookies ,属性是 cookie 名称，值是 cookie 对象数组</td></tr><tr><td>Response.error</td><td>发送请求失败后的错误信息。</td></tr><tr><td>Response.error_code</td><td>错误码</td></tr><tr><td>Response.headers</td><td>标头，键值对</td></tr><tr><td>Response.status</td><td>从服务器收到的 HTTP 响应代码</td></tr><tr><td>Response.timings</td><td>耗时（以毫秒为单位）</td></tr><tr><td>Response.timings.blocked</td><td>= http_req_blocked</td></tr><tr><td>Response.timings.connecting</td><td>= http_req_connecting</td></tr><tr><td>Response.timings.tls_handshaking</td><td>= http_req_tls_handshaking</td></tr><tr><td>Response.timings.sending</td><td>= http_req_sending</td></tr><tr><td>Response.timings.waiting</td><td>= http_req_waiting</td></tr><tr><td>Response.timings.receiving</td><td>= http_req_receiving</td></tr><tr><td>Response.timings.duration</td><td>= http_req_duration</td></tr></tbody></table>

自定义指标

```
import http from 'k6/http';
import { Trend } from 'k6/metrics';
export let options = {
  vus: 100,
  duration: '10s',
};
// 新建一个类型为 Trend 名为 sending_time 的自定制指标
let sendingTime = new Trend('sending_time');

export default function () {
  let res = http.get('http://www.baidu.com');
  sendingTime.add(res.timings.sending);
}

```

设置了 `sending_time` 这个自定义指标之后在 k6 运行的结果中就能看到新定义的指标。

## **常用 Option 选项**

VUs：指定同时运行的虚拟用户数量，必须是一个整数，和 duration 搭配使用。默认值：1

```
export let options = {
  vus: 10,
  duration: '10s',
};
```

或者在执行命令时指定：

```
k6 run -u 10 test.js
k6 run --vus 10 test.js
```

Duration：字符串，指定测试运行的总持续时间，与 vus 选项一起使用。默认值：null

```
export let options = {
  vus: 10,
  duration: '10s',
};
```

执行命令时指定：

```
k6 run -u 10 --d 20s  test.js
k6 run --vus 10 --duration 20s  test.js
```

User Agent：发送 HTTP 请求时指定 User-Agent 标头。默认值：k6/0.27.0 ([https://k6.io/](https://k6.io/)) 取决于你 k6 的版本

```
export let options = {
  userAgent: 'Mozilla/5.0',
};
```

```
k6 run  --user-agent 'Mozilla/5.0'  test.js
```

TLS Version：表示允许在与服务器交互中使用的唯一 SSL/TLS 版本的字符串，或者一个指定允许使用的“最小”和“最大”版本的对象。 默认值：null (允许所有版本)

```
export let options = {
  tlsVersion: 'tls1.2',
};

export let options = {
  tlsVersion: {
    min: 'ssl3.0',
    max: 'tls1.2',
  },
};
```

TLS Cipher Suites：允许在与服务器的 SSL/TLS 交互中使用的密码套件列表。由于底层 go 实现的限制，不支持更改 TLS 1.3 的密码，并且不会执行任何操作。 默认值：null（允许所有）

```
export let options = {
  tlsCipherSuites: [
    'TLS_RSA_WITH_RC4_128_SHA',
    'TLS_RSA_WITH_AES_128_GCM_SHA256',
  ],
};
```

TLS Auth: tls 身份验证。默认值：null

```
export let options = {
  tlsAuth: [
    {
      domains: ['example.com'],
      cert: open('mycert.pem'),
      key: open('mycert-key.pem'),
    },
  ],
};
```

Throw：一个布尔值，true or false ，指定是否在失败的 HTTP 请求上抛出异常。 默认值：false

```
export let options = {
  throw: true,
};
```

```
k6 run  --throw test.js
k6 run  -w test.js
```

Thresholds：一组阈值规范，用于根据指标数据配置在何种条件下测试成功与否，测试通过或失败。默认值：null

```
export let options = {
  thresholds: {
    http_req_duration: ['avg<100', 'p(95)<200'],
    'http_req_connecting{cdnAsset:true}': ['p(95)<100'],
  },
};
```

Tags：指定应在所有指标中设置为测试范围的标签。如果在请求、检查或自定义指标上指定了同名标签，它将优先于测试范围的标签。 默认值：null

```
export let options = {
  tags: {
    name: 'value',
  },
};
```

```
k6 run --tag NAME=VALUE test.js
```

RPS：指的是每秒发出的最大请求数。 默认值：0

```
export let options = {
  rps: 500,
};
```

或者：

```
k6 run --rps 500  test.js
```

Paused：是否可以暂停和和恢复的方式运行脚本，暂停启动后需要使用另外的窗口执行`k6 resume` 恢复使用。在恢复窗口可以实时的查看脚本的运行情况。 启动后不支持暂停， 默认值：false

```
export let options = {
  paused: true,
};
```

```
k6 run --paused  test.js
k6 run --p test.js
```

No VU Connection Reuse：布尔值，是否复用 TCP 链接。默认值：false

```
export let options = {
  noVUConnectionReuse: true,
};
```

```
run --no-vu-connection-reuse  test.js
```

No Usage Report：布尔值，是否给 k6 发送使用报告，true 值不会发使用报告。 默认值：false

```
k6 run --no-usage-report test.js
```

No Thresholds：布尔值，是否禁用阈值。默认是：fasle

```
k6 run --no-thresholds test.js
```

No Summary：是否禁用测试结束生成的概要。默认值：false

```
k6 run --no-summary test.js
```

No Cookies Reset：是否重置 Cookies，fasle 每次迭代都会重置 Cookie ，true 会在迭代中持久化 Cookie 。默认值：false

```
export let options = {
  noCookiesReset: true,
};
```

No Connection Reuse：是否禁用保持活动连接，默认值：false

```
export let options = {
  noConnectionReuse: true,
};
```

```
k6 run --no-connection-reuse test.js
```

Minimum Iteration Duration：指定默认函数每次执行的最短持续时间，任何小于此值的迭代都将剩余时间内休眠，直到达到指定的最小持续时间。默认值：0

```
export let options = {
  minIterationDuration: '10s',
};
```

```
k6 run --min-iteration-duration '1s' test.js
```

Max Redirects：最大重定向，默认值：10

```
export let options = {
  maxRedirects: 10,
};
```

```
k6 run -max-redirects 10 test.js
```

Batch： batch 同时调用的最大连接总数，如果同时有 20 api 请求需要发出 ，batch 值是 15，那么将会立即发出 15 个请求，其余的请求会进行一个排队。默认值：20

```
export let options = {
  batch: 15,
};

```

```
k6 run --batch 10 test.js
```

Batch per host：batch 对同一个主机名同时进行的最大并行连接数。默认值：6

```
export let options = {
  batchPerHost: 5,
};
```

```
k6 run --batch-per-host 10 test.js
```

Blacklist IPs：黑名单。默认值：null

```
export let options = {
  blacklistIPs: ['10.0.0.0/8'],
};
```

```
k6 run --blacklist-ip= ['10.0.0.0/8'] test.js
```

Block Hostnames：基于模式匹配字符串来阻止主机，如 \*.example.com , 默认值：null

```
export let options = {
  blockHostnames: ["test.k6.io" , "*.example.com"],
};
```

```
k6 run --block-hostnames="test.K6.io,*.example.com" test.js
```

Discard Response Bodies：是否应丢弃响应正文，将 responseType 的默认值修改成 none，建议设置成 true，可以减少内存暂用和 GC 使用，有效的较少测试机的负载。默认值：false

```
export let options = {
  discardResponseBodies: true,
};
```

HTTP Debug：记录所有 HTTP 请求和响应。默认情况下排除正文，包括正文使用 --http debug=full 默认值：false

```
export let options = {
  httpDebug: 'full',
};
```

```
k6 run --http-debug test.js
```

## **Checks 检查**

Checks 类似断言，不同在于 Checks 不会停止当前的脚本。指标都可以作为检查的项目。

```
import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';

export let options = {
  vus: 100,
  duration: '10s',
};
export default function () {
  let res = http.get('http://test.k6.io/');
  check(res, {
    '状态码为200': (r) => r.status === 200,
    '响应时间小于200ms': (r) => r.timings.duration < 200,
    '等待远程主机响应时间小于200ms': (r) => r.timings.waiting < 200,
  });
}
```

## **Thresholds 阈值**

阈值是用来指定被测系统的性能预期的通过/失败标准。阈值用来分析性能指标并确定最终测试结果。内置的指标都可以作为阈值。

k6 中包含的四种度量类型每一种都提供了自己的一组可用于阈值表达式的聚合方法。

- Counter： count and rate
- Gauge：value
- Rate：rate
- Trend：p(N)

```
import http from 'k6/http';
import { Trend, Rate, Counter, Gauge } from 'k6/metrics';
export let GaugeContentSize = new Gauge('ContentSize');
export let TrendRTT = new Trend('RTT');
export let options = {
  vus: 10,
  duration: '10s',
  thresholds: {
    // 发出的请求数量需要大于1000
    http_reqs:['count>1000'],
    // 错误率应该效率 0.01%
    http_req_failed: ['rate<0.01'],
    // 返回的内容必须小于 4000 字节。
    ContentSize: ['value<4000'],
    // p(N) 其中 N 是一个介于 0.0 和 100.0 之间的数字，表示要查看的百分位值，例如p(99.99) 表示第 99.99 个百分位数。这些值的单位是毫秒。
    // 90% 的请求必须在 400 毫秒内完成，95% 必须在 800 毫秒内完成，99.9% 必须在 2 秒内完成
    http_req_duration: ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'],
    // 99% 响应时间必须低于 300 毫秒，70% 响应时间必须低于 250 毫秒，
    // 平均响应时间必须低于 200 毫秒，中位响应时间必须低于 150 毫秒,最小响应时间必须低于 100 毫秒
    RTT: ['p(99)<300', 'p(70)<250', 'avg<200', 'med<150', 'min<100'],
  },
};

export default function () {

  let res = http.get('http://www.baidu.com');
  TrendRTT.add(res.timings.duration);
  GaugeContentSize.add(res.body.length);
}
```

阈值标签，测试中可以给指定的 url 或者特定标签上使用阈值。

```
import http from 'k6/http';
import { sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let options = {
  vus: 10,
  duration: '10s',
  thresholds: {
    // type 为 baidu 使用
    'http_req_duration{type:baidu}': ['p(95)<500'],
    // type 为 bing 使用
    'http_req_duration{type:bing}': ['p(95)<200'],
  },
};

export default function () {
  let res1 = http.get('https://www.baidu.com', {
    tags: { type: 'baidu' },
  });
  let res2 = http.get('https://cn.bing.com/', {
    tags: { type: 'bing' },
  });

  let res3 = http.batch([
    [
      'GET',
      'https://www.baidu,com',
      null,
      { tags: { type: 'baidu' } },
    ],
    [
      'GET',
      'https://cn.bing.com/',
      null,
      { tags: { type: 'bing' } },
    ],
  ]);

}
```

默认情况下没有达标阈值标准是不会停止脚本的，通过设置阈值的 `abortOnFail: true` 来终止。

```
import http from 'k6/http';
export let options = {
  vus: 10,
  duration: '10s',
  thresholds: {
    http_req_duration: [{threshold: 'p(99) < 10', abortOnFail: true}],
  },
};

export default function () {
  let res = http.get('http://www.baidu.com');
}

```

对通过的阈值前面会有一个 ✓，而失败的则会有一个 ✗ 。只有满足所有阈值的情况下测试才算通过。

## **日志输出**

输出到控制台。

```
import http from 'k6/http';
export let options = {
  vus: 10,
  duration: '2s',
};

export default function () {
  let res = http.get('http://www.baidu.com');
   console.log('log')
   console.info('info');
   console.error('err');
   console.debug('debug')
   console.warn('warn')
}
```

输出到文件，输出到文件的同时控制台不在输出。

```
k6 run  test.js --console-output=test.log
```

## InfluxDB Grafana 可视化测试结果

Docker 启动 [[InfluxDB]]

```
docker pull tutum/influxdb
# 8083是 influxdb 的 web 管理工具端口，8086 是 influxdb 的 HTTP API 端口
docker run -d -p 8083:8083 -p8086:8086 --expose 8090 --expose 8099 --name influxsrv tutum/influxdb
```

Docker 启动 Grafana,

```
docker pull grafana/grafana
docker run -d -p 3000:3000 grafana/grafana
```

新建一个 k6test 数据库，访问 "[http://xxxxx:8083](http://xxxxx:8083/)" InfluxDB web 管理页面，新建一个 K6test 数据库

![DaYC](https://photo.einverne.info/images/2023/07/10/DaYC.png)

配置 Grafana 数据源

![DiNH](https://photo.einverne.info/images/2023/07/10/DiNH.png)

选择 InfluxDB， 填写域名端口和数据库，点击 sava&test 。出现 Data source is working 表示成功，如遇到问题查看一下端口是否放行。

导入仪表盘

![DCTD](https://photo.einverne.info/images/2023/07/10/DCTD.png)

通过 ID 导入，输入 2587 点击 load 数据源选择 InfluxDB 点击 Import

官方还有几款仪表盘

- [Stian Øvrevåge](https://grafana.com/grafana/dashboards/4411)
- [cyaiox](https://grafana.com/grafana/dashboards/8156)
- [smockvavelsky](https://grafana.com/grafana/dashboards/10553)
- [KM](https://grafana.com/grafana/dashboards/10660)

将 k6 的测试指标导入到 InfluxDB

```
k6 run --out influxdb=http://xxxxx:8086/K6test test.js
```

效果图

![DEgL](https://photo.einverne.info/images/2023/07/10/DEgL.png)

## **总结**

k6 是一个非常强大的性能测试工具，只需要稍微了解一下 TypeScript，熟悉一下调用过程，就可以很快上手使用。

## reference

- [JMeter vs k6](https://azevedorafaela.com/2020/07/06/load-tests-jmeter-vs-K6/)

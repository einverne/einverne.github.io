---
layout: post
title: ".info 域名涨价应对策略"
aliases:
- ".info 域名涨价应对策略"
tagline: ""
description: ""
category: 经验总结
tags: [ domain, dns, google-domains ]
create_time: 2022-10-09 22:00:01
last_updated: 2022-10-09 22:00:01
---

之前收到 Google Domains 邮件，info 域名将在 10 月 26 号之后从 12 美元一年涨价到 22 美元一年，现在剩下的时间不多了，晚上回家处理一下。

<blockquote class="twitter-tweet"><p lang="zh" dir="ltr">刚收到 Google domain 的续费通知邮件，竟然发现 info 域名需要从 $12 涨价到 $22 ，域名注册局的生意一本万利啊！</p>&mdash; Ein Verne (@einverne) <a href="https://twitter.com/einverne/status/1574667573479624705?ref_src=twsrc%5Etfw">September 27,2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## 涨价原因

通常不同的域名注册商都会提供动态的注册费用，比如我一直使用的 Google Domains 自我开始使用起 info 域名就是 12 美元一年，很多年没有变化过，但是有一些其他的域名注册提供商会提供更加低廉的第一次注册费用，但是往往续费和转入的费用要更高。

一个域名的费用可以分成好几部分。

域名注册费用组成：[^4]

[^4]: <https://news.gandi.net/en/2020/09/how-much-does-a-domain-cost-and-what-comes-with-it/>

- ICANN 费用（不是所有的域名都有此费用）
- Registry 费用，Registry 是维护一个顶级域名的公司，比如 `.com`，`.net`，`.org` 等背后的公司。这些公司都从 ICANN 买断了对 TLD（顶级域名）的管理权，所以有权利决定以什么价格售卖域名。
    - 对于 Registry 他需要出售足够多的域名才能够盈利
    - Registry 也需要维护一个顶级域名的价值，比如不让某些人利用一些域名来发垃圾信息
    - 也需要维护一个顶级的 Name server 来提供该顶级域名的域名解析服务，不至于出现之前遇到过得 [全球 club 域名宕机事件](/post/2021/10/club-domain-down-accident.html)
- Premium domains，这是一些注册局觉得非常有价值的域名
- 其他费用，注册商可能对隐私保护，域名解析，转发，域名邮箱或注册商提供的其他增值服务收费

Verisign 是 .com 的域名注册局，在 2018 年的时候与美国商务部达成协议，允许他在之后的十年中每年将价格提高 7%。[^1] 同样的各大域名注册商也相继提高了 .info, .mobi, .pro 等等域名的注册费用。[^2][^3]

[^1]: <https://www.domainnameapi.com/blog/verisign-has-decided-to-increase-the-price-of-the-com>
[^2]: <https://news.gandi.net/en/2021/12/price-increase-on-info-mobi-and-pro-domains-on-january-14-2022/>
[^3]: <https://www.techrepublic.com/article/youre-going-to-pay-more-for-org-and-info-domains-following-icanns-lifting-of-price-caps/>

## 解决方案

首先到 <https://tld-list.com/> 网站上查询 `.info` 域名，然后发现对于 Transfer 来说 Google 提供的价格就是最便宜的。

![info domain price](https://photo.einverne.info/images/2022/10/09/R6JQ.png)

综合来说，还是在 Google Domains 先续费 9 年再说吧。

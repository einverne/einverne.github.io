---
layout: post
title: "Flexget 配合 NexusPHP 自动下载"
aliases: 
- "Flexget 配合 NexusPHP 自动下载"
tagline: ""
description: ""
category: 经验总结
tags: [ pt, torrent, bittorrent, nexusphp, flexget, rss ]
last_updated:
---

之前整理过一篇文章总结了 [Flexget](/post/2020/02/flexget.html) 的一些常用方法，长久以来都是在 avistaz.to 生成 RSS，订阅下载，但后来发现国内的大多数站点都是使用 NexusPHP 运行，并且 RSS 支持（过滤条件）也不是非常完善，于是就发现了 flexget-nexusphp 这个插件。

[flexget-nexusphp](https://github.com/Juszoe/flexget-nexusphp) 是一个 [Flexget](/post/2020/02/flexget.html) 的插件，可以用来过滤 NexusPHP 的内容。


## 安装插件
Flexget 安装插件的方法非常简单，从 [GitHub](https://github.com/Juszoe/flexget-nexusphp) 获取 `nexusphp.py` 代码。将该文件移动到 Flexget 配置目录。

如果是和我一样使用 Docker 启动的 Flexget，在我[上一篇](/post/2020/02/flexget.html) 的配置中，我将 Flexget 的配置文件挂载到了本地目录，所以只要找到 `~/flexget/config` 然后在该文件夹下创建 `plugins` 目录，并放入 `nexusphp.py` 即可。

注意 plugins 目录需要和 `config.yml` 这个 YAML 配置文件在同级。

然后重启 Flexget 容器。


## 配置
完成插件的安装之后就可以在配置文件中使用 nexusphp 选项。

```
tasks:
  hdchina:
    rss:
      url: http://hdchina.org/rss.xml
      other_fields: [link]
    download: /data
    nexusphp:
      cookie: "hdchina=;_GRECAPTCHA=;PHPSESSID="
      left-time: 1 hours
      discount:
        - free
        - 2xfree
```


全部的配置选项：

```
nexusphp:
  cookie: 'a=xxx; b=xxx'  # 必填
  discount:  # 优惠信息 选填
    - free
    - 2x
    - 2x50%
    - 2xfree
    - 50%
    - 30%
  seeders:  # 做种情况 选填（兼容性较差不建议使用）
    min: 1
    max: 2
  leechers:  # 下载情况 选填（兼容性较差不建议使用）
    min: 10
    max: 100
    max_complete: 0.8
  left-time: 1 hours  # 优惠剩余时间 选填
  hr: no  # 是否下载HR 选填
  adapter:  # 站点适配器，自行适配站点，参考最下方常见问题 选填
    free: free
    2x: twoup
    2xfree: twoupfree
    30%: thirtypercent
    50%: halfdown
    2x50%: twouphalfdown
  comment: no  # 在torrent注释中添加详情链接 选填
  user-agent: xxxxxx  # 浏览器标识 选填
  remember: yes  # 记住优惠信息 选填 请勿随意设置
```

配置解释：

- `cookie` **网站cookie** 必须填写
- `discount` **优惠类型** 默认不限制优惠类型。  
  列表类型，Flexget会只下载含有列表内优惠类型的种子。  
  有效值：`free 2x 2x50% 2xfree 50% 30%`  
  `注意：x为英文字母`
- `seeders` **做种情况** 做种人数超出范围的，Flexget将不会下载
  - `注意：此选项兼容性较差`
  - `min` 最小做种人数。整数，默认不限制
  - `max` 最大做种人数。整数，默认不限制
- `leechers` **下载情况** 下载人数超出范围的，Flexget将不会下载
  - `注意：此选项兼容性较差`
  - `min` 最小下载人数。整数，默认不限制
  - `max` 最大下载人数。整数，默认不限制
- `max_complete` **下载者中最大完成度** 超过这个值将不下载。 小数，范围`0-1.0`，默认为1
- `left-time` **最小剩余时间** 当实际剩余时间小于设置的值，则不下载。 时间字符串，例如 `3 hours`、`10 minutes`、`1 days`。 例如设置`1 hours`，优惠剩余59分钟，那么就不下载。默认不限制
- `hr` **是否下载HR种** 默认 yes  
  1. `yes` 会下载HR，即不过滤HR  
  2. `no` 不下载HR  
      
- `adapter` **站点适配器** 站点不兼容时可自定义，具体参考 [判断站点以及适配站点](https://github.com/Juszoe/flexget-nexusphp/blob/master/site.md)
- `comment` **在torrent注释中添加详情链接**  
  1. `yes` 在torrent注释中添加详情链接，方便在BT客户端查看  
  2. `no` 默认值  
      
- `user-agent` **浏览器标识** 默认为Google浏览器
- `remember` **记住优惠信息** 不建议设置为 no，因为会增大站点压力。默认 yes


最后，个人也搭建了一个[私人的 PT](https://pt.gtk.pw)，分享一些电影、图书、综艺，欢迎来玩。
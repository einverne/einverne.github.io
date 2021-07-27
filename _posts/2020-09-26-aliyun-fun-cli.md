---
layout: post
title: "阿里云函数计算 fun cli"
tagline: ""
description: ""
category: 经验总结
tags: [aliyun, fun, cli]
last_updated:
---


大部分的资料来自于 [GitHub](https://github.com/alibaba/funcraft) 页面。

## 安装
安装 npm，并执行：

```
npm install @alicloud/fun -g
```

## 配置

两种方式对 fun 进行配置，

### .env 配置文件
在项目 `template.yml` 文件所在目录，新建 `.env` 文件，并配置：

```
ACCOUNT_ID=xxxxxxxx
REGION=cn-shanghai
ACCESS_KEY_ID=xxxxxxxxxxxx
ACCESS_KEY_SECRET=xxxxxxxxxx
FC_ENDPOINT=https://{accountid}.{region}.fc.aliyuncs.com
TIMEOUT=10
RETRIES=3
```


### fun config 命令

执行 `fun config` 进行 Account ID、AccessKey ID、AccessKey Secret、Default Region Name 配置，完成配置操作后，Funcraft会将配置保存到您目录下的.fcli/config.yaml文件中。



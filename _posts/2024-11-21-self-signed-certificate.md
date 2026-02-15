---
layout: post
title: "自签名证书生成及使用"
aliases:
- "自签名证书生成及使用"
tagline: ""
description: ""
category: 经验总结
tags: [ certificate, digicert, openssl, ca, root-ca, pfx, pem]
create_time: 2024-11-22 13:16:58
last_updated: 2024-11-22 13:16:58
dg-home: false
dg-publish: false
---

之前公司使用的证书是 [[Digicert]] 发行的，但是在开发环境和测试环境不想使用 Digicert 发行的证书，证书发行太贵，所以想着自行签名一个证书，本地测试使用。所以本文主要是介绍

- 生成根证书生成
- 中间证书（Intermediate CA）生成
- 自签名证书
- 以及生成 PFX 格式

## 生成根 CA 证书

可以使用 OpenSSL 命令来生成根 CA 私钥和签名证书

生成根私钥文件

```
openssl genrsa -out rootCA.key 2048
```

生成根证书

```
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 3650 -out rootCA.crt -subj "/C=CN/ST=YourState/L=YourCity/O=YourOrganization/OU=YourUnit/CN=RootCA"
```

执行命令的过程中需要输入一些信息，包括国家，城市，地区，组织名称等。

## 生成中间证书

创建中间 CA 私钥和证书请求文件（CSR）

```
openssl genpkey -algorithm RSA -out intermediate.key
openssl req -new -key intermediate.key -out intermediate.csr
```

使用根 CA 签署中间 CA 证书

```
openssl x509 -req -in intermediate.csr -CA root.crt -CAkey root.key -CAcreateserial -out intermediate.crt -days 3650
```

## 生成自签名证书

创建服务器私钥和证书请求文件

```
openssl genpkey -algorithm RSA -out server.key
openssl req -new -key server.key -out server.csr
```

使用中间 CA 来签署服务器证书请求

```
openssl x509 -req -in server.csr -CA intermediate.crt -CAkey intermediate.key -CAcreateserial -out server.crt -days 3650
```

## 生成 PFX

使用 OpenSSL 将服务器的私钥、服务器证书、中间 CA 证书及根 CA 证书合并为一个 PFX 文件。

```
openssl pkcs12 -export -out server.pfx -inkey server.key -in server.crt -certfile intermediate.crt -certfile root.crt
```

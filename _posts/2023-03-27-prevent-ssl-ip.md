---
layout: post
title: "防止 SSL 证书泄露网站 IP"
aliases:
- "防止 SSL 证书泄露网站 IP"
tagline: ""
description: ""
category: 经验总结
tags: [ ssl, linux, ip, cdn ]
create_time: 2023-04-24 15:29:49
last_updated: 2023-04-24 15:29:49
---

有些网站虽然已经使用 [[Cloudflare]] 等等服务做前置 CDN，隐藏了服务器 IP 地址，但是依然会被 [censys.io](https://search.censys.io/) 扫描出 IP 来。

## 原因

在使用 Nginx 作为 Web 服务器的事后，如果网站开启了 SSL，直接访问 IP 加 443 端口，Nginx 的设计上会有一个小小的特性「BUG？」，Nginx 会正常返回，并携带一个包含域名信息的证书。于是通过这个 BUG 就使得 IP 和 域名产生了对应关系。如果全网扫描 IP 地址，就能查询到一张 IP -> 域名的映射表。

对 IP 的 443 端口发送 clienthello，回复的 serverhello 中有一个 SSL 证书，证书中 common name 包含域名信息。

这就是为什么已经使用了 CDN，但依然会被打到源站 IP 的原因。

## 解决方法

### 使用虚假证书

创建一个使用 `ip` 的网站并配置以下 SSL 信息（空 SSL）即可避免泄露。

密钥（KEY）

```
-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDXyF6m81zOeoOPvfk6nGKtyfczRG6/yeSkcc+66vGvq0s8oB7V
cCzLl1YcNsru3ixelPR2z1zvjKqa9/Aqh8+TvP1kGGbLD/mynjnj8l+0vVzZ+vnz
AH0RN9fpqzlpHmFBHQzQ25AtIAH8pXOL1541YN0TNPRA3kHUCL0FH8CkwwIDAQAB
AoGAQ4ejh6AV5VCWJ8AOZXdXsofIYzUBa+glNAmiNx8b8BwteZWq0KVAf56nBkFn
lQXW4OrA7wXKUfW11rXNZaIHJePJXv1swkN9+Em18Hon6BrtcqnKAwzAbhok3SzY
IVjI/zrgOABH6+ii77xCRBzI1itVPNN88DAUHC7PYLYiaaECQQD7PSoij37+kMc/
wPeEkl9r3vzU0OrsCsjU8Ev714OaoL/SIuAh6nsiRh9rcbUrrpGSSzIcmsk9HMDa
hXBNkNl5AkEA298yQvssaUc4tbEWxAVfd9DsHJdCdbXfgf9Dy5/tpCzYncY7T0du
VVHqKu3jXWoMc5XlesiCOerU/DIlMM8dGwJBANQn7GLO5iC1xWvS2bF7oVSIMtzL
pvW4jaszWBbNAPccc59RkA9T4LMqn/GtTZ4bhhYRpbl+BB21IC3nrNPzU5ECQG8T
Ln0QDruQs2F2eR3F6RjKfr1i3LxCiQtPPZycypzp2vS5tDS0zVRk8XuGehoy/N9X
lnqU2NURgU92tbsWpokCQQDdc9tU3B/OM/YfzUNwvOLmUVwrJX6PFSFsOn+XHrCC
q9LcGEAHyzaf5GEWje84ee4rkv5oaZcwll3dg4IioBnC
-----END RSA PRIVATE KEY-----
```

证书（PEM 格式）

```
-----BEGIN CERTIFICATE-----
MIIBkjCB/AIJAI3bCYqa39hiMA0GCSqGSIb3DQEBBQUAMA0xCzAJBgNVBAYTAiAg
MCAXDTE4MTEyNDA5MDMzOFoYDzIwOTkxMjMxMDkwMzM4WjANMQswCQYDVQQGEwIg
IDCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA18hepvNcznqDj735Opxircn3
M0Ruv8nkpHHPuurxr6tLPKAe1XAsy5dWHDbK7t4sXpT0ds9c74yqmvfwKofPk7z9
ZBhmyw/5sp454/JftL1c2fr58wB9ETfX6as5aR5hQR0M0NuQLSAB/KVzi9eeNWDd
EzT0QN5B1Ai9BR/ApMMCAwEAATANBgkqhkiG9w0BAQUFAAOBgQBiqHZsuVP09ubT
GzBSlAFEoqbM63sU51nwQpzkVObgGm9v9nnxS8Atid4be0THsz8nVjWcDym3Tydp
lznrhoSrHyqAAlK3/WSMwyuPnDCNM5g1RdsV40TjZXk9/md8xWxGJ6n1MoBdlK8T
H6h2ROkf59bb096TttB8lxXiT0uiDQ==
-----END CERTIFICATE-----
```

## 配置 Nginx 仅允许 CDN IP 访问

在 Nginx 上配置仅允许 CDN 的 IP 访问。比如 [Cloudflare IPs](https://www.cloudflare.com/ips/)

```
location / {
    allow 103.21.244.0/22;
}
```

## related

- [[censys]]
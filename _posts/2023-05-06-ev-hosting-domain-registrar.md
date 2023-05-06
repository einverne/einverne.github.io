---
layout: post
title: "EV Hosting 域名注册服务"
aliases:
- "EV Hosting 域名注册服务"
tagline: ""
description: ""
category: 经验总结
tags: [ev-hosting, domain, domain-registry, nameserver, dns,]
create_time: 2023-05-06 14:08:10
last_updated: 2023-05-06 14:08:10
---

[EV Hosting](https://client.einverne.info) 上线了[域名注册服务](https://client.einverne.info/order.php?step=1&productGroup=13)，现在可以在 EV Hosting 选购超过 20 种的域名后缀，包括了常见的 .com, .org, .me, .info 等，还上线了 .fun, .life, .studio, .store 等等新的顶级域名。域名的价格在不同时期会略有不同。

在目前阶段，.fun, .pw, .life, .shop, pics, .studio, 等等域名只需要 20~30 元不等就可以购买一年。但是域名的续费一般会比较贵，可以酌情考虑不同的域名后缀。EV Hosting 也会在不同时间提供最优惠的域名注册服务。

## 注册域名

请注意购买域名之前，保证自己的注册邮箱是能够接收邮件的，在注册完成之后会受到一封验证邮件，域名注册局在第一次购买时需要验证该邮箱的使用。

![qLFR](https://photo.einverne.info/images/2023/05/06/qLFR.png)

在下一个页面中进行支付。

![qaYI](https://photo.einverne.info/images/2023/05/06/qaYI.png)

完成付款之后在「我的域名」中就能看到购买的域名。

## 在 EV Hosting 后台进行 DNS 记录管理

在 EV Hosting 中，点开对应的域名，可以在侧边栏中修改 NS 名称服务器（Name Server）。

本站提供的四个名称服务器可以在[这里](https://client.einverne.info/index.php?fuse=knowledgebase&controller=articles&view=article&articleId=23) 查看（仅注册用户可见）。

![qiN4](https://photo.einverne.info/images/2023/05/06/qiN4.png)

## 将域名添加到 Cloudflare 管理

更推荐将域名添加到 Cloudflare 后台进行管理，访问 [Cloudflare](https://dash.cloudflare.com/) 后台，然后将域名添加到 Cloudflare。使用 Cloudflare 可以免费享受其提供的 CDN，还能隐藏背后服务器的 IP 地址。现在就介绍一下如何将 EV Hosting 购买的域名添加到 Cloudflare 。

首先要有一个 Cloudflare 的账号，进入账号之后，点击 「Add a site」，然后输入自己购买的域名。

![qCTW](https://photo.einverne.info/images/2023/05/06/qCTW.png)

然后再下一步中选择 Free，使用免费套餐。然后 Cloudflare 会自动对域名进行扫描，自动找到域名的 DNS 记录，点击导入。然后 Cloudflare 会给出两个 Name server 的地址，将这两个服务器配置到 EV Hosting 域名管理后台的名称服务器中。

![qEZQ](https://photo.einverne.info/images/2023/05/06/qEZQ.png)

完成配置之后，等待一段时间 NameServer 生效，点击页面中的 「Done，check nameservers」。Cloudflare 会自动检查 DNS 是否生效，如果检查通过，会发一封邮件到 Cloudflare 的邮箱中。

添加到 Cloudflare 之后就可以使用 Cloudflare 的 DNS 管理，添加 [[A 记录]], [[TXT 记录]], [[CNAME 记录]] 等等了。

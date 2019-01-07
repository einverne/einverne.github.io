---
layout: post
title: "Google Cloud Platform 使用向导"
tagline: ""
description: ""
category: 学习笔记
tags: [google, google-cloud, ]
last_updated:
---

Google Cloud 提供 300 刀的初始优惠，而最近我的 Linode 节点越来越不稳定，时常撞墙，所以不得不再别人强烈推荐下注册了一下 GCP。这里就记录一下遇到的问题，其他具体的细节网上已经够多，就不再赘述。

## 关于信用卡
国内的信用卡不太清楚为什么我试了几个都有报错，网上说把账单地址改成美国，信用卡签名也最好保持一致。

## 区域选择
GCP 的 Compute Engine 在不同的机房都有分布，在创建 Compute Engine 的时候可以参考[这里](https://cloud.google.com/compute/docs/regions-zones/#available) 这里非常详细的介绍了各个机房的地理位置，以及该机房拥有的机器类型，特性等。

## 网页版 SSH 切换身份

    sudo -i
    sudo su

## 使用 SSH 登录
默认情况下 Google 是禁止密码登录 SSH，我一般情况下会创建一个新用户

    adduser xxx

然后给该用户提供登录权限

    vi /etc/ssh/sshd_config

编辑

    PasswordAuthentication yes

然后重启

    service sshd restart



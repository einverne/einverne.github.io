---
layout: post
title: "挂载腾讯云对象存储COS"
tagline: ""
description: ""
category: 经验总结
tags: [linux, cos, tencent, vps, cloud-storage]
last_updated: 
---

[腾讯云对象存储](https://cloud.tencent.com/product/cos) Cloud Object Storage ，简称 COS，是腾讯云为企业和个人开发者提供的存储海量数据的分布式存储服务。

## 基本使用
在[控制面板](https://console.cloud.tencent.com/cos5)申请对象存储基本信息，创建存储桶，输入名字，选择地域，选择访问权限，然后访问[秘钥](https://console.cloud.tencent.com/cos5/key)，可以得到如下信息：

    bucket: backup-1251234567 (格式为 bucketname-appid)
    SecretId: SecretId
    SecretKey: SecretKey
    region: ap-beijing
    appid: 123456789

## 将腾讯云 COS 挂载到腾讯云服务器中
安装必要的应用

    wget https://github.com/tencentyun/cosfs/releases/download/v1.0.2/cosfs_1.0.2-ubuntu16.04_amd64.deb
    sudo apt update && sudo apt install gdebi-core
    sudo gdebi release-cosfs-package

配置文件，设置 bucket name, access key/id 等信息，将其存放在 `/etc/passwd-cosfs` 文件中，文件权限设置为 640

    echo my-bucket:my-access-key-id:my-access-key-secret > /etc/passwd-cosfs
    chmod 640 /etc/passwd-cosfs

然后将 cos bucket mount 到指定目录

    cosfs appid:bucket-name mount-point -ourl=my-cos-endpoint -odbglevel=info -oallow_other

这里的 `cos-endpoint` 不同地区不一样，比如北京是 `http://cos.ap-beijing.myqcloud.com`，其他地区根据 region 不同设置不同值

项目可参考官方[项目](https://github.com/tencentyun/cosfs)

COSFS 工具[使用](https://cloud.tencent.com/document/product/436/6883)




---
layout: post
title: "ZooKeeper zkCli 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [zookeeper, zkcli, apache, ]
last_updated:
---

Java 版本

    sh zkCli.sh -server IP:port

## 查看节点内容
进入 server 连接后使用

    ls /

来查看节点包含内容

    ls2 /

说明：

- ls2 是比 ls 更高级的命令，可以额外输出节点的状态信息，最新版本中 ls2 命令已经被废弃，使用 `ls -s` 代替。


## 创建新节点
create 创建新的 Znode 节点，path：路径 data：数据 acl：权限，不指定默认为 world:anyone:cdwra

    create /test "mydata"

该命令其他选项：

- `-s` : 顺序节点
- `-e` ：临时数据节点，重启会消失

## 查看 znode 节点内容

    get /test

在 get 命令的结果中会输出其他信息

- CZxid：表示该节点在那个事务中创建的事务 id。
- ctime：表示该节点的创建时间
- mZxid：表示该节点更新时的事务 id
- mtime：表示该节点的修改时间
- pZxid：表示该节点的子节点列表最后一次被修改的事务 id
- cversion：子节点版本号
- dataversion：数据版本号
- aclversion：权限版本号
- ephemeralOwner：专门用于临时节点，表示创建该临时节点的事务 id（如果当前节点是持久节点，该值固定为 0）
- dataLength：当前节点存放数据的长度
- numChildren：当前节点的子节点数目

## 更新 znode 内容

    set /test "new data"

## 删除 znode

    delete /test

## 循环删除有子节点的父节点

    rmr /test

## 查看节点配额

    listquota

## 其他命令

- history 打印出最近执行的十个命令
- redo cmdno 根据命令编号（可用 history 查询编号）重新执行以前执行过的命令
- close 关闭当前连接，可用 connect 再次连接，不会退出客户端
- quit 关闭连接并退出连接客户端
- connect 连接服务器

## 全部命令

    ZooKeeper -server host:port cmd args
        addauth scheme auth
        close
        config [-c] [-w] [-s]
        connect host:port
        create [-s] [-e] [-c] [-t ttl] path [data] [acl]
        delete [-v version] path
        deleteall path
        delquota [-n|-b] path
        get [-s] [-w] path
        getAcl [-s] path
        history
        listquota path
        ls [-s] [-w] [-R] path
        ls2 path [watch]
        printwatches on|off
        quit
        reconfig [-s] [-v version] [[-file path] | [-members serverID=host:port1:port2;port3[,...]*]] | [-add serverId=host:port1:port2;port3[,...]]* [-remove serverId[,...]*]
        redo cmdno
        removewatches path [-c|-d|-a] [-l]
        rmr path
        set [-s] [-v version] path data
        setAcl [-s] [-v version] [-R] path acl
        setquota -n|-b val path
        stat [-w] path
        sync path


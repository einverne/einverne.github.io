---
layout: post
title: "yarn 使用笔记"
aliases:
- "yarn 使用笔记"
tagline: ""
description: ""
category: 经验总结
tags: [ yarn, javascript, nodejs, package-management ]
create_time: 2022-02-19 16:50:01
last_updated: 2025-02-19 16:50:01
dg-home: false
dg-publish: false
---


Yarn 是一个 JavaScript 的包管理器。

JavaScript 代码通过 包（package） (或者称为 模块（module）) 的方式来共享。 一个包里包含所有需要共享的代码，以及描述包信息的文件，称为 `package.json` 。

初始化新项目：

    yarn init

添加依赖：

```
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]
```

添加开发环境依赖

```
yarn add [package] --dev
yarn add [package]@[version] --dev
yarn add [package]@[tag] --dev
```

卸载依赖：

```
yarn remove [package]
```

更新依赖：

```
yarn upgrade [package]
yarn upgrade [package]@[version]
yarn upgrade [package]@[tag]
```

安装所有项目的依赖：

```
yarn install
```

运行项目中的脚本：

```
yarn run [script]
```

Yarn 还支持很多其他功能，如锁定版本、缓存管理等。更多详细信息可以查看 Yarn 的官方文档：https://classic.yarnpkg.com/en/docs/

升级依赖包

```
yarn upgrade [package]
yarn upgrade [package]@[version]
yarn upgrade [package]@[tag]
```

移除

```
yarn remove [package]
```

安装全部依赖：

```
yarn
```

## 设置镜像源

默认是 `https://registry.yarnpkg.com`

查看并设置：

    yarn config get registry
    yarn config set registry https://registry.npm.taobao.org/

使用第三方软件快速修改、切换 yarn 镜像源

    yrm YARN registry manager

yrm 不仅可以快速切换镜像源，还可以测试自己网络访问不同源的速度

安装 yrm

    npm install -g yrm

列出当前可用的所有镜像源

    yrm ls

        npm -----  https://registry.npmjs.org/
        cnpm ----  http://r.cnpmjs.org/
        taobao --  https://registry.npm.taobao.org/
        nj ------  https://registry.nodejitsu.com/
        rednpm -- http://registry.mirror.cqupt.edu.cn
        skimdb -- https://skimdb.npmjs.com/registry
        yarn ----  https://registry.yarnpkg.com

使用淘宝镜像源

    yrm use taobao

测试访问速度

yrm test taobao

更多用法查看 yrm GitHub
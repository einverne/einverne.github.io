---
layout: post
title: "使用 Beancount 记账篇七：Fava 展示"
aliases:
- "使用 Beancount 记账篇七：Fava 展示"
tagline: ""
description: ""
category: Beancount
tags: [beancount, plaintext, accounting, 记账, fava, dashboard]
create_time: 2023-11-10 11:42:47
last_updated: 2023-11-10 11:42:47
---

之前的文章中已经详细介绍过纯文本记账软件 [[Beancount]] 是什么，以及怎么使用纯文本的文件来记录和管理自己的资产，负债，支出等等，但是 Beancount 毕竟还是纯文本的工具，不能直观地查看账本中的信息，这篇文章就介绍一下 Fava，Fava 是一款可以帮助用户将 Beancount 账本信息展示出来，查看，分析的 Web 工具。

Fava 是一个基于 Flask 框架开发的 Web 应用程序，它可以将 Beancount 账目文件解析并在浏览器中以直观的方式展示出来。使用 Fava 可以方便地查看账目的各种统计信息、生成报表以及进行筛选和搜索。

Fava 提供的功能包括但不限于：

- 查询余额
- 交易记录
- 生成报表，包括 [[资产损益表]] Income Statement，[[资产负债表]] Balance Sheet
- 查询分析，在 Fava 中可以对账户的数据进行查询分析

## 安装

要使用 Fava，首先需要安装它。可以通过 pip 命令来安装：

```
pip install fava
```

安装完成后，可以通过以下命令来启动 Fava：

```
fava /path/to/主账目文件路径
```

等程序启动之后，在浏览器中打开 http://localhost:5000 即可访问 Fava 界面。

指定端口

可以使用 `-p` 参数来指定端口

```
fava -p 5001 /path/to/main.bean
```

## 使用

在 Fava 中，可以通过点击左侧导航栏中的不同链接来查看不同类型的报表和统计信息。例如，“Accounts”页面显示了所有账户及其余额，“Income Statement”页面显示了收入和支出的情况，“Balance Sheet”页面显示了资产和负债的情况等等。

除了查看报表和统计信息外，Fava 还提供了一些方便的功能。例如，可以通过在搜索框中输入关键词来搜索特定的交易记录，可以通过在筛选器中选择特定的账户、标签或日期范围来筛选交易记录。

此外，Fava 还支持自定义报表。可以通过在账目文件中添加一些特殊注释来定义自己的报表。例如，可以在账目文件中添加如下注释：

```
; @title: My Report
; @group: expense
; @query: expenses
```

这样就定义了一个名为“My Report”的报表，它属于“expense”分组，并且使用名为“expenses”的查询。然后，在 Fava 界面中就可以看到“My Report”这个报表，并且点击它就会显示对应的统计信息。

### 查看账户信息

要查看账户，可以单击导航栏中的“账户”选项卡。Fava 将会显示账户列表。

单击账户名称，可以查看该账户的详细信息，包括余额、交易记录等。

## Dashboards

[Fava Dashboards](https://github.com/andreasgerstmayr/fava-dashboards) 是一个 Fava 第三方的 Dashboards。

安装

```
pip install git+https://github.com/andreasgerstmayr/fava-dashboards.git
```

然后需要在 Beancount 中添加配置

```
2010-01-01 custom "fava-extension" "fava_dashboards"
```

默认情况下插件会查找目录下的 `dashboards.yaml` 文件，如果文件放在了其他目录或其他名字，可以配置

```
2010-01-01 custom "fava-extension" "fava_dashboards" "{
    'config': '/path/to/dashboards.yaml'
}"
```

效果展示

![oF82wh0qUW](https://pic.einverne.info/images/oF82wh0qUW.png)
资产和负债

![dkcuZy1G0e](https://pic.einverne.info/images/dkcuZy1G0e.png)

![oK8SkCsL-B](https://pic.einverne.info/images/oK8SkCsL-B.png)

![35Sa_gmRx7](https://pic.einverne.info/images/35Sa_gmRx7.png)

![lZ7K8QJ2JZ](https://pic.einverne.info/images/lZ7K8QJ2JZ.png)

![RLqFvDcmiY](https://pic.einverne.info/images/RLqFvDcmiY.png)

## 总结

Fava 是一个非常方便实用的工具，可以帮助我们更好地展示和分析 Beancount 账目文件。如果你使用 Beancount 进行记账，并且希望以直观的方式查看和操作账目，那么不妨试试 Fava 吧！

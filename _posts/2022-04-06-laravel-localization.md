---
layout: post
title: "Laravel 学习笔记：本地化"
aliases: 
- "Laravel 学习笔记：本地化"
tagline: ""
description: ""
category: 学习笔记
tags: [ laravel, localization, php, learning-note, learning-note  ]
last_updated: 2022-04-03 04:57:09
create_time: 2022-04-03 04:44:56
---


通过 Laravel 的样例项目也应该能看到 Laravel 对本地化多语言的支持代码了。

观察一下项目的目录结构就能猜出来语言文件在 `resources/lang` 中。目录结构需要按照 ISO 15897 标准来命令，简体中文 `zh_CN`

```
/resources
    /lang
        /en
            messages.php
        /es
            messages.php
```

可以看到所有的语言文件都是返回一个 key-value 结构。

### JSON 文件
Laravel 还可以定义 JSON 文件，存放在 `resources/lang` 下，如果是中文则是 `resources/lang/zh_CN.json` 文件：

```
{
    "welcome": "欢迎来到 EV 的 Blog"
}
```

## 配置 Locale
在 `config/app.php` 中可以配置网站语言。


## 使用翻译
可以使用 `__` 辅助函数来从语言文件中获取翻译。

```
echo __('welcome')
```

在 Blade 模板引擎中，可以直接在 `{{}}` 中使用：

```
{{ __('welcome') }}
```

如果翻译字符不存在，则直接返回字符串。


## 翻译占位符
如果翻译字符串中有需要变动的变量，可以使用 `:` 来将其定义为占位符：

```
'welcome' => 'Welcome, :name',
```

然后在获取的时候传入一个数组用于替换：

```
echo __('welcome', ['name' => 'laravel']);
```



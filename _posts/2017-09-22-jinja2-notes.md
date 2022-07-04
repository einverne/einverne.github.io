---
layout: post
title: "jinja2 笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [python, flask, jinja2, template, web, ]
last_updated:
---

jinja2 是基于 Python 的模板引擎。

## 种类
注意下面的 \ 是因为模板需要转义，使用时需要去掉，另外大括号和 % 之间的空格也需要去掉。

    \{\% ... \%\}  Statements 控制结构，比如 if/elif/else for-loops，macros，block 等等
    \{\{ ... \}\}  Expressions 表达式，用来输出结果
    \{\# ... \#\}  Comments 注释
    \#  ... \#\#  Line Statements

## 表达式及过滤器
`\{\{ name \}\}` 结构表示一个变量

过滤器用法

    Hello, \{\{ name|capitalize \}\}

常用的过滤器

过滤器 | 说明
-------|-----------
safe | 渲染值时不转义
capitalize | 把值的首字母转换成大写，其他字母转换成小写
lower | 把值转换成小写形式
upper | 把值转换成大写形式
title | 把值中每个单词的首字母都转换成大写
trim | 把值的首尾空格去掉
striptags | 渲染之前把值中所有的 HTML 标签都删掉
length | 输出长度

完整的过滤器清单可以在文档中找到：<http://jinja.pocoo.org/docs/templates/#builtin-filters>

## 控制结构
用来控制流程

常见的 if-else

```
{ % if user % }
    Hello, {{ user }}!
{ % else % }
    Hello, Stranger!
{ % endif % }
```

for 循环

```
<ul>
{ % for comment in comments % }
    <li>{{ comment }}</li>
{ % endfor % }
</ul>
```

宏，类似方法

```
{ % macro render_comment(comment) % }
    <li>{{ comment }}</li>
{ % endmacro % }

<ul>
{ % for comment in comments % }
    {{ render_comment(comment) }}
{ % endfor % }
</ul>
```

保存到文件中使用 import

```
{ % import 'macros.html' as macros % }
<ul>
    { % for comment in comments % }
        {{ macros.render_comment(comment) }}
    { % endfor % }
</ul>
```

需要多次使用的模板可以单独放在文件中，然后 使用 include

```
{ % include 'common.html' % }
```

模板继承，先定义父模板

```
<html>
<head>
    { % block head % }
        <title>{ % block title % }{ % endblock % } - My Application</title>
    { % endblock % }
</head>
<body>
{ % block body % }
{ % endblock % }
</body>
</html>
```

然后继承

```
{ % extends "base.html" % }
{ % block title % }Index{ % endblock % }
{ % block head % }
    {{ super() }}
    <style>
    </style>
{ % endblock % }
{ % block body % }
    <h1>Hello, World!</h1>
{ % endblock % }
```

## 表单
WTForms 支持的字段类型

字段类型    | 说明
------------|-------------
StringField | 文本字段
TextAreaField | 多行文本字段
PasswordField | 密码文本字段
HiddenField | 隐藏文本字段
DateField | 文本字段，值为  datetime.date  格式
DateTimeField | 文本字段，值为  datetime.datetime  格式
IntegerField | 文本字段，值为整数
DecimalField | 文本字段，值为  decimal.Decimal
FloatField | 文本字段，值为浮点数
BooleanField | 复选框，值为  True  和  False
RadioField | 一组单选框
SelectField | 下拉列表
SelectMultipleField | 下拉列表，可选择多个值
FileField | 文件上传字段
SubmitField | 表单提交按钮
FormField | 把表单作为字段嵌入另一个表单
FieldList | 一组指定类型的字段

WTForms 支持的验证函数

验证函数 | 说明
---------|--------------
Email | 验证电子邮件地址
EqualTo | 比较两个字段的值；常用于要求输入两次密码进行确认的情况
IPAddress | 验证  IPv4  网络地址
Length | 验证输入字符串的长度
NumberRange | 验证输入的值在数字范围内
Optional | 无输入值时跳过其他验证函数
Required | 确保字段中有数据
Regexp | 使用正则表达式验证输入值
URL | 验证  URL
AnyOf | 确保输入值在可选值列表中
NoneOf | 确保输入值不在可选值列表中

在模板中使用

```
<form method="POST">
{{ form.hidden_tag() }}
{{ form.name.label }} {{ form.name(id='my-text-field') }}
{{ form.submit() }}
</form>
```


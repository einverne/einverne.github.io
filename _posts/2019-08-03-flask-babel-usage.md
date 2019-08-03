---
layout: post
title: "Flask Babel 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [flask, flask, flask-babel, translations, langauge,]
last_updated:
---

Flask babel 是 Flask 的语言扩展，允许非常简单的方式让 Flask 支持多语言。

## Installation

    pip install flask-babel

安装时会安装依赖

- Babel， Python 国际化
- pytz 时区
- speaklater 辅助工具集

## Configuration

在 python 文件中要使用多语言的文字时引入

    from flask_babel import gettext

比如

    gettext('author')

在 html 模板文件中

    <pre>{\% trans \%\}Submit{\% endtrans \%\}</pre>

在项目目录中新建 `babel.cfg`

    [python: **.py]
    [jinja2: **/templates/**.html]
    extensions=jinja2.ext.autoescape,jinja2.ext.with_,webassets.ext.jinja2.AssetsExtension

然后生成模板文件

    pybabel extract -F babel.cfg -o translations/messages.pot .

文件 `messages.pot` 就是翻译模板文件

然后生成中文翻译文件

    pybabel init -i translations/messages.pot -d translations -l zh_Hans_CN

复杂的项目可以借助 GUI 工具 [poedit](https://poedit.net/)

编辑后编译

    pybabel compile -d translations

如果更新了项目文件，新增了需要翻译的字段，在生成 messages.pot 之后可以使用如下方法将更新合并到需要翻译的文件中

    pybabel update -i translations/messages.pot -d translations

## Flask Babel 和 Flask WTF 一起使用
如果直接定义时使用 gettext 可能无法使用 babel 的翻译，需要使用 `lazy_gettext('')`.

    class LoginForm(Form):
        username = TextField(gettext(u'Username'), validators=[validators.Required()])

## Notice

### translations 位置
translations 目录必须是跟你 Flask 的 app 应用对象在同一目录下，如果你的 app 对象是放在某个包里，那 translations 目录也必须放在那个包下。

如果使用自定义的目录那么，需要自己手动指定目录名字。

    app.config['BABEL_TRANSLATION_DIRECTORIES'] = 'translation'

## Other
可以使用 `pybabel --list-locales` 来查看本机语言编码。

## reference

- <https://pythonhosted.org/Flask-Babel/>
- <https://flask-user.readthedocs.io/en/v0.6/internationalization.html>
- <https://translations.readthedocs.io/en/latest/flask-babel.html>

---
layout: post
title: "django web framework 学习笔记"
tagline: ""
description: "Django 学习笔记"
category: 学习笔记
tags: [Django, Python, 学习笔记, Web, ]
last_updated: 
---

这两天大概看了一下Python的web框架----Django，顺带复习一下Python。从刚开始的一无所知，到现在对Django中MVC的一些了解，感觉收获颇丰，还顺带回想起来以前学习过程中的一些MVC的知识，虽然Django不是[完全按照MVC](https://docs.djangoproject.com/en/1.9/faq/general/#django-appears-to-be-a-mvc-framework-but-you-call-the-controller-the-view-and-the-view-the-template-how-come-you-don-t-use-the-standard-names)的命名模式 Model，View，Controller，但是它依然遵循类似的开发模式，Django自己说自己是 MTV 模式， Model，Template，View。

在看 Django 之前也了解了一些 Python 的Web框架，在之前的写字应用中用 [webpy](http://webpy.org/) 作了一个简单的接口，webpy 实现很简单，用它当然也能做一些大项目，但是可能需要自己Custom的东西比较多。而Django可以快速上手。

## Installation

安装非常简单，先安装 [virtualenv](http://docs.python-guide.org/en/latest/dev/virtualenvs/)

	$ pip install virtualenv
    $ cd my_project_folder
	$ virtualenv .			# create virtual env in current folder
    $ source bin/activate

再安装 Django ， 创建工程，然后就可以开工了。

	$ pip install django  	# install latest version
    # pip install django==1.9 或者指定某一版本
    # pip install django --upgrade
    $ django-admin startproject projectname

几个很常用的命令，在 `manage.py` 目录下：

	$ python manage.py help
    $ python manage.py runserver [port]
    $ python manage.py makemigrations # 每一次修改 model 之后需要运行，之后需要运行 migrate
    $ python manage.py migrate   # 已经代替了 python manage.py syncdb 数据库相关，创建表
    $ python manage.py createsuperuser
    $ python manage.py startapp appname

## 几个文件 {#files}

几个文件解释：

- models.py 和数据库表相关

	model 中需要用到的 Field ，关键字：[Model field reference]

- views.py 显示相关

	处理HttpRequest请求，通过模板生成HTML网页返回

- urls.py 匹配URL模式
	
    通过正则匹配请求URL，将对应URL导向相应的view。Django 1.9 中可以引用三种对应的URL匹配模式，`Function views`,`Class-based views` 和 `Including another URLconf` 方式来定义URL。

- settings.py 项目设置
    
    项目地址，安装应用，数据库，静态文件地址，等等都在此文件中配置。

## 学习方式 {#further-learning}

我觉得最好的教程就是官方的[Getting started with Django](https://www.djangoproject.com/start/)，但是唯一的坏处就是不够视频直观，这个时候上 Google 搜[Django tutorial](https://www.google.com/search?q=Django+tutorial) 能够找到很多视频教程，先行入门之后，再去回头看官方的教程或者文档，会很轻松的加快学习进度。

个人觉得几个很重要的文档，在新建 model 的时候， Django 自带了一些 Field， 这些变量的定义直接影响到数据库中保存的数据，在我刚开始学习的时候经常查看[Model field reference](https://docs.djangoproject.com/es/1.9/ref/models/fields/). 在定义完 model 之后需要执行 `python manage.py makemigrations` 和 `python manage.py migrate` 来同步自定义的 model 和 数据库中内容。

在 view 中需要 render 模板的时候，常用的方式就是在 工程下app 的同级目录增加 templates 目录，将html模板放到该目录下。并且需要在 settings.py 文件中 TEMPLATES 设置中增加 
`'DIRS': [os.path.join(BASE_DIR, "templates")],`. 可以参考 [官方文档](https://docs.djangoproject.com/en/1.9/topics/templates/) .

而接下来是网页的表单，可以自定义表单，也可以通过 Model 直接生成对应的表单，[官方](https://docs.djangoproject.com/en/1.9/ref/forms/fields/)都有详细的介绍。

至此生成一个自己的简单页面应该没有任何问题了。下面就是学习一些深入的内容，在之前的视频中有用到 `django-registration-redux` 一个[第三方的注册登陆](http://django-registration-redux.readthedocs.org/en/latest/quickstart.html)的实现。能够快速实现一个网站的注册邮箱验证以及登录验证。然后因为 Django 生成的网页表单太丑，所以还用了 `django-crispy-forms` 这样一个[第三方生成表单](http://django-crispy-forms.readthedocs.org/en/latest/)的应用。快速生成带CSS样式的表单。具体的使用看文档都能够快速使用。

到此，可以看一些教程实现一些自定义的表单 validation，可以看一下第三方应用的实现来充实一下自己的 django 知识，甚至可以实现一个具体的应用来锻炼一下。


## 参考 {#reference}

- [官方参考](https://docs.djangoproject.com/en/1.9/)
	其中有很详细的文档、教程、已经一些基本的网页应用实现，缓存，分页，RSS，消息，Sessions 等等
- [YouTube 教程](https://www.youtube.com/user/CodingEntrepreneurs/playlists)
	一步一步教你用 Django 实现一个简单的个人博客。

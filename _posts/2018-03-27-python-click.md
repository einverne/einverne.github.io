---
layout: post
title: "使用 click 构造漂亮的Python命令行程序"
tagline: ""
description: ""
category: 学习笔记
tags: [python, flask, click, command]
last_updated: 
---

Click 是 Python 下一款命令行库，可以用来快速轻松实现Python命令行程序。之前也介绍过一个 [argparse](/post/2017/12/argparse-use.html) ，但是要比 click 复杂很多，至少从代码上看。但是 click 其实也说了[^why] argparse 在标准库中，click 是依赖于 optparse 的，至于不基于 argparse 是因为 argparse 不支持嵌套，并且在 POSIX 兼容上有问题。

Click 被设计用来快速构建命令行程序，因此缺乏一些扩展性，比如他不允许高度定制help介绍。Click 是用来支持 [Flask](http://flask.pocoo.org/) 开发框架的。

[^why]: http://click.pocoo.org/6/why/

官网地址: <http://click.pocoo.org>

## 基本使用

    # hello.py
    import click
    @click.command()
    @click.option('--count', default=1, help='Number of greetings.')
    @click.option('--name', prompt='Your name',
                  help='The person to greet.')
    def hello(count, name):
        """Simple program that greets NAME for a total of COUNT times."""
        for x in range(count):
            click.echo('Hello %s!' % name)

    if __name__ == '__main__':
        hello()

然后可以这样运行该脚本 `python hello.py --count=3`，并且 Click 还会自动生成 help 信息。

## Option 参数
Click 使用基本可以归纳为

- 使用 @click.command() 装饰一个函数，使之成为命令行接口；
- 使用 @click.option() 等装饰函数，为其添加命令行选项等。

最基础的用法， option 接受一个变量

    @click.command()
    @click.option('--n', default=1)
    def hello(n):
        click.echo('hello' * n)

使用 `--n=2` 输出两遍

接受多个变量，需要使用 `nargs` 指定数量

    @click.command()
    @click.option('--pos', nargs=2, type=float)
    def cal(pos):
        click.echo('%s / %s' % pos)

使用 `--pos 5.0 4.0`

如果参数是固定的几个值，可以使用可选项

    @click.command()
    @click.option('--hash-type', type=click.Choice(['md5', 'sha1']))
    def digest(hash_type):
        click.echo(hash_type)

使用 `--hash-type=md5` 参数只能为 `md5` 或者 `sha1`，否则报错。

option 还有其他一些参数，比如 `prompt` 当用户忘记该参数时，将错误报出来，`hide_input` 可以隐藏输入，常用于密码输入，`confirmation_prompt` 验证输入等等。

Click 封装了 

    @click.password_option()
    @click.confirmation_option(prompt='Are you sure you want to drop the db?')

## argument 参数
和 Option 一样，Argument 最基础的应用就是传递一个简单变量值

    @click.command()
    @click.argument('input', type=click.File('rb'))
    @click.argument('output', type=click.File('wb'))
    def inout(input, output):
        while True:
            chunk = input.read(1024)
            if not chunk:
                break
            output.write(chunk)


## reference

- <http://click.pocoo.org/5/options/>
- <http://click.pocoo.org/5/arguments/>

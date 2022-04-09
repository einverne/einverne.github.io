---
layout: post
title: "Laravel 学习笔记：发送邮件"
aliases: 
- "Laravel 学习笔记：发送邮件"
tagline: ""
description: ""
category: [ 学习笔记 , laravel ]
tags: [ laravel, email, sendmail, mailer, mailgun, smtp]
last_updated:
---


在我最初的设计中一共有两个地方需要发送邮件：

- 第一就是用户注册，发送邮件激活
- 第二就是当用户订阅一个书单的时候，自动给所有订阅的用户发送带有附件的电子书到其设定的邮箱中

所以接下来就记录一下使用 Laravel 发送邮件。

在 Laravel 中发送邮件并不是那么复杂。Laravel 通过 Symfony Mailer 实现了一套非常简洁的邮件 API。

Laravel 中提供了很多种方式来发送邮件：

- [[SMTP]] 直接配置 SMTP服务器
- [[Mailgun]] 通过 Mailgun 等发送邮件的服务提供商
- [[Postmark]]
- [[Amazon SES]]
- sendmail

在 `env` 配置文件中选择使用哪个邮件发送方式。

## 配置 {#configuration}
Laravel 邮件服务可以通过 `config/mail.php` 来配置。每一个邮件配置都有一个唯一 `transport`，这也就意味着你的应用可以使用不同的服务来发送不同的邮件。比如说你的应用可以使用 Postmark 来发送交易邮件，然后使用 Amazon SES 来批量发送营销邮件。

在 `mail` 配置文件中可以发现 `mailers` 配置数组，这个数组中可以配置不同的邮件服务。default 用来指定默认的邮件发送服务。

因为默认生成的项目在 `mail` 配置中默认使用了 SMTP，然后使用来环境变量，所以我们可以在 `.env` 配置文件中配置：

```
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=mygoogle@gmail.com
MAIL_PASSWORD=<your_password>
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=mygoogle@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

在 example 中，Laravel 给我们提供了一个测试的 [[mailhog]] MTA，可以用来在本地进行调试。

```
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## 创建邮件
创建类 `BookSendMail` 来模拟邮件发送。

```
php artisan make:mail BookSendMail
```

文件会创建到 `app/Mail` 目录下。

可以看到其中一个 `build()` 方法就是入口方法。

```
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookSendMail extends Mailable
{
    use Queueable, SerializesModels;

    public $detail;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($detail)
    {
        $this->detail = $detail;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('This is subject')->view('mail.bookSendMail');
    }
}
```

## 创建 Blade View
接下来就是创建一个 Blade 模板文件，邮件的正文部分。

文件创建在 `resources/views/mail/bookSendMail.blade.php`：

```
<!DOCTYPE html>  
<html lang="en">  
<head>  
 <title>name: {{ $detail['title'] }}</title>  
</head>  
<body>  
<h1>{{ $detail['title'] }}</h1>  
<p>{{ $detail['body'] }}</p>  
  
<p>Thank you</p>  
</body>  
</html>
```

## Add Route

```
Route::get('send-mail', function () {
    $detail = [
        'title' => 'Mail from Laravel',
        'body' => 'This is a test mail from Laravel',
    ];

    Mail::to('einverne@gmail.com')->send(new \App\Mail\BookSendMail($detail));

    dd("Email sent");
});
```


然后调用 `http://localhost:8080/send-mail`，即可。

如果本地用了官方的 Sail 启动，可以访问 `http://localhost:8025/` Mailhog 的后台，就可以看到发送的邮件了。

如果测试没有问题，那就可以直接把正式的 SMTP 配置修改到 `.env` 文件中。

## Failover 配置
你可以配置一个额外的邮件服务来防止你的主邮件服务宕机后造成的服务不可用，配置 failover 在主服务失败之后切换到备份邮件服务器。

为了实现这个目的需要在 `mail` 配置文件中使用 `failover` transport。`failover` 配置也需要是一个数组。

```
'mailers' => [
    'failover' => [
        'transport' => 'failover',
        'mailers' => [
            'postmark',
            'mailgun',
            'sendmail',
        ],
    ],
 
    // ...
],
```

一旦定义了 failover 邮件，你需要设置：

```
'default' => env('MAIL_MAILER', 'failover'),
```


## 产生 Mailables
在 Laravel 中，每一种类型的邮件可以用 `mailable` 类来表现，这个类保存在 `app/Mail` 文件夹中。

可以使用 `make:mail` 来产生：

    php artisan make:mail OrderShipped
 
产生的 `mailable` 中最要的一个方法就是 `build()`，在这个方法中可以调用不同的方法，比如说 `from`, `subject`, `view`, `attach` 来定义邮件的形式。

## 配置发送者

使用 `mailable` 中的方法：

```
public function build()
{
    return $this->from('example@example.com', 'Example')
                ->view('emails.orders.shipped');
}
```

或者使用全局 `from` 配置，可以在 `config/mail.php` 中配置

```
'from' => ['address' => 'example@example.com', 'name' => 'App Name'],
```

## 定义 View
在 `mailable` 类的 `build` 方法中，你可以使用 `view` 方法来指定邮件内容。

每一个邮件都可以使用 `Blade` 模板引擎来渲染其内容。

```
public function build()
{
    return $this->view('emails.orders.shipped');
}
```

Blade 模板可以存放在 `resources/views/emails` 下。


 
## 发送带附件的邮件
可以使用 `attach` 方法：

```
public function build()
{
    return $this->view('emails.orders.shipped')
                ->attach('/path/to/file');
}
```

## 使用 Markdown 引擎 Mailables
如果想要使用 Markdown template ，可以使用 `--markdown` 选项：

    php artisan make:mail OrderShipped --markdown=emails.orders.shipped

然后在 Mailable 中可以使用：


```
public function build()
{
    return $this->from('example@example.com')
                ->markdown('emails.orders.shipped', [
                    'url' => $this->orderUrl,
                ]);
}
```

Markdown mailables 使用 Blade components 和 Markdown 语法的组合，允许用户快速构建邮件内容：

```
@component('mail::message')
# Order Shipped
 
Your order has been shipped!
 
@component('mail::button', ['url' => $url])
View Order
@endcomponent
 
Thanks,<br>
{{ config('app.name') }}
@endcomponent
```


## 发送邮件方法
Mail facade 有一个 to 方法，接受一个邮件地址，或者一个用户实例，或者一组用户。

如果你传入一个对象，mailer 会自动使用其 `email` 和 `name` 属性来决定目的地址。

```
    public function store(Request $request)
    {
        $order = Order::findOrFail($request->order_id);
 
        // Ship the order...
 
        Mail::to($request->user())->send(new OrderShipped($order));
    }
```

发送邮件时指定邮件服务提供方，默认情况 Laravel 发送邮件会使用默认配置的 `default`，如果要指定 mailer 可以：

```
Mail::mailer('postmark')
        ->to($request->user())
        ->send(new OrderShipped($order));
```


## reference

- <https://laravel.com/docs/9.x/mail>
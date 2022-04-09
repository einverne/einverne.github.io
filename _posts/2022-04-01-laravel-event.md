---
layout: post
title: "Laravel 学习笔记：事件"
aliases:
- "Laravel 学习笔记：事件"
tagline: ""
description: ""
category: laravel
tags: [ laravel, laravel-event, learning-note, php ]
last_updated: 2022-04-09 02:55:50
create_time: 2022-04-08 09:50:18
---

Laravel Event 提供了一个最简单的观察者模式实现，可以订阅监听应用中发生的事件。事件通常放在 `app/Events` 目录，监听器放在 `app/Listeners`。

事件是应用功能模块之间解耦的有效方法。单个事件可以有多个监听器，监听器之间相互没有影响。

比如说每次有订单产生时，发送给用户一个 Slack 通知，通过事件，可以将处理订单的代码和 Slack 通知代码解耦，只需要发起一个事件，监听器监听订单产生事件，然后触发响应的动作即可。




## 注册事件/监听器

可以使用如下的命令创建 Event

    php artisan event:generate

或者分别单独创建 Event 和 Listener：

```
php artisan make:event PodcastProcessed

php artisan make:listener SendPodcastNotification --event=PodcastProcessed
```

然后需要手动添加到 `EventServiceProvider` 的 `boot` 方法中。

`EventServiceProvider` 中的 `$listen` 数组配置了监听器：

```
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];
```



## Defining Event
Event class 是一个包含了 Event 信息的数据容器。

```
<?php

namespace App\Events;

use App\Models\Subscribe;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SubscribeEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $subscribe;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Subscribe $subscribe)
    {
        $this->$subscribe = $subscribe;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
```

可以看到 Event 中几乎没有什么逻辑，只是保存了一个 Subscribe Model。


## Defining Listeners

`Event listeners` 会在 `handle` 方法中被触发。也 `handle` 方法中可以执行对应的事件响应。

```
<?php

namespace App\Listeners;

use App\Events\SubscribeEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SubscribeListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(SubscribeEvent $event)
    {
        //
    }
}
```

handle 方法会接受一个 Event 参数，这个参数就是定义的 Event。

定义好 Event 和 Listener 之后，在 `EventServiceProvider` 注册，就可以通过

    event(new \App\Events\SubscribeEvent($subscribe));

来触发事件。

## Queued Event Listener
如果你要在 Listener 中执行一些繁重的操作，那么可以使用 `Queued Event Listener`:

在 `Listener` 上指定实现 `ShouldQueue`，然后记得配置好队列。

```
<?php
 
namespace App\Listeners;
 
use App\Events\OrderShipped;
use Illuminate\Contracts\Queue\ShouldQueue;
 
class SendShipmentNotification implements ShouldQueue
{
    //
}
```

这样，当一个事件发生后，Listener 会自动被添加到队列中。

## Dispatching Events

可以调用 `Events` 的 `dispatch()` 方法。

## Event Subscribers




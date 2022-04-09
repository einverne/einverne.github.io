---
layout: post
title: "Laravel 学习笔记：队列"
aliases: 
- "Laravel 学习笔记：队列"
tagline: ""
description: ""
category: [ 学习笔记 , laravel]
tags: [ laravel, queue, email, mailer, email-service, mail-server  ]
last_updated: 2022-03-31 10:14:55
create_time: 2022-03-30 10:11:36
---

当需要构建一个网络应用的时候，可能有一些任务，比如解析、存储、传输 CSV 文件等等，可能需要花费较长的时间。Laravel 提供了一个非常简单的队列 API，可以让这些操作可以在后台进行。让这些繁重的任务在后台执行可以有效的提高应用的响应速度，提升用户使用体验。

Laravel 队列提供了一个统一的 API 访问入口，可以支持不同的队列：

- [[Amazon SQS]]
- [[Redis]]
- [[Beanstalk]]
- 甚至关系型数据库

Laravel 队列的配置在 `config/queue.php` 中。

Laravel 还提供了一个 Redis 队列的 Dashboard 叫做 [Horizon](https://laravel.com/docs/9.x/horizon)。但是这一篇文章不会涉及到 Horizon 相关内容。

## Connection Vs. Queues
Laravel 队列的相关配置都在 `config/queue.php` 配置文件，其中有一个 `connections` 配置数组。这个选项用来定义和后端队列服务（比如 Amazon SQS，Beanstalk，Redis） 的连接。

每一个 connection 配置，都有一个 `queue` 属性。如果没有指定队列，那么就会放到 default 

```
use App\Jobs\ProcessPodcast;
 
// This job is sent to the default connection's default queue...
ProcessPodcast::dispatch();
 
// This job is sent to the default connection's "emails" queue...
ProcessPodcast::dispatch()->onQueue('emails');
```

Laravel 队列允许用户指定队列的优先级：

```
php artisan queue:work --queue=high,default
```


## Driver Notes & Prerequisites

### Database
如果使用数据库作为队列驱动，那么需要创建一张表来存储队列任务。运行 `queue:table` 来创建表：

    php artisan queue:table
    php artisan migrate

最后不要忘了给应用配置 `database` 驱动：

```
QUEUE_CONNECTION=database
```

### Redis

如果消息队列使用 Redis Cluster，队列的子必须包含 [key hash tag](https://redis.io/docs/reference/cluster-spec/#keys-hash-tags) ，为了确保所有的 Redis keys 都在同一个 hash slot:

```
'redis' => [
    'driver' => 'redis',
    'connection' => 'default',
    'queue' => '{default}',
    'retry_after' => 90,
    'block_for' => 5,
],
```

在使用 Redis Queue 的时候，可以使用 `block_for` 配置，用来指定驱动应该等待多久才 Redis 中拉取数据。

如果要使用其他队列，需要安装其他依赖：

- Amazon SQS: `aws/aws-sdk-php ~3.0`
- Beanstalkd: `pda/pheanstalk ~4.0`
- Redis: `predis/predis ~1.0` or phpredis PHP extension


## Creating Jobs
默认所有的队列任务存放在 `app/Jobs` 目录中，如果目录不存在可以用 artisan 命令生成：

    php artisan make:job ProcessPodcast
    
产生的类会实现 `Illuminate\Contracts\Queue\ShouldQueue` 接口，告诉 Laravel 这个任务应该被放到队列中异步执行。

Job 类非常简单，包含一个 `handle` 方法，会被队列调用。

```
<?php
 
namespace App\Jobs;
 
use App\Models\Podcast;
use App\Services\AudioProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
 
class ProcessPodcast implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
 
    /**
     * The podcast instance.
     *
     * @var \App\Models\Podcast
     */
    protected $podcast;
 
    /**
     * Create a new job instance.
     *
     * @param  App\Models\Podcast  $podcast
     * @return void
     */
    public function __construct(Podcast $podcast)
    {
        $this->podcast = $podcast;
    }
 
    /**
     * Execute the job.
     *
     * @param  App\Services\AudioProcessor  $processor
     * @return void
     */
    public function handle(AudioProcessor $processor)
    {
        // Process uploaded podcast...
    }
}
```

在这个例子中，传入了一个 Eloquent model，因为 Job 使用了 `SerializesModels`，Eloquent models 会自动序列化和反序列化。

二进制数据，比如图片内容，应该通过 `base64_encode` 方法，然后再传入队列。否则任务可能无法序列化成 JSON，然后放到队列中。

可能 model 的关系也会被序列化，这可能会很大，所以为了避免 model 关系被序列化，可以调用 `withoutRelations`

```
public function __construct(Podcast $podcast)
{
    $this->podcast = $podcast->withoutRelations();
}
```


### Unique Jobs
有些时候期望只有一个实例任务会被放到队列中，可以实现 `ShouldBeUnique`:

```
<?php
 
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeUnique;
 
class UpdateSearchIndex implements ShouldQueue, ShouldBeUnique
{
    ...
}
```

上面的例子中，`UpdateSearchIndex` 任务是唯一的，这就保证了如果队列中的任务没有完成，就不会有新的任务被加入进去。

可以通过 `uniqueId` 和 `uniqueFor` 属性来特别指定想要的主键：

```
<?php
 
use App\Product;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeUnique;
 
class UpdateSearchIndex implements ShouldQueue, ShouldBeUnique
{
    /**
     * The product instance.
     *
     * @var \App\Product
     */
    public $product;
 
    /**
     * The number of seconds after which the job's unique lock will be released.
     *
     * @var int
     */
    public $uniqueFor = 3600;
 
    /**
     * The unique ID of the job.
     *
     * @return string
     */
    public function uniqueId()
    {
        return $this->product->id;
    }
}
```


保持任务唯一，直到开始处理，可以实现 `ShouldBeUniqueUntilProcessing` 。


## Job Middleware

### 速率限制 限流

需要在 `AppServiceProvider` 类的 `boot` 方法中定义一个 RateLimiter

```
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
 
/**
 * Bootstrap any application services.
 *
 * @return void
 */
public function boot()
{
    RateLimiter::for('backups', function ($job) {
        return $job->user->vipCustomer()
                    ? Limit::none()
                    : Limit::perHour(1)->by($job->user->id);
    });
}
```


### 防止任务重叠
避免一个任务在修改资源的时候，另一个任务也在修改。


### Throttling Exceptions
当和一个不稳定的外部接口通信时，一旦抛出异常，可以制定 Throttling Exceptions 机制，定义一个重试时间。

通常情况下如果一个任务抛出了异常，任务会马上重试。



## Dispatching Jobs
一旦写好了任务类，就可以使用 `dispatch` 方法来分发。

可以在 Controller 中手动分发任务。

```
<?php
 
namespace App\Http\Controllers;
 
use App\Http\Controllers\Controller;
use App\Jobs\ProcessPodcast;
use App\Models\Podcast;
use Illuminate\Http\Request;
 
class PodcastController extends Controller
{
    /**
     * Store a new podcast.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $podcast = Podcast::create(...);
 
        // ...
 
        ProcessPodcast::dispatch($podcast);
    }
}
```

如果想要有条件分发任务可以使用 `dispatchIf` 或者 `dispatchUnless`。


### 延迟分发
可以使用 `delay` 方法来延迟分发任务：

```
<?php
 
namespace App\Http\Controllers;
 
use App\Http\Controllers\Controller;
use App\Jobs\ProcessPodcast;
use App\Models\Podcast;
use Illuminate\Http\Request;
 
class PodcastController extends Controller
{
    /**
     * Store a new podcast.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $podcast = Podcast::create(...);
 
        // ...
 
        ProcessPodcast::dispatch($podcast)
                    ->delay(now()->addMinutes(10));
    }
}
```


### 在返回浏览器请求后分发

```
use App\Jobs\SendNotification;
 
SendNotification::dispatchAfterResponse();
```



### Job Chaining
Job chaining 允许你指定一组任务，这些任务应该按照顺序依次执行，如果一个任务失败了，接下来的任务就不会执行。

```
use App\Jobs\OptimizePodcast;
use App\Jobs\ProcessPodcast;
use App\Jobs\ReleasePodcast;
use Illuminate\Support\Facades\Bus;
 
Bus::chain([
    new ProcessPodcast,
    new OptimizePodcast,
    new ReleasePodcast,
])->dispatch();
```

或者：

```
Bus::chain([
    new ProcessPodcast,
    new OptimizePodcast,
    function () {
        Podcast::update(...);
    },
])->dispatch();
```


### 自定义 Queue 和 Connection
向特定队列分发任务。

```
<?php
 
namespace App\Http\Controllers;
 
use App\Http\Controllers\Controller;
use App\Jobs\ProcessPodcast;
use App\Models\Podcast;
use Illuminate\Http\Request;
 
class PodcastController extends Controller
{
    /**
     * Store a new podcast.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $podcast = Podcast::create(...);
 
        // Create podcast...
 
        ProcessPodcast::dispatch($podcast)->onQueue('processing');
    }
}
```

或者直接在任务的构造方法中定义：

```
<?php
 
namespace App\Jobs;
 
 use Illuminate\Bus\Queueable;
 use Illuminate\Contracts\Queue\ShouldQueue;
 use Illuminate\Foundation\Bus\Dispatchable;
 use Illuminate\Queue\InteractsWithQueue;
 use Illuminate\Queue\SerializesModels;
 
class ProcessPodcast implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
 
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->onQueue('processing');
    }
}
```

### 分发到指定 Connection
如果应用和多个队列 connection 交互，可以使用 `onConnection` 来指定：

```
<?php
 
namespace App\Http\Controllers;
 
use App\Http\Controllers\Controller;
use App\Jobs\ProcessPodcast;
use App\Models\Podcast;
use Illuminate\Http\Request;
 
class PodcastController extends Controller
{
    /**
     * Store a new podcast.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $podcast = Podcast::create(...);
 
        // Create podcast...
 
        ProcessPodcast::dispatch($podcast)->onConnection('sqs');
    }
}
```

同样的是，也可以在构造方法中指定：

```
    public function __construct()
    {
        $this->onConnection('sqs');
    }
```



## Running The Queue Worker
Laravel 包括了一个 Artisan 命令可以用来开始一个队列的 worker，开始处理新的任务。

可以使用 `queue:work` 命令：

    php artisan queue:work

为了使得 `queue:work` 命令常驻后台，可以使用进程管理器 [Supervisor](https://laravel.com/docs/9.x/queues#supervisor-configuration)。

注意，queue workers 会将应用保存到内存中。这也就意味着代码的改动不会立即生效。在开发的过程中，注意重启 queue workers。

或者可以执行 `queue:listen` 命令

    php artisan queue:listen
 
该命令只建议在开发过程中使用。


## Supervisor 配置

安装 Supervisor

    sudo apt install supervisor

Supervisor 的配置在 `/etc/supervisor/conf.d` 目录中。可以创建 `laravel-worker.conf` 文件：

```
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /home/einverne/app.com/artisan queue:work sqs --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=forge
numprocs=8
redirect_stderr=true
stdout_logfile=/home/einverne/app.com/worker.log
stopwaitsecs=3600
```

然后启动 Supervisor

```
sudo supervisorctl reread
 
sudo supervisorctl update
 
sudo supervisorctl start laravel-worker:*
```



## 处理失败的任务

Laravel 提供了很多方式了定义任务可以重试的次数，一旦次数达到，任务就会被放到失败队列。




## Cleaning Up After Failed Jobs

当一个任务失败时，你可能希望执行一些操作，比如发送通知，或者更新一些数据，这个时候可以定义 `failed` 方法。

```
public function failed(Throwable $exception)
{
    // Send user notification of failure, etc...
}
```


## 发送邮件时使用队列
上一篇文章讲到了发送邮件，而发送邮件对于应用的响应时间有直接负面影响，生产环境最好的方式就是将发送邮件的过程放入队列中，在后台进行操作。

Laravel 有一个内置的队列，在发送邮件的时候直接使用 `queue` 方法：

```
Mail::to($request->user())
    ->cc($moreUsers)
    ->bcc($evenMoreUsers)
    ->queue(new OrderShipped($order));
```

在使用 queue 之前需要配置队列。


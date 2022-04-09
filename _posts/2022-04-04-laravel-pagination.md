---
layout: post
title: "Laravel 学习笔记：分页"
aliases: 
- "Laravel 学习笔记：分页"
tagline: ""
description: ""
category: laravel
tags: [ laravel, php, laravel-pagination,  ]
last_updated: 2022-04-09 01:29:04
create_time: 2022-04-02 09:44:05
---


Laravel 的分页实现集成了 Query Builder 和 Eloquent ORM，提供了一种非常方便的分页接口。


## 基础使用
最简单的方式就是使用 query builder 和 Eloquent query 的 `paginate` 方法，这个方法会自动处理请求的 limit 和 offset 参数。

默认情况下，当前页面的参数使用 `page` 表示。

所以在 Controller 中直接指定一页请求的条数即可：

```
<?php
 
namespace App\Http\Controllers;
 
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
 
class UserController extends Controller
{
    /**
     * Show all application users.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('user.index', [
            'users' => DB::table('users')->paginate(15)
        ]);
    }
}
```

默认情况下 `paginate` 方法会统计总条数，如果不需要，可以使用

```
$users = DB::table('users')->simplePaginate(15);
```

如果使用 Eloquent，可以直接在 Model 上调用：

    $users = User::paginate(15);


## 排序
如果要倒序来分页，有两种写法，一种是直接使用 DB：

    $ondata = DB::table('official_news')->orderBy('created_date', 'desc')->paginate(10);

另外一种就是使用 Model:

    $posts = Post::orderBy('id', 'desc')->paginate(10);


## Cursor 分页
除了使用 `offset` 方式分页，还可以使用游标：

```
$users = DB::table('users')->orderBy('id')->cursorPaginate(15);
```

这样每一次请求，会在分页请求中带上 `cursor` 参数：

```
http://localhost/users?cursor=eyJpZCI6MTUsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0
```

表示了下一页的开始。

- 对于大数据表，游标分页可以提供更好的性能，在使用 `order by` ，并且有索引的情况下
- 如果数据表经常写，offset 分页可能会跳过记录或者出现重复条数，如果有记录被频繁的增加，或删除的话


分页的一些问题和局限：

- `simplePaginate` 只能显示 `Next` 和 `Previous` 链接，无法支持展示页码
- 需要排序的列是唯一的，包含 null 的列无法支持排序


## 自定义分页 URLs
默认情况下，分页器产生的链接会匹配请求的 URI。`withPath` 方法允许自定义 URL。

如果想要产生的链接是 `http://example.com/admin/users?page=N` 需要传入 `/admin/users`

```
use App\Models\User;
 
Route::get('/users', function () {
    $users = User::paginate(15);
 
    $users->withPath('/admin/users');
 
    //
});
```

## 展示分页结果

当调用 `paginate` 方法时，会获得一个 `Illuminate\Pagination\LengthAwarePaginator` 实例，当调用 `simplePaginate` 方法时，会获得 `Illuminate\Pagination\Paginator`.

`cursorPaginate` 会获得 `Illuminate\Pagination\CursorPaginator`。

这些对象都提供了一些方法来获取结果集。

```
<div class="container">
    @foreach ($users as $user)
        {{ $user->name }}
    @endforeach
</div>
 
{{ $users->links() }}
```

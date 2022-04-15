---
layout: post
title: "Laravel 学习笔记：Model 之间关系"
aliases: 
- "Laravel 学习笔记：Model 之间关系"
tagline: ""
description: ""
category: [ laravel ]
tags: [ laravel, orm, laravel-orm, php ]
last_updated:
---

Laravel 使用的 Eloquent ORM 中的 Model 可以用一种非常易读的方式去定义 Model 和 Model 之间的关系。

## 1 对 1 关系
比如 User 和 Phone 都是一个 Model，要去表示用户和 Phone 的关系，可以：

```
<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class User extends Model
{
    /**
     * Get the phone associated with the user.
     */
    public function phone()
    {
        return $this->hasOne(Phone::class);
    }
}
```

在 User Model 中定义 `phone()` 方法，然后使用 `Illuminate\Database\Eloquent\Model` 中定义的 `hasOne()` 方法。

`hasOne()` 方法的第一个参数是 Model 的类名。一旦定义了就可以动态的直接通过用户 Model 去访问 Phone

    $phone = User::find(1)->phone;

上面的方式默认 Phone 这个 Model 中有一个 `user_id` 的外键。如果定义了其他名字，可以将外键名字传入第二个参数：

    return $this->hasOne(Phone::class, 'foreign_key');


### 定义一对一逆向关系
比如 Phone 属于用户：

```
<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class Phone extends Model
{
    /**
     * Get the user that owns the phone.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

Eloquent 会按照约定，假设 Phone model 中含有一个 `user_id` 列。


## 一对多关系
一对多关系通常用来定义一个 Model 是其他 Model 的父节点。比如一篇文章可嗯有无数的评论。

```
<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class Post extends Model
{
    /**
     * Get the comments for the blog post.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
```

注意 Eloquent 会自动决定外键的列名，按约定，Eloquent 会自动使用 parent model 的 snake case 名字然后加上 `_id` 作为外键。所以上面的例子中，Eloquent 会自动认为 Comment model 中有一个 `post_id` 的外键。

一旦定义了关系，就可以动态的获取：

```
use App\Models\Post;
 
$comments = Post::find(1)->comments;
 
foreach ($comments as $comment) {
    //
}
```

### 逆向一对多关系

使用 `belongsTo` 方法：

```
<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class Comment extends Model
{
    /**
     * Get the post that owns the comment.
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
```

获取：

```
use App\Models\Comment;
 
$comment = Comment::find(1);
 
return $comment->post->title;
```

## 多对多关系
最常见的多对多关系就是，用户-角色，用户可能有多重角色，同一个角色也会有不同的用户。另外一个比较常见的场景就是标签系统，一本书会有标签1，2，3，标签1也会包含多本书。

```
class User extends Model
{
    public function roles() {
        return $this->belongsToMany(
            Role:class,
            // pivot table
            'role_user',
            'user_id',
            'role_id'
        )
    }
}
```

Role 定义：

```
class Role extends Model {
    public function users() {
        return $this->belongsToMany(
            User:class,
            'role_user',
            'role_id',
            'user_id'
        )
    }
}
```

## 远程一对一
三个 Model 之间都是一对一关系，那么就可以建立远程一对一关系。


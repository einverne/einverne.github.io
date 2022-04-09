---
layout: post
title: "Laravel 学习笔记：文件上传"
aliases: 
- "Laravel 学习笔记：文件上传"
tagline: ""
description: ""
category: [ laravel ]
tags: [ laravel, file-upload ]
last_updated:
---

上传文件是一个网页应用必不可少的一部分，这里就记录一下 Laravel 中如何上传，并展示图片。

拆分开来主要分为如下几个步骤：

- 创建数据库 Model，用一个 Model 实体来保存上传图片的路径以及相关的 meta 信息
- 添加 Controller 层用来处理保存图片逻辑，以及持久化的过程
- 创建前端 Form 表单，并提交 POST 请求，提交图片

## 创建数据库 Model
首先使用 `artisan` 创建一个 Model 和 migration:

    php artisan make:model Photo -m

这行命令会创建一个数据库 Migration 文件，在 `database/migrations` 下：

然后修改 `migration` 文件，创建数据库 schema：

```
public function up()
{
    Schema::create('photos', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('path');
        $table->timestamps();
    });
}
```

上面的操作便是创建了一张表叫做 `photos`，其中包含了 `id`, `name`, `path` 和时间四列

执行数据库变更，会根据数据库的配置自动创建表：

    php artisan migrate

## Controller 上传逻辑
创建 route，打开 `web.php`:

```
Route::get('upload-image', [UploadImageController::class, 'index']);
Route::post('save', [UploadImageController::class, 'save']);
```

然后创建 Controller

    php artisan make:controller UploadImageController

内容：

```
<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\Image;
 
 
class UploadImageController extends Controller
{
    public function index()
    {
        return view('image');
    }
 
    public function save(Request $request)
    {
         
        $validatedData = $request->validate([
         'image' => 'required|image|mimes:jpg,png,jpeg,gif,svg|max:2048',
 
        ]);
 
        $name = $request->file('image')->getClientOriginalName();
 
        $path = $request->file('image')->store('public/images');
 
 
        $save = new Photo;
 
        $save->name = $name;
        $save->path = $path;
 
        $save->save();
 
        return redirect('upload-image')->with('status', 'Image Has been uploaded');
 
    }
}
```

`store` 方法就把图片保存到了 `images` 目录中。

为了安全起见，可以修改一下文件路径：

```
$filename= date('YmdHi').$file->getClientOriginalName();
$file-> move(public_path('public/Image'), $filename);
```


### Blade View

在 `resources/views` 下创建 `image.blade.php`，其中最重要的 form 部分：

```
<div class="card-body">
    <form method="POST" enctype="multipart/form-data" id="upload-image" action="{{ url('save') }}" >

        <div class="row">

            <div class="col-md-12">
                <div class="form-group">
                    <input type="file" name="image" placeholder="Choose image" id="image">
                @error('image')
                    <div class="alert alert-danger mt-1 mb-1">{{ $message }}</div>
                @enderror
                </div>
            </div>

            <div class="col-md-12">
                <button type="submit" class="btn btn-primary" id="submit">Submit</button>
            </div>
        </div>     
    </form>

</div>
```




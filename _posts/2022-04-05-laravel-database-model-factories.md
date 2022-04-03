---
layout: post
title: "Laravel 学习笔记：Model Factoris 批量创建假数据"
aliases: 
- "Laravel 学习笔记：Model Factoris 批量创建假数据"
tagline: ""
description: ""
category: laravel
tags: [ laravel, database, fake ]
last_updated:
---


在开发环节要测试的时候，如果想要在数据库中批量插入一些假数据，这个时候就可以使用 `model factories`。


在 `database/factories/` 目录下面默认定义了一个 `UserFactory.php`

```
namespace Database\Factories;
 
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
 
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
        ];
    }
}
```

可以看到在这个类中给 User 的每一个字段都设置了一个 [faker](https://github.com/FakerPHP/Faker) 方法。


## 产生 Factories
通过命令：

    php artisan make:factory UserFactory

这个时候在 `database/factories` 下面就会有一个 `UserFactory`，你需要按照 faker 的方式给 Model 每一个自定义的字段都加上 fake 方式。

## tinker
然后执行 tinker:

    php artisan tinker
    
进入交互式命令行之后：

    use App\Models\User;
    User::factory(10)->create();

执行完成之后就会往数据库中插入 10 条假数据。


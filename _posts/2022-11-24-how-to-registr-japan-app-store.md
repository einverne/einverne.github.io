---
layout: post
title: "如何注册日区 Apple ID 以及初次登录日区 App Store"
aliases:
- "如何注册日区 Apple ID 以及初次登录日区 App Store"
tagline: ""
description: ""
category: 经验总结
tags: [ apple-id, apple-store, app-store, japan, ]
create_time: 2022-11-25 04:13:53
last_updated: 2022-11-25 05:46:24
---

之前一直使用美区的账号，但突然发现有一些 App  在美区也没有，比如去日本经常需要用到的「乗換案内」就搜不到，美区里面尽是一些冒牌的，还穿插各种广告的应用，还有很多日本本地的一些应用也几乎都没有上架美区。

比如：

- 美食点评的「食べログ」 [官网](https://tabelog.com/)
- 闲置物品出售的「ジモティー」 [官网](https://jmty.jp/)
- 冲洗照片的 ノハナ(nohana) [官网](https://nohana.jp/)
- 等等

## 注册日区 Apple ID

1. 进入日本苹果官方主页 <https://www.apple.com/jp/> ，在页面下方找到 「Apple ID の管理」。
2. 进入新页面之后，找到 「** [Apple ID を作成](https://appleid.apple.com/account) **」
3. 接下来就是开始填写账户的具体信息，包括姓名，出生年月，邮箱，密码等。
    1. 这个地方可以教大家一个 Gmail 的技巧，比如你的 Gmail 账号是 `demo@gmail.com` ，那么 `demo+jp@gmail.com`， `demo+hk@gmail.com` 都是你的账号，Gmail 是会忽略 `+` 后面的内容的，另外还有一个小技巧是 Gmail 用户名中的点都是会被忽略的，所以 `de.mo@gmail.com`，`d.emo@gmail.com` 同样也是你的账号 。那么这就非常方便了，我就用 `demo+jp@gmail.com` 来注册日区的账号就行了。
    2. 密码直接用 Bitwarden 生成一个复杂随机密码
    3. 电话号码这里一定要注意填写你能收到验证码的手机，Google Voice 的号码这里也是可以的
    4. 下面两个可选项「お知らせ」，「App、音楽、テレビ番組など」可以不用勾选
4. 然后点击「次に進む」，猜意思也能知道是「Next」的意思

经过以上的步骤就注册了一个没有绑定支付方式的 Apple ID 了。以后的步骤就是在 iPhone 上登录这个日区账号，并完成最后的注册。

- 在 iPhone 上的设置（Settings）中，点击最上方的头像，然后找到其中的「Media & Purchases」，记住这里一定是点击这个蓝色中间带 A 字的选项，然后点击「Sign Out」
- 等登出之后，再点击，此时会问是否要以原来手机的账户登录 App Store，这里一定要选择「不是」
- 然后再使用日区的用户名和密码登录，此时手机会收到二步验证的验证码
- 下一步之后，为了保证操作步骤没有问题，可以先使用 [代理](https://board.gtk.pw) ，使用日本的 IP，然后 App Store 会弹出当前大致意思是当前 Apple ID 还没有使用过 App Store，需要完善一些一些信息，从上到下依次是：
    - 首先选择的是支付方式，需要选择 None 或者 ない
    - 然后填写姓、名，正常情况下填写英文名就可以了，如果要求一定要使用假名的名字，可以到 [这个网站](https://dokochina.com/katakana.php) 生成一下自己中文名的假名名字
    - 地址的话，可以到 Googe Map 中选择一个自己喜欢的地方，同样城市，邮编，电话等等，就按照个人情况填写即可，我在中间遇到的一个问题是，我复制了日语的街道名字，但是我的手机全局设置的是英文的系统，然后校验说我有非法字符，无奈我只能把地址也全用英文转写了一遍，这里可以参考 Google Map。
    - 最后点击右上方的 Next，就完成了全部的注册。

登录成功之后就会发现 App Store 中的搜索关键字也变成日文了，热门推荐应用也变了就表示可以了。

下一篇再整理一下在日本常用的 App 吧。

---
layout: post
title: "2025 苹果开发者帐号注册记录"
aliases:
- "2025 苹果开发者帐号注册记录"
tagline: ""
description: ""
category: 经验总结
tags: [ apple, apple-developer, developer-account, apple-account, ios, aki, aki-dict, macos, ]
create_time: 2025-02-14 16:06:31
last_updated: 2025-02-14 16:06:31
dg-home: false
dg-publish: false
---

最近开发了一款 Aki 日语词典想要上架 iOS，但是发现 Apple 开发者帐号注册却是比较麻烦，主要是我平时使用的 Apple ID 不在国区，手机一直使用的是美区帐号，还有一个日区的帐号用来下载日区的应用，所以导致 Apple ID 和绑定的手机号都非常混乱，我本来想注册美区的帐号，因为本来就是手机登录的帐号，但是过不去认证，所以想要去注册国区的帐号，可是我的 macOS 和手机没有一个有国区帐号的登录，利用网页版本注册的时候也发生了不明错误（We are unable to process your request. An unknown error occurred.），根本没有提供任何有效的信息，最后尝试用日区的 Apple 帐号注册，可是下载了 Developer 应用，登录日区帐号，Enroll 按钮显示灰色！这种错误也是第一次见到，不过好在这一次，我可以通过网页来联络客服，等了两天之后从客服那边获得了一点有效信息。

> Make sure all account information is valid by reviewing "About trusted phone number and trusted devices" in Two-factor authentication for Apple Account.
> Make sure the two-digit region code of your trusted phone number matches the country or region associated with your Apple Account. You can update your trusted phone number at appleid.apple.com in the security section.

首先要在二步验证中添加的手机号和帐号所在地区一致，也就是说一个日区的帐号，必须绑定一个 +81 的手机号作为二步验证，另外还需要开启信任的手机和设备。我查看了一下发现绑定了 +1 的手机号，显然不匹配，所以我只能在 macOS 上尝试添加 +81 的手机号，然后发现新设备登录的 Apple 帐号，需要等待好几天之后才能更新用户信息，然后还尝试用之前登录过的手机再登录一下，发现依然还需要等待一个礼拜才能更新手机号。至此我能尝试的所有方法都已经尝试完毕，依然还没有步入注册流程。

既然安全起见，需要等待一段时间，那么就记录一下这两天收集到的相关材料。

## iOS 上架条件

iOS 应用要上架 App Store 必须满足两个条件

- 订阅 Apple Developer Program（苹果开发者帐号）
- 如果要在中国上架，还需要进行 App 备案

以上两个步骤只与上架有关系，并不会阻碍开发，所以强烈建议等应用基本开发完成，准备上线的时候再注册和订阅，因为 Apple 是按照年收费的。提交应用给 Apple 都是在 App Store Connect 这个平台上。

## 本地调试

Xcode 不使用开发者账号，可以使用 Apple ID 登录安装调试。如果要测试 Flutter 应用，也是可以不订阅 Apple Developer Program 开发调试的。

在 Xcode 中进行无开发者账号的真机调试，可通过 Apple ID 创建临时证书实现。

打开 Xcode > Preferences > Accounts 点击左下角"+"添加普通 Apple ID 账号

生成调试证书 选中添加的 Apple ID，点击"Manage Certificates"， 点击"+"选择 iOS Development 创建临时证书

## 注意点

- 苹果个人开发者账号，只能实名认证 1 个
- 开发者帐号是和地区绑定的，实名认证的时候也是和地区相关的，比如中国区需要提交身份证，外区也需要提交当地的身份证/护照等证件
- 不要违反苹果的开发者条款，不要发布马甲包，会封禁
- 如果遇到误封，可以邮件或电话申诉。
- 应用提交之后，不要轻易修改名字，会被当作马甲号
- 不要个人账号和企业账号混用

可以用国区账号购买开发者，然后添加美区 ID 为 Admin 账号

## 账户类别

苹果开发者账号主要分成三种

- 个人，需要身份证，App Store 显示为个人以及实名，最多可关联 100 台测试机，申请简单，快速下号，需实名认证
- 公司，适用于公司，可添加多个管理角色，App Store 显示公司名称，申请相对复杂，需要申请全球[[D-U-N-S 编码|邓氏编码]]，下号时间慢，需要办理人实名以及邓白式认证
- 企业，适用于公司，公司大规模内测专用权限账号，需先申请称为公司开发者账号，之后才可以继续申请企业级的内测账号，只适用于公司内部，无设备数量限制。该类证书被滥用，2018 年起 99% 的大陆小微企业都无法获批

![k4PXUxOLiq](https://pic.einverne.info/images/k4PXUxOLiq.png)

公司和企业都必须邓白氏码。

企业号不能发应用到 App Store，是内部发 App 用的。个人可以转成公司，App 也可以在账号间转移。

注意点

- 单个设备只注册单个账号，否则会出现无法继续下一步的错误（设备只能使用一次，无论成功与否）
- 注册手机号只能与一个苹果开发者账号有关联，否则会出现联系我们以继续流程，咨询过后给出的解决方案是使用与这个手机号之前关联的开发者账号，不支持继续注册（注册手机号必须）
- 一个身份信息只能对应一个开发者账号（无论成功与否）
- 每次注册尽量使用隐身或者无痕（未证实有关联）

## 查看苹果开发者账号属于哪个国家

对于不同国家的开发者，审核政策有些区别。但总体都是相差不大的。如果要查看 可以通过登录苹果账号 https://account.apple.com/ 在页面中查看。

注册开发者账号之前提前确认当前的账号属于哪个地区。

## 税务

使用美国的 Apple 账号注册的开发者账号 99 美元每年，美国开发者账号支付的时候是有税的，免税州 99 美元。

日区的开发者帐号 12800 日元。

## 注册流程

可以登录网页，苹果开发者中心（https://developer.apple.com）进行[注册](https://developer.apple.com/programs/enroll)，也可以下载苹果官方的 Developer 应用来注册，可以在 macOS 或者 iOS 的应用商店找到。确保自己的帐号没有问题，二步验证中的手机号和帐号地区一致，手机和设备的地区也和帐号一致。

### 网页注册

选择账户类别

![k4PXUxOLiq](https://pic.einverne.info/images/k4PXUxOLiq.png)

阅读接受条款

![I0niBo7Bnx](https://pic.einverne.info/images/I0niBo7Bnx.png)

### 在 macOS 上注册

打开 Developer 找到帐号，Enroll

![Vy6LvOTGd2](https://pic.einverne.info/images/Vy6LvOTGd2.png)

## 问题

点击到最后一步是发生错误

> We are unable to process your request.
> An unknown error occurred.

未解

> Enrollment through the Apple Developer app is not available for this Apple ID

确认 Apple ID 账号地区与设备设置地区完全一致。检查 iCloud 账户绑定的电话号码国家代码是否匹配当前所在国家。

注册其他地区的开发者并上架销售需要拥有当地的合法工作的身份证明或工作签证，比如中国留学生以 F1 签证去美国留学，虽然拥有身份可以注册开发者账号，但是上架软件就需要税号信息。

## TestFlight 内测机制

- 通过邮箱或 App 兑换码
- 官方审核，提供下载链接，比较慢

### TestFlight 发布流程

- 官方开发者账号，生成各种证书，App 信息
- 本地生成证书请求文件
- 编译 iOS `flutter build ios`
- Xcode 更改一些配置，打包，签名，上传
- 成功之后，确认「国家协议」
- App Store Connect 添加内测账号，发送邀请链接

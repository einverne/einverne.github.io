---
layout: post
title: "iPhone 设置及Review"
tagline: ""
description: ""
category: 经验总结
tags: [iphone, ios, photos, review, Google]
last_updated: 
---

作为一个坚定的 Android 使用者，最近想要尝试一下 iOS，只有尝试过之后才有对比，有对比才能比较出好坏。于是乎记录下从一个 Android 重度使用者，转用 iOS 遇到的一些问题和解决方案。以下行文的结构按照提出问题，寻求解决的过程及最后的解决方案来规划。

## 从Android手机恢复通讯录，短信，通话记录
通过设置 Google 账号同步联系人，但是短信和通话记录暂时无法找到方法备份恢复。幸而我的所有通讯录都有云备份，轻松的通过账号登陆就可以完成通讯录的迁移，但是因为短信和通话记录相对不是太重要，所以暂时还不需要迁移过去。并且 Android 端的短信和通话记录通过 SMS Backup+ 备份到了 Gmail 和 Google Calendar，所以也不存在丢失问题。

## Apple ID 不同国家切换
直接使用苹果AppleId官网，可以轻松注册美区账号。在手机首次登陆时，选择 none，不使用信用卡登陆即可。原本有一个美区的账号的，但是手贱转回了国内，无奈只能再注册一个了。

而苹果 iTunes 账号分区和 Google Play Store 分区的困难程度也还是差不多的，但是明显 iOS 上切换账号起来比较麻烦。

## App 迁移
最重要的部分都在于此，但是因为平时使用的应用，基本都是跨平台的，因此也没有遇上什么比较困难的问题，登陆应用内的账号，云同步一下数据基本就完事了。这里要分享一些 must have app，基本都是跨平台的

- ~~LastPass ，所有的密码~~ 迁移到了 Bitwarden
- Google Photos，所有的 Photos
- ~~Dropbox，所有的文档~~ 迁移到了 [[Syncthing]], NextCloud
- ~~网易云音乐，所有的音乐~~ 自建 [[Plex Server]]，迁移到了 [[Plexamp]]
- ~~WizNote，所有的笔记~~ 迁移到了 [[Obsidian]]

所有的这些，我登陆一下账号，我想要的数据都来了。而剩下的其他社交类，工具类，修图类基本都能找到。

## 更改 Home 键功能
对于iPhone 的Home 键，我实在是无法习惯，可能是我被 Android 的 back 键和多任务切换的 recent 键惯坏了。但在 iOS 上返回操作和多任务切换在我看来是非常费劲的一件事情。iOS 的返回操作在我努力使用一天之后，大部分的情况下可以使用“从屏幕左边缘向右滑动“来进行返回操作，但对于我这样一个右手使用者来说，单手操作非常非常吃力，并且有的时候，比如在照片浏览的时候这样的操作却又是无用的。而对于弹出窗口，完成返回的操作按钮可能出现在左边，也可能出现在右边，这让返回操作异常困难，经常需要双手或者异常困难的手势去完成一个返回或者完成的操作。

比如下面的几张截图，需要完成一个返回或者完成的操作，左边，右边，滑动都出现了。并且当从一个应用跳转到另外一个应用的时候，你会注意到状态栏多出一个返回来，而那个返回”竟然是可点击“的，可以用来返回上一个应用。这对于我这个 Android 重度使用者来说完全无法适应，原本使用 Back 键能够完成的事情，现在需要我选择三四种方式，还需要分不同场合选择使用。

<img src="https://lh4.googleusercontent.com/-k7LTODJdIcI/WFAQbq1d4ZI/AAAAAAABHbc/KnHT364EljIMst5RNNjoJGKD67-zmSKwQCL0B/w506-h900-no/iphone_back_1.jpg" width="300px" alt="iphone"/>

<img src="https://lh4.googleusercontent.com/-_9CYm2DdnyU/WFAQbpa9V6I/AAAAAAABHbc/mUuzEXMTN4cev9nHqXMyvH00XgBidrhygCL0B/w506-h900-no/iphone_back_2.jpg" width="300px" alt="iphone"/>

<img src="https://lh6.googleusercontent.com/-y9sIdj7XszY/WFAQbqIlBMI/AAAAAAABHbc/M95ldBUNfxQjZ9a823wIED2sKFj_UcExwCL0B/w506-h900-no/iphone_back_3.jpg" width="300px" alt="iphone"/>

<img src="https://lh6.googleusercontent.com/-7c4drqCv8SU/WFAQbs2SBpI/AAAAAAABHbc/OnmlqdzLwJ8rAM4UgM4fFhM2kUL9RTB7wCL0B/w506-h900-no/iphone_back_4.jpg" width="300px" alt="iphone"/>


再说回到 Home 键本身， Home 键有如下的操作方式：

- Tap，轻触不按下，识别指纹，或者解锁手机
- Double Tap，连触，将屏幕拉下，适用于单手操作
- Press，按下，返回主界面，类似于 Android Home 键
- Double Press，双击，切换多任务，类似于Android 多任务键
- Long Press，开启 Siri
- Triple Press 可以在 accessibility 中开启。

这些操作在 Android 系统上分别为四个按键，而在 iOS 端全部糅合到一个按键中，难怪我实在无法适应 Home 键。当然 Android 的 Back 键在推出的时候，也有很多人，甚至开发者也会产生疑惑，甚至开发文档有整整一页说明返回按键的流程，但是依然不妨碍用户使用它。甚至在很早的时候我在看到 Android 和 Chrome 中按钮设置的时候，就感觉到 Android 和 Chrome 的按钮设置太像了。Chrome 很简洁，保留的按钮并不多，但是返回按钮，主页按钮，以及标签页都在非常重要的位置，而这三个按钮也正是 Android 得以保留的三个按钮。

而 Android 的这个按钮让用户得以在应用中跳转而不会迷失，我甚至给举例，比如我在 Google+ 中看到有一个 YouTube 视频，我点开会自动跳转到 YouTube App 播放该视频，然后我看到说明区域有链接，我点击查看详情，跳转到 Chrome App，在查看文章的时候，我看到有活动申请，于是点击邮箱地址跳转到 Gmail App，写完邮件，我甚至可以使用 back -> Chrome -> back -> YouTube -> back -> Google+，来返回到原来浏览的地方。而这一点我是无法在 iOS 上完成的，也不敢想象，我要多累才能回去。当然那个例子是一个极端的情况，但是日常中我会经常需要跳转。

## 总结
总之在最后，iOS 和 Android 各有各的优劣，而最近几年的更新也是相互借鉴，Android 借鉴 iOS 的权限管理， iOS 借鉴 Android 的通知系统，而对于我们消费者来说，两者只要适合我们，为我们所用，都是很好的 Smart Phone。

而下面是几点 iOS 让我刚到非常惊喜的

### Smooth and faster
界面和整体非常流畅，动画几乎没有卡顿，但也有遇到在 Setting 界面卡住不动，在 App Store 列表卡住的情况。但是总体来说较 Android 而言，确实非常顺滑。并且一直被提及的跟手程度，其实也是稍微有优势的，只是近年来差距越来越小了。

### 通知接受很快
这也是非常赞的一点，这当然和 Apple 收紧通知发送有关，PC，iOS，Android 三端相同网络环境，经常是 iOS PC 受到消息很久之后 Android 才能受到消息。

### Siri VS Google Now
这一点确实令人比较惊喜， Siri 在中文支持上竟然还可以，可能 Apple 给中文适配的比较多吧，同时功能也很稳定，不像 Google Now，有的时候就不理我了。


---
layout: post
title: "Kindle 使用小技巧及常见问题"
tagline: "Kindle is not just a e-reader, it is center of knowledge"
description: "some tips I concluded during my use"
category: 经验总结
tags: [kindle, book, 阅读 ,  amazon, ebook, ]
last_updated:
---

整理 Evernote 笔记的时候偶然看到这篇文章，总结自己使用 Kindle 一年来的小小经验，以及一些 Tips。

## 注册 Kindle 邮箱
这个功能非常实用，不然能够节省连接数据线的时间，更重要的是这个活用这个邮箱能够自动化完成很多事情，可是遗憾的事，很多人并不知道这个福利。所以建议在拿到手之后的第一件事情就是查看这个邮箱，设置中 Send-to-KindleE-mail 中查看。

Kindle 可以享受的两个最容易被忽略的功能是：

- 在线文档存储，亚马逊为每位用户提供至少 5G 的云存储空间
- 在线文档格式转换，支持格式包括

    - Microsoft Word (.DOC, .DOCX)
    - HTML (.HTML, .HTM)
    - RTF (.RTF)
    - JPEG (.JPEG, .JPG)
    - Kindle Format (.MOBI, .AZW)
    - GIF (.GIF)
    - PNG (.PNG)
    - BMP (.BMP)
    - PDF (.PDF)
    - 附件大小不超过 50MB（压缩之前）
    - 附件中文档个数在 25 个以内
    - Kindle.com 收件人个数不得超过 15 个
    - 文档默认会保存在云端
    - 如果 60 天用户都没有下载，则会删除上传文件

如果有 WiFi 或 3G 的话，注册 Kindle 可以在 Kindle 设备上完成，打开 WiFi（Home-> Menu -> Turn Wireless On），然后在 Home -> Menu -> Settings-> Registration 中，按照提示完成即可。没有 WiFi 或 3G 的话，则享受不了这两个服务。

要使用这两个服务，需要两步。首先，要知道自己的 Kindle 邮件地址（姓名 @kindle.com），可以在 Home-> Menu-> Settings 的第二页里看到，在 Send-to-Kindle E-mail 选项里面。但是，为了保护用户的私有空间不被别人用垃圾填满，亚马逊还要求使用已经被用户许可的邮箱地址发往此邮箱，否则就会拒绝接收。许可邮箱的方法是：

- 先到[管理 Kinlde](https://www.amazon.com/myk) 页面，需要使用注册 Kindle 的账号登陆
- 在左侧导航栏里单击 [Personal Document Settings](https://www.amazon.com/gp/digital/fiona/manage?ie=UTF8&ref_=kinw_myk_surl_1&#pdocSettings)
- 在右侧 Approved Personal Document E-mail List 标题的最后单击 Add a new approvede-mail address
- 输入 email 地址后单击 Add Address 即可，可以添加多个邮箱

完成以上操作后，就可以享受这两个服务了，使用添加到许可列表的邮箱，以附件形式发送文档到自己的 Kindle 邮件地址（name@kindle.com），就可以把文档存储到云端。Kindle 在线时就会自动下载云端文件。如果想将文档转换为 Kindle 内置格式（mobi），需要在邮件标题内注明 convert（即邮件标题写“convert”即可），亚马逊就会为您转换为 Kindle 内置文档格式并发送到你的 Kindle 设备，阅读非常方便，转换过程可能会比较慢。

单击左侧导航栏内的 [Personal Documents](https://www.amazon.com/gp/digital/fiona/manage?ie=UTF8&amp;ref_=kinw_myk_surl_1&amp;#PersonalDocuments) 可以管理云端文件。


## 使用剪贴板功能做笔记
使用过程中，读书最重要的就是记录了，阅读永远是别人的东西，如果没有经过大脑转变成自己的内容，那永远只是存在书本上。而 Kindle 上做笔记也是非常容易的，并且数字化让一切都能够被检索并标注，Kindle 让这个过程更加方便了。在 Kindle 中长按文字选中之后会弹出标注，笔记等几个选项，而所有这些操作的内容都会被保存到 Kindle 设备上”documents”里名叫“My Clippings.txt” 的文件中。这个文件以一定的格式记录所有的笔记内容，直接查看非常不方便，于是就有人做了这样的一个工具。

地址：<https://www.clippings.io/>

将笔记，标注导出的网站。从 Kindle 中找到 clippings 文件之后上传到该网站，就能够非常直观的查看所有笔记。

## 关闭 Kindle 屏保和主页界面的特惠信息
因为我使用的是美亚账号，自动出现的特惠信息大多数是我并不关心的，因此

    > 设置 -> 设备选项 -> 个性化您的 Kindle -> 高级选项 -> 特惠

关闭即可。如果无法关闭，我记得当时我就是联系了亚马逊客服才关闭的：

联系亚马逊客服：https://www.amazon.cn/gp/help/customer/contact-us

## 禁止 Kindle 自动锁屏
正常情况下经过一段时间，Kindle 会自动锁屏，锁屏默认情况下是一些 Kindle 书店的推广，如果要禁止自动锁屏，可以在搜索框中输入

    ~ds

是 `disable screensaver` 的缩写。这个操作在重启之后就会失效。

## Kindle 无法连接 WiFi
Kindle 不能连接 WiFi 的三个原因，虽然在没办法的情况下以下三个方法或许有用，但是大部分的情况其实就是 GFW 屏蔽了 Kindle 联网验证的地址，其实和 Android 在检测 WiFi 时屏蔽了 Google 服务器出现的感叹号一样，系统向一个 URL 请求，没有收到回复自然认为没有成功连接到互联网，于是就报错，所以在尝试以下三种方式之前，请确保翻墙状态。

1. 路由器频段问题

这个问题实际上手机也有。有一阵子我手机也连不上我哥家的 WiFi，后来通过网络搜索才知道频段问题。那时候是说频段超过 11 手机就无法连接 WiFi，后来我把频段改小之后就解决问题了。而一般能用手机连接 WiFi，Kindle 不能连接的一般不会是这个问题。

如何改变频段，Google 之。基本现在这个年代，看一下无线路由器的说明书就会设置的。

技术资料见：

<http://en.wikipedia.org/wiki/List_of_WLAN_channels>

> In the USA, 802.11 operation in the channels 12 and 13 is actually allowed under low powered conditions. The 2.4 GHz Part 15 band in the US allows spread-spectrum operation as long as the 50-dB bandwidth of the signal is within the range of 2400–2483.5 MHz which wholly encompasses both channels 12 and 13. A Federal Communications Commission (FCC) document clarifies that only channel 14 is forbidden and furthermore low-power transmitters with low-gain antennas may legally operate in channels 12 and 13.However, channels 12 and 13 are not normally used in order to avoid any potential interference in the adjacent restricted frequency band, 2483.5–2500 MHz, which is subject to strict emission limits set out in 47 CFR §15.205.

问题也许就是这样产生的：你笔记本所能搜到的 WIFI 信号来自正工作于 12/13/14 频段的路由器，因此你的 Kindle 搜不到无线信号。

为什么路由器工作于 12/13/14 频段呢？基于抗干扰的理由，人为指定的可能性很小，然而在无线路由器的设置中（至少是家用），频段这一项可以设为“自动选择”，这样每次路由器重启都回按照自己的算法随意选择一个频段，也许刚好就选在了“12/13/14”上。

这或许也是 WIFI 连网不稳定现象的根源，某些 Kindle 连不上无线网络，而折腾下路由器重启后，Kindle 又可以连网了。

经 GOOGLE 搜索，发现欧洲人也有类似的问题。见 http://www.mobileread.com/forums/showthread.php?t=100081

由此对 Kindle 连网问题做个小小的推测，如果真的能解决问题，请大家多转给需要的人

2. DHCP 服务器地址池问题

听闻 DHCP 服务器是让路由器可以自动分配 ip 的东西，但是把地址池『个人理解为分配的 ip 的范围』如果在 192.168.1.100 以上，Kindle 就不能连接 WiFi『当然这是 Kindle 的问题，因为手机电脑都可以连接的，不过我不知道 Kindle 自身要怎么改，或许不能改，又或许可以通过在 Kindle 上设置静态 IP？]

其实解决这个问题有个更方便的方法，既然 Kindle 改不了，咱们就改下路由器的 DHCP 服务器地址池呗，把开始地址改为 192.168.1.2，结束地址改成 192.168.1.99『其实也不用固定这样，只要最后一个在 1-100 之间就可以了！

3. 接下来就是运营商问题了

前两个问题我都解决后，我发现还是有时候会连接不上 WiFi，于是在又查了查，发现了一个方法，为什么这个方法能解决我不知道为什么，但是真的有效！！！

在 pc 上新建一个新文件，名为`WiFi_NO_NET_PROBE`，同时把后缀名删掉，让它变成一个无格式文件。Kindle 连接 pc，把新建的文件放进 kindke 的根目录，断开 Kindle 之后重启 Kindle。

## 关于充电
充电方法：Kindle 可以用数据线连接电脑充电。也可以用数据线连接充电头，在插座上充电。**Kindle 电量不足时，灯是橙黄色的，充满以后灯会变成绿色。**

充电时长：每次充电时间大约是 2-3 小时。首次充电充满即可，不需要充很长时间，有人充了一个晚上，十几个小时，然后就不能开机了，送修说主板电路烧了。平时使用时 Kindle 还剩差不多百分之二十的时候开始充电，对 Kindle 最好。因为 Kindle 很长时间不用不充电，可能会出现缺电现象，造成机器假死。充电的时候最好不要看书，不要使用 kindle，不然 kindle 电池不耐用。

## 更换字体
Kindle 自定义字体仅支持 OpenType（OTF）和 TrueType（TTF）这两种字体格式

字体文件复制到 Kindle 根目录下的“fonts”文件夹中

个人比较喜欢的一些用于阅读的字体，汉字作为方块字还是非常有美感的，通常情况下会选择楷书（在默认无法更换字体的情况下），而如果支持更换字体则会选择**方正北魏楷书**，而如果是宋体的话会选择，方正标雅宋体。

## 导入字典
Kindle 的字典一般都是 mobi 格式，需要注意。至于字典看个人喜好，这可以单独写另外一篇文章了，我个人一般用牛津和朗文，加上一部 GitHub 开源的收录词条很多的开源字典。

Kindle 字典下载到电脑本地后，导入 Kindle 字典的详细步骤：

- 连接数据线，进入到 documents 文件夹，打开 documents 文件夹后，找到 dictionaries 文件夹，并打开
- 将电脑本地的 Kindle 字典拖入到 dictionares 文件夹内
- 最后，安全退出 kindle 盘符

## 截屏方法
Kindle 的截屏方法，不同 Kindle 不同，我只有 Paperwhite，所以：Kindle Paperwhite 截屏：先点上面出菜单，再同时左上 + 右下。屏幕会闪烁一下，说明截图成功。

截下来的图片会保持在 documents 这个文件夹里面，可以连接电脑拷贝出来。

以下未验证：
Kindle3、Kindle DXG，截屏是同时按住：Alt+Shift+G。屏幕会闪一下，截屏就成功了。
Kindle4、Kindle5 截屏：同时按住键盘键和菜单键，屏幕会闪一下，截屏就成功了。
Kindle touch 截屏：按住 home 键，点屏幕，等几秒，反正 5 秒肯定可以了，松开 Home。


## 电子书格式

### mobi, azw
mobi 和 azw 格式的推手主要是 Amazon，这两种电子书格式的发展很大程度上依靠 Amazon 这个巨大的内容提供商及其电子书阅读器 Kindle 的流行普及。它们同属亚马逊的私有格式，没有本质的区别，可以简单的这样理解，mobi 是比较老的一种格式，而 azw 只是 mobi 的另一种形式而已，也可以理解为 mobi 加了个壳，亚马逊利用它对电子书做 DRM 版权保护。

目前市面上的 mobi 文件大部分是来自两种途径：epub、pdf 或者 txt 转换成的 mobi，从 Amazon 商店流出来的 mobi。前者没什么好说的，后者要么是 Amazon 官方制作，要么就是自出版作者通过 KDP (Kindle Direct Publishing，作者可以绕过出版社直接在 Amazon 上发售电子书 ) 平台发布，通过 KDP 平台发布时，作者只需要上传 Word 文档，其他的事情也是 Amazon 官方来做，从而保证了，mobi 文件的规范程度。

### azw3
azw3 的本质是 KF8，是随着 2011 年 Amazon 推出 Kindle Fire 平板时一起推出的。它填补了 Mobi 对于复杂排版支持的缺陷，支持很多 HTML5（目前尚不支持 HTML5 的视频和音频标签）和 CSS3 的语法，这就大大改善了原来 mobi 或 azw 内容排版上的一些缺陷，单纯从读者的角度来讲，是不输 epub 格式的。目前从 Amazon 购买的书，大部分已经是 azw3 格式了，而以前主流的 mobi 格式则越来越少，它正逐渐取代 mobi 成为 Kindle 电子书的主流格式。

### epub
下面是维基百科对 epub 的一段定义：

> EPUB（Electronic Publication 的缩写，电子出版）是一种电子图书标准，由国际数字出版论坛（IDPF）提出；其中包括 3 种文件格式标准（文件的附文件名为.epub），这个格式已取代了先前的 Open eBook 开放电子书标准。

epub 格式对于复杂的排版，图表，公式等元素的兼容性比 mobi 格式好很多，在脚本，公式，矢量图形的支持方面也强过 mobi 格式，现阶段 epub 格式的优势体现在图文混排、图片嵌入字体等，未来可预测的优势是 epub 格式对于声音，影像等多媒体内容互动的支持上。

epub 格式是开放标准，所以在开发工具上也会有更大的选择，像 Sigil、Calibre、Jutoh 等软件都可以让用户自助制作 epub 格式电子书，但因为良莠不齐的制作也导致一个问题：大量的 epub 文件其实是不符合标准，无法保证在所有支持 epub 的硬件和软件上都可以顺利阅读，这就和 iOS 系统和 Android 系统的区别有些相似。

## 找书技巧
Kindle 使用官方市场必然是件很不错的选择，但是其实有些方式来的更加方便，并且也能弥补官方市场书记不全的弊端。

### Kindle10000

微信书籍推送：Kindle10000  注：该微信号已经不再能够推送书籍

自用上这个服务，Kindle 就活了起来，想起想看的书名，找到公众号，搜索推送，即使 Kindle 不在身边，下一次联网再同步即可。这个公众号在他们的简洁上这么写着：“一个被书籍改变命运的程序员领着志愿者做的免费项目”。而他的使用也非常简单，绑定 Kindle 邮箱之后，在聊天框输入书名查找，然后找到想要的书，点一下推送搞定，资源丰富。这个比我之前在一些 Kindle 资源网站上找或者百度搜方便多了。

### Kindle 伴侣

地址：<http://kindlefere.com>

Kindle 伴侣，这是我至今也还一直订阅的少数 Kindle 相关网站之一，它的《每周一书》坚持更新也是很值得称赞的。

### Kindle 饭

地址：<http://www.kindlefan.cn/>

Kindle 饭，有很多 Kindle 使用的文章，技巧，相关工具，很棒的网站，建议订阅。

160604 更新，这个网站竟然不存在了，我只能从 Web Archive 找找他们存在的痕迹，但真的感谢他们曾经的文字。

### 周读

地址：<http://www.ireadweek.com/index.php/Index/index.html>

都是百度网盘的资源

### 漫画

地址：<http://www.pixvol.com/>

推送漫画到 Kindle，还是非常全的

一下都是一些资源网站：

- http://readfree.me/ 一个图书分享网站
- <https://book.einverne.info> 我自己写的图书分享网站
- https://www.mlook.mobi/ 精校电子书，资源下载
- http://zaoshu.so/ 枣书，付费电子书价格对比，可以获取各大网站提供的免费公共电子书
- https://www.cnepub.com/ epub 掌上书苑
- http://www.jiumodiary.com/ 搜索电子书
- http://readcolor.com/ 读远，电子书库
- http://blah.me/ Google+ 郁也风整理的书籍
- https://www.dogear.cn/ 狗耳朵 全文 RSS 和微信公众号推送

如果使用 InoReader 可以订阅下面我制作的 bundle ， 我订阅了一些 Kindle 相关的文章。

地址：<http://www.inoreader.com/bundle/0014cd6370e9>

其他的地址我以后会在[这篇文章](/post/2018/02/free-online-books.html) 中更新。


## reference

- <http://www.kindlefan.cn>
- <http://blog.csdn.net/felomeng/article/details/6958375>
- <https://qdan.me/list/VSEMm8dS4kuh9i2L>
- <https://www.douban.com/note/164243334/>

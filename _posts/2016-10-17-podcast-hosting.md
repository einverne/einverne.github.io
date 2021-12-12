---
layout: post
title: "Podcast 托管"
aliases: "Podcast 托管"
tagline: ""
description: "Podcast 托管，及申请攻略"
category: 经验总结
tags: [podcast, google, itunes, ]
last_updated:
---

Podcast 近两年又突然火起来，一度认为 Podcast 是最近才流行起来的媒体，后来才发现这种媒介[早在上世纪 80 年代就诞生](https://en.wikipedia.org/wiki/History_of_podcasting) 。近两年被再一次提起可能 iOS 系统内置播客系统是个契机，一时间让 Podcast 进入大众的视听，而国内近些年也陆陆续续出现了很多播客平台，喜马拉雅，荔枝等等， 播客这种形式在播客，视频播客新奇之后似乎很难找到自己的定位，但是在日常生活中还是有很多情况适用播客，在开车等双手双眼需要时刻准备着的时候，播客系统可以可以代替收音机，而在长途跋涉需要闭目养神时，播客也可以成为音乐的代替。

但是经过这么多年的演进， Podcast 还是依赖于 RSS 2.0 标准，不论是 iTunes 还是 Play Music ，虽然 Google 已经用关闭 Google Reader 来表明对 RSS 的态度，却还是依然无法将 Podcast 从 RSS 剥离。其实这也很矛盾，就像之前看到的一则评论，Google 托管了最大的视频播客 YouTube，却连小小的音频文件都懒得托管。所以无奈才有了此篇文章。

## Podcast Hosting

有几种免费靠谱的托管方式，这里就不讲收费的方案了，因为免费的可以做到很好。个人使用完全没有问题。

- Dropbox, Dropbox 导出直链自行 Google
- Google Drive，如何导出直链自行 Google
- SoundCloud，有高级版
- Internet Archive
- 最后 Cloudup 我使用的方案，支持 1000 个文件托管，具体可参看之前总结的一篇[文章](/post/2015/04/cloudup.html)

其实苹果官网也给了一个 Podcast Hosting 的[列表](https://itunespartner.apple.com/en/podcasts/partnersearch) 可以查看。

## Generate RSS feed

iTunes 和 Google Play Music 都需要不同格式的 RSS，需要特别考虑。另外音频最好带封面 1400*1400 px 到 2048*2048 px 大小，这个是 iTunes Store 需要的。



### iTunes 需要的标签

iTunes 中关于 Podcast 的[介绍](https://itunespartner.apple.com/cn/podcasts/overview) 。 每一个 Podcast 叫做 Episode，所有独立的可下载的音频，视屏，PDF，ePub，都属于 Episode。 iTunes 支持的文件格式包括： M4A，MP3，MOV，MP4，M4V，PDF，ePub 等等。通过 [Feed Validation Service](http://validator.w3.org/feed/) 验证 Feed 有效性。以下例子可以在帮助[文档](https://help.apple.com/itc/podcasts_connect/#/itcbaf351599) 中查看到。

iTunes 中需要的 Feed 文件格式：

    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
    <channel>
        <title>All About Everything</title>
        <link>http://www.example.com/podcasts/everything/index.html</link>
        <language>en-us</language>
        <copyright>&#x2117; &amp; &#xA9; 2014 John Doe &amp; Family</copyright>
        <itunes:subtitle>A show about everything</itunes:subtitle>
        <itunes:author>John Doe</itunes:author>
        <itunes:summary>All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our podcast in the Podcasts app or in the iTunes Store</itunes:summary>
        <description>All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our podcast in the Podcasts app or in the iTunes Store</description>
        <itunes:owner>
        <itunes:name>John Doe</itunes:name>
        <itunes:email>john.doe@example.com</itunes:email>
        </itunes:owner>
        <itunes:image href="http://example.com/podcasts/everything/AllAboutEverything.jpg"/>
        <itunes:category text="Technology">
        <itunes:category text="Gadgets"/>
        </itunes:category>
        <itunes:category text="TV &amp; Film"/>
        <itunes:category text="Arts">
        <itunes:category text="Food"/>
        </itunes:category>
        <itunes:explicit>no</itunes:explicit>
        <item>
            <title>Shake Shake Shake Your Spices</title>
            <itunes:author>John Doe</itunes:author>
            <itunes:subtitle>A short primer on table spices</itunes:subtitle>
            <itunes:summary><![CDATA[This week we talk about <a href="https://itunes/apple.com/us/book/antique-trader-salt-pepper/id429691295?mt=11">salt and pepper shakers</a>, comparing and contrasting pour rates, construction materials, and overall aesthetics. Come and join the party!]] ></itunes:summary>
            <itunes:image href="http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg"/>
            <enclosure length="8727310" type="audio/x-m4a" url="http://example.com/podcasts/everything/AllAboutEverythingEpisode3.m4a"/>
            <guid>http://example.com/podcasts/archive/aae20140615.m4a</guid>
            <pubDate>Tue, 08 Mar 2016 12:00:00 GMT</pubDate>
            <itunes:duration>07:04</itunes:duration>
            <itunes:explicit>no</itunes:explicit>
        </item>
        <item>
            <title>Socket Wrench Shootout</title>
            <itunes:author>Jane Doe</itunes:author>
            <itunes:subtitle>Comparing socket wrenches is fun!</itunes:subtitle>
            <itunes:summary>This week we talk about metric vs. Old English socket wrenches. Which one is better? Do you really need both? Get all of your answers here.</itunes:summary>
            <itunes:image href="http://example.com/podcasts/everything/AllAboutEverything/Episode2.jpg"/>
            <enclosure length="5650889" type="video/mp4" url="http://example.com/podcasts/everything/AllAboutEverythingEpisode2.mp4"/>
            <guid>http://example.com/podcasts/archive/aae20140608.mp4</guid>
            <pubDate>Wed, 09 Mar 2016 13:00:00 EST</pubDate>
            <itunes:duration>04:34</itunes:duration>
            <itunes:explicit>no</itunes:explicit>
        </item>
        <item>
            <title>The Best Chili</title>
            <itunes:author>Jane Doe</itunes:author>
            <itunes:subtitle>Jane and Eric</itunes:subtitle>
            <itunes:summary>This week we talk about the best Chili in the world. Which chili is better?</itunes:summary>
            <itunes:image href="http://example.com/podcasts/everything/AllAboutEverything/Episode3.jpg"/>
            <enclosure length="5650889" type="video/x-m4v" url="http://example.com/podcasts/everything/AllAboutEverythingEpisode2.m4v"/>
            <guid>http://example.com/podcasts/archive/aae20140697.m4v</guid>
            <pubDate>Thu, 10 Mar 2016 02:00:00 -0700</pubDate>
            <itunes:duration>04:34</itunes:duration>
            <itunes:explicit>no</itunes:explicit>
            <itunes:isClosedCaptioned>Yes</itunes:isClosedCaptioned>
        </item>
        <item>
            <title>Red,Whine, &amp; Blue</title>
            <itunes:author>Various</itunes:author>
            <itunes:subtitle>Red + Blue != Purple</itunes:subtitle>
            <itunes:summary>This week we talk about surviving in a Red state if you are a Blue person. Or vice versa.</itunes:summary>
            <itunes:image href="http://example.com/podcasts/everything/AllAboutEverything/Episode4.jpg"/>
            <enclosure length="498537" type="audio/mpeg" url="http://example.com/podcasts/everything/AllAboutEverythingEpisode4.mp3"/>
            <guid>http://example.com/podcasts/archive/aae20140601.mp3</guid>
            <pubDate>Fri, 11 Mar 2016 01:15:00 +3000</pubDate>
            <itunes:duration>03:59</itunes:duration>
            <itunes:explicit>no</itunes:explicit>
        </item>
    </channel>
    </rss>


### Play Music 需要的标签

完整的字段及解释可以参考官方[文档](https://support.google.com/googleplay/podcasts/answer/6260341)，里面有非常详细的字段解释。Play Music 要求的大多数内容和 iTunes 类似，只有一些字段要求有些变化，Google 要求图片为方形，最小为 `600*600` ，并且建议大小在 `1200*1200` 到 `7000*7000` px 之间，支持 JPEG 和 PNG。

    <?xml version="1.0" encoding="UTF-8"?>
    <rss xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" version="2.0">
    <channel>
        <title>The Unknown Podcast</title>
        <link>http://sample.com/podcasts/unknown/index.html</link>
        <language>en-us</language>
        <copyright>℗ 2025 Unknown Podcaster Corp</copyright>
        <googleplay:author>Unannounced Podcaster</googleplay:author>
        <googleplay:description>The Unknown Podcast will look at all the things that are unknown or unknowable. Find us on Google Play Music!</googleplay:description>
        <description>The Unknown Podcast will look at all the things that are unknown or unknowable.</description>
        <googleplay:email>unknown-podcast@sample.com</googleplay:email>
        <googleplay:image href="http://sample.com/podcasts/unknown/UnknownLargeImage.jpg" />
        <googleplay:category text="Technology"/>
        <item>
            <title>What's out there?</title>
            <googleplay:author>Engima</googleplay:author>
            <googleplay:description>We look at all the things that are out there that we'd like to know.</googleplay:description>
            <googleplay:image href="http://sample.com/podcasts/unknown/Episode1.jpg" />
            <enclosure url="http://sample.com/podcasts/UnknownPodcastEpisode1.mp3" length="2320111" type="audio/mpeg" />
            <guid>http://sample.com/podcasts/UnknownPodcastEpisode1.mp3</guid>
            <pubDate>Mon, 29 Jun 2015 19:00:00 GMT</pubDate>
        </item>
        <item>
            <title>What can we know, really?</title>
            <googleplay:author>The everyman</googleplay:author>
            <googleplay:description>And then we follow up on last week's podcast to examine what can and cannot be known.</googleplay:description>
            <googleplay:image href="http://sample.com/podcasts/unknown/Episode2.jpg" />
            <enclosure url="http://sample.com/podcasts/UnknownPodcastEpisode2.m4a" length="6421543" type="audio/x-m4a" />
            <guid>http://sample.com/podcasts/UnknownPodcastEpisode2.m4a</guid>
            <pubDate>Mon, 6 Jul 2015 19:00:00 GMT</pubDate>
        </item>
    </channel>
    </rss>


## 提交认证

可以向以下两个网址提交申请认证

- Podcasts Connect ：<https://podcastsconnect.apple.com/> 需要 Apple ID
- Google Play Music : <https://play.google.com/music/podcasts/publish> 需要 Google 账号

最后可以从这里访问到网站 <https://einverne.github.io/podcast> ，网站源代码在 <https://github.com/einverne/podcast> 。

Demo 的 Play Music 地址在 [这里](https://goo.gl/app/playmusic?ibi=com.google.PlayMusic&isi=691797987&ius=googleplaymusic&link=https://play.google.com/music/m/Idd56uz65i4rnl4uen2urtpjzvq?t%3D%25E9%259D%2599%25E5%2590%25AC)



## reference

- <http://scateu.me/2015/10/28/podcast.html>
- RSS 2.0 标准 <https://cyber.harvard.edu/rss/rss.html>
- 一个开源的 Podcast Rss 管理 PHP 编写 <https://github.com/JJYing/Podcast-RSS-Editor>


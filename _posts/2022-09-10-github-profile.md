---
layout: post
title: "折腾一下 GitHub Profile"
aliases:
- "折腾一下 GitHub Profile"
tagline: ""
description: ""
category: 经验总结
tags: [ github, git, github-profile, online-profile, ]
create_time: 2022-09-21 18:43:07
last_updated: 2022-09-21 18:43:07
---

虽然很早就知道 GitHub 发布了 Profile 功能，可以使用 README 来丰富 Profile 页面。但是一直以来没啥动力，大多数时候都不会去到主页去访问。但现在有些时候逛  GitHub 的时候会点到 [其他人](https://zzetao.github.io/awesome-github-profile/) 的主页去看，发现有一些主页虽然只有寥寥几句，但却可以清楚的知道「他/她」最近在贡献什么内容，擅长什么技能。虽然我在 GitHub 上还是观摹大佬居多，但也想着通过这个契机在整理 GitHub Profile 的时候加深一下对自己的认知。

至于如何建立同名的 repository，如果提交代码就先略过了，官方的帮助和其他文章的内容都非常详细。

刚开始去 Google 「GitHub Profile」 就发现了如下的页面生成器 [GitHub Profile Generator](https://rahuldkjain.github.io/gh-profile-readme-generator/) ，可以用这个生成器生成一个初始版本，然后在其基础上修改。

在调研的过程中基本发现了两大类主流的用法，一类是通过 GitHub 的 API ，或者其他服务的 API，生成一个 Badge 展示，另外一类就是通过 [[GitHub Actions]] 通过定时任务动态的使用代码聚合一些内容，然后再动态地展示到页面中。

因为 README 中可以直接写 HTML，所以如下的 HTML 也可以直接使用，注意替换其中的链接。

```
<h3 align="left">Connect with me:</h3>
<p align="left">
<a href="your link" target="blank"><img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/twitter.svg" alt="" height="30" width="40" /></a>
<a href="your link" target="blank"><img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/linkedin.svg" alt="" height="30" width="40" /></a>
<a href="your link" target="blank"><img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/instagram.svg" alt="" height="30" width="40" /></a>
<a href="your link" target="blank"><img align="center" src="https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/youtube.svg" alt="" height="30" width="40" /></a>
</p>
```

或者使用外部的 Readme-stats 来生成一个数据卡：

```
<p>
  <a href="https://github.com/einverne/">
    <img  margin-top="-30px" width="55%" align="right" alt="einverne's github stats" src="https://github-readme-stats.vercel.app/api?username=einverne&show_icons=true&include_all_commits=true&count_private=true&layout=compact&hide_border=true" />
  </a>
</p>
```

## 图标 {#icons}
如果要在页面中放入图标可以到如下的网站寻找。

- [Simple Icons](https://simpleicons.org/) 是一个开源的 SVG 图标库，包含了上百个品牌的图标。
- [Skill Icons](https://github.com/tandpfun/skill-icons) 是一组可以用来展示技能的图标。
- [Flaticon](https://www.flaticon.com/) 提供了很多彩色的图标，也提供很多收费的图标，可以根据需要选择。
- [Icons8](https://icons8.com/) 同样是一个图标库，但是也包含一些收费的图标
- [Wikimedia Commons](https://commons.wikimedia.org/) 是另一个不错的选择，可以找到很多官方的图标，并且可以自由使用。

另外一个寻找 icon 的方式就是利用 <https://cs.github.com> GitHub 的 Code Search，然后直接搜索，比如我想要找到豆瓣的 svg ，输入 `douban.svg` 然后就能找到。

## 其他徽章

### github-readme-stats

 [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) 是一个用来生成 GitHub 统计数据的工具，可以在页面上展示获得的⭐，提交的次数，总共的 PR 等等。

![](https://photo.einverne.info/images/2022/09/21/z37h.png)

### 徽章
生成从构建，代码覆盖率，开源协议，到社交网络等等，非常多的徽章。

- [Shields](https://shields.io/)

### 统计页面访问量
如果想要统计访问 GitHub Profile 的数量，可以使用 [GitHub Profile Views Counter](https://github.com/antonkomarev/github-profile-views-counter) 这个项目。

### 显示奖杯

 [GitHub Profile Trophy](https://github.com/ryo-ma/github-profile-trophy)

样例：

![](https://photo.einverne.info/images/2022/09/21/z8yr.png)

### github-readme-streak-stats

 [Streak stats](https://github.com/DenverCoder1/github-readme-streak-stats)

https://skyline.github.com/

## GitHub Actions
基于 GitHub Actions 动态生成内容展示在 Profile 页面。

因为有 GitHub Actions，所以简单的用脚本可以展示

- 最近在阅读的图书
- 最近分享的文章
- 当前正在听的音乐

等等。

### 显示最近博客内容
可以使用 [blog-post-workflow](https://github.com/gautamkrishnar/blog-post-workflow) 来显示最近更新的博客内容。通过定时读取 Feed ，来在页面动态展示内容。

### GitHub 最近动态

 [GitHub Activity Readme](https://github.com/jamesgeorge007/github-activity-readme) 可以在页面上显示最近在 GitHub 上的动态。

### Waka
如果你使用 [[WakaTime]] 来统计编码时间，那么可以使用 [waka-readme-stats](https://github.com/anmol098/waka-readme-stats) 来展示。


## 总结
最终的效果见 <https://github.com/einverne/>


## reference

- [awesome-github-readme](https://github.com/abhisheknaiidu/awesome-github-profile-readme)
- [beautify-github-profile](https://github.com/rzashakeri/beautify-github-profile)

- <https://dev.to/supritha/how-to-have-an-awesome-github-profile-1969>
- <https://github.com/gautamkrishnar/gautamkrishnar/blob/master/README.md>
- <https://github.com/gautamkrishnar/gautamkrishnar/blob/master/README.md>
- <https://github.com/anuraghazra>

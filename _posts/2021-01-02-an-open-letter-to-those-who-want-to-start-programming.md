---
layout: post
title: "迟到的「给编程初学者的一封信」"
tagline: ""
description: ""
category: 学习笔记
tags: [programming, coding, editor, linux, learning, suggestion, open-letter, ]
last_updated:
---


这些天翻箱倒柜，翻出来一些大学时候的文档，其中一篇是当时上外教课时打印给我们的材料，虽然可以看得到当时也在上面做过笔记，但现在已经完全不记得有这样一份文档的存在了。但回过头再看文档的内容，每一句话都是非常珍贵的建议，是一份那个时期完全需要读一下的材料，但当时却并没有好好珍惜。这份文档的名字叫做「An open letter to those who want to start programming」，如果记得没错的话这份文档交到我手上的时候，应该就是我刚去学习如何编程的时候。如果当时就能够理解这一份文档内容的话，这些年来我肯定能少走不少的弯路。

在结合到最近陆陆续续看过关于认知的一些书，才发现我自身的问题并不是在于看得东西不够多，而是没有完全理解我曾经看过的东西。就如这一份文档那样，现在的时间来看文档上列举的内容都是当下非常好的建议，然而当时的我并不理解，所以自然而然就忘记了这一份文档上的建议。

先来总结一下这一份文档中作者给出来的几个建议：

- starting creating something just for fun. 你需要毫不犹豫的开始做一些事情，而不是纠结于先开始学习，或者设置编辑器。
- Initially, screw the algorithms and data structures. 开始的时候不要在意算法和数据结构。当然作者并不是说算法和数据结构不重要，而是在起初的时候，不要在意算法和数据结构的细节，而是在学习和尝试的过程之中体会它们的作用，记住算法和数据结构的名字，当真正要用到的时候深入了解，并切身体会它们的具体应用场景。当你真正需要他们的时候，可以用自己的熟悉的语言实现。
- Choose a good language. 选择一门你觉得可以在短时间内通过它生产出内容的语言。当完成一个任务并看到产出才是激励继续的动力。
    - 不要选择那种需要笨重的 IDE 才能运行的语言，迅速的产生成果才是唯一的目标
- Choose a good editor, 编辑器之于程序员就相当于弓之于弓箭手。
    - Vim，许多 Linux 发行版的默认编辑器，虽然入门和学习曲线比较陡峭，但是是一个学习了终身收益的工具
    - Emacs，同样有着陡峭的学习曲线，但同样强大
- Use an operating system that'll teach you something，选择一个可以学习到的操作系统。目前主流的桌面操作系统也只有 Windows，Linux 和 macOS，建议你选择一个合适的 Linux 发行版，作者的观点是 Windows 不会教你任何事情，但是使用 Linux 你能收获更多。我曾经花费了一段时间将全部的资料和应用切换到 Linux Mint，我也使用这个发行版大约 6 年左右了，虽然确确实实会遇到一些问题，但正是解决这些问题的过程，让我从中学习到了很多东西，比如 [Linux的启动过程](/post/2017/09/linux-system-boot-sequence.html)，[Linux 下开机启动应用脚本](/post/2018/02/linux-manage-startup-script.html)，以及关于[磁盘的配置](/post/2019/02/fstab-file.html)，[网络的配置](/post/2019/08/ubuntu-linux-mint-network-configuration.html) 等等。
- Don't copy-paste files to backup stuff. 作者在这边推荐了 Git，而当年我们在学校学习的还是 SVN，真正将 Git 运用到方方面面我也是这些年来才真正实施的，以前只是拿来作为代码的版本管理，而之后我用 Git 来管理任何可见的文本，比如博客，比如笔记，比如[文本配置](https://github.com/einverne/dotfiles)。再结合 [git worktree](/post/2019/03/git-worktree.html)， [git subtree](/post/2020/04/git-subtree-usage.html) 等等的功能，可以在任何一台电脑上迅速恢复我的工作环境。
- Know where to get help. 知道如何寻求帮助，社群，StackOverflow，IRC，都是可以获取帮助的渠道，而对于我真正学会使用 StackOverflow 则是要到好几年之后独自学习 Cocos-2x 的时候，因为参考资料少，官方文档也不全面，StackOverflow 帮助了很多，那个时候我才理解到互联网的互帮互助是以这样的方式来实现的，那以后也曾经花了一段时间去积极回答别人的问题。
- Develop your netiquette. 遵守网络礼仪，学会如何提问，好好地阅读一下提问的哲学对我来说又是在读完这篇文档之后好几年才真正理解的。
- Meet people, because books only teach you routine stuff. 你不是这个领域唯一的程序员，交一些朋友和他们一切完成一些事情，你可以学到比图书更多的东西。这些年看技术书籍除非一些比较基础的算法大部分的书籍都会在出版之后不久便过时，但是 People 会随着时间改变。
- Writing open source code. 编写开源代码是一项回馈，甚至可以说是一项慈善。如果代码有用，别人回来使用或者修正你的代码。你也可以通过其他人添加的代码和提交的修改建议来学习并巩固你的编程技能。为开源项目编写代码不需要一个巨大的项目，你可以从最小的代码开始，比如一段下载 YouTube 视频的代码。当我看到这一段代码的时候，正好发生了 GitHub 下架 youtube-dl 项目，之后经过复杂的程序又恢复的事件，原始作者也正好出现来[讲述了 youtube-dl 这个项目诞生的背景](https://rg3.name/202011071352.html)。[[202011032314-GitHub-take-down-youtube-dl]]


文中的内容大部分内容都在我之后对编程这个领域进一步的认识之后，陆陆续续才发现这每一条建议的可贵之处。我不知道是不是每个专业都会有这样一封写给初学者的信，但无疑一个专业领域前辈所写的内容对后来者的启发意义都是巨大的。



## 附录


An open letter to those who want to start programming


First off, welcome to the fraternity. There aren’t too many people who want to create stuff and solve problems. You are a [hacker](http://www.paulgraham.com/hp.html). You are one of those who wants to do something interesting.

> _“When you don’t create things, you become defined by your tastes rather than ability."_
> 
> _– WhyTheLuckyStiff_

Take the words below with a pinch of salt. All these come from me – a _bag-and-tag programmer_. I love to get things working, rather than sit at something and over-optimize it.

Start creating something just for fun. That’s a great start! There’s no way you will start if you say you “_need to learn before doing_”. Everybody’s got to start somewhere. Fire up your editor and start writing code.

Here’s something important which people might call bad advice, but I’m sure you’ll stand by me when I’m finished saying why. **Initially, screw the algorithms and data structures.** They do not have generic use-cases in most simple applications. You can learn them later when you need them. Over a period of time, you’ll know what to apply in situations. Knowing their names and what they do would suffice to be able to pick some paper, dust it and implement it. And that is… if no library (other programmers' re-usable code) is available, to do it in the programming language of your choice.

**Choose a good language. One that you think you can produce something useful in short time.**

So let C not be your first language. That might give you the satisfaction of doing things the really old-n-geeky way. C was the solution to the problem Assembly Language was. It offers better syntactic sugar than it’s prominent predecessor – Assemble Language. But today, C (or C++) is not a language that you can produce something very quickly. I would suggest that you use a dynamic language – I won’t sideline any options. Choose a language whose syntax (and documentation) you think you might be comfortable with. For this, you might want to spend some time trying out different languages for a few hours. The purpose of choosing such a language is not to make you feel better and that programming is easy. Completing stuff faster and being able to see the output keeps you motivated. Don’t choose a language that requires a special heavy-weight IDE (tool that helps you write code and run it) to program better in the language. All you should need is a text editor.

**Choose a good editor.**

An editor is to a programmer, like how a bow is to an archer. Here are some editors to get started with…

-   [SublimeText 2](http://www.sublimetext.com/2) – recommended if you are just starting.
-   Emacs – huge learning curve. Complex key shortcuts. And to be able to customize it, you’ll need to learn Emacs Lisp.
-   Vim – used by many for it’s simplicity and the fact that it comes with linux distros by default. I used Emacs for 2yrs and then switched to Vim to run away from emacs’s complex key strokes and when my little finger on both hands started hurting. Knowing vim keystrokes is a must. When you work remotely and try to type out code on some server from your computer, you’ll know that the only editor available from the command line without any installs, is Vim.

Watchout! Emacs and Vim might be really old. But they both have some features which even most modern editors don’t have.

**Use an operating system that’ll teach you something.**

Windows won’t teach you anything. The only thing you learn using Windows is to click the ._exe_ file to install the software and use it. It may seem cool in the beginning, but in the long run when you have to deploy applications, especially if you are aspiring to be a web developer, you’ll need atleast basic knowledge of linux. Linux also allows you to customize stuff the way you need them to be. Macs are cool too, but I assume that you cannot afford one of those now.

**Don’t copy-paste files to backup stuff.**

It’s usual among amateur programmers to copy-paste files to some temporary directory in order to backup them. That’s the only way they seem to know. Stop that! Use a version control software. I strongly suggest Git, since it’s popular and easy to use. It has nice community and resources to support new-comers. (Apart from Git, There’s mercurial, darcs, fossil, etc. But just start with Git. I’m not going to bother you with the reasons for suggesting Git).

**Know where to get help.**

Join a community that you can relate to (with the tools you use). [StackOverflow](http://stackoverflow.com/) is Facebook for programmers. There are no status messages and comments. Instead there are questions and answers. Also learn to use the [IRC](http://en.wikipedia.org/wiki/Internet_Relay_Chat). It’s an old form of chatrooms and is now being used by mostly developers to share information and helping each other.

**Develop your netiquette.**

Know when to ask questions. Most problems you face might have been stumbled upon by others who might have already posted on the internet for answers. Before asking on IRC or any forums, google first (or should I say [blekko](http://blekko.com/) first) to see if there’s already a solution to your problem. IRC needs patience. Remember people are helping you for free out of goodwill. Sometimes it might take hours, for someone in the chatroom to respond to you. So wait until they do. Besides, be polite. It's a small world. Karma, good or bad, comes back.

**Meet people, because books only teach you routine stuff (_oh and the "book" is dead [they say](http://diveintomark.org/archives/2011/04/29/the-book-is-dead)_).**

There are some street smarts that you’ll learn when you tinker with stuff or learn from those who do it. Roam, meet people and say _hello_. You are not the only programmer in your place. Make friends and do stuff with them. If you've noticed, when a couple geeks get together, whatever the starting point of the conversation be, it always ends up getting technical. It's bound to happen. Enjoy it. Programming for a good number of years, I can tell you that I learnt nothing more than what the books and articles said, until I starting meeting people and getting technical with them 6yrs back. So I always say that I’ve been programming for 6yrs, because that’s when I started meeting people and feel I really started to learn.

**Write opensource code.**

Writing opensource code is giving back. It’s much more than charity. You are leaving code that others can use and improve on _(maybe)_ for years to come. It also helps you refine your skills when someone else adds to your code or suggests changes. Code that you opensource doesn't have to be big. It can even be a useful little program that downloads youtube videos. Moreover, you’ll be surprised, that your code will often help you start and have interesting conversations with people.

Lastly, when years pass, return this favour, by writing a similar letter to someone else who asks you for such help. And possibily correct me.

_\--  
For a hacker, by a hacker  
Akash Manohar_

Source: http://blog.akash.im/an-open-letter-to-those-who-want-to-start  

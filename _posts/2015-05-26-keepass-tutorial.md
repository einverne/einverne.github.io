---
layout: post
title: "KeePass 教程"
description: "加密，KeePass, "
category: encryption
tags: [encryption, KeePass, windows,]
---

如今，我们的生活充斥着各色各样的密码。所谓密码管理器，就是用一个主密码来保护所有其他密码。使用密码管理器，可以减轻记忆负担，而且只要在主密码不泄漏或者遗忘的情况下，我们的账户安全就能够得到保障。

本文所要介绍的 KeePass 就是一款出色的密码管理器，KeePass 具有以下优点：

- 简单易用，易于上手。
- 功能全面，既能保存密码，还能生成健壮的密码
- 开源软件，安全性更高
- 跨平台软件，支持 Windows、Linux 和 Mac 三大平台，甚至还有移动操作系统版本。
- 移动版软件，便携绿色。

下面，我们一起来学习如何使用 KeePass。

##1. 下载安装 KeePass

KeePass 有经典版本 1.x 和专业版本 2.x 两种版本，主要有如下两点区别：

1. KeePass 2.x 需要 .NET 2.0 以上版本（Windows Vista 以上版本已经预装）才能运行，而 1.x 不需要任何依赖。
2. KeePass 2.x 功能更全面，例如增加了双通道自动输入混淆功能。

由于 KeePass 2.x 功能更为全面，我推荐大家选用这一版本。下文将以 KeePass 2.x 版本为例进行讲解。

访问 KeePass 官网下载页面 http://keepass.info/download.html ，左栏的 Classical Edition 为 KeePass 1.x 版本，右栏的 Professional Edition 为 KeePass 2.x 版本，每一栏中都有两个下载链接，分别是 Installer EXE for Windows 和 ZIP Package，即安装程序和移动版本，请按照自己的需要选择下载。

KeePass 的安装过程非常简单，按照提示安装即可。

安装 KeePass 完成之后，请访问 http://keepass.info/translations.html 下载中文语言包，页面中 Chinese, Simp. 即是简体中文语言包（五星红旗处），注意选择对应版本语言包。下载解压之后将 KeePass 的语言文件（*.lngx）复制到 KeePass 的安装目录。复制完成之后启动 KeePass，选择 View 菜单，点击 Change Language，在弹出的对话框中选择 Simplified Chinese，KeePass 将要求重新启动，点击 Yes 重新启动 KeePass 即可。

对于 Ubuntu 用户，请参阅如何在 Ubuntu 中安装 KeePass 2 进行安装设置。

## 2. KeePass 教程

### 2.1 创建密码数据库

开始使用 KeePass 之前，首先需要创建密码数据库以保存密码，步骤如下：

1. 启动 KeePass，选择文件菜单，选择新建选项。
2. 选择数据库文件保存路径，请将其存放在安全之处并注意备份。
3. 选择数据库保护方式，包括以下三种类型：
	* 主密码：最为传统的保护方式，输入足够健壮而又易记的密码即可。
	* 密钥文件：保存一个密钥文件作为访问密码数据库的凭据，选择这种方式必须注意密钥文件的安全。
	* Windows 用户帐户：将密码数据库和 Windows 账户关联，只要使用当前 Windows 账户登录即可使用，但是如果重装系统的话请先导出当前账户，否则密码数据库将无法使用。

三种方式可以叠加使用，但是推荐大家使用主密码的方式进行保护。

4. 最后对密码数据库进行设置，包括数据库名称、加密选项等等，请按照自己的需要进行设置即可。

### 2.2 保存密码及自动输入

此处将以 Gmail 为例讲解如何保存密码和自动输入，步骤如下：

1. 运行 KeePass，点击添加记录（或者按下 Insert 键），弹出添加记录对话框。

2. 在记录标签页中需要填写的项目主要有以下几项：
	* 标题：需要输入密码的窗口标题，该信息是 KeePass 在全局自动填写时用于选择帐户密码的根据。在本例中为打开 Gmail 网址后，浏览器标题栏的部分内容，比如 Gmail。
	* 用户名：在本例中为 Gmail 账号。
	* 密码：在本例中为 Gmail 的登录密码。
	* 网址：用于按下 Ctrl + U 快捷键 快速启动相关网址或程序，在本例中为 http://gmail.com 。如果需要设置程序时则输入 cmd:// 程序文件路径，或者点击工具按钮，选择其中的网址：选择程序选项。

在自动输入标签页，还可以勾选双通道自动输入混淆选项，以阻止木马通过键盘记录窃取你的密码，但是只有支持 Ctrl + V 快捷键粘贴的窗口才能使用。
设置完成之后启动浏览器（如果设置网址的话可在选中相关条目后按下 Ctrl + U 启动），按下快捷键左 Ctrl + Alt + A（注意关闭中文输入法），KeePass 将自动输入密码并登录 Gmail。除此之外还可以先选择浏览器窗口，然后调出 KeePass（快捷键左 Ctrl+Alt+K），在相应密码条目右击，选择执行自动输入，KeePass 就会自动输入账户密码，注意 KeePass 是按照前一焦点窗口的原则选择输入窗口的，所以请保证前一焦点窗口是正确的。

### 2.3 自定义自动输入方式

由于 KeePass 按照 {USERNAME}{TAB}{PASSWORD}{ENTER} 的序列输入密码的，一些网站或者软件不能正常登录。例如 TM 启动之后默认焦点是在密码输入框处，使用默认序列会出错。这时我们可以通过自定义自动输入序列来解决这一问题。

首先参照上述方法建立新密码条目，标题填入 TM，网址填入 CMD://”C:\Program Files\Tencent\TM2009\Bin\TM.exe”（由于目录中含有空格，因此必须包括英文双引号）。然后切换到自动输入标签页，勾选替代默认规则后，在输入框中输入以下内容：

	+{TAB}{USERNAME}{TAB}{PASSWORD}{ENTER}

现在切换到 TM，按下左 Ctrl + Alt + A 即可自动登录。QQ 的设置与之类似，只要注意标题改为 QQ 即可。

下面我来介绍一下自动输入序列，默认输入序列是{USERNAME}{TAB}{PASSWORD}{ENTER}，其中{USERNAME}是用户名，{PASSWORD}是密码，{TAB}是 Tab 键（用于切换焦点），{ENTER}是 Enter 键。一些特殊键的对应表可见官网文档 http://keepass.info/help/base/autotype.html#autoseq ，上面所用的 + 所对应的就是 Shift，和 Tab 组合之后可以跳到前一个输入框从而输入用户名。知道特殊键对应和写作规律之后我们也可以按照自己的情况写作特殊的自动输入序列。

### 2.4 生成安全密码

在新建密码条目时，点击确认密码文本框右侧的生成密码，选择打开密码生成器，就可以打开如下图所示的密码生成器。

在密码生成器中可以对密码生成方案进行配置，如密码长度、密码组成等等，设置完成后点击确定回到添加记录对话框，点击密码文本框右侧的用星号 显示 / 隐藏密码按钮，将密码复制出来用于注册，最后按照通常步骤添加密码记录即可。

上面就是使用 KeePass 的一些基本方法，除此之外，KeePass 还具有插件机制，请大家自行探索。

##本文历史：

2011 年 4 月 26 日：初稿完成
2011 年 5 月 1 日：第一次修改
2011 年 8 月 11 日：将标题由“KeePass 使用全攻略”修改为“KeePass 教程”，删除“KeePass 插件使用”一节，并精简文字。

原文地址：KeePass 教程 [http://terrychen.info/keepass-tutorial/](http://terrychen.info/keepass-tutorial/)

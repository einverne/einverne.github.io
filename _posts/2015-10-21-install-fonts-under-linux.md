---
layout: post
title: "在 Linux 下安装字体"
tagline: "Important thing must do after install linux"
description: ""
category: Linux
tags: [linux, linux-mint, fonts, font, truetype, ]
last_updated:
---

Most of computer fonts people using are TrueType fonts. TrueType fonts end with `.ttf`, which stand for [TrueType Font](/post/2015/05/font.html). This tutorial shows how to install [TrueType fonts](/post/2015/05/font.html) in Linux (Debian, Ubuntu, Linux Mint, etc).

## Linux 字体文件夹 {#font-folders}

Linux 下默认安装的字体都被存放在 `/usr/share/fonts` 下。

如果是个人使用可以将字体文件拷贝到 `~/.fonts` 目录中。所有支持的字体文件路径可以通过系统的 `/etc/fonts/fonts.conf` 文件查看到。

把字体文件拷贝到对应的目录之后，需要执行

	# create an index of scalable font files for X
	mkfontscale
	# create an index of X font files in a directory
	mkfontdir
	fc-cache -fv

## 查看已安装字体

使用如下命令来查看已安装字体：

	fc-list
	# 查看中文字体
	fc-list :lang=zh

## General way to install TrueType fonts
All of the TrueType fonts are under `/usr/share/fonts/truetype`, simplest way is to copy ttf file to this directory and give it the right permission. For example, if you want to install Ubuntu font family manually. You can download the font file from [official site](http://font.ubuntu.com).

In the terminal, download the package:

     wget http://font.ubuntu.com/download/ubuntu-font-family-0.80.zip

unzip the file into directory ubuntu-font-family-0.80

     unzip ubuntu-font-family-0.80.zip

and then use copy command to copy all the files to `/usr/share/fonts/truetype`,`/usr/share/fonts` directory and sub directory need root to write, so you should add `sudo` before command. The `-r` paramater represent recursive, it means all the files under ubuntu-font-family-0.80 will be copied to the right place.

     sudo cp -r ubuntu-font-family-0.80/ /usr/share/fonts/truetype/

finally, you shoulde give this directory and all the ttf under this directory right permission. All the new fonts now can only be used by root. We need to change the permission to let all the users to use these fonts:

     sudo chmod 755 /usr/share/fonts/truetype/ubuntu-font-family-0.80/ -R

then, refresh the font cache to let system detect these fonts:

     fc-cache -f -v

## Install new fonts only for current user
As I mentioned in the first part, if you copy the ttf file to `/usr/share/fonts` directory, all the users can use these new fonts. But if you only want to provide these fonts to specific user, like current login user , you can just copy the file to `~/.fonts` directory. If there is no such directory, just create it. The ~ stand for current user's home directory, full path is `/home/<username>`. So repeat the operation to install Ubuntu font family:

    mkdir ~/.fonts
    cp -r ubuntu-font-family-0.80/ ~/.fonts/
    fc-cache -fv

## Install microsoft core fonts
Microsoft Core Fonts include these fonts:

* Andale Mono
* Arial Black
* Arial (Bold, Italic, Bold Italic)
* Comic Sans MS (Bold)
* Courier New (Bold, Italic, Bold Italic)
* Georgia (Bold, Italic, Bold Italic)
* Impact
* Times New Roman (Bold, Italic, Bold Italic)
* Trebuchet (Bold, Italic, Bold Italic)
* Verdana (Bold, Italic, Bold Italic)
* Webdings

Debian/Ubuntn/Linux Mint user just open terminal and run these command:

	sudo apt-get install ttf-mscorefonts-installer

or Linux Mint user can find this package in the Software Manager, just search it and click install.

## Install Chinese fonts

`.ttf` files are the English fonts, while .TTF files are Chinese fonts. If we check the `C:\Windows\Fonts` under Microsoft Windows, there are 3 kind of fonts. One is the `.fon` fonts, which is the DOS system font, and other two fonts are `.ttf` and `.TTF`. We can just make a copy of all `.ttf` and `.TTF` file and copy all the files to `/usr/share/fonts/` directory under Linux. Although it is illegal under Microsoft's TOC, but we can still do it. :)

If you dual boot your computer, mount the Windows and copy the files

    sudo mkdir /usr/share/fonts/truetype/WindowsFonts
    sudo cp -r /media/Windows/Fonts/*.ttf /usr/share/fonts/truetype/WindowsFonts/
    sudo cp -r /media/Windows/Fonts/*.TTF /usr/share/fonts/truetype/WindowsFonts/

Install open source Chinese fonts, like 文泉驿 - 微米黑 文泉驿 - 正黑

    sudo apt-get install ttf-wqy-microhei ttf-wqy-zenhei

several Chinese font we can choose:

- Google noto <http://www.google.com/get/noto>
- 文泉驿 <http://wenq.org/>

To check more about Chinese font visit Arch [wiki](https://wiki.archlinux.org/index.php/Fonts_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))

## Tip

### Install Software Manager under Linux Mint
Linux Mint user can find a font manager under Software Manager. It is really a cool tool to manager your fonts.

### List all available fonts
`fc-list` is a quick and handy command to lists fonts and styles available on the system for applications using fontconfig. You can use fc-list to find out whether particular language font is installed or not.

To list all font faces:

	$ fc-list

To lists font faces that cover Chinese language:

	$ fc-list :lang=zh

Output will be all available Chinese fonts.

### Fix WPS for Linux font missing error
After I installed WPS for Linux under Linux Mint 17.2, I met this problem, "系统缺失字体 symbol、wingdings、wingdings 2、wingdings 3、wedding”. According to the copyright, WPS for Linux doesn’t contains these five fonts. You can only find these five fonts and install them in the right place like I said before. One way to find these fonts is to find them in Microsoft Windows system. And another way is to download these files from Internet and install.

## Install Korean fonts
Use following command to search Korean font

	apt-cache search korean font

and use this command to install Korean font to linux:

	sudo apt-get install fonts-unfonts-core fonts-unfonts-extra

### 常识 {#common-sense}
字体类型：

- `Sans-serif` 无衬线体 = 黑体：并不是具体一款字体，而是一类字体，选择它其实等于选择这类字体中优先级最高的那款字体。
- `Serif` 衬线体 = 白体：同上
- `Monospace` 等宽字体，意思是字符宽度相同：同上
- `点阵字体`  位图字体

无衬线体更适合电脑屏幕阅读，衬线体适合打印。因为衬线可以使得人视线平齐于一行。也就是说不会读破行。

中文显示时有不同的方式，一方面因为中文本身拥有的横和同高度就可以导致这种平齐。行距对中文更重要。

For more information check Debian [page](https://wiki.debian.org/Fonts) Arch [wiki](https://wiki.archlinux.org/index.php/Fonts_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)) and Ubuntu [wiki](http://wiki.ubuntu.com.cn/%E5%AD%97%E4%BD%93)

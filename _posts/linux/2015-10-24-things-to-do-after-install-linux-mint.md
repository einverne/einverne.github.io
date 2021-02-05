---
layout: post
title: "Things to do after install Linux Mint"
tagline: ""
description: ""
category: Linux
tags: [linux, linux-mint, applications, ]
last_updated: 2016-04-04
---

I have changed my desktop environment to Linux, and after I tried Ubuntu and Debian, I finally choose the Linux Mint distribution. I think there are some reasons why this distribution take the first place in [distrowatch](http://distrowatch.com/). User-friendly desktop environment and convenient software package manager make me very comfortable. Cause it is based on the Debian and Ubuntu, most of the applications are familiar.

## Install a theme

The simplest way to install a new Cinnamon theme is with the Themes manager in System settings.

Go to System Settings -> Themes -> Get More Online -> Refresh list. You can choose Most Popular or Latest. The theme will be installed to your hidden folder `~/.themes`

### Dark Blue Glass

I highly recommend my modified Dark Blue Glass theme [link](https://github.com/einverne/dark-blue-glass). It is a mix of Dark Glass and mint numix blue theme. Or you can find more themes on the following sites:

- Themes (this is the official linux mint theme sites which you can directly download this themes and install in your cinnamon desktop environment):<https://cinnamon-spices.linuxmint.com/themes>
- Mint Numix Blue:<https://cinnamon-spices.linuxmint.com/themes/view/434>
- Dark Glass link:<http://gnome-look.org/content/show.php/Dark+Glass?content=171257>
- Numix Cinnamon Blue:<http://cinnamon-spices.linuxmint.com/themes/view/196>
- Noobslab themes and icons:<http://www.noobslab.com/p/themes-icons.html>
- Numix project:<https://numixproject.org/> and PPA for numix [project](https://launchpad.net/~numix/+archive/ubuntu/ppa)

## icons

You can install a new icon set in two ways. One is by adding a PPA. You add the PPA, install the icon set. But you won’t find icon sets for all the icon themes. Therefore, the other way round is to download the compressed file and extract it to `~/.icons` or `~/.local/share/icon` . If this directory doesn’t exist, create one using the following command:

	mkdir ~/.icons

The icons extracted in the above directory will be available for the current user only. If you want the icons to be available for all the users, you should extract the icons to `/usr/share/icons` .

Now, once you have installed the icon set, you can use a Unity Tweak Tool to change the icon theme. Use the following command to install Unity Tweak Tool:

	sudo apt-get install unity-tweak-tool

Or in Linux mint you can just change icons under setting -> theme -> icons.

I highly recommend this one: **papirus icons**

	sudo add-apt-repository ppa:varlesh-l/papirus-pack
    sudo apt update
	sudo apt install papirus-icons

- papirus suite:<https://github.com/varlesh/papirus-suite>
- link:<https://launchpad.net/~varlesh-l/+archive/ubuntu/papirus-pack>
- Ioncs:<http://www.noobslab.com/p/themes-icons.html>
- PPA:<https://launchpad.net/~noobslab/+archive/ubuntu/icons/>

## Software Sources
You didn't need to edit`/etc/apt/sources.list` and files under `/etc/apt/sources.list.d/` mannually. All customs can be changed through UI. Just click "start menu" and choose the "Software Sources". And this application can even custom the PPAs.

![linux mint software sources managers](https://lh6.googleusercontent.com/-I7XpHcVbcmM/VjTkvQx9VNI/AAAAAAAA2cU/d___YHrcXDI/w874-h573-no/software%2Bsource%2BScreenshot%2Bfrom%2B2015-10-21%2B23%253A39%253A18.png)

## Necessary applications

### Chrome
First is web browser, and of course **Chrome**. I am crazy about Google, and all Google related things. I have used Chrome since year 2011, after I am tried of the Firefox's slowness. Although Firefox become more and more light, faster this years, I get used to Chrome. And what Chrome done makes me really happy. First thing is the bookmark and extension etc sync. I can reach all of my staff and customizations, after I login into my account. I don't even need to worry about anything. All my Apps, Extensions, Settings, Autofill informations, History, Themes, Bookmarks, Passwords, and even Open tabs always follow my account. I can reach my opening tab on desktop from my Android phone. I can reopen bookmarks on my home laptop, which I added in my laboratory computer. And I can open `chrome://history` page to check all current opening tags from signed-in devices, and even check the unread article in the  opening tab on my phone and browser all my chrome history.

### sogou input method
It is necessary to have an input method for typing Chinese which I speak. I choose the sogou input method, because it is easy to use and have a very Good word dictionary. Sogou input method is based on fcitx. In Linux mint setting panel, we have the Language setting, we can choose to install fcitx components.

More detail information can be found in this [blog article](http://ram.lijun.li/linux-linuxmint-17-chinese-input-sogoupinyin.html).

Following can be done through user interface, no need to run. Pasting here only for reference.

    sudo apt-get install fcitx fcitx-table-wubi-large fcitx-frontend-all fcitx-frontend-gtk2 fcitx-frontend-gtk3 fcitx-frontend-qt4 fcitx-config-gtk fcitx-ui-classic fcitx-module-kimpanel fcitx-module-dbus fcitx-libs-qt
    sudo apt-get install fcitx fcitx-bin fcitx-config-common fcitx-config-gtk fcitx-data fcitx-frontend-all fcitx-module-cloudpinyin fcitx-module-dbus fcitx-module-kimpanel fcitx-module-x11 fcitx-modules fcitx-qimpanel-configtool

After installation, "start", "Fcitx Configuration" can config the input method, just add "Sogou Pinyin" to the panel.

### shadowsocks
Use to cross China's great firewall. Don't need to talk more.

     pip install shadowsocks # install command line tool

If pip is missing, install pip first.

PPA is for Ubuntu >= 14.04.

    sudo add-apt-repository ppa:hzwhuang/ss-qt5
    sudo apt-get update
    sudo apt-get install shadowsocks-qt5

To install Qt version of shadowsocks. From:[GitHub](https://github.com/shadowsocks/shadowsocks-qt5/wiki/Installation).

## Hardware related

### Nvidia driver
"System settings" , "Driver Manager", choose the right latest driver and install. After installation, you will find Nvidia icon at the right-bottom corner. Double click the icon to open the setting panel. In order to save the battery , you can use Intel(Power Saving Mode) for most time. And if choose NVIDIA(Performance Mode) for high performance need.

![Nvidia driver](https://lh3.googleusercontent.com/-aGzNJ1OCjS8/VjTlDWHz6-I/AAAAAAAA2cw/lfoLvcwk1Y8/w642-h508-no/nvidia%2Bdriver%2BScreenshot%2Bfrom%2B2015-10-22%2B10%253A04%253A49.png)

### hardinfo
Install hardinfo tool to check hardware information through GUI

     sudo apt-get install hardinfo

## System tools
If there is no special instruction, all of the following applications can be installed from the Software Manager in Linux Mint.

### gnome do
As it official introduction said "Do things as quickly as possible (but no quicker) with your files, bookmarks, applications, music, contacts, and more!". I set a shortcut <kbd>Alt</kbd>+<kbd>Space</kbd> to launch Gnome do. And you can just type several keys to start any application quickly.

install following package:

- gnome-do
- gnome-do-plugins

### guake
Use F12 to open a terminal. Dropdown terminal, you can right click the terminal after you press F12 to configure your guake.

### PlayOnLinux
"PlayOnLinux is a front-end for wine. It permits you to easily install Windows Games and software on Linux. It is advised to have a functional internet connection." I use playonlinux to install Evernote and cloudmusic(网易云音乐). Although I met a lot of problems during installation of Evernote. But finally evernote 5.8.x can be installed on wine 1.7.x.

There are several packages you need to install to make PlayOnLinux work.

- wine
- wine mono
- wine gecho
- ttf-mscorefonts-installer

## Tools

Most of the following can be installed from default Software Manager. Just type name of the application and search then click install.

### 网易云音乐 {#cloud-music}
cloud music client and my favourite music client. Here is the [link](http://music.163.com/) to it's official site, where you can found clients for all platforms include linux.

### Evernote
my favourite cloud notebook with a very clean Android client.

### shutter
Linux mint 17 has a default screenshot software called Screenshot. It is a very simple screenshot software. Shutter is more powerful.

### Dropbox
Sync all my files. When I installed Dropbox through it's offical installer, there was a problem I cannot connect to Dropbox directly from China. Here is a solution to redirect connections to shadowsocks sock5 proxy. You should install `proxychains`.

    sudo apt install proxychains
    # config socks4 127.0.0.1 9050  To socks5 127.0.0.1 1080 which is the default of shadowsocks
    vi /usr/local/etc/proxychains.conf
    # then use proxychains to start dropbox
    proxychains4 dropbox start -i

Then dropbox will start to start and install, then after installation you can set sock5 proxy in dropbox settings.

### BCloud
Baidu pan linux port. It is really a great work. Thank the author.

You can download [here](https://github.com/LiuLang/bcloud-packages)

### remmina
Remote desktop connection client able to display and control a remote desktop seesion. It supports multiple network protocols in an integrated and consistant user interface. Currently RDP, VNC, NX, XDMCP and SSH protocols are supported.

### Gufw
linux firewall.

### Calibre
E-book manager, 电子书管理. It is very efficient when you plug in kindle using USB port Calibre is prepare to serve.

### WizNote
Evernote like cloud notebook client. Find more information [here](http://blog.wiz.cn/wiznote-linux.html). You can install through PPA:

    $ sudo add-apt-repository ppa:wiznote-team
    $ sudo apt-get update
    $ sudo apt-get install wiznote

### SimpleScreenRecorder
one of the screenrecoders I use.

### Picasa
Best image and picture manager ever from Google.

### audacity audio editor
record and edit audio files

### kdenlive video editor
non-linear video editing suite.

### WPS Office for Linux
Office software include writer, spreadsheets and presentation.

### KeePassX
Password manager. But I prefer LastPass.

### youdao dict
This client really make me impressed. It is faster and simple than any other platform client. Launch it with Gnome do, and use it to check English word is a very happy work. Someone used to recommand me the StarDict, but I think youdao dict is a better choice for me.

### Docky
Elegant, powerful, clean dock.

Or there is another choice Cairo Dock.

### ntfs configuration tool
Install this tool using this command:

     sudo apt-get install ntfs-config

and you can find NTFS Configuration Tool in the menu. It is a very efficient tool to auto mount windows NTFS partitions. You can setup to auto-mount when your Linux mint start up. It is really useful if you have a second hard drive installed and you want it to auto-mount each time you restart your system.

### smplayer or vlc
video player always need one. Personally, I like smplayer more.

### Nuvola Player 3
You can follow the instruction on it's official [site](http://tiliado.github.io/nuvolaplayer/documentation/3.0/install.html). It was great, espcially when you want to listen to music at Google Play Music, or other cloud stream music. It support a lot of services, like Amazon Cloud Player, Play Music, Plex Music, Spotify, Tuneln, etc.

### birdie
Birdie is beautiful Twitter client for GNU/Linux.

PPA (14.04) Birdie can be installed from our PPA, which provides automatic updates whenever we improve the application.

    $ sudo add-apt-repository ppa:birdie-team/stable
    $ sudo apt-get update
    $ sudo apt-get install birdie

from it official site:<http://www.birdieapp.eu>

### FFmpeg
all the detail information can be found at it’s official [site](https://www.ffmpeg.org/download.html).

    $ sudo add-apt-repository ppa:mc3man/trusty-media
    $ sudo apt-get update
    $ sudo apt-get install ffmpeg

### Teamviewer
Remote control application. I need it to help to connect my mac in lab and other Windows machine. You can download [here](https://www.teamviewer.com/en/download/linux.aspx). And because it is cross-platform. You can install in other OS and connect it easily.

## Programming tools

### vim
Use `apt-get search vim` to search related vim packages, you will find several packages,like vim-gtk, vim-gnome etc. Install vim and vim-gtk package to install vim and gvim. And config my vim with my dotfile, <https://github.com/einverne/dotfiles>.

### git
best version control system. And I am using SmartGit.

### SmartGit
Git GUI

### Sublime Text
Text Editor. Later I found Atom which is also great.

### haroopad
markdown editor.

### eclipse with jdt and cdt
sometime need java and c++ IDE for test.

### boost
install boost library from source using the following code:

     sudo apt-get install libboost-all-dev

all boost library is located at `/usr/include/boost`

### Android Studio
Check official site for more information.

### PyCharm
Python IDE

### ZeroBrane Studio
Lua IDE

### SQLiteman
Sqlite manager

## Applets

### Weather
You can have your local weather forecast in desktop.

### Desktop Capture
Screenshot and screencasting tools which saves me a lot of time.

I have created a list in [Youtube](https://www.youtube.com/playlist?list=PLKHfgb7QQO0imWboMrQxovJ-G2urwot01), you can check it for information.

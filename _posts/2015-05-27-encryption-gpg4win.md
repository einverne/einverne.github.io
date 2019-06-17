---
layout: post
title: "加密入门（四）：Gpg4win"
description: "加密，Gpg4win, windows"
category: encryption
tags: [encryption, efs, windows,]
---

Gpg4win 是一款基于 GPG 的非对称加密软件。非对称加密方式，简单理解就是用公钥加密文件，用私钥解密文件。如果你需要发送加密信息，首先获取接收者的公钥，然后利用该公钥加密后传递，对方利用对应的私钥就可解密。也就是说，公钥是锁，私钥是钥匙。非对称加密方式很好地解决了传递机密信息的问题。

GPG，又称为 GnuPG，全称是 Gnu Private Guard，即 GNU 隐私卫士。GPG 是以 PGP 算法为核心的强大的加密软件。但 GPG 项目是一套命令行程序，而且是为 Linux 等开源操作系统设计的。好在开发者为 GPG 开发了许多图形前端并将其迁移到 Windows 平台，Gpg4win 就是 Windows 平台 GPG 及图形前端的集合安装包，本文将介绍 Gpg4win 中图形前端的使用方法，不会涉及 GPG 的命令行使用方法。

##1. 下载安装 Gpg4win

首先到官方网站下载 Gpg4win，进入下载页面之后点击下载按钮即可下载。

在开始安装 Gpg4win 之前，我们先来了解一下 Gpg4win 是由哪些组件组成的。Gpg4win 的核心是 GPG，并包括 Kleopatra、GPA、GpgOL、GpgEX 和 Claws Mail 五个相关工具，其中 Kleopatra 和 GPA 是 GPG 的密钥管理器，用于生成、导入和导出 GPG 密钥（包括公钥和私钥），GpgOL 是 Outlook 2003 和 2007 的 GPG 支持插件，GpgEX 是资源管理器的 GPG 支持插件（不支持 Windows 64 位），Claws Mail 则是一个内置 GPG 支持的邮件客户端。本文将介绍 Kleopatra 和 GpgEX 的使用方法。

运行 Gpg4win 安装程序，选择安装组件时建议修改默认设置，默认 Gpg4win 将安装 GnuPG 核心、Kleopatra、GpgOL、GpgEX 以及支持文档（英文和德文）。我推荐只选择 Kleopatra 和 GpgEX。

其余的安装过程保持默认设置即可。安装完成之后安装程序会要求设置信任的根证书，勾选下方的“Root certificate defined or skip configuration”（根证书已定义或跳过设置），该设置只对 S/MIME 加密造成影响，而通常我们使用的是 OpenPGP 标准，即 PGP 算法。最后结束整个安装过程即可。

##2. 创建密钥对

GPG 作为非对称加密软件，进行加密解密之前必须生成密钥对，也就是生成对应公钥和私钥。请按以下步骤使用 Kleopatra 生成密钥对：

1. 运行 Kleopatra，点击 File（文件）菜单中的 New Certificate（创建新证书）一项，运行 Certificate Creation Wizard（证书创建向导）。
2. 进入证书类型页面，有两个选项可供选择：第一项是 OpenPGP 密钥对，第二项是 X.509 密钥对及证书。此处我们选择第一项。
3. 进入详细信息页面，需要填入密钥对的详细信息，包括 Name（姓名）、Email（电子邮箱地址）和 Comment（附加信息）三项。点击 Advanced Settings（高级设置）按钮，可以对密钥算法和强度以及密钥用途进行设置，为了增强安全性可以在上方的密钥强度中选择最高的 3072 bits（3072 位），下方的密钥用途设置主要有三个设置：Signing（签名）、Encryption（加密）和 Authentication（认证），维持默认设置即可，最后的 Valid until 选项可以设置密钥到期时间。设置完成点击下一步。
4. 最后确认密钥对的相关设置。点击 Create Key（创建密钥）按钮，程序将要求输入 Passphrase（密码短语），Passphrase 是使用私钥之前需要输入的密码短语，不过与普通密码相比，Passphrase 长度更长，而且可以包含空格。输入 Passphrase 之后还可以在下图所示的文本框中输入帮助计算机创建更为安全的密钥，输入内容无关紧要，计算机只是利用击键的间歇时间生成随机数，或者也可以移动这一窗口来帮助计算机生成随机数。
5. 最后 Kleopatra 将提示创建密钥对完成，下方三个选项是备份密钥对、通过 Email 发送公钥和将公钥上传到服务器，如果不需要执行上述操作点击 Finish（完成）即可。

##3. 导入导出公钥

生成密钥对之后，我们必须导出公钥，请按以下步骤导出公钥：

1. 在 Kleopatra 主界面中右键点击要导出公钥的密钥对，在右键菜单中选择 Export Certificates（导出证书）。
2. 指定公钥的保存路径和文件名称。

除此之外，菜单中其他两项导出选项含义如下：

- Export Secret Keys（导出私钥）：用以导出密钥对。
- Export Certificates to Server（导出证书到服务器）：用以将公钥导出到服务器上。其他用户可以在存放公钥的公有服务器上搜索公钥并导入，默认的公钥服务器是 keys.gnupg.net。

导入公钥可以通过 File（文件）菜单中的 Import Certificates（导入证书）选项进行，也可以直接利用拖拽操作将公钥文件拖到 Kleopatra 的密钥列表，然后在弹出的菜单中选择 Import Certificates（导入证书）即可。

对于导出到服务器的公钥，选择 File（文件）菜单中的 Lookup Certificates on Server（在服务器上搜索公钥）选项，输入 Email 地址点击 Search（搜索）按钮就可以找到对应的公钥，点击 Import（导入）按钮就可以导入公钥。

##4. 加密解密文件

导入公钥之后，我们就可以加密文件了。启动加密操作向导有三种途径，一种是在 Kleopatra 主界面中选择 File（文件）菜单中选择 Sign/Encrypt Files（签名 / 加密文件），一种是将要加密的文件或文件夹拖拽到 Kleopatra 主界面中，然后在弹出的右键菜单中选择 Sign/Encrypt（签名 / 加密），一种则是在想要加密的文件或文件夹的右键菜单中选择 Sign and encrypt（签名与加密）。这三种途径没有本质区别，除了第一种途径无法选择文件夹因此只能加密文件。下面对加密向导进行介绍：

1. 首先是选择操作类型，分别是签名并加密、加密和签名，默认选择的是中间一项加密，最下方的复选框 Remove unencrypted original file when done 是指加密完毕删除源文件，为了保证安全建议选上该项。设置完毕点击 Next。
2. 现在向导会列出计算机上的所有公钥，请选择正确的公钥并点击中间的 Add（添加）将其添加到下方的列表中，如下图所示：
3. 选择完毕点击 Encrypt（加密）按钮开始加密，假如你选择的是他人的公钥，那么 Kleopratra 会弹出对话框提示你加密之后你将不能够解密，点击 Continue 确认，保密完成之后点击 Finish 确认即可。
4. 加密完成之后会在源文件所在文件夹生成 .gpg 为扩展名的加密文件，现在你可以把这个文件发给公钥所有者。

接收到已经加密的文件之后应该怎么解密呢？方法和加密非常类似，也是通过向导完成的。启动解密向导的途径同样有三种，一是在 Kleopatra 主界面中选择 File（文件）菜单中选择 Decrypt/Verify Files（解密 / 验证文件），一是将要解密的文件或文件夹拖拽到 Kleopatra 主界面中，然后在弹出的右键菜单中选择 Decrypt/Verify（解密 / 验证），一种则是在想要解密的文件或文件夹的右键菜单中选择 Decrypt and verify（解密和验证）。

以上述任意一种方式启动加密向导，点击解密向导对话框的 Decrypt/Verify（解密 / 验证）按钮，假如弹出对话框，请输入你的私钥的 Passphrase，输入之后点击 OK 就可以使用你的私钥进行解密了，注意在本用户对话期间你再次使用私钥是不需要输入 Passphrase 的，也就是说，使用私钥之后最好注销一下以保证安全。

GnuPG 和其他加密工具相比，其非对称性加密的特点使其更适合于机密信息的传递。除了加密解密之外，GPG 还可以对文件进行签名和验证，功能非常强大。而且由于 GPG 图形化前端功能的日益完善，GPG 的使用已经不再困难，Gpg4win 已经可以成为大众的加密工具。

##本文历史：

2011 年 4 月 4 日：初稿完成
2011 年 8 月 13 日：精简文字


原文地址：加密入门（四）：Gpg4win [http://terrychen.info/encryption-gpg4win](http://terrychen.info/encryption-gpg4win)

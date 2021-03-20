---
layout: post
title: "git-crypt 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [git, git-crypt, beancount, gpg, opengpg, encryption, ]
last_updated:
---


在了解复式计帐开源软件 [Beancount](/post/2019/11/double-entry-bookkeeping.html) 的时候偶然的知道了 git-crypt, 因为 beancount 使用纯文本来记账，非常适合使用 git 来做管理，而个人帐务资产信息又是非常敏感的内容，所以就有了 git-crypt 的使用场景。而在日常的项目管理中，如果遇到代码需要公开，而某些敏感配置，比如数据库连接配置等等，使用相同的原理 git-crypt 也能够有使用场景。

## installation
git-crypt 使用 C++ 编写，安装的过程可以自行编译安装：

	git clone git@github.com:AGWA/git-crypt.git
	sudo apt install make g++ libssl-dev git openssl
	sudo make ENABLE_MAN=yes install

详细参考[官网](https://github.com/AGWA/git-crypt/blob/master/INSTALL.md)，安装后会在 `/usr/local/bin` 目录中，可以使用 `man git-crypt` 来查看说明。

而对于 MacOS, 只需要安装 `git-crypt` ，`gpg` 即可：

	brew install gpg
	brew install git-crypt

## usage

在 git 项目中加密敏感内容

配置加密工具 gpg

        # gpg --gen-key // 生成密钥（公钥和私钥），按照流程提示进行
        # gpg --list-keys // 列出当前所有的密钥，检查刚才的密钥是否生成成功

配置 git-crypt

        cd path/to/project
        git-crypt init          // 类似于 git init，安装 git-crypt 到项目中
        git-crypt add-gpg-user einverne    // 添加密钥用户，这里以我的用户 einverne 为例

添加配置文件 `.gitattributes`
        
        vi .gitattributes

格式为： * filter=git-crypt diff=git-crypt ， 例如我要加密 config 文件夹的三个配置文件 , 则在 `.gitattributes` 文件内加入：

```
secretfile filter=git-crypt diff=git-crypt
*.key filter=git-crypt diff=git-crypt
secretdir/** filter=git-crypt diff=git-crypt
```

上传到 git

        # git rm -r --cached config/     // 清理 config 的 git 缓存
        # git add .
        # git commit -m 'git-crypt'
        # git push

导出密钥

    # git-crypt export-key ~/Desktop/git-crypt-key

导出了密钥以后，就可以分发给有需要的团队内部人员。

当团队其他成员获取了代码以后，需要修改配置文件，需要先解密，解密动作只需要做一次，往后就不需要再进行解密了。

解密

    # git-crypt unlock /path/to/git-crypt-key

## 总结
利用该方式进行配置文件管理可以保证安全性，只有团队内相关人员才能看到配置文件明文内容，解密只需要第一次进行，之后就没什么改变，直接改配置文件，git 提交会自动加密。


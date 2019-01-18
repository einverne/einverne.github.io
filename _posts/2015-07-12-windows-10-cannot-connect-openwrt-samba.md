---
layout: post
title: "Windows 10 无法连接 Openwrt Samba"
description: "Windows 10 无法连接 Openwrt Samba"
category: 经验总结
tags: [samba, windows, openwrt, ]
---

安装完 Win10 之后，发现无法使用 `\\ip\\` 这样的方式来访问 Openwrt 共享出来的文件。这个问题纠结我一整天，差点想要降级到 Win8.1 去，后来总算解决了。首先介绍一下环境：Windows build 10162, Openwrt Samba。

网上介绍说，Win10 最新版的安全机制导致此类“不安全”的访问形式被禁止。所以我尝试这个[帖子](http://answers.microsoft.com/zh-hans/insider/forum/insider_wintp-insider_security/win10/1fe517a5-1560-4cc0-b901-c1562e79beff?auth=1)，给 Samba 加上密码，然后还尝试了关闭了防火墙，最后还是没什么用。然后只能继续寻找方案。然后找到如下方案：

> 首先确认您的权限设置没有问题。然后尝试如下方法
> 打开注册表 Win+R 输入 regedit， 定位到如下位置
> HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters
> 创建一个 DWORD 项， 命名为 'AllowInsecureGuestAuth' ， 值设置为“1”.
> 最后重启计算机再次访问查看结果。

详细介绍请看[这里](https://techjourney.net/cannot-connect-to-cifs-smb-samba-network-shares-shared-folders-in-windows-10/)，这个链接同样详细介绍了错误原因，AllowInsecureGuestAuth 这个键值的意思是允许 guest 用户访问共享。然后设置注册表之后必须使用本地账号，而不能登陆 Microsoft 账号，如果使用微软账号登陆，则又不能访问。出现如下问题：

> 无法访问。你可能没有权限使用网络资源。请与这台服务器的管理员联系以查明你是否有访问权限。此账户并未得到从这个工作站登录的授权。

所以在设置中使用本地账号，然后重启，就解决了这件事情。

本文可解决如下错误：

> - 你没有权限访问、\****。请与网路管理员联系请求访问权限
> - The account is not authorized to log in from this station
> - 无法访问。你可能没有权限使用网络资源。请与这台服务器的管理员联系以查明你是否有访问权限。此账户并未得到从这个工作站登录的授权。
> - 无法访问，你可能没有权限使用。网络资源。请与这台服务器的管理员联系以查明你是否有访问权限。指定的登录会话不存在，可能已被终止

参考：[1](https://social.technet.microsoft.com/Forums/ie/ru-RU/7bd2e0b6-35e4-479e-a58b-1f7b34eedab1/window10windows?forum=WinPreview2014GeneralZHCN) [2](https://answers.microsoft.com/en-us/insider/forum/insider_wintp-insider_web/the-account-is-not-authorized-to-login-from-this/5aa0c61d-7e27-41ce-b1cd-1bedbe5c5ead?auth=1) [3](http://superuser.com/questions/873264/the-account-is-not-authorized-to-log-in-from-this-station#) [4](http://serverfault.com/questions/569442/theaccount-is-not-authorized-to-login-from-this-station-error-while-trying-to) [5](https://answers.microsoft.com/en-us/insider/forum/insider_wintp-insider_web/the-account-is-not-authorized-to-login-from-this/5aa0c61d-7e27-41ce-b1cd-1bedbe5c5ead)

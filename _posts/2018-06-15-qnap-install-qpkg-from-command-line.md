---
layout: post
title: "威联通折腾篇一：使用命令行安装威联通 QNAP 的 qpkg 安装包"
aliases: "威联通折腾篇一：使用命令行安装威联通 QNAP 的 qpkg 安装包"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, qpkg, install, qnap-usage, qnap-tutorial, ]
last_updated:
---

如果想要给威联通安装一个 qpkg 的安装包时，最直观界面方式就是在 App Center 中，[右上角](https://www.qnap.com/en/how-to/knowledge-base/article/how-to-install-qnap-applications-qpkg-files-manually)，将本地的 `.qpkg` 文件上传到 NAS 并安装。

但是这种方式在外网图形界面加载很慢的情况下是非常难用的，那么这个时候如果能使用命令行安装就非常方便。需要在系统中预先开启 SSH 连接，当然这一步早就做好了。然后使用 ssh 连接登录上。比如下面以安装 Entware [为例](https://github.com/Entware/Entware/wiki/Install-on-QNAP-NAS)：

    wget http://bin.entware.net/other/Entware_1.00std.qpkg
    sh Entware_1.00std.qpkg

经过这两个步骤就 OK 了。使用 `opkg` 命令可能需要重新登录 NAS SSH。

其他版本的 Entware 可以从[这里](http://pkg.entware.net/binaries/) 获取。

关于什么是 Entware ，可以查看该 [wiki](https://github.com/Entware/Entware/wiki)，一句话概括 Entware 是一个适用于嵌入式系统的软件包库，使用 opkg 包管理系统进行管理。

软件包列表：

- armv5: <http://pkg.entware.net/binaries/armv5/Packages.html>
- armv7: <http://pkg.entware.net/binaries/armv7/Packages.html>
- mipsel: <http://pkg.entware.net/binaries/mipsel/Packages.html>
- x86-32: <http://pkg.entware.net/binaries/x86-32/Packages.html>
- x86-64: <http://pkg.entware.net/binaries/x86-64/Packages.html>

需要注意的是安装 Entware 之后很多命令都存放在 `/opt/bin` 目录下，需要修改 `/root` 目录下的 `.bashrc` 文件中的 PATH 来使这些命令被命令行所见。

    export PATH=/opt/bin:$PATH

下面是安装 ng 0.97 版本的日志：

    wget http://pkg.entware.net/binaries/x86-64/installer/Entware-ng_0.97.qpkg
    --2018-06-15 10:05:57--  http://pkg.entware.net/binaries/x86-64/installer/Entware-ng_0.97.qpkg
    Resolving pkg.entware.net (pkg.entware.net)... 81.4.123.217
    Connecting to pkg.entware.net (pkg.entware.net)|81.4.123.217|:80... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 25045 (24K) [application/x-gzip]
    Saving to: ‘Entware-ng_0.97.qpkg’

    Entware-ng_0.97.qpkg                            100%[======================================================================================================>]  24.46K  46.2KB/s    in 0.5s

    2018-06-15 10:05:58 (46.2 KB/s) - ‘Entware-ng_0.97.qpkg’ saved [25045/25045]

    [~] # sh Entware-ng_0.97.qpkg
    Install QNAP package on TS-NAS...
    33+1 records in
    33+1 records out
    24322 bytes (23.8KB) copied, 0.000060 seconds, 386.6MB/s
    ./
    ./qinstall.sh
    ./package_routines
    ./qpkg.cfg
    0+1 records in
    0+1 records out
    3842 bytes (3.8KB) copied, 0.000018 seconds, 203.6MB/s
    3+1 records in
    3+1 records out
    3842 bytes (3.8KB) copied, 0.001489 seconds, 2.5MB/s
    Sym-link /opt ...
    Info: Opkg package manager deployment...
    Info: Basic packages installation...
    Downloading http://pkg.entware.net/binaries/x86-64/Packages.gz.
    Updated list of available packages in /opt/var/opkg-lists/packages.
    Installing entware-opt (222108-5) to root...
    Downloading http://pkg.entware.net/binaries/x86-64/entware-opt_222108-5_x86-64.ipk.
    Installing libc (2.23-6) to root...
    Downloading http://pkg.entware.net/binaries/x86-64/libc_2.23-6_x86-64.ipk.
    Installing libgcc (6.3.0-6) to root...
    Downloading http://pkg.entware.net/binaries/x86-64/libgcc_6.3.0-6_x86-64.ipk.
    Installing libssp (6.3.0-6) to root...
    Downloading http://pkg.entware.net/binaries/x86-64/libssp_6.3.0-6_x86-64.ipk.
    Installing librt (2.23-6) to root...
    Downloading http://pkg.entware.net/binaries/x86-64/librt_2.23-6_x86-64.ipk.
    Installing libpthread (2.23-6) to root...
    Downloading http://pkg.entware.net/binaries/x86-64/libpthread_2.23-6_x86-64.ipk.
    Installing libstdcpp (6.3.0-6) to root...
    Downloading http://pkg.entware.net/binaries/x86-64/libstdcpp_6.3.0-6_x86-64.ipk.
    Installing ldconfig (2.23-6) to root...
    Downloading http://pkg.entware.net/binaries/x86-64/ldconfig_2.23-6_x86-64.ipk.
    Installing findutils (4.6.0-1) to root...
    Downloading http://pkg.entware.net/binaries/x86-64/findutils_4.6.0-1_x86-64.ipk.
    Installing terminfo (6.0-1c) to root...
    Downloading http://pkg.entware.net/binaries/x86-64/terminfo_6.0-1c_x86-64.ipk.
    Installing locales (2.23-6) to root...
    Downloading http://pkg.entware.net/binaries/x86-64/locales_2.23-6_x86-64.ipk.
    Installing opkg (2011-04-08-9c97d5ec-17a) to root...
    Downloading http://pkg.entware.net/binaries/x86-64/opkg_2011-04-08-9c97d5ec-17a_x86-64.ipk.
    Configuring libgcc.
    Configuring libc.
    Configuring libssp.
    Configuring libpthread.
    Configuring librt.
    Configuring terminfo.
    Configuring ldconfig.
    Configuring locales.
    Entware uses separate locale-archive file independent from main system
    Creating locale archive - /opt/usr/lib/locale/locale-archive
    Adding en_EN.UTF-8
    Adding ru_RU.UTF-8
    You can download locale sources from http://pkg.entware.net/sources/i18n_glib223.tar.gz
    You can add new locales to Entware using /opt/bin/localedef.new
    Configuring opkg.
    Configuring libstdcpp.
    Configuring findutils.
    Configuring entware-opt.
    Updating /opt/etc/ld.so.cache... done.
    Link service start/stop script: Entware-ng.sh
    Set QPKG information in /etc/config/qpkg.conf
    Enable Entware-ng/opkg
    [App Center] Entware-ng 0.97 installation succeeded.
    [App Center] Entware-ng enabled.


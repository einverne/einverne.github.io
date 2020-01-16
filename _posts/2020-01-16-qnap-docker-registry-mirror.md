---
layout: post
title: "威联通折腾篇十六：为 Container Station 更换镜像"
tagline: ""
description: ""
category: [ 经验总结 , 威联通 ]
tags: [qnap, qnap-tutorial, linux, docker, mirror, ]
last_updated:
---

都知道其实 QNAP 的 Container Station 就是 Docker，所以桌面版可以修改的国内镜像地址，QNAP 系统上也能够修改，可以快速提高镜像的下载速度。

其实在网页管理段也能够手动添加，在 Container Station 属性中，Registry 服务器可以手动添加。

或者我们可以 SSH 登录到后台，然后手动编辑配置文件，docker 的路径是 `/share/CACHEDEV1_DATA/.qpkg/container-station/`

然后在改目录下有 `etc/docker.json` 文件，手动修改该文件：

	{
	  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
	}

然后重启 Container Station 服务：

	/etc/init.d/container-station.sh restart

可用的镜像地址，可以参考我另外一篇文章。

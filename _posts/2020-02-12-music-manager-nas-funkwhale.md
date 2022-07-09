---
layout: post
title: "NAS 上的音乐管理应用 Funkwhale"
tagline: ""
description: ""
category: 经验总结
tags: [nas, qnap, music, file-manager, docker, ]
last_updated:
---

NAS 上的文件已经有足够多的[管理系统](/post/2018/06/qnap-file-sync.html) 了 [^1][^2]，而电影也有 [[Kodi]], [[Emby]], [[Plex]] 等等工具，图片同样 Chevereto，Lychee，电子书有 [Calibre-web](/post/2020/02/qnap-calibre-web.html)，但就是音乐管理工具没有找到一个比较合适的。

## 构想
我想的应该这个管理系统可以直接通过 Docker 安装，提供一个比较美观的 Web 页面。

- Docker
- 映射本地音乐文件夹
- Web 管理界面
- 可以根据文件的 metadata 自动归类，如果可以手工进行编辑就更好了
- 能在线播放

于是乎我带着这样的目的在 [awesome-selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted#audio-streaming) Audio streaming 专区寻找，从编程语言，到 Demo，一个个看，然后就发现了 [Funkwhale](https://funkwhale.audio/) 点开项目主页介绍，界面非常漂亮，Demo 这各个功能也都非常贴心，立即看安装说明，Docker 搞起。并且 Funkwhale 还自带 pot，新建立的站点可以和网络上的站点连接起来相互分享，像极了之前的 SNS Mastodon.

Funkwhale 用 Python，Django 编写，遇到 bug 倒时候也能看懂代码了。

## Install
使用 Docker 安装：

	export FUNKWHALE_VERSION="0.20.1"
	touch .env
	chmod 600 .env  # reduce permissions on the .env file since it contains sensitive data
	cat > .env <<EOD
	# Replace 'your.funkwhale.example' with your actual domain
	FUNKWHALE_HOSTNAME=your.funkwhale.example
	# Protocol may also be: http
	FUNKWHALE_PROTOCOL=https
	# This limits the upload size
	NGINX_MAX_BODY_SIZE=100M
	# Bind to localhost
	FUNKWHALE_API_IP=127.0.0.1
	# Container port you want to expose on the host
	FUNKWHALE_API_PORT=5000
	# Generate and store a secure secret key for your instance
	DJANGO_SECRET_KEY=$(openssl rand -hex 45)
	# Remove this if you expose the container directly on ports 80/443
	NESTED_PROXY=1
	EOD

运行：

	docker run \
		--name=funkwhale \
		--restart=unless-stopped \
		--env-file=/share/Container/funkwhale/.env \
		-v /share/Container/funkwhale/data:/data \
		-v /share/Music:/music:ro \
		-e PUID=1000 \
		-e PGID=1000 \
		-p 6000:80 \
		-d \
		funkwhale/all-in-one:latest

或者使用 docker-compose:

	version: "3"

	services:
	  funkwhale:
		container_name: funkwhale
		restart: unless-stopped
		# add the version number in your .env file, or hardcode it
		image: funkwhale/all-in-one:0.20.1
		env_file: /share/Container/funkwhale/.env
		environment:
		  # adapt to the pid/gid that own /srv/funkwhale/data
		  - PUID=1000
		  - PGID=1000
		volumes:
		  - /share/Container/funkwhale/data:/data
		  - /share/Music/:/music:ro
		ports:
		  - "6000:80"


## 导入音乐文件
使用如下命令导入文件：

```
# For file structures similar to ./Artist/Album/Track.mp3
docker exec -it funkwhale manage import_files $LIBRARY_ID "/music/**/**/*.mp3" --in-place --async
```

这里的 LIBRARY_ID 需要到界面中找。

## 外延

### koel
[[Koel]] 是一个基于网页的音乐媒体播放器。

官网：<https://koel.dev/>

- <https://koel.phanan.net/>


### Koozic

- <https://koozic.net/>

[^1]: [FileRun](/post/2018/06/filerun.html)
[^2]: [NextCloud](/post/2018/04/nextcloud.html)

### airsonic

- [[Airsonic]]
- <https://github.com/airsonic/airsonic>

## reference

- <https://github.com/tarkusdev/docker-funkwhale>
- <https://docs.funkwhale.audio/index.html>
- <https://docs.mopidy.com/en/latest/installation/>

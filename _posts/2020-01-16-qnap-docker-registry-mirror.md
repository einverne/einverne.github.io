---
layout: post
title: "威联通折腾篇十六：为 Container Station 更换镜像"
aliases: "威联通折腾篇十六：为 Container Station 更换镜像"
tagline: ""
description: ""
category: [ 经验总结 , 威联通 ]
tags: [qnap, qnap-tutorial, linux, docker, mirror, ]
last_updated:
---

都知道其实 QNAP 的 Container Station 就是 Docker，所以桌面版可以修改的国内镜像地址，QNAP 系统上也能够修改，可以快速提高镜像的下载速度。

其实在网页管理段也能够手动添加，在 Container Station 属性中，Registry 服务器可以手动添加。

或者我们可以 SSH 登录到后台，然后手动编辑配置文件，docker 的路径是 `/share/CACHEDEV1_DATA/.qpkg/container-station/`

然后在该目录下有 `etc/docker.json` 文件，手动修改该文件：

	{
	  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
	}

然后重启 Container Station 服务：

	/etc/init.d/container-station.sh restart

可用的镜像地址，可以参考我另外一篇文章。

## 备份一下用的 Docker Container

### bookstack

	version: "2"
	services:
	  bookstack:
		image: linuxserver/bookstack
		container_name: bookstack
		environment:
		  - PUID=1000
		  - PGID=1000
		  - DB_HOST=10.0.3.1:3306
		  - DB_USER=bookstack
		  - DB_PASS=password
		  - DB_DATABASE=bookstack
		volumes:
		  - /share/Container/bookstack_config:/config
		ports:
		  - 6875:80
		restart: unless-stopped


### FileRun

```
version: '2'

services:
  filerun:
    image: afian/filerun
    container_name: filerun
    environment:
      FR_DB_HOST: 10.0.3.1
      FR_DB_PORT: 3306
      FR_DB_NAME: filerun
      FR_DB_USER: filerun
      FR_DB_PASS: password
      APACHE_RUN_USER: www-data
      APACHE_RUN_USER_ID: 1000
      APACHE_RUN_GROUP: www-data
      APACHE_RUN_GROUP_ID: 100
    ports:
      - "30080:80"
    volumes:
      - /share/filerun/html:/var/www/html
      - /share/filerun/user-files:/user-files
    restart: unless-stopped
```

### Calibre-web

```
docker run --name=calibre-web --restart=always \
-v /share/vol4Book/CalibreBooks:/books \
-v /share/Container/calibre-web/app:/calibre-web/app \
-v /share/Container/calibre-web/kindlegen:/calibre-web/kindlegen \
-v /share/Container/calibre-web/config:/calibre-web/config \
-e USE_CONFIG_DIR=true \
-e APP_REPO=https://github.com/janeczku/calibre-web.git \
-e APP_BRANCH=master \
-e SET_CONTAINER_TIMEZONE=true \
-e CONTAINER_TIMEZONE=Asia/Shanghai \
[-e PGID=100 -e PUID=1000 \]
-p 8083:8083 \
technosoft2000/calibre-web
```

### Nextcloud
```
docker run -d \
    -v /share/NextCloud:/var/www/html \
	-p 20080:80 \
    nextcloud
```

### Gogs

```
docker run --name=gogs \
-p 10022:22 \
-p 10080:3000 \
-v /share/gogs:/data \
gogs/gogs
```

### TT RSS
Tiny Tiny RSS

```
docker run -d --name ttrss --restart=unless-stopped \
-e SELF_URL_PATH=http://192.168.2.200:181 \
-e DB_HOST=10.0.3.1 \
-e DB_PORT=5432 \
-e DB_NAME=ttrss \
-p 181:80 \
wangqiru/ttrss
```

全文插件：

```
docker run -d \
--name=mercury-parser-api \
-p 3080:3000 \
wangqiru/mercury-parser-api
```



### weblate

```
version: '3'
services:
  weblate:
    image: weblate/weblate
    volumes:
      - /share/Container/weblate/weblate-data:/app/data
    env_file:
      - ./environment
    restart: always
	ports:
	  - 5080: 8080
    depends_on:
      - database
      - cache
  database:
    image: postgres:11-alpine
    env_file:
      - ./environment
    volumes:
      - /share/Container/weblate/postgres-data:/var/lib/postgresql/data
    restart: always
  cache:
    image: redis:4-alpine
    restart: always
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - /share/Container/weblate/redis-data:/data
```

还需要把[这个项目](https://github.com/WeblateOrg/docker-compose) 中的 environment 文件拷贝过来，然后再：

	docker-compose build
	docker-compose up

### rrshare

	docker run -d \
	--name rrshare \
	-p 3001:3001 \
	-v /share/rrshare:/opt/work/store \
	oldiy/rrshare64:latest

### Lychee

```
docker run -d \
--name=lychee-laravel \
--restart always \
-v /share/Container/lychee/conf:/conf \
-v /share/Picture/Lychee:/uploads \
-e PHP_TZ=Asia/Shanghai \
-e PHP_MAX_EXECUTION_TIME=600 \
-e DB_CONNECTION=sqlite \
-e DB_DATABASE=/conf/lychee.db \
-p 90:80 \
80x86/lychee:latest
```

### flexget

```
docker run -d \
    --name=flexget \
    -p 3539:3539 \
    -v /share/Container/flexget/data:/data \
    -v /share/Container/flexget/config:/config \
    -e FG_WEBUI_PASSWD=password \
    -e FG_LOG_LEVEL=info \
    -e PUID=1000 \
    -e PGID=1000 \
    -e TZ=Asia/Shanghai \
    wiserain/flexget
```

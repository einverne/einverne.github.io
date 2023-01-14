---
layout: post
title: "使用 Owncast 搭建自己的在线视频串流直播间"
aliases:
- "使用 Owncast 搭建自己的在线视频串流直播间"
tagline: ""
description: ""
category: 学习笔记
tags: [ owncast, docker-compose, docker, livesteam,  ]
create_time: 2022-06-27 04:53:45
last_updated: 2022-07-27 05:36:18
---

Owncast 是一个开源，可自行架设的、去中心化的，单用户视频串流工具。Owncast 使用 Go 语言编写。支持简单的在线聊天，支持 HLS 和 S3 存储。

- GitHub：<https://github.com/owncast/owncast>

Owncast 可以很好的成为 Twitch，YouTube Live 等等在线直播平台的代替。用户可以完整地控制自己的内容以及服务器。

## Prerequisite

- Ubuntu 20.04
- [[FFmpeg]] 4.2 以上版本，需带有 x264/var_stream_map

## Docker 安装
Docker compose[^1] 如下：

[^1]: <https://github.com/einverne/dockerfile>

```
version: '3.3'

services:
  owncast:
    image: 'gabekangas/owncast:latest'
    restart: always
    volumes:
      - '${CONFIG_PATH}/data:/app/data'
    ports:
      - '8080:8080'
      - '1935:1935'
```

启动容器之后，进入 `/admin` 页面，默认的用户名和密码是，admin 和 `abc123`。

## 手动安装

安装 FFmpeg

```
apt update
apt install ffmpeg
```

下载 owncast：

```
mkdir -p /opt/owncast && cd /opt/owncast
wget https://github.com/owncast/owncast/releases/download/v0.0.2/owncast-0.0.2-linux-64bit.zip
unzip owncast-0.0.2-linux-64bit.zip
```

修改配置文件：

```
vim config.yaml
```

修改自己的串流秘钥和信息，样例文件内容如下：

```
# See https://owncast.online/docs/configuration/ for more details

instanceDetails:
  name: EV   //名称
  title: EV Live Stream  //网站标题

  logo:
    small: /img/logo128.png
    large: /img/logo256.png

  tags:
    - music
    - software
    - streaming

  # https://owncast.online/docs/configuration/#external-links
  # for full list of supported social links.  All optional.
  socialHandles:
    - platform: github
      url: http://github.com/owncast/owncast
    - platform: mastodon
      url: http://mastodon.something/owncast

videoSettings:
  # Change this value and keep it secure.  Treat it like a password to your live stream.
  streamingKey: secret_key   //串流秘钥
```

启动 owncast

```
./owncast
```

启动后查看日志文件 transcoder.log 如果没有报错着运行成功,如报错无法正常串流播放

可以使用 screen 或者 [[tmux]] 等工具在使用后台运行 owncast:

```
screen -S live  //创建新的命令行
cd cd /opt/owncast  //进入目录
./owncast  //执行脚本
```

服务器需要开放端口 1935,8080

设置 OBS 串流

服务器 rtmp://127.0.0.1/live
串流秘钥 [secret]

播放地址 http://127.0.0.1:8080

成功运行之后，日志文件在 `transcoder.log`

## 自动安装

```
cd /your/own/path
curl -s https://owncast.online/install.sh | bash
```

执行成功之后会返回默认的端口和默认的 streaming key。

```
cd owncast
./owncast
# change port
./owncast -webserverport 8095
```

配置 Nginx 反向代理，如果熟悉 [[Nginx Proxy Manager]] 也可以直接使用这个反向代理。

添加配置文件 `vi /etc/nginx/conf.d/owncast.conf`:

```
server {
    listen 80;
    server_name     你的域名;

    location / {
        proxy_pass http://127.0.0.1:8080;    #8080改为Owncast对外开放的端口，默认为8080
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

测试：

```
nginx -t
```

使配置生效：

```
nginx -s reload
sudo systemctl start nginx
sudo systemctl enable nginx
# 获取证书
sudo certbot --nginx
```

配置 [[systemd]]，修改文件 `vi /etc/systemd/system/owncast.service`:

```
[Unit]
Description=Owncast Service

[Service]
Type=simple
WorkingDirectory=/your/own/path/owncast  #注意替换位置
ExecStart=/your/own/path/owncast/owncast  #注意替换位置
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

生效：

```
systemctl daemon-reload
systemctl enable owncast
systemctl start owncast
```

## 设置 OBS
在 [OBS 官网](https://obsproject.com/) 安装OBS，在设置>服务中选择自定义（Custom），在管理员页面获取RTMP服务器链接和流密钥并填入OBS中，点击Start Streaming测试链接，开始推流。

## FFmpeg
也可以直接从命令行使用 [[FFmpeg]] 来推流到 Owncast 服务器。

```
ffmpeg -re -i /path/to/video.mp4 -c copy -f flv rtmp://localhost:1935/live/secret_key
# or
ffmpeg -i "http://IP_OF_HDHR:5004/auto/vCH.N" -c:v libx264 -c:a aac -b:v 512K -maxrate 512K -bufsize 1M -f flv rtmps://OWNCAST_URL:PORT/live/STREAM_KEY
# or
ffmpeg -video_size 1280x720 -i $1 \
  -c:v libx264 -b:v 512k -maxrate 1984k -bufsize 3968k \
  -c:a aac -b:a 128k -ar 44100 \
  -f flv rtmp://live.einvrne.info/live/KEY
```

或者：

```
ffmpeg -f alsa -ac 2 -i hw:1,0 -thread_queue_size 64 \
  -f v4l2 -framerate 60 -video_size 1280x720 -input_format yuyv422 -i /dev/video2 \
  -c:v libx264 -preset veryfast -b:v 1984k -maxrate 1984k -bufsize 3968k \
  -vf "format=yuv420p" -g 60 -c:a aac -b:a 128k -ar 44100 \
  -f flv rtmp://<ip-of-your-server>/live/<your-streaming-key>
```

如果串流 MP4 遇到：

> Codec mpeg4 is not supported in the official FLV specification,

解决方案：

```
ffmpeg -re -nostdin -i "$file" \
    -vcodec libx264 -preset:v ultrafast \
    -acodec aac \
    -f flv rtmp://<your-server>/app/STREAM_KEY
```

说明：

- `-vcodec codec` 设置视频编码器，是 `-codec:v` 的别名
- `-acodec codec` 设置音频解码器，是 `-codec:a` 的别名
- `-nostdin` 表示禁止交互输入
- `-preset:v` 表示使用 FFmpeg 默认的[编码](https://trac.ffmpeg.org/wiki/Encode/H.264)，按速度降序 ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow, placebo
- `-f fmt` 强制指定输入或输出的文件格式

ffmpeg -re -i ~/INPUT_FILE -vcodec libx264 -profile:v main -preset:v medium -r 30 -g 60 -keyint_min 60 -sc_threshold 0 -b:v 2500k -maxrate 2500k -bufsize 2500k -filter:v scale="trunc(oha/2)2:720" -sws_flags lanczos+accurate_rnd -acodec libfdk_aac -b:a 96k -ar 48000 -ac 2 -f flv rtmp://live.twitch.tv/app/STREAM_KEY



## reference

- <https://www.vultr.com/docs/how-to-use-owncast-with-obs-on-ubuntu-20-04>
- <https://stackoverflow.com/a/65424876/1820217>
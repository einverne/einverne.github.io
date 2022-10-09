---
layout: post
title: "又一个简单漂亮的静态个人导航站 Homer"
aliases:
- "又一个简单漂亮的静态个人导航站 Homer"
tagline: ""
description: ""
category:
tags: [ homer, navigation, website, docker, linux ]
last_updated:
---

Homer 是一款简单漂亮的静态个人导航站，通过简单的 YAML 配置就可以快速生成一个个人导航站。

![homer](/assets/homer-20210826212503.png)

特性：

- 支持通过 YAML 配置
- 支持 PWA
- 支持搜索
- 支持分组
- 自定义主题
- 快捷键支持，`/` 搜索，`Escape` 退出搜索，`Enter` 打开第一个匹配，`Alt/Option + Enter` 在新标签页打开

## 安装
Docker 命令：

```
docker run -d \
  --name homer \
  -p 8080:8080 \
  -v </your/local/assets/>:/www/assets \
  --restart=always \
  b4bz/homer:latest
```

 [docker-compose](https://github.com/einverne/dockerfile) 配置见 [GitHub](https://github.com/einverne/dockerfile)

## 配置
Homer 通过 YAML 配置：

```
---
title: "Homelab Dash"
subtitle: "always-on"
documentTitle: "Homelab Dash"
logo: "logo.png"

columns: 3
header: true
footer: false
connectivityCheck: false

theme: default
colors:
  light:
    highlight-primary: "#3367d6"
    highlight-secondary: "#4285f4"
    highlight-hover: "#5a95f5"
    background: "#f5f5f5"
    card-background: "#ffffff"
    text: "#363636"
    text-header: "#ffffff"
    text-title: "#303030"
    text-subtitle: "#424242"
    card-shadow: rgba(0, 0, 0, 0.1)
    link-hover: "#363636"
  dark:
    highlight-primary: "#1B3E88"
    highlight-secondary: "#1b4d9e"
    highlight-hover: "#2b579e"
    background: "#121212"
    card-background: "#1D1D1D"
    text: "#eaeaea"
    text-header: "#f7f7f7"
    text-title: "#fafafa"
    text-subtitle: "#f5f5f5"
    card-shadow: rgba(0, 0, 0, 0.4)
    link-hover: "#ffdd57"

links:
  - icon: "far fa-edit"
    url: "http://files.svr2:9800/files/homer/config.yml"
    
  - icon: "fab fa-docker"
    url: "http://files.server:9800/files/compose.yml"
    
  - name: 2
    icon: "fab fa-docker"
    url: "http://files.svr2:9800/files/compose.yml"
    
  #- icon: "fas fa-file-download"
#    url: "http://torrent.svr2/"
    
  - icon: "fas fa-fire"
    url: "http://prometheus.server" # Prometheus
    
  - icon: "fas fa-wifi"
    url: "http://routerlogin.net"

  - icon: "fas fa-satellite-dish"
    url: "http://satellite.lan"

  - icon: "fas fa-cloud-download-alt"
    url: "http://qbt-oc1.svr2/" # qBittorrent (oracle1)
    
  - icon: "fas fa-project-diagram"
    url: "http://oracle1:81/" # Nginx proxy manager
    
 # - icon: "fas fa-shield-alt"
 #   url: "http://oracle1:3000" # AdGuard Home
    
#   - icon: "fas fa-traffic-light"
#     url: "http://oracle1:90/" # Traefik
    
  - icon: "fas fa-play-circle"
    url: "http://oracle1:31337/" # Kitana
    
#  - name: "Page 2"
#    icon: "fas fa-columns"
#    url: "#additionnal-page"

services:
  - name: "Media"
    icon: "fas fa-film"
    items:
    
      - name: Radarr
        subtitle: "Movie collection manager"
        url: "http://radarr.server/"
        logo: "assets/homer-icons/png/radarr.png"

      - name: Radarr4K
        subtitle: "Manage 4K movies"
        url: "http://radarr4k.server/"
        logo: "assets/img2/4k-film-2.svg"
        tag: oc1

      - name: Sonarr
        subtitle: "TV shows automator"
        url: "http://sonarr.server/"
        logo: "assets/homer-icons/svg/sonarr.svg"

      - name: Overseerr
        subtitle: "Media discovery tool"
        url: "http://overseerr.server/"
        logo: "assets/homer-icons/svg/overseerr.svg"
        tag: oc1
        

      - name: Flood
        subtitle: "Beautiful torrent GUI"
        url: "http://flood-torrent.server/"
        logo: "assets/homer-icons/png/flood.png"
        
    #   - name: Petio
    #     subtitle: "Plex companion"
    #     url: "http://petio.svr2/"
    #     logo: "https://raw.githubusercontent.com/petio-team/petio/master/frontend/public/favicon/android-icon-192x192.png"
    #     tag: oc1

      - name: Tautulli
        subtitle: "Plex graps & stats"
        url: "http://tautulli.server/"
        logo: "assets/homer-icons/png/tautulli.png"

  - name: Hosted
    icon: "fas fa-rocket"
    items:

      - name: Speedtest tracker
        subtitle: "Automated speed tests"
        url: "http://speedtest.svr2/"
        logo: "assets/custom/speedtest-tracker.png"

      - name: Code-server
        subtitle: "Browser-based editor"
        url: "http://code.server/"
        logo: "assets/custom/code-server.png"

      - name: Mealie
        subtitle: "Pantry for recipes"
        url: "http://mealie.server/"
#        logo: "assets/homer-icons/png/mealie.png"
        logo: "assets/custom/food-2.png"

      - name: Nextcloud
        subtitle: "Cloud-hosted file storage"
        url: "https://agneev.duckdns.org/"
        logo: "assets/homer-icons/png/nextcloud.png"
        tag: oc1

      - name: Home Assistant
        subtitle: "Next-gen smart home"
        url: "http://assistant.server:8123/"
        logo: "assets/custom/home-assistant.png"
        
      - name: Homebridge
        subtitle: "HomeKit all things"
        url: "http://homebridge.svr2/"
        logo: "assets/homer-icons/png/homebridge.png"
        
  - name: Manage
    icon: "fas fa-user-shield"
    items:
    
      - name: AdGuard Home
        subtitle: "Network ad-blocker"
        url: "http://adguard.svr2/"
        logo: "assets/homer-icons/svg/adguardhome.svg"

      - name: Portainer
        subtitle: "Advanced Docker GUI"
        url: "http://portainer.svr2/"
        logo: "assets/homer-icons/png/portainer.png"

      - name: Grafana
        subtitle: "Visualized stats"
        url: "http://grafana.server/"
        logo: "assets/homer-icons/png/grafana.png"
        
      - name: Chronograf
        subtitle: "Metrics visualizations"
        url: "http://chronograf.server"
        logo: "assets/homer-icons/png/chronograf.png"
        
    #   - name: Smokeping
    #     subtitle: "Graph network latency"
    #     url: "http://smokeping.svr2/smokeping/?target=DNSPing"
    #     logo: "assets/custom/monitor.png"
    
      - name: Router
        subtitle: "Stats from router Netdata"
        url: "http://routerlogin.net:19999#menu_net_submenu_brwan;theme=slate"
        logo: "assets/homer-icons/png/netdata.png"

      - name: Nginx manager
        subtitle: "Main network proxy"
        url: "http://npm.svr2/nginx/proxy"
        logo: "assets/homer-icons/png/nginxproxymanager.png"
        
    #   - name: Pi-hole
    #     subtitle: "DNS blackhole"
    #     url: "http://pihole.svr2/admin"
    #     logo: "assets/homer-icons/png/pihole.png"
    #     tag: oc1
        
  - name: "Files"
    icon: "fas fa-hdd"
    items:
        
      - name: aria2
        subtitle: "Ultra-fast HTTP downloader"
        url: "http://aria.server/"
        logo: "assets/homer-icons/png/ariang.png"
        
    #   - name: Plexdrive
    #     subtitle: "Encrypted cloud drive"
    #     url: "http://plexdrive.svr2:9800/files/plexdrive/"
    #     logo: "assets/homer-icons/png/plexdrive.png"

      - name: File Browser
        subtitle: "Browse files on NAS server"
        url: "http://files.server:9800/files/"
        logo: "assets/homer-icons/svg/filebrowser.svg"
        
      - name: qBittorrent
        subtitle: "Best torrent client"
        url: "http://qbittorrent.server/"
        logo: "assets/homer-icons/png/qbittorrent.png"
        
      - name: Scrutiny
        subtitle: "Visualized SMART data"
        url: "http://scrutiny.server/"
        logo: "assets/homer-icons/png/scrutiny.png"

  - name: "Server"
    icon: "fas fa-server"
    items:

      - name: InfluxDB
        subtitle: "Modern metrics recorder"
        url: "http://influxdb.server"
        logo: "assets/custom/influxdb.png"
        
    #   - name: Uptime-kuma
    #     subtitle: "Status monitoring"
    #     url: "http://uptime.svr2/"
    #     logo: "https://github.com/louislam/uptime-kuma/raw/master/public/icon.svg"
        
      - name: always-on
        subtitle: "Netdata on DNS server"
        url: "http://netdata.svr2:19999/"
        logo: "assets/homer-icons/png/netdata.png"

      - name: falcon
        subtitle: "Netdata on media server"
        url: "http://netdata.server/"
#        logo: assets/img2/server-folder.svg
        logo: "assets/custom/netdata-alt.png"
        
      - name: NPM (falcon)
        subtitle: "Docker net reverse proxy"
        url: "http://npm.server/nginx/proxy/"
        logo: "assets/homer-icons/png/nginxproxymanager.png"

    #   - name: Cockpit
    #     subtitle: "Server manager"
    #     url: "http://cockpit.server:9090/"
    #     logo: "assets/homer-icons/png/cockpit.png"

  - name: "Tools"
    icon: "fas fa-toolbox"
    items:
        
      - name: Prowlarr
        subtitle: "Indexer manager"
        url: "http://prowlarr.server/"
        logo: "assets/homer-icons/svg/prowlarr.svg"

      - name: Bazarr
        subtitle: "Subtitles for all media"
        url: "http://bazarr.svr2/"
        logo: "assets/homer-icons/svg/bazarr.svg"
        tag: oc1

    #   - name: Node-RED
    #     subtitle: Programming tool
    #     url: "http://node-red.server/"
    #     logo: "assets/homer-icons/png/nodered.png"

      - name: Jackett
        subtitle: "All indexers in one place"
        url: "http://jackett.svr2/"
        logo: "assets/homer-icons/png/jackett.png"
        tag: oc1
        
      - name: OpenSpeedTest
        subtitle: "LAN speed tests"
        logo: "assets/homer-icons/png/openspeedtest.png"
        url: "http://openspeedtest.svr2:8200/"
        
```

更多的配置可以参考 [官网](https://github.com/bastienwirtz/homer/blob/main/docs/configuration.md)

```
services:
  - name: "Media"
    icon: "fas fa-cloud"
    items:
      - name: "Plex"
        logo: "assets/tools/plex.png"
        subtitle: "TV Shows & Movie Collection"
        tag: "app"
        url: "http://192.168.68.137:32400/web/index.html"
        target: "_blank" # optional html a tag target attribute
      - name: "Netflix"
        logo: "assets/tools/netflix.png"
        subtitle: "Streaming Service"
        tag: "app"
        url: "https://netflix.com"
      - name: "Youtube"
        logo: "assets/tools/youtube.png"
        tag: "app"
        url: "https://youtube.com" 
  - name: "Downloads"
    icon: "fas fa-cloud-download-alt"
    items:
      - name: "Sonarr"
        logo: "assets/tools/sonarr.png"
        subtitle: "TV Show Indexer"
        tag: "app"
        url: "http://192.168.68.137:8989/"
        target: "_blank" # optional html a tag target attribute
      - name: "Radarr"
        logo: "assets/tools/radarr.png"
        subtitle: "Movie Indexer"
        tag: "app"
        url: "http://192.168.68.137:7878/"
      - name: "NZBGet"
        logo: "assets/tools/nzbget.png"
        subtitle: "Usenet Downloader"
        tag: "app"
        url: "http://192.168.68.137:6789/"
```

## Icons

到 [FontAwesome](https://fontawesome.com/icons?d=gallery) 搜索 Icon。

或者看看这里的 [SuperTinyIcons](https://github.com/edent/SuperTinyIcons) 或者 [homer-icons](https://github.com/NX211/homer-icons)

## reference

- <https://hub.docker.com/r/b4bz/homer>

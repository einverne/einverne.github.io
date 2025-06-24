---
layout: post
title: "Alist 风波以及在 K3s 中部署 OpenList"
aliases:
- "Alist 风波以及在 K3s 中部署 OpenList"
tagline: ""
description: ""
category: 经验总结
tags: [ openlist, alist, cloud-storage, file-sharing, nginx, emby, plex, vidhub, ]
create_time: 2025-06-23 14:23:07
last_updated: 2025-06-23 14:23:07
dg-home: false
dg-publish: false
---

在我的待办事项和视频评论下方很多人提到过 Alist，虽然我自己也有搭建一个 Alist，但实际上并没没有真正使用起来，所以待办事项中的「编写一篇文章介绍一下 Alist」 也就一直延误了，我个人似乎并没有太多 Alist 使用的强需求，虽然 Alist 可以用来挂在很多的网盘，但是如果看过我之前的文章，我现在越来越多的避免将大量的数据存储到云端，也不再大量的使用网盘，所以很多人用 Alist 来挂在网盘并接入 VidHub，Plex，Emby 等来观看高清视频的需求其实我本地一台 Ubuntu(NAS) USB 挂在一块大硬盘，局域网 SMB 共享给 Apple TV 就已经解决我了 99% 的使用场景。

但是现在再来编写一篇文章介绍 Alist（OpenList）的原因就是想聊聊开源社区，以及开源社区商业化这件事情，怎么就演变成现在这样的口碑。

## Alist 风波

Alist 本来是一个开源的可以用来聚合多个网盘，云存储将其变成可阅览在线目录的项目。但是前段时间 Alist 项目被出售，并移交给了新团队。在新团队的维护中，添加了未经用户同意或明确告知的遥测（telemetry）代码，悄悄收集用户的使用数据。这一行为严重地削弱了这个开源项目的信任度。另外官方的一系列操作更加剧了社区分裂，官方文档中的二进制下载链接被修改，项目踢出了原来的核心贡献者，等等这一系列让人看不懂的操作加剧了这个项目走向终点的步伐。

## OpenList 是什么

为了应对 Alist 项目带来的「信任危机」，部分 Alist 项目的核心贡献者创建了一个名叫 OpenList 的分支。OpenList 定位是 Alist 的继承者和开源代替，目标是确保文件列表的自由和可信任。希望通过开源，透明，可审查的代码来防止用户隐私的侵入。

OpenList 和 Alist 一样支持广泛的存储提供商，包括但不限于本地存储，阿里云盘，OneDrive，百度网盘，天翼云盘，Google Drive，123pan，PikPak，FTP/SFTP，S3，WebDAV，115 网盘，夸克网盘，迅雷网盘，蓝奏云等。

- OpenList 支持文件的预览，包括视频音频图片文档等，支持代码文件预览和语法高亮，支持 Office 文档预览。
- 支持安全和访问控制，可以添加密码保护
- 支持单点登录 SSO
- 支持多种身份验证方式

相关链接

- 官方 [GitHub](https://github.com/OpenListTeam/OpenList)
- [官方文档](https://openlist.team/)

## 搭建 OpenList

通过 Docker 快速安装

```
docker run -d \
  --name=openlist \
  -p 5244:5244 \
  openlistteam/openlist:latest
```

如果需要使用 ffmpeg, aria2 等应用，可以在镜像标签后使用 tag `:beta-aio` 或者 `:latest-aria2` 等。具体可以参考[docker hub](https://hub.docker.com/r/openlistteam/openlist/tags)

首次运行会输出管理员初始密码，默认监听 5244 端口。

### k3s 中安装
因为我维护了一个自用的 k3s ，可以直接使用如下的配置安装

```
apiVersion: v1
kind: Namespace
metadata:
  name: openlist

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: openlist-pvc
  namespace: openlist
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: longhorn

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: openlist
  namespace: openlist
spec:
  replicas: 1
  selector:
    matchLabels:
      app: openlist
  template:
    metadata:
      labels:
        app: openlist
    spec:
      containers:
        - name: openlist
          image: openlistteam/openlist:latest
          ports:
            - containerPort: 5244
          env:
            - name: PUID
              value: "0"
            - name: PGID
              value: "0"
            - name: UMASK
              value: "022"
            - name: TZ
              value: "Asia/Shanghai"
            - name: RUN_ARIA2
              value: "true"
          volumeMounts:
            - mountPath: /opt/openlist/data
              name: data
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: openlist-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: openlist-svc
  namespace: openlist
spec:
  type: ClusterIP
  ports:
    - port: 5244
      targetPort: 5244
  selector:
    app: openlist

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: openlist-ingress
  namespace: openlist
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  rules:
    - host: openlist.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: openlist-svc
                port:
                  number: 5244
  tls:
    - hosts:
        - openlist.example.com
      secretName: openlist-tls
```

可以自行修改其中的部分内容，比如域名，配置 pvc 大小等。

安装部署成功之后运行如下的代码查看初始化密码。

```
kubectl logs -f -n openlist openlist-7c5fd58b97-xxx
```

默认的用户名是 admin，初始化密码在日志中。

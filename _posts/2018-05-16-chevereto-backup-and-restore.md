---
layout: post
title: "chevereto 备份及恢复记录"
tagline: ""
description: ""
category: 经验总结
tags: [chevereto, photo, backup, docker, docker-compose]
last_updated:
---

之前安装 Chevereto 时还没有折腾 Docker，后来发现 Docker [安装](https://github.com/einverne/dockerfile/tree/master/chevereto) 实在太方便了，所以现在就将数据迁移到 Docker 中，备份和恢复的方式主要可以参考之前[写的文章](/post/2018/03/docker-related-backup.html)。

## 备份

对于 Chevereto 这样的程序主要备份的就是数据库和文件，mysql 备份没啥说的，文件也直接打包即可。


## 恢复
这里主要展开下恢复，一方面在 docker-compose.yml 文件中，我映射列两个 volumes，

    volumes:
      - chevereto:/var/www/html/images
      - chevereto_content:/var/www/html/content

这两个文件路径，images 主要存放的是上传的图片，而 content 目录一开始的时候我们并没有加上，导致一些系统的 logo 还有用户的头像消失了，我对比了下目录中存放的文件，发现 Chevereto 将这些资源文件存放在了 content 目录中，映射出来，然后恢复的时候将之前备份的内容恢复到这两个目录即可。

数据库恢复也比较容易

    sudo cat backup.sql | sudo docker exec -i chevereto_db /usr/bin/mysql -u root --password=password chevereto

然后文件恢复时直接恢复到 volumes 的目录，`sudo docker volume inspect volume_name` 然后查看 volume 的位置，将文件解压到该目录下。

Chevereto 两个挂载的路径是

- `/var/lib/docker/volumes/chevereto_chevereto/_data`
- `/var/lib/docker/volumes/chevereto_chevereto_content/_data`


然后 `chown www-data:www-data *` 来改变权限即可。

这个备份和恢复的操作同理可以应用到任何类似 WordPress，Chevereto 这样的 PHP 应用上。



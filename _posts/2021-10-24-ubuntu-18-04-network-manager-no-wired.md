---
layout: post
title: "修复 Ubuntu 18.04 网络设置中无有线设置的问题"
aliases:
- "修复 Ubuntu 18.04 网络设置中无有线设置的问题"
tagline: ""
description: ""
category: 经验总结
tags: [ ubuntu, network-manager, net ]
create_time: 2022-08-22 12:09:54
last_updated: 2022-08-22 12:44:44
---

在 Ubuntu 18.04 网络配置中，某一次升级之后就发现网络配置中心里面少了有线网络配置。

为了恢复有线网络配置，需要手动修改 NetworkManager 的配置文件。

首先查看 interfaces 文件中内容。

```
❯ sudo cat /etc/network/interfaces
# interfaces(5) file used by ifup(8) and ifdown(8)
auto lo
iface lo inet loopback
```

确保该配置文件正确。

然后修改 NetworkManager.conf 文件

```
sudo vi /etc/NetworkManager/NetworkManager.conf
```

将文件中的 :

```
managed=false
```

修改为

```
managed=true
```

然后修改 `10-globally-managed-devices.conf` 配置文件，添加有线设备：

```
sudo vi /usr/lib/NetworkManager/conf.d/10-globally-managed-devices.conf
```

修改为：

```
[keyfile]
unmanaged-devices=*,except:type:ethernet,except:type:wifi,except:type:wwan
```

注意其中的 `except: type: ethernet` 这一部分。

最后重启 NetworkManager

```
sudo service network-manager restart
```

最后就能够在网络配置中心中手动配置有线网络连接。

## reference

- <https://blog.csdn.net/lylg_ban/article/details/121657952>

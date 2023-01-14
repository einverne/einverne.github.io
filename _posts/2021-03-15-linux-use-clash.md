---
layout: post
title: "在 Linux 上使用 Clash 作代理"
aliases: "在 Linux 上使用 Clash 作代理"
tagline: ""
description: ""
category: 经验总结
tags: [ linux, clash, clashx, macos, proxy, socks, v2ray, ]
last_updated:
---

去年年中的时候切换到 macOS，一直用 ClashX，时隔半年又迁移回了 Linux[^linux]，发现原先使用的 V2rayL 虽然能用，但是有些简陋，并且不支持分流，并且如果一个地址失效了，还需要手动地进行切换。所以看到 Linux 的 Clash 可以自动进行流量切换的时候，就试一下。

[^linux]: [回到Linux怀抱](/post/2021/03/come-back-to-linux-after-using-macos-half-an-year.html)

Clash 是 Go 语言实现的，跨平台代理工具，支持 Shadowsocks/v2ray，支持规则分流等等。

可以在官方页面[下载](https://github.com/Dreamacro/clash/releases)。

Linux 下载对应的 `linux-amd64` 即可。

## 2021 年 11 月更新
在用了很长一段时间的 Clash 命令行之后，我发现 [Clash For Windows](/post/2021/10/linux-use-clash-for-windows.html) 这个应用也能够在 Linux 下使用。所以最近就切换到了这个应用上。

另外欢迎订阅使用 [EV Proxy](https://board.gtk.pw) 注册之后一键订阅即可使用。

## 安装 {#installation}
下载对应的二进制，比如默认放到 `~/Downloads` 目录，在终端进入该目录。

    gunzip clash-linux-amd64-v0.18.0.gz
    sudo mv clash-linux-amd64-v1.4.2 /usr/local/bin/clash
    sudo chmod +x /usr/local/bin/clash
    ./clash
    
clash 启动后会在 `~/.config/clash` 目录生成配置文件。

```
ls -al ~/.config/clash
.rw-r--r--   10 einverne 23 Mar 19:30 config.yaml
.rw-r--r-- 4.0M einverne 23 Mar 19:30 Country.mmdb
```

## 修改配置 {#config}

比如说对于我使用的[Wallless代理](https://portal.wl-site3.com/#/register?code=nlyM4OSi)，在后台复制地址之后，在网址的后面增加 `&flag=clash` 获取 clash 的配置文件，右击网页 Save as，选择仅网页内容，下载到本地， `sub.html`。

另外还有一个代理，有兴趣的可以[试用一下](https://board.gtk.pw)。

然后将查看 `sub.html` 内容，应该是一个 yaml 格式的文件。将此格式的文件替换默认的配置。

    cat ~/Downloads/sub.html > ~/.config/clash/config.yaml
    
然后重新执行 `/usr/local/bin/clash`。

此时检查一下配置中的 socks 端口，我一般用本地的 1080，修改一下:

    socks-port: 1080


然后再运行。去浏览器中，访问 youtube.com 检查一下。

如果正常访问即完成了配置。

## 配置开机启动
在配置开机启动之前，将配置文件移动到 `/etc` 目录：

    sudo mv ~/.config/clash /etc

以后修改配置都记住修改 `/etc/clash` 目录下的这个配置文件。

然后使用 `vi` 增加 systemd 配置 `sudo vi /etc/systemd/system/clash.service` 放入如下内容：

```
[Unit]
Description=Clash Daemon

[Service]
ExecStart=/usr/local/bin/clash -d /etc/clash/
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

启用 clash service:

    sudo systemctl enable clash.service
    
手动启动 clash.service:

    sudo systemctl start clash.service
    
可以使用 systemd 提供的 `disable`, `stop` 等等命令来管理。

如果要查看 Clash service 的日志可以使用：

    journalctl -e -u clash.service

如果想要将日志单独记录到文件，可以使用 systemd 的 `StandardOutput` 和 `StandardError` 将日志定向到文件中。这部分可以参考 [systemd 的文档](https://www.freedesktop.org/software/systemd/man/systemd.exec.html#StandardOutput=)

```
# Works only in systemd v240 and newer!
StandardOutput=append:/var/log/clash/log.log
StandardError=append:/var/log/clash/error.log
```

## 远程管理端口
Clash 提供了默认的 9090 端口作为远端管理端口，在配置中可以看到：

    external-controller: '127.0.0.1:9090'
    
这样的配置。

可以使用 Clash 远程管理的页面进行管理: [http://clash.razord.top/#/proxies](http://clash.razord.top/#/proxies)

这个页面要求提供，Host,Port,Secret 三个输入：

- Host: 127.0.0.1
- Port: 9090
- Secret: 配置文件配置的 secret

其中 Secret 是在配置文件中通过：

    secret: 'xxx'
   
进行配置的。


## related

- [在终端下使用 socks 代理](/post/2017/02/terminal-sock5-proxy.html)
- 你还可以在终端下对代理进行[测速](/post/2020/04/how-to-speed-test-a-proxy-socks-or-http-proxy.html)

感谢 BobMaster 在评论里面提供其他解决方式，有兴趣可以尝试 [v2rayA](https://github.com/v2rayA/v2rayA)， 或 [Qv2ray](https://github.com/Qv2ray/Qv2ray)
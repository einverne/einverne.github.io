---
layout: post
title: "使用 Prometheus 和 Grafana 监控 Proxmox 服务器"
tagline: ""
description: ""
category: 学习笔记
tags: [prometheus, grafana, proxmox, server, monitoring, linux, ]
last_updated:
---

虽然 Proxmox 自身已经有一个比较简单的系统监控，但对于我来说每一次都需要登录到其后台才能看到，而且它自身的监控视图是没有报警策略的。所以我想着这两天反正在学习 Prometheus 这不是正好是一个不错的契机来在具体环境中使用一下，所以才有了这篇文章。[Prometheus](/post/2020/04/prometheus-monitoring-system-and-tsdb.html) 和 [Proxmox](/post/2020/03/proxmox-install-and-setup.html) 相关的内容可以参考之前的文章。

首先来对比一下前后的效果。

Proxmox 后台默认的监控面板。

![proxmox default monitoring panel](/assets/proxmox-default-monitoring-panel.png)

Grafana 中显示

![proxmox grafana monitoring panel](/assets/proxmox-grafana-monitor-panel.png)

当然如果你不喜欢这个样式，Grafana 给予了用户非常充分的定制化可能，你可以自己打造自己的监控视图。

## 安装 Prometheus {#install-prometheus}

### 准备工作
准备工作：

	sudo groupadd --system prometheus
	sudo useradd -s /sbin/nologin --system -g prometheus prometheus

创建配置目录：

	sudo mkdir /var/lib/prometheus
	for i in rules rules.d files_sd; do sudo mkdir -p /etc/prometheus/${i}; done

下载 Prometheus 二进制：

```
mkdir -p /tmp/prometheus && cd /tmp/prometheus
curl -s https://api.github.com/repos/prometheus/prometheus/releases/latest \
  | grep browser_download_url \
  | grep linux-amd64 \
  | cut -d '"' -f 4 \
  | wget -qi -
```

### 配置
解压和配置

	tar xvf prometheus*.tar.gz
	cd prometheus*/
	mv prometheus promtool /usr/local/bin/
	mv prometheus.yml  /etc/prometheus/prometheus.yml
	mv consoles/ console_libraries/ /etc/prometheus/

清理

	cd ~/
	rm -rf /tmp/prometheus

创建 systemd 配置

这里使用 systemd 来配置管理 Prometheus

```
sudo tee /etc/systemd/system/prometheus.service<<EOF

[Unit]
Description=Prometheus
Documentation=https://prometheus.io/docs/introduction/overview/
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
User=prometheus
Group=prometheus
ExecReload=/bin/kill -HUP $MAINPID
ExecStart=/usr/local/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus \
  --web.console.templates=/etc/prometheus/consoles \
  --web.console.libraries=/etc/prometheus/console_libraries \
  --web.listen-address=0.0.0.0:9090 \
  --web.external-url=

SyslogIdentifier=prometheus
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

配置相应的权限

	for i in rules rules.d files_sd; do sudo chown -R prometheus:prometheus /etc/prometheus/${i}; done
	for i in rules rules.d files_sd; do sudo chmod -R 775 /etc/prometheus/${i}; done
	sudo chown -R prometheus:prometheus /var/lib/prometheus/

启动及配置开机启动

	sudo systemctl daemon-reload
	sudo systemctl start prometheus
	sudo systemctl enable prometheus

### 检查
这个时候可以检查一下 9090 端口（直接访问浏览器，或者 `netstat -tupln | grep 9090`)

## Install proxmox-pve-exporter

看过之前关于 [Prometheus](/post/2020/04/prometheus-monitoring-system-and-tsdb.html) 那片文章应该就知道 Prometheus 有两种获取数据的方法，pull 和 push，这里我们在 Proxmox 上安装 exporter，然后让 Prometheus 来 pull 数据。

### 准备
安装必要的组件

	apt install python python-pip
	pip install prometheus-pve-exporter

创建授权配置：

	vi /etc/prometheus/pve.yml

写入：

	default:
		user: user@pve
		password: your_password_here
		verify_ssl: false


在这里要注意一个坑，使用 `prometheus-pve-exporter` 依赖于 Proxmox 的用户授权，而这里的用户需要到 Proxmox 后台，DataCenter -> user 标签下查看，对于我而言，这里需要填写 `root@pam`.

systemd


```
sudo tee /etc/systemd/system/prometheus-pve-exporter.service<<EOF
[Unit]
Description=Prometheus exporter for Proxmox VE
Documentation=https://github.com/znerol/prometheus-pve-exporter

[Service]
Restart=always
User=prometheus
ExecStart=/usr/local/bin/pve_exporter /etc/prometheus/pve.yml

[Install]
WantedBy=multi-user.target
EOF
```

reload systemd

	systemctl daemon-reload
	systemctl start prometheus-pve-exporter
	systemctl enable prometheus-pve-exporter

将 proxmox-pve-exporter 添加到 Prometheus

	vi /etc/prometheus/prometheus.yml

增加配置：

	- job_name: 'proxmox'
	  metrics_path: /pve
	  static_configs:
	  - targets: ['localhost:9221']

重启服务：

	systemctl restart prometheus

重启后可以到 Prometheus 界面 Target 查看节点是否 Up.

我在配置的过程中遇到一个问题，就是配置授权的时候用户名写的不对，报错

	returned HTTP status 500 INTERNAL SERVER ERROR

使用 `journalctl -xe` 可以看到错误日志：

	May 03 12:32:25 pve pvedaemon[291021]: authentication failure; rhost=127.0.0.1 user=xx@pve msg=no such user ('xx@pve')


这个时候一定要检查用户名。另外也不建议直接使用 `root` 用户， 可以使用 `useradd monitor` 新建一个用户来进行管理。

- 登录终端 `useradd monitor` 添加 [^add]
- Web 后台 Permissions -> User 给用户 `monitor@pam` 设置密码
- Web 界面，datacenter -> Roles -> Create，新建一个名叫 `Monitoring` 的角色，赋予 `Datastore.Audit`, `Sys.Audit`, `Sys.Modify`, `VM.Audit`, `VM.Monitor` 的权限
- 然后 Permissions 中新建 User Permission，依次选 `/`, `monitor@pam`, `Monitoring` 然后新建。

此时配置授权的时候就可以使用 `monitor@pam` 加上设定的密码了。再检查一下 `journalctl -xe` 日志，`/pve` 接口返回 200 ，正常了。

[^add]: <https://forum.proxmox.com/threads/i-cant-create-a-password-for-a-second-user.16471/>

`pve_exporter` 所能提供的打点 Metrics 大致有如下一些：

	pve_cluster_info
	pve_cpu_usage_limit
	pve_cpu_usage_ratio
	pve_disk_read_bytes
	pve_disk_size_bytes
	pve_disk_usage_bytes
	pve_disk_write_bytes
	pve_guest_info
	pve_memory_size_bytes
	pve_memory_usage_bytes
	pve_network_receive_bytes
	pve_network_transmit_bytes
	pve_node_info
	pve_storage_info
	pve_up
	pve_uptime_seconds
	pve_version_info

## Node exporter
安装 node_exporter 的方法之前的文章中已经有写。安装后配置 Prometheus target


```
  - job_name: 'node_exporter'
	scrape_interval: 10s
	scrape_timeout: 10s
	static_configs:
	  - targets: ['10.0.0.5:9100']
```

## Install Grafana
直接参考 [官网](https://grafana.com/grafana/download?platform=linux)

添加 source

```
sudo tee /etc/apt/sources.list.d/grafana.list<<EOF
deb https://packages.grafana.com/oss/deb stable main
EOF
```

获取 key

	curl https://packages.grafana.com/gpg.key | sudo apt-key add -

安装：

	sudo apt update && sudo apt install -y apt-transport-https grafana
	sudo systemctl enable --now grafana-server
	systemctl status grafana-server.service

访问 localhost:3000 ，用户名密码都是 `admin`。


### 配置监控 {#config}
进入 Grafana 后，需要添加数据源，然后添加自己的 Dashboard 和 Panel，如果不熟悉操作过程，可以先导入别人的模板，学习一下别人是怎么做的。

侧边栏，Create -> Import，输入神秘代码：1860，可以[导入](https://grafana.com/grafana/dashboards/1860) 别人创建好的模板。

在熟悉了整个工作流程之后，就可以自己依照自己的需求来修改自己的 Dashboard.

几个比较不错的 Dashboard 模板

- [Node exporter Full](https://grafana.com/grafana/dashboards/1860)
- [Proxmox](https://grafana.com/grafana/dashboards/10347)

## 总结
至此所有的配置过程就全部结束了，但这可能只是我学习 Prometheus 以及 Proxmox 的第一步，因为目前这台服务器上的服务并不多，虚拟机也只是因为学着玩而安装的 OpenMediaVault 以及 Ubuntu Server，而 Prometheus 中数据库的 Exporter，Nginx 的 Exporter，可以使用类似的方式慢慢加入进来，这个时候参考官网以及相关的 GitHub 也就能实现了。

在这个过程中也慢慢的体会到 less is more 的哲学，很早就听说过这句话，但尤其在这里更加深刻的理解了，这篇文章中提到的每一个服务都专注于自己的最核心的功能，Prometheus Server 专注于采集数据，Exporter 负责暴露数据，而 Grafana 则负责可视化，tsdb 负责记录数据，Proxmox 则是站在巨人的肩膀上专注于虚拟化。这些服务各自都在自己的领域做到极致，那么最好只需要完整的把他们组合到一起，就可以实现 1+1>2 的效果。

## reference

- <https://samynitsche.de/articles/monitoring-proxmox-with-prometheus-and-grafana/>
- <https://pvecli.xuan2host.com/install-prometheus-grafana/>
- <http://blog.jason.tools/2019/02/pve-diskio-analysis.html>

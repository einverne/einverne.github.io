---
layout: post
title: "Ansible 介绍及使用"
tagline: ""
description: ""
category: 学习笔记
tags: [ansible, deploy, linux, management, ]
last_updated:
---


Ansible 是使用 Python 开发的自动化运维工具，如果这么说比较抽象的话，那么可以说 Ansible 可以让服务器管理人员使用文本来管理服务器，编写一段配置文件，在不同的机器上执行。


## 特性 {#feature}

- 低学习成本
- 无需在服务器中安装客户端，基于 SSH 工作，可并行执行
- 无需服务端，直接终端命令即可
- 管理的对象可以包括物理机，虚拟机，容器等等
- 使用 yaml 格式文件编排 playbook

## 组成

- control node: 控制节点，可以在任何安装了 Python 环境的机器中使用 ansible，两个重要的可执行文件在 `/usr/bin/ansible` 和 `/usr/bin/ansible-playbook`
- managed node: 被控制的节点
- inventory: 需要管理的节点，通常配置成 `hostfile` 文件 [^inventory]
- modules: ansible 进行自动化任务时调用的模块，社区提供了非常多 [modules](https://docs.ansible.com/ansible/latest/modules/list_of_all_modules.html)
- Task: Ansible 的执行单元
- playbook: 编排多个任务
- roles: roles 是将 playbook 划分多个部分的机制
- plugins: ansible 插件

[^inventory]: <https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html#intro-inventory>

工作流程：

- 读取配置
- 获取机器列表及分组配置
- 确定执行模块和配置，modules 目录动态读取
- Runner 执行
- 输出


## 安装 {#installation}
Ansible 的安装方法非常多，PPA，源码安装都可以。[^install]

[^install]: <https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html>

	$ sudo apt update
	$ sudo apt install software-properties-common
	$ sudo apt-add-repository --yes --update ppa:ansible/ansible
	$ sudo apt install ansible

如果不想 PPA，也可以

	sudo apt-get install -y ansible


### 源码安装

	sudo apt-get install -y libffi-dev libssl-dev python-dev
	sudo pip install paramiko PyYAML Jinja2 httplib2 six pycrypto
	git clone https://github.com/ansible/ansible.git --recursive
	cd ansible
	git pull --rebase
	git submodule update --init --recursive

配置 Bash：

	source ./hacking/env-setup

## 配置 {#config}

### ansible.cfg
`ansible.cfg` 文件是 Ansible 的主要配置文件，ansible 寻找的路径优先级是：

- File specified by the ANSIBLE_CONFIG environment variable
- ./ansible.cfg (ansible.cfg in the current directory)
- ~/.ansible.cfg (.ansible.cfg in your home directory)
- /etc/ansible/ansible.cfg

配置内容：

```
[defaults]
hostfile = hosts
remote_user = admin
remote_port = 222
host_key_checking = False
```

hostfile 文件指定了当前文件夹下的 hosts 文件。hosts 文件夹中配置：

	[server]
	10.0.0.1
	10.0.0.2

配置 SSH 免密登录的文章可以参考之前的[文章](/post/2016/06/ssh-copy-id.html).

### inventory
可以配置 `/etc/ansible/hosts` 创建基本的 inventory.

这里的 inventory 可以看成需要管理的节点的配置，可以直接配置到全局，然后使用 `all` 来引用，也可以用分组的形式来引用。

```
[webserver]
127.0.0.1
foo.example.com

dbserver1 ansible_ssh_host=127.0.0.1 ansible_ssh_port=22 color=red
dbserver2 ansible_ssh_host=127.0.0.2 ansible_ssh_port=220


[dbserver] #group
dbserver1
dbserver2

[forum:children] #groups of groups
webserver
dbserver

[webservers]
www[01:50].example.com
```

更多 inventory 的配置可以参考[官方文档](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html)

inventory 同样配置用来管理 AWS EC2，或者 OpenStack。[^in]

[^in]: <https://docs.ansible.com/ansible/latest/user_guide/intro_dynamic_inventory.html>

## 使用 {#usage}
基本使用方法：

	ansible <pattern> -m <module_name> -a <arguments>

在简单配置后可以运行

	# 一个节点
	ansible host1 -a "/bin/echo hello"
	# 多个节点
	ansible host1,host2 -a "/bin/echo hello"
	ansible host1:host2 -a "/bin/echo hello"
	# 全部节点
	ansible all -m ping
	# 一组节点
	ansible webservers -m service -a "name=httpd state=restarted"
	# 多组节点
	ansible webservers:dbservers -m ping
	# 排除节点，在 groupA 但不在 groupB
	ansible groupA:!groupB -m ping
	# 多组节点的交集，既在 groupA 也在 groupB 中的节点
	ansible groupA:&groupB -m ping

这里选择节点的方式可以有很多种，甚至可以选择组节点中的第几个，或者用正则匹配一些等等。[^host]

[^host]: <https://docs.ansible.com/ansible/latest/user_guide/intro_patterns.html>

## ad-hoc command
ad-hoc 命令可以执行单一的任务，ad-hoc 命令很简单，但不能复用，在了解 playbook 之前先体验一下 ad-hoc 感受一下 Ansible 的强大。

	ansible [pattern] -m [module] -a "[module options]"

举例：

	# 小心使用下面命令，比如重启服务
	ansible atlanta -a "/sbin/reboot"
	# 管理文件，复制文件
	ansible atlanta -m copy -a "src=/etc/hosts dest=/tmp/hosts"
	# 管理包
	ansible webservers -m yum -a "name=acme state=present"
	# 启动服务
	ansible webservers -m service -a "name=httpd state=started"

## module
`-m` 选项后面的就是 module，常见的 module，之前例子中有非常多的 ping，就是用来检测连通性的。

### setup
用来查看远程主机信息：

	ansible all -m setup

### command
执行命令：

	ansible all -m command -a "ls -al ."
	# 切换到 sub-dir 目录，创建文件
	ansible all -m command -a "chdir=sub-dir creates=test.file ls"
	# 删除文件
	ansible all -m command -a "chdir=sub-dir removes=test.file ls"


### file
设置文件属性。

	# 创建 soft link
	ansible all -m file -a "src=/etc/resolv.conf dest=/tmp/resolv.conf state=link"
	# 删除 soft link
	ansible all -m file -a "path=/tmp/resolv.conf state=absent"

### copy
复制文件到主机

	# 复制本地文件到远程主机，并授予权限
	ansible all -m copy -a "src=/etc/ansible/ansible.cfg dest=/tmp/ansible.cfg owner=root group=root mode=0644"

### shell
在远程执行 shell 脚本

	ansible all -m shell -a "~/setup.sh"

更多 module 可以使用 `ansible-doc -l` 查看。

## playbook
上面提到 ad-hoc 可以执行一次性的命令，但如果要把多个 task 组织起来，那就不得不提到 playbook, playbook 可以编排有序的任务，可以在多组主机间，有序执行任务，可以选择同步或者异步发起任务。

一个简单的例子：

```
---
- hosts: webservers
  vars:
    http_port: 80
    max_clients: 200
  remote_user: root
  tasks:
  - name: ensure apache is at the latest version
    yum: pkg=httpd state=latest
  - name: write the apache config file
    template: src=/srv/httpd.j2 dest=/etc/httpd.conf
    notify:
    - restart apache
  - name: ensure apache is running
    service: name=httpd state=started
  handlers:
    - name: restart apache
      service: name=httpd state=restarted
    - name: restart memcached
      service: name=memcached state=restarted
```

说明：

- tasks: 一系列任务
- handlers: 由通知者进行通知，只有 nofity 后 handler 才会执行，等到 tasks 执行完后才会执行，最多执行一次

执行 playbook

	ansible-playbook playbook.yml -f 10

如果想了解更多拆分 playbook 的方法，可以到官网查看更多 include, role 相关的内容。

## 延伸
其他的运维管理工具 puppet、cfengine、chef、func、fabric.

Redhat 给 Ansible 做了一套 GUI，叫做 Ansible Tower，感兴趣可以了解一下。

## reference

- <https://docs.ansible.com/>
- <http://www.ansible.com.cn/docs/>
- <https://galaxy.ansible.com/docs/>
- <https://www.ansible.com/overview/how-ansible-works>

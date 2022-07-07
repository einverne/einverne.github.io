---
layout: post
title: "Ansible 入门篇一：简单介绍及使用"
aliases: "Ansible 入门篇一：简单介绍及使用"
tagline: ""
description: "Ansible 介绍、使用和使用教程"
category: 学习笔记
tags: [ansible, deploy, linux, management, python, ]
last_updated:
---

Ansible 是使用 Python 开发的自动化运维工具，如果这么说比较抽象的话，那么可以说 Ansible 可以让服务器管理人员使用文本来管理服务器，编写一段配置文件，在不同的机器上执行。

Ansible 使用 YAML 作为配置文件，YAML 是一个非常节省空间，并且没有丧失可读性的文件格式，其设计参考了很多语言和文件格式，包括 XML，JSON，C 语言，Python，Perl 以及电子邮件格式 RFC2822 等等。

Ansible 解决的问题正是在运维过程中多机器管理的问题。当有一台机器时运维比较简单，当如果要去管理 100 台机器，复杂度就上升了。使用 Ansible 可以让运维人员通过简单直观的文本配置来对所有纳入管理的机器统一进行管理。如果再用简单的话来概述 Ansible 的话，就是定义一次，无数次执行。

Ansible 是如何做到这件事情的呢？主要是划分了下面几个部分，具体的内容后文详解：

- 定义目标机器列表，也就是需要管理的机器
- 定义配置，使用 [YAML](/post/2015/08/yaml.html) 文件配置任务
- 执行具体任务

## Ansible 的特性 {#feature}

- 低学习成本
- 无需在服务器中安装客户端，基于 SSH 工作，可并行执行
- 无需服务端，直接终端命令即可
- 管理的对象可以包括物理机，虚拟机，容器等等
- 使用 YAML 格式文件编排 playbook

## Ansible 的组成元素
Ansible 中的一些概念。

- **control node**: 控制节点，可以在任何安装了 Python 环境的机器中使用 ansible，两个重要的可执行文件在 `/usr/bin/ansible` 和 `/usr/bin/ansible-playbook`
- **managed node**: 被控制的节点
- **inventory**: 需要管理的节点，通常配置成 `hostfile` 文件 [^inventory]
- modules: ansible 进行自动化任务时调用的模块，社区提供了非常多 [modules](https://docs.ansible.com/ansible/latest/modules/list_of_all_modules.html)
- **Task**: Ansible 的执行单元
- **playbook**: 编排多个任务
- **roles**: roles 是将 playbook 划分多个部分的机制
- **plugins**: ansible 插件

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

Ubuntu 下安装：

	sudo apt update
	sudo apt install software-properties-common
	sudo apt-add-repository --yes --update ppa:ansible/ansible
	sudo apt install ansible

如果不想 PPA，也可以直接安装：

	sudo apt-get install -y ansible
    # or
    sudo pip install ansible

在 macOS 上：

    brew install ansible

### 源码安装
从源码安装：

	sudo apt-get install -y libffi-dev libssl-dev python-dev
	sudo pip install paramiko PyYAML Jinja2 httplib2 six pycrypto
	git clone https://github.com/ansible/ansible.git --recursive
	cd ansible
	git pull --rebase
	git submodule update --init --recursive

配置 Bash：

	source ./hacking/env-setup

### 通过 Python pip 安装

    sudo pip install --trusted-host mirrors.aliyun.com 
    --index-url=http://mirrors.aliyun.com/pypi/simple/  ansible==2.7.1

## 相关配置 {#config}

### ansible.cfg
`ansible.cfg` 文件是 Ansible 中最主要的配置文件，ansible 寻找配置文件按照如下的优先级进行：

- 由环境变量 `ANSIBLE_CONFIG` 指定的文件
- `./ansible.cfg` (`ansible.cfg` in the current directory)
- `~/.ansible.cfg` (`.ansible.cfg` in your home directory)
- `/etc/ansible/ansible.cfg`

最简单的 `ansible.cfg` 配置示例：

```
[defaults]
hostfile = hosts
remote_user = root
remote_port = 22
host_key_checking = False
```

说明：

- `hostfile` 文件指定了当前文件夹下的 hosts 文件。hosts 文件中会配置需要管理的机器 host
    - 配置 SSH 免密登录的文章可以参考之前的[文章](/post/2016/06/ssh-copy-id.html).
- `remote_user` 配置默认操作的用户，如果没有配置，默认会使用当前用户
- `host_key_checking`: 禁用 SSH key host checking


### inventory
在上面的配置中可以看到 `inventory` 指定了一个 hosts 文件，这个文件用来对远程服务器 Hosts 进行管理。

默认的文件路径在 `/etc/ansible/hosts`。

这里的 inventory 可以看成需要管理的节点的配置，可以直接配置到全局，然后使用 `all` 来引用，也可以用分组的形式来引用。

#### 未分组形式
比如，未分组形式定义：

```
xxx.einverne.info
einverne.info
12.12.12.12
192.168.2.1
192.168.2.200
10.0.0.1
```

#### 分组形式
或者采用分组形式，用方括号表示下面的 HOST 都属于 webserver 这个组：

```
[webserver]
127.0.0.1
foo.example.com
```

#### 配置范围
如果有多个 HOST 可以用如下语法添加多个：

```
[webservers]
www[001:006].example.com

[dbservers]
db-[99:101]-node.example.com
```

或者配置别名：

```
dbserver1 ansible_ssh_host=127.0.0.1 ansible_ssh_port=22 color=red
dbserver2 ansible_ssh_host=127.0.0.2 ansible_ssh_port=220


[dbserver] #group
dbserver1
dbserver2

[forum:children] #groups of groups
webserver
dbserver
```

inventory 中可以配置使用别名，但是推荐在 `ssh config` 中进行配置管理，编辑 `vi ~/.ssh/config`:

	Host ds
		HostName einverne.info
		Port 22
		User username

	Host aws1
		HostName aws.einverne.info
		Post 22
		User demo-username

	Host oracle1
		HostName 140.1.1.1
		Port 22
		User some-username

我个人使用 [assh](/post/2020/07/advanced-ssh-config-management.html) 来对 SSH config 进行管理。

然后就可以在 Ansible 的 inventory 中配置使用 `ds`, `aws1` 或者 `oracle1` 来指定 host。

更多 inventory 的配置可以参考[官方文档](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html)

inventory 同样配置用来管理 AWS EC2，或者 OpenStack。[^in]

[^in]: <https://docs.ansible.com/ansible/latest/user_guide/intro_dynamic_inventory.html>

## Ansible 使用 {#usage}
ansible 命令的基本使用方法：

	ansible <pattern> -m <module_name> -a <module_arguments>

说明：这一行命令会定义并在一系列 host 上执行一个 `playbook` 任务。

## ad-hoc command
ad-hoc 命令可以执行单一的任务，ad-hoc 命令很简单，但不能复用，在了解 playbook 之前可以先体验一下 ad-hoc，感受一下 Ansible 的强大。

简单示例：

	# 在指定的 host1 节点上执行
	ansible host1 -a "/bin/echo hello"
	# 在多个节点执行
	ansible host1,host2 -a "/bin/echo hello"
	ansible host1:host2 -a "/bin/echo hello"
	# ping 全部节点
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

## Ansible module
`-m` 选项后面的就是 Ansible 的 module，常见的 module，比如上面例子中的 ping，就是用来检测连通性的。

下面介绍一下常用的 module 方便快速进入 Ansible 的世界，理解了下面这些 module 也比较方便之后学习更加复杂的模块。

### setup
setup module 用来查看远程主机信息：

	ansible all -m setup

每个被管理的节点在接受并运行管理命令之前都会将自己的信息报告给 Ansible 主机。

### command
command 命令模块用于在远程主机执行命令，但是不能使用变量，管道等。

执行命令：

	ansible all -m command -a "ls -al ."
	ansible all -m command -a "date"
	# 切换到 sub-dir 目录，创建文件
	ansible all -m command -a "chdir=sub-dir creates=test.file ls"
	# 删除文件
	ansible all -m command -a "chdir=sub-dir removes=test.file ls"

### cron
cron 模块用于配置 crontab 定时任务：

    ansible host -m cron -a 'minute="*/10" job="/bin/echo hello" name="test cron job"'

执行这以命令之后就会给 host 主机的 crontab 中写入

```
#Ansible: test cron job
*/10 * * * * /bin/echo hello
```

可以通过如下命令验证：

    ansible host -a 'crontab -l'

如果要移除 cron 可以：

    ansible host -m cron -a 'minute="*/10" job="/bin/echo hello" name="test cron job" state=absent'

### user
user 模块用来管理用户账户。
    
    # 新增用户
    ansible all -m user -a 'name="einverne"'
    # 删除用户
    ansible all -m user -a 'name="einverne" state=absent'

和用户相关的字段：

```
name    用户名
uid     uid
state   状态  
group   属于哪个组
groups  附加组
home    家目录
createhome  是否创建家目录
comment 注释信息
system  是否是系统用户
```

user module 更多的说明可以参考[官网](https://docs.ansible.com/ansible/2.9/modules/user_module.html)

### group
组管理同样拥有这些配置：

```
gid     gid      
name    组名              
state   状态          
system  是否是系统组
```

### file
file module 可以用来设置文件属性。

	# 创建 soft link
	ansible all -m file -a "src=/etc/resolv.conf dest=/tmp/resolv.conf state=link"
	# 删除 soft link
	ansible all -m file -a "path=/tmp/resolv.conf state=absent"

### copy
复制本地文件到远程主机指定位置

	# 复制本地文件到远程主机，并授予权限
	ansible host -m copy -a "src=/etc/ansible/ansible.cfg dest=/tmp/ansible.cfg owner=root group=root mode=644"
    # 直接使用 content
    ansible host -m copy -a 'content="test content" dest=/tmp/test'

### shell
在远程执行 shell 脚本，可以使用管道等

	ansible all -m shell -a "~/setup.sh"
    ansible all -m shell -a 'echo demo > /tmp/demo'

更多 module 可以使用 `ansible-doc -l` 查看。

### 小结
看到这里的话，相信对 ansible 的 module 已经有了一个大致的了解，Ansible 官网提供了非常多的 [module 使用说明](https://docs.ansible.com/ansible/2.9/modules/modules_by_category.html)。

但是你会发现一个问题，所有的这些命令都是一次性使用的，而无法做到复用，除非你拷贝这一行命令执行多次。所以 Ansible 也可以通过配置文件的方式，将这些操作记录下来，以文本的方式进行管理，这就是下面要说到的 Ansible playbook。

## Ansible playbook
上面提到 `ad-hoc` 可以执行一次性的命令，但如果要把多个 task 组织起来，那就不得不提到 playbook, playbook 可以编排有序的任务，可以在多组主机间，有序执行任务，可以选择同步或者异步发起任务。

下面以一个安装 Docker 的例子做演示：

定义了变量的文件 `var/default.yml`:

```yaml
---
create_containers: 4
default_container_name: docker
default_container_image: ubuntu
default_container_command: sleep 1d
```

`playbook.yml` 文件：

```yaml
---
- hosts: all
  become: true
  vars_files:
    - vars/default.yml

  tasks:
    - name: Install aptitude using apt
      apt: name=aptitude state=latest update_cache=yes force_apt_get=yes

    - name: Install required system packages
      apt: name={{ item }} state=latest update_cache=yes
      loop: [ 'apt-transport-https', 'ca-certificates', 'curl', 'software-properties-common', 'python3-pip', 'virtualenv', 'python3-setuptools']

    - name: Add Docker GPG apt Key
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present

    - name: Add Docker Repository
      apt_repository:
        repo: deb https://download.docker.com/linux/ubuntu bionic stable
        state: present

    - name: Update apt and install docker-ce
      apt: update_cache=yes name=docker-ce state=latest

    - name: Install Docker Module for Python
      pip:
        name: docker

    - name: Pull default Docker image
      docker_image:
        name: "{{ default_container_image }}"
        source: pull

    # Creates the number of containers defined by the variable create_containers, using values from vars file
    - name: Create default containers
      docker_container:
        name: "{{ default_container_name }}{{ item }}"
        image: "{{ default_container_image }}"
        command: "{{ default_container_command }}"
        state: present
      with_sequence: count={{ create_containers }}
```


说明：

- hosts: 指定了哪些服务器执行该 playbook 中的 tasks
- tasks: 一系列执行的任务，在上面的例子中就是安装必要的依赖，然后安装 Docker，随后 pull 镜像，并启动容器

使用如下命令执行 playbook

	ansible-playbook playbook.yml -f 10

`-f` 表示的是指定并发进程来执行任务。

### when 语句
在 task 后面可以增加 when 用于条件，比如只有系统是 `Debian` 才执行命令：

```
tasks:
  - name 'test when'
    command: /bin/echo hello
    when: ansible_os_family == 'Debian'
```

### 循环
如果需要重复执行一个任务，可以使用循环，将需要循环的内容定义为 item，然后通过 `with_items` 语句指定列表，比如新建两个用户：

```
- name: add user
  user: name={{ item }} state=present
  with_items:
    - user1
    - user2
```

上面语句的功能等同于下面的语句：
```
- name: add user testuser1
 user: name=user1 state=present
- name: add user testuser2
 user: name=user2 state=present
```

如果还要定义 group，可以使用 key-value 键值对:

```
- name: add multiple item
  user: name={{ item.name }} state=present groups={{ item.groups }}
  with_items:
    - { name: 'user1', groups: 'g1'}
    - { name: 'user2', groups: 'root'}
```



### role
再来看一个例子：

	- hosts:webservers
	  roles:
		- tmux

这里 role 定义了 tmux(tmux 编译安装），则表示用 tmux 执行了一系列的命令。role 由其他一些组件组成：

	roles/
	   tmux/
		 tasks/
		 handlers/
		 files/
		 templates/
		 vars/
		 defaults/
		 meta/

在 tasks 目录下新建 `mail.yml`:

	- name: install tmux package
	  package:
		name:
		  - libevent
		  - ncurses
		  - tmux
		state: latest


如果想了解更多拆分 playbook 的方法，可以到官网查看更多 include, role 相关的内容。

### Check Mode (dry-run)

当使用 check mode 运行 ansible-playbook 时，Ansible 不会在远程服务器上执行任何命令。

	ansible-playbook foo.yml --check

## ansible-galaxy

### 创建 role
`ansible-galaxy` 命令和 Ansible 命令绑定到了一起，可以通过 `ansible-galaxy` 来初始化 role.

	ansible-galaxy init pyenv

得到：

	➜ tree pyenv
	pyenv
	├── defaults
	│   └── main.yml
	├── files
	├── handlers
	│   └── main.yml
	├── meta
	│   └── main.yml
	├── README.md
	├── tasks
	│   └── main.yml
	├── templates
	├── tests
	│   ├── inventory
	│   └── test.yml
	└── vars
		└── main.yml

在使用时，每一个目录都需要包含一个 `mail.yml` 文件：

- `tasks`: 包含 role 需要执行的任务清单
- `handlers`: 包含 handlers, 可能被 role 用到
- `defaults`: 默认变量，[Using Variables](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#playbooks-variables)
- `vars`: 其他被 role 用到的变量 [Variable](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#playbooks-variables)
- `files`: 包含可能被 role 用到的文件
- `templates`: 包含可能被 role 用到的 templates
- `meta`: 定义 role 的 meta data

YAML 文件可以被引入，比如不同的系统版本：

	# roles/example/tasks/main.yml
	- name: added in 2.4, previously you used 'include'
	  import_tasks: redhat.yml
	  when: ansible_facts['os_family']|lower == 'redhat'
	- import_tasks: debian.yml
	  when: ansible_facts['os_family']|lower == 'debian'

	# roles/example/tasks/redhat.yml
	- yum:
		name: "httpd"
		state: present

    # roles/example/tasks/debian.yml
	- apt:
		name: "apache2"
		state: present


## 延伸
其他的运维管理工具 puppet、cfengine、chef、func、fabric.

Redhat 给 Ansible 做了一套 GUI，叫做 Ansible Tower，感兴趣可以了解一下。

## reference

- <https://docs.ansible.com/>
- <http://www.ansible.com.cn/docs/>
- <https://galaxy.ansible.com/docs/>
- <https://www.ansible.com/overview/how-ansible-works>
- <https://spacelift.io/blog/ansible-playbooks>

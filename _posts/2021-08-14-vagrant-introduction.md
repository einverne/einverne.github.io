---
layout: post
title: "使用 Vagrant 自动创建配置虚拟机"
aliases: 
- "使用 Vagrant 自动创建配置虚拟机"
tagline: ""
description: ""
category: 学习笔记
tags: [ vagrant, virtual-box, docker, linux, vmware, ]
last_updated:
---

Vagrant 是一个使用 Ruby 编写，基于纯文本文件自动化创建和配置虚拟机的工具。

基于 VirtualBox 和 [[VMware]] ，通过 Vagrant 去控制虚拟机。

Vagrant 是 [hashicorp](https://www.hashicorp.com/) 公司的产品。该公司有大量的开源[项目](https://github.com/hashicorp)。

Vagrant 提供了 vagrant 命令，通过 `Vagrantfile` 文件声明虚拟机配置。

## Prerequisite

- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- Linux with [Vagrant Installed](https://www.vagrantup.com/downloads.html)

## Terminology

- Box，Vagrant 中的虚拟机镜像
- Provider，为 Vagrant 提供虚拟化支持的具体工具，比如 VirtualBox，或 VMware
- Provisioning，虚拟机实例启动后的初始化

## 安装 Vagrant

### Linux
按照官网的介绍[安装](https://www.vagrantup.com/downloads)。

### macOS

```
brew cask install virtualbox
brew cask virtualbox-extension-pack
brew cask install vagrant
```

下载一个虚拟机：

    vagrant box add ubuntu/trusty64

初始化一个 Ubuntu 镜像：

```
vagrant init ubuntu/trusty64
```

在初始化之后可以在当前目录下找到 `Vagrantfile`:

```
# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"
end
```

ubuntu/trusty64 是在 Vagrant [官网](https://app.vagrantup.com/boxes/search)搜索到的虚拟机的镜像。

启动虚拟机：

```
vagrant up
```

```
❯ vagrant up
Bringing machine 'default' up with 'virtualbox' provider...
==> default: Box 'ubuntu/trusty64' could not be found. Attempting to find and install...
    default: Box Provider: virtualbox
    default: Box Version: >= 0
==> default: Loading metadata for box 'ubuntu/trusty64'
    default: URL: https://vagrantcloud.com/ubuntu/trusty64
==> default: Adding box 'ubuntu/trusty64' (v20190514.0.0) for provider: virtualbox
    default: Downloading: https://vagrantcloud.com/ubuntu/boxes/trusty64/versions/20190514.0.0/providers/virtualbox.box
Download redirected to host: cloud-images.ubuntu.com
==> default: Successfully added box 'ubuntu/trusty64' (v20190514.0.0) for 'virtualbox'!
==> default: Importing base box 'ubuntu/trusty64'...
==> default: Matching MAC address for NAT networking...
==> default: Checking if box 'ubuntu/trusty64' version '20190514.0.0' is up to date...
==> default: Setting the name of the VM: vagrant_default_1630040745169_54425
==> default: Clearing any previously set forwarded ports...
Vagrant is currently configured to create VirtualBox synced folders with
the `SharedFoldersEnableSymlinksCreate` option enabled. If the Vagrant
guest is not trusted, you may want to disable this option. For more
information on this option, please refer to the VirtualBox manual:

  https://www.virtualbox.org/manual/ch04.html#sharedfolders

This option can be disabled globally with an environment variable:

  VAGRANT_DISABLE_VBOXSYMLINKCREATE=1

or on a per folder basis within the Vagrantfile:

  config.vm.synced_folder '/host/path', '/guest/path', SharedFoldersEnableSymlinksCreate: false
==> default: Clearing any previously set network interfaces...
==> default: Preparing network interfaces based on configuration...
    default: Adapter 1: nat
==> default: Forwarding ports...
    default: 22 (guest) => 2222 (host) (adapter 1)
==> default: Booting VM...
==> default: Waiting for machine to boot. This may take a few minutes...
    default: SSH address: 127.0.0.1:2222
    default: SSH username: vagrant
    default: SSH auth method: private key
    default: 
    default: Vagrant insecure key detected. Vagrant will automatically replace
    default: this with a newly generated keypair for better security.
    default: 
    default: Inserting generated public key within guest...
    default: Removing insecure key from the guest if it's present...
    default: Key inserted! Disconnecting and reconnecting using new SSH key...
==> default: Machine booted and ready!
==> default: Checking for guest additions in VM...
    default: The guest additions on this VM do not match the installed version of
    default: VirtualBox! In most cases this is fine, but in rare cases it can
    default: prevent things such as shared folders from working properly. If you see
    default: shared folder errors, please make sure the guest additions within the
    default: virtual machine match the version of VirtualBox you have installed on
    default: your host and reload your VM.
    default: 
    default: Guest Additions Version: 4.3.40
    default: VirtualBox Version: 6.1
==> default: Mounting shared folders...
    default: /vagrant => /home/einverne/Git/vagrant
```

修改 Vagrant 可以自定义虚拟机网络，内存和 CPU 等等。

```
# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |config|
  machine_box = "ubuntu/trusty64"

  config.vm.define "local-env-1" do |machine|
    machine.vm.box = machine_box
    machine.vm.hostname = "local-env-1"
    machine.vm.network "private_network", ip: "192.168.33.11"
    machine.vm.provider "virtualbox" do |node|
        node.name = "local-env-1"
        node.memory = 2048
        node.cpus = 2
    end
   end

   config.vm.define "local-env-2" do |machine|
    machine.vm.box = machine_box
    machine.vm.hostname = "local-env-2"
    machine.vm.network "private_network", ip: "192.168.33.12"
    machine.vm.network "forwarded_port", guest: 26379, host: 26380
    machine.vm.provider "virtualbox" do |node|
        node.name = "local-env-2"
        node.memory = 2048
        node.cpus = 2
    end
   end
end
```


启动之后可以通过 `vagrant ssh $name` 登录虚拟机。

在虚拟机启动后 `/vagrant` 目录会挂载宿主机的同级目录。文件是同步的，这样就可以通过该目录来共享文件。

### 执行额外的操作

在 Vagrantfile 中可以如下语法：

    config.vm.provision :shell, path: "bootstrap.sh"

会执行 `bootstrap.sh` 脚本。


## Vagrant Box
Vagrant Box 相对于 Vagrant，就像是 Docker Image 对应于 Docker。

可以使用：

    vagrant box add name

来添加 Box。

升级 Box

    vagrant box update --box name

删除 Box

    vagrant box remove name


## Vagrant 常用命令
常用命令有：

- vagrant up
- vagrant halt: 关闭虚拟机
- vagrant destroy：销毁虚拟机
- vagrant status
- vagrant reload
- vagrant restart
- vagrant box list: 列出当前机器缓存的镜像

## 常用配置

### 网络配置
和 Docker 类似，Vagrant 也有几种不同的网络配置：

端口映射，将宿主机端口映射到虚拟机端口，宿主机 8080 端口映射到虚拟机 80 端口：

    config.vm.network "forwarded_port", guest: 80, host: 8080

私有网络（host-only)，只有宿主机能访问虚拟机，多个虚拟机在同一个网段，相互可以访问：

    config.vm.network "private_network", ip: "192.168.21.4"

公有网络（bridge)，虚拟机和宿主机相当于局域网中独立的主机，设置静态IP：

    config.vm.network "public_network", ip: "192.168.1.120"

如果使用 public_network 而不配置 IP，那么会 DHCP 自动获取 IP 地址。

### 共享目录
设置共享目录，Vagrant 使用 rsync 来同步文件：

    config.vm.synced_folder "/directory/of/host_machine", "/directory/of/guest_machine"

### Provision
虚拟机实例启动之后，通过工具自动设置，支持 Shell，Puppet，Chef，Ansible 等等：

```
config.vm.provision "shell", run: "always", inline: <<-SHELL
    sudo yum install -y net-tools
SHELL
```

run: "always"表示每次vagrant up的时候，都执行Provision。

引用外部脚本：

    config.vm.provision "shell", path: "script.sh

并非每次vagrant up的时候，都会执行Provision。只有在下面3种情况下Provision才会执行：

- 首次执行vagrant up
- 执行vagrant provision
- 执行vagrant reload --provision

使用 Ansible

```
  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "playbook.yml"
  end
```

使用虚拟机内部的 Ansible：

```
Vagrant.configure("2") do |config|
  # Run Ansible from the Vagrant VM
  config.vm.provision "ansible_local" do |ansible|
    ansible.playbook = "playbook.yml"
  end
end
```


## 创建自己的虚拟机
    vagrant package --output hadoop_master.box hadoop_master

hadoop_master是虚拟机实例名称，hadoop_master.box是box名。  
在创建box的时候，如果虚拟机实例正在运行，vagrant会先halt，然后再export。

将box添加到本地仓库：

    vagrant box add hadoop_master hadoop_master.box

查看本地仓库的box列表：

    $ vagrant box list
    centos7       (virtualbox, 0)
    hadoop_master (virtualbox, 0)

创建并且切换到用于测试的项目目录：

    mkdir ~/test_vagrant && cd ~/test_vagrant

创建Vagrantfile，并使用刚才新创建的hadoop_master.box作为box：

    vagrant init -m hadoop_master

创建，并启动虚拟机：

    vagrant up

登陆到虚拟机：

    vagrant ssh

可以看到和创建box之前的虚拟机是一模一样的


## 延伸阅读

- [[2020-05-01-ansible-introduction]]
- <https://github.com/rootsongjc/kubernetes-vagrant-centos-cluster>
- <https://github.com/cloudnative-tech/kubeadm-vagrant>
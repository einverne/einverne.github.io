---
layout: post
title: "使用 Ansible 管理 Crontab"
aliases:
- "使用 Ansible 管理 Crontab"
tagline: ""
description: ""
category: 学习笔记
tags: [ ansible, playbook, crontab, python, linux ]
create_time: 2023-05-21 14:10:54
last_updated: 2023-05-21 14:10:54
---

[[Ansible]] 是使用 Python 开发的自动化运维工具。它可以配置管理，部署软件并编排更高级的任务，例如持续部署或零停机滚动升级。Ansible 可以用来管理 crontab。[[Crontab]] 是一个用于在 Unix 和 Unix-like 操作系统上执行定期任务的工具，它允许用户在预定的时间间隔内自动运行命令或脚本。Crontab 是 Cron Table 的缩写，Cron 是一个用于定时执行任务的守护进程。

Crontab 使用一个称为 crontab 文件的特殊文件来定义定期任务的计划。每个用户都可以拥有自己的 crontab 文件，其中包含一系列命令或脚本以及与之关联的时间规则。更加详细的 cron 使用可以参考之前的[文章](/post/2017/03/crontab-schedule-task.html)

借助 Ansible，用户可以轻松地创建、修改和删除 crontab 条目，自动化 Crontab 任务的管理。

## 为什么需要用 Ansible 管理 crontab

在没用使用 Ansible 之前，都是通过 `crontab -e` 手动对 cron 任务进行管理，通常的任务就是备份与同步。但是随着要管理的机器和需要定义的脚本内容越来越复杂，手工编辑 crontab 就无法维护了。

另外在学习 Ansible 之后，了解了「Infrastructure as Code」概念，通过配置文件来定义所有的配置修改是一个不错的解决方案。这样一方面不用自己备份所有的脚本内容，也不用每一次都临时创建。在系统初始化的时候，直接通过 Ansible 就能纳入管理。

## 安装 Ansible

首先，确保你的系统上已经安装了 Ansible。你可以使用包管理器来安装它。例如，在 Ubuntu 上，你可以运行以下命令：

```
sudo apt update
sudo apt install ansible
```

下面是一些使用 Ansible 管理 crontab 的常见任务示例：

### 创建 crontab 条目：

使用 Ansible 创建 crontab 条目非常简单。你可以编写一个 Ansible playbook 文件，其中定义了你要创建的 crontab 条目。以下是一个示例 playbook 文件的内容：

```yaml
---
- name: Manage crontab
  hosts: your_target_hosts
  tasks:
    - name: Add crontab entry
      cron:
        name: "rsync backup"
        minute: "0"
        hour: "2"
        job: "/path/to/your/backup_script.sh"
```

在这个示例中，`your_target_hosts` 是你要管理 crontab 的目标主机的列表。`name` 字段是 crontab 条目的名称，`minute` 和 `hour` 字段是定时任务的执行时间，`job` 字段是要执行的脚本或命令。

保存以上内容到一个 YAML 文件（比如 `crontab.yml`），然后运行以下命令来执行 playbook：

```
ansible-playbook crontab.yml
```

将在目标主机上创建一个新的 crontab 条目。

### 修改和删除 crontab 条目：

要修改或删除现有的 crontab 条目，你可以使用 Ansible 的 `cron` 模块的 `state` 参数。以下是一个示例 playbook 文件，演示如何修改和删除 crontab 条目：

```yaml
---
- name: Manage crontab
  hosts: your_target_hosts
  tasks:
    - name: Modify crontab entry
      cron:
        name: "My cron job"
        minute: "30"
        hour: "3"
        job: "/path/to/your/updated_script.sh"
        state: present

    - name: Remove crontab entry
      cron:
        name: "My cron job"
        state: absent
```

在这个示例中，`state: present` 表示修改 crontab 条目，`state: absent` 表示删除 crontab 条目。保存以上内容到一个 YAML 文件，然后运行 `ansible-playbook` 命令来执行 playbook。

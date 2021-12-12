---
layout: post
title: "使用 Ansible Roles 结构化并复用 playbook"
aliases: 
- "使用 Ansible Roles 结构化并复用 playbook"
tagline: ""
description: ""
category: 学习笔记
tags: [ ansible, ansible-playbook, ansible-role, linux, python ]
last_updated:
---


之前简单的了解过一下 Ansible，但没怎么具体使用起来，这两天因为要管理的机器多了起来，所以又把 Ansible 学了起来。这篇文章就主要了解一下 Ansible Roles 的使用。

之前的文章简单的知道在 Ansible 中可以使用 playbook 来组织一系列的任务。但如果要复用这些任务，并且更加模块化的花，那就离不开 Ansible Roles。

## Role 用来解决的问题
之前的文章中也说过可以使用 playbook 来管理一系列的任务，但随着使用 playbook 就不可以免的膨胀，可能会出现上百行的 playbook，那为了复用和结构化地组织 playbook, Ansible 在 1.2 版本引入了 Roles 的概念。

- 层次化、结构化组织 playbook
- 复用任务


## Roles
Ansible 中的 Roles 是 Ansible 的另一个重要的概念，通过 Roles 可以通过文件结构自动加载相关的 vars, files, tasks, handlers, 或者其他 Ansible 组件。这样说可能比较抽象，可以理解成通过在文件系统上的文件分类，可以自动让 Ansible Roles 去加载相关的内容。一旦通过 Roles 组织了内容就可以非常简单地复用和分享给其他人。

### Role directory structure

Ansible Role 定义了一个目录结构，包括了8大类标准的结构，一个 Role 必须包含至少其中一个文件夹，其他没有使用的文件夹可以省略：

```
# playbooks
site.yml
webservers.yml
fooservers.yml
roles/
    common/
        tasks/
        handlers/
        library/
        files/
        templates/
        vars/
        defaults/
        meta/
    webservers/
        tasks/
        defaults/
        meta/
```

默认情况下 Ansible 会自动寻找每一个目录下的 `main.yml` 文件（`main.yaml` 或者 `main`)。

- `tasks/main.yml`，role 需要执行的主要任务
- `handlers/main.yml`，可能会被使用的 handlers，可以由该 role 使用，也可以被 role 之外的其他任务使用
- `library/my_module.py` modules
- `defaults/main.yml` 默认变量
- `vars/main.yml` role 的其他变量
- `files/main.yml` files that the role deploys，role 需要使用的文件
- `templates/main.yml` templates that the role deploys
- `meta/main.yml` metadata，角色依赖

### Storing and finding roles
默认情况下 Ansible 会在下面两个位置寻找 Roles:

- 相对于 playbook 的目录 `roles` 中
- `/etc/ansible/roles` 中

也可以通过 [roles_path](https://docs.ansible.com/ansible/latest/reference_appendices/config.html#default-roles-path) 的方式指定 Role 的位置。更多可以参考 [Configuring Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_configuration.html#intro-configuration)。

在 `ansible.cfg` 中定义：

```
roles_path    = /etc/ansible/roles:/usr/share/ansible/roles
```


或者也可以直接指定具体的 path:

```
---
- hosts: webservers
  roles:
    - role: '/path/to/my/roles/common'
```

## 使用 Roles
可以通过三种方式使用 Roles：

- 在 play 层级使用 `roles` 选项，最常用的方式
- 在 tasks 级别使用 `include_role`，可以动态使用
- 在 tasks 级别使用 `import_role`，静态使用

### Using roles at the play level
在 playbook 中，可以这样使用role：

```
- hosts: webserver
 roles:
   - common 
   - webserver
```

可以传递参数：

```
---
- hosts: webservers
  roles:
    - common
    - role: foo_app_instance
      vars:
        dir: '/opt/a'
        app_port: 5000
      tags: typeA
    - role: foo_app_instance
      vars:
        dir: '/opt/b'
        app_port: 5001
      tags: typeB
```


也可以向 roles 传递参数，例如：

```
- hosts: webserver
 roles:
   - common
   - { role: foo_app_instance, dir:'/opt/a',port:5000}
   - { role: foo_app_instance, dir:'/opt/b',port:5001}
```

甚至也可以条件式地使用roles，例如：

```
- hosts：webserver
 roles:
   - { role: some_role, when: "ansible_so_family == 'RedHat" }
```


### Including roles: dynamic reuse
`include_role` 会按照定义的顺序执行，如果之前有定义其他的任务，会先执行其他任务。

```
---
- hosts: webservers
  tasks:
    - name: Print a message
      ansible.builtin.debug:
        msg: "this task runs before the example role"

    - name: Include the example role
      include_role:
        name: example

    - name: Print a message
      ansible.builtin.debug:
        msg: "this task runs after the example role"
```

### Importing roles: static reuse
行为和上面的一样。

```
---
- hosts: webservers
  tasks:
    - name: Print a message
      ansible.builtin.debug:
        msg: "before we run our role"

    - name: Import the example role
      import_role:
        name: example

    - name: Print a message
      ansible.builtin.debug:
        msg: "after we ran our role"
```


## 使用 ansible-galaxy 创建 role
可以使用 `ansible-galaxy role init role_name` 来创建 role，这个命令会创建一个目录结构。

- 创建以roles命名的目录
- 在roles目录中分别创建以各角色命名的目录，如webserver等
- 在每个角色命名的目录中分别创建files、handlers、meta、tasks、templates和vars目录；用不到的目录可以创建为空目录，也可以不创建

使用 ansible-galaxy 创建的 role 会有一些初始化的设定，在 meta/main.yml 中可以看到基础的 `galaxy_info` 配置，包括了作者信息，协议等等。


### role内各目录中可应用的文件

- task目录：至少应该包含一个为main.yml的文件，其定义了此角色的任务列表；此文件可以使用include包含其它的位于此目录中的task文件；
- file目录：存放由copy或script等模板块调用的文件；
- template目录：template模块会自动在此目录中寻找jinja2模板文件；
- handlers目录：此目录中应当包含一个main.yml文件，用于定义此角色用到的各handlers，在handler中使用include包含的其它的handlers文件也应该位于此目录中；
- vars目录：应当包含一个main.yml文件，用于定义此角色用到的变量
- meta目录：应当包含一个main.yml文件，用于定义此角色的特殊设定及其依赖关系；ansible1.3及其以后的版本才支持；
- default目录：应当包含一个main.yml文件,用于为当前角色设定默认变量时使用此目录；

## 通过 ansible-galaxy 认识 Roles

```
ansible-galaxy list  # 列出已经安装的galaxy
ansible-galaxy install geerlingguy.redis  # 安装一个galaxy role
ansible-galaxy remove geerlingguy.redis  # 删除一个galaxy role
```


## reference

- <https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse_roles.html>
- <https://www.redhat.com/sysadmin/developing-ansible-role>
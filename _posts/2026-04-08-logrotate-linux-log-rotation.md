---
layout: post
title: "logrotate 使用详解：Linux 服务器日志管理的必备工具"
aliases:
- "logrotate 使用详解：Linux 服务器日志管理的必备工具"
tagline: "别让日志把磁盘撑爆，logrotate 帮你自动化管理"
description: "介绍 Linux 下 logrotate 的工作原理、配置方法、常见场景和实践技巧，帮助你从手动清理日志的困境中解放出来。"
category: 学习笔记
tags: [logrotate, linux, log-management, sysadmin, server, cron, devops]
create_time: 2026-04-08 17:00:00
last_updated: 2026-04-08 17:00:00
---

![logrotate Linux 日志轮转](https://pic.einverne.info/images/2026-04-08-logrotate-linux-log-rotation.png)

前段时间有一台跑了几个月没怎么管的 VPS，突然收到磁盘空间告警。SSH 上去一看，`/var/log` 目录下积攒了好几个 GB 的日志文件，其中 [[Nginx]] 的 access.log 一个文件就占了 3GB 多。其实这类问题我遇到过不止一次了，每次的解决方案都很简单——确保 logrotate 正确配置。logrotate 是 Linux 系统上一个看似不起眼却极其重要的工具，它能自动帮你轮转、压缩、删除旧日志，让日志管理真正变成一件不需要操心的事情。

## logrotate 是什么

logrotate 是 Linux 系统上专门用来管理日志文件的工具，几乎所有主流发行版都会预装它。它的核心功能可以概括为四个字：日志轮转（log rotation）。所谓轮转，就是当一个日志文件达到一定大小或者经过一定时间后，logrotate 会把当前的日志文件重命名（比如从 `app.log` 变成 `app.log.1`），然后创建一个新的空日志文件让应用继续写入。旧的日志文件可以被压缩以节省空间，超过保留期限的日志则会被自动删除。

这个过程完全自动化，由 [[cron]] 定时触发。在大多数系统上，logrotate 作为一个 cron 任务每天执行一次，默认的触发脚本在 `/etc/cron.daily/logrotate`。你不需要手动去跑它，也不需要写脚本定期清理日志，logrotate 已经帮你把这些事情处理好了。

之所以需要日志轮转，原因很直接：日志文件只增不减。无论是 Web 服务器的访问日志、应用程序的运行日志，还是系统自身的 syslog，如果不加管理，这些文件会一直膨胀下去，直到把磁盘空间耗尽。磁盘满了之后的连锁反应往往是灾难性的——服务无法写入数据、数据库崩溃、甚至整个系统无法正常运行。logrotate 就是为了从根本上避免这种情况而设计的。

## logrotate 的工作原理

理解 logrotate 的工作方式有助于在实际使用中做出正确的配置选择。整个流程大致分为三个阶段。

第一个阶段是条件判断。logrotate 被 cron 触发后，会逐一检查配置文件中定义的每个日志文件。它会根据配置的策略来判断是否需要轮转，策略可以是基于时间的（每天、每周、每月），也可以是基于文件大小的（超过指定大小才轮转）。如果条件不满足，logrotate 会跳过这个文件。

第二个阶段是执行轮转。当条件满足时，logrotate 会按照配置的方式进行轮转操作。最常见的方式是把当前日志文件重命名，然后创建一个新的空文件。比如 `app.log` 会变成 `app.log.1`，之前的 `app.log.1` 变成 `app.log.2`，以此类推。如果配置了压缩，旧的日志文件还会被 gzip 压缩成 `app.log.1.gz` 这样的格式。超出保留数量的最老日志会被直接删除。

第三个阶段是后续处理。轮转完成后，logrotate 可以执行你预先定义的脚本。这个阶段非常关键，因为很多应用程序（比如 Nginx、[[MySQL]]）在日志文件被重命名后，仍然会向旧的文件描述符写入数据。你需要通过 `postrotate` 脚本通知应用程序重新打开日志文件，通常的做法是给进程发一个 `SIGUSR1` 或 `HUP` 信号。

logrotate 自身会维护一个状态文件，默认位于 `/var/lib/logrotate/status`（某些系统上是 `/var/lib/logrotate.status`），用来记录每个日志文件上一次轮转的时间。这样即使某一天 cron 没有正常执行，logrotate 在下一次运行时也能正确判断是否需要补上遗漏的轮转。

## 配置文件结构

logrotate 的配置分为全局配置和独立配置两部分。全局配置文件是 `/etc/logrotate.conf`，它定义了默认的轮转策略。而 `/etc/logrotate.d/` 目录下则存放着各个应用程序的独立配置文件，这样做的好处是每个应用的日志管理策略可以独立维护，互不干扰。

全局配置文件通常长这样：

```bash
# 默认每周轮转一次
weekly

# 保留 4 个旧日志文件
rotate 4

# 轮转后创建新的空日志文件
create

# 对旧日志文件进行 gzip 压缩
compress

# 引入 /etc/logrotate.d/ 目录下的所有配置
include /etc/logrotate.d
```

这些全局选项会作为默认值应用到所有日志文件上，除非在独立配置文件中被覆盖。独立配置文件的格式也很简洁：

```bash
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

这个例子是 Nginx 日志的典型配置。花括号前面的路径指定了要管理的日志文件，支持通配符。花括号内部是针对这些文件的轮转策略。

## 常用配置指令详解

logrotate 提供了丰富的配置指令，这里介绍最常用的那些，理解了这些基本上就能应对绝大多数场景。

轮转频率方面，`daily`、`weekly`、`monthly`、`yearly` 分别对应每天、每周、每月、每年轮转一次。如果你更倾向于基于文件大小来决定是否轮转，可以使用 `size` 指令，比如 `size 100M` 表示日志文件超过 100MB 才会触发轮转。还有一个 `maxsize` 指令可以和时间频率配合使用，它的含义是无论有没有到轮转周期，只要文件超过指定大小就立即轮转。

日志保留方面，`rotate 14` 表示保留 14 个旧日志文件，超出部分自动删除。如果设置成 `rotate 0`，旧日志在轮转后会被直接删除而不做保留。`maxage 30` 则是按天数来控制，超过 30 天的旧日志会被删除，这个和 `rotate` 可以同时使用，哪个条件先满足就先触发删除。

压缩相关的指令中，`compress` 开启 gzip 压缩，`delaycompress` 表示延迟一个轮转周期再压缩，也就是 `app.log.1` 先保持未压缩状态，到下一次轮转变成 `app.log.2` 时才被压缩。这样做的好处是某些需要读取最近日志的工具（比如 fail2ban）可以直接读取未压缩的 `app.log.1` 而不需要先解压。`compresscmd` 可以指定压缩工具，默认是 gzip，如果你想用 [[zstd]] 或者 [[bzip2]] 也可以替换。

文件创建方面，`create 0640 www-data adm` 指定了轮转后新日志文件的权限、所有者和所属组。如果你的应用以特定用户身份运行，这个设置非常重要，权限不对可能导致应用无法写入新的日志文件。另一种方式是 `copytruncate`，它不会重命名原文件，而是先复制一份，然后把原文件清空。这种方式的好处是应用程序不需要感知日志轮转的发生，因为文件句柄始终没有变化。缺点是在复制和清空之间有一个极小的时间窗口，这期间写入的日志可能会丢失。

容错处理方面，`missingok` 表示如果日志文件不存在也不报错，默认行为是报错。`notifempty` 表示空的日志文件不进行轮转，避免产生一堆空的归档文件。`sharedscripts` 表示当配置中使用了通配符匹配多个日志文件时，`postrotate` 脚本只执行一次而不是对每个文件都执行一次。

## 实际配置案例

了解了各项指令之后，看几个实际场景中的配置案例会更有帮助。

对于一个典型的 [[Node.js]] 或 [[Python]] Web 应用，日志通常由应用自己写入到指定路径：

```bash
/var/log/myapp/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
    maxsize 200M
}
```

这里使用 `copytruncate` 是因为很多应用程序没有实现接收信号后重新打开日志文件的逻辑，用 copytruncate 可以避免修改应用代码。`maxsize 200M` 确保即使还没到每天的轮转时间，日志文件过大也会被及时处理。

对于 [[MySQL]] 的慢查询日志，配置稍有不同：

```bash
/var/log/mysql/slow-query.log {
    weekly
    rotate 8
    compress
    missingok
    notifempty
    create 0640 mysql adm
    postrotate
        if [ -f /var/run/mysqld/mysqld.pid ]; then
            /usr/bin/mysqladmin flush-logs
        fi
    endscript
}
```

MySQL 需要通过 `flush-logs` 命令来重新打开日志文件，直接发信号可能不够可靠。另外注意 `create` 指令确保新文件的所有者是 mysql 用户。

对于自定义应用的多个日志文件，有时候你可能希望把不同级别的日志分开管理：

```bash
/var/log/myapp/error.log {
    daily
    rotate 60
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}

/var/log/myapp/access.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
    maxsize 500M
}
```

错误日志保留时间更长因为排查问题时经常需要回溯，访问日志则因为量大而保留较短时间，同时设置了 `maxsize` 防止流量暴增时单文件过大。

## 调试和排错技巧

logrotate 的配置一旦写错，可能要等到下次 cron 执行才能发现问题，所以掌握调试方法很有必要。

最有用的命令是 dry-run 模式：

```bash
logrotate -d /etc/logrotate.d/nginx
```

`-d` 参数（debug）会让 logrotate 模拟执行整个轮转过程，输出详细信息但不会实际修改任何文件。你可以看到它会轮转哪些文件、跳过哪些文件、执行哪些后续脚本。在修改配置后先跑一次 dry-run 是个好习惯。

如果你想手动强制执行一次轮转（不等 cron），可以用 `-f` 参数：

```bash
logrotate -f /etc/logrotate.d/nginx
```

加上 `-v` 参数可以看到更详细的执行过程：

```bash
logrotate -v -f /etc/logrotate.d/nginx
```

遇到问题时，首先检查状态文件。查看 `/var/lib/logrotate/status` 可以知道每个日志文件上次轮转的时间：

```bash
cat /var/lib/logrotate/status
```

如果发现某个日志文件的轮转时间不对，可以手动编辑状态文件来修正，或者直接删除状态文件让 logrotate 重新计算。

另一个常见问题是权限。logrotate 默认以 root 身份运行，但如果你在配置中指定了 `su` 指令（比如 `su www-data www-data`），它会以指定用户的身份来操作日志文件。当轮转失败且 dry-run 显示权限错误时，检查日志目录和文件的权限设置通常能找到问题所在。

配置文件的语法错误也是常见的坑。logrotate 对格式比较敏感，花括号必须独占一行（或者和路径在同一行），`postrotate` 和 `endscript` 之间的脚本内容缩进要一致。如果 dry-run 报语法错误，仔细检查花括号和脚本块的格式。

## 和 systemd 的关系

在比较新的 Linux 发行版上，logrotate 的触发方式已经从传统的 cron 切换到了 [[systemd]] timer。你可以通过以下命令查看 logrotate timer 的状态：

```bash
systemctl status logrotate.timer
systemctl list-timers | grep logrotate
```

如果 timer 处于 inactive 状态，logrotate 就不会被自动触发，这也是一些用户升级系统后发现日志不再轮转的常见原因。启用 timer 很简单：

```bash
sudo systemctl enable logrotate.timer
sudo systemctl start logrotate.timer
```

使用 systemd timer 和 cron 在效果上没有本质区别，只是触发机制不同。systemd timer 的一个优势是可以通过 `journalctl -u logrotate` 来查看 logrotate 的执行日志，排查问题时更方便。

## 一些容易忽略的细节

在实际使用中，有几个细节值得特别注意。

第一个是 `copytruncate` 和 `create` 的选择。虽然 copytruncate 用起来更省事，但它有丢日志的风险（尽管概率很小）。对于关键的审计日志或计费日志，建议使用 `create` 加 `postrotate` 信号通知的方式，确保不丢失任何一条记录。

第二个是通配符匹配的陷阱。如果你的配置路径是 `/var/log/myapp/*.log`，而实际日志文件名是 `myapp.log.2026-04-08` 这种按日期命名的格式，通配符就匹配不上。确认实际的日志文件名格式和配置中的路径模式一致。

第三个是多个配置文件之间的冲突。如果同一个日志文件在 `/etc/logrotate.conf` 和 `/etc/logrotate.d/` 下的某个文件中都被定义了，logrotate 会报错。用 `logrotate -d /etc/logrotate.conf` 跑一次 dry-run 可以快速发现这类冲突。

第四个是 SELinux 的影响。在 [[CentOS]] 或 RHEL 系统上，如果 logrotate 创建的新日志文件 SELinux 上下文不对，应用程序可能无法写入。使用 `restorecon` 命令可以修复文件的安全上下文：

```bash
restorecon -v /var/log/myapp/app.log
```

## 最后

logrotate 是 Linux 服务器运维中那种"一次配好，长期受益"的工具。它的设计哲学很 Unix——做好一件事，做到足够好。通过合理的配置，你可以让所有应用的日志文件自动轮转、自动压缩、自动清理，彻底告别手动 `rm` 日志或者被磁盘满告警吵醒的日子。

我自己的习惯是每上一个新服务，就顺手在 `/etc/logrotate.d/` 下面加一个对应的配置文件。配置完之后用 `logrotate -d` 跑一遍确认没问题，然后就可以放心地忘掉它。对于管理多台服务器的场景，把 logrotate 的配置纳入你的 [[Ansible]] 或 [[Terraform]] 部署模板中，是确保所有机器日志管理一致性的好做法。日志管理这件事虽然不起眼，但它是服务器稳定运行的基础保障之一。

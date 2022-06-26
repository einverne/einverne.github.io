---
layout: post
title: "每天学习一个命令：crontab 定时任务"
aliases: "每天学习一个命令：crontab 定时任务"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, cron, crontab, scheduler, period]
last_updated:
---


通过 crontab 命令可以让我们在固定的时间点或者特定时间间隔执行指定的系统指令或 shell 脚本。时间间隔的单位可以是分钟、小时、日、月、周及以上的任意组合。这个命令非常适合周期性的日志分析或数据备份等工作。

cron 的名字，没有特别明确的定义，cron 名字的由来是 Ken Thompson（Unix cron 的作者）说过的， cron 的名字由希腊语 time 的前缀 chron 得来 [^cronname]。

cron 守护进程是一个由实用程序和配置文件组成的小型子系统，在几乎所有类 UNIX 系统上都可以找到某种风格的 cron。cron 的组件包括

- 守护进程本身
- 一组系统范围的配置文件
- 一组针对特定用户的配置文件
- 一个用来添加、修改和删除用户配置文件的实用程序
- 以及一个简单的访问控制设施。

一般来说，cron 配置文件或 cron 任务列表被称为 crontab(cron table)。

守护进程 cron 连续运行，每分钟检查一次配置文件中的修改。cron 读取系统范围的和针对用户的 crontab 、相应地更新事件调度计划并执行这一分钟内应该执行的所有命令。这个守护进程还会获取每个作业的输出（如果有输出的话），并把结果通过电子邮件发送给作业的所有者。

可以在三个位置定义与系统相关的作业：`/etc/crontab`、`/etc/cron.d` 中的任何文件以及特殊目录 /etc/cron.hourly、/etc/cron.daily、/etc/cron.weekly 和 /etc/cron.monthly：

- 主要的系统 crontab 是 /etc/crontab。这个文件有独特的语法（在下面讨论），其中定义的每个作业根据它自己的时间表（比如每小时两次或每天一次）作为指定的用户运行。使用 /etc/crontab 调度各种管理和维护任务。
- 还可以在 /etc/cron.d 目录中维护一组 crontab。通过创建 crontab，按照逻辑对属于某一子系统的命令进行分组。例如，PHP 5 编程语言的包在 /etc/cron.d 中安装一个名为 php5 的 crontab，它会定期清除不使用的会话。/etc/cron.d 中的文件采用与 /etc/crontab 相同的语法，每个作业按照自己的时间表并作为特定的用户运行。
- 还可以把 shell 脚本直接放在 /etc/cron.hourly、/etc/cron.daily、/etc/cron.weekly 或 /etc/cron.monthly 目录中，这样就可以每小时、每天、每周或每月运行此脚本一次。放在这里的脚本作为超级用户运行。

[^cronname]: <http://www.adminschoice.com/crontab-quick-reference>

## 命令格式

crontab 命令主要给用户来维护 crontab 文件，执行定时任务，免去直接修改配置文件的操作。 crontab 可以用来安装 cron ，卸载和列出 cron 的任务。每一个用户都有其自己的定时任务列表，用户的任务保存在 `/var/spool/cron/crontabs` 文件夹下，以用户名为文件名，千万不要手动修改该目录下文件。推荐使用 `crontab -e` 来修改。

    crontab [-u user] file
    crontab [-u user] [ -e | -l | -r ]

如果 `/etc/cron.allow` 文件存在，只有存在该文件中的用户才能使用 cron。 如果 `/etc/cron.deny` 存在，那么只有不在该文件中的用户才能使用 cron。

如果两个文件都不存在，则看 `site-dependent configuration parameters` 配置，要不然 superuser 可以使用，要不然所有用户都可以使用。如果两个文件都存在，则优先使用 `/etc/cron.allow` 文件。不管 这两个文件存不存在 ，superuser 都可以使用。

### 参数
常用的参数如下：

    -u user：用来设定某个用户的 crontab 服务；
    file：file 是命令文件的名字，表示将 file 做为 crontab 的任务列表文件并载入 crontab。如果在命令行中没有指定这个文件，crontab 命令将接受标准输入（键盘）上键入的命令，并将它们载入 crontab。

    -e：编辑某个用户的 crontab 文件内容。如果不指定用户，则表示编辑当前用户的 crontab 文件。
    -l：显示某个用户的 crontab 文件内容，如果不指定用户，则表示显示当前用户的 crontab 文件内容。
    -r：从 /var/spool/cron 目录中删除某个用户的 crontab 文件，如果不指定用户，则默认删除当前用户的 crontab 文件。
    -i：在删除用户的 crontab 文件时给确认提示。

更多其他参数，记得 `man crontab` 来查看。

### 命令格式

crontab 的语法格式：

    *     *     *   *    *        command to be executed
    -     -     -   -    -
    |     |     |   |    |
    |     |     |   |    +----- day of week (0 - 6) (Sunday=0)
    |     |     |   +------- month (1 - 12)
    |     |     +--------- day of month (1 - 31)
    |     +----------- hour (0 - 23)
    +------------- min (0 - 59)

    一个标准的 crontab 配置需要符合如下：

    分 时 日 月 星期 要运行的命令

一个 crontab 的配置文件，通过前五个域来表示时刻，时期，甚至是时间段。每一个域中，可以包含 `*` 或者逗号分割的数字，或者 `-` 连接的数字。

- `*` 号表示任意
- `,` 逗号分割表示时刻， separator
- `-` 短横线连接，表示时间段， range of values
- `/` 表示间隔， 如果第一个域为 /2 ，则表示每隔两分钟， step value


而空格分割的六个域分别表示：

- 第 1 列分钟，取值范围 0～59
- 第 2 列小时 0～23（0 表示子夜）
- 第 3 列日 1～31
- 第 4 列月 1～12
- 第 5 列星期 0～7（0 和 7 表示星期天）
- 第 6 列要运行的命令

注意事项：

1. 重复格式 `/2` 表示没两分钟执行一次 或者 `/10` 表示每 10 分钟执行一次，这样的语法格式并不是被所有系统支持。
2. 具体某一天的指定，可以由第三项（month day）和第五项（weekday）指定，如果两项都被设定，那么 cron 都会执行。

### 创建一个新的 crontab 文件

向 cron 进程提交一个 crontab 文件之前，首先要设置环境变量 EDITOR。cron 进程根据它来确定使用哪个编辑器编辑 crontab 文件。99% 的 UNIX 和 Linux 用户都使用 vi，如果你也是这样，那么你就编辑 $HOME 目录下的。profile 文件，在其中加入这样一行：

    export EDITOR=vim

然后保存并退出。如果不设定，在第一次运行 `crontab -e` 时， crontab 会跳出选项选择合适的 Editor。

使用命令 `crontab -e`。在该文件中加入如下的内容。

    # (put your own initials here)echo the date to the console every
    # 15minutes between 6pm and 6am

    0,15,30,45 18-06 * * * /bin/echo 'date' > /dev/console

保存并退出。注意前面 5 个域用空格分隔。

在上面的例子中，系统将每隔 1 5 分钟向控制台输出一次当前时间。如果系统崩溃或挂起，从最后所显示的时间就可以一眼看出系统是什么时间停止工作的。在有些系统中，用 tty1 来表示控制台，可以根据实际情况对上面的例子进行相应的修改。在使用命令修改  `crontab` 文件之后会自动保存。

现在该文件已经提交给 cron 进程，它将每隔 15 分钟运行一次。同时，新创建文件的一个副本已经被放在 `/var/spool/cron/crontabs` 目录中，文件名就是用户名（即 einverne)。

### 列出 crontab 文件

使用 `-l` 参数列出 crontab 文件：

    crontab -l
    0,15,30,45 18-06 * * * /bin/echo `date` > dev/tty1

可以使用这种方法在 $HOME 目录中对 crontab 文件做一备份：

    crontab -l > $HOME/mycron

这样，一旦不小心误删了 crontab 文件，可以用上面所讲述的方法迅速恢复。

编辑 crontab 文件

如果希望添加、删除或编辑 crontab 文件中的条目，而 EDITOR 环境变量又设置为 vi，那么就可以用 vi 来编辑 crontab 文件：

    crontab -e

可以像使用 vi 编辑其他任何文件那样修改 crontab 文件并退出。如果修改了某些条目或添加了新的条目，那么在保存该文件时， cron 会对其进行必要的完整性检查。如果其中的某个域出现了超出允许范围的值，它会提示你。 我们在编辑 crontab 文件时，没准会加入新的条目。例如，加入下面的一条：

    # DT:delete core files,at 3.30am on 1,7,14,21,26,26 days of each month
    30 3 1,7,14,21,26 * * /bin/find -name 'core' -exec rm {} \;

保存并退出。

### 删除 crontab 文件

    crontab -r

千万别乱运行`crontab -r`。它从 Crontab 目录（/var/spool/cron）中删除用户的 Crontab 文件。删除了该用户的所有 crontab 都没了。

给某一个用户新建 crontab 任务 [^othercron]

    sudo crontab -u einverne -e     # 给 einverne 的用户设定定时任务，需要 superuser 权限

[^othercron]: <http://serverfault.com/questions/185703/how-do-i-edit-the-crontab-of-another-user-on-my-linux-server>

使用 cron 执行 Python 脚本，在 crontab -e 之后使用如下配置：

    */10 * * * * /usr/bin/python script.py

crontab file 启用 定时任务

### 实例

使用实例

实例 1：每 1 分钟执行一次 Command

    * * * * * Command

实例 2：每小时的第 3 和第 15 分钟执行

    3,15 * * * * myCommand

实例 3：在上午 8 点到 11 点的第 3 和第 15 分钟执行

    3,15 8-11 * * * myCommand

实例 4：每隔两天的上午 8 点到 11 点的第 3 和第 15 分钟执行

    3,15 8-11 */2  *  * myCommand

实例 5：每周一上午 8 点到 11 点的第 3 和第 15 分钟执行

    3,15 8-11 * * 1 myCommand

实例 6：每晚的 21:30 重启 smb

    30 21 * * * /etc/init.d/smb restart

实例 7：每月 1、10、22 日的 4 : 45 重启 smb

    45 4 1,10,22 * * /etc/init.d/smb restart

实例 8：每周六、周日的 1 : 10 重启 smb

    10 1 * * 6,0 /etc/init.d/smb restart

实例 9：每天 18 : 00 至 23 : 00 之间每隔 30 分钟重启 smb

    0,30 18-23 * * * /etc/init.d/smb restart

实例 10：每星期六的晚上 11 : 00 pm 重启 smb

    0 23 * * 6 /etc/init.d/smb restart

实例 11：每一小时重启 smb

    * */1 * * * /etc/init.d/smb restart

实例 12：晚上 11 点到早上 7 点之间，每隔一小时重启 smb

    0 23-7 * * * /etc/init.d/smb restart


## 调试 Debug Cron 任务

cron 在 `/var/log/syslog` 中有相关日志，可以使用 `tailf /var/log/syslog | grep cron` 来查看 cron 运行日志。或者使用 `sudo /etc/init.d/cron status` 来查看 cron 运行状态。使用  `restart` 或者 `start` 来重启或者 启动 cron。

### cron 时间 时区问题
更新系统时间时区后需要重启 cron, 在 Ubuntu/Mint 中服务名为 cron。

如果遇到 cron 服务的时间和系统时间不在正确的时区中，可以使用

    dpkg-reconfigure tzdata

来设置正确的时间，之后重启 cron 服务。如果设置确认之后 cron 的时区依然不对，那么重启一下机器尝试一下。

### 环境变量问题

cron 使用 `/usr/bin/sh` 的命令，默认有以下内置变量：

    HOME=user home directory
    LOGNAME=user's login id
    PATH=/usr/bin:/user/sbin:.
    SHELL=/usr/bin/sh

有时我们创建了一个 crontab，但是这个任务却无法自动执行，而手动执行这个任务却没有问题，这种情况一般是由于在 crontab 文件中没有配置环境变量引起的。

在 crontab 文件中定义多个调度任务时，需要特别注环境变量的设置，因为我们手动执行某个任务时，是在当前 shell 环境下进行的，程序当然能找到环境变量，而系统自动执行任务调度时，是不会加载任何环境变量的，因此，就需要在 crontab 文件中指定任务运行所需的所有环境变量，这样，系统执行任务调度时就没有问题了。

不要假定 cron 知道所需要的特殊环境，它其实并不知道。所以你要保证在 shelll 脚本中提供所有必要的路径和环境变量，除了一些自动设置的全局变量。所以注意如下 3 点：

脚本中涉及文件路径时写全局路径；

脚本执行要用到 java 或其他环境变量时，通过 source 命令引入环境变量，如：

    cat start_cbp.sh
    !/bin/sh
    source /etc/profile
    export RUN_CONF=/home/d139/conf/platform/cbp/cbp_jboss.conf
    /usr/local/jboss-4.0.5/bin/run.sh -c mev &

当手动执行脚本 OK，但是 crontab 死活不执行时，很可能是环境变量不正确，可尝试在 crontab 中直接引入环境变量解决问题。如：

    0 * * * * . /etc/profile;/bin/sh /var/www/java/audit_no_count/bin/restart_audit.sh

### 注意清理系统用户的邮件日志

每条任务调度执行完毕，系统都会将任务输出信息通过电子邮件的形式发送给当前系统用户，这样日积月累，日志信息会非常大，可能会影响系统的正常运行，因此，将每条任务进行重定向处理非常重要。 例如，可以在 crontab 文件中设置如下形式，忽略日志输出：

    0 */3 * * * /usr/local/apache2/apachectl restart >/dev/null 2>&1

"/dev/null 2>&1" 表示先将标准输出重定向到 /dev/null，然后将标准错误重定向到标准输出，由于标准输出已经重定向到了 /dev/null，因此标准错误也会重定向到 /dev/null，这样日志输出问题就解决了。

将这条语句拆解开来看：

- `>` 是重定向符
- `/dev/null` 是一个黑洞，任何发送给它的数据都会被丢弃
- `2` 是标准错误的文件描述符
- `>` 同上
- `&` symbol for file descriptor
- `1` 标准输出描述符

可以参考 [Linux IO Redirection](http://www.tldp.org/LDP/abs/html/io-redirection.html) 来了解更多。

### 系统级任务调度与用户级任务调度

系统级任务调度主要完成系统的一些维护操作，用户级任务调度主要完成用户自定义的一些任务，可以将用户级任务调度放到系统级任务调度来完成，但不建议这么做，但是反过来却不行，root 用户的任务调度操作可以通过"crontab –u root –e"来设置，也可以将调度任务直接写入 /etc/crontab 文件，需要注意的是，如果要定义一个定时重启系统的任务，就必须将任务放到 /etc/crontab 文件，即使在 root 用户下创建一个定时重启系统的任务也是无效的。

### 其他注意事项

在 crontab 中 % 是有特殊含义的，表示换行的意思。如果要用的话必须进行转义 `\%`，如经常用的 `date '+%Y%m%d'` 在 crontab 里是不会执行的，应该换成 `date '+\%Y\%m\%d'`。
更新系统时间时区后需要重启 cron, 在 ubuntu 中服务名为 cron:

    service cron restart

Ubuntu/Mint 下启动、停止与重启 cron:

    sudo /etc/init.d/cron start
    sudo /etc/init.d/cron stop
    sudo /etc/init.d/cron restart

## crontab @reboot
如果想要系统在重启之后执行某个脚本，通过 crontab 可以实现：

编辑 crontab:

```
crontab -e
```

然后加入：
```
@reboot /usr/local/xxxxx
@reboot /usr/local/xxxxx.sh
```

## reference

- <http://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/crontab.html>
- <http://www.adminschoice.com/crontab-quick-reference>
- <http://www.thegeekstuff.com/2012/07/crontab-log>
- <https://crontab.guru/>
- <https://www.ibm.com/developerworks/cn/education/aix/au-usingcron/index.html>





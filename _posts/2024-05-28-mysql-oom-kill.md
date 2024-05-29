---
layout: post
title: "如何避免 MySQL 因为内存不足被系统 Kill"
aliases:
- "如何避免 MySQL 因为内存不足被系统 Kill"
tagline: ""
description: ""
category: 经验总结
tags: [ mysql, linux, oom, oom-kill,  ]
create_time: 2024-05-28 13:01:53
last_updated: 2024-05-28 13:01:53
dg-home: false
dg-publish: false
---

这两天一台 VPS 上的 MySQL 总是自己宕机，查看了一下日志发现是因为 OOM ，内存不足被系统 Kill 了。

```
❯ sudo /etc/init.d/mysqld status
× mysqld.service - LSB: start and stop MySQL
     Loaded: loaded (/etc/init.d/mysqld; generated)
     Active: failed (Result: oom-kill) since Mon 2024-05-27 22:23:15 CST; 12h ago
       Docs: man:systemd-sysv-generator(8)
    Process: 2419860 ExecStop=/etc/init.d/mysqld stop (code=exited, status=0/SUCCESS)
        CPU: 1h 11min 53.021s

Notice: journal has been rotated since unit was started, output may be incomplete.
```

网上稍微查了一下，可以使用修改 syetemd service 的方式来阻止 Linux 因为内存不足而杀死 MySQL。

## 做法

编辑

```
sudo systemctl edit mysqld.service
```

然后在配置文件中添加

```
[Service]
OOMScoreAdjust=-1000
```

保存配置文件之后，重启 MySQL

```
sudo systemctl restart mysqld.service
```

可以检查配置是否生效，记得替换 MySQL 的 PID。

```
cat /proc/$(pidof mysqld)/oom_score_adj
```

## 原因分析

MySQL 宕机并出现 "Out of memory" 问题，通常是由于短时间内应用程序大量请求导致系统内存不足，从而触发了 Linux 内核中的 Out of Memory (OOM) killer 机制。OOM killer 会终止某个进程以释放内存给系统使用。

通过检查相关日志文件（/var/log/），可以看到类似的 Out of memory: Kill process 信息：

```
May 25 19:06:53 wh kernel: [5351539.967422] php-fpm invoked oom-killer: gfp_mask=0x1100cca(GFP_HIGHUSER_MOVABLE), order=0, oom_score_adj=0
May 25 19:06:53 wh kernel: [5351539.967429] CPU: 1 PID: 2384831 Comm: php-fpm Not tainted 5.15.0-84-generic #93-Ubuntu
```

Linux 内核根据应用程序的需求分配内存，通常应用程序分配了内存但未全部实际使用。为提高性能，这部分未用的内存可以被其它进程利用。这种内存归属于每个进程，内核直接回收利用较为复杂，因此采用了内存过度分配（over-commit memory）的策略，以间接提高内存使用效率。一般情况下，这种策略是有效的，但当大多数应用程序同时消耗内存时，问题就出现了。此时，所有应用程序的内存需求加起来超出了物理内存（包括 swap）的容量，内核必须通过 OOM killer 终止一些进程来释放内存，保障系统正常运行。可以通过银行的例子来理解：当部分人取钱时银行能够应对，但如果全国人民同时取钱且都想取完自己的钱，银行实际上无法满足。

内核检测到内存不足并选择终止进程的过程，可以参考内核源代码 [linux/mm/oom_kill.c](https://github.com/torvalds/linux/blob/master/mm/oom_kill.c)。当系统内存不足时，会触发 `out_of_memory()`，然后调用 `select_bad_process()` 选择一个 "bad" 进程进行终止。选择 "bad" 进程的过程由 `oom_badness()` 决定，其算法主要根据进程占用的内存量来判断：

```c
/**
 * oom_badness - heuristic function to determine which candidate task to kill
 * @p: task struct of which task we should calculate
 * @totalpages: total present RAM allowed for page allocation
 *
 * The heuristic for determining which task to kill is made to be as simple and
 * predictable as possible.  The goal is to return the highest value for the
 * task consuming the most memory to avoid subsequent oom failures.
 */
unsigned long oom_badness(struct task_struct *p, struct mem_cgroup *memcg, const nodemask_t *nodemask, unsigned long totalpages)
{
    long points;
    long adj;

    if (oom_unkillable_task(p, memcg, nodemask))
        return 0;

    p = find_lock_task_mm(p);
    if (!p)
        return 0;

    adj = (long)p->signal->oom_score_adj;
    if (adj == OOM_SCORE_ADJ_MIN) {
        task_unlock(p);
        return 0;
    }

    points = get_mm_rss(p->mm) + p->mm->nr_ptes + get_mm_counter(p->mm, MM_SWAPENTS);
    task_unlock(p);

    if (has_capability_noaudit(p, CAP_SYS_ADMIN))
        adj -= 30;

    adj *= totalpages / 1000;
    points += adj;

    return points > 0 ? points : 1;
}
```

理解了这个算法，我们就理解了为什么 MySQL 总是被首当其冲地终止，因为它的内存占用最大。解决这个问题的最简单方法是增加内存，或优化 MySQL 使其占用更少的内存。此外，还可以优化系统以减少内存占用，使应用程序（如 MySQL）能够使用更多内存。一个临时解决方案是调整内核参数，使 MySQL 进程不易被 OOM killer 选中。

## 配置 OOM killer

可以通过调整内核参数来改变 OOM killer 的行为，避免频繁终止进程。例如，可以在触发 OOM 后立即触发 kernel panic，并在 10 秒后自动重启系统：

```bash
# sysctl -w vm.panic_on_oom=1
vm.panic_on_oom = 1

# sysctl -w kernel.panic=10
kernel.panic = 10

# echo "vm.panic_on_oom=1" >> /etc/sysctl.conf
# echo "kernel.panic=10" >> /etc/sysctl.conf
```

从上面的 oom_kill.c 代码可以看到，`oom_badness()` 会为每个进程打分，根据分数决定终止哪个进程。可以通过调整进程的 `oom_score_adj` 参数来控制哪些进程不易被选中终止。例如，如果不希望 MySQL 进程被轻易终止，可以找到 MySQL 的进程号，并将其 `oom_score_adj` 设置为 -15：

```bash
# ps aux | grep mysqld
mysql    2196  1.6  2.1 623800 44876 ?        Ssl  09:42   0:00 /usr/sbin/mysqld

# cat /proc/2196/oom_score_adj
0
# echo -15 > /proc/2196/oom_score_adj
```

当然，如果需要的话，还可以完全禁用 OOM killer（不推荐在生产环境中使用）：

```bash
# sysctl -w vm.overcommit_memory=2
# echo "vm.overcommit_memory=2" >> /etc/sysctl.conf
```

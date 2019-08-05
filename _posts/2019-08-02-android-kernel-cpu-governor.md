---
layout: post
title: "Android 内核中的 CPU 调频"
tagline: ""
description: ""
category:
tags: [android, kernel, cpu-governor,]
last_updated:
---


CPU 调频模块主要分为三块：

- CPUFreq 核心模块，核心模块主要是公共的 API 和逻辑
- CPUFreq 驱动，处理和平台相关的逻辑，设置 CPU 频率和电压
- CPUFreq governor，频率控制器，CPU 调频的策略，CPU 在什么负载，什么场景下使用多少频率

最后第三部分 governor 也是本文重点。传统的 CPU governor 选择，以 Performance 和 Powersave 举例，就是一个让 CPU 跑在最高频率，一个让 CPU 跑在最低频率，所有动作都在初始化时设置。

## 调频器策略
OnDemand, Conservative 或者 Interactive 内部都含有一个计时器，每隔一段时间就会去对 CPU 负载采样。这是一种基于负载采样的调频器策略。

而另外一种策略是，从内核调度器中直接取得 CPU 负载，这就是基于调度器的 governor。基于调度器的 CPU 调频策略会通过 PELT(per entity load tracking) 来统计各个任务的负载，映射到一个范围。内核中负载均衡通过这些统计值来平衡 CPU 之间的任务，基于调度器的 governor 就是通过把各个 CPU 负载映射到 CPU 频率来完成调频动作，负载越高，CPU 频率也越高。内核社区中有个方案：

- ARM 和 Linaro 主导项目 cpufreq_sched
- Intel 主导的 shedutil


## CPU 调频器 {#cpu-governor}

### OnDemand

OnDemand 是一个比较老的 linux kernel 中的调频器，当负载达到 CPU 阈值时，调频器会迅速将 CPU 调整到最高频率。由于这种偏向高频的特性，使得它有出色的流动性，但与其他调频器相比可能对电池寿命产生负面影响。OnDemand 在过去通常被制造商选用，因为它经过了充分测试并且很可靠，但已经过时，并且正在被 Google 的 interactive 控制器取代。

对于 OnDemand 会启用计时器，定时去计算 CPU 负载，当负载超过 80% 时，OnDemand 会将 CPU 频率调到最高。

### OndemandX
基本上是拥有 暂停、唤醒配置的 OnDemand，没有在 OnDemand 上做更多的优化。

### Performance
Performance 调频器将手机的 CPU 固定在最大频率。

### Powersave
与 Performance 调频器相反，Powersave 调频器将 CPU 频率锁定在用户设置的最低频率。

### Conservative
该调速器将手机偏置为尽可能频繁地选择尽可能低的时钟速率。换句话说，在 Conservative 调频器提高 CPU 时钟速度之前，必须在 CPU 上有更大且更持久的负载。根据开发人员实现此调频器的方式以及用户选择的最小时钟速度，Conservative 调频器可能会引入不稳定的性能。另一方面，它可以有利于电池寿命。

Conservative 调频器也经常被称为“slow OnDemand”。原始的、未经修改的 Conservative 是缓慢并且低效的。较新版本和修改版本 Conservative（来自某些内核）响应速度更快，并且几乎可以用于任何用途。

和 OnDemand 一样，会通过定时器来检测 CPU 负载，对 Conservative ，当负载较高时，会以 5% 步增调高频率，当负载低于一个值时，以 5% 步伐递减。

### Userspace
这种调频器在移动设备中极为罕见，它允许用户执行的任何程序设置 CPU 的工作频率。此调频器在服务器或台式 PC 中更常见，其中应用程序（如电源配置文件应用程序）需要特权来设置 CPU 时钟速度。

### Min Max
Min Max 调频器会根据负载选择最低或者最高的频率，而不会使用中间频率。

### Interactive
Interactive 会平衡内核开发人员（或用户）设置的时钟速度。换句话说，如果应用程序需要调整到最大时钟速度（CPU 100％负载），用户可以在调频器开始降低 CPU 频率之前执行另一个任务。由于此计时器，Interactive 还可以更好地利用介于最小和最大 CPU 频率之间的中间时钟速度。它的响应速度明显高于 OnDemand，因为它在调整到最大频率时速度更快。

Interactive 还假设用户打开屏幕之后很快就会与其设备上的某个应用程序进行交互。 因此，打开屏幕会触发最大时钟速度的斜坡，然后是上述的定时器行为。

Interactive 是当今智能手机和平板电脑制造商的首选默认调频器。

### InteractiveX
由内核开发人员“Imoseyon”创建，InteractiveX 调频器主要基于交互式调频器，增强了调整计时器参数，以更好地平衡电池与性能。但是，InteractiveX 调频器的定义功能是在屏幕关闭时将 CPU 频率锁定到用户最低定义的速度。

### Smartass
基于 Interactive，表现和之前的 minmax 一致，smartass 相应更快。电池寿命很难精确量化，但它确实在较低频率下可以使用更长。

当睡眠时调整到 352Mhz ，Smartass 还会限制最大频率（或者如果您设置的最小频率高于 352，它将限制到您设定的最小频率）。

该调频器会在屏幕关闭时缓慢的降低频率，甚至它也可以让手机 CPU 频率降至一个让手机无法正常使用的值（如果最小频率没有设置好的话）。

### SmartassV2
从 Erasmux 中而来的 Version 2 版本，该调频器的目标是“理想的频率”，并且更加积极地向这个频率增加，并且在此之后不那么激进。它在屏幕开启或者关闭时使用不同的频率，即 `awake_ideal_freq` 和 `sleep_ideal_freq`。 当屏幕关闭时，此调频器非常快地降低 CPU（快速达到 `sleep_ideal_freq` ）并在屏幕开启时快速向上调整到 `awake_ideal_freq`。 屏幕关闭时，频率没有上限（与 Smartass 不同）。因此，整个频率范围可供调频器在屏幕开启和屏幕关闭状态下使用。这个调频器的主打功能是性能和电池之间的平衡。

### Scary
Scary 基于 Conservative 并增加了一些 smartass 的特征，它相应地适用于 Conservative 的规则。所以它将从底部开始，采取一个负载样本，如果它高于上限阈值，一次只增加一个梯度，并一次减少一个。 它会自动将屏幕外的速度限制为内核开发人员设置的速度，并且仍然会根据保守法律进行调整。 所以它大部分时间都花在较低的频率上。 这样做的目的是通过良好的性能获得最佳的电池寿命。



### schedutil
schedutil 是最新版本 Linux 内核（4.7+）中的 EAS 调控器，旨在更好地与 Linux 内核调度程序集成。它使用内核的调度程序来接收 CPU 利用率信息并根据此输入做出决策。作为结果，schedutil 可以比依赖于定时器的 Interactive 等常规调控器更快，更准确地响应 CPU 负载。

更多的 governor 可以访问下方的 xda 链接。

## reference

- <https://forum.gamer.com.tw/C.php?bsn=60559&snA=37800>
- <https://forum.xda-developers.com/general/general/ref-to-date-guide-cpu-governors-o-t3048957>

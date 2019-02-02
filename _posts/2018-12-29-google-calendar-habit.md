---
layout: post
title: "用 Google Calendar 培养习惯"
tagline: ""
description: ""
category: 经验总结
tags: [google, google-calendar, habit, app, ]
last_updated:
---

这一个条目在 Trello 的代办事项中已经躺了快两周，期间一直在寻找合适的任务提醒 app 能够来帮助初期养成一定的习惯，没想到寻寻觅觅最后竟然又回到了 Google Calendar 的怀抱。

## 培养习惯
个人原来就有一习惯，对于需要长期规划的有固定时间的事情一般都会记录在 Google Calendar 中，比如周期性长时间的课程，或者一次性的旅程时间安排等等，而对于非周期性任务用 Trello 来管理，所以一直想要寻找一个能够周期性提醒，关键是要手机通知栏提醒，但是使用起来又比较方便（可以一键 mark as done，定制任务快捷）的应用，下面是我总结出来的一些此类习惯培养 app，我认为必须匹配的一些功能：

- 需要定时提醒，最好能够移动端通知栏提醒
- 能够跨平台，至少移动端和桌面端要有提醒（Android,iOS,Web) 最好
- 可以 mark as done
- 即使任务比较短也能比较友好的显示

最开始的时候想用 Google Calendar 来定义周期性定时任务，这本来非常简单，但是 Google Calendar 在提醒的同时并不能 mark done，这就有些不便，并且对于短期，比如签到此类的任务总不能定义 5min 的任务吧。

其次又想到了日常天天在用的 Trello，然而 Trello 适合任务管理，对周期性任务支持也并不友好。

然后又在 iOS 上找到了番茄 todo，Tiny Routines，小目标，都非常精致，但都不是理想中的那么方便。并且这些 app 都参杂了太多的商业内容，虽然承认这些应用都很不错，但是也无形中增加了使用成本。

## Google Calendar 中的 event，reminder，和 task
Google Calendar 中创建日程可能会发现如下三种类型

- Event
- Reminder
- Task

这三种类型在 Google Calendar 中的作用各不相同，通常情况下，使用创建按钮在标题下方可能会看见 Event 和 Reminder 选项

![google calendar new event](/assets/google-calendar-new-event.png)

当时如果在周视图，或者月视图中，使用鼠标选择多天，那么在创建的对话框中会出现 Task 选项

![google calendar new task](/assets/google-calendar-new-task.png)

但是需要注意的是 Task 只能够选择一天，而事件则能够选择一个时间范围。所以这里就要求我们来具体区分一下这三者的区别。

### Event
Event 事件是 Google Calendar 最重要的概念，事件是有发生的时间范围的，从创建事件的选择中就能看到，一个事件可以拥有如下的选项：

- 事件的标题
- 事件发生的时间，可以具体到分钟，或者定义是否重复
- 在时间的具体信息中可以定义时间发生的地点，通知，是否有会议，事件安排在哪一个日历中，事件详细描述（包括格式化的内容，附件等）等等
- 事件也可以有 Guests，可以邀请其他人来参与这个事件

总体来说 Event 是 Calendar 的核心，如果是有固定发生时间的事情，那么用 Event 来组织是最好的，在 Google Calendar 中会在视图中以设定的颜色来显示在图中。

### Reminder
Reminder 提醒，提醒相较于 Event 就要简单很多，提醒只能够定义：

- 标题
- 需要提醒的时刻，而不是时间段
- 是否需要重复提醒

所以从他的涵盖范围就能够知道 Reminder 是用来在特定时间来提醒一件比较能够快速完成的事情的，理论上提醒的事情应该能够短则几分钟，长则十分钟就能够完成的事情。而新建 Reminder 也是最最简单的事情，甚至用语音 “reminder me to do something at some time” 就能快速建立的事情。Reminder 生成的内容可以标记 Done，在界面中就会显示为横线删除的样子，表示已做，非常清楚。

### Task
Task 是最让人混淆的事情，我个人习惯使用 Trello 来管理我的 Task，可以这么理解，Task 可以是还没有具体时间安排的任务。所以在日历中最上方全天安排点击的时候 Task 的选择才会出现。Task 能够设定的只有：

- 标题
- 一个模糊的日期，只能是天为单位
- 一个简单的纯文本的描述

对于需要办但是却没有安排出具体时间来办的事情就可以使用 Task 来组织管理。Task 则更像一个 to-do list 管理工具，不过这个 to-do list 则会贯穿整个 Google 的产品线，在 Google Calendar 中创建的 Task 会在 Gmail 中[出现](https://support.google.com/calendar/answer/106237?hl=en)

### Goal
在 Google Calendar 的移动版，包括 Android 和 iOS 在点击加号之后可能会发现桌面版没有的一个选项，就是 Goal，目标，这个功能是我发现将 Google Calendar 提升一个境界的地方。在这个 Goal 中可以设定一个目标，比如看一本书，坚持一定时间的锻炼，再比如学习一个技能，包括但不限于语言啊，乐器啊等等，Google Calendar 默认给出了非常好看的一些模板，非常容易上手。在 Goal 中可以定义：

- 目标的方向（比如说 Exercise，Build a skill, Friends & Family, Me time, Organize my life 等等等等）
- 期望发生的频率 (Once a month, Twice a month, Once a week,Twice a week, 3 times a week, 4 times a week, 5 times a week, 6 times a week, Every day)
- 期望每次花费多长时间（30min，1h，2h，半天，整天）
- 期望发生在什么时间段（早上，中午，晚上，任意时间）

在制定这一系列方案之后 Google Calendar 会自动分析日程安排，将这个目标穿插在日程安排中，以给定的时间范围和频率定时提醒来完成目标。于是这个功能就可以当做习惯培养的绝好工具，不管做任何事情，指定一个目标让 Google Calendar 帮助你安排时间，简直太赞了。

更加重要的一点是，Goal 产生的每一次事件都能够标注是否 done，每一个事件打开都能够看到这个目标前几周的完成情况，以及是否 Mark 这一次 Done，这样就能够很好的督促自己的认真的完成每一次目标。

## 解决方案
后来在寻觅的过程中突然发现了移动版的 Google Calendar 点开加号除了常规的 Event，竟然还有 Goal 和 Reminder 两个选项。

Reminder 很好理解，字面意思，提醒，不过 Google Calendar 更加智能的是可以周期性提醒，那这就完美的解决了培养习惯通常开始需要的提醒，并且跨平台，有通知，这就非常方便了。

而 Goal 则是制定一个目标，由 Google Calendar 来自动决定哪个时间段来帮助完成这个目标。

## 几个 Chrome Extension

### Checker Plus for Google Calendar
直接在 Chrome 的工具栏中访问 Google Calendar 中内容。

### Toggl Button
允许在浏览器中追踪花了具体多长时间，和 Calendar 结合就能具体看到做一件事情花费了多久。需要结合 Toggl 这个网站使用，所有的数据都会被导入到该网站。



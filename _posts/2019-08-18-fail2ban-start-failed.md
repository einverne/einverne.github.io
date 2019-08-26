---
layout: post
title: "记一次 fail2ban 启动失败"
tagline: ""
description: ""
category: 经验总结
tags: [fail2ban, linux, ]
last_updated:
---

前两天重启服务器之后发现 fail2ban 启动失败，出现如下错误：

    /etc/init.d/fail2ban restart
    [....] Restarting fail2ban (via systemctl): fail2ban.service
    Job for fail2ban.service failed because the control process exited with error code. See "systemctl status fail2ban.service" and "journalctl -xe" for details.
     failed!

检查日志

	journalctl -xe

查看具体错误

	/usr/bin/fail2ban-client -v -v start

看到结果：

	fail2ban.service: Failed with result 'start-limit-hit'.

具体错误一目了然。其实重要的就是 Debug 的内容。



---
layout: post
title: "xiaomi router samba password"
tagline: ""
description: ""
category: 经验总结
tags: [xiaomi, router, samba, linux]
last_updated:
---

ssh to xiaomi router

    smbpasswd -a root

then enter your password two times.

    vi /etc/config/samba

Edit

    option 'guest_ok'       no
    option 'force_user'     'root'

And

    vi /var/etc/smb.conf

Edit

    guest ok = yes
    valid users = root

Then restart samba service:

    /etc/init.d/samba restart

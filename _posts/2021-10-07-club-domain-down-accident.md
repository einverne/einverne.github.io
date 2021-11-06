---
layout: post
title: "club 域名宕机近 3 小时故障回顾"
aliases: 
- "club 域名宕机近 3 小时故障回顾"
tagline: ""
description: ""
category: 经验总结
tags: [ domain, name-server, google-domains, cloudflare, dns, network]
last_updated:
---

刚开始的时候收到了报警，说网站挂了，我的第一反应是 VPS 出问题了，赶紧 SSH 登录上去看，好像都正常。难道是 VPS 网络问题，于是看了看同一台机器上的其他服务，一切都没问题。

然后开始排查为什么登录不上，先看了一 DNS 解析，发现在我本地已经无法给出 DNS 解析的结果了，返回 SERVFAIL。

```
❯ nslookup www.techfm.club
Server:		192.168.2.1
Address:	192.168.2.1#53

** server can't find www.techfm.club: SERVFAIL
```

我下意识的还以为遭到 GFW DNS 污染了，用其他地区的 VPS nslookup 了一下发现是同样的错误。

于是我把怀疑点移到了 Cloudflare，但是登录 Cloudflare 发现其他域名都正常，并且查看 Cloudflare 的 status 页面也没有说有服务故障，然后就去 Help 里面想要联系一下客服寻求帮助一下，不过 Cloudflare 的页面做的很人性化，首先提供了自查故障的页面，所以自查了一下，Cloudflare 说：

> The authoritative nameservers for techfm.club are set incorrectly. For Cloudflare to activate, your domain registrar must point to the two nameservers provided by Cloudflare as the authoritative servers. Set your authoritative nameservers in your registrar’s admin panel (contact your registrar for support). Review changing your nameservers.

Name servers 服务器设置错误？我今天根本没有动过 Google Domains 的 NS 设置啊。不过还是按照帮助文档中的内容查询了一下域名的 NS，发现真的获取不到 NS 地址了。

```
einverne@sys ~ % dig techfm.club +trace @1.1.1.1

; <<>> DiG 9.16.1-Ubuntu <<>> techfm.club +trace @1.1.1.1
;; global options: +cmd
.                       515539  IN      NS      a.root-servers.net.
.                       515539  IN      NS      b.root-servers.net.
.                       515539  IN      NS      c.root-servers.net.
.                       515539  IN      NS      d.root-servers.net.
.                       515539  IN      NS      e.root-servers.net.
.                       515539  IN      NS      f.root-servers.net.
.                       515539  IN      NS      g.root-servers.net.
.                       515539  IN      NS      h.root-servers.net.
.                       515539  IN      NS      i.root-servers.net.
.                       515539  IN      NS      j.root-servers.net.
.                       515539  IN      NS      k.root-servers.net.
.                       515539  IN      NS      l.root-servers.net.
.                       515539  IN      NS      m.root-servers.net.
.                       515539  IN      RRSIG   NS 8 0 518400 20211020050000 20211007040000 14748 . Ivt+gf/MP9jMrhxG7kVEO6LfUeGvL6RaeaR4b19+hakqU2FplgG2DSMf ycLHYn2zaBPyyZysSh1AbgWO7L2nRZj5yMQB6A7IFR3ifp1ksCTDbtUf 4X0rzwzZcv2BVbJBsDAjVVdAFxVsnfX6siOx9JLxshe1/JECAaRoXo4X Fl5JTeEN+s+WBZdOShKmvkILGRt9UkMeFton3dIP47ZBvnlgmMGkv9Jw VZHQmzdufQSfta0HtjPwN+/mzlH6nnGs4beqlhsIAttzQALgzcspCjP+ NenqtiXTxg7jvtP8Dy/JkTYbecQX+mcL19ySGDoBkGov2RSfJURdXgrN PN7QZA==
;; Received 1097 bytes from 1.1.1.1#53(1.1.1.1) in 4 ms

club.                   172800  IN      NS      ns1.dns.nic.club.
club.                   172800  IN      NS      ns2.dns.nic.club.
club.                   172800  IN      NS      ns3.dns.nic.club.
club.                   172800  IN      NS      ns4.dns.nic.club.
club.                   172800  IN      NS      ns6.dns.nic.club.
club.                   172800  IN      NS      ns5.dns.nic.club.
club.                   86400   IN      DS      29815 8 2 3B67F899B57454E924DD1EFAE729B8741D61BA9BC8D76CD888919E5C 0950CA23
club.                   86400   IN      DS      29815 8 1 7F2B8E1D8B715BB382111A84F4552A599462017A
club.                   86400   IN      RRSIG   DS 8 1 86400 20211020050000 20211007040000 14748 . AQaz5Kne3pWNMUOyrCJ67y3q8mN0fe2cukuTY0oiyMJNi/OuL7eGxqiq 3RlfRL+Y9+50jOkEdw6170xKqeU/XAdyYRI9R6xQYTCZE2y+YSnHW81k PGrFVb4N8RfmD8/AX0RckRMzu4DqokMXnfYd2WFGqrNJtvWMGxDkdkxU PfJv0jHHBzV0s1YyS/UuFC9joaYGeZ8L81HVeQV0aZn7pz3+u794OQgf 0SpqbiiSuYJDGXvldA7ZkXA9Nd+pQAzd+DjJK8F4b68cuNrlmS3W923D iVUqFfPXXqx03pNuUfJPp7XAZNGsGrfrMEQSSl0LI01ct7FM2YilJkUx fF+thg==
couldn't get address for 'ns1.dns.nic.club': failure
couldn't get address for 'ns2.dns.nic.club': failure
couldn't get address for 'ns3.dns.nic.club': failure
couldn't get address for 'ns4.dns.nic.club': failure
couldn't get address for 'ns6.dns.nic.club': failure
couldn't get address for 'ns5.dns.nic.club': failure
dig: couldn't get address for 'ns1.dns.nic.club': no more
einverne@sys ~ % dig techfm.club +trace @1.1.1.1

; <<>> DiG 9.16.1-Ubuntu <<>> techfm.club +trace @1.1.1.1
;; global options: +cmd
.                       511583  IN      NS      a.root-servers.net.
.                       511583  IN      NS      b.root-servers.net.
.                       511583  IN      NS      c.root-servers.net.
.                       511583  IN      NS      d.root-servers.net.
.                       511583  IN      NS      e.root-servers.net.
.                       511583  IN      NS      f.root-servers.net.
.                       511583  IN      NS      g.root-servers.net.
.                       511583  IN      NS      h.root-servers.net.
.                       511583  IN      NS      i.root-servers.net.
.                       511583  IN      NS      j.root-servers.net.
.                       511583  IN      NS      k.root-servers.net.
.                       511583  IN      NS      l.root-servers.net.
.                       511583  IN      NS      m.root-servers.net.
.                       511583  IN      RRSIG   NS 8 0 518400 20211020050000 20211007040000 14748 . Ivt+gf/MP9jMrhxG7kVEO6LfUeGvL6RaeaR4b19+hakqU2FplgG2DSMf ycLHYn2zaBPyyZysSh1AbgWO7L2nRZj5yMQB6A7IFR3ifp1ksCTDbtUf 4X0rzwzZcv2BVbJBsDAjVVdAFxVsnfX6siOx9JLxshe1/JECAaRoXo4X Fl5JTeEN+s+WBZdOShKmvkILGRt9UkMeFton3dIP47ZBvnlgmMGkv9Jw VZHQmzdufQSfta0HtjPwN+/mzlH6nnGs4beqlhsIAttzQALgzcspCjP+ NenqtiXTxg7jvtP8Dy/JkTYbecQX+mcL19ySGDoBkGov2RSfJURdXgrN PN7QZA==
;; Received 1097 bytes from 1.1.1.1#53(1.1.1.1) in 4 ms

club.                   172800  IN      NS      ns5.dns.nic.club.
club.                   172800  IN      NS      ns6.dns.nic.club.
club.                   172800  IN      NS      ns3.dns.nic.club.
club.                   172800  IN      NS      ns1.dns.nic.club.
club.                   172800  IN      NS      ns2.dns.nic.club.
club.                   172800  IN      NS      ns4.dns.nic.club.
club.                   86400   IN      DS      29815 8 2 3B67F899B57454E924DD1EFAE729B8741D61BA9BC8D76CD888919E5C 0950CA23
club.                   86400   IN      DS      29815 8 1 7F2B8E1D8B715BB382111A84F4552A599462017A
club.                   86400   IN      RRSIG   DS 8 1 86400 20211020050000 20211007040000 14748 . AQaz5Kne3pWNMUOyrCJ67y3q8mN0fe2cukuTY0oiyMJNi/OuL7eGxqiq 3RlfRL+Y9+50jOkEdw6170xKqeU/XAdyYRI9R6xQYTCZE2y+YSnHW81k PGrFVb4N8RfmD8/AX0RckRMzu4DqokMXnfYd2WFGqrNJtvWMGxDkdkxU PfJv0jHHBzV0s1YyS/UuFC9joaYGeZ8L81HVeQV0aZn7pz3+u794OQgf 0SpqbiiSuYJDGXvldA7ZkXA9Nd+pQAzd+DjJK8F4b68cuNrlmS3W923D iVUqFfPXXqx03pNuUfJPp7XAZNGsGrfrMEQSSl0LI01ct7FM2YilJkUx fF+thg==
couldn't get address for 'ns5.dns.nic.club': failure
couldn't get address for 'ns6.dns.nic.club': failure
couldn't get address for 'ns3.dns.nic.club': failure
couldn't get address for 'ns1.dns.nic.club': failure
couldn't get address for 'ns2.dns.nic.club': failure
couldn't get address for 'ns4.dns.nic.club': failure
dig: couldn't get address for 'ns5.dns.nic.club': no more
```

并且 club 默认的 6 台 NS 全部都返回 failure。而正常的域名会返回默认配置的 NS：

```
einverne@sys ~ % dig gtk.pw +trace @1.1.1.1

; <<>> DiG 9.16.1-Ubuntu <<>> gtk.pw +trace @1.1.1.1
;; global options: +cmd
.                       518159  IN      NS      a.root-servers.net.
.                       518159  IN      NS      b.root-servers.net.
.                       518159  IN      NS      c.root-servers.net.
.                       518159  IN      NS      d.root-servers.net.
.                       518159  IN      NS      e.root-servers.net.
.                       518159  IN      NS      f.root-servers.net.
.                       518159  IN      NS      g.root-servers.net.
.                       518159  IN      NS      h.root-servers.net.
.                       518159  IN      NS      i.root-servers.net.
.                       518159  IN      NS      j.root-servers.net.
.                       518159  IN      NS      k.root-servers.net.
.                       518159  IN      NS      l.root-servers.net.
.                       518159  IN      NS      m.root-servers.net.
.                       518159  IN      RRSIG   NS 8 0 518400 20211020050000 20211007040000 14748 . Ivt+gf/MP9jMrhxG7kVEO6LfUeGvL6RaeaR4b19+hakqU2FplgG2DSMf ycLHYn2zaBPyyZysSh1AbgWO7L2nRZj5yMQB6A7IFR3ifp1ksCTDbtUf 4X0rzwzZcv2BVbJBsDAjVVdAFxVsnfX6siOx9JLxshe1/JECAaRoXo4X Fl5JTeEN+s+WBZdOShKmvkILGRt9UkMeFton3dIP47ZBvnlgmMGkv9Jw VZHQmzdufQSfta0HtjPwN+/mzlH6nnGs4beqlhsIAttzQALgzcspCjP+ NenqtiXTxg7jvtP8Dy/JkTYbecQX+mcL19ySGDoBkGov2RSfJURdXgrN PN7QZA==
;; Received 1097 bytes from 1.1.1.1#53(1.1.1.1) in 0 ms

pw.                     172800  IN      NS      ns1.nic.pw.
pw.                     172800  IN      NS      ns6.nic.pw.
pw.                     172800  IN      NS      ns2.nic.pw.
pw.                     172800  IN      NS      ns5.nic.pw.
pw.                     86400   IN      DS      26645 7 2 7EF397EDF4D7CA228C0F5111F5E1696CDBF279C0B6AFA48FC7E71A12 E07E5880
pw.                     86400   IN      DS      26645 7 1 58EE332D303E2A64B7449C43AB770DAA1CA74C40
pw.                     86400   IN      RRSIG   DS 8 1 86400 20211020050000 20211007040000 14748 . ZKSbdDYOAuZYYX7LFUI6fZn6GtHJHrA04nENEPp6oGcGIh7IliGFyJai MkV6OfwYhyk6npWLaSNkYaU2Kv9mif6Bu1RBPbGbVaQphhFeqxmFRtf8 5B/Q+V6dYZJ8cnMZEMeuqlvfBzT6m+Dv6zsgvJ3dZ2Yly9ehkd9i2pXT F9Hv4mj+35B4r6H0/e1hlD8a0AmMITFPIAZ+ZQLkGaCf+d8jAP9oMIEG 2uezoE4PLybmCsovtT/zFcyrIXv0CLphN1Ky6yCkwu1nDMvWi3eoyunK ANPojlC6i3OCa7zmBuR+4qJWQeb9o5mqz+QXHkrPY/LEK8Vs9+t+xuzG ZzRc6Q==
;; Received 686 bytes from 192.5.5.241#53(f.root-servers.net) in 288 ms

gtk.pw.                 3600    IN      NS      vera.ns.cloudflare.com.
gtk.pw.                 3600    IN      NS      phil.ns.cloudflare.com.
5njihdv29htfqesp4s66h5ia7mau40g2.pw. 3600 IN NSEC3 1 1 1 - 5NJN8B0GFH3C6U7E54SIUSFMKRA3164C NS SOA RRSIG DNSKEY NSEC3PARAM
5njihdv29htfqesp4s66h5ia7mau40g2.pw. 3600 IN RRSIG NSEC3 7 2 3600 20211014233500 20210914093758 20159 pw. cGysLwA8FKKv9t+B0ywJA1yUNvytR6vINedx6Lz4ZPwsdBX0DTkn0OUM xR97Mxo58SoGCzTImM8JFsXJGid6j6txWh5KYN0NsmOd52sAOYXTz6uz m/fTDFMIXdLp8XJeRP8hGGAsdd7W7dhQTo8r4V1Rsc1JT3n33AEX7CAq Z5g=
vum0mlvs55o2lfpa00pfb93sl2dc98de.pw. 3600 IN NSEC3 1 1 1 - VUMSNHHGG0TDGRB3VN24B7GKEAA1IVGG TXT RRSIG
vum0mlvs55o2lfpa00pfb93sl2dc98de.pw. 3600 IN RRSIG NSEC3 7 2 3600 20211018221437 20210918161358 20159 pw. BPjMNyd1u4ci+m+FkCaVI+nW6gA+MPNPtNHdSJWwmCJN0GqYVgFNvj97 qTI1Jc/TiorDmURxE7zORU5IaI4K6XJG2ckpiq6xw+khy850dvAs2WVE ZI+uDc+nX4yFj7pvDJBiiNZR+Z9yAtDdvm1EomB0E91KBnGdZbBhYOsd qJk=
;; Received 601 bytes from 212.18.249.12#53(ns6.nic.pw) in 16 ms

gtk.pw.                 300     IN      A       104.21.51.157
gtk.pw.                 300     IN      A       172.67.182.127
;; Received 67 bytes from 2606:4700:50::adf5:3a93#53(vera.ns.cloudflare.com) in 0 ms
```

立马登录 Google Domains 查看 NS 设置，页面上还是 Cloudflare 提供的两个 NS 服务器地址，看着也没有问题，所以又联系了 Google Domains 的 Help，Google Domains 的帮助人员还是非常快的就能联系上，帮忙查询了一下 NS 设置，用 <https://www.whatsmydns.net/#NS/> 查询了一下了全球的 NS，全部失败：

![](/assets/club-domain-failed-ns-20211007211018.png)

客服解释说需要时间等待配置传播生效，但问题在于我没有更改过任何配置。这个时候我就有看到相关的消息出来([source1](https://www.lowendtalk.com/discussion/174337/club-domains-not-working), [source2](https://twitter.com/CloudflareHelp/status/1446091625323708423?s=20)，[source3](https://www.reddit.com/r/sysadmin/comments/q38p8x/entire_club_domain_extension_is_down/))，这才发现不是我一个人的问题。无奈好像我也无法解决，只能等上游解决了。

终于从 10月7号下午 6:52 开始，到 9:23 分为止，宕机了近 3 小时。

![](/assets/club-domain-down-for-3-hours-20211008084520.png)

## 原因分析

`.club` 通用顶级域名（gTLD) 的 name server 无响应，所有 6 台官方的服务器 `get.club` 都无响应，所以下游的 DNS 服务器都无法解析。

> This morning there was a DNS service disruption impacting .Club websites. The issue has now been resolved. We apologize for any inconvenience this may have caused.
> 
> — .CLUB Domains (@getDotClub) [October 7, 2021](https://twitter.com/getDotClub/status/1446118781856595969?ref_src=twsrc%5Etfw)

GoDaddy Registry tweeted:

> This morning there was a DNS service disruption impacting .club websites. The issue has now been resolved. We apologize for any inconvenience this may have caused.
> 
> — GoDaddy Registry (@GoDaddyRegistry) [October 7, 2021](https://twitter.com/GoDaddyRegistry/status/1446124321324220417?ref_src=twsrc%5Etfw)
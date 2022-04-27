---
layout: post
title: "DMARC 报告"
aliases: 
- "DMARC 报告"
tagline: ""
description: ""
category: 经验总结
tags: [ dmarc, email, ]
last_updated:
---

在搭建了自己的邮件服务器之后，经常收到 Gmail 和 Outlook 的 Report，类似：

```
Report domain: example.com Submitter: google.com Report-ID: 73941XXXXX
```

或

```
Report Domain: example.com Submitter: protection.outlook.com Report-ID: 200aa9XXXXXXXXXX
```

所以再整理一下 DMARC 报告。

在之前介绍 [DMARC](/post/2022/03/what-is-dmarc.html) 的文章中介绍过其中 `rua` 和 `ruf` 两个配置的作用，这两个配置分别用来配置邮箱地址，用来接收 DMARC aggregate report 和 DMARC Failure report。

## DMARC aggregate report
默认情况下，邮件服务提供商，比如 Gmail，Outlook 等等，会每隔 24 小时发送一次 DMARC aggregate report 到 `rua` 指定的邮件地址。每一份报告中都写明了一段时间内 DMARC 的验证次数和合规问题。

DMARC 报告中提供了该域名下邮件发送整体情况的表现。如果有人伪装该域名进行钓鱼邮件的发送，那么也会在报告中有所体现。

如果你是一个邮件服务器的管理员，你马上就会被收件箱中的邮件无数的 DMARC report 邮件所淹没。根据邮件的不同使用情况，每一天都会收到成百上千的 reports。

在附件里面是两份从 Google 和 Outlook 收到的 report。可以看到格式是 XML 格式，其中包含了验证的次数，验证的结果等等信息。


### 对比
下面是 DMARC aggregate 报告和 DMARC failure 报告的对比：

- aggregate 报告提供一组邮件的聚合数据，failure 报告提供单一邮件的详细信息；
- 要接收 aggregate 报告，设置 rua 标签；要接收 failure 报告，设置 ruf 标签；
- aggregate 报告不是实时的：在缺省的情况下，这些报告被每天发送；failure 报告则在 DMARC 验证失败的情况下几乎被立即发送；
- aggregate 报告使用 XML 格式，failure 报告使用普通文本格式；
- aggregate 报告不包含可用来辨认个人的信息 (personally identifiable information, PII)，比如接收者邮件地址；failure 报告包含 PII；
- 所有支持 DMARC 的邮箱服务提供商都支持 aggregate 报告，然而仅有一些邮箱服务提供商支持 failure 报告。


## 附录

Google 的报告：

```
<?xml version="1.0" encoding="UTF-8" ?>
<feedback>
  <report_metadata>
    <org_name>google.com</org_name>
    <email>noreply-dmarc-support@google.com</email>
    <extra_contact_info>https://support.google.com/a/answer/2466580</extra_contact_info>
    <report_id>73941XXXX1096975</report_id>
    <date_range>
      <begin>1650499200</begin>
      <end>1650585599</end>
    </date_range>
  </report_metadata>
  <policy_published>
    <domain>example.com</domain>
    <adkim>s</adkim>
    <aspf>s</aspf>
    <p>reject</p>
    <sp>reject</sp>
    <pct>100</pct>
  </policy_published>
  <record>
    <row>
      <source_ip>200.15.100.100</source_ip>
      <count>1</count>
      <policy_evaluated>
        <disposition>none</disposition>
        <dkim>pass</dkim>
        <spf>pass</spf>
      </policy_evaluated>
    </row>
    <identifiers>
      <header_from>example.com</header_from>
    </identifiers>
    <auth_results>
      <dkim>
        <domain>example.com</domain>
        <result>pass</result>
        <selector>dkim</selector>
      </dkim>
      <spf>
        <domain>example.com</domain>
        <result>pass</result>
      </spf>
    </auth_results>
  </record>
</feedback>
```


Outlook 的报告：

```
<?xml version="1.0"?>
<feedback xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <version>1.0</version>
  <report_metadata>
    <org_name>Outlook.com</org_name>
    <email>dmarcreport@microsoft.com</email>
    <report_id>200aa9xxxxxxxxxxxx16af8b6a8bbaf5</report_id>
    <date_range>
      <begin>1650499200</begin>
      <end>1650585600</end>
    </date_range>
  </report_metadata>
  <policy_published>
    <domain>example.com</domain>
    <adkim>s</adkim>
    <aspf>s</aspf>
    <p>reject</p>
    <sp>reject</sp>
    <pct>100</pct>
    <fo>0</fo>
  </policy_published>
  <record>
    <row>
      <source_ip>200.10.106.108</source_ip>
      <count>1</count>
      <policy_evaluated>
        <disposition>none</disposition>
        <dkim>pass</dkim>
        <spf>pass</spf>
      </policy_evaluated>
    </row>
    <identifiers>
      <envelope_to>outlook.com</envelope_to>
      <envelope_from>example.com</envelope_from>
      <header_from>example.com</header_from>
    </identifiers>
    <auth_results>
      <dkim>
        <domain>example.com</domain>
        <selector>dkim</selector>
        <result>pass</result>
      </dkim>
      <spf>
        <domain>example.com</domain>
        <scope>mfrom</scope>
        <result>pass</result>
      </spf>
    </auth_results>
  </record>
</feedback>
```
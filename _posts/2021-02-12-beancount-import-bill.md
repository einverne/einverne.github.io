---
layout: post
title: "使用 Beancount 记账篇二：各类账单导入"
aliases: "使用 Beancount 记账篇二：各类账单导入"
tagline: ""
description: ""
category: [ Beancount, 经验总结 ]
tags: [ beancount, accounting, bookkeeping, double-entry, bill-import, linux, wechat, alipay ]
last_updated:
---


在上一篇[如何给 Beancount 账户命名](/post/2021/02/beancount-account-name-template.html) 的文章中，我们已经迈出了 Beancount 使用的第一步，建立一套属于自己的账户系统，之后所有的资金就会在这些账户之间流转。复式记账讲求账户的流入与流出。

那接下来就是 Beancount 真正关键的地方，熟悉并导入以前的帐本。使用 Beancount 就会想着如何将之前的账单导入到 Beancount。

但人的惰性总是让我们不会每一笔交易都事无巨细的记录下来，所以我的方式便是固定一个时间，然后对上一个周期内的账单进行一次性批量处理，比如在信用卡账单日对信用卡消费做处理，或者在月末对微信账单进行处理。

这样就使得我需要有地方可以直接导出我的账单，下面就是我经常使用的账单导出整理的方式。因为微信，京东等日常消费的账户绑定了信用卡，其中还涉及到了信用卡负债账户的部分，所以我的选择可以分成两个部分。一个就是从源头上，导出并处理信用卡账单，另一部分就是消费账户的账单，比如微信，京东的账单。

这两部分的优缺点都非常明显：

- 微信，京东的账单可以将账单的具体明细列举的非常清晰，而信用卡账单则比较简陋
- 但是信用卡账单可以方便地和 Liabilities 账户关联起来，而微信和京东则需要提取付款账户来进行判断，才能合理地将账单划分到账户

正因为这两个的区别，目前我还在混合使用这两个方法，不过以信用卡账单为主。


## 交行信用卡账单导入 Beancount
我目前主要使用的卡片是交通银行的，所以这里整理了一下交通银行账单的处理过程。不过大体思路都是相差不多的。

交通银行每个月的账单日都会发一份电子邮件到邮箱，在邮件中列出了记账周期中的消费记录，利用 [Download table as csv](https://chrome.google.com/webstore/detail/jgeonblahchgiadgojdjilffklaihalj) 这个开源的 Chrome 插件，或者也可以使用 [Table capture](https://chrome.google.com/webstore/detail/table-capture/iebpjdmgckacbodjpijphcplhebcmeop)，可以将账单导出成 CSV 格式，然后用 vim 简单处理一下，比如把第一列删除，可以得到如下格式的文件：
 
    "交易日期","记账日期","卡末四位","交易说明","交易金额","入账金额"
    "2011/01/16","2011/01/17","2987","消费 支付宝 - xxx科技有限公司","RMB 6.30","RMB 6.30"
    "2011/01/18","2011/01/19","2987","消费 支付宝 - xxx科技有限公司","RMB 0.90","RMB 0.90"
    "2011/01/19","2011/01/20","2987","消费 食堂","RMB 100.00","RMB 100.00"

然后批量将金额中的 RMB 去掉。`%s/RMB //g`，然后保存到 `datas/comm-2021.01.csv` 文件中。随后执行：

    export PYTHONPATH=.
    bean-extract config.py datas/comm-2021.01.csv > beans/comm-2021.01.bean

只要 `config.py` 中设置的账户分类能够覆盖账单中的关键字，基本上就完工了。如果有些账单分入了错误的账户，那么手动的调整一下 `config.py` 再执行一次。

`config.py` 如下：

```
#!/usr/bin/env python3
import sys

from beancount.core.data import Transaction

sys.path.append("./importers")
from importers.beanmaker import Drcr, Col, Importer

# Col为枚举类型，预定义了每笔交易记录所需要的内容，_config_alipay负责定义枚举内容与csv表头之间的对应关系

_config_alipay = {
    Col.DATE: "交易创建时间",
    Col.PAYEE: "交易对方",
    Col.NARRATION: "商品名称",
    Col.REMARK: "备注",
    Col.AMOUNT: "金额（元）",
    Col.DRCR: "收/支",
    Col.STATUS: "资金状态",
    Col.TXN_TIME: "交易创建时间",
    Col.TXN_DATE: "交易创建时间",
    Col.TYPE: "类型",
}

_config_wechat = {
    Col.DATE: "交易时间",
    Col.PAYEE: "交易对方",
    Col.NARRATION: "商品",
    Col.REMARK: "支付方式",
    Col.AMOUNT: "金额(元)",
    Col.DRCR: "收/支",
    Col.STATUS: "当前状态",
    Col.TXN_TIME: "交易时间",
    Col.TXN_DATE: "交易时间",
    Col.TYPE: "交易类型",
}

# _default_account负责定义默认账户
_default_account_alipay = "Assets:Alipay:Balance"

_default_account_wechat = "Assets:WeChat:Balance"

_default_account_comm = "Liabilities:CreditCard:BOC:CN"

# _currency定义货币单位
_currency = "CNY"

# Debit_or_credit也是枚举类型，预定义了支出和收入两类，_DRCR_dict负责定义这两类与csv中能够表明该状态的文本之间的对应关系
_DRCR_dict = {
    Drcr.DEBIT: "支出",
    Drcr.CREDIT: "收入"
}

common_assets_account = {
    "交通银行|2222": "Liabilities:CreditCard:BOC"
}

# _assets_account负责保存账户信息，key为手工对账时在备注中输入的关键词；
# 关键词中，"DEFAULT"为非必选项，不提供时将以"_default_account_xxx"的属性值作为"DEFAULT"对应的值；
# 多个关键词用竖线分割，只要备注中出现该关键词，就把该交易分类到对应账户下。
_wechat_assets_account = {
    "DEFAULT": "Assets:WeChat:Balance",
    "招行信用卡|0000": "Liabilities:CreditCard:CMB",
    "招商银行": "Assets:DebitCard:CMB",
    "交通信用卡银行|2222": "Liabilities:CreditCard:BOC:CN",
    "中信银行": "Liabilities:CreditCard:CITIC",
    "汇丰银行": "Liabilities:CreditCard:HSBC:CN",
    "支付宝": "Assets:VirtualCard:Alipay",
    "余额宝": "Assets:MoneyFund:Yuebao",
    "零钱|微信": "Assets:WeChat:Balance"
}
_wechat_assets_account.update(common_assets_account)

# _debit_account负责保存支出账户信息，key为与该账户相关的关键词；
# 关键词中，"DEFAULT"为非必选项，不提供时将以"_default_account_xxx"的属性值作为"DEFAULT"对应的值；
# 多个关键词用竖线分割，只要当交易为“支出”，且交易对方名称和商品名称中出现该关键词，就把该交易分类为对应支出。
_debit_account = {
    "DEFAULT": "Expenses:Food:Other",
    "iCloud|腾讯云|阿里云|Plex": "Expenses:Fun:Subscription",
    "滴滴|司机": "Expenses:Transport:Taxi",
    "天和亿|单车": "Expenses:Transport:Bike",
    "中国铁路": "Expenses:Transport:Railway",
    "卡表充值|燃气": "Expenses:House:Gas",
    "友宝|芬达|雪碧|可乐|送水|怡宝|饮料|美年达|售货机": "Expenses:Food:Drinks",
    "水果": "Expenses:Food:Fruits",
    "买菜|叮咚|美团买菜": "Expenses:Food:Cooking",
    "泰餐": "Expenses:Food:Restaurant",
    "App Store|Steam|会员": "Expenses:Fun:Software",
    "全时|华联|家乐福|超市|红旗|WOWO|百货|伊藤|永旺|全家": "Expenses:Daily:Commodity",
    "汽车票|蒜芽信息科技|优步|火车|动车|空铁无忧网|滴滴|汽车|运输|机场|航空|机票|高铁|出行|车费|打车": "Expenses:Travel",
    "捐赠": "Expenses:PublicWelfare",
    "话费|流量|手机|中国移动": "Expenses:Daily:PhoneCharge",
    "电影|大麦网|演出|淘票票": "Expenses:Fun:Amusement",
    "地铁|轨道交通": "Expenses:Transport:Public",
    "青桔|骑安": "Expenses:Transport:Bike",
    "衣|裤|鞋": "Expenses:Dressup:Clothing",
    "造型|美发|理发": "Expenses:Dressup:Hair",
    "化妆品": "Expenses:Dressup:Cosmetic",
    "医院|药房": "Expenses:Health:Hospital",
    "酒店|airbnb": "Expenses:Travel:Hotel",
    "机票|高铁|票务|特快|火车票|飞机票": "Expenses:Travel:Fare",
    "借款": "Assets:Receivables",
    "蚂蚁财富": "Assets:MoneyFund:BondFund",
    '签证': "Expenses:Travel:Visa",
    "门票": "Expenses:Travel:Ticket",
    "gopro|键盘|电脑|手机|SD卡|相机|MacBook|boox|ipad|apple|oneplus": "Expenses:Digital",
    "快递": "Expenses:Daily",
    'PLAYSTATION': "Expenses:Fun:Game",
}

# _credit_account负责保存收入账户信息，key为与该账户相关的关键词
# 关键词中，"DEFAULT"为非必选项，不提供时将以"_default_account_xxx"的属性值作为"DEFAULT"对应的值；
# 多个关键词用竖线分割，只要当交易为“收入”，且交易对方名称和商品名称中出现该关键词，就把该交易分类为对应收入。
_credit_account = {"DEFAULT": "Income:RedPacket", "借款": "Assets:Receivables"}

wechat_config = Importer(
    config=_config_wechat,
    default_account=_default_account_wechat,
    currency=_currency,
    file_name_prefix='微信支付账单',
    skip_lines=0,
    DRCR_dict=_DRCR_dict,
    assets_account=_wechat_assets_account,
    debit_account=_debit_account,
    credit_account=_credit_account
)

_alipay_assets_account = {
    "DEFAULT": "Assets:Alipay:Balance",
    "花呗": "Liabilities:VirtualCard:Huabei",
}
_alipay_assets_account.update(common_assets_account)

alipay_config = Importer(
    config=_config_alipay,
    default_account=_default_account_alipay,
    currency=_currency,
    file_name_prefix='alipay_record',
    skip_lines=0,
    DRCR_dict=_DRCR_dict,
    assets_account=_alipay_assets_account,
    debit_account=_debit_account,
    credit_account=_credit_account
)

_comm_assets_account = {
    "DEFAULT": "Liabilities:CreditCard:BOC:CN"
}
_comm_assets_account.update(common_assets_account)

from beancount.ingest.importers import csv

# 信用卡
_config_com = {
    csv.Col.DATE: "记账日期",
    csv.Col.PAYEE: "交易说明",
    csv.Col.NARRATION: "交易说明",
    csv.Col.AMOUNT_DEBIT: "交易金额",
    csv.Col.TXN_DATE: "交易日期",
    csv.Col.LAST4: "卡末四位",
}


def comm_categorizer(txn: Transaction):
    # At this time the txn has only one posting
    try:
        posting1 = txn.postings[0]
    except IndexError:
        return txn

    from importers.beanmaker import mapping_account
    account_name = mapping_account(_debit_account, txn.narration)

    posting2 = posting1._replace(
        account=account_name,
        units=-posting1.units
    )
    # Insert / Append the posting into the transaction
    if posting1.units < posting2.units:
        txn.postings.append(posting2)
    else:
        txn.postings.insert(0, posting2)

    return txn


comm_config = csv.Importer(
    config=_config_com,
    account=_default_account_comm,
    currency=_currency,
    last4_map={"2222": "优逸白"},
    categorizer=comm_categorizer
)

CONFIG = [
    wechat_config,
    alipay_config,
    comm_config,
]
```

文件结构：

```
├── README.md
├── account
│   ├── assets.bean
│   ├── crypto.bean
│   ├── equity.bean
│   ├── expenses.bean
│   ├── income.bean
│   ├── liabilities.bean
│   ├── securities.bean
│   └── vesting.bean
├── beans
│   ├── 2020.bean
│   ├── 2021
│   │   ├── 01.bean
│   │   ├── 02.bean
│   │   ├── 03.bean
│   │   └── 04.bean
│   ├── 2021.bean
│   ├── alipay_record_20190101_20191231.bean
│   ├── alipay_record_20200101_20201231.bean
│   ├── assets-broker.bean
│   ├── comm-2021.01.bean
│   ├── comm-2021.02.bean
│   ├── comm-2021.03.bean
│   ├── 微信支付账单(20200701-20200930).bean
│   └── 微信支付账单(20201001-20201231).bean
├── config.py
├── datas
│   ├── alipay_record_20190101_20191231.csv
│   ├── alipay_record_20200101_20201231.csv
│   ├── comm-2021.01.csv
│   ├── comm-2021.02.csv
│   ├── comm-2021.03.csv
│   ├── 微信支付账单(20200701-20200930).csv
│   └── 微信支付账单(20201001-20201231).csv
├── importers
│   └── beanmaker.py
├── main.bean
├── processing.sh
├── requirements.txt
└── strip_blank.py
```

其中，`account` 目录是定义了各类的账户，下面的账单整理主要涉及的目录是 `datas` 和 `beans` 目录。我将账单的原始文件放在 `datas` 目录中，而 `beans` 则存放处理过后的 bean 文件。



## 微信账单的导入 Beancount
微信的账单可以通过，钱包 -> 账单 -> 常见问题 -> 账单下载导出，但是需要注意的是，每次导出只能跨 3 个月。导出的账单会发送到邮箱中。账单格式是 CSV。在邮件附件中下载的压缩包需要密码，解压的密码会通过官方的账号发送到微信通知。

解压之后会得到如下格式的文件：

```
微信支付账单明细,,,,,,,,
微信昵称：[xxx],,,,,,,,
起始时间：[2018-01-01 00:00:00] 终止时间：[2018-03-31 23:59:59],,,,,,,,
导出类型：[全部],,,,,,,,
导出时间：[2020-02-28 12:59:49],,,,,,,,
,,,,,,,,
共207笔记录,,,,,,,,
收入：137笔 xxxx.34元,,,,,,,,
支出：66笔 xxxx.60元,,,,,,,,
中性交易：4笔 xxxx.13元,,,,,,,,
注：,,,,,,,,
1. 充值/提现/理财通购买/零钱通存取/信用卡还款等交易，将计入中性交易,,,,,,,,
2. 本明细仅展示当前账单中的交易，不包括已删除的记录,,,,,,,,
3. 本明细仅供个人对账使用,,,,,,,,
,,,,,,,,
----------------------微信支付账单明细列表--------------------,,,,,,,,
交易时间,交易类型,交易对方,商品,收/支,金额(元),支付方式,当前状态,交易单号,商户单号,备注
2018-03-31 21:35:09,微信红包,/,"/",支出,¥100.00,零钱,支付成功,1000039501180331000xxxxxxxxxxxxxxxxx	,10000395012018033xxxxxxxxxxxxxx	,"/"
```

可以看到前16行都是一些注释信息，并不是正式的交易数据。真正的交易数据从 17 行开始。有这样一份数据就可以使用脚本到入成 Beancount 文件。

Vim 下将文件格式转换成 UTF-8 避免不必要的麻烦：

    :set fileencoding=utf-8
    :w

## 支付宝账单的导入 Beancount
支付宝的账单可以通过网页端，在[我的账单](https://consumeprod.alipay.com/record/standard.htm)页面选择时间范围，单次跨度不能超过 1 年，然后在页面底部点击「下载查询结果」，导出的格式为 CSV 格式。


```
支付宝交易记录明细查询
账号:[xxxxxxxx@xxxxx.com]
起始日期:[2019-01-01 00:00:00]    终止日期:[2020-01-01 00:00:00]
---------------------------------交易记录明细列表------------------------------------
交易号                  ,商家订单号               ,交易创建时间              ,付款时间                ,最近修改时间              ,交易来源地     ,类型              ,交易对方            ,商品名称                ,金额（元）   ,收/支     ,交易状态    ,服务费（元）   ,成功退款（元）  ,备注                  ,资金状态     ,
2019123122001456xxxxxxxxxxxx	,M201912317xxxxxxx   	,2019-12-31 13:26:28 ,2019-12-31 13:26:29 ,2019-12-31 13:26:29 ,其他（包括阿里巴巴和外部商家）,即时到账交易          ,中国铁路网络有限公司      ,火车票                 ,493.50  ,支出      ,交易成功    ,0.00     ,0.00     ,                    ,已支出      ,
20191231343073829431 	,                    	,2019-12-31 05:39:17 ,                    ,2019-12-31 05:39:17 ,支付宝网站     ,即时到账交易          ,博时基金管理有限公司      ,余额宝-2019.12.30-收益发放 ,2.83    ,        ,交易成功    ,0.00     ,0.00     ,                    ,已收入      ,
```

## 京东账单导出及导入 Beancount
京东不提供历史交易记录的导出，这就使得我们得从京东后台的我的订单中手动的将账单导出。

受到 [zsxsoft](https://github.com/zsxsoft/my-beancount-scripts/) 使用 userscript 脚本的启发。经过一定的修改

- [导出京东账单到 Beancount](https://github.com/einverne/userscripts/tree/master/jd-beancount)

到订单页面直接在浏览器自动生成 Beancount，粘贴即可。


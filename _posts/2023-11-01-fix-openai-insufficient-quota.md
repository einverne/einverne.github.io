---
layout: post
title: "解决 OpenAI insufficient_quota 问题"
aliases:
- "解决 OpenAI insufficient_quota 问题"
tagline: ""
description: ""
category: 经验总结
tags: [ openai, ai, chatgpt ]
create_time: 2023-11-01 18:11:33
last_updated: 2023-11-02 18:11:33
---

因为一直在用 OpenAI 的 API，之前是账户中还有一些余额，但是在 2023 年 11 月 1 号就到期了，但是到期之后我账户中也是有充值了 5 美元的余额，理论上应该直接切换到使用我的账户余额，但问题就是 OpenAI 的接口无限制地返回了 insufficient_quota 错误。

网上去查询这个错误的时候大部分的错误都是说当前已经超过了配额限制，所以报错，但是明明我的账户中还有 4.95 美元的余额。所以我开始怀疑是不是 OpenAI 后台处理这个余额切换的时候出错了。

于是我就找到了 [这个问题](https://stackoverflow.com/q/75898276/22206474) 几乎是一样的错误，最高赞里面的说明是，当前已经超出了配额，需要升级是一个 Paid Plan，可问题就在于，我在试用余额的过程中，因为需要解除调用的频率限制，就已经进行了付费，目前已经是一个付费的 Plan。所以高赞的回答没有解决我的问题。

于是我继续往下看，发现下面还有一个人遇到相同的问题，他的解决方案是先取消了当前的方案，然后重新添加支付方式，然后重新确认组织。带着一丝怀疑我就尝试了一下他的方案，虽然只有一个赞，但是缺失解决了我的问题，并且在添加支付方式的时候，又充值了 5 美元。

解决步骤：

- 首先取消了当前的付费方案，此时账户的余额会消失，但是不要担心，重新添加支付方式之后就会还在
- 然后到 API Keys 的部分，重新选择组织，在 Default Organizations 下拉菜单，然后会有一个弹窗，确定，Confirm
- 然后再尝试一下之前的 API Key，或者重新生成一个 API Key ，就发现恢复了访问。

---
layout: post
title: "CoinPayments 加密货币支付网关"
aliases:
- "CoinPayments 加密货币支付网关"
tagline: ""
description: ""
category: 产品体验
tags: [coinpayments, cryptocurrency, btc, eth, usdt, trx, tron, stripe, payment,]
create_time: 2023-06-12 23:14:21
last_updated: 2023-06-12 23:14:21
---

[CoinPayments](https://www.coinpayments.net/index.php?ref=6f4b907fceadc8c33efdc2d654eca4c4) 是全球第一个加密货币支付网关，成立于 2013 年 8 月加拿大，CEO 是 Alex Alexandrov。商家可以借助 CoinPayments 来接受加密货币的支付订单。CoinPayments 接受非常多的加密货币，不仅支持流行的比特币(BTC)，以太坊(ETH)，还支持非常多的小众代币。CoinPayments 还提供了大量的购物车插件，以及定制的支付解决方案和商家工具。

CoinPayments 收取 0.5% 的固定佣金，相较于 Stripe 的 2~3%，以及信用卡更高的佣金，CoinPayments 非常有优势，但目前的问题就在于

- 加密货币波动大，无法在消费领域产生实际用途（稳定币除外）
- 加密货币支付对于普通人日常使用门槛较高，维护一个安全的加密货币钱包，以及如何认知加密货币钱包，[[钱包助记词]]，私钥，网络，钱包地址等等，都需要有一些学习

CoinPayments 并没有将自己的业务限制在支付工具上，用户也可以通过 CoinPayments 构建一个在线商店，直接通过 CoinPayments 销售商品并接受加密货币支付，但看起来目前做得并不成功。

用户可以使用的另一个独特功能是 PaybyName 服务，它可以简化任何加密货币交易者或投资者的生活。通过创建一个帐户，用户可以获得一个用于发送或接收任所支持加密货币的地址。

## 特性

CoinPayments 的功能：

- 支持 2310+ 种币，包括比特币，莱特币，等等[^coin]
- 可以和现有的购物网站，[[WooCommerce]]，[[Opencart]]，[[Shopify]]，[[OScommerce]]，[[Magento]] 等等集成
- 礼品卡支持，可以购买带有加密货币的礼品卡
- 提供加密货币转换
- 多币种支持的钱包

[^coin]: <https://www.coinpayments.net/supported-coins>

## 费用

CoinPayments 对于所有支付的订单收取 0.5% 的交易手续费。[^1]

[^1]: <https://www.coinpayments.net/help-fees>

![AnSw](https://photo.einverne.info/images/2023/06/12/AnSw.png)

对于存入钱包的，每个月前 15000 美元免费，之后收取 0.5%。

![Asec](https://photo.einverne.info/images/2023/06/12/Asec.png)

CoinPayments 不收取任何提现的手续费，但是如果要转账到其他钱包，根据不同的网络，需要支付不同的网络费用（Network Fees）。

![AqCd](https://photo.einverne.info/images/2023/06/12/AqCd.png)

更多的网络费用可以在[这里](https://www.coinpayments.net/help-fees) 查看。

## 注册使用

CoinPayments 的注册非常简单，只需要一个邮箱即可，但是 [[KYC]] (Know your customer) 的过程稍微有一些复杂。

注册使用 CoinPayments 的步骤：

- 准备一个邮箱，然后在 CoinPayments 上使用邮箱注册一个帐号
- 邮箱会收到一个验证码，然后通过验证码验证邮箱，进入 CoinPayments 后台

### KYC

[[KYC]] 是 CoinPayments 验证注册用户身份的一种方式，在 KYC 的过程中至少需要准备：

- 护照原件（因为需要拍照）
- 居住证明（Bank statements ，三个月内的水电账单，有线电视账单 等等有住址的证明，只需要一份即可）
- 一个居住地的电话号码

然后按照网站给出的流程注册即可，但是需要注意的是，验证网站不能上传截图或者带反光的照片，在拍摄的时候要特别注意，否则可能验证失败。失败之后可以重新拍摄，重新提交进行验证。

身份验证完成之后就可以在 CoinPayments 后台访问设置，商家工具等等。

在注册后，您需要在您的 CoinPayments 账户中添加您要接受的加密货币。这涉及到为每种币种生成一个加密货币地址，客户可以向该地址发送付款，需要注意的是 USDT TRC-20 网络的地址需要提前向该地址发送 0.1 TRX 进行激活。

集成到您的网站：CoinPayments 提供了许多 API 和插件，可帮助您将其支付处理器集成到您的网站上。根据您的技术水平和需求，您可以选择使用 CoinPayments 提供的现成插件或自己编写代码。

接受付款：一旦 CoinPayments 已经被成功集成到您的网站上，您就可以开始接受加密货币付款了。当客户发送付款时，CoinPayments 会将资金保留在您的账户中，直到您将其提取到您的钱包中。

需要注意的是，使用 CoinPayments 需要您了解一些基本的数字货币概念，例如加密货币地址、钱包、Gas Fee 等等。如果您对此还不熟悉，建议您先学习一些相关基础知识。

### 提取资金

最后，您可以从 CoinPayments 账户中提取您接受的加密货币。提取的方式取决于您的需求和偏好，您可以选择将资金提取到您的加密货币钱包或将其转换为法定货币后提取到您的银行账户。

### Non-Incorporated vs Incorporated

在 KYC 的过程中，你会看到 CoinPayments 要求用户选择是什么类型的账户，这个账户类型选择之后就不能修改了，除非联系人工客服。

Non-Incorporated 和 Incorporated 的区别在于

- non-incorporated 公司是归独立个人所有，验证流程是和个人账号一样的
- Incorporated 公司，例如法定公司，有限公司（公共或私人），一人一公司，合伙企业和非政府组织，可保护作为与所有者单独的法人实体的负债。

## 商家工具

### API

CoinPayments 提供了一套完整的 API 接入方式，具体可查看[这里](https://www.coinpayments.net/apidoc-intro)。当用户完成支付时，也可以通过 [IPN](https://www.coinpayments.net/merchant-tools-ipn)，Web Callback 的方式来通知系统。

## 最后

如果觉得文章内容对您有帮助，可以点击下方的支付按钮，支付 1 USDT 表示您的支持。

<form action="https://www.coinpayments.net/index.php" method="post">
	<input type="hidden" name="cmd" value="_pay_simple">
	<input type="hidden" name="reset" value="1">
	<input type="hidden" name="merchant" value="6f4b907fceadc8c33efdc2d654eca4c4">
	<input type="hidden" name="item_name" value="Blog">
	<input type="hidden" name="currency" value="USD">
	<input type="hidden" name="amountf" value="1.00000000">
	<input type="hidden" name="want_shipping" value="0">
	<input type="hidden" name="success_url" value="https://blog.einverne.info">
	<input type="hidden" name="cancel_url" value="https://blog.einverne.info">
	<input type="image" src="https://www.coinpayments.net/images/pub/buynow-grey.png" alt="Buy Now with CoinPayments.net">
</form>

## related

- [[Stripe]] 法币的支付网关
- [[Paypal Business]]
- [[Bitpay]]
- [[GoCoin]]
- [[CoinsBank]]
- [[Coinbase Commerce]]
- [[Asiabill]]

## reference

- [集成 CoinPayments 的教程](https://blog.coinpayments.net/tutorials/integration/coinpayments-ecommerce-integration-guide)
- [KYC 验证教程](https://blog.coinpayments.net/resources/coinpayments-identity-verification-kyc-tutorial-how-to-complete-your-verification-process)

---
layout: post
title: "XML 数字签名及 Java 实现"
aliases:
- "XML 数字签名及 Java 实现"
tagline: ""
description: ""
category: 学习笔记
tags: [ java, xml, java-xml, java-xml-signature, signature ]
create_time: 2023-07-20 10:45:11
last_updated: 2023-07-20 10:45:11
---

数字签名是一种基于摘要算法和非对称加密技术的防止数据在传输过程中被篡改的安全技术。

数字签名的原理是对传输的内容做摘要（SHA245 等），然后把摘要和用到的摘要算法使用非对称加密技术的公钥或私钥（大部分情况下是私钥）生成签名。接收方接受到数据后，把签名信息用私钥或公钥验证来确保内容的完整性。

## XML 数字签名

XML 数字签名是数字签名的基础上定义出来的一种 XML 数字签名规范，和普通的数字签名相比较有不少优点，比较灵活。XML 数字签名即可以对传输的所有内容签名，也可以只对传输的一小部分内容进行部分签名。不同的签名还可以使用不同的算法和密钥。[^1]

[^1]：<https://www.w3.org/TR/xmldsig-core2/>

XML Signature 是一个定义数字签名的 XML 语法的 W3C 推荐标准。从功能上或，XML Signature 与 PKCS#7 有很多共同点，但是 XML 签名具有更好的可扩展性，并为签名 XML 文档做了调整。XML Signature 在许多 Web 技术，如 SOAP, SAML 等中使用。

最近在调研日本 e-Gov 电子申请的时候，所使用的签名技术就是基于 XML 的签名，因为提交的数据格式是 XML ，并且涉及到敏感信息所以签名是必不可少的部分。

## XML 数字签名的类型

XML 数字签名分成三种类型：

- Enveloped
- Enveloping
- Detached

它们的差别在于 XML 文档结构不同。

### Enveloped

Enveloped 格式 XML 签名是把签名节点 `Signature` 直接嵌入到原始 XML 文档中。比如下方的样式中的 `<Signature>` 节点。

```
<?xml version="1.0" encoding="UTF-8"?>
<PurchaseOrder>
 <Item number="130055555232">
  <Description>Game</Description>
  <Price>19.99</Price>
 </Item>
 <Buyer id="8492340">
  <Name>My Name</Name>
  <Address>
   <Street>One Network Drive</Street>
   <Town>Burlington</Town>
   <State>MA</State>
   <Country>United States</Country>
   <PostalCode>01803</PostalCode>
  </Address>
 </Buyer>
 <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
  <SignedInfo>
   <CanonicalizationMethod
    Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
   <SignatureMethod
    Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
   <Reference URI="">
    <Transforms>
     <Transform
      Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
    </Transforms>
    <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
    <DigestValue>tVicG91o5+L31M=</DigestValue>
   </Reference>
  </SignedInfo>
  <SignatureValue>
   ...
  </SignatureValue>
  <KeyInfo>
   <X509Data>
    <X509SubjectName>
     CN=Your Name,O=Certificates Inc.,C=US
    </X509SubjectName>
    <X509Certificate>
     ...
    </X509Certificate>
   </X509Data>
  </KeyInfo>
 </Signature>
</PurchaseOrder>
```

### Enveloping

Enveloping 格式的 XML 签名和 Enveloped 正好相反，把原始 XML 文档作为子节点，插入到新生成的 Signature 节点的 Object 子节点中。

```
<?xml version="1.0" encoding="UTF-8"?>
<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
  <SignedInfo>
   <CanonicalizationMethod
    Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
   <SignatureMethod
    Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
   <Reference URI="#order">
    <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
    <DigestValue>+8cIU+LQ=</DigestValue>
   </Reference>
  </SignedInfo>
  <SignatureValue>
   ...
  </SignatureValue>
  <KeyInfo>
   <X509Data>
    <X509SubjectName>
     CN=Your Name,O=Test Certificates Inc.,C=US
    </X509SubjectName>
    <X509Certificate>
     ...
    </X509Certificate>
   </X509Data>
  </KeyInfo>
  <Object ID="order">
      <PurchaseOrder>
       <Item number="130045555532">
        <Description>Game</Description>
        <Price>19.99</Price>
       </Item>
       <Buyer id="849">
        <Name>Your Name</Name>
        <Address>
         <Street>One Network Drive</Street>
         <Town>Burlington</Town>
         <State>MA</State>
         <Country>United States</Country>
         <PostalCode>01803</PostalCode>
        </Address>
       </Buyer>
      </PurchaseOrder>
   </Object>
 </Signature>
```

这里需要注意的是 Reference 节点中指向的部分，如果使用空值表示指向文档根节点，而如果指定了值，那就是指向 XML 文档中的部分内容。

### Detached

Detached 格式是指新生成的 Signature 节点作为一个独立的文档单独保存和传输，而不会对原始文档进行修改。

## XML 数字签名的结构

### Signature 结构

```
<Signature ID?>
  <SignedInfo>
    <CanonicalizationMethod />
    <SignatureMethod />
   (<Reference URI? >
     (<Transforms>)?
      <DigestMethod>
      <DigestValue>
    </Reference>)+
  </SignedInfo>
  <SignatureValue>
 (<KeyInfo>)?
 (<Object ID?>)*
</Signature>
```

- `Signature` 节点是数字签名根节点
- `SignedInfo` 保存签名和摘要信息以及使用的各种算法
  - `SignedInfo` 中的 `CanonicalizationMethod` 子节点用来指定生成签名的 SignedInfo 节点规范化处理方法，具体的方法可以参考规范中的 「Exclusive XML Canonicalization」
  - `SignatureMethod` 子节点用来指定签名使用的摘要算法和签名算法
  - `SignedInfo` 可以包含一个或多个 `Reference` 子节点，每个 Reference 用来指定某个引用的 XML 节点经过规范化后的摘要信息和生成摘要的方法
- `SignatureValue` 用来保存整个 SignedInfo 节点经过规范化后输出内容的签名
- `KeyInfo` 是可选的，用来保存验证签名的非对称加密算法公钥（只有公钥可以公开）
- `Object` 节点是可选的，只有在 Enveloping XML 签名时才会用到

## 开发相关的库

- [[Apache Santuario]] 是 Apache 上一个 XML 安全性方面的项目，旨在实现对 XML 的主要安全标准。

### XMLSec Library

XMLSec Library 支持 W3C 的 XML Signature 和 XML Encryption 规范，同时也支持 Canonical XML 和 Exclusive Canonical XML 规范。

## 数字签名处理过程

主要工作是根据内容创建 Signature 节点。

- 首先生成”Reference“节点
- 然后再这个基础上创建”SignedInfo“
- 最后针对”SignedInfo“生成数字签名，并最终生成“Signature”节点

## Java

引入依赖

```
<dependency>
  <groupId>org.apache.santuario</groupId>
  <artifactId>xmlsec</artifactId>
  <version>2.2.3</version>
</dependency>
```

编码例子

```
public static void sign(Key signKey, X509Certificate signCert,
    Element signElement) throws XKMSException {
  String elementId = signElement.getAttribute("Id");
  if (elementId == null) {
    throw new XKMSException("Id of the signing element is not set");
  }
  String elementRefId = "#" + elementId;
  IdResolver.registerElementById(signElement, elementId);
  try {
    XMLSignature signature = new XMLSignature(signElement
        .getOwnerDocument(), elementRefId,
        XMLSignature.ALGO_ID_SIGNATURE_RSA_SHA1,
        Canonicalizer.ALGO_ID_C14N_EXCL_OMIT_COMMENTS);
    signElement.appendChild(signature.getElement());
    Transforms transforms = new Transforms(signElement
        .getOwnerDocument());
    transforms.addTransform(Transforms.TRANSFORM_ENVELOPED_SIGNATURE);
    transforms
        .addTransform(Transforms.TRANSFORM_C14N_EXCL_OMIT_COMMENTS);
    signature.addDocument(elementRefId, transforms,
        MessageDigestAlgorithm.ALGO_ID_DIGEST_SHA1);
    signature.addKeyInfo(signCert);
    signature.addKeyInfo(signCert.getPublicKey());
    signature.sign(signKey);
  } catch (XMLSecurityException xmse) {
    throw new XKMSException(xmse);
  }
}
```

## reference

- <https://www.w3.org/TR/xmldsig-core1/>
- <https://github.com/rng-web-geeks/back-end/blob/master/src/main/java/com/ringcentral/demo/xml/CreateXMLSignature.java>

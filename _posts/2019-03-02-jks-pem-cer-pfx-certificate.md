---
layout: post
title: "jks pem cer pfx 不同种类的证书"
tagline: ""
description: ""
category: 经验总结
tags: [ssl, jks, pem, cer, pfx, certificate, ]
last_updated:
---

通常在安全级别较高的场景经常需要对通信信息进行加密传输，有一种情况就是非对称加密，将信息使用对方提供的公钥加密传输，然后对方接收到之后使用私钥解密。今天在对接时对方发送了一个压缩包，其中包含了 SSL 不同类型的证书，包括了 jks, pem, cer, pfx 等等文件，现在就来了解一下。

## jks
jks 全称 Java KeyStore ，是 Java 的 keytools 证书工具支持的证书私钥格式。jks 包含了公钥和私钥，可以通过 keytool 工具来将公钥和私钥导出。因为包含了私钥，所以 jks 文件通常通过一个密码来加以保护。一般用于 Java 或者 Tomcat 服务器。

    keytool -exportcert -rfc -alias mycert -file mycert.cer -keystore mykeys.jks -storepass passw0rd

## pfx

[[PFX]] 全称是 Predecessor of PKCS#12, 是微软支持的私钥格式，二进制格式，同时包含证书和私钥，一般有密码保护。一般用于 Windows IIS 服务器。

    openssl pkcs12 -in xxx.pfx

转为 pem

    openss pkcs12 -in for-iis.pfx -out for-iis.pem -nodes

## cer
cer 是证书的公钥，一般都是二进制文件，不保存私钥。

## der
二进制格式，Java 和 Windows 服务器偏向使用

    openssl x509 -in certificate.der -inform der -text -noout

## pem
[[PEM]] 全称是 Privacy Enhanced Mail，格式一般为文本格式，以 `-----BEGIN` 开头，以 `-----END` 结尾，中间内容是 BASE64 编码，可保存公钥，也可以保存私钥。有时候会将 pem 格式的私钥改后缀为 `.key` 以示区别。

这种格式的证书常用于 Apache 和 Nginx 服务器，所以我们在配置 Nginx SSL 的时候就会发现这种格式的证书文件。



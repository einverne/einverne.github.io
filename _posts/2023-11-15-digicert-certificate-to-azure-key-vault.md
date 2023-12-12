---
layout: post
title: "从 DigiCert 获取证书并在 Azure KeyVault 中导入使用"
aliases:
- "从 DigiCert 获取证书并在 Azure KeyVault 中导入使用"
tagline: ""
description: ""
category: 经验总结
tags: [ digicert, openssl, keyvault, azure, csr, certificate ]
create_time: 2023-11-15 17:24:38
last_updated: 2023-11-15 17:24:38
---

## 前提知识

### 什么是 CSR

[[CSR]] （Certificate Signing Request），即证书签名请求文件，证书申请人在申请数字证书时由 CSP(加密服务提供者)在生成私钥的同时也生成证书请求文件，证书申请人只需要把 CSR 文件提交给证书颁发机构后，证书颁发机构使用其根证书私钥签名就生成了证书公钥文件，也就是颁发给用户的证书。

申请人需要生成 CSR 文件并提交给证书颁发机构（CA）。CSR 包含了用于签发证书的公钥、用于辨识的名称信息（Distinguished Name）（例如域名）、真实性和完整性保护（例如数字签名），通常从 Web 服务器生成 CSR，同时创建加解密的公钥私钥对。

#### 如何产生 CSR 文件

要生成 CSR 文件，需要在 Linux 系统中，使用 OpenSSL 命令行工具。

然后执行以下命令，即可生成 CSR 文件。

```
openssl req -new -nodes -sha256 -newkey rsa:2048 -keyout $Key_File -out $OpenSSL_CSR
```

- **new**：指定生成一个新的 CSR 文件。
- **nodes**：指定密钥文件不被加密。
- **sha256**：指定摘要算法。
- **newkey rsa:2048**：指定密钥类型和长度。
- **$Key_File**：密钥文件名称。
- **$OpenSSL_CSR**：加密后文件的存放路径。

根据系统返回的提示，输入 CSR 文件所需的信息。以下是关于提示的说明：

- Country Name（2 letter code）：JP，申请单位所属国家，只能是两个字母的国家码。例如，中国填写为 CN。
- State or Province Name（full name）[Some-State]： Tokyo，州名或省份名称，可以是中文或英文。
- Locality Name(eg, city)[]： Shinagawa，城市名称，可以是中文或英文。
- Organization Name(eg, company) [Internet Widgits Pty Ltd]：公司名称，可以是中文或英文。
- Organizational Unit Name：部门名称，可以是中文或英文。
- Common Name：申请 SSL 证书的具体网站域名。
- Email Address：可选择不输入。
- Challenge Password：可选择不输入。

按照命令提示输入相应内容后，即可在当前目录下获取密钥文件和 CSR 文件。

### 什么是 pem

[[PEM]] (Privacy Enhanced Mail) 格式是一种用于存储和传输密钥数据的常见格式，通常用于包含加密证书、密钥、数字证书和其他安全相关信息。

PEM 格式的数据通常以文本形式编码，但可以包含二进制数据。PEM 格式的文件通常使用扩展名为 `.pem`、`.crt`、`.cer`、`.key` 或 `.p12`。用户可以使用任何文本编辑器打开，但通常更推荐使用 OpenSSL 或其他密码学工具集进行处理。

### 什么是 pfx

[[PFX]] 是 Personal Information Exchange 的缩写，一种用于存储和传输数字证书和私钥的文件格式。它是一种二进制格式，使用 PKCS#12 标准来存储数据。

PFX 文件通常以 `.pfx` 或者 `.p12` 扩展名结尾。

PFX 文件和 PEM 文件的主要区别在于，PFX 文件包含私钥，而 PEM 文件仅包含公钥。这使得 PFX 文件比 PEM 文件更安全一些，因为私钥只能由拥有密码的用户访问。

## 从 DigiCert 获取证书的流程

从 [[DigiCert]] 公司获取证书的流程：

- 生成 [[CSR]] 文件，提供给 DigiCert
- 等待 DigiCert 发行证书，获取 DigiCert 发行证书
- 将产生 CSR 文件的本地私钥和 DigiCert 发行的证书合并
- 生成 pem 或者 pfx 上传到 [[Azure Key Vault]] 中

从 DigiCert 官网获取证书文件，然后使用命令行工具生成 PFX 文件。

利用 OpenSSL 工具将私钥和证书文件合成 PEM 以及 PFX 文件。

```
openssl pkcs12 -export -inkey private.key -in certificate.crt -out certificate.pem
```

合成 PFX 文件

```
openssl pkcs12 -export -inkey private.key -in certificate.crt -out certificate.pfx
```

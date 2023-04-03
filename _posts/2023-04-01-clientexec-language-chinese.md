---
layout: post
title: "Clientexec 汉化"
aliases:
- "Clientexec 汉化"
tagline: ""
description: ""
category: 经验总结
tags: [ clientexec, billing, webhosting, racknerd, language, python ]
create_time: 2023-04-02 18:06:17
last_updated: 2023-04-02 18:06:17
---

之前购买 [RackNerd](https://gtk.pw/rn) 的机器看到有赠送 [[Clientexec]] 的授权就顺手申请了一个。**ClientExec** 是一套为主机商开发的客户管理，支持，财务系统。借助 ClientExec 的强大能力可以快速构建一个共享空间，VPS，域名分售系统。

因为正好有授权在，所以就在 RackNerd 的机器上面安装了一下。安装的过程倒是比较简单，但就是这套系统实在太复杂，从绑定的插件到，支付系统，到后台语言都比较麻烦，所以这一篇文章简单地讲述一下我汉化 Clientexec 的过程，这里面也有很多的坑。

## 获取英文语言字符串

如果要在 Clientexec 中新增语言包，可以通过源代码 `language` 路径下的语言包进行修改。

在安装完成的 Clientexec 的目录下，拷贝原来的英文语言。

```
/language/core-en.po
/language/core-en.mo
```

简体中文的语言编码代号是 `zh`，所以需要拷贝得到：

```
core-zh.po
core-zh.mo
```

这个语言代号，可以从 `/library/Zend/Locale/Data/Translation.php` 文件中得到，在数组 `$languageTranslation` 中搜索 `Chinese` 就可以看到。

![nBlg](https://photo.einverne.info/images/2023/04/03/nBlg.png)

得到了对应的原始英文内容之后，就可以开始着手翻译，有很多的方式可以进行翻译。

## 翻译 Po 文件

### po 和 mo 文件

这里需要补充一下 po 和 mo 文件的相关前提知识。 PO 和 MO 文件是 GNU gettext 工具包中使用的翻译文件格式，用于本地化软件应用程序和网站。PO 文件是 Portable Object 的缩写，它是一个文本文件，包含原始字符串和它们的翻译。MO 文件是 Machine Object 的缩写，它是一个二进制文件，包含已翻译的字符串，可用于更快地加载和使用翻译。Clientexec 是 PHP 编写的，也是通过这种方式进行国际化，多语言。

通常，开发者在开发过程中在源代码中使用原始字符串，并使用 GNU gettext 提供的工具来提取这些字符串并创建 PO 文件。然后，翻译者可以使用 PO 文件中的原始字符串并提供它们的翻译。一旦翻译完成，MO 文件将由 GNU gettext 编译器从 PO 文件生成。在软件运行时，应用程序将使用 MO 文件中的翻译来显示正确的本地化字符串，这使得软件能够在不同的语言环境下运行。

### 翻译 PO 文件

有很多的方式可以去翻译 po 文件

- 我最开始的时候是傻乎乎的使用 [[Poedit]] 桌面客户端手工进行翻译。直接打开 po 文件进行翻译
- 然后想着效率太低了，想能不能用 [[Crowdin]] 这个共享协作的翻译平台进行翻译，创建项目，然后网站上也提供了很多翻译的选项，直接 cmd+Enter 倒也是能快速翻译，但是我觉得还是太慢了，翻译了半天才 2%
- 然后我想到这不就是从一个语言到另一个语言的翻译么，能不能找找免费的翻译工具翻译，[[DeepL]] 免费提供一个月 50 万字的额度，但是注册失败了，然后我想到之前用 GoldenDict 的时候用 Python 调用 Google Translator 用了很久。现在只要写一个读取 po 文件，然后调用 Google Translator 的方法，翻译完成之后再写回文件即可

需要注意的是 PO 文件有一个头部的「注释」，在文件的开头，因为我把文件上传到了 Crowdin，然后再下载下来的，所以 Crowdin 修改了这些注释，最好的方式是保持和原来一致，否则 Clientexec 可能无法识别。

### 从 PO 文件生成 MO 文件

有如下的方法：

- Poedit 软件内能直接从 PO 文件生成 MO 文件
- 或者可以通过在线的工具 [localise](https://localise.biz/free/converter)

![nHkw](https://photo.einverne.info/images/2023/04/03/nHkw.png)

- Choose source file 中选择需要转换的 PO 文件
- 然后在 To 中选择 Gettext MO(binary)
- 然后点击 Convert
- 保存到本地 并命名为 `core-zh.mo`

MO 文件是 Clientexec 用来加载使用的二进制文件，其中包含了翻译文字。

## 上传到 Clientexec 并在后台设置

将现在得到的两个文件：

```
core-zh.po
core-zh.mo
```

上传到 Clientexec 的 `language` 文件夹下。这个地方要注意的是，如果这两个文件没有足够的权限，后台即使设置了也会没有效果。

```
chmod 755 core-zh.po core-zh.mo
```

最后在 Clientexec 后台设置 -> Localization 中，首先启用 Chinese，然后将站点设置成中文即可。最后的[成果](https://client.einverne.info/)。

## reference

- <https://www.clientexec.com/members/knowledge-base/advanced-customization~83/adding-a-new-translation-language~477>

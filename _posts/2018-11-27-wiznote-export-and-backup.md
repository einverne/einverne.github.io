---
layout: post
title: "为知笔记导出和备份"
tagline: ""
description: ""
category: 经验总结
tags: [wiznote, notebook, backup, markdown, ]
last_updated:
---

WizNote 已经用了好几年，虽然也一直在续费，但总感觉将死不死，基于整理这几年近 4000 条的笔记的目的，也一方面为迁移出 WizNote 的目的，研究一下 WizNote 笔记导出和备份的方法。

文中有些具体分析，基于 WizNote for Linux Version 2.5.8 版本，不同版本之间可能有些差异，务必要注意。

在 Linux 下 WizNote 笔记本地缓存放在`~/.wiznote/{your-account-email-addr}/data/notes`目录下面，都是`{GUID}`的方式存放，这些文件都是 zip 文件，每个文件里面包含 html , 图片以及元数据。元数据`meta.xml` 包含了每个 note 的相关信息，比如标题描述等等

如果需要更详细的信息，可以通过读 SQLite 的工具打开 `~/.wiznote/{your-account-email-addr}/data/index.db` 文件

## 准备工作
在导出数据之前有一些准备工作，先同步所有数据，在 Preference 中，Sync 同步选项下

- Personal sync method 选 Download all data
- Group sync method 选择 Download all data when sync
- Download attachment 选择 Download all attachments

否则可能导致本地缓存不是全部的笔记而造成一定程度数据丢失。

## 解决方法
在 index.db 数据库中有两张很重要的表，`WIZ_DOCUMENT` 其中包括了所有笔记的信息，包括笔记的 GUID，标题等等信息，具体的表结构可以查看后文附录中内容。另外一张很重要的表是 `WIZ_DOCUMENT_ATTACHMENT` 其中存储了笔记附件信息。

表中重要的几列

- `DOCUMENT_GUID` 看名字就能够猜出来这是笔记的全局唯一 ID，对应着 data 目录中存储的笔记 ID
- `DOCUMENT_TITLE`，`DOCUMENT_LOCATION` 等等顾名思义就不多说
- 上面提及的两张表通过 `DOCUMENT_GUID` 形成关联，一个笔记可能会对应一个或者多个附件，这些信息都包含在附件表中

所以对应的解决方案就是中 db 中读取笔记的 meta 信息，从磁盘 data 目录中找到对应的笔记，解压缩，然后将对应的附件拷贝到对应的笔记目录。

源码地址：<https://github.com/einverne/ExptWizNote>

## 附录

表结构 `WIZ_DOCUMENT`

    create table WIZ_DOCUMENT
    (
      DOCUMENT_GUID              char(36)     not null
        primary key,
      DOCUMENT_TITLE             varchar(768) not null,
      DOCUMENT_LOCATION          varchar(768),
      DOCUMENT_NAME              varchar(300),
      DOCUMENT_SEO               varchar(300),
      DOCUMENT_URL               varchar(2048),
      DOCUMENT_AUTHOR            varchar(150),
      DOCUMENT_KEYWORDS          varchar(300),
      DOCUMENT_TYPE              varchar(20),
      DOCUMENT_OWNER             varchar(150),
      DOCUMENT_FILE_TYPE         varchar(20),
      STYLE_GUID                 char(38),
      DT_CREATED                 char(19),
      DT_MODIFIED                char(19),
      DT_ACCESSED                char(19),
      DOCUMENT_ICON_INDEX        int,
      DOCUMENT_SYNC              int,
      DOCUMENT_PROTECT           int,
      DOCUMENT_READ_COUNT        int,
      DOCUMENT_ATTACHEMENT_COUNT int,
      DOCUMENT_INDEXED           int,
      DT_INFO_MODIFIED           char(19),
      DOCUMENT_INFO_MD5          char(32),
      DT_DATA_MODIFIED           char(19),
      DOCUMENT_DATA_MD5          char(32),
      DT_PARAM_MODIFIED          char(19),
      DOCUMENT_PARAM_MD5         char(32),
      WIZ_VERSION                int64,
      INFO_CHANGED               int default 1,
      DATA_CHANGED               int default 1
    );

表 `WIZ_DOCUMENT_ATTACHMENT` 结构

    create table WIZ_DOCUMENT_ATTACHMENT
    (
      ATTACHMENT_GUID        char(36)     not null
        primary key,
      DOCUMENT_GUID          varchar(36)  not null,
      ATTACHMENT_NAME        varchar(768) not null,
      ATTACHMENT_URL         varchar(2048),
      ATTACHMENT_DESCRIPTION varchar(600),
      DT_INFO_MODIFIED       char(19),
      ATTACHMENT_INFO_MD5    char(32),
      DT_DATA_MODIFIED       char(19),
      ATTACHMENT_DATA_MD5    char(32),
      WIZ_VERSION            int64
    );


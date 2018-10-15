---
layout: post
title: "Python 自然语言处理包 nltk 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [nltk, python, nlp, ]
last_updated:
---

nltk 是 Python 下一个自然语言处理相关的库，可以方便的实现分词，词性标注等等。

## 安装

    pip install nltk

然后在终端执行 python， 进入交互式编辑环境

    >> import nltk
    >> nltk.download()

下载相关模块

## 分词

`nltk.sent_tokenize(text)` #对文本按照句子进行分割

`nltk.word_tokenize(sent)` #对句子进行分词

## 词性标注

`nltk.pos_tag()`

## 词形还原

    from nltk.stem import WordNetLemmatizer
    lemmatizer = WordNetLemmatizer()
    lemmatizer.lemmatize(word)

## reference

- <https://blog.csdn.net/a18852867035/article/details/54134281>


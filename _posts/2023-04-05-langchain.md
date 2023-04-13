---
layout: post
title: "LangChain 是什么"
aliases:
- "LangChain 是什么"
tagline: ""
description: ""
category: 学习笔记
tags: [ langchain, llm, ai, artificial-intelligence, chatgpt, gpt-3, gpt-4, openai, embedding, vector-database, ]
create_time: 2023-04-12 09:29:00
last_updated: 2023-04-12 09:29:00
---

[LangChain](https://github.com/hwchase17/langchain) 是一个围绕大型语言模型 （[[LLM]]）的应用开发框架，或者说是工具集，使用 Python 编写。LangChain 是由 Robust Intelligence 前的机器学习工程师 Chase Harrison 在 10 月底开源的工具库。众多 AI Hackathon 决赛项目使用 LangChain，它的 Github Star 迅速突破万，成为 LLM 应用开发者在选择中间件时最先想到的名字。

- [源代码](https://github.com/hwchase17/langchain)
- [文档](https://python.langchain.com/en/latest/index.html)

LangChain 能做什么？

- 个人助理，记住用户的行为数据并提供建议
- 聊天机器人，语言模型天然擅长生成文本
- 生成式问答
- 文档回答，针对特定的问题回答
- 文本摘要，从文本中提取信息
- 代码理解，理解代码的意图
- 文本总结，从较长的文本中总结信息

## 模块

LangChain 主要提供如下的模块来支持快速开发：

- [Models](https://python.langchain.com/en/latest/modules/models.html) 支持各种模型及集成
  - LLMs，LLM 通用接口，LLM 相关常用工具
- [Prompt](https://python.langchain.com/en/latest/modules/prompts.html)，Prompts 管理，提示优化，提示序列化
- Document Loaders，文档加载的标准接口，与各种格式的文档及数据源集成
- [Chains](https://python.langchain.com/en/latest/modules/chains.html)，包含一系列的调用，可能是一个 Prompt 模板，一个语言模型，一个输出解析器，一起工作处理用户的输入，生成响应，并处理输出
- [Agents](https://python.langchain.com/en/latest/modules/agents.html)，Agent 作为代理人去向 LLM 发出请求，采取形同，检查结果，直到工作完成。
- [Memory](https://python.langchain.com/en/latest/modules/memory.html)，是在 Chains 和 Agent 调用之间的持久化状态
- [Indexes](https://python.langchain.com/en/latest/modules/indexes.html) 将自己的文本做索引

## 用不到 50 行代码实现一个文档对话机器人

我们都知道 [[ChatGPT]] 训练的数据只更新到 2021 年，因此它不知道最新在互联网上产生的内容。而且 ChatGPT 的另一个缺点就是当他不知道的时候就会开始一本正经的胡说。但是利用 LangChain 可以用不到 50 行的代码然后结合 ChatGPT 的 API 实现一个和既存文本的对话机器人。

假设所有 2022 年更新的内容都存在于 2022.txt 着一个文本中，那么通过如下的代码，就可以让 ChatGPT 来支持回答 2022 年的问题。

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-
import os

import jieba as jb
from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import DirectoryLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import TokenTextSplitter
from langchain.vectorstores import Chroma


def init():
    files = ['2022.txt']
    for file in files:
        with open(f"./data/{file}", 'r', encoding='utf-8') as f:
            data = f.read()

        cut_data = " ".join([w for w in list(jb.cut(data))])
        cut_file = f"./data/cut/cut_{file}"
        with open(cut_file, 'w') as f:
            f.write(cut_data)


def load():
    loader = DirectoryLoader('./data/cut', glob='**/*.txt')
    docs = loader.load()
    text_splitter = TokenTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs_texts = text_splitter.split_documents(docs)
    api_key = os.environ.get('OPENAI_API_KEY')
    embeddings = OpenAIEmbeddings(openai_api_key=api_key)
    vectordb = Chroma.from_documents(docs_texts, embeddings, persist_directory='./data/cut/')
    vectordb.persist()
    openai_ojb = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo")
    chain = ConversationalRetrievalChain.from_llm(openai_ojb, vectordb.as_retriever())
    return chain

chain = load()

def get_ans(question):
    chat_history = []
    result = chain({
        'chat_history': chat_history,
        'question': question,
    })
    return result['answer']

if __name__ == '__main__':
    s = input('please input:')
    while s != 'exit':
        ans = get_ans(s)
        print(ans)
        s = input('please input:')
```

## reference

- <https://github.com/gkamradt/langchain-tutorials>

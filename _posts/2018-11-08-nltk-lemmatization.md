---
layout: post
title: "使用 nltk 词形还原"
tagline: ""
description: ""
category: 学习笔记
tags: [nltk, lemmatization, stemming, nlp, goldendict, dictionary, mdx-server, mdx, english-dictionary, morphology, english ]
last_updated:
---

今天在用 mdx-server 将 mdx 文件导出 HTTP 接口时发现 mdx-server 项目并不支持类似于 GoldenDict Morphology 构词法一样的规则，所以只能够在 mdx-server 外自行处理英语单词的词形变化，搜索一圈之后发现了 NLTK。

英语中词形还原叫做 lemmatization，是将一个任何形式的单词还原为一般形式的意思。另外一个相关的概念是 stemming 也就是词干提取，抽取单词的词干或者词根。这两种方法在自然语言处理中都有大量的使用。这两种方式既有联系也有很大差异。

- 两者的目标相似，lemmatization 和 stemming 目标都是将单词的衍生形态简化或者归并为词干 stem 或者原形，都是对相同单词不同形态的还原
- lemmatization 和 stemming 的结果有交叉，cats 的结果相同
- 主流实现方法类似，通过语言中存在的规则和词典映射提取
- 主要应用领域相似，应用于信息检索和文本，自然语言处理等方面

## 区别
词干提取采用缩减方法，将词转变为词干，cats 变为 cat，将 effective 处理成 effect，而词性还原采用转变的方法，将词还原为一般形态，将 drove 变为 drive，将 driving 变为 drive

### Stemming

> In linguistic morphology and information retrieval, stemming is the process for reducing inflected (or sometimes derived) words to their stem, base or root form—generally a written word form. The stem need not be identical to the morphological root of the word; it is usually sufficient that related words map to the same stem, even if this stem is not in itself a valid root. Algorithms for stemming have been studied in computer science since the 1960s. Many search engines treat words with the same stem as synonyms as a kind of query expansion, a process called conflation.

> Stemming programs are commonly referred to as stemming algorithms or stemmers.

### Lemmatization

> Lemmatisation (or lemmatization) in linguistics, is the process of grouping together the different inflected forms of a word so they can be analysed as a single item.
>
> In computational linguistics, lemmatisation is the algorithmic process of determining the lemma for a given word. Since the process may involve complex tasks such as understanding context and determining the part of speech of a word in a sentence (requiring, for example, knowledge of the grammar of a language) it can be a hard task to implement a lemmatiser for a new language.
>
> In many languages, words appear in several inflected forms. For example, in English, the verb ‘to walk’ may appear as ‘walk’, ‘walked’, ‘walks’, ‘walking’. The base form, ‘walk’, that one might look up in a dictionary, is called the lemma for the word. The combination of the base form with the part of speech is often called the lexeme of the word.
>
> Lemmatisation is closely related to stemming. The difference is that a stemmer operates on a single word without knowledge of the context, and therefore cannot discriminate between words which have different meanings depending on part of speech. However, stemmers are typically easier to implement and run faster, and the reduced accuracy may not matter for some applications.

## NLTK Lemmatization
The NLTK Lemmatization 方法基于 WordNet 内置的 morphy function.

    >>> from nltk.stem import WordNetLemmatizer
    >>> wordnet_lemmatizer = WordNetLemmatizer()
    >>> wordnet_lemmatizer.lemmatize(‘dogs’)
    u’dog’
    >>> wordnet_lemmatizer.lemmatize(‘churches’)
    u’church’
    >>> wordnet_lemmatizer.lemmatize(‘aardwolves’)
    u’aardwolf’
    >>> wordnet_lemmatizer.lemmatize(‘abaci’)
    u’abacus’
    >>> wordnet_lemmatizer.lemmatize(‘hardrock’)
    ‘hardrock’
    >>> wordnet_lemmatizer.lemmatize(‘are’)
    ‘are’
    >>> wordnet_lemmatizer.lemmatize(‘is’)
    ‘is’

lemmatize() 方法有第二个 pos 参数，可以传入 `n` 表示 noun，或者 `v` 表示 verb，或者其他的形容词等等，提高准确度。

更多的 [doc](http://www.nltk.org/api/nltk.stem.html#module-nltk.stem.wordnet) 可以参考 API。


## reference

- <https://blog.csdn.net/m0_37744293/article/details/79065002>
- <https://textminingonline.com/dive-into-nltk-part-iv-stemming-and-lemmatization>
- <https://www.nltk.org>
- <https://www.nltk.org/book/ch05.html>
- <http://wordnetweb.princeton.edu/perl/webwn?s=Mastering&sub=Search+WordNet&o2=&o0=1&o8=1&o1=1&o7=&o5=&o9=&o6=&o3=&o4=&h=>

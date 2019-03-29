---
layout: post
title: "Drools 语法规则"
tagline: ""
description: ""
category: 学习笔记
tags: [drools, kie, ]
last_updated:
---

Drools 规则文件大致可以包含这些部分

    package package-name

    imports

    globals

    functions

    queries

    rules

一条规则的大致框架

    rule "name"
        attributes
        when
            LHS
        then
            RHS
    end

Drools 5 中定义了 hard 和 soft 关键字，Hard 关键字是保留字，不能够在规则中自定义随意使用

    true
    false
    accumulate
    collect
    from
    null
    over
    then
    when

规则举例

    rule "validate holiday by eval"
    dialect "mvel"
    when
        h1 : Holiday( )
        eval( h1.when == "july" )
    then
        System.out.println(h1.name + ":" + h1.when);
    end

或者

    rule "validate holiday"
    dialect "mvel"
    when
        h1 : Holiday( `when` == "july" )
    then
        System.out.println(h1.name + ":" + h1.when);
    end


## 操作符
操作符有很多种类：

- Arithmetic operators (`+, -, *, /, %`) 算数操作符
- Relational operators (`>, >=, ==, !=`) 关系操作符
- Logical operators 逻辑操作符
    - conjunction (and, &&, ",") 与
    - disjunction (or, ||) 或
    - negation (!, do not confuse with not) 取反 (!, 不要和 not 混淆）
- Drools operators (in, matches, etc...) | Drools 操作符 (in, matches, 等等...)



一些操作符都非常通俗易懂，这里有几个需要特别注意

### in 操作符

- in 操作符是表示值在一个集合内部，集合中的数据需要单独列出

    when
      e : Emp(deptno in (10,20))

等效于

       e : Emp(deptno == 10 || deptno == 20)
       e : (Emp(deptno == 10) or Emp(deptno == 20))

### matches 操作符
matches 操作符匹配是否匹配 java 正则表达式。

    .   匹配单一字符
    .*  匹配任何字符，包括空字符串

不匹配需要这么写

    when
        e: Emp(name not matches "B.*")

下面的写法是错误的！！！

    when
        e: Emp(name ! matches "B.*")

        e: ! Emp(name matches "B.*")

### 操作符优先级

    (nested) property access    .
    List/Map access            [ ]
    constraint binding   :
    multiplicative       * / %
    additive             + -
    shift                << >> >>>
    relational           < > <= >= instanceof
    equality             == !=
    bit-wise non-short circuiting AND               &
    bit-wise non-short circuiting exclusive OR	^
    bit-wise non-short circuiting inclusive OR	|
    logical AND	&&
    logical OR	||
    ternary	? :
    Comma separated AND	,

Drools 还支持一些高级语法规则，更多可以参考[这里](https://training-course-material.com/training/Drools_Expert_-_mvel_-_LHS_-_advanced)

## reference

- <https://training-course-material.com/training/Category:Drools>
- <https://docs.jboss.org/drools/release/5.2.0.CR1/drools-expert-docs/html/ch05.html>
- <http://support.streamx.co/intro/basic-drools-rule-language-syntax-cont>
- <https://shift8.iteye.com/blog/1915351>
- <http://holbrook.github.io/2012/12/06/rule_language.html>
- <https://blog.csdn.net/u012373815/article/details/53872025>

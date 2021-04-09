---
layout: post
title: "KIE 一些隐藏需要注意的问题"
tagline: ""
description: ""
category: 经验总结
tags: [kie, jboss, rule-engine, ]
last_updated:
---

KIE 的使用和踩坑记录。

## Guided Decision Table 的顺序

决策表默认使用的是 None 的 hit policy，这里涉及到一个问题也就是规则执行的顺序，默认的 None 其实是并发所有规则一同执行的，那么也就隐藏了一问题，如果传入的参数满足多条规则，那么极有可能造成结果不符预期的情况。


更多关于决策表 Hit Policy 的内容可以参考这篇 ---- [决策表规则执行顺序](/post/2018/10/assets-in-drools-kie.html)

- None 默认，**多行可以同时被执行**，verification 会将冲突 warning 出来
- Resolved Hit，根据优先级，每一次只有一行可以被执行，不管在列表中的顺序。可以维持界面中的顺序，转而定义每一行的优先级
- Unique Hit, 一次只能执行一行，每一行必须 Unique，条件不能有重叠，如果多于一行被执行，会有 warning
- First Hit，依据表中的顺序，从上到下，每一次执行一行
- Rule Order，多行可以同时执行，verification 不会将冲突警告

比如对于这条规则

    rule "Row 1 testTable"
        activation-group "first-hit-policy-group testTable"
        dialect "mvel"
        when
            data : testData( eval( s == 5 ), eval( 0<=random && random<100 ))
        then
            data.setResult( "168" );
    end

在创建决策表 Asset 的时候，如果选择了 `FIRST_HIT` 的决策表在每条规则会有条这样的规则：

    activation-group "first-hit-policy-group testTable"

表示的是顺序从上到下一条一条执行。


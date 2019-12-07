---
layout: post
title: "Java 查漏补缺之 BigDecimal"
tagline: ""
description: ""
category: Java
tags: [java, double, float, bigdecimal, jdk, ]
last_updated:
---

在一些对精度要求特别高的系统中，比如会计，金融，Java 中的 double，float 已经不能满足精度需求，谁也不愿意再付款或者计价的时候出现付费 4.4 而账单只有 4.0 元的错误。所以在 Java 中为了更高精度的计算我们需要用到 java.math.BigDecimal.

BigDecimal 需要有两个能力：

- 指定 scale，也就是小数点后几位
- 指定舍入模式，当超过精度时如何处理

通常在使用 BigDecimal 时建议使用 传入 String 的构造函数。

    BigDecimal bd = new BigDecimal(1.5);
    bd = new BigDecimal("1.5");

如果使用 double 的构造函数可能会造成一些问题，比如第一个 bd 可能结果是 1.49999999999999999999

## Scale and Rounding
设置小数点（decimal）后面的数字位数，需要使用 `.setScale(scale)` 方法，与此同时，在设置 scale （数值范围）的时候一并设置 Rounding Mode（舍入模式）被认为是一个比较好的实践方式（Good practice），需要使用 `.setScale(scale, roundingMode)` 。rounding mode 定义了在损失精度时使用的舍入方式，比如四舍五入，或者 Ceiling 或者 Floor 等等。

为什么需要舍入模式，来看一个例子

    bd = new BigDecimal(1.5); // is actually 1.4999....
    bd.setScale(1); // throws ArithmeticException

抛出算术异常，因为 BigDecimal 不知道如何处理 `1.49999`.

有八种定义好的 Rounding Mode，假设保留小数点后两位

    ROUND_CEILING: Ceiling function 向天花板舍入

                     0.333  ->   0.34
                    -0.333  ->  -0.33

    ROUND_DOWN: Round towards zero 向 0 舍入

                     0.333  ->   0.33
                    -0.333  ->  -0.33

    ROUND_FLOOR: Floor function 往小舍入

                     0.333  ->   0.33
                    -0.333  ->  -0.34

    ROUND_HALF_UP: Round up if decimal >= .5

                     0.5  ->  1.0
                     0.4  ->  0.0

    ROUND_HALF_DOWN: Round up if decimal > .5   最常见的四舍五入

                     0.5  ->  0.0
                     0.6  ->  1.0

    ROUND_HALF_EVEN:  当需要舍入的数字是 5 时需要特殊处理，需要看 5 左边的数字奇偶性

     a = new BigDecimal("2.5"); // digit left of 5 is even, so round down
     b = new BigDecimal("1.5"); // digit left of 5 is odd, so round up
     a.setScale(0, BigDecimal.ROUND_HALF_EVEN).toString() // => 2
     b.setScale(0, BigDecimal.ROUND_HALF_EVEN).toString() // => 2

    ROUND_UNNECESSARY: 当需要使用一种舍入方式，但是你知道结果不需要舍入的时候，也就意味着如果使用了这种舍入模式，那么如果出现一个不精确的结果比如 1/3，那么会抛出 ArithmeticException。

## Immutability and Arithmetic
BigDecimal 是不可变对象，也就意味这如果创建了一个 BigDecimal 是 2.00 那么这个 BigDecimal 会一直是 2.00。在做算术是比如 `add()` 或 `multiply()` 方法时会返回一个新的 BigDecimal 对象。


## Comparison
Never use `.equal()` method to compare BigDecimal. Because this equals function will compare the scale. If the scale is different, `.equals()` will return false, even if they are the same number mathematically.

    BigDecimal a = new BigDecimal("2.00");
    BigDecimal b = new BigDecimal("2.0");
    print(a.equals(b)); // false

反之，应该使用 `.compareTo()` and `.signum()` 方法

    a.compareTo(b);  // returns (-1 if a < b), (0 if a == b), (1 if a > b)
    a.signum(); // returns (-1 if a < 0), (0 if a == 0), (1 if a > 0)

## 何时舍入结果：关于精度的思考
如果要在计算中使用舍入模式，那么用什么精度呢？答案是打算如何使用结果。一般情况下，会知道最后用户需要的结果的精确度。对于那些中间计算过程中出现的数字，你需要增加一位数字来提高精确度。

比如 0.0144 + 0.0143 最后保留两位小数的话，在结果舍入会得到 0.03，而如果将两个数字加法之前就舍入，那么会得到 0.02.

如果最后的结果是乘法得到，那么你应当保留尽可能多的精度。而 `Ratios` 比率 和 Unit costs 单位价格，不应当舍入。而应当在做完所有计算之后在对结果进行舍入。

## reference

- <http://www.opentaps.org/docs/index.php/How_to_Use_Java_BigDecimal:_A_Tutorial>

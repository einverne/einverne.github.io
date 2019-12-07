---
layout: post
title: "Java 查漏补缺一些小问题"
tagline: ""
description: ""
category: Java
tags: [java, programming, long, double, ]
last_updated:
---

## 判断奇数

正确做法：

	public static boolean isOdd(int i) {
		return (i & 1) != 0;
	}

不能 `i % 2 == 1`，当 i 为负数时，求余数结果为 -1

## double 精度问题
浮点运算只提供近似计算，不能产生精确结果，二进制浮点不能用于货币计算。

    2.00 - 1.10

并不是精确等于 0.90 而可能是 0.8999999

解决方法一，使用整数类型，以货币单位分计算，保证整数类型足够大可以覆盖所有计算范围。

方式二，使用 BigDecimal，精确计算小数，另外一定要用

    BigDecimal(String)

String 构造器，而不要用 `BigDecimal(double)` 构造函数。

## 长整数
一天的微秒除以一天的毫秒数，理论结果应该是 1000，但实际是 5.

    public class LongDivision{
        public static void main(String args[]){
            final long MICROS_PER_DAY = 24 * 60 * 60 * 1000 * 1000;
            final long MILLIS_PER_DAY = 24 * 60 * 60 * 1000;
            System.out.println(MICROS_PER_DAY/MILLIS_PER_DAY);
        }
    }

long 类型可以保存这两个乘积，没有溢出。但问题在于 MICROS_PER_DAY 计算以 int 来执行的，只有运算完成才会提升到 long，而此时计算已经溢出。

乘数因子为 int 时，相乘得到另一个 int。存储结果的变量的类型会影响到计算所使用的类型。

当你在操作很大的数字时，千万要提防溢出。



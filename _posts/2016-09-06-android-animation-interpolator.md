---
layout: post
title: "Android Animation Interpolator"
tagline: ""
description: ""
category: Android
tags: [Android, AndroidDev, ]
last_updated: 
---

动画插值器，用来描述动画的变化率，这里讨论的 Interpolator 指的是 `android.animation` 包下的 `TimeInterpolator`。 以下所有的插值器都继承自 Interpolator ， 而 Interpolator 接口直接继承自 TimeInterpolator ， 自身并没有添加任何方法。

TimeInterpolator 中有

`abstract float getInterpolation(float input)` 方法，参数 input:input 参数是一个 float 类型，它取值范围是 0 到 1，表示当前动画的进度，取 0 时表示动画刚开始，取 1 时表示动画结束，取 0.5 时表示动画中间的位置。返回值：表示当前实际想要显示的进度。取值可以超过 1 也可以小于 0，超过 1 表示已经超过目标值，小于 0 表示小于开始位置。

input 的值只与时间相关，和我们设定没有任何关系。线性插值器函数实现：

```
public float getInterpolation(float input) {  
    return input;  
}  
```


## AccelerateInterpolator

加速插值器，开始很慢，不断加速

```
public AccelerateInterpolator(float factor)
```

将factor设置为1.0f会产生一条y=x^2的抛物线。增加factor到1.0f之后为加大这种渐入效果（也就是说它开头更加慢，结尾更加快）

当fractor不为1时，轨迹曲线是 `y=x^(2*fractor)(0<x<=1)` 的曲线


## DecelerateInterpolator

减速插值器，开始比较快然后减速的插值器，动画的快慢度。将factor值设置为1.0f时将产生一条从上向下的y=x^2抛物线。增加factor到1.0f以上将使渐入的效果增强（也就是说，开头更快，结尾更慢）

## AccelerateDecelerateInterpolator

加速减速插值器，开始慢从中间后开始变快


## LinearInterpolator

线性插值器


## BounceInterpolator

弹跳插值器


## AnticipateInterpolator

回荡秋千插值器


## AnticipateOvershootInterpolator



## CycleInterpolator

正弦周期变化插值器


## OvershootInterpolator




## reference

- <http://my.oschina.net/banxi/blog/135633>
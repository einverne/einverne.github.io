---
layout: post
title: "Android ImageView ScaleType"
tagline: ""
description: "描述 Android ImageView ScaleType 使用"
category: Android
tags: [Android, AndroidDev, ]
last_updated: 
---

ImageView 的 ScaleType 属性决定了图片在 View 上显示时的样子，是比例缩放，还是显示图片的整体或者局部等等。对于一张图片，有其自身的大小，而 ImageView 也有其自身的大小，这两者如何完美的合作其结果很重要的设置便是 ScaleType 属性。

设置该属性的方式有两种：

1. 在布局 Layout 中 ImageView 中定义 `android:scaleType="center"`
2. 在代码中调用 `imageView.setScaleType(ImageView.ScaleType.CENTER);`

## 8 种 ScaleType

所有的 Scale 方式有 8 种，[文档](https://developer.android.com/reference/android/widget/ImageView.ScaleType.html) 中可以查看到，下文也会详细介绍。


### ImageView.ScaleType.CENTER

按图片原大小居中显示，不缩放原图片。当原始图片长/宽超过View的长/宽，则截取图片的居中部分显示，当图片长/宽小于 View 长宽时，可能造成填充不完全， ImageView 周围有空白的情况。

在 xml 中使用定义： `android:scaleType="center"`

### ImageView.ScaleType.CENTER_CROP

按比例扩大图片的size居中显示，不改变图片宽高比，使得图片长(宽)等于或大于View的长(宽)，图片填充满 ImageView，可能产生裁剪，此时能保证 View 被完整填充。也就意味着这种裁剪方式会使 ImageView 被完整填充，对于高大于宽的图片，高部分就会被裁剪。

在 xml 中使用定义： `android:scaleType="centerCrop"`

### ImageView.ScaleType.CENTER_INSIDE

将图片的内容完整居中显示，通过按比例缩小或原来的size使得图片长/宽小于或等于View的长/宽，ImageView 可能产生空白部分。对于高度大于宽度图片，则高度填充整个 ImageView 高度，宽度则小于 ImageView 宽度，则宽度两边产生空白。

在 xml 中使用定义： `android:scaleType="centerInside"`

### ImageView.ScaleType.FIT_CENTER

把图片按比例扩大/缩小到 ImageView 的高度或者宽度，使用 CENTER 方式居中显示，也就是使用该方式，使用图片长的一部分适应。

`FIT_START`, `FIT_END` 在图片缩放效果上与 `FIT_CENTER` 一样，只是显示位置不同，`FIT_START` 是置于顶部，`FIT_CENTER` 居中，`FIT_END` 置于底部。

在 xml 中使用定义： `android:scaleType="fitCenter"` 、 `android:scaleType="fitEnd"` 、 `android:scaleType="fitStart"`

### ImageView.ScaleType.FIT_XY
不按比例缩放图片，把图片塞满整个 View ，如果 View 与 原图片长宽不对应，可能造成图片长宽比改变，以及图片变形。

在 xml 中使用定义： `android:scaleType="fitXY"`

### ImageView.ScaleType.MATRIX
通过变化矩阵来设置 ImageView 大小。可以通过设置 matrix 然后手动利用 matrix 来调整 ImageView 可以实现 ImageView 的双指缩放和旋转。不过似乎用的很少。

具体细节可以继续再讨论。

如果要看效果图，[这里](http://etcodehome.blogspot.hk/2011/05/android-imageview-scaletype-samples.html) 很不错，一目了然。

在 xml 中使用定义： `android:scaleType="matrix"`

## 其他问题

### ImageView src 与 background 属性区别

每一种 View 都可以包含背景图片，而 ImageView 的 src 可以设置 ScaleType ，adjustViewBounds 等属性。

### 保证 ImageView 长宽比
center, center\_crop, center\_inside, fit\_center, fit\_start, fit\_end 等方式都会改变图片的比例，但是会有一定程度的裁剪。

### 保持图片比例填满宽度

使用如下 Layout

    <ImageView
        android:id="@id/img"
        android:layout_width="fill_parent"
        android:layout_height="wrap_content"
        android:adjustViewBounds="true"
        android:scaleType="fitCenter" />

使用 `fitCenter` 来使图片填充整个 ImageView 宽度，并且进行等比例放缩。

答案来自 [StackOverflow](http://stackoverflow.com/a/25069883/1820217)

## reference

- <http://stackoverflow.com/questions/5454491/what-is-the-difference-between-src-and-background-of-imageview>
- <https://guides.codepath.com/android/Working-with-the-ImageView>
- <http://etcodehome.blogspot.hk/2011/05/android-imageview-scaletype-samples.html>
- <http://blog.csdn.net/larryl2003/article/details/6919513>
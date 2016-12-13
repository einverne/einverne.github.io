---
layout: post
title: "snapseed 中的一些参数"
tagline: ""
description: ""
category: 经验总结
tags: [ Snapseed, PhotoEditing, Anroid, VSCO, ]
last_updated: 
---

照片编辑一些参数，了解一个 App 就能知道所有图像处理类 App 原理，比如 VSCO，泼辣修图，大到 Photoshop 等等。

## Tools
Snapseed 中的常用调整工具

### Tune Image
调整图像最常见的操作基本都能在这个 section 中找到。比如亮度、对比度、饱和度等等，细节部分可以单独调整暗部，或者亮部，还有图片整体色调。

#### Brightness
亮度，很容易理解的概念

#### Contrast
对比度，黑色像素和白色像素的对比度。利用S曲线的功能也能够实现，不过直接调节Contrast参数倒是来的更加直接。

#### Saturation
饱和度，色彩的饱和程度。往右为图像色彩变浓重，左反之。也称为色度色彩的三属性之一，广义讲，黑白灰的 色度=0 。

#### Ambiance
Ambiance 直译是 环境，气氛的意思，这边应该是调整环境的色彩。

#### Shadows
暗部，调整暗部，单独针对暗部调整往右为暗部更亮，往左为暗部更黑。

#### Highlights
高光，调整高光部分，更亮或者高光部分调整暗。

#### Warmth
色调，调整图片的色调，暖色或者是冷色，往右为暖色，往左为冷色。

### Details
图片细节部分调整，基本上是图片锐度的调整。

#### Structure
图片纹理会变得清晰

#### Sharpening
色彩更加锐利。

### Crop
裁剪比例，其实最喜欢的还是 1：1

Available crop aspect ratios:

Free - the aspect ratio can be set freely, without constraint

Original - the aspect ratio will be set based on the original image

1:1 - to create a square image

DIN - to set the aspect ratio according to European page aspect ratios (such as A4, A3, A2, etc.)

3:2 - to set the aspect ratio to what is typically found on D-SLRs

4:3 - to set the aspect ratio to what is typically found on DSCs

5:4 - to set the aspect ratio to what is found on many typical US page sizes (8×10, 16×20, etc.)

7:5 - to set the aspect ratio for 5×7 prints

16:9 - to set the aspect ratio to the aspect ratio of most HDTVs

其中值得一提的就是 DIN ，貌似是欧洲标准的 A4 纸张比例。

### Rotate
这个比较好理解,就是旋转照片

### Transform
变形，这是一个很棒的功能， VSCO Android 版有这个功能时间也不长，利用空间的变形可以将原本侧面拍摄导致的图片变形给纠正回来。

- VerticalPerspective 垂直方向变形
- Horizontal Perspective 水平方向变形
- Rotation 旋转

### Brush
笔刷

#### Dodge & Burn
完全不知道怎么翻译，感觉涂抹会产生红色像素

#### Exposure
调整曝光的画笔

#### Temperature
色温画笔

#### Saturation
饱和度画笔

### Selective
选择点,单独对某个局部进行调整. 可以增加选择点,每个选择点可以使用单击,进行"剪切","复制","删除"和"撤销该选择点所有操作".

而每个选择点则有"B": Brightness, "S":Saturation, "C":Contrast . 这样三个可选操作.

而双指则可以选择该点影响的范围.

长按拖动则可以移动选择点.

### Healing
修复,好像 PS 中的修复图章,只是这边只要轻轻一涂抹, Snapseed 将自动修复涂抹的区域.

### Vignette
直译的话, Vignette 是装饰图案,小图案之类的意思. 而这边应该是指针对图片增加暗角,或者调高角落亮度的操作. 这里面又分为 "Outer Brightness", 和 "Inner Brightness" 两种操作. 分别对应着暗角，和亮角。

## Filters
一些滤镜，和工具不同的是，下面的内容都是在原有图片的基础上增加内容，而不是针对原始图片进行修改。

### Lens Blur
这个词我也不知道怎么描述，似乎一直都是以英文描述。用官方的说法，就是增加镜头虚化效果，让注意力都集中到核心物体上。这个工具中又分成线性“linear”和椭圆”elliptical“两种模糊工具。

利用里面另外一个功能也可以定义虚化的图形，不单纯可以是圆形。

#### Blur Strength
模糊程度，更加模糊。向右滑动增加模糊的程度

#### Transition
增加周围虚化和中心物体的距离，让过度更加自然。

#### Vignette Strength
暗角强度，类似工具中的暗角工具。

### Glamour Glow
光晕效果，直译过来就是”富有魅力的光晕“。其中每一种滤镜又可以单独调整。

#### Glow
光晕效果

#### Saturation
光晕效果色彩饱和度

#### Warmth
光晕效果色调冷暖。

### Tonal Contrast
对比度

#### High Tones
增加高光部分对比度

#### Mid Tones
增加中间色对比

#### Low Tones
增加暗部色彩对比

#### Protect Shadows
防止暗部因为对比度的增加而损失细节

#### Protect Highlights
防止高光部分因为对比度增加而损失细节。

### HDR Scape
High Dynamic Range 高动态范围成像

- **Filter Strength** 滤镜的效果
- **Brightness** 亮度
- **Saturation** 饱和度

### Drama
戏剧风格

- **Filter Strength** 滤镜的效果
- **Saturation** 饱和度

### Grunge
色彩和纹理， 平行的线图标为纹理，交叉箭头为随机纹理与色彩。

- **Style** 选择1500种不同的纹理
- **Brightness** 亮度
- **Contrast** 对比度
- **Texture Strength**  纹理强度，0表示没有强度，等于没有增加纹理
- **Saturation** 饱和度

### Grainy Film
木纹理

- **Grain** 自然的颗粒感
- **Style Strength** 风格强度

### Vintage
带来50，60,70年代的胶片感觉。

- **Brightness** 亮度
- **Saturation** 饱和度
- **Style Strength** 风格强度

#### Vignette Strength
暗角的强度

### Retrolux
创造复古，怀旧，有历史痕迹的胶片感觉

- **Brightness** 亮度
- **Saturation** 饱和度
- **Contrast** 对比度
- **Style Strength** 风格强度
- **Scrathches** 划痕，value为0依然有效果
- **Light Leaks** 漏光，alue为0依然有效果

### Noir

> Create moody, cinematic black and white images with darkroom-inspired toning and wash effects.
对胶片工业不是很了解，很不好翻译啊，总之就是模拟胶片在暗室中冲洗的效果。

- **Brightness** 亮度
- **Wash** 模拟darkroom 中over-processing
- **Grain** 颗粒感，0为没有颗粒感
- **Filter Strength** 滤镜强度

### Black & White
黑白效果

- **Brightness** 亮度
- **Contrast** 对比度
- **Grain** 颗粒感，0为没有颗粒感

### Frames
调整设置不同边框，滑动调整边框的宽度。边框被应用之后就不能再对图片大小进行调整，所以调整图片大小之后添加边框。

## 其他可能用到的参数

### HSL
HSL是色相、饱和度、明度的简称：

- 色相是一种颜色区分于另外一种颜色的首要标准，例如红色与黄色。
- 饱和度是衡量一种颜色鲜艳程度的标准。
- 明度是衡量一种颜色明亮程度的标准。

曲线:

提亮 & 压暗曲线：提升或降低画面亮度。

左侧曲线可以调整图像中暗色区域,右侧则是高光部分

亮的地方更加亮,暗的地方更加暗一些,提高对比度. S曲线.

## Reference

- <https://support.google.com/snapseed/answer/6183571?hl=en&ref_topic=6155507>
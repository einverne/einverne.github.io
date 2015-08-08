---
layout: post
title: Visual Assist And Eclipse使用doxygen注释
description: Visual Assist And Eclipse使用doxygen注释
category: 经验总结
tags: [doxygen, Visual Studio, Eclipse,]
---

##修改Visual Assist中的方法注释样式 

Visual Assist生成的方法注释又长又丑有木有？那就简单修改一下吧~ 
- 如下面的两张图所示，打开在Visual Assist的选项卡，按图中标示顺序打开Refactor Document Method脚本，就可以按照自己喜欢的风格修改了~不同版本的Visual Assist中设置的路径可能不一样，总之都在Suggestions选项卡下。
- 可用的宏可以点左上角最后一个图标查看，意思看名字就能推断出来了~
- 是不是还想来个快捷键什么的，在想要注释的函数定义上方敲 /\*\* 回车就行

![visual assist 1][1]

![visual assist 2][2]

###Eclipse中使用doxygen注释C++方法 
修改一下选项就可以了~然后在要注释的方法的上一行输入 /\*\* 按回车即可.
![enter image description here][3]

参考: [http://cherishlc.iteye.com/blog/1777034](http://cherishlc.iteye.com/blog/1777034)

  [1]: https://lh3.googleusercontent.com/-LJ5uQwpIMnA/U1oSI36ouWI/AAAAAAAAccc/2UoMMfacat0/w640-h599-no/visual_assist_1.png
  [2]: https://lh6.googleusercontent.com/-M-oSl_i_UQY/U1oSJAbNMsI/AAAAAAAAcck/nW7-FTSYo2M/w640-h418-no/visual_assist_2.png
  [3]: https://lh3.googleusercontent.com/-a8edCyG3FJU/U1oSJpXkPOI/AAAAAAAAcco/uIrk5Vc6fI8/w640-h618-no/visual_assist_3.png

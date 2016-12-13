---
layout: post
title: "Blogger 主题中Widget使用"
tagline: ""
description: ""
category: 经验总结
tags: [Google, Blogger , Knowledge]
last_updated: 2016-10-03
---

Blogger 的主题和插件有自带的一套语法，下面就是 Blogger 主题中关于 Widget 的使用说明。

## Widget Tags for Layouts

<b:widget> 标签是用来创建最基本的widget的,描述在 [Page Element Tags for Layouts](http://help.blogger.com/bin/answer.py?answer=46888) 中.而这篇是描述在widget标签中具体可以设置哪些东西的,例如你可以在widget中放置什么.

第一件事就是放置一个闭合的标签,像这样:

`<b:widget [...attributes...] />`

展开之后是这样的:

`<b:widget [...attributes...]>
</b:widget>`

接下来谈论一下可以在widget中放置什么

### Includes
Widget的内容包含在"includable" section中,像这样:

    <b:includable id='main' var='thiswidget'>
        [insert whatever content you want here]
    </b:includable>

includable的属性有:

* **id**:(必须)唯一标识符,由字母和数字组成
* **var**:(可选)标识符,由字母数字组成,用来引用section中的data.(具体请见下面说的data section)

每一个widget必须有一个具有`id='main'`的 includable 。通常这个widget的大部分内容都包含在这个includable中.

如果你有很多具有不同id属性的includable,他们不会自动的显示出来.但是如果你有一个includable带有`id='new'`的属性,那么在`main includable`中通过`<b:include name='new' />`就能够引用,并显示出来.

`b:include`标签的属性如下:

* **name**:(必须)标识符由字母和和数字组成,它必须是在同一个widget中已经存在的`b:includable`的id
* **data**:(可选)An expression or peice of data to pass on to the includable section. This will become the value of the var attribute in the includable.

简单例子同来讲解`b:includable`和`b:include`的用法.Loops和data会在后面讲述,这里主要要理解'main' section是如何包含 'post' section的.main包含了一个includable,传递了一个data叫做'i',included section引用做'p',使用p访问title.

    <b:includable id='main'>
       <b:loop var='i' values='posts'>
          <b:include name='post' data='i'/>
       </b:loop>
    </b:includable>
    
    <b:includable id='post' var='p'>
       Title: <data:p.title/>
    </b:includable>

下面这段的意思就是说如果你想重复使用代码,可以将代码放到includable中,然后用include引用.就不翻译了.
Includes are most useful if you have a section of code that you want to repeat multiple times in different places. You can just write the code once, put it inside a b:includable, then use b:include wherever you want it to appear. If you don't need to do that, then you can just stick with the single main includable and not worry about the rest. (Note that the main includable is included automically -- <b:include name='main'/> is unnecessary.)

### Data
data:标签大概是最为重要的一个标签了,因为它是获取一切事实数据的途径,一些例子如下:

    <data:title/>

or

    <data:photo.url/>

这个例子非常简单,他能够在几乎所有的widget中起作用,因为大多数widget有title.上面的例子就是打印出widget的title.第二个例子是一个较为复杂的变量,获取photo的url.

有很多data你能够通过data:标签来获取,查阅 [comprehensive list](http://help.blogger.com/bin/answer.py?answer=47270) 查询需要的data,一些data只能在特定的widget中使用.

### Loops
b:loop 标签让你重复使用section中内容.通常用在打印给定的一系列post,或者每一条留言,或者每一个label,等等.通常用法,像这样:

    <b:loop var='identifier' values='set-of-data'>
       [repeated content goes here]
    </b:loop>

* `identifier` 可以选用任何名字,用来代表list中每一个item.可以简单的设定为"i". 
* `set-of-data` 可以是在 [data tags article](http://help.blogger.com/bin/answer.py?answer=47270)中定义的任何一系列data

例如,在blog post widget中, posts是一个list,下面的代码是遍历每一个post,打印出每一个的标题title

    <b:loop var='i' values='data:posts'>
       <h2><data:i.title/></h2>
    </b:loop>

注意,"i"是每一个post,在循环中使用i获取每一个post的title

### if / Else
if/else像很多编程语言一样,条件判断,这里是选择哪些显示和哪些不显示.通常如下:

    <b:if cond='condition'> 
       [content to display if condition is true]
    <b:else/>
       [content to display if condition is false]
    </b:if>

`b:else` tag是可省略的. 而`</b:if>`是不可省略的. 如果没有else子句,那么只有满足if条件才会执行if子句中代码,不然什么都不执行

条件语句中你可以放置任何结果是true或者false的语句,有一些data本身就表示true/false,像post中`allowComments`.其他data,你可以用来比较得到结果.一些例子:

    <b:if cond='data:post.showBacklinks'> True if the current post is set to show backlinks.
    <b:if cond='data:blog.pageType == "item"'> True if the current page is an item page (post page).
    <b:if cond='data:displayname != "Fred"'> True if this is not Fred's display name.
    <b:if cond='data:post.numComments > 1'> True if the current post has more than one comment.

翻译自:[Blogger Help Widget Tags for Layouts](https://support.google.com/blogger/answer/46995)
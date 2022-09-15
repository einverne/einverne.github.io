---
layout: post
title: "使用 javadoc 自动生成 Java 文档"
tagline: ""
description: ""
category: 经验总结
tags: [javadoc, java, document, ]
last_updated:
---

Java 的注释，单行，多行的语法就不在赘述了。

## javadoc tags
给 Java 源码文件书写注释，使用常见的 Java 注释可以实现一些，也可以通过如下的 Javadoc 的 Tags 来实现一些特殊的比如跳转，参数返回值等特殊标记。

javadoc 标记有如下一些：

- @author 作者名，一般不推荐使用，git blame 基本上能够找到每一行代码的作者
- @version 版本号
- @see 跳转到相关类或者主题
- @param 对方法中某参数的说明
- @return 对方法返回值的说明
- @exception 对方法可能抛出的异常进行说明

不过已经不建议在 Java 源文件中使用 `@author` 标记，现代的 git 完全能够满足模块作者的追溯，甚至可以精确到每一行的作者。

### see vs link
`@see` 允许用户引用其他类的文档

- `@see classname`
- `@see fully-qualified-classname`
- `@see fully-qualified-classname#method`

see 也可以使用一个超链接

```
/**
 * @see <a href="https://docs.oracle.com/en/java/">Java Dcoumentation</a>
 */
```

`@link` 是 `inline` tag

### Package doc
上面的方法可以给类，方法，参数等等编写注释，如果要给一个包添加注释，就需要额外添加 `package-info.java` 的文件。

从 Java 1.5 版本开始可以在包下新建一个名为 `package-info.java` 的文件，在这个文件中可以使用标准 Java 注释来给 package 书写文档：

	com/foo/package-info.java:

	/**
	 * com.foo is a group of bar utils for operating on foo things.
	 */
	package com.foo;

	//rest of the file is empty


## 注释中的代码
如果要在 javadoc 中书写代码，尤其是想要展示一些例子的时候，不可避免的会用到 `<`, `>` 以及 `@` 等等特殊的符号。Javadoc 默认是 html 的 tag 来渲染格式，所以这种情况下有 `<pre>` 和 `<code>` 选择，然后 javadoc 还提供了 `{@code}` 语法。这三个方式都可以用来注释代码，但各自又不相同。

### 使用 pre 标签
`<pre>` 标记是 html 默认的格式化标签，如果使用 `<pre>` 标签，那么所有的 html 的标记都需要转义。

	/**
	 * <pre>
	 * public class JavadocTest {
	 *   // indentation and line breaks are kept
	 *
	 *   &#64;SuppressWarnings
	 *   public List&#60;String&#62; generics(){
	 *     // '@', '<' and '>'  have to be escaped with HTML codes
	 *     // when used in annotations or generics
	 *   }
	 * }
	 * </pre>
	 */
	public class PreTest {}

## 命令行的使用
Java 安装完成之后在 Java Path 的目录中自带了 javadoc 这个命令行，如果不想使用 maven-javadoc-plugin 可以使用这个命令来生成 javadoc.

用法：

　　javadoc [options] [packagenames] [sourcefiles]

选项：

- -public 仅显示 public 类和成员
- -protected 显示 protected/public 类和成员 （缺省）
- -package 显示 package/protected/public 类和成员
- -private 显示所有类和成员
- -d <directory> 输出文件的目标目录
- -version 包含 @version 段
- -author 包含 @author 段
- -splitindex 将索引分为每个字母对应一个文件
- -windowtitle <text> 文档的浏览器窗口标题


## 在 Intellij 中调整文件头
Intellij 默认会在创建文件的时候给文件添加一些注释，这些注释可以在如下的设置中修改：

	File -> Setting -> Editor-> File and Code Template-> File Header



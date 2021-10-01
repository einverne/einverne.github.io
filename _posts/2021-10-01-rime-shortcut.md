---
layout: post
title: "Rime 输入法中的快捷键"
aliases: 
- "Rime 输入法中的快捷键"
tagline: ""
description: ""
category: 经验总结
tags: [ rime, shortcut, keybinding, ]
last_updated:
---


今天在整理 [Rime 插件使用](/post/2021/09/rime-plugin-lua-octagram.html)的时候，想起来整理一下 Rime 输入法的快捷键。

在之前整理 [Rime 基础配置](/post/2014/11/rime.html) 的时候稍微带到一下。


通过配合这些快捷键可以在输入很长一段句子的时候提升体验。

- `ctrl+grave` (grave) tab 键上面，1 左边的那个键用来切换 Rime 输入方案
- `shift+delete` 删除选中的候选词，一般用来调整不希望在候选词前的词
- `ctrl+ n/p` 上下翻页选择候选词
- `Ctrl+b/f` 类似于左箭头，右箭头，可以快速调整输入，在输入很长一段后调整之前的输入时非常有效
- `Ctrl+a/e` 贯标快速跳转到句首或者句末
- `Ctrl+d` 删除光标后内容
- `Ctrl+h` 回退，删除光标前内容
- `Ctrl+g` 清空输入
- `Ctrl+k` 删词，等效于 Shift + delete（macOS 上可以使用 ⌘+k）
- `-/+` 或者 `tab` 来翻页

更多的快捷键可以在 `default.yaml` 配置中看到。

```
key_binder:
  bindings:
    - {accept: "Control+p", send: Up, when: composing}
    - {accept: "Control+n", send: Down, when: composing}
    - {accept: "Control+b", send: Left, when: composing}
    - {accept: "Control+f", send: Right, when: composing}
    - {accept: "Control+a", send: Home, when: composing}
    - {accept: "Control+e", send: End, when: composing}
    - {accept: "Control+d", send: Delete, when: composing}
    - {accept: "Control+k", send: "Shift+Delete", when: composing}
    - {accept: "Control+h", send: BackSpace, when: composing}
    - {accept: "Control+g", send: Escape, when: composing}
    - {accept: "Control+bracketleft", send: Escape, when: composing}
    - {accept: "Alt+v", send: Page_Up, when: composing}
    - {accept: "Control+v", send: Page_Down, when: composing}
    - {accept: ISO_Left_Tab, send: Page_Up, when: composing}
    - {accept: "Shift+Tab", send: Page_Up, when: composing}
    - {accept: Tab, send: Page_Down, when: composing}
    - {accept: minus, send: Page_Up, when: has_menu}
    - {accept: equal, send: Page_Down, when: has_menu}
    - {accept: comma, send: Page_Up, when: paging}
    - {accept: period, send: Page_Down, when: has_menu}
    - {accept: "Control+Shift+1", select: .next, when: always}
    - {accept: "Control+Shift+2", toggle: ascii_mode, when: always}
    - {accept: "Control+Shift+3", toggle: full_shape, when: always}
    - {accept: "Control+Shift+4", toggle: simplification, when: always}
    - {accept: "Control+Shift+5", toggle: extended_charset, when: always}
    - {accept: "Control+Shift+exclam", select: .next, when: always}
    - {accept: "Control+Shift+at", toggle: ascii_mode, when: always}
    - {accept: "Control+Shift+numbersign", toggle: full_shape, when: always}
    - {accept: "Control+Shift+dollar", toggle: simplification, when: always}
    - {accept: "Control+Shift+percent", toggle: extended_charset, when: always}
    - {accept: "Shift+space", toggle: full_shape, when: always}
    - {accept: "Control+period", toggle: ascii_punct, when: always}
```


## 自定义快捷键
在上面的配置中可以看到 Rime 默认就定义了非常多的快捷键绑定，并且这些快捷键都可以通过配置改变。

这里做一个例子，比如平时用 Vim 较多，想要更换成更加舒服的 Vim 绑定，可以在 Rime 配置根目录中 `vi default.custom.yaml` 中配置：

```yaml
# default.custom.yaml
patch:
	# 其他配置...
	key_binder:
		bindings:
      	- { when: has_menu, accept: "Control+k", send: Page_Up }
      	- { when: has_menu, accept: "Control+j", send: Page_Down }
      	- { when: has_menu, accept: "Control+h", send: Left }
      	- { when: has_menu, accept: "Control+l", send: Right }
```

这样就可以使用 Ctrl+j/k 来上下翻页，而使用 Ctrl+h/l 来左右切换候选词。不过我个人还是还是习惯默认设置的快捷键。

## 配置说明
在上面的例子中可以看到 bindings 配置中有三个配置选项。每一条 `binding` 下面可以包含：

- accept，实际接受的按键
- send，输出效果
- toggle，切换开关
- when，作用范围

toggle 的候选项有：

```
ascii_mode
ascii_punct
full_shape 全角字符
simplification 繁简
extended_charset
```

when 可以接受的选项有：

```
paging	翻页
has_menu	操作候选项用
composing	操作输入码用
always	全域
```

accept 和 send 可用字段除A-Za-z0-9外，还可以包含键盘上实际的所有按键：

```
BackSpace	退格
Tab	水平定位符
Linefeed	换行
Clear	清除
Return	回車
Pause	暫停
Sys_Req	印屏
Escape	退出
Delete	刪除
Home	原位
Left	左箭頭
Up	上箭頭
Right	右箭頭
Down	下箭頭
Prior、Page_Up	上翻
Next、Page_Down	下翻
End	末位
Begin	始位
Shift_L	左Shift
Shift_R	右Shift
Control_L	左Ctrl
Control_R	右Ctrl
Meta_L	左Meta
Meta_R	右Meta
Alt_L	左Alt
Alt_R	右Alt
Super_L	左Super
Super_R	右Super
Hyper_L	左Hyper
Hyper_R	右Hyper
Caps_Lock	大寫鎖
Shift_Lock	上檔鎖
Scroll_Lock	滾動鎖
Num_Lock	小鍵板鎖
Select	選定
Print	列印
Execute	執行
Insert	插入
Undo	還原
Redo	重做
Menu	菜單
Find	蒐尋
Cancel	取消
Help	幫助
Break	中斷
space
exclam	!
quotedbl	"
numbersign	#
dollar	$
percent	%
ampersand	&
apostrophe	'
parenleft	(
parenright	)
asterisk	*
plus	+
comma	,
minus	-
period	.
slash	/
colon	:
semicolon	;
less	<
equal	=
greater	>
question	?
at	@
bracketleft	[
backslash	
bracketright	]
asciicircum	^
underscore	_
grave	`
braceleft	{
bar	|
braceright	}
asciitilde	~
KP_Space	小鍵板空格
KP_Tab	小鍵板水平定位符
KP_Enter	小鍵板回車
KP_Delete	小鍵板刪除
KP_Home	小鍵板原位
KP_Left	小鍵板左箭頭
KP_Up	小鍵板上箭頭
KP_Right	小鍵板右箭頭
KP_Down	小鍵板下箭頭
KP_Prior、KP_Page_Up	小鍵板上翻
KP_Next、KP_Page_Down	小鍵板下翻
KP_End	小鍵板末位
KP_Begin	小鍵板始位
KP_Insert	小鍵板插入
KP_Equal	小鍵板等於
KP_Multiply	小鍵板乘號
KP_Add	小鍵板加號
KP_Subtract	小鍵板減號
KP_Divide	小鍵板除號
KP_Decimal	小鍵板小數點
KP_0	小鍵板0
KP_1	小鍵板1
KP_2	小鍵板2
KP_3	小鍵板3
KP_4	小鍵板4
KP_5	小鍵板5
KP_6	小鍵板6
KP_7	小鍵板7
KP_8	小鍵板8
KP_9	小鍵板9
```

通过上面的组合就可以实现非常多自定义的功能，比如有人喜欢将 `;` 绑定到第二个候选词：

    { when: has_menu, accept: ";", send: 2 }

这样当候选词出现在第二位时，直接按下 `;` 就可以输入。


## reference

- [Rime 输入法配置](https://github.com/LEOYoon-Tsaw/Rime_collections/blob/master/Rime_description.md#%E4%B8%83%E5%85%B6%E5%AE%83)
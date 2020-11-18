---
layout: post
title: "使用 Goku 配置 Karabiner"
tagline: ""
description: ""
category:
tags: [karabiner, mac, goku, edn, config]
last_updated:
---

[Karabiner](https://pqrs.org/osx/karabiner/) 是 MacOS 上一款强大的自定义键盘的软件，可以非常自由的定义任何键位。

之前看文章是将 Caps Lock 作为一个 Hyper key，但看过 [@nikitavoloboev](https://medium.com/@nikitavoloboev/karabiner-god-mode-7407a5ddc8f6) 的文章之后，发现利用 Karabiner 和 [Goku](https://github.com/yqrashawn/GokuRakuJoudo) 定义的 DSL 配置语言可以更加充分的发挥 Karabiner 的功能。

Karabiner Elements 使用 [JSON](https://pqrs.org/osx/karabiner/json.html) 作为配置规则的格式。使用 JSON 作为 Karabiner 配置格式的问题在于，这种格式非常庞大，在生成之后几乎很难徒手去做修改，对于复杂的配置可能长达几万行。

## 前提知识

### Sticky keys
Sticky Keys 叫做粘滞键，是方便无法同时按下 Ctrl C 这样组合按键的用户，启用粘滞键后按下任何 modifier 按键后，这个 modifier 按键会持续激活直到按下一个非 modifier 按键。

### Modifier key
常见的 modifier 按键有 Ctr, Command, Shift, Alt, Option，Fn, Caps Lock 等等。

> A keyboard feature that enables you to press a modifier key (CTRL, ALT, or SHIFT), or the Windows logo key, and have it remain active until a non-modifier key is pressed. This is useful for people who have difficulty pressing two keys simultaneously.

其他可作为 modifier key 的按键有：

- `\`
- `,`
- `.`
- `space`
- `Tab`

## EDN
EDN 全称是 「extensible data notation」，下面是一个最基本的 EDN：

```
{:main [
  {:des "hello world"
   ; comments use semicolons
       :rules [
      [:a :b] ; map a key to b key
   ]}
]}
```

不用担心这里看不明白，后面会继续展开。

## 什么是 Karabiner
Karabiner 是一个 MacOS 上的键盘自定义工具。

## 定义第一个 Hyper key

准备工作：

- 下载 [Karabiner Elements](https://pqrs.org/osx/karabiner/)
- 安装 Goku (Karabiner DSL) `brew install yqrashawn/goku/goku`
- 执行 `goku` 服务，让修改立即生效 `brew services start goku`
- 打开 Karabiner
- 然后在 `~/.config/` 目录下创建 `karabiner.edn` 文件，可以参考[我的](https://github.com/einverne/dotfiles/tree/master/karabiner)
- 然后可以参考[教程](https://github.com/yqrashawn/GokuRakuJoudo/blob/master/tutorial.md) 开始自己的配置编写啦

Goku 会通过 EDN 文件生成 `karabiner.json`，编写好 edn 文件后可以执行 goku 来生成 JSON 配置。

## 基本使用
整个 EDN 配置大体可以分成几个部分：

- 定义主要的 profile 及基本信息
- 预置的条件
- main 部分为主要的键映射配置

接下来就一步步看一下最简单的配置。

从最主要的 main 部分配置来看。

```
{:main[ {:des "..." :rules [[<from> <to> <condition>]]}
        {:des "..." :rules [[<from> <to>]
                            [<from> <to>]]} ]}
```

- 花括号内整个内容表示一个规则
- `:des` 部分用来注释
- `:rules` 中是真正的规则
- 规则又分成 `from`, `to`, `condition`，其中 `condition` 部分是可选的。

### 预置条件

#### 定义应用
比如定义应用程序，可以使用 bundle ID，如何查找这个 Bundle ID，可以利用 Karabiner 自带一个 EventViewer 工具，可以很方便地查看应用的 Bundle ID，或者右键『应用.app』-> 显示包内容 Contents/Info.plist -> BundleIdentifier 也可以查看到。

	:applications {:chrome ["^com\\.google\\.Chrome$"]}

#### 定义设备
定义设备，同样设备的 ID 也可以在 EventViewer 中查看：

	:devices {:quickfire [{:vendor_id 1234 :product_id 17}]}

#### 定义输入法
定义输入法：

	 :input-sources {:squirrel {:input_mode_id "com.googlecode.rimeime.inputmethod.Squirrel"
                  :input_source_id "com.googlecode.rimeime.inputmethod.Squirrel.Rime"
                  :language "zh-Hans"}
                 :us {:input_mode_id ""
                      :input_source_id "com.apple.keylayout.US"
                      :language "en"}}

变量条件定义：

```
    [:escape [:escape ["in-alfred" 0]] ["in-alfred" 1]]
;;   |<from>||_________<to>__________| |<conditions> |
```

这一条规则表示的含义是，当变量 `in-alfred` 等于 1 时，tap Escape 按键映射到 Escape 并将 `in-alfred` 变量设置为 0 。

在使用条件的时候可以组合使用，或者使用非语句。

比如，先定义了应用，然后将预先定义的应用到规则中。

```
{:applications {:chrome ["^com\\.google\\.Chrome$"]
                :safari ["^com\\.apple\\.Safari$"]}
 :main [{:des "a to 1 only in chrome" :rules [[:a :1 :chrome]]}
        {:des "a to 1 only in chrome, safari" :rules [[:a :1 [:chrome :safari]]]}
        {:des "a to 1 only outside chrome, safari" :rules [[:a :1 [:!chrome :!safari]]]}]}
```

上面的这三条规则就是表示

- 在 Chrome 中 a 映射到 1
- 在 Chrome，safari 中 a 映射到 1
- 除了在 Chrome 或 safari 中其他应用中 a 映射到 1

或者组合使用：

```
:main [{:des "a to 1 multiple conditions"
        :rules [[:a :1 [:chromes :quickfire :us]]]}]}
```

这条规则就表示在 Chrome 中，使用外置的 quickfire 键盘，并且输入法是 us 时，将 a 键映射到 1。

#### 组合规则
简单规则，一个键映射到另一个按键，一个键映射到多个按键

```
{:main [{:des "a to 1" :rules [[:a :1]]}
        {:des "b to 2" :rules [[:b :2]]}
        {:des "c to insert 123" :rules [[:c [:1 :2 :3]]]}]}
```

多个按键映射到其他按键，比如同时按下 j,l 映射到 F20

```
:rules [[:j :l] :f20]
```

配置也可以将按键映射到 Shell 脚本

```
:rules [{:des "hyper 1 to clean tmp"
                   :rules [[:!!1 ["rm -rf /tmp/*"]]]]}
```

对于常见的修饰键 modifier，Goku 中用简化的配置来表示

```
    ;; !  | means mandatory -   modifier(s) alone when pressend change behavior
    ;; #  | means optional  -   modifiers are optional (but at least one necessary)

    ;; :!Ca is keycode :a and prefix a with !C

    ;; C  | left_command
    ;; T  | left_control
    ;; O  | left_option
    ;; S  | left_shift
    ;; F  | fn
    ;; Q  | right_command
    ;; W  | right_control
    ;; E  | right_option
    ;; R  | right_shift

    ;; ## | optional any
    ;; !! | command + control + optional + shift (hyper)
```

说明：

- 在不设置 `mofifiers` 时，键映射只有在没有 modifier 时才生效，比如定义了一条规则，将 Caps Lock 映射成 Escape，那么只有在单独按下 Caps Lock 的时候才会映射成 Escape，如果组合按键比如 Left Shift+Caps Lock（当然应该没人那么做） 的时候，表现还是 Left Shift+Caps Lock
- 当 modifier 为 `mandatory` 时，只有 modifier 按下时，映射才会触发

#### 定义模板

```
{:templates {:launch "osascript -e 'tell application \"Alfred 3\" to run trigger \"launch %s\" in workflow \"yqrashawn.workflow.launcher\" with argument \"\"'"}
 :main [{:des "launcher mode"
         :rules [[:k [:launch "Emacs"] :launch-mode]
                 [:l [:launch "Chrome"] :launch-mode]
                 [:m [:launch "Mail"] :launch-mode]
                 [:v [:launch "WeChat"] :launch-mode]]}]}
```

#### simlayer

定义 simlayer

```
:simlayers {:vi-mode {:key :d}}
```

上面的规则定义了如果按下了 `d` 按键，则设置变量 `vi-mode` 为 1，表示进入 simlayer vi-mode，`to_if_alone d`， `to_after_key_up` 然后设置变量 `vi-mode` 到 0 。





## 配置样例

### 交换 Left Option 和 Left Command

当我使用外置键盘的时候交换 Option 和 Command 的按键。

首先定义一些设备：

```
 :devices {
    :apple [{:vendor_id 1452 :product_id 832}]
    :quickfire [{:vendor_id 9494 :product_id 17}]
  }
```

特定键盘更改键位，改完之后就可以和内置键盘的键位一样了，不用去熟悉两套键盘了。

可以使用两种不同的方式进行配置：

这里的 `quickfire` 是我的外接键盘。这些信息可以在 Karabiner 提供的 EventViewer 中查看。

然后在 main 部分定义：

```
        {:des "swap cmd <-> option when using specific devices"
         :rules [
                 [:##left_command :left_option [:quickfire]]
                 [:##left_option :left_command [:quickfire]]
                 ] }
```

或者

```
    {:des "CM Storm keyboard setup"
     :rules [:quickfire
                 [:##left_command :left_option]
                 [:##left_option :left_command]
             ]}
```

### Caps lock

```
tap caps lock once -> Escape key
hold caps lock -> hold Ctrl+Shift+Option+Command at same time
```

### Left Shift/Right Shift
在英文的世界中，有一种 Remap，是将

```
left_shift once -> type (
right_shift once -> type )
```

但是在中文的世界里面，我的 Shift 是作为中英文切换按键，非常重要的一个按键。

### O 模式
如果经常在几个常见的应用之间切换，即使用了不错的比如 Context 这样的窗口管理工具，那也会在 Command + Tab 按键中非常频繁的按键。假如有方式可以通过按下键盘上的快捷键就可以直接切换到不同的窗口，是不是可以省去不少的烦恼。

下面是一个模式，通过按住 O，然后快速按下第二个按键就可以实现在常用的应用之间切换。

```
hold o + tap i -> launch "iTerm"
hold o + tap c -> launch "Chrome"
hold o + tap b -> launch "Obsidian"
tap o  -> type "o"
```

记住一定要按住 o 不要松开然后再按 c 就可以快速切换到 Chrome。
一旦熟悉了自己的配置，就会发现再也不需要使用 Cmd + Tab 来切换了。



### 将 Caps Lock 作为 Command+Control+Option+Shift 同时按下的效果

```
        {:des "caps lock -> escape(alone) and caps lock -> hyper"
         :rules [
                 [:##caps_lock :!CTOleft_shift nil {:alone :escape}]
                 ]}
```


### Ctrl+np 作为上下

```
        {:des "Ctrl np -> down up"
         :rules [
                 [:!Tn :down_arrow [:ctrlnp]]
                 [:!Tp :up_arrow [:ctrlnp]]
                 ]}
```


### 禁用 Cmd+H 隐藏

```
        {:des "Disable Cmd+H Hide"
         :rules [
                 [:!Ch nil nil [:kybs]]
                 ]}
```


### 按住 Cmd+q 退出应用

```
        {:des "Cmd + Q held 1 second to quit"
         :rules [
                 [:!Cq nil nil {:held :!Cq }]]}
```



## Cheatsheet

```
    ;; !  | means mandatory -   modifier(s) alone when pressend change behavior
    ;; #  | means optional  -   modifiers are optional (but atleast one necessary)

    ;; :!Ca is keycode :a and prefix a with !C

    ;; C  | left_command
    ;; T  | left_control
    ;; O  | left_option
    ;; S  | left_shift
    ;; F  | fn
    ;; Q  | right_command
    ;; W  | right_control
    ;; E  | right_option
    ;; R  | right_shift

    ;; ## | optional any
    ;; !! | command + control + optional + shift (hyper)

    ;; to understand better how modifiers work in karabiner
    ;; karabiner definition of mandatory and optional
    ;; https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/from/modifiers/


    ;; need to prefix C T O S F with ! or #
    ;;
    ;; code for all this:
    ;; https://github.com/yqrashawn/GokuRakuJoudo/blob/b9b334a187379f9bc8182ad59e2cca2a1789e9c0/src/karabiner_configurator/keys.clj#L68
```


## 更多

- 阅读 [Nikita Voloboev](https://medium.com/@nikitavoloboev/karabiner-god-mode-7407a5ddc8f6) 的博客
- 完整的尝试官方提供的[例子](https://github.com/yqrashawn/GokuRakuJoudo/blob/master/tutorial.md)
- 然后在仔细的读一读上面的例子

## reference


- <https://github.com/yqrashawn/GokuRakuJoudo/blob/master/tutorial.md>
- <https://medium.com/@nikitavoloboev/karabiner-god-mode-7407a5ddc8f6>
- <https://johnlindquist.com/customize-karabiner-with-goku/>
- <https://blog.jkl.gg/hacking-your-keyboard/>
- <https://github.com/yqrashawn/GokuRakuJoudo/blob/master/examples.org>
- [Putting your keyboard on Steroids with Karabiner Elements](https://www.swyx.io/karabiner_lindquist/)

其他配置案例：

- <https://gist.github.com/kaushikgopal/ff7a92bbc887e59699c804b59074a126>
- <https://github.com/kchen0x/k-goku/blob/master/karabiner.edn>

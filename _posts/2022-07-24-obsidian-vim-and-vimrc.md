---
layout: post
title: "Obsidian 中使用 Vim 模式并配置 Vimrc"
aliases:
- "Obsidian 中使用 Vim 模式并配置 Vimrc"
tagline: ""
description: ""
category: 学习笔记
tags: [ obsidian, obsidain-plugin, obsidian-vim, obsidian-vimrc ]
create_time: 2022-07-25 10:19:30
last_updated: 2022-08-02 07:11:57
---

一直在 [[Obsidian]] 中使用 Vim 模式，之前也安装了 [Obsidian Vimrc ](https://github.com/esm7/obsidian-vimrc-support) 的插件，但一直没有好好研究，只简单的配置了几行。最近总想要实现在 Visual Mode 下给选中的内容两边加上 Grave（也被称为 backtick，就是键盘上 1 左边的按键，在 markdown 下通常用来作为 code） ，或者双引号，一直没有找到很好的办法，所以想来研究一下很否通过 Vimrc 来实现。

本文就记录一下在 Obsidian 下使用 Vim 键盘操作，以及在 Obsidian 下配置 Vimrc。

## Prerequisite

- 需要开启 Obsidian 的 Vim 支持
- 安装 [Obsidian Vimrc Support Plugin](https://github.com/esm7/obsidian-vimrc-support)

## 文档内移动

### 基础移动

- `j/k/h/l`
- `gg`  移动光标到首行
- `G` 移动到最后一行
- `w` 移动到下一个 word 第一个字母
- `e` 移动到 word 尾，`ge` 移动到上一个单词 word 尾
- `b` 移动到上一个 word 第一个字母
- `0` 移动到行第一个字符
- `$` 移动到行尾
- `^` 移动到行第一个非空白字符
- `%` 跳转到匹配的 `()[]{}` ，比如光标在 `(` 那么 `%` 可以跳转到匹配的 `)`

###  垂直移动
上面提到过 `j/k` 可以跨行移动。

- `{` 移动到上一个 paragraph
- `}` 移动到下一个 paragraph
- `Ctrl+u/d`  向上/下滚动窗口

### 搜索

- `/{pattern}` 向后搜索，输入搜索词 Enter，然后使用 `n` 跳转下一个匹配，`N` 跳转上一个匹配
- `?{pattern}` 向前搜索

## 笔记间跳转

- `Ctrl-o` Obsidian 默认， open quick switcher
- `Alt-[`(在 macOS 下为 `cmd+[`) navigate back 跳转到前一个笔记
- `Alt-]`(在 macOS 下为 `cmd+]`) navigate forward 后一个笔记

这里推荐一个插件 [Obsidian Better Command Palette](https://github.com/AlexBieg/obsidian-better-command-palette) ，安装完成之后映射到 `Ctrl+p`，然后就可以呼出 Palette：

- `/{search_keywords}` 来搜索文档名
- `#{tag}` 来搜索标签，然后在标签中搜索文档

我觉得 Better Command Palette 比默认的 Switcher 好的一点在于在搜索框中会显示文档的名字，原始名字和标签，而默认的只会显示文档名，而我的很多文档都是使用 alias 重命名过的，一般文档名都是英文名，而 alias 会起一个中文名。

## 切分 Panel

- `Ctrl+\` 垂直切分窗口，这个可以在设置中搜索 `Split Vertically` 设置
- `Ctrl+-` 水平切分窗口，`Split Horizontally`

## vimrc
vimrc 文件是 Vim 的配置文件，在 Obsidian 中可以通过 [Obsidian Vimrc Support Plugin](https://github.com/esm7/obsidian-vimrc-support) 来支持 vimrc。

可以在笔记库(vault) 根目录创建 `.obsidian.vimrc`，然后在其中配置。

特性：

- `exmap [commandName] [command ...]` 用来映射 Ex commands 的命令。
- `obcommand` 执行 Obsidian 命令
- `cmcommand` 执行 CodeMirror 命令
- `surround` 在 Visual 模式中给选择的文本添加内容，或者在 normal 模式中使用
- `pasteinto` 粘贴板
- `jscommand` 和 `jsfile`

在添加命令到 Vimrc 文件之前，应该现在 Obsidian 的命令模式下尝试一下（在 Normal mode 下输入 `: ` ）。

```
" semicolon as colon
nmap ; :
" Have j and k navigate visual lines rather than logical ones
nmap j gj
nmap k gk
" I like using H and L for beginning/end of line
nmap H ^
nmap L $
```

这里举几个简单的例子：

- 第一个配置，就是在 normal 模式下，将 `;` 映射成 `: `，这样进入 Vim 命令模式的时候就可以按相同的按键而不用按下 Shift 了
- 第二个配置将 `j` 映射成 `gj`，`k` 映射成 `gk` ，可以让 `j/k` 移动的时候按照视觉上的行数，而不是文本真实的换行，尤其是在笔记中可能有大量的段落的情况下非常有用
- 第三个配置，将 `H` 映射成跳转到行首，`L` 映射成跳转到行尾

### Obsidian Commands
安装 Vimrc 支持插件之后作者定义了一个 Ex command 叫做 `obcommand` 来执行不同的 Obsidian 命令。

在 Obsidian 中执行 `: obcommand [commandName]` 可以执行命令：

- `obcommand app: go-back`
- `obcommand editor: insert-link`
- `obcommand editor: toggle-comment`
- `obcommand workspace: split-vertical`

作者在 GitHub 上说在编辑器中执行 `: obcommand` 会展示出当前支持的 obcommand 命令列表，但我尝试之后并没有作用，把 Obsidian 升级到最新的 0.15.9 也不管用。

并且尝试使用 `surround` ，目前好像也有 BUG。

## 附录
目前支持的 obcommand 列表：

```
app:delete-file Delete current file –
app:go-back Navigate back Ctrl+Alt+ArrowLeft
app:go-forward Navigate forward Ctrl+Alt+ArrowRight
app:open-help Open help F1
app:open-settings Open settings Ctrl+,
app:open-vault Open another vault –
app:reload Reload app without saving –
app:show-debug-info Show debug info –
app:toggle-default-new?pane-mode Toggle default new pane mode –
app:toggle-left-sidebar Toggle left sidebar –
app:toggle-right-sidebar Toggle right sidebar –
backlink:open Backlinks: Show backlinks pane –
backlink:open-backlinks Backlinks: Open backlinks for the current file –
backlink:toggle-backlinks-in?document Backlinks: Toggle backlinks in document –
command-palette:open Command palette: Open command palette Ctrl+P
dataview:dataview-drop?cache Dataview: Drop All Cached File Metadata –
dataview:dataview-force?refresh-views Dataview: Force Refresh All Views and Blocks –
editor:attach-file Insert attachment –
editor:context-menu Show context menu under cursor –
editor:cycle-list-checklist Cycle bullet/checkbox –
editor:delete-paragraph Delete paragraph Ctrl+D
editor:focus Focus on last note –
editor:focus-bottom Focus on pane below –
editor:focus-left Focus on pane to the left –
editor:focus-right Focus on pane to the right –
editor:focus-top Focus on pane above –
editor:fold-all Fold all headings and lists –
editor:follow-link Follow link under cursor Alt+Enter
editor:insert-callout Insert callout –
editor:insert-embed Add embed –
editor:insert-link Insert Markdown link Ctrl+K
editor:insert-tag Add tag –
editor:insert-wikilink Add internal link –
editor:open-link-in-new-leaf Open link under cursor in new pane Ctrl+Alt+Enter
editor:open-search Search current file Ctrl+F
editor:open-search-replace Search & replace in current file Ctrl+H
editor:rename-heading Rename this heading... –
editor:save-file Save current file Ctrl+S
editor:set-heading Toggle heading –
editor:swap-line-down Move line down –
editor:swap-line-up Move line up –
editor:toggle-blockquote Toggle blockquote –
editor:toggle-bold Toggle bold Ctrl+B
editor:toggle-bullet-list Toggle bullet list –
editor:toggle-checklist?status Toggle checkbox status Ctrl+Enter
editor:toggle-code Toggle code –
editor:toggle-comments Toggle comment Ctrl+/
editor:toggle-fold Toggle fold on the current line –
editor:toggle-highlight Toggle highlight –
editor:toggle-italics Toggle italics Ctrl+I
editor:toggle-numbered-list Toggle numbered list –
editor:toggle-source Toggle Live Preview/Source mode –
editor:toggle-spellcheck Toggle spellcheck –
editor:toggle-strikethrough Toggle strikethrough –
editor:unfold-all Unfold all headings and lists –
file-explorer:move-file File explorer: Move file to another folder –
file-explorer:new-file Create new note Ctrl+N
file-explorer:new-file-in-new?pane Create note in new pane Ctrl+Shift+N
file-explorer:open File explorer: Show file explorer –
file-explorer:reveal-active- file
File explorer: Reveal active file in navigation
file-recovery:open File recovery: Open saved snapshots –
global-search:open Search: Search in all files Ctrl+Shift+F
graph:animate Graph view: Start graph timelapse animation
graph:open Graph view: Open graph view Ctrl+G
graph:open-local Graph view: Open local graph –
markdown-importer:open Format converter: Open format converter
markdown:toggle-preview Toggle reading view Ctrl+E
note-composer:extract?heading Note composer: Extract this heading... –
note-composer:merge-file Note composer: Merge current file with another file... –
note-composer:split-file Note composer: Extract current selection... –
open-with-default-app:open Open in default app –
open-with-default-app:show Show in system explorer –
outgoing-links:open Outgoing Links: Show outgoing links pane
outgoing-links:open-for?current Outgoing Links: Open outgoing links for the current file –
switcher:open Quick switcher: Open quick switcher Ctrl+O
theme:use-dark Use dark mode –
theme:use-light Use light mode –
window:toggle-always-on?top Toggle window always on top –
workspace:close Close active pane Ctrl+W
workspace:close-others Close all other panes –
workspace:copy-path Copy file path –
workspace:copy-url Copy Obsidian URL –
workspace:edit-file-title Edit file title F2
workspace:export-pdf Export to PDF –
workspace:move-to-new?window Move current pane to new window –
workspace:open-in-new?window Open current pane in new window –
workspace:split-horizontal Split horizontally –
workspace:split-vertical Split vertically –
workspace:toggle-pin Toggle pin –
workspace:undo-close-pane Undo close pane Ctrl+Shift+T
```

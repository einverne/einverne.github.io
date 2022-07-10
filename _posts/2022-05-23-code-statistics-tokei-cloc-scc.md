---
layout: post
title: "推荐三个代码统计工具 tokei, cloc 和 scc"
aliases:
- "推荐三个代码统计工具 tokei, cloc 和 scc"
tagline: ""
description: ""
category: 学习笔记
tags: [ cli, rust, tokei, cloc, code, code-statistics, golang  ]
create_time: 2022-07-10 18:04:10
last_updated: 2022-07-10 06:13:01
---

有些时候在开源项目的时候可能需要对整个项目有一个全局的了解，比如想要了解这个项目中具体有多少行代码，那么这个时候，下面三个命令就派上用场了。

之前在 Twitter 上看到有人分享说 SQLite 的注释非常详细，甚至比代码都多，那么用下面这些工具一眼就能看到。

## Tokei

 [Tokei](https://github.com/XAMPPRocky/tokei) 是一个使用 Rust 编写的用来显示代码信息的命令行工具，Tokei 可以以编程语言为分类显示文件数，代码行数，注释行数，空行数。

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Language            Files        Lines         Code     Comments       Blanks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BASH                    4           49           30           10            9
 JSON                    1         1332         1332            0            0
 Shell                   1           49           38            1           10
 TOML                    2           77           64            4            9
───────────────────────────────────────────────────────────────────────────────
 Markdown                5         1355            0         1074          281
 |- JSON                 1           41           41            0            0
 |- Rust                 2           53           42            6            5
 |- Shell                1           22           18            0            4
 (Total)                           1471          101         1080          290
───────────────────────────────────────────────────────────────────────────────
 Rust                   19         3416         2840          116          460
 |- Markdown            12          351            5          295           51
 (Total)                           3767         2845          411          511
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Total                  32         6745         4410         1506          829
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

在 macOS 下安装：

```
brew install tokei
```

## cloc
 [cloc](https://github.com/AlDanial/cloc) 同样是一个用来计算代码行数的命令行工具，和 Tokei 一样，可以统计代码行数，注释行数，空行。
cloc 使用 Perl 编写。

Debian/Ubuntu:

```
sudo apt install cloc
```

或者以 Docker 运行：

```
docker run --rm -v $PWD:/tmp aldanial/cloc
```

## scc
 [scc]() 是一个使用 Go 语言编写的统计代码行数的工具。

```
brew install scc
```


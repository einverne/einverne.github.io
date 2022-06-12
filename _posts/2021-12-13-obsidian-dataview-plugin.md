---
layout: post
title: "Obsidian 插件篇之 Dataview"
aliases: 
- "Obsidian 插件篇之 Dataview"
tagline: ""
description: ""
category: 经验总结
tags: [ obsidian, note-taking, dataview, metadata, query, obsidian-plugin ]
last_updated:
---

在过去的一年里面，我基本上[只用 Obsidian 来记录](/post/2020/05/obsidian-note-taking.html)，并且我也将我过去几年的 [Jekyll](/post/2020/11/obsidian-sync-acrose-devices-solution.html) 的内容作为 submodule 引入到了 Obsidian Vault，所以现在这个仓库中有非常多的笔记。

前些天在 Twitter 上看到有人说 Obsidian 基于 Markdown 的管理方式没有 Roam Research，和 [[Logseq]] 那样基于块的灵活，并且无法动态展示内容，比如有人用 Notion 那种表格的形式来管理读书记录，观影记录，用 Obsidian 就没有太好的办法去做到，但其实只要使用 Dataview 这一个插件就可以实现。

- 源代码：<https://github.com/blacksmithgu/obsidian-dataview>
- 文档: <https://blacksmithgu.github.io/obsidian-dataview/>

在过去的使用过程中，我并没有太多的需求要去使用这一款插件，大部分的场景我都会直接使用搜索(Ctrl+Shift+F)关键字或标签来做到。但随着现在笔记越来越多，我产生了一个需求，比如我想要查看我笔记中打了某个标签的笔记列表，我想查看某个时间段中我记录的关于某个人物的笔记，又或者我会在笔记中将我看过的影视作品记录下来，我想查看过去我看过的某个导演的作品列表，这一些都可以通过 Dataview 结合 Obsidian 来达到。

这样的需求和我之前在了解 [[Zettelkasten 笔记法]] 中关于 [[202008261820-Zettel-笔记中间层]] 的概念不谋而合。当原子的笔记变得越来越多的时候，为了将这些原子的笔记集合到某一个主题下，通常我们会使用分类、标签等等方式来组织，那么使用一个笔记中间层来管理就变得顺理成章，而在过去我通常都是使用手工的方式来组织，比如我在管理读书笔记的时候，我会新建一个年度的笔记 [[Reading-2021]] ，然后在其中以季度为标题，然后记录每一本书。同样观影记录也类似。

而当我得知了 Dataview 插件之后，我发现这样的中间层可以通过组织数据而自动产生，只需要我在每一个笔记中加上 YAML Front matter，然后用适当的查询语句就可以做到。下面就直接来介绍一下这个插件。

## 基本概念 {#concept}

在 Obsidian 中可以用不同的方式对数据（笔记）进行标记，Dataview 会追踪所有 Markdown 文件中标记的数据。

Dataview 插件中几个重要的概念：

- YAML Front Matter，Markdown 文件开头标记元数据部分
- Inline Field, 行内标记字段
- Implicit Field, 隐式字段

### YAML Front Matter

Obsidian 的 metadata 使用 YAML front matter，一般写在文件的最上面，使用 key-value 结构，既对人友好，也对 Obsidian 可读。YAML 是 "Yet Another Markup Language" 的缩写。

Front matter 一般是纯文本文件从第一行开始的一块区域。这是 Markdown 文件通常用来添加 metadata 的方式。Jekyll, Hugo, Gatsby 等等静态网站生成器都使用这个方式。

这个区块就可以对这个 Markdown 文件添加额外的描述信息。

YAML 区块需要三条 `---` 短横线标记开始和结束。并且这个区块需要在文件的最上面。

比如：

```
---
key: value
key2: value2
key3: [one, two, three]
key4:
- four
- five
- six
---
```

从 Obsidian 0.12.12 开始，有四个原生支持的标签：

- `tags`
- `aliases`
- `cssclass`
- `publish`

后两个我一般不怎么使用，所以我创建了一个模板，每一次创建新的笔记，都会自动包含上述两个标签：

```
---
category: 
aliases:
tags:
time: {{date}} {{time}}
---
```

你当然还可以用 Templater 插件针对不同的笔记内容插入不同的 YAML 头，比如去记录看过的电影，我就会多加上 `rating`, `comment` 字段，简单的记录评分和短评。

### Inline Fields

#### 在页面中使用行内字段
除了上面显式地使用 YAML 来对文件进行标记，也还可以在内容中使用行内的语法对 markdown 文件进行标记，Dataview 支持 `Key:: Value` 这样的格式：

```
# Markdown Page

One Field:: Value
**Bold Field**::  Nice!
```

或者也可以写在一行内：

    刚刚看完[[浪漫的体质 Melo 体质]]，可以打 [rating:: 5] 分，这是一部让人看了非常[mood:: 轻松愉悦]的[category:: 喜剧片]

上面一个句子同样达到了给当前这个文档加上了如下的标签：

- rating: 5
- mood: 轻松愉悦
- category: 喜剧片

在之后的检索中直接可以使用。

#### 在 Task 中使用行内字段
同样在 Task 语法中也可以使用，通常在 Markdown 中我们会使用 `-[ ] blah blah` 来标记一个任务，比如：

```
- [ ] todo task [metadata key:: value]
- [x] finished task [completion:: 2021-12-30]
```

同样可以使用行内的标记。在 Dataview 官方的说明中我们也可以使用 emoji 来分别表示，到期（🗓️YYYY-MM-DD），完成（✅YYYY-MM-DD），创建（➕YYYY-MM-DD）的日期。如果不想使用 emoji 也可以直接用文字 `[due:: ]`, `[create:: ]`, `[completion:: ]`。

#### 行内字段的类型
所有 Dataview 中的字段都有类型，这决定了在渲染的时候的顺序。

如果没有匹配上任何类型，就是字符串：

    FieldName:: This is a demo text.

数字类型：

    FieldName:: 6
    FieldName:: 2.4
    FieldName:: -10

布尔值：true/false

    FieldName:: true
    FieldName:: false

日期：ISO8601 标准，`YYYY-MM[-DDTHH:mm:ss.nnn+ZZ]`

```
Example:: 2021-04-18
Example:: 2021-04-18T04:19:35.000
Example:: 2021-04-18T04:19:35.000+06:30
```

时长：格式 `<time> <unit>`，比如 `6 hours` 或者 `4 minutes`

```
Example:: 7 hours
Example:: 4min
Example:: 16 days
Example:: 9 years, 8 months, 4 days, 16 hours, 2 minutes
Example:: 9 yrs 8 min
```

链接：Obsidian 的格式，如果要在 Front matter 中使用，则需要使用双引号

```
Example:: [[A Page]]
Example:: [[Some Other Page|Render Text]]
```

数组：

```
Example:: 1, 2, 3
Example:: "yes", "or", "no"
```

对象，字典：

```
field:
  value1: 1
  value2: 2
  ...
```


### 字段 Fields

#### 页面中的隐式字段
Dataview 会给每一个文件都自动添加一些默认的 metadata 信息，这些字段在后面的检索语法中都可以使用。

Implicit Field 字段[^field]

[^field]: [Dataview field](https://blacksmithgu.github.io/obsidian-dataview/data-annotation/#implicit-fields)

- `file.name`: 文件标题(字符串)
- `file.folder`: 文件所属文件夹路径
- `file.path`: 文件路径
- `file.size`: (in bytes) 文件大小
- `file.ctime`: 文件的创建时间（包含日期和时间）
- `file.mtime`: 文件的修改时间
- `file.cday`: 文件创建的日期
- `file.mday`: 文件修改的日期
- `file.tags`: 笔记中所有标签数组，子标签会按照每一个层级分别展开存储，比如 `#Tag/A/1`，会有三个 `[#Tag, #Tag/A, #Tag/A/1]`
- `file.etags`: 除去子标签的数组
- `file.inlinks`: 指向此文件的所有传入链接的数组
- `file.outlinks`: 此文件所有出站的链接数组
- `file.aliases`: 文件别名数组
- `file.day`： 如果文件名中有日期，那么会以这个字段显示。比如文件名中包含 yyyy-mm-dd（年-月-日，例如2021-03-21），那么就会存在这个 metadata。

#### 任务中的隐式字段 implicit field in task
同样对于 Tasks，Dataview 也会自动创建一些隐式的字段。

每一个任务都会有如下的字段：

- Task 会继承所在文件的所有字段，比如 Task 所在的页面中已经包含了 rating 信息了，那么 task 也会有
- `completed` 任务是否完成
- `fullyCompleted`: 任务以及所有的子任务是否完成
- `text`: 任务名
- `line`: task 所在行
- `path`: task 所在路径
- `section`: 连接到任务所在区块
- `link`: 连接到距离任务最近的可连接的区块
- `subtasks`: 子任务
- `real`: 如果为 true, 则是一个真正的任务，否则就是一个任务之前或之后的元素列表
- `completion`: 任务完成的日期
- `due`: 任务到期时间
- `created`: 创建日期
- `annotated`: 如果任务有自定义标记则为 True，否则为 False

## Dataview Query Language
一旦定义了上述的字段（标签、属性）就可以用 Dataview 定义的查询语法来检索并展示内容。这是一个类 SQL 的语法，一个最简单的例子：

    ```dataview
    TABLE rating AS "Rating", summary AS "Summary" FROM #games
    SORT rating DESC
    ```

Dataview 插件提供了三种样式的展现形式：

- table, 检索内容以表格形式展现
- list, 列表形式展现
- task, 检索内容中的任务

一个标准的语法是这样的：

    ```dataview
    [list|table|task] field1, (field2 + field3) as myfield, ..., fieldN
    from #tag or "folder" or [[link]] or outgoing([[link]])
    where field [>|>=|<|<=|=|&|'|'] [field2|literal value] (and field2 ...) (or field3...)
    sort field [ascending|descending|asc|desc] (ascending is implied if not provided)
    ```

说明：

- `dataview` 告诉 Obsidian 这个地方需要使用 Dataview 插件
- `list|table|task` 告诉 Dataview 插件展现形式
- `from` 则告诉 Dataview 包含什么文件，如果是 `#tag` 获取标签，获取文件夹，等等
- `Where`：筛选 from 中的内容，进行过滤，可以指定从某个标签（在yaml字段中的标签），或某个文件夹中检索信息。
- `sort`：排序：可以按某个字段进行排序，可以升序（使用参数ascending、asc）或降序（使用参数descending、desc）
    
### table
个人最常使用的一个展现形式，可以以表格的形式展示多列。

    ```dataview
    table field
    from #tag 
    sort file.ctime desc
    ```

表示过滤出所有包含 `#tag` 的文件，并显示 `field` 列，最后以表格形式，并以文件创建时间倒序渲染展示。

## 进阶用法
除了上面提到的 Query 语法，Dataview 插件还提供了另外两种查询语法。

- 行内查询
- Dataview JS 进阶查询

### 行内查询 Inline DQL
Dataview 提供的查询可以直接在行内使用，比如

    # 查看当前文件名
    `= this.file.name`
    # 今天日期
    `= date(today)`
    # 距离某个日期时长
    `=(date(2023-12-31)-date(today))`

可以在 Dataview 设置中自定义行内查询的前缀。

### Dataview JS
Dataview JS 给了用户进一步查询的能力，可以直接使用 JavaScript , Dataview JS 定义了一些预置函数可以直接使用。

使用 `dataviewjs` 代码块：

    ```dataviewjs
    let pages = dv.pages("#books and -#books/finished").where(b => b.rating >= 4);
    for (let group of pages.groupBy(b => b.genre)) {
       dv.header(group.key);
       dv.list(group.rows.file.name);
    }
    ```

在 Dataview JS 中需要使用 `dv` 变量，插件定义了一些默认的函数。


### 检索页面
通过 `dv.pages()` 函数：

    ```dataviewjs
    dv.pages("#korean-drama") //返回所有带有标签 books 的页面
    dv.pages('"folder"') //返回所有在 folder 文件夹的页面
    dv.pages("#yes or -#no") //返回所有带有标签 yes 或者没有标签 no 的页面
    dv.pages("") //返回所有页面
    ```

### 检索路径
返回文件的路径：

    ```dataviewjs
    dv.pagePaths("#books") //返回所有带有标签 books 的页面路径
    dv.pagePaths('"folder"') //返回所有在 folder 文件夹的页面路径
    dv.pagePaths("#yes or -#no") //返回所有带有标签 yes 或者没有标签 no 的页面路径
    ```

### 返回单个页面

    ```dataviewjs
    dv.page("Index") //返回名称为 Index 的页面
    dv.page("books/The Raisin.md") //返回所有在 books 文件夹下的 The Raisin 文件的页面
    ```

渲染

通过 header 来设置标题，比如 level=1 就是设置一级标题：

    dv.header(level, text)

列表

    ```dataviewjs
    dv.list([1, 2, 3]) //生成一个1，2，3的列表
    dv.list(dv.pages().file.name)  //生成所有文件的文件名列表
    dv.list(dv.pages().file.link)  //生成所有文件的文件链接列表，即双链
    dv.list(dv.pages("").file.tags.distinct()) //生成所有标签的列表
    dv.list(dv.pages("#book").where(p => p.rating > 7)) //生成在标签 book 内所有评分大于 7 的书本列表
    ```

任务列表

    ```dataviewjs
    // 从所有带有标签 project 的页面中获取所有的任务生成列表
    dv.taskList(dv.pages("#project").file.tasks)

    // 从所有带有标签 project 的页面中获取所有的未完成任务生成列表
    dv.taskList(dv.pages("#project").file.tasks
        .where(t => !t.completed))

    // 从所有带有标签 project 的页面中获取所有的带有特定字符的任务生成列表
    // 可以设置为特定日期
    dv.taskList(dv.pages("#project").file.tasks
        .where(t => t.text.includes("#tag")))

    // 将所有未完成且带有字符串的任务列出
    dv.taskList(
        dv.pages("").file.tasks
        .where(t => t.text.includes("#todo") && !t.completed),1)
    ```

表格

    ```dataviewjs
    // 根据标签 book 对应的页面的 YAML 生成一个简单的表格，其中 map 为对应的内容所对应的表头，按顺序填入即可。
    // b 可以是任意值，只是代表当前传入的文件为 b
    dv.table(["File", "Genre", "Time Read", "Rating"], dv.pages("#book")
        .sort(b => b.rating)
        .map(b => [b.file.link, b.genre, b["time-read"], b.rating]))
    ```


同样也可以在行内使用 Dataview JS:

    `$= dv.current().file.mtime`


## 总结
再回到我最初的需求，比如我想查看我笔记中所有包含了 korean-drama 标签的笔记，以及我的打分。只要我的笔记中之前已经包含了 Front Matter，就可以用下面的代码直接检索出来。

    ```dataview
    table file.ctime as "Create Time", rating as "Score"
    from #korean-drama
    sort rating desc
    ```

结果：

![obsidian dataview query result](/assets/obsidian-dataview-query-result-2022-02-11-092830.png)

再比如我想知道我笔记中包含了洛克这个单词的所有笔记，以及出现的行内容。

![](/assets/obsidian-dataview-dataviewjs-2022-02-11-094928.png)

那么可以用这一段代码：


    ```dataviewjs
    const files = app.vault.getMarkdownFiles()
    const prompt = "洛克"

    const fileObject = files.map(async (file) => {
        const fileLink = "[["+file.name.split(".")[0]+"]]"
        const content = await app.vault.cachedRead(file)
        return {fileLink, content}
    })

    Promise.all(fileObject).then(files => {

    let values = new Set(files.reduce((acc, file) => {
        const lines = file.content.split("\n").filter(line => line.match(new RegExp(prompt, "i")))
        if (lines[0] && !file.fileLink.includes("Untitled")) {
            if (acc[0]) {
                return [...acc, [file.fileLink, lines.join("\n")]]
            } else {
                return [[file.fileLink, lines.join("\n")]]
            }
        }
        return acc
    }, []))

    dv.header(1, prompt)
    dv.table(["file", "lines"], Array.from(values))

    })
    ```

## reference

- <https://blacksmithgu.github.io/obsidian-dataview/>
- [[obsidian-dataview-query-example]]
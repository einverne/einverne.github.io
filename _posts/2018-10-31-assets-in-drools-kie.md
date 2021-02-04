---
layout: post
title: "Drools Kie 中的 Assets"
aliases: "Drools Kie 中的 Assets"
tagline: ""
description: ""
category: 学习笔记
tags: [drools, rule-engine, kie, ]
last_updated:
---

Drools Workbench 中有很多的 Assets （资源）类型，每一种类型的 asset 都意味着一种类型的规则模型，下面就记录下学习的过程。

## Model
这个是最好理解的概念了，和 Java 的对象一样。可以通过基础类型定义一些抽象的概念。

## Data enumerations
枚举，和常见的枚举也没有太大差别，不过在 Drools 中会被下拉菜单用到。

Fact            | Field             | Context
----------------|-------------------|--------------
Applicant       | age               | [20, 25, 30]

然后会生成这样的代码

    'Applicant.age' : [20,25,30]

如果想要缩写可以使用等号，比如

    'Person.gender' : ['M=Male','F=Female']

## guided rules
向导型规则，通过 WHEN ，THEN 语句快速建立规则，相对比较简单的一种。在规则设计器中可以轻松的添加条件和结果规则。

Guided rules 规则相对比较简单适合用于单一简单的规则建立。

## Guided decision tables
**向导型决策表**是一种以表格形式表现规则的工具，非常适合描述条件判断很多，条件又可以相互组合，有很多决策方案的情况。决策表可以将这些复杂的逻辑以一种精确而简单的表格形式整理出来，通过 Workbench 中直观的表格形式非常清晰。

Drools 中的决策表可以非常轻松的引导用户制作一个基于 UI 的规则，可以定义规则 attributes, metadata, conditions 和 actions。一旦通过 UI 形式定义好规则，那么所有的规则都会编译为 Drools Rule Language(DRL) 规则。

### 创建向导型决策表

- Menu → Design → Projects and click the project name
- Click Add Asset → Guided Decision Table
- 填入名字，选择 Package，选择的包需要和依赖的 data Object 在同一个包下
- 选择 **Use Wizard** 通过向导进行初始化，或者后面自己设定
- 选择 hit policy，不同类型的 hit policy 见下方
- 选择 Extended entry or Limited entry ，两种不同的类型见下方
- 点击 OK 完成，如果选择了 Use Wizard 会出现向导，如果没有选择会出现 table 设计器
- 如果使用向导，选择 imports，fact patterns, constraints 和 actions，选择 table 是否需要 expand。点击 Finish 结束向导

### Hit policy
Hit policy 决定了决策表中的每一个规则（每一行）按照什么样的顺序执行，从上往下，或者按照优先级等等

- None 默认，多行可以同时被执行，verification 会将冲突 warning 出来
- Resolved Hit，和 First Hit 类似，每一次只有一行可以被执行，但是可以根据优先级，定义在列表中的执行顺序。可以给不同行设置不同的优先级，从而维持界面中的顺序，但是可以根据需要定义执行顺序
- Unique Hit, 一次只能执行一行，每一行必须 Unique，条件不能有重叠，如果多于一行被执行，会有 warning
- First Hit，依据表中的顺序，从上到下，每一次执行一行，一旦有命中则返回
- Rule Order，多行可以同时执行，verification 不会将冲突警告

### Guided decision tables 的类型
Drools 中支持两种类型的决策表：Extended entry and Limited entry

- Extended entry:Extended Entry decision table 是列定义 Pattern，Field，和 Operator，不包括值。值，状态，在决策表的 body 中。
- Limited entry： Limited Entry decision table 的列除了上面的 Pattern， Field， 和 Operator 之外也可以定义具体的数值，具体的状态会以 boolean 值显示在表的 body 中。

### 向 Guided decision tables 中添加列
在创建完 Guided decision tables 之后可以向表中添加列。

必备条件：所有在列参数中使用的 Facts 或者 Fields 都需要提前创建，并且在同一个包中。

步骤：

- 在 table designer 中选择 Columns -> Insert Column
- 在 Include advanced options 中查看完整的列选项
- 选择想要的列类型，点击 Next

### Guided decision tables 中列的类型

#### Add a Condition
Conditions 代表着 fact patterns 中表示左侧 "WHEN" 部分的规则。使用该列类型，你可以定义一个或者多个条件列，用来检查特定属性值的输入，然后影响 "THEN" 部分的规则。可以定义 bindings，或者选择之前的定义。

    when
      $i : IncomeSource( type == "Asset" ) // binds the IncomeSource object to $1 variable
    then
      ...
    end

#### Add a Condition BRL fragment
Business Rule Language (BRL) 是规则 "WHEN" 部分，action BRL fragment 是 "THEN" 部分规则。

#### Add a Metadata column
可以定义 metadata 元素作为列，每一列都代表这普通的 metadata。

#### Add an Action BRL fragment
action BRL fragment 是 "THEN" 部分的规则，定义该列可以定义 THEN 的动作。

#### Add an Attribute column
通过该列，可以添加一个或者多个属性，代表着 DRL 规则的属性，比如 Saliance,Enabled, Date-Effective. 通过定义 Salience 100 可以定义优先级。

不过需要注意的是，根据不同的 Hit Policy 设置有些属性可能被禁用。

#### Delete an existing fact
通过该列，可以定义一些操作，比如删除之前添加的 fact 等等。

#### Execute a Work Item
通过该列，可以执行之前定义的 work item handler. (work item 可以通过 Menu → Design → Projects → [select project] → Add Asset → Work Item definition 来创建 )

#### Set the value of a field
很好理解，通过该列，可以设置一个 field。

#### Set the value of a field with a Work Item result
通过该列可以给 THEN 部分规则设置一个通过 work item hander 得到的结果。 work item 必须和结果参数使用相同的类型以便于赋值。

## Guided Decision Table Graph

### 创建图
当创建 Guided Decision Table Graph 之后系统会自动扫描存在 Guided Decision Tables。

在菜单栏中点击 Documents 添加 graph

## guided rule templates
规则模板，可以使用占位符来生成模板来给其他使用

## Guided decision trees
向导型决策树，当新建一个决策树之后，编辑器是空白的，左边是可用的数据对象，以及他们的 fields 和 Actions。右边是一张可编辑的图，可以将左侧的内容拖拽到图上来构造一棵树。

构造树有一些简单的限制：

- tree 必须在 root 节点上有一个 Data  Object
- tree 只能有一个 root
- Data Objects 可以拥有其他 Data Objects， field 约束或者 Actions 作为子节点，field 约束必须在同一个 DATA Object 的 fields 父节点下
- Field 约束可以有其他 field 约束或者 Actions 作为子节点，field 约束必须在同 Data Object 的 field 节点下
- Actions 只能有其他 Actions 作为子节点


## Spreadsheet decision tables
由用户上传一张 excel 表

## Decision tables
Decision tables 是 XLS 或者 XLSX spreadsheets ，可以用来定义业务规则。可以直接上传到 Business Central 中。

表中的每一行都是一条规则，列都是条件，动作或者其他规则属性。当创建并上传了决策表之后，规则会被编译成 DRL。


## Test Scenario
Test Scenario 用来验证规则是否符合预期，当规则发生改变，可以使用 Test Scenario 来回归测试。

## reference

- <http://docs.jboss.org/drools/release/latest/drools-docs/html_single/#guided-decision-tables-con>

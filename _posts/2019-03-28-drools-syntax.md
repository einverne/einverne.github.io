---
layout: post
title: "Drools 语法规则"
aliases: "Drools 语法规则"
tagline: ""
description: ""
category: 学习笔记
tags: [drools, kie, rule-engine, ]
last_updated:
---

## What is drools?

Drools is a business rule management system with a forward and backward chaining inference based rules engine, more correctly known as a production rule system, using an enhanced implementation of the Rete algorithm.[^wiki]

[^wiki]: <https://en.wikipedia.org/wiki/Drools>


## 基础 API
在 Drools 当中，规则的编译与运行要通过 Drools 提供的各种 API 来实现，这些 API 总体来讲可以分为三类：规则编译、规则收集和规则的执行。

在 drools 6.x 以后这些 API 都整合到 kie API 中了

KIE 定义的接口可以在 GitHub droolsjbpm-knowledge 这个项目中查看。

### KnowledgeBuilder
KnowledgeBuilder 在业务代码当中整理已经编写好的规则，对这些规则文件进行编译，最终产生编译好的规则包（KnowledgePackage）给其它的应用程序使用。

### KnowledgeBase
KnowledgeBase 是 Drools 提供的用来收集应用当中知识（knowledge）定义的知识库对象，在一个 KnowledgeBase 当中可以包含普通的规则（rule）、规则流 (rule flow)、函数定义 (function)、用户自定义对象（type model）等。KnowledgeBase 本身不包含任何业务数据对象，业务对象都是插入到由 KnowledgeBase 产生的两种类型的 session 对象当中，通过 session 对象可以触发规则执行或开始一个规则流执行。

### StatefulKnowledgeSessions
StatefulKnowledgeSession 对象是一种最常用的与[[规则引擎]]进行交互的方式，它可以与规则引擎建立一个持续的交互通道，在推理计算的过程当中可能会多次触发同一数据集。在用户的代码当中，最后使用完 StatefulKnowledgeSession 对象之后，**一定**要调用其 dispose() 方法以释放相关内存资源。

	public interface StatefulKnowledgeSession
		extends
		KieSession, KieRuntime {

		KieBase getKieBase();
	}

### StateLessKnowledgeSession
StatelessKnowledgeSession 的作用与 StatefulKnowledgeSession 相仿，它们都是用来接收业务数据、执行规则的。事实上，StatelessKnowledgeSession 对 StatefulKnowledgeSession 做了包装，使得在使用 StatelessKnowledgeSession 对象时不需要再调用 dispose() 方法释放内存资源了

调用 `execute(...)` 方法会在内部实例化 StatefulKnowledgeSession 对象，添加用户数据，执行命令，调用 fireAllRules，最后自动调用 dispose().


	public interface StatelessKnowledgeSession
		extends
			StatelessKieSession {

	}

## FACT 对象
Fact 是指在 Drools 规则应用当中，将一个普通的 JavaBean 插入到规则的 WorkingMemory 当中后的对象。

Drools 规则可以对 Fact 对象进行任意的读写操作，当一个 JavaBean 插入到 WorkingMemory 当中变成 Fact 之后，Fact 对象不是原来的 JavaBean 对象的 Clone，而是原来 JavaBean 对象的引用。


## 规则文件
一个标准的 Drools 规则文件就是一个以“.drl”结尾的文本文件。

Drools 规则文件包含一个或多个 rule 声明，每一个 rule 由一个或多个条件以及要执行的动作（Action）组成。一个规则文件还可以有 0 个或多个 import 声明，global 声明和 function 声明。

Drools 规则文件大致可以包含这些部分：

    package package-name
    imports
    globals
    functions
    queries
    rules

package 是必须的，除 package 之外，其它对象在规则文件中的顺序是任意的，也就是说在规则文件当中必须要有一个 package 声明，同时 package 声明必须要放在规则文件的第一行。

### package

`package` 是一系列 rule 的一个命名空间，这个空间中所有的`rule` 名字都是唯一的。`package-name` 必须遵守 Java 命名规范。

### import
Drools 文件中的 import 语句和 Java 的 `import` 语句类似，引入指定对象的路径及全称。

### global
`global` 用于定义全局变量。

- 全局变量不会插入到 `Working Memory`
- 全局变量的改变不会通知规则引擎，规则引擎不会追踪全局变量的变化
- 多个包中同时定义相同标识符的全局变量，全局变量必须是相同类型，并引用一个相同的全局值

### function
`function` 提供了一种在规则源文件中插入语义代码的方式。在规则中使用函数的优点是可以把逻辑放在一个地方。

```
function String hello(String name) {
  return "hello " + name + "!";
}
```

注意这里的，function 并不是 java 语法的一部分。Drools 支持函数的导入：

	import function my.package.Foo.hello

### Type declaration
规则引擎中，可以：

- 允许新的类型声明
- 允许元数据类型的声明

类型声明

	declare Address
	   number : int
	   streetName : String
	   city : String
	end

定义一个新的类型 Address, 有三个属性，每个属性的类型都是 Java 中有效的数据类型。

定义 Person

import java.util.Date

	declare Person
		name : String
		dateOfBirth : Date
		address : Address
	end

定义该新类型后，Drools 会在编译期间生成对应的 Java 类字节码。

声明枚举类型

	declare enum DaysOfWeek
	   SUN("Sunday"),MON("Monday"),TUE("Tuesday"),WED("Wednesday"),THU("Thursday"),FRI("Friday"),SAT("Saturday");

	   fullName : String
	end

声明后可以直接应用于规则中：

	rule "Test Enum Rule"
	when
	  $p: Employee( dayOff == DaysOfWeek.MONDAY )
	then
	  ...
	end

声明云数据 (metadata)

	@metadata_key( metadata_value )


### Rule

一条规则的大致框架包括如下几部分：

    rule "name"
        attributes
        when
            LHS
        then
            RHS
    end

一个规则通常包括三个部分：

- 属性部分（attribute），非必须，最好写在一行，关于**规则属性**部分，后文有更详细的介绍
- 条件部分（LHS）
- 结果部分（RHS）

对于一个完整的规则来说，这三个部分都是可选的（可以为空），也就是说如下所示的规则是合法的：

    rule "name"
    when
    then
    end

### 注释
drl 文件中对规则进行注释，和 Java 一样可以使用

- 单行注释 `//`
- 多行注释 `/* xxx */`

Drools 5 中定义了 hard 和 soft 关键字，Hard 关键字是保留字，不能够在规则中自定义随意使用

    true
    false
    accumulate
    collect
    from
    null
    over
    then
    when

规则举例

    rule "validate holiday by eval"
    dialect "mvel"
    when
        h1 : Holiday( )
        eval( h1.when == "july" )
    then
        System.out.println(h1.name + ":" + h1.when);
    end

或者

    rule "validate holiday"
    dialect "mvel"
    when
        h1 : Holiday( `when` == "july" )
    then
        System.out.println(h1.name + ":" + h1.when);
    end


### 条件部分
条件部分又被称之为 Left Hand Side，简称为 LHS。 在 LHS 当中，可以包含 0~n 个条件，如果 LHS 部分没空的话，那么引擎会自动添加一个 eval(true) 的条件，由于该条件总是返回 true，所以 LHS 为空的规则总是返回 true。LHS 部分是由一个或多个条件组成，条件又称之为 pattern（匹配模式），多个 pattern 之间用可以使用 and 或 or 来进行连接，同时还可以使用小括号来确定 pattern 的优先级。

绑定对象语法

    [ 绑定变量名 ]: Object([field 约束 ])

绑定变量是可选的，如果当前规则 LHS 部分的其他规则需要使用到这个对象，可以通过为该对象设定一个绑定变量名来实现对其引用，对于绑定变量，通常在其变量名前增加 `$` 符号来和 Fact 区别。field 约束表示的是对对象中 field 的约束。

比如对于该规则

    rule "rule1"
    when
        $customer:Customer(age>20, gender=="male")
        Order(customer==$customer, price>1000)
    then
    <action>
    End

规则含义：包含两个 pattern，第一个 pattern 有三个约束，分别是：

- 对象类型必须是 Customer；
- 同时 Customer 的 age 要大于 20 
- 且 gender 要是 male；

第二个 pattern 也有三个约束，分别是：

- 对象类型必须是 Order，
- 同时 Order 对应的 Customer 必须是前面的那个 Customer 
- 且当前这个 Order 的 price 要大于 1000。

在这两个 pattern 没有符号连接，在 Drools 当中在 pattern 中没有连接符号，那么就用 `and` 来作为默认连接，所以在该规则的 LHS 部分中两个 pattern 只有都满足了才会返回 true。默认情况下，每行可以用“;”来作为结束符（和 Java 的结束一样），当然行尾也可以不加“;”结尾。



### 操作符
Drools 中的操作符有很多种类：

- Arithmetic operators (`+, -, *, /, %`) 算数操作符
- Relational operators (`>, >=, ==, !=`) 关系操作符
- Logical operators 逻辑操作符

    - conjunction (`and, &&, ","`) 与
    - disjunction (`or, ||`) 或
    - negation (`!`, do not confuse with not) 取反 (!, 不要和 not 混淆）

- Drools operators (in, matches, etc...) | Drools 操作符 (in, matches, 等等...)

一些操作符都非常通俗易懂，这里有几个需要特别注意

### 约束连接
对象内部多个约束连接，可以使用 `&&`, `||` 或者 `,(and)` 。优先级 `&&` > `||`

`,` 与 `&&` `||` 不能混用，在 `&&` 和 `||` 出现的语句中不能出现 `,`

### 比较操作符
Drools 中一共提供了 12 种类型的比较操作符，`>, >=, <, <=, ==, != ,contains, not contains, memberof, not memberof, matches, not matches` 。前六个比较常用，不介绍了，现在结束一下后几个。

contains 举例：

    when
        $order:Order();
        $customer:Customer(age >20, orders contains $order);
    then
        System.out.println($customer.getName());
    End

### in 操作符

- in 操作符是表示值在一个集合内部，集合中的数据需要单独列出

    when
      e : Emp (deptno in (10,20))

等效于

       e : Emp(deptno == 10 || deptno == 20)
       e : (Emp(deptno == 10) or Emp(deptno == 20))

### matches 操作符

matches 是某个字段和 Java 正则匹配

    when
        $customer:Customer(name matches "吴.*");
    then
        System.out.println($customer.getName());
    end

matches 操作符匹配是否匹配 Java 正则表达式。

    .   匹配单一字符
    .*  匹配任何字符，包括空字符串

不匹配需要这么写

    when
        e: Emp(name not matches "B.*")

下面的写法是错误的！！！

    when
        e: Emp(name ! matches "B.*")

        e: ! Emp(name matches "B.*")

### 操作符优先级

    (nested) property access    .
    List/Map access            [ ]
    constraint binding   :
    multiplicative       * / %
    additive             + -
    shift                << >> >>>
    relational           < > <= >= instanceof
    equality             == !=
    bit-wise non-short circuiting AND               &
    bit-wise non-short circuiting exclusive OR	^
    bit-wise non-short circuiting inclusive OR	|
    logical AND	&&
    logical OR	||
    ternary	? :
    Comma separated AND	,

Drools 还支持一些高级语法规则，更多可以参考[这里](https://training-course-material.com/training/Drools_Expert_-_mvel_-_LHS_-_advanced)

## 结果部分 {#rhs}
Right Hand Side，又被称为结果部分，RHS，规则中 then 后面部分就是 RHS，只有在 LHS 所有条件都满足时 RHS 部分才会执行。

RHS 部分是规则真正要做的事情，将条件满足而触发的动作写在该部分中，RHS 中可以使用 LHS 中定义的绑定变量名、设置的全局变量，或者直接编写 Java 代码（需要 import 相应的类）

RHS 中，提供了对当前 Working Memory 实现快速操作的宏函数和宏定义，比如 insert/insetLogical, update 和 retract，实现对当前 Working Memory 中 Fact 对象的新增、删除或者修改。

### insert

    insert(new Object());

一旦调用 insert 函数， Drools 会**重新**与所有规则再重新匹配一次，对于没有设置 no-loop 属性为 true 的规则，如果条件满足，不管之前是否执行过都会再执行一次，这个特性不仅存在于 insert 函数，update，retract 宏函数都有该特性，所以某些情况下考虑不周可能造成死循环。

### update
对 Fact 进行更新，比如更新 Fact 中的某个字段，对应的相关的 Fact 都会更新，然后会通知 Drools 引擎该修改。

### retract
用来将 Working Memory 中某个 Fact 对象删除。

### modify
对 Fact 对象多个属性修改，修改完成后自动更新到当前 Working Memory 中。

```
modify ( <fact-expression> ) {
    <expression>,
    <expression>,
    ...
}
```

## 属性部分 {#attributes}
**规则属性**是用来控制规则执行的重要工具，显示地声明了对规则行为的影响。


规则的属性有 13 个

- activation-group
- agenda-group
- auto-focus
- date-effective
- date-expires
- dialect
- duration
- enabled
- lock-on-active
- no-loop
- ruleflow-group
- salience
- when

### salience

salience 用来设置规则执行的**优先级**，salience 属性值是一个数字，数字越大优先级越高，可以是负值。`salience` 表示规则的优先级，值越大在激活队列中优先级越高。

- 默认情况下，规则的 salience 是 0
- type: Integer

所以不手动设置规则的 salience 属性情况下，执行的顺序是随机的。

    rule "rule1"
    salience 1
    when
        eval(true)
    then
        System.out.println("rule1");
    End

### no-loop

no-loop 属性的作用是用来控制已经执行过的规则在条件再次满足时是否再次执行。默认情况下规则的 no-loop 属性的值为 false，如果 no-loop 属性值为 true，那么就表示该规则只会被引擎检查一次。

当规则的 RHS 改变了 LHS 条件会导致该规则重新匹配执行，可以合理地使用来避免 Drools 规则进入死循环。

- 默认值：false
- type: Boolean

在上面提到的 insert 后，如果没有设置 no-loop 的规则会再检查一次。

### date-effective
控制规则只有在到达指定时间后才会触发。只有当系统时间 `>=date-effective` 设置的时间值时，规则才会触发执行，否则执行将不执行。在没有设置该属性的情况下，规则随时可以触发，没有这种限制。

date-effective 可接受的日期格式为 “dd-MMM-yyyy”

    rule "rule1"
    date-effective "25-Sep-2019"
    when
        eval(true);
    then
        System.out.println("rule1 is execution!");
    End

### date-expires
该属性的作用与 date-effective 属性恰恰相反， date-expires 的作用是用来设置规则的有效期。如果 date-expires 的值大于系统时间，那么规则就执行，否则就不执行。

### enabled
设置是否可用

### dialect
该属性用来定义规则当中要使用的语言类型，目前 Drools 版本当中支持两种类型的语言：`mvel` 和 `java`，默认情况下，如果没有手工设置规则的 dialect，那么使用的 java 语言。

- type: String

想要了解 `mvel` 和 `java` 这两个方言的区别可以参考：[[Drools 规则中 mvel 和 java 的差别]]，一句话总结一下就是 MVEL 是 Java 实现的一套表达式解析语言。

### duration
如果设置了该属性，那么规则将在该属性指定的值之后在另外一个线程里触发。该属性对应的值为一个长整型，单位是毫秒。

    rule "rule1"
    duration 3000
    when
	  eval(true)
    then
      System.out.println("rule thread
      id:"+Thread.currentThread().getId());
    end


### lock-on-active
确认规则只执行一次。 将 `lock-on-action` 属性的值设置为 true，可能避免因某些 Fact 对象被修改而使已经执行过的规则再次被激活执行。lock-on-active 是 no-loop 的增强版属性。

一个组里面的多条规则都可以设置这个标志，当使用了这个标志的规则中的一条被成功触发后，会阻止其他规则的触发。

- lock-on-active 属性默认值为 false
- type: Boolean

不管何时 `ruleflow-group` 和 `agenda-group`被激活，只要其中的所有规则将 `lock-on-active` 设置为 true，那么这些规则都不会再被激活。

宏函数 `insert`, `update`, `retract` 都可以对 fact 进行操作，这些动作都可以导致 rule 重新匹配。

### activation-group
该属性的作用是**将若干个规则划分成一个组**，用一个字符串来给这个组命名，这样在执行的时候，具有相同 activation-group 属性的规则中只要有一个会被执行，其它的规则都将不再执行。

- type: String

在一组具有相同 `activation-group` 属性的规则当中，**只有一个规则会被执行**，其它规则都将不会被执行。当然对于具有相同 `activation-group` 属性的规则当中究竟哪一个会先执行，则可以用类似 `salience` 之类属性来实现。

    rule "rule1"
    activation-group "test"
    when
        eval(true)
    then
        System.out.println("rule1 execute");
    end

    rule "rule 2"
    activation-group "test"
    when
        eval(true)
    then
        System.out.println("rule2 execute");
    End

rule1 和 rule2 这两个规则因为具体相同名称的 activation-group 属性，所以它们只有一个会被执行。

### agenda-group
Agenda Group 是用来在 Agenda 的基础之上，对现在的规则进行再次分组，具体的分组方法可以采用为规则添加 agenda-group 属性来实现。

- 默认值： MAIN
- type: String

agenda-group 属性的值也是一个字符串，通过这个字符串，可以将规则分为若干个 Agenda Group，默认情况下，引擎在调用这些设置了 agenda-group 属性的规则的时候需要显示的指定某个 Agenda Group 得到 Focus（焦点），这样位于该 Agenda Group 当中的规则才会触发执行，否则将不执行。

    rule "rule1"
    agenda-group "001"
    when
    eval(true)
    then
    System.out.println("rule1 execute");
    end

    rule "rule 2"
    agenda-group "002"
    when
    eval(true)
    then
    System.out.println("rule2 execute");
    End

java 代码

    //getSession 获取 KieSession 的方法自己写的。
    KieSession ks = getSession();
    // 设置 agenda-group 的 auto-focus 使其执行
    ks.getAgenda().getAgendaGroup("group1").setFocus();

当这个 group 被 `setFocus` 的时候，会将整个组压入栈中，执行的时候再取出来。

在 Drool 的规则 RHS 中还可以

```
kcontext.getKieRuntime().getAgenda().getAgendaGroup("Route-AgeRange").setFocus();
```


### auto-focus
在已设置了 agenda-group 的规则上设置该规则是否可以自动独取 Focus，如果该属性设置为 true，那么在引擎执行时，就不需要显示的为某个 Agenda Group 设置 Focus，否则需要。

- 默认：false
- type: Boolean

对于规则的执行的控制，还可以使用 Agenda Filter 来实现。在 Drools 当中，提供了一个名为 org.drools.runtime.rule.AgendaFilter 的 Agenda Filter 接口，用户可以实现该接口，通过规则当中的某些属性来控制规则要不要执行。org.drools.runtime.rule.AgendaFilter 接口只有一个方法需要实现，方法体如下：

    public boolean accept(Activation activation);

在该方法当中提供了一个 Activation 参数，通过该参数我们可以得到当前正在执行的规则对象或其它一些属性，该方法要返回一个布尔值，该布尔值就决定了要不要执行当前这个规则，返回 true 就执行规则，否则就不执行。

在引擎执行规则的时候，我们希望使用规则名来对要执行的规则做一个过滤，此时就可以通过 AgendaFilter 来实现，示例代码既为我们实现的一个 AgendaFilter 类源码。

    import org.drools.runtime.rule.Activation;
    import org.drools.runtime.rule.AgendaFilter;
    public class TestAgendaFilter implements AgendaFilter {
        private String startName;
        public TestAgendaFilter(String startName){
            this.startName=startName;
        }
    public boolean accept(Activation activation) {
            String ruleName=activation.getRule().getName();
            if(ruleName.startsWith(this.startName)){
                return true;
            }else{
                return false;
            }
        }
    }

过滤方法是规则名的前缀，通过 Activation 得到当前的 Rule 对象，然后得到当前规则的 name，再用这个 name 与给定的 name 前缀进行比较，如果相同就返回 true，否则就返回 false。

java:

    TestAgendaFilter filter = new TestAgendaFilter("activation")
    int count = ks.fireAllRules(filter)

### ruleflow-group
在使用规则流的时候要用到 ruleflow-group 属性，该属性的值为一个字符串，作用是用来将规则划分为一个个的组，然后在规则流当中通过使用 ruleflow-group 属性的值，从而使用对应的规则。

- type: String

简单的来说，只有当被 `ruleflow-group` 圈定的组被激活时，ruleflow-group 中的规则才能被命中。

## 函数
代码块，封装多个规则中可能共享的相同规则代码

    function void/Object functionName(Type arg ...) {
    }

使用定义的 function，则需要 `import function`，通过 import 语句，实现将 Java 类中静态方法引入到一个规则文件中，使得该文件中规则可以像普通 Drools 函数一样来使用 Java 类中的静态方法

    import function test.RuleTools.printInfo;

调用

    RuleTools.printInfo(...)


## reference

- <https://training-course-material.com/training/Category:Drools>
- <https://docs.jboss.org/drools/release/5.2.0.CR1/drools-expert-docs/html/ch05.html>
- <https://docs.jboss.org/drools/release/7.35.0.Final/drools-docs/html_single/#_droolslanguagereferencechapter>
- <http://support.streamx.co/intro/basic-drools-rule-language-syntax-cont>
- <https://shift8.iteye.com/blog/1915351>
- <http://holbrook.github.io/2012/12/06/rule_language.html>
- <https://blog.csdn.net/u012373815/article/details/53872025>

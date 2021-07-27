---
layout: post
title: "《Effective Java》读书笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [android, java, design-pattern, ]
last_updated: 2016-11-08
---


Java 语言中存在四种类型：

- 接口 interface
- 类 class
- 数组 array
- 基本类型 primitive type

前三种是引用类型，类实例和数组是对象，基本类型不是对象。

在 Java 中一共有 8 种基本数据类型，其中有 4 种整型，2 种浮点类型，1 种用于表示 Unicode 编码的字符单元的字符类型和 1 种用于表示真值的 boolean 类型。（一个字节等于 8 个 bit）

1. 整型

类型   | 存储需求    | bit 数  |  取值范围   |   备注
-------|--------------|-------|----------------|---------- |
byte   | 1 字节       | 1*8   |  -128～127     |
short  | 2 字节       | 2*8   | -32768～32767  |
int    | 4 字节       | 4*8   | -2^31 ~ 2^31-1 |
long   | 8 字节       | 8*8   | -2^63 ~ 2^63-1 |

Integer.MAX_VALUE =  2147483647
Integer.MIN_VALUE = -2147483648

Long.MAX_VALUE =  9223372036854775807
Long.MIN_VALUE = -9223372036854775808


2. 浮点型

类型    | 存储需求   |   bit 数  | 取值范围  |     备注
--------| ---------|---------|-----------|-----------
float   | 4 字节    |  4*8  | 2^-149 ~ (2-2^-23)·2^127 | float 类型的数值有一个后缀 F（例如：3.14F)
double  | 8 字节    |  8*8  | 2^-1074 ~ (2-2^-52)·2^1023    | 没有后缀 F 的浮点数值（如 3.14) 默认为 double 类型， Double 有静态变量 `MIN_VALUE` 和 `MAX_VALUE`。

3.char 类型

类型    |     存储需求  |   bit 数  |   取值范围   |   备注
---------|------------|----------|-------------|----------
char     | 2 字节       |   2*8    | 0 ~ 65,535  |

4.boolean 类型

类型   |  存储需求  |   bit 数   |  取值范围    |   备注
-------|------------|----------|-------------|----------
boolean | 1 字节    |  1*8  |   false、true |

补充：Java 有一个能够表示任意精度的算术包，通常称为“大数值”(big number)。虽然被称为大数值，但它并不是一种 Java 类型，而是一个 Java 对象。
如果基本的整数和浮点数精度不能够满足需求，那么可以使用 `java.math` 包中的两个很有用的类：`BigInteger` 和 `BigDecimal` (Android SDK 中也包含了`java.math`包以及这两个类）这两个类可以处理包含任意长度数字序列的数值。BigInteger 类实现了任意精度的整数运算，BigDecimal 实现了任意精度的浮点数运算。具体的用法可以参见 Java API。

BigInteger 和 BigDecimal 都是不可变 immutable ，类似于 String， 在使用

```
BigInteger sum = new BigInteger.valueOf(0);
sum.add(BigInteger.valueOf(10));    // wrong way, sum is still 0
sum = sum.add(BigInteger.valueOf(10));   // right way, add() return a BigInteger Object.
```

## 第 1 章：创建和销毁对象 {#create-destroy-object}

### 1. 静态工厂方法代替构造器
优点：

1. 静态工厂方法有名字；
2. 不必要每次调用的时候都创建一个新的对象。
3. 返回原返回类型的任何子类型对象。
4. 创建参数化类型实例的时候使代码变得更加简洁。

### 2. 遇到多个构造器参数时要考虑使用构造器

Builder 模式的优势：

- 代码易读，模拟了具名的可选参数
- build 方法可检验约束条件
- builder 可以自动填充某些域，比如每次创建对象的时自动增加序列号

何时使用 Builder 模式：

- 类的构造器或者静态工厂方法中具有**多个**参数时，设计这种类构造方式时可以考虑 Builder 模式，尤其是当大多数参数都是可选的时候。
- 当类的参数初始化时有相互关联时使用 Builder 模式。

### 3. 用私有构造器或者枚举类型强化 Singleton 属性

共有静态成员 final 域

    public class Elvis {
        public static final Elvis INSTANCE = new Elvis();
        private Elvis() { … }
        public void leaveTheBuilding() {…}
    }

静态方法所有调用，都会返回同一个对象引用，不会创建其他 Elvis 实例。


公有的成员是静态工厂方法：

```
public class Elvis {
    private static final Elvis INSTANCE = new Elvis();
    private Elvis() { … }
    public static Elvis getInstance() { return INSTANCE; }

    public void leaveTheBuilding() {…}
}
```


### 4. 通过私有构造器强化不可实例化的能力

希望一个类不能被实例化，则私有化构造方法

### 5. 避免创建不必要的对象

```
String s1 = "string";

String s2 = new String("string");  // don‘t do this

```

当心无意识的基本类型自动装箱。

### 6. 清除过期的对象引用

Java 内存泄露可能发生在：

- 类自我管理内存

    比如在实现 Stack 栈时，弹出栈时，消除对象引用，结束变量的生命周期。

- 缓存
- 监听器或者其他回调。


### 7. 避免使用终结方法
提供显式的终止方法，要求类客户端在每个实例不再有用的时候调用这个方法。Java 中 FileInputStream，FileOutputStream，Timer 和 Connection 都具有终结方法。


## 第 3 章
所有对象都通用的方法，非 final 方法（equals、hashCode、toString、clone 和 finalize）都有明确的通用约定，被设计成被覆盖。

### 8. 覆盖 equals 时请遵守通用约定

类的每个实例都只与它自身相等：

- 类的每个实例本质都是 **唯一** 的
- 不关心类是否提供“逻辑相等”的测试功能
- 超类已经覆盖 equals，从超类继承过来的行为对于子类也合适
- 类是私有的或者包级私有，可以确定 equals 方法永远不会被调用

什么时候覆盖 Object.equals ？

- 类具有特定“逻辑相等”概念，不等同于对象等同的概念。
- 并且超类没有覆盖 equals 实现。

equals 等价关系：自反，对称，传递，一致

里氏替换原则 Liskov substitution principle ，类型的任何重要属性也将适用于它的子类型。

### 9. 覆盖 equals() 时一定要覆盖 hashCode()


### 10. 始终覆盖 toString
将类的基本信息放入。IDE 中一般可以自动生成该方法。

### 11. 谨慎地覆盖 clone
浅拷贝指拷贝对象时仅仅拷贝对象本身（包括对象中的基本变量），而不拷贝对象包含的引用指向的对象。深拷贝不仅拷贝对象本身，而且拷贝对象包含的引用指向的所有对象。

### 12. 考虑实现 Comparable 接口
实现对象实例之间的比较。


## 第 4 章

### 13. 类和成员的可访问性最小化

encapsulation 封装，模块化

原因：有效地解除组成系统各个模块之间的耦合关系，使得模块之间可以独立开发、测试、优化、使用、理解和修改。

- 尽可能使每个类或者成员不被外界访问
- 实例域决不能是拥有的
- 类具有公有的静态 final 数组域，或者返回这种域的访问方法，总是错误的，客户端能够轻易的修改数组中的内容


类成员的公开级别：

- 私有 private，只有声明该类的内部才能访问
- 包级私有 package-private    缺省访问级别，声明该成员的包内部任何类都能访问
- 受保护 protected，声明该类的子类可以访问，包内部其他类可以访问
- 公有 public，任何地方都可以访问，如果做成公有接口，则需要考虑并有责任永远支持该方法，以保持兼容性


公有的静态 final 域来暴露常量，惯例，使用 大写字母 加 下划线，这些域要么包含基本类型，要么包含指向不可变对象的引用。



### 14. 公有类中使用访问方法而非公有域
未来改变类的内部表示时非常有效，如果类是包级私有，或者私有嵌套类，直接暴露数据域并没有本质的错误。


### 15. 使可变性最小化

不可变类 实例不能被修改，实例包含的信息必须在创建时提供，并且在对象生命周期内固定不变。 String 基本类型包装类， BigInteger 和 BigDecimal 是不可变类。

原因：不可变类易于设计、实现和使用，不容易出错，更加安全

类不可变类要遵循一下规则：

- 不要提供任何会修改对象状态的方法
- 保证类不会被扩展， 将类定义成 final 类
- 使所有域都是 final
- 使所有域都是私有的
- 确保任何可变组件互斥访问，

优点：1. 不可变对象本质上是线程安全的，他们不要求同步。2. 不可变对象可以被自由地共享，将频繁使用的值提供公有的静态 final 常量，将频繁被请求的实例缓存起来，当现有实例可以符合请求时，不用创建新的实例。基本类型的包装类和 BigInteger 都有这样的静态工厂。3. 不可变对象为其他对象提供了大量的构建。

缺点：不可变类唯一的缺点就是，对于每个不同的值都需要一个单独的对象。


### 16. 复合优先于继承

不扩展现有的类，而是在新的类中增加一个私有域引用一个类的实例，这种设计叫做“复合” Composition。

优点：与方法调用不用，继承打破了封装性，子类依赖于父类中特定功能的实现细节，因此复合被提出，不扩展现有的类，而是在新的类中增加一个私有域来组成新的类。

缺点：包装类没什么缺点，但需要注意，包装类不适合用在回调框架 callback framework。



### 17. 为继承而设计，提供文档说明，否则就禁止继承

类必须有文档说明它可覆盖的方法的自用性。在发布类之前，编写子类进行测试。

为了允许继承，类需要遵守的约束条件：

- 构造函数**绝不能**调用可被覆盖的方法
- clone 和 readObject 都不可以调用可覆盖的方法，不管是以直接还是间接的方式。
- 如果决定在一个为了继承而设计的类中实现 Serializable ，并且该类有 readResolve 或者 writeReplace 方法，则必须使 readResolve 或者 writeReplace 成为受保护的方法，而不是私有方法。


两种方法禁止子类化：

- 声明类 final class
- 所有构造函数变成私有，或者包级私有

### 18. 接口优于抽象类

Java 提供两种机制，来允许多实现，接口与抽象类。重要区别在于：

- 抽象类 **允许包含某些方法的实现** ，接口则不允许
- 为了实现抽象类定义的类型，类必须成为抽象类的子类，Java 只允许单继承，抽象类受到一些限制

优点：

- 现有的类可以很容易被更新，实现新的接口
- 接口是定义 mixin （混合类型）的理想选择
- 接口允许我们构造非层次结构的类型框架

### 19. 接口只用于定义类型

常量接口 constant interface ，不包含任何方法，只包含静态 final 域，每个域都是一个常量。反面，不值得使用。

导出常量可选合理方案，将常量添加到 **相关类** 或者接口中，尽量使用枚举类型 enum type，否则应该使用不可实例化的工具类 utility class 来导出常量。

接口只应该被用来定义类型，不应该被用来导出常量。

### 20. 类层次优于标签类

标签类指在类中用标签区别类的行为模式，比如使用枚举变量，更加枚举不同显示不同内容。尽量**不使用标签类**，使用子类抽象，将标签类中每个方法都定义成一个包含抽象方法的抽象类。

### 21. 用函数对象表示策略

允许程序把“调用特殊函数的能力”存储起来并且传递这种能力，这种机制允许函数调用者通过传递第二个函数，来指定行为。


执行对象上的某项操作，能够实现函数指针。

Comparator


### 22. 优先考虑静态成员类

嵌套类 nested class 指被定义在另一个类内部的类。

嵌套类有四种：

- 静态成员类 static member class
- 非静态成员类 nonstatic member class
- 匿名类 anonymous class
- 局部类 local class

除去第一种之外，其他三类都被称为内部类 inner class。

静态成员类，最简单的嵌套类，普通类，静态成员类可以访问外围类的所有成员，包括私有。访问性原则同类中其他成员。

静态成员类，常见用法作为公有辅助类，与外部类一起使用时才有意义。



非静态成员类，语法层面只有一个 static 修饰符的不同，但是两者区别很大。非静态成员类的每一个实例都隐含着与外围类的一个外围实例 enclosing instance。嵌套的实例需要外围类的实例。



非静态成员类的一种常见用法是定义 adapter，它允许外部类的实例被看做是另一个不相关的类的实例。



私有静态成员类 常见用法是代表外围类所代表的对象的组件。



匿名类没有名字，在使用的同时被声明和实例化。匿名类可以出现在代码中任何允许存在表达式的地方。



匿名类的一种常见用法是动态地创建函数对象 function object。 另一种常见用法是创建过程对象 process object ，比如 Runnable ， Thread 或者 TimeTask 实例。第三种常见用法是在静态工厂方法的内部。



局部类是嵌套类中用得最少的类。任何可以声明局部变量的地方都可以声明局部类。



成员类的每个实例都需要一个指向外围实例的引用，就要把成员类做成非静态的，否则做成静态的。



嵌套类属于方法内部，只需要一个地方创建实例，匿名类，否则就是局部类


### 23. 不在新代码中使用原生态类型



尽早发现错误，最好是编译时就发现。 在 Java 1.5 之前，运行时，集合，才会发现错误。

### 24. 消除非受检警告



非受检强制转化警告 unchecked cast warnings

非受检方法调用警告

非受检普通数组创建警告

非受检转换警告 unchecked conversation warnings



尽可能小的使用 SuppressWarnings("unchecked") 注解


### 25. 列表优先 于数组

数组是协变 covariant 的，泛型是不可变的 invariant。

数组在运行时才知道并检查元素类型。泛型在编译时就能检查类型。[[Java 泛型的协变与逆变]]

### 26. 优先考虑泛型

### 27. 优先考虑泛型方法

编写泛型方法和编写泛型类相似

泛型方法的特性是，无需明确指定类型参数的值，编译器通过检查方法参数的类型来计算类型参数的值。类型推导。


### 28. 利用有限制通配符来提升 API 的灵活性

参数化类型是不可变的

`Interface Iterable<T>` 接口，实现这个接口可以让对象使用 foreach 循环，或者使用

    // If you have Iterable<String> , you can do:
    for (String str : myIterable) {
        ...
    }


大部分的容器类都实现了这个接口。

<http://docs.oracle.com/javase/6/docs/api/java/lang/Iterable.html>

Java 提供了特殊的参数化类型，有限制的通配符类型 bounded wildcard type

### 29. 优先考虑类型安全的异构容器

## 第 5 章



## 第六章
枚举和注解， Java 1.5 版本中增加两个引用类型家族：1. 新的类枚举类型（enum type） 2. 新的接口注解类型（annotation type）。

### 30. 用枚举类型 enum 代替 int 常量

枚举类型是指由一组固定常量组成合法值的类型。

优点：

- 采用 int 枚举模式，程序非常脆弱
- 将 int 枚举打印成字符串没有便利方法
- 使用 String 常量无效

### 31. 用实例域代替序数

所有枚举都有 ordinal 方法，返回枚举常量在类型中的位置，不要使用该方法。永远不要根据枚举的序数导出与它关联的值，而是应该将它保存到实例域中。


### 32. 用 EnumSet 代替位域



### 33. 用 EnumMap 代替序数索引



### 34. 用接口模拟可伸缩的枚举



### 35. 注解优先于命名模式

不必定义注解类型，但是都应该使用 java 平台所提供的预定义注解类型。



### 36. 坚持使用 Override 注解





### 37. 用标记接口定义类型

标记接口 marker interface 没有包含任何方法声明的接口，指明一个类实现的某种属性的接口。



## 第 7 章

设计方法的参数，返回值

### 38. 检查参数的有效性



### 39. 必要时进行保护性拷贝

在传入可变参数时需要特别注意，外部可能会通过改变传入参数而间接的影响到类内部的实现。因此需要在初始化的时候进行保护性拷贝。



### 40. 谨慎设计方法签名



- 谨慎地选择方法名称，遵循命名习惯

- 不过于追求提供便利的方法

- 避免过长的参数列表



有三种方法可以缩短长参数列表

- 将方法拆解成多个方法

- 创建辅助类 helper class ， 保存参数分组，一般作为静态成员类

- 从对象构建到方法调用都采用 Builder 模式，多次 setter



对于参数类型，要优先使用接口而非类， Map 接口作为参数，可以传入 Hashtable， HashMap，TreeMap，TreeMap 子映射表 submap 等等



对于 boolean 参数，优先使用两个元素的枚举类型



### 41. 慎用重载

永远不要导出两个具有相同参数数目的重载方法。







### 42. 慎用可变参数

Java 1.5 版本中增加了 可变参数 varargs 方法，一般称为 variable arity method 。可匹配不同长度的变量的方法。



可变参数方法接受 0 个或者多个指定类型的参数，先创建一个数组，数组大小为在调用位置所传递的参数数量，然后将参数值传到数组中，最后将数组传递给方法。



### 43. 返回零长度的数组或者集合，而不是 null





### 44. 为所有导出的 API 元素编写文档注释

方法的文档应该简洁地描述出它和客户端之间的约定。



## 第八章



### 45. 将局部变量的作用域最小化

几乎每一个局部变量的声明都应该包含一个初始化表达式。



### 46. for-each 循环优于传统 for 循环

有三种情况无法使用 for-each 循环


- 过滤 ---- 需要遍历集合，使用 remove 方法
- 转换 ---- 需要低缓其中部分或者全部数据
- 平行迭代 ---- 并行遍历多个集合



### 47. 了解使用类库

使用标准类库，可以充分利用这些编写标准类库的专家知识，以及在你之前其他人的使用经验。

将时间花在应用程序上，而不是底层细节。



都应该熟悉 

- java.lang  
- java.util   
- java.io 中的内容。
- java.util.concurrent  并发工具


### 48. 需要精确的答案，避免使用 float 和 double

使用 BigDecimal 做精确计算。

使用 int 或者 long  数值范围没有超过 9 位十进制数，可以使用 int，没有超过 18 位，可用 long ，超过 18 位，就必须使用 BigDecimal.


### 49. 基本类型优先于装箱基本类型

基本类型 primitive  int double boolean

对应的引用类型  reference type ，称为装箱基本类型 boxed primitive ，对应为 Integer、Double、Boolean

何时使用装箱基本类型： 

- 作为集合中的元素、键、值


### 50. 如果其他类型更适合，则尽量避免使用字符串 

- 字符串不适合代替其他的值类型 
- 字符串不适合代替枚举类型 
- 字符串不适合代替聚集类型，如果需要用 String 来描述实体，通常不建议这样做，通常应该用一个私有静态成员类来描述。 
- 字符串不适合代替能力表 capabilities



如果可以使用更加合适的数据类型，或者可以编写更加合适的数据类型，就应该避免使用字符串来表示对象。



### 51. 小心字符串连接的性能

字符串连接操作符 “+”

获得可接受的性能，使用 StringBuilder 代替 String     append 方法

### 52. 通过接口引用对象

使用接口作为类型，程序会更加灵活


### 53. 接口优先于反射机制

核心反射机制 core reflection facility    java.lang.reflect  通过程序来访问关于已装载的类信息的能力。给定 Class 实例，可以获得 Constructor  Method 和 Field 实例。



丧失了编译时类型检查的好处

执行反射访问所需要的代码笨拙冗长

性能损失

反射功能只是在设计时被用到，通常普通应用程序在运行时不应该以反射方式访问对象。


### 54. 谨慎使用本地方法

JNI 方法调用本地 Native method



### 55. 谨慎地进行优化 

- 规则 1：不要进行优化
- 规则 2：（仅针对专家）还是不要进行优化，再没有绝对清晰的未优化方案之前不要进行优化


不要试图去编写快速的程序 ---- 应该努力编写好的程序，速度随之而来。再设计系统时，设计 API、线路层协议和永久数据格式时候，一定要考虑性能因素。


### 56. 遵守普遍接受的命名惯例 

包名，层次，句号分割，小写字母和数字（少使用） 不以 java 和 javax 开头

包名其余部分通常不超过 8 个字符



## 第九章 异常



### 57. 只针对异常情况才使用异常

### 58. 对可恢复的情况使用受检异常，对编程错误使用运行异常

Java 提供三种可抛出结构：



- 受检的异常 checked exception

- 运行时异常 run-time exception

- 错误 error



期望调用者能够适当地恢复，使用受检异常。



用运行时异常来表明编程错误。



runtimeException 子类

1、 java.lang.ArrayIndexOutOfBoundsException
数组索引越界异常。当对数组的索引值为负数或大于等于数组大小时抛出。
2、java.lang.ArithmeticException
算术条件异常。譬如：整数除零等。
3、java.lang.NullPointerException
空指针异常。当应用试图在要求使用对象的地方使用了 null 时，抛出该异常。譬如：调用 null 对象的实例方法、访问 null 对象的属性、计算 null 对象的长度、使用 throw 语句抛出 null 等等
4、java.lang.ClassNotFoundException
找不到类异常。当应用试图根据字符串形式的类名构造类，而在遍历 CLASSPAH 之后找不到对应名称的 class 文件时，抛出该异常。

   5、java.lang.NegativeArraySizeException  数组长度为负异常
   6、java.lang.ArrayStoreException 数组中包含不兼容的值抛出的异常
   7、java.lang.SecurityException 安全性异常
   8、java.lang.IllegalArgumentException 非法参数异常

2.IOException
IOException：操作输入流和输出流时可能出现的异常。
EOFException   文件已结束异常
FileNotFoundException   文件未找到异常
3. 其他
ClassCastException    类型转换异常类
ArrayStoreException  数组中包含不兼容的值抛出的异常
SQLException   操作数据库异常类
NoSuchFieldException   字段未找到异常
NoSuchMethodException   方法未找到抛出的异常
NumberFormatException    字符串转换为数字抛出的异常
StringIndexOutOfBoundsException 字符串索引超出范围抛出的异常
IllegalAccessException  不允许访问某类异常
InstantiationException  当应用程序试图使用 Class 类中的 newInstance() 方法创建一个类的实例，而指定的类对象无法被实例化时，抛出该异常


### 59. 避免不必要地使用受检的异常





### 60. 优先使用标准异常



### 61. 抛出与抽象相对应的异常



### 62. 每个方法抛出的异常都要有文档



### 63. 在细节消息中包含能捕获失败的信息



### 64. 努力使失败保持原子性





### 65. 不要忽略异常



## 第十章

并发



### 66. 同步访问共享的可变数据
synchronized 保证同一个时刻只有一个线程执行某一段代码块

什么时候使用锁：

- 当多个线程共享可变数据时，每个读或者写数据的线程都必须执行同步。

### 67. 避免过度同步


### 68. executor 和 task 优先于线程



### 69. 并发工具优先于 wait 和 notify



### 70. 线程安全性的文档化

文档说明类是否可以被多个线程安全使用



- 不可变 immutable  类实例不可变，不需要外部同步，String  Long BigInteger

- 无条件的线程安全 unconditionally thread-safe  实例可变，但是有足够的内部同步 ，实例可被并发使用，无需外部同步， Random ConcurrentHashMap

- 有条件的线程安全 conditionally thread-safe    Collections.synchronized

- 非线程安全 not thread-safe  类实例可变，需要外部同步   ArrayList  HashMap

- 线程对立  thread-hostile 类不能安全地被多个线程并发使用





### 71. 慎用延迟初始化



### 72. 不要依赖于线程调度器

依赖于线程调度器的程序，很有可能都是不可移植的。



### 73. 避免使用线程组



## 第 11 章

序列化

将对象编码成字节流，对象序列化

### 74. 谨慎地实现 Serializable 接口

序列化成功需要：

- 实现 java.io.Serializable
- 类的属性必须是可序列化的

Externalizable 接口继承了 java 的序列化接口，并增加了

    void writeExternal(ObjectOutput out) throws IOException;
    void readExternal(ObjectInput in) throws IOException, ClassNotFoundException;





为继承而设计的类，尽量避免去实现 Serializable 接口。


内部类不应该实现 Serializable， 静态成员类可以


### 75. 考虑使用自定义的序列化形式



### 76. 保护性编写 readObject 方法


### 77. 对于实例控制，枚举类型优先于 readResolve





### 78. 考虑用序列化代理代替序列化实例

























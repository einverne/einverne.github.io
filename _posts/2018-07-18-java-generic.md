---
layout: post
title: "Java 查漏补缺之泛型"
tagline: ""
description: ""
category: Java
tags: [java, generics, programming, linux]
last_updated:
---

简而言之，泛型使类型（类和接口）在定义类，接口和方法时成为参数。类型参数提供了一种简便的方法，使得不同的输入类型可以使用相同的代码。


## 为什么需要泛型
在强类型语言中，如果定义一个具有具体类型的类，那么这个类就只能被该类型使用。

Generics 给类，接口和方法提供了一个参数化的实现方式，使得同一个类定义，方法定义可以处理不同的类型。Oracle 官方的文档有一句话说得特别好：

> Much like the more familiar _formal parameters_ used in method declarations, type parameters provide a way for you to re-use the same code with different inputs.

在方法定义的时候使用的是 `formal parameters` （形式参数），在调用方法的时候会将实际参数传递给形式参数，传递的是值，而泛型（Generics）则是传递的类型（Types）。

Java 编译期会在编译阶段检查类型。

使用泛型的代码比非泛型代码有如下好处：

- 在编译时进行类型检查，减少错误
- 消除了强制类型装换
- 可以让编程人员更加容易实现通用算法


## 定义
通常情况下，泛型类 (generic class) 可以如下定义

    class name<T1, T2, ..., Tn> { /* ... */ }

尖括号中的类型通常称为类型参数（ type parameters 或者称为类型变量 type variables），一旦类定义了类型参数`T` ，该变量就能在类中使用。

### Type Parameter 命名约定
按照惯例， type parameters 的名字都是单一的大写字母，通常和普通的[命令规范](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html#naming) 区别开来。

经常被使用的泛型变量有：

- `E` for `Element` 被 Java Collections 框架广泛使用
- `K` for `Key` ， K V 经常被 Java Collections 框架中的 Map 使用
- `N` for `Number`
- `T` for `Type`
- `V` for `Value`
- `S,U,V etc` - 2nd, 3rd, 4th types

### 调用和实例化泛型类型
泛型的调用其实非常简单，只需要将类型参数替换为具体的类型即可，比如

    List<String> list;

> Type Parameter 和 Type Argument 术语：大部分情况下这两个术语是可以互换的，但他们的使用场景是不一样的。因此 `Foo<T>` 中的 T 是 type Parameter，而 `Foo<String>` 中的 String 是 type argument.

## 泛型使用

### 泛型方法

对于静态泛型方法（static generic method)， type parameter 定义的区域需要出现在返回值的前面

    public static <K, V> boolean compare(Pair<K, V> p1, Pair<K, V> p2) {...}

调用该方法的完整的方式：

    boolean same = Util.<Integer, String>compare(p1, p2);
    // or
    boolean same = Util.compare(p1, p2);

### 泛型类
泛型类也需要声明类型变量，放在类名后

```
class GenericClass<ID, T> {}

class SubGenericClass<T> extends GenericClass<Integer, T> {}
```

### 泛型接口
和泛型类相似，需要在接口名后面声明类型变量，作用于接口中的抽象方法返回类型和参数类型。

```
interface GenericInterface<T> {
    T append(T seg);
}
```

## 有界类型参数 {#bounded-type-parameters}
总有一种情况，编程人员想要限制泛型的类型，比如一个操作数字的类或者方法，可能希望泛型只接受 Number 或者其子类的实例。

定义上界，比如 `<E extends Comparable>` 在这个例子中，表示定义的泛型需要实现 Comparable 接口，这里的 `extends` 只是通用表示 `extends (Class)` 或者 `implements (interfaces)`

如果要定义多个界

    <T extends B1 & B2 & B3>

在定义多个界时，需要将 Class 类型放到 interface 之前，比如说上面的例子中假如有 Class B2， interface B1 & B3 ，那么 B2 必须是第一个。

## 通配符 {#wildcards}
在代码中也经常能看到 `?` 问号，通常叫做通配符（wildcard），表示是类型未知。通配符可以用在非常多的场景，作为参数，field，或者本地变量，有时候也作为返回值（当然不推荐这么做）。

### Upper Bounded Wildcards

    public static void process(List<? extends Foo> list) { /* ... */ }

upper bounded wildcard，`List<? extends Foo>` 其中 Foo 是类型，表示 Foo 和任何子类。

### Unbounded Wildcards
无界通配符类型（upper bounded wildcard），通常表示的单纯的使用 `?` ，比如 `List<?>`，表示的是一个不知道类型的 list。有两种常用的使用场景

- 当写方法只需要 `Object` 类中的方法时
- 在泛型类中定义的方法不依赖于 type parameter 时，比如 List.size() 或者 List.clear ，并不依赖于定义的泛型类型

举一个官方文档中的例子，假设有如下的方法

    public static void printList(List<Object> list) {
        for (Object elem : list)
            System.out.println(elem + " ");
        System.out.println();
    }

本意上是想要实现打印一个任何类型的列表，但是并不能达到目的，他并不能打印 `List<Integer>`, `List<String>` 等，因为他们并不是 `List<Object>` 的子类型，如果要实现通用的 `printList` 方法需要使用 `List<?>`

    public static void printList(List<?> list) {
        for (Object elem: list)
            System.out.print(elem + " ");
        System.out.println();
    }

这个时候 `List<Integer>` 才是 `List<?>` 的子类型。

### Lower Bounded Wildcards
和类型的上界使用 `extends`，相同的是，如果要表示类型的下界，则使用 `super`，比如 `<? super A>` 。需要注意的是，对于通配符 `?` 可以单独指定上界，也可以指定下界，但是两者不能同时指定。

    public static void addNumbers(List<? super Integer> list) {
        for (int i = 1; i <= 10; i++) {
            list.add(i);
        }
    }

代码可以在 `List<Integer>, List<Number>, and List<Object> — anything that can hold Integer values.` 上运行。

假设

    class A { /* ... */ }
    class B extends A { /* ... */ }

都知道 B 是 A 的子类型，所以可以

    B b = new B();
    A a = b;

所以对于泛型类型呢？

    List<B> listB = new ArrayList<>();
    List<A> listA = listB;        // 编译错误

`List<Number>` 和 `List<Integer>` 都是 `List<?>` 的子类型，而 `List<Number>` 和 `List<Integer>` 这两者并没有任何关系。

为了让两者有关系，就需要用多泛型的上界，这样

    List<? extends Integer> intList = new ArrayList<>();
    List<? extends Number>  numList = intList;  // OK. List<? extends Integer> is a subtype of List<? extends Number>

下面有一张图来表示 List 类型的父子类关系

![a hierarchy of several generic list class declarations](https://docs.oracle.com/javase/tutorial/figures/java/generics-wildcardSubtyping.gif)

## 类型擦除

泛型被引入到 Java 语言中，以便在编译时提供更严格的类型检查并支持泛型编程。为了实现泛型，Java 编译器使用[[类型擦除]]，声明了泛型的 `.java` 源代码，在编程生成 `.class` 文件后，泛型相关的信息就不存在了，源代码中的泛型相关的信息是提供给编译期使用的。：

- 如果类型参数是无界的，则将泛型类型中的所有类型参数替换为其边界或对象。因此，生成的字节码仅包含普通的类，接口和方法。
- 在合适的位置插入类型转换，以保证类型安全
- 生成桥接方法以保留扩展泛型类型中的多态性

类型擦除确保不为参数化类型创建新类；因此，泛型不会产生运行时开销。

泛型信息对 Java 编译器可见，但是对 Java 虚拟机不可见。

在类型擦除过程中，Java 编译器会擦除所有的 type parameters，如果是有界的类型参数则替换成第一个类型，如果是无界的类型参数则替换为 Object。

Java 编译器还会擦除泛型方法参数中的类型参数。比如静态方法：

    // Counts the number of occurrences of elem in anArray.
    //
    public static <T> int count(T[] anArray, T elem) {
        int cnt = 0;
        for (T e : anArray)
            if (e.equals(elem))
                ++cnt;
            return cnt;
    }

因为 T 是无界的，则会把 T 出现的地方全部替换为 Object。和泛型类相同，有界的方法中的类型参数也会替换为第一个类型参数。

编写类：

```
class User implements Comparable<User> {
    String name;
	
    public int compareTo(User other){
        return this.name.compareTo(other.name);
    }
}
```

JDK 中接口定义：

```
package java.lang;
public interface Comparable<T>{
    int compareTo(T o);
}
```

首先反编译接口：

```
public interface Comparable
{

    public abstract int compareTo(Object obj);
}
```

擦除规则 1，参数类型被替换成 Object。如果要看有界类型可以尝试反编译 Collections.class。

编译类：

    javac User.java

反编译类：

    jad User.class

得到：

```
class User
    implements Comparable
{

    User()
    {
    }

    public int compareTo(User user)
    {
        return name.compareTo(user.name);
    }

    // 桥接方法
    public volatile int compareTo(Object obj)
    {
        return compareTo((User)obj);
    }

    String name;
}
```

类型参数没有了，多了无参构造方法，多了 `compareTo(Object obj)` 桥接方法，擦除规则2 和 3 实现。

## 泛型的限制

### 不能使用原始类型来实例化泛型
比如

    Pair<int, char> p = new Pair<>(8, 'a');  // compile-time error

会有编译错误。Java 会自动装箱。

### 无法创建类型参数的实例
比如

    public static <E> void append(List<E> list) {
        E elem = new E();  // compile-time error
        list.add(elem);
    }

作为解决方案，可以使用反射来创建对象实例

    public static <E> void append(List<E> list, Class<E> cls) throws Exception {
        E elem = cls.newInstance();   // OK
        list.add(elem);
    }

如下调用

    List<String> ls = new ArrayList<>();
    append(ls, String.class);

### 无法申明类型参数为静态
如下是不对的

    public class MobileDevice<T> {
        private static T os;

        // ...
    }

### 不能对 parameterized types 进行类型装换和使用 instanceof
因为 Java 编译器会在编译时擦除类型，所以无法验证参数类型在运行时的类型。下面是错误的例子：

    public static <E> void rtti(List<E> list) {
        if (list instanceof ArrayList<Integer>) {  // compile-time error
            // ...
        }
    }

而对于有界的参数化类型，可以使用

    public static void rtti(List<?> list) {
        if (list instanceof ArrayList<?>) {  // OK; instanceof requires a reifiable type
            // ...
        }
    }

### 无法创建参数化类型的数组
不能

    List<Integer>[] arrayOfLists = new List<Integer>[2];  // compile-time error

### 无法创建，捕获或抛出参数化类型的对象
泛型类无法直接或者间接继承 Throwable 。

    // Extends Throwable indirectly
    class MathException<T> extends Exception { /* ... */ }    // compile-time error

    // Extends Throwable directly
    class QueueFullException<T> extends Throwable { /* ... */ // compile-time error

但是可以在 throw 语句后使用

    class Parser<T extends Exception> {
        public void parse(File file) throws T {     // OK
            // ...
        }
    }

### 不能有重载的方法使用相同的泛型
比如

    public class Example {
        public void print(Set<String> strSet) { }
        public void print(Set<Integer> intSet) { }
    }


## reference

- <https://docs.oracle.com/javase/tutorial/java/generics/why.html>

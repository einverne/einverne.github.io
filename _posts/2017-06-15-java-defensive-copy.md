---
layout: post
title: "Java 查漏补缺之 defensive copy"
tagline: ""
description: ""
category: Java
tags: [java, defensive-copy, linux, notes, effective-java]
last_updated:
---

什么是保护性拷贝（defensive copy，或者防御性拷贝）呢？ 说到这个问题首先要知道 Java 中的不可变对象（Immutable Object），既然有不可变对象就一定有可变对象（Mutable Object），顾名思义可变对象就是在对象构造完成之后内部状态会改变的对象，比如 StringBuilder 和 Date 都是可变对象，而 String 和 Integer 是不可变对象。

一个类可能有两种方式包含可变的 field

- 类状态只能被自身改变，也就是说类包含一个可变对象，而该字段只能由类自己改变，比如说类 Person 有一个字段 birthDate，而该字段由 Person 类在创建时创建
- 另外一种类的状态可以被自身和调用者改变，也就是说类对象中包含在其他地方创建的可变对象，比如下面的例子中，假如构造函数中的 Date 没有进行保护性拷贝，可能导致错误

如果在构建类时只想要类状态被自身改变，那么在可变对象被传入或者被外部获取时，保护性拷贝是**必要的**。如果不那么做，调用者就可以轻易的破坏封装。

## 举例
比如下面 Planet 类，在构造函数和 get 函数中都做了保护性拷贝，这样外部调用者无法改变类内部状态，才能认为 Planet 是不可变对象。

```java
import java.util.Date;

/**
* Planet is an immutable class, since there is no way to change
* its state after construction.
*/
public final class Planet {

  public Planet (double aMass, String aName, Date aDateOfDiscovery) {
     fMass = aMass;
     fName = aName;
     //make a private copy of aDateOfDiscovery
     //this is the only way to keep the fDateOfDiscovery
     //field private, and shields this class from any changes that
     //the caller may make to the original aDateOfDiscovery object
     fDateOfDiscovery = new Date(aDateOfDiscovery.getTime());
  }

  /**
  * Returns a primitive value.
  *
  * The caller can do whatever they want with the return value, without
  * affecting the internals of this class. Why? Because this is a primitive
  * value. The caller sees its "own" double that simply has the
  * same value as fMass.
  */
  public double getMass() {
    return fMass;
  }

  /**
  * Returns an immutable object.
  *
  * The caller gets a direct reference to the internal field. But this is not
  * dangerous, since String is immutable and cannot be changed.
  */
  public String getName() {
    return fName;
  }

//  /**
//  * Returns a mutable object - likely bad style.
//  *
//  * The caller gets a direct reference to the internal field. This is usually dangerous,
//  * since the Date object state can be changed both by this class and its caller.
//  * That is, this class is no longer in complete control of fDate.
//  */
//  public Date getDateOfDiscovery() {
//    return fDateOfDiscovery;
//  }

  /**
  * Returns a mutable object - good style.
  *
  * Returns a defensive copy of the field.
  * The caller of this method can do anything they want with the
  * returned Date object, without affecting the internals of this
  * class in any way. Why? Because they do not have a reference to
  * fDate. Rather, they are playing with a second Date that initially has the
  * same data as fDate.
  */
  public Date getDateOfDiscovery() {
    return new Date(fDateOfDiscovery.getTime());
  }

  // PRIVATE

  /**
  * Final primitive data is always immutable.
  */
  private final double fMass;

  /**
  * An immutable object field. (String objects never change state.)
  */
  private final String fName;

  /**
  * A mutable object field. In this case, the state of this mutable field
  * is to be changed only by this class. (In other cases, it makes perfect
  * sense to allow the state of a field to be changed outside the native
  * class; this is the case when a field acts as a "pointer" to an object
  * created elsewhere.)
  *
  * In new code, you should use java.time classes, not java.util.Date.
  */
  private final Date fDateOfDiscovery;
}
```

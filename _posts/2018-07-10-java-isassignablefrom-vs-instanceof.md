---
layout: post
title: "Java 查漏补缺之 Class.isAssignableFrom() 和 instanceof 区别"
tagline: ""
description: ""
category: Java
tags: [java, linux, object, class]
last_updated:
---

`Class.isAssignableFrom()` 是用来判断一个类 Class1 和另一个类 Class2 是否相同或是另一个类的超类 superclass 或接口 superinterface。

调用方式： `X.class.isAssignableFrom(Y.class)`

调用者和参数都是 java.lang.Class 类型。上面例子，如果返回为 true，则表示 X 是 Y 的超类或者接口，Y 可以是一个类也可以是一个接口。

`instanceof` 是用来判断一个对象实例是否是一个类或接口的或其子类子接口的实例。

调用方式：`o instanceof TypeName`

第一个参数是对象实例名，第二个参数是具体的类名或接口名

## 延伸

Class 中还有一个相关的方法 `isInstance()` ，这个方法用来检查实例

    MyClass.class.isInstance(obj)

如果返回 true，则表示 obj 是类 MyClass 的实例或者子类实例。

    public class NewMain
    {
        public static void main(String[] args)
        {
            NewMain nm = new NewMain();
            nm.doit();
        }

        public void doit()
        {
            A myA = new A();
            B myB = new B();
            A[] aArr = new A[0];
            B[] bArr = new B[0];

            System.out.println("b instanceof a: " + (myB instanceof A));
            System.out.println("b isInstance a: " + A.class.isInstance(myB));
            System.out.println("a isInstance b: " + B.class.isInstance(myA));
            System.out.println("b isAssignableFrom a: " + A.class.isAssignableFrom(B.class));
            System.out.println("a isAssignableFrom b: " + B.class.isAssignableFrom(A.class));
            System.out.println("bArr isInstance A: " + A.class.isInstance(bArr));
            System.out.println("bArr isInstance aArr: " + aArr.getClass().isInstance(bArr));
            System.out.println("bArr isAssignableFrom aArr: " + aArr.getClass().isAssignableFrom(bArr.getClass()));
        }

        class A
        {
        }

        class B extends A
        {
        }
    }

结果是：

    b instanceof a: true
    b isInstance a: true
    a isInstance b: false
    b isAssignableFrom a: true
    a isAssignableFrom b: false
    bArr isInstance A: false
    bArr isInstance aArr: true
    bArr isAssignableFrom aArr: true


## reference

- <https://stackoverflow.com/questions/3949260/java-class-isinstance-vs-class-isassignablefrom>

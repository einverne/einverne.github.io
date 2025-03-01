---
layout: post
title: "java reflection"
aliases: "Java 反射"
tagline: ""
description: ""
category: 学习笔记
tags: [ java, jvm, java-reflection]
last_updated:
---

Java 中的提供了一组 API 用来在运行时动态修改方法，类，接口的行为，这个被称为 Reflection。

> For every type of object, the Java virtual machine instantiates an immutable instance of java.lang.Class which provides methods to examine the runtime properties of the object including its members and type information. Class also provides the ability to create new classes and objects. Most importantly, it is the entry point for all of the Reflection APIs.


无论创建多少实例对象，JVM 中都对应一个 Class 对象。

有了反射，才能实现 Spring/Spring Boot, MyBatis 等等框架。

动态代理的实现还依赖反射。

```
import java.lang.reflect.*;

 
   public class DumpMethods {
      public static void main(String args[])
      {
         try {
            Class c = Class.forName(args[0]);
            Method m[] = c.getDeclaredMethods();
            for (int i = 0; i < m.length; i++)
            System.out.println(m[i].toString());
         }
         catch (Throwable e) {
            System.err.println(e);
         }
      }
   }
```

执行：

```
java DumpMethods java.util.Stack
```

## Method 对象

```java  
public class DebugInvocationHandler implements InvocationHandler {  
    /**     * 代理类中的真实对象  
     */    private final Object target;  
    public DebugInvocationHandler(Object target) {        this.target = target;    }  
  
    public Object invoke(Object proxy, Method method, Object[] args) throws InvocationTargetException, IllegalAccessException {        System.out.println("before method " + method.getName());        Object result = method.invoke(target, args);        System.out.println("after method " + method.getName());        return result;    }}  
  
```

优点：

- 代码更加灵活，提供了操作类的能力

缺点：

- 引入了安全问题
- 性能稍差


获取 Class 对象的方式：

```
Class alunbarClass = TargetObject.class;
```

通过 `Class.forName()`

```
Class alunbarClass1 = Class.forName("info.einverne.TargetObject");
```

通过对象实例`instance.getClass()`获取：

```
TargetObject o = new TargetObject();
Class alunbarClass2 = o.getClass();
```

通过类加载器：

```
ClassLoader.getSystemClassLoader().loadClass("info.einverne.TargetObject");
```

通过类加载器获取 Class 对象不会进行初始化，意味着不进行包括初始化等一系列步骤，静态代码块和静态对象不会得到执行

[[Java Class Loading 加载过程和步骤]]
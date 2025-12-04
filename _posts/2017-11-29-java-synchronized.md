---
layout: post
title: "Java 查漏补缺：synchronized"
tagline: ""
description: ""
category: 学习笔记
tags: [synchronized, java, synchronization, ]
last_updated:
---

Java 中的 `synchronized` 块用来标记方法或者代码块是同步的。`synchronized` 可以用来避免竞态条件（Race Conditions）。

通常有四种不同的同步块：

- 实例方法 (Instance methods)
- 静态方法 (Static methods)
- 实例方法中的代码块 (Code blocks inside instance methods)
- 静态方法中的代码块 (Code blocks inside static methods)

## 同步实例方法 (Synchronized Instance methods)

在实例方法上使用 `synchronized`：

```java
public synchronized void add(int value){
    count += value;
}
```

`synchronized` 关键字修饰 `add` 方法，表示该方法同步。

同步的实例方法，是同步在拥有该方法的对象实例（Instance）上。因此，对于每一个实例，同一时间只有一个线程可以执行该实例的 `synchronized` 方法。如果有多个实例存在，那么每一个实例都有自己的锁，互不影响。

也就是：**一个对象的一个 synchronized 方法只能由一个线程访问。**

## 同步静态方法 (Synchronized Static methods)

同步静态方法是同步在类对象（Class Object）上。因为在 Java VM 中每一个类只有一个 Class 对象存在，所以同一时间只有一个线程可以执行同一个类的静态同步方法。

```java
public static MyStaticCounter {
  private static int count = 0;

  public static synchronized void add(int value){
      count += value;
  }
}
```

对于包含静态同步方法的类，即使有多个实例，所有实例也共享同一个类锁。

如果一个类包含多个静态同步方法，那么同一时间只有一个线程可以执行其中任意一个方法：

```java
public static MyStaticCounter{

  private static int count = 0;

  public static synchronized void add(int value){
    count += value;
  }

  public static synchronized void subtract(int value){
    count -= value;
  }
}
```

如果线程 A 在执行 `add()` 方法，那么线程 B 既不能执行 `add()` 也不能执行 `subtract()`，因为它们都需要获取同一个类对象的锁。

## 实例方法中的同步代码块 (Synchronized Blocks in Instance Methods)

有时你不需要同步整个方法，只需要同步方法中的一部分。这时可以使用同步代码块。

```java
public void add(int value){
    synchronized(this){
       this.count += value;
    }
}
```

`synchronized(this)` 锁住的是当前对象实例。这与同步整个实例方法的效果是一样的，但粒度更细，可以提高性能（只锁住需要同步的代码段）。

当然，也可以同步在其他对象上：

```java
public class MyClass {
    private final Object lock = new Object();

    public void add(int value){
        synchronized(lock){
            this.count += value;
        }
    }
}
```

## 静态方法中的同步代码块 (Synchronized Blocks in Static Methods)

同理，在静态方法中也可以使用同步代码块：

```java
public class MyClass {

    public static synchronized void log1(String msg1, String msg2){
        log.writeln(msg1);
        log.writeln(msg2);
    }

    public static void log2(String msg1, String msg2){
        synchronized(MyClass.class){
            log.writeln(msg1);
            log.writeln(msg2);
        }
    }
}
```

这里 `synchronized(MyClass.class)` 锁住的是 `MyClass` 的类对象。这与 `static synchronized` 方法使用的是同一个锁。

## 对象锁 vs 类锁 (Object level lock vs Class level lock)

### 对象级别锁 (Object Level Lock)

对象锁是针对某个具体实例的锁。

1.  **同步实例方法**：
    ```java
    public class DemoClass {
        public synchronized void demoMethod(){}
    }
    ```
2.  **同步代码块（锁 this）**：
    ```java
    public class DemoClass {
        public void demoMethod(){
            synchronized (this) {
                // ...
            }
        }
    }
    ```
3.  **同步代码块（锁特定对象）**：
    ```java
    public class DemoClass {
        private final Object lock = new Object();
        public void demoMethod(){
            synchronized (lock) {
                // ...
            }
        }
    }
    ```

### 类级别锁 (Class Level Lock)

类锁是针对 Class 对象的锁，在该类的所有实例之间共享。

1.  **同步静态方法**：
    ```java
    public class DemoClass {
        public synchronized static void demoMethod(){}
    }
    ```
2.  **同步代码块（锁 .class）**：
    ```java
    public class DemoClass {
        public void demoMethod() {
            synchronized (DemoClass.class) {
                // ...
            }
        }
    }
    ```
3.  **同步代码块（锁静态对象）**：
    ```java
    public class DemoClass {
        private final static Object lock = new Object();
        public void demoMethod() {
            synchronized (lock) {
                // ...
            }
        }
    }
    ```

## 总结

- **synchronized 实例方法**：锁当前实例对象。
- **synchronized 静态方法**：锁当前类的 Class 对象。
- **synchronized 代码块**：可以指定锁对象（实例或 Class 对象）。

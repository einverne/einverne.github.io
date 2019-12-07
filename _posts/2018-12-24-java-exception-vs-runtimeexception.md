---
layout: post
title: "Java 查漏补缺之 Exception 和 RuntimeException"
tagline: ""
description: ""
category: Java
tags: [java, exception ]
last_updated:
---


通常来讲 RuntimeException 是在编码过程中可以被避免的 Exception ，比如说 `NullPointerException`, `ArrayIndexOutOfBoundException` 等。如果每次都在调用前检查 null，就永远不会发生 `NullPointerException`，`ArrayIndexOutOfBoundException` 同理。RuntimeException 不会被编译器检查。

Java 中有两种类型异常，一种是 checked exceptions，一种是 un-checked exceptions。检查的异常必须被显示的代码处理，un-checked exceptions 则不需要。任何一个从 Exception 派生的类都是 checked  exception, 而从 RuntimeException 派生的则是 un-checked.

## 继承等级
Exception 和 Error 都是继承自 Throwable，Throwable 则是继承 Object。而 RuntimeException 则是继承 Exception。

## 举例
下面是一些常见的 RuntimeException

    AnnotationTypeMismatchException,
    ArithmeticException,
    ArrayStoreException,
    BufferOverflowException,
    BufferUnderflowException,
    CannotRedoException,
    CannotUndoException,
    ClassCastException,
    CMMException,
    ConcurrentModificationException,
    DataBindingException,
    DOMException,
    EmptyStackException,
    EnumConstantNotPresentException,
    EventException,
    IllegalArgumentException,
    IllegalMonitorStateException,
    IllegalPathStateException,
    IllegalStateException,
    ImagingOpException,
    IncompleteAnnotationException,
    IndexOutOfBoundsException,
    JMRuntimeException,
    LSException,
    MalformedParameterizedTypeException,
    MirroredTypeException,
    MirroredTypesException,
    MissingResourceException,
    NegativeArraySizeException,
    NoSuchElementException,
    NoSuchMechanismException,
    NullPointerException,
    ProfileDataException,
    ProviderException,
    RasterFormatException,
    RejectedExecutionException,
    SecurityException,
    SystemException,
    TypeConstraintException,
    TypeNotPresentException,
    UndeclaredThrowableException,
    UnknownAnnotationValueException,
    UnknownElementException,
    UnknownTypeException,
    UnmodifiableSetException,
    UnsupportedOperationException,
    WebServiceException


## reference

- <https://stackoverflow.com/q/2190161/1820217>

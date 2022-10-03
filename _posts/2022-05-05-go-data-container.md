---
layout: post
title: "Go 语言学习笔记 7：容器"
aliases:
- "Go 语言学习笔记 7：容器"
tagline: ""
description: ""
category: [ Go ]
tags: [ golang, google, programming , programming-language  ]
create_time: 2022-10-03 09:37:25
last_updated: 2022-10-03 10:00:41
---

Go 语言中常见的容器。

## 数组

```
var name [size]T
```

举例：

```
var classMates [3]string

# or

classMates2 := [...]string{"A", "B", "C"}
```

## 切片
切片是对数组的一个连续片段的引用，容量可变的序列。动态数组。

内部结构包括底层数组指针、大小和容量。

- array 指向底层存储数组的指针
- len 切片长度
- cap 切片容量，总是大于等于 len

从原数组中生成一个切片：

```
slice := source[begin:end]
```

举例：

```
source := [...]int{1,2,3}
sli := source[0:1]
```

动态创建切片，可以通过 `make` 函数动态创建切片

```
make([]T, size, cap)
```

- T 是切片中的元素类型
- size 长度
- cap 预先分配的长度，容量

直接声明新的切片，不需要指定大小：

```
var name []T
```

比如：

```
ex := []int{1,2,3}
```

### 对切片的操作

#### append
`append` 函数可以向切片添加元素，返回新的切片。

#### copy
复制切片内容

```
copy(destSli, srcSli []T)
```

## 列表和字典
列表，链表

Go 通过双向链表实现，插入、删除非常高效。

```
var names list.List
name := list.New()
```

## 字典
映射关系，内部通过散列表方式实现。

```
name := make(map[KeyType]valueType)
```

```
package main

import "fmt"

func main() {
    classMate := map[string]string{
        "1": "EV",
        "2": "EV2",
    }
    fmt.Println(classMate)

    classMate1 := make(map[int]string)
    classMate1[0] = "EV"
    classMate1[1] = "EV1"
    fmt.Println(classMate1)

    mate, ok := classMate1[0]
    fmt.Println(mate, ok)
}
```

## 容器遍历
通过 `for-range` 语法

```
// 数组
nums := [...]int{1, 2, 3, 4, 5, 4, 3, 2, 1}
for k, v := range nums {
    fmt.Println(k, v)
}

// 切片
slis := []int{1, 2, 3, 4, 5, 4, 3, 2, 1}  
for k, v := range slis {  
   println(k, v)  
}

// map
// traverse map
for k, v := range classMate1 {
    fmt.Println(k, v)
}
```

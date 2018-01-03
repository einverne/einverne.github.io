---
layout: post
title: "CollectionUtils"
tagline: ""
description: ""
category: 
tags: []
last_updated: 
---

Apache commons 包中 CollectionUtils 常用方法介绍。

org.apache.commons.collections.CollectionUtils;

## 将所有元素添加到一个集合
`addAll(Collection<C> collection, C[] elements)` 将后面的元素添加到集合中，或者是添加一个非空元素 `addIgnoreNull(Collection<T> collection, T object)`。


## Collate (整理）两个列表
将两个有序的列表合二为一，使用 `collate()` 方法

    List<Customer> sortedList = CollectionUtils.collate(list1, list2);

## 将一个列表中一种类型的对象转变为另一组对象
使用 `collect()` 方法

    Collection<Address> addressCol = CollectionUtils.collect(list1, 
      new Transformer<Customer, Address>() {
        public Address transform(Customer customer) {
            return customer.getAddress();
        }
    });

## 判断是否包含

`containsAll(Collection<?> coll1, Collection<?> coll2)` 判断是否 coll2 中所有元素都在 coll1 中

`containsAny(Collection<?> coll1, Collection<?> coll2)` 判断 coll2 中有没有至少一个元素在 coll1 中

`CollectionUtils.isSubCollection(list3, list1)` 可以使用该函数来判断两个集合是否是包含关系。



## 过滤元素
使用 `CollectionUtils.filter` 可以用来过滤 Collection 中不满足条件的元素。这个函数接收两个参数，第一个参数为列表，第二个参数为 Predicate 用来设置条件。

    boolean isModified = CollectionUtils.filter(linkedList1, 
      new Predicate<Customer>() {
        public boolean evaluate(Customer customer) {
            return Arrays.asList("Daniel","Kyle").contains(customer.getName());
        }
    });

`filter()` 函数是当 `Predicate` 返回 false 时移除元素；`filterInverse()` 函数是当 `Predicate` 返回 true 时移除元素。

如果想要获取过滤的结果，可以使用`select` 和 `selectRejected` 这两个函数。

##  判断集合是否为空
```
CollectionUtils.isEmpty(null): true
CollectionUtils.isEmpty(new ArrayList()): true
CollectionUtils.isEmpty({a,b}): false
```
## 判断集合是否不为空
```
CollectionUtils.isNotEmpty(null): false
CollectionUtils.isNotEmpty(new ArrayList()): false
CollectionUtils.isNotEmpty({a,b}): true
```

## 2个集合间的操作

集合a: {1,2,3,3,4,5}
集合b: {3,4,4,5,6,7}
```
CollectionUtils.union(a, b)(并集): {1,2,3,3,4,4,5,6,7}
CollectionUtils.intersection(a, b)(交集): {3,4,5}
CollectionUtils.disjunction(a, b)(交集的补集): {1,2,3,4,6,7}
CollectionUtils.disjunction(b, a)(交集的补集): {1,2,3,4,6,7}
CollectionUtils.subtract(a, b)(A与B的差): {1,2,3}
CollectionUtils.subtract(b, a)(B与A的差): {4,6,7}
```

更多的内容可以 Google： <https://www.google.com/search?q=CollectionUtils>

示例代码可以到 <https://github.com/einverne/jutils/tree/master/src/test> 来查看。

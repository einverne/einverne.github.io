---
layout: post
title: "排序算法"
tagline: ""
description: ""
category: 经验总结
tags: []
last_updated: 
---

排序算法复习，插入排序，选择排序，冒泡排序，希尔排序，归并排序，堆排序，快排。

关于排序算法的 stable , 排序保存原始数据顺序则稳定，否则不稳定。

关于原址排序，算法需要额外的空间计算或者保存数据， in-place sorting ，归并排序为非原址排序 not-in-place sorting。

关于时间复杂度，归并排序，堆排序，快排有相对较快的速度 `O(n*lg(n))`

## 插入排序 {#insertion-sort}

每次取一个元素插入正确的位置，适合少量元素。

### Algorithm
    for i = 2:n,
        for (k = i; k > 1 and a[k] < a[k-1]; k--)
            swap a[k,k-1]
        → invariant: a[1..i] is sorted
    end

### Properties

- Stable
- O(1) extra space
- O(n^2^) comparisons and swaps
- Adaptive: O(n) time when nearly sorted
- Very low overhead

### Example
    list = [4,6,2,5,1,3,0,4,8,1,5,3,6]

    # 升序
    # 从第二个元素开始，每次循环将前i个元素排序
    for i in range(1,len(list)):
        value = list[i]
        j = i-1
        # 将第i个元素的位置腾出
        while j >= 0 and list[j]>value:
            list[j+1] = list[j]
            j=j-1
        # 在排完序的 list[0...i] 中将值插入合适位置
        list[j+1]=value

    # 降序
    list = [4,6,2,5,1,3,0,4,8,1,5,3,6]

    for i in range(len(list)-1, -1, -1):
        value = list[i]
        j=i+1
        while j<len(list) and value < list[j]:
            list[j-1] = list[j]
            j=j+1
        list[j-1]=value

    print(list)

## 选择排序 {#selection-sort}
每次选取数组中最小的元素，并将其与数组中A[0]元素交换，依次进行。

选择排序拥有最小的交换次数，适合交换元素开销比较大的情况。选择排序其他情况都比较低效。

### Algorithm
    for i = 1:n,
        k = i
        for j = i+1:n, if a[j] < a[k], k = j
        → invariant: a[k] smallest of a[i..n]
        swap a[i,k]
        → invariant: a[1..i] in final position
    end

### Properties
- Not stable
- O(1) extra space
- Θ(n^2^) comparisons
- Θ(n) swaps
- Not adaptive

### Example
    list = [4,6,2,5,1,3,0,4,8,1,5,3,6]

    for i in range(0,len(list)):
        k = i
        for k in range(i+1, len(list)):
        # 没有完全按照定义写，不过这样交换的开销更大。
            if list[k] < list[i]:
                list[i], list[k] = list[k], list[i]

    print(list)

## 冒泡排序 {#bubble-sort}
反复交换相邻未按次序排列的元素，一次循环之后最大的元素到数组最后。

### Algorithm
    for i = 1:n,
        swapped = false
        for j = n:i+1, 
            if a[j] < a[j-1], 
                swap a[j,j-1]
                swapped = true
        → invariant: a[1..i] in final position
        break if not swapped
    end

### Properties

- Stable
- O(1) extra space
- O(n^2^) comparisons and swaps
- Adaptive: O(n) when nearly sorted

### Example

    def bubble_sort_1(list):
        for i in range(0, len(list)):
            for j in range(1, len(list)-i):
                if list[j-1] > list[j]:
                    list[j-1], list[j] = list[j], list[j-1]

    def bubble_sort_2(list):
        for i in range(0, len(list)):
            swap = False
            for j in range(len(list)-1, i, -1):
                if list[j-1] > list[j]:
                    list[j-1], list[j] = list[j], list[j-1]
                    swap = True
            if swap is False:
                break

相较于第一种直接冒泡，设定标志优化冒泡。

## 希尔排序 {#shell-sort}
分组插入排序

### Algorithm

    h = 1
    while h < n, h = 3*h + 1
    while h > 0,
        h = h / 3
        for k = 1:h, insertion sort a[k:h:n]
        → invariant: each h-sub-array is sorted
    end

### Properties
- Not stable
- O(1) extra space
- O(n^3/2^) time as shown (see below)
- Adaptive: O(n·lg(n)) time when nearly sorted

### Example
    list = [4,6,2,5,1,3,0,4,8,1,5,3,6]

    def insertion_sort(k,h,n):
        """
        :param k: group count
        :param h: step length
        :param n: total
        :return:
        """
        for i in range(k+h, n, h):
            value = list[i]
            j = i-h
            while j >= 0 and list[j]>value:
                list[j+h] = list[j]
                j=j-h
            list[j+h]=value


    h = 1       # step length
    while h < len(list):
        h = 3*h +1

    while h > 0:
        h = int(h / 3)
        for k in range(0, h):           # devide into k groups
            insertion_sort(k, h, len(list))

    print(list)


## 归并排序 {#merge-sort}
典型的分治算法，将数组分成两个子数组分别进行排序，之后合并，所以重点就到了合并有序数组。

### Algorithm
    # split in half
    m = n / 2

    # recursive sorts
    sort a[1..m]
    sort a[m+1..n]

    # merge sorted sub-arrays using temp array
    b = copy of a[1..m]
    i = 1, j = m+1, k = 1
    while i <= m and j <= n,
        a[k++] = (a[j] < b[i]) ? a[j++] : b[i++]
        → invariant: a[1..k] in final position
    while i <= m,
        a[k++] = b[i++]
        → invariant: a[1..k] in final position

### Properties
- Stable
- Θ(n) extra space for arrays (as shown)
- Θ(lg(n)) extra space for linked lists
- Θ(n·lg(n)) time
- Not adaptive
- Does not require random access to data

### Example

From wiki

    from collections import deque

    def merge_sort(lst):
        if len(lst) <= 1:
            return lst

        def merge(left, right):
            merged,left,right = deque(),deque(left),deque(right)
            while left and right:
                merged.append(left.popleft() if left[0] <= right[0] else right.popleft())  # deque popleft is also O(1)
            merged.extend(right if right else left)
            return list(merged)

        middle = int(len(lst) // 2)
        left = merge_sort(lst[:middle])
        right = merge_sort(lst[middle:])
        return merge(left, right)


## 堆排序 {#heap-sort}
利用最大堆的性质

### Algorithm
    # heapify
    for i = n/2:1, sink(a,i,n)
    → invariant: a[1,n] in heap order

    # sortdown
    for i = 1:n,
        swap a[1,n-i+1]
        sink(a,1,n-i)
        → invariant: a[n-i+1,n] in final position
    end

    # sink from i in a[1..n]
    function sink(a,i,n):
        # {lc,rc,mc} = {left,right,max} child index
        lc = 2*i
        if lc > n, return # no children
        rc = lc + 1
        mc = (rc > n) ? lc : (a[lc] > a[rc]) ? lc : rc
        if a[i] >= a[mc], return # heap ordered
        swap a[i,mc]
        sink(a,mc,n)

### Properties
- Not stable
- O(1) extra space (see discussion)
- O(n·lg(n)) time
- Not really adaptive

### Example

    def max_heapify(lst, i):
        """
        下标为i的根节点调整为最大堆
        :param lst:
        :param i:
        :return:
        """
        l = 2 * i + 1
        r = 2 * (i + 1)
        if l < len(lst) and lst[l] > lst[i]:
            largest = l
        else:
            largest = i
        if r < len(lst) and lst[r] > lst[largest]:
            largest = r
        if largest != i:
            lst[i], lst[largest] = lst[largest], lst[i]
            max_heapify(lst, largest)


    def build_max_heap(lst):
    	"""
        建立最大堆
        """
        for i in range((len(lst)-1)/2, 0, -1):
            max_heapify(lst, i)


    def heap_sort(lst):
        build_max_heap(lst)
        ret = []
        for i in range(len(lst)-1, -1, -1):
            ret.append(lst[0])
            lst.remove(lst[0])
            max_heapify(lst, 0)
        return ret

    L = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1]
    R = heap_sort(L)
    print(R)



## 快排 {#quick-sort}

### Algorithm
    # choose pivot
    swap a[1,rand(1,n)]

    # 2-way partition
    k = 1
    for i = 2:n, if a[i] < a[1], swap a[++k,i]
    swap a[1,k]
    → invariant: a[1..k-1] < a[k] <= a[k+1..n]

    # recursive sorts
    sort a[1..k-1]
    sort a[k+1,n]

### Properties
- Not stable
- O(lg(n)) extra space (see discussion)
- O(n^2^) time, but typically O(n·lg(n)) time
- Not adaptive

### Example

    list_demo = [2,8,7,1,3,5,6,4]

    def partition(lst, p, r):
        """
        划分
        :param lst: 待排序数组
        :param p: 起始下标，子数组第一个元素
        :param r: 终止下标，子数组最后一个元素 r < len(lst)
        :return: 划分结果下标
        """
        if r >= len(lst) or p < 0:
            return
        x = lst[r]
        i = p - 1
        for j in range(p, r):
            if lst[j] <= x:
                i += 1
                lst[i], lst[j] = lst[j], lst[i]
        lst[i+1], lst[r] = lst[r], lst[i+1]
        return i + 1


    def quick_sort(lst, p, r):
        if p < r:
            q = partition(lst, p, r)
            quick_sort(lst, p, q-1)
            quick_sort(lst, q+1, r)

    quick_sort(list_demo, 0, len(list_demo)-1)
    print(list_demo)


## reference

- <http://www.sorting-algorithms.com/>
- <http://www.tutorialspoint.com/data_structures_algorithms/sorting_algorithms.htm>
- <http://blog.csdn.net/morewindows/article/details/17488865>
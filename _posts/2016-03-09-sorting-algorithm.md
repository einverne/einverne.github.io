---
layout: post
title: "排序算法"
aliases: "排序算法"
tagline: ""
description: ""
category: 经验总结
tags: [c++, sort, algorithm, python]
last_updated: 2016-04-20
---

排序算法复习，插入排序，选择排序，冒泡排序，希尔排序，归并排序，堆排序，快排。

关于排序算法的 stable 稳定性，排序保存原始数据顺序则稳定，否则不稳定。

关于原址排序，算法需要额外的空间计算或者保存数据， in-place sorting ，归并排序为非原址排序 not-in-place sorting。

关于时间复杂度，归并排序，堆排序，快排有相对较快的速度 `O(n*log(n))`

## 稳定性
排序前后两个相等的数的相对位置不变。

有一些排序算法天然是稳定的，比如 Insertion Sort, Merge Sort, Bubble Sort。

### 为什么需要有稳定性？
加入有一组英文名，包括 First Name 和 Last Name，要求先按照 Last Name(姓) 排序，然后按照 First Name （名） 排序，这个时候可以先排序 First Name (稳定或非稳定)，然后按照稳定的排序算法排序 Last Name，这样就可以保证排序完成之后，就是最终的结果。


## 插入排序 {#insertion-sort}

每次取一个元素插入正确的位置，适合少量元素。对于未排序的数据，从已排序的序列中从后向前扫描，找到相应的位置插入，实现上通常使用 in-place 排序，只需要使用额外 O(1) 空间，但是因为插入正确的位置之后，需要反复移动已经排序的序列，为新元素提供插入空间，因而比较费时。

一般来说，插入排序都采用 in-place 在数组上实现。具体算法描述如下：

1. 从第一个元素开始，该元素可以认为已经被排序
2. 取出下一个元素，在已经排序的元素序列中从后向前扫描
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置
4. 重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置
5. 将新元素插入到该位置后
6. 重复步骤 2~5

### Algorithm

    for i = 2:n,
        for (k = i; k > 1 and a[k] < a[k-1]; k--)
            swap a[k,k-1]
        → invariant: a[1..i] is sorted
    end

Java 版本：

```
static void insert_sort(int[] array) {
    for(int i = 1; i < array.length; ++i) {
        int cur = array[i];
        for(int j = i - 1; j >= 0 && array[j] > cur; j--) {
            array[j + 1] = array[j];
            array[j] = cur;
        }
    }
}
```

### Properties

- Stable
- O(1) extra space
- O(n^2^) comparisons and swaps
- Adaptive: O(n) time when nearly sorted
- Very low overhead

### Example
    list = [4,6,2,5,1,3,0,4,8,1,5,3,6]

    # 升序
    # 从第二个元素开始，每次循环将前 i 个元素排序
    for i in range(1,len(list)):
        value = list[i]
        j = i-1
        # 将第 i 个元素的位置腾出
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
每次选取数组中最小（或者最大）的元素，并将其与未排序数组中首元素交换，依次进行。

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

Java 版：

	static void selection_sort(int[] array) {
		if(array.length <= 1) return;
		for(int i = 0; i < array.length; i++) {
			int smallest = i;
			for(int j = i + 1; j < array.length; j++) {
				if (array[j] < array[smallest]) {
					smallest = j;
				}
			}
			int temp = array[i];
			array[i] = array[smallest];
			array[smallest] = temp;
		}
	}


## 冒泡排序 {#bubble-sort}
[[冒泡排序]] 反复交换相邻未按次序排列的元素，一次循环之后最大的元素到数组最后。

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

Java 版

	static void bubble_sort(int[] arr) {
		int i, j, temp, len = arr.length;
		for (i = 0; i < len - 1; i++)
			for (j = 0; j < len - 1 - i; j++)
				if (arr[j] > arr[j + 1]) {
					temp = arr[j];
					arr[j] = arr[j + 1];
					arr[j + 1] = temp;
				}
	}

## 希尔排序 {#shell-sort}
分组插入排序，将数组拆分成若干子序列，由增量决定，分别进行直接插入排序，然后缩减增量，减少子序列，最后对全体元素进行插入排序。插入排序在基本有序的情况下效率最高。

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
[[归并排序]] 是一个典型的分治算法，将数组分成两个子数组，在子数组中继续拆分，当小组只有一个数据时可认为有序，之后合并，所以重点就到了合并有序数组。

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
利用最大堆的性质，堆性质，子结点的值小于父节点的值。每次将根节点最大值取出，剩下元素进行最大堆调整，依次进行。

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
        下标为 i 的根节点调整为最大堆
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
从数列中挑出元素，将比挑出元素小的摆放到前面，大的放到后面，分区操作。然后递归地将小于挑出值的子数列和大于的子数列排序。

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

## 分配排序

### 箱排序 {#bucket-sort}

箱排序也称桶排序 (Bucket Sort)，其基本思想是：设置若干个箱子，依次扫描待排序的记录 R[0]，R[1]，…，R[n-1]，把关键字等于 k 的记录全都装入到第 k 个箱子里（分配），然后按序号依次将各非空的箱子首尾连接起来（收集）。对于有限取值范围的数组来说非常有效，时间复杂度可以可达 O(n). 例如给人年龄排序，人的年龄只能在 0~100 多之间，不可能有人超过 200, 适用桶排序。

- 箱排序中，箱子的个数取决于关键字的取值范围。
    若 R[0..n-1] 中关键字的取值范围是 0 到 m-1 的整数，则必须设置 m 个箱子。因此箱排序要求关键字的类型是有限类型，否则可能要无限个箱子。

- 箱子的类型应设计成链表为宜
	一般情况下每个箱子中存放多少个关键字相同的记录是无法预料的，故箱子的类型应设计成链表为宜。

- 为保证排序是稳定的，分配过程中装箱及收集过程中的连接必须按先进先出原则进行。

桶排序的平均时间复杂度是线性的，O(n), 但是最坏的情况可能是 O(n^2)


## 基数排序 {#radix-sort}

基数排序是非比较排序算法，算法的时间复杂度是 O(n). 相比于快速排序的 O(nlgn), 从表面上看具有不小的优势。但事实上可能有些出入，因为基数排序的 n 可能具有比较大的系数 K. 因此在具体的应用中，应首先对这个排序函数的效率进行评估。

基数排序的主要思路是，将所有待比较数值（注意，必须是正整数）统一为同样的数位长度，数位较短的数前面**补零**. 然后，从最低位开始，依次进行一次稳定排序。这样从最低位排序一直到最高位排序完成以后，数列就变成一个有序序列。

这个算法的难度在于分离数位，将分离出的数位代表原元素的代表，用作计数排序。但是分离数位不能脱离原来的数字，计数排序的结果，还是要移动原元素。

注意计数排序的元素数值与位置的联系，引申到基数排序的从元素得到中间值然后与位置的联系。

## 枚举排序 {#enumeration-sort}
通常也被叫做秩排序 (Rank Sort) ，算法基本思想是：对每一个要排序的元素，统计小于它的所有元素的个数，从而得到该元素在整个序列中的位置，时间复杂度为 O（n^2）


## reference

- <http://www.sorting-algorithms.com/>
- <http://www.tutorialspoint.com/data_structures_algorithms/sorting_algorithms.htm>
- <http://blog.csdn.net/morewindows/article/details/17488865>
- [分配排序](http://www.cnblogs.com/ziyiFly/archive/2008/09/10/1288508.html)
- [基数排序](http://www.cnblogs.com/sun/archive/2008/06/26/1230095.html)

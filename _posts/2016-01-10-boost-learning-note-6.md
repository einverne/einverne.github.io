---
layout: post
title: "boost 学习笔记 6：容器"
tagline: ""
description: "boost 中定义的新容器， array, dynamic_bitset, unordered, bimap, circular_buffer, tuple, any, variant, multi_array, property_tree"
category: 学习笔记
tags: [boost, C++, ]
last_updated: 
---

对应书中的第七章**容器与数据结构**。先是讲了五个容器： array ,  dynamic_bitset, unordered, bimap和 circular_buffer. 他们都是对标准容器的扩充。

- array 是对 C++内建数组的简单包装
- dynamic_bitset 可容纳任意数量的二进制位
- unordered 实现散列容器，非二叉树实现
- bimap 是双向 map 扩展了std::map 的内容
- circular_buffer 是循环队列。

tuple, any 和 variant 能够容纳不同类型容器

- tuple 是对 std::pair 的泛化
- any和 variant 都只能容纳一个可变类型的容器。any 可以持有任何类型数据，variant 需要在编译期指定类型。

最后 `multi_array` 和 `property_tree` 两个组件使用组合模式实现复杂的数据结构。 `multi_array` 是一个泛型多维容器， `property_tree` 出自 1.41 版，可以解析 xml, son, ini 和 info 四种格式文件，在内部构造属性树。

对容纳元素基本要求：析构函数不能抛出异常

## array
数组容器，包装了 C++ 内建数组，为其提供标准 STL 容器接口，begin(), front() 等等，性能与原始数组相差不大。但是 array 功能有限，当需要可变容量数组时，还是需要借助 std::vector 或者 boost::scoped_array

array 主要缺陷：

- 没有构造函数，不能指定大小和初值
- 没有 push_back() 和 push_front() ，不能动态增长
- 不能搭配插入迭代器适配器功能

需包含头文件

	#include <boost/array.hpp>
    using namespace boost;

具体用法：

    #include <iostream>
    #include <boost/array.hpp>
    #include <boost/typeof/typeof.hpp>
    using namespace boost;

    int main(int argc, const char * argv[]) {
        // 赋值
        array<int, 5> myArray;
        myArray[1] = 2;
        myArray.front() = 1;
        myArray.back() = 5;

        // 获取指针
        int* p = myArray.c_array();
        *(p+2) = 3;

        for (array<int,5>::iterator itr = myArray.begin(); itr != myArray.end(); ++itr) {
            std::cout << *itr << std::endl;
        }

        array<int, 10> arr2;
        arr2.assign(5);
        for (BOOST_AUTO(pos, arr2.begin()); pos != arr2.end(); ++pos) {
            std::cout << *pos << ",";
        }

        // 类似数组的初始化
        array<int, 3> ar3= { 1, 2, 3 };
        array<int, 10> ar4 = {0};           // all element equal 0
        array<std::string, 5> ar5= {"first"};  // 初始化第一个元素

        return 0;
    }


## dynamic_bitset

C++98 标准为处理二进制提供了两个工具： vector<bool> 和 bitset. 他们各自有优缺点： vector<bool> 可以动态增长，但不能方便地进行位运算；而 bitset 则刚好相反，可以方便地对容纳的二进制做位运算，但不能动态增长。 dynamic_bitset 正好填补了两者之间的空白。

需包含如下头文件

    #include <boost/dynamic_bitset.hpp>
    using namespace boost;

## unordered

unordered 库提供两个散列集合类 `unordered_set` 和 `unordered_multiset` ，同样 STLport 库也提供 hash_set 和 hash_multiset. 他们接口、用法和 STL 中标准关联容器 set/multiset 相同，只是内部使用散列代替二叉树实现，因此查找复杂度由对数降为常数。

散列容器 hash container 比二叉树的存储方式可以提供更高的访问效率。boost.unordered 库提供了一个完全符合 C++ 新标准草案 TR1 的散列容器实现，包括无序集合 set 和 无序映射 map.

unordered 库提供两个散列映射类 `unordered_map` 和 `unordered_multimap` ，同样 STLport 中也提供了  hash_map/hash_multimap. 他们的接口、用法和 STL 中的标准关联容器 map/multimap 相同，只是内部使用散列表代替了二叉树。


    #include <boost/unordered_set.hpp>
    #include <boost/unordered_map.hpp>
    using namespace boost;

代码：

    #include <iostream>
    #include <string>
    #include <boost/assign.hpp>
    #include <boost/typeof/typeof.hpp>
    #include <boost/unordered_set.hpp>
    #include <boost/unordered_map.hpp>
    using namespace boost;
    using namespace std;

    int main(int argc, const char * argv[]) {
        // 散列集合类
        using namespace boost::assign;
        using namespace boost::unordered;

        // 散列集合
        unordered_set<string> s = (list_of<string>("one")("two")("three"));
        s.insert("four");
        s.erase("two");
        unordered_set<string>::iterator it = s.find("one");
        s.erase(it);
        for (unordered_set<string>::iterator itr = s.begin(); itr != s.end(); ++itr) {
            cout << *itr << endl;
        }
        s.empty();


        // 关联式容器
        unordered_map<int, std::string> um = map_list_of(1,"one")(2,"two")(3,"three");
        um.insert(std::make_pair(10,"ten"));
        um[11] = "eleven";
        um[15] = "fifteen";

        std::cout << um[15] << std::endl;
        BOOST_AUTO(p, um.begin());
        for (p; p!= um.end(); ++p) {
            cout << p->first << "-" << p->second << ",";
        }
        cout << endl;

        um.erase(11);               // delete key 11
        cout << um.size() << endl;

        // stl map
        map<int, std::string> stdmap;
        // assignment
        stdmap.insert(map<int, std::string>::value_type(1, "one"));
        stdmap.insert(std::pair<int, std::string>(2, "two"));
        stdmap.insert(std::make_pair(3, "three"));
        stdmap[4] = "four";

        map<int, std::string>::iterator pos;
        for (pos = stdmap.begin(); pos != stdmap.end(); ++pos) {
            std::cout<< "key: " << pos->first << "\t"
                << "value: " << pos->second << "\n";
        }

        stdmap.erase(4);
        cout << "map size " << stdmap.size() << endl;

        return 0;
    }

## bimap

可以容纳两个类型的元素，类似于 C++标准提供的映射型容器 map 和 multi_map ，但是 C++标准中的关联数组，只是将一个 key 映射到一个 value, 这种关系是单向的，只能从 key 到 value 而不能反过来。因此  boost.bimap 扩展了标准库的映射型容器，提供双向映射的能力。

对于 `bimap<X, Y>` , bimap.let 相当于 `map<X, Y>` ，而 bimap.right 相当于 `map<Y, X>`

	bimap<collection_type_of<X>, collection_type_of<Y> >

这个概念下， std::map 和 std::multi_map 的左值是一个有序的集合，而右组无任何约束，对应的  bimap 是：

	bimap< set_of<X> , unconstrained_set_of<Y> > 和 bimap<multiset_of<X>, unconstrained_set_of<Y> >

bimap 定义的集合类型包括如下：

- set_of 可以作为键值 索引，有序且唯一，视图相当于 map
- multiset_of 可以用作键值 索引，有序不唯一 ，视图相当于 multimap
- unordered_set_of 可以作为键值，无序且唯一，视图相当于 unordered_map
- unordered_multiset_of 可以作为键值，无序不唯一，视图相当于 unordered_multimap
- list_of 不能作为键值，序列集合，无对应 STL 容器
- vector_of 不能作为键值，随机访问集合，无对应 STL 容器
- unconstrained_set_of 不能作为键值，无任何约束关系，无对应 STL 容器

bimap 可以使用 `using namespace tags;` tagged类给左组和右组数据在语法层面加上“标签”。标签的定义如下：

    template< class Type, class Tag>
    struct tagged {
        typedef Type value_type;
        typedef Tag tag;
    };

tagged<int , struct id> 表示包装了 int 类型 ，标签名字是 id.


    #include <iostream>
    #include <string>
    #include <boost/assign.hpp>
    #include <boost/typeof/typeof.hpp>
    #include <boost/bimap.hpp>
    #include <boost/bimap/list_of.hpp>
    #include <boost/bimap/unordered_set_of.hpp>
    #include <boost/bimap/multiset_of.hpp>
    #include <boost/bimap/list_of.hpp>
    #include <boost/bimap/vector_of.hpp>
    #include <boost/bimap/unconstrained_set_of.hpp>
    #include <boost/assign.hpp>
    using namespace boost;
    using namespace std;

    template< typename T>
    void print_map(T& m){
        for (BOOST_AUTO(pos, m.begin()); pos != m.end(); ++pos) {
            cout << pos->first << "<-->" << pos->second << endl;
        }
    }

    int main(int argc, const char * argv[]) {

        using namespace boost::bimaps;
        using namespace tags;
        // bimap
        bimap<int, string> bmap;

        bmap.left.insert(make_pair(1, "one"));

        bmap.right.insert(make_pair("two", 2));

        for (BOOST_AUTO(pos, bmap.left.begin()); pos != bmap.left.end(); ++pos) {
            cout << "left key: " << pos->first << " value: " << pos->second << endl;
        }

        // 类型集合位于名字空间 boost::bimaps, 需包含各自同名头文件，文件位于 <boost/bimap/list_of.hpp>
        // 左组是有序集合，右组是无序集合
        bimap<int, unordered_set_of< string > > bm1;

        // 左组和右组都是有序多值集合
        bimap< multiset_of<int> , multiset_of< string > > bm2;

        // 左组是无序集合，右组是一个序列，只能有左视图
        bimap< unordered_set_of<int> , list_of<string> > bm3;

        // 左组随机访问集合，右组无约束
        bimap< vector_of<int>, unconstrained_set_of< string > > bm4;

        bimap<tagged<int, struct id>, tagged<string, struct name> > bm;
        bm.by<id>().insert(make_pair(1, "Sam"));

        bm.by<name>().insert(make_pair("Tom", 2));

        print_map(bm.by<id>());

        typedef bimap<int, string> bm_t;

        using namespace boost::assign;
        bm_t bmt = assign::list_of<bm_t::relation>(1, "one")(2 , "two");

        BOOST_AUTO(pos, bmt.left.find(2));
        cout << "key: " << pos->first << "\t" << "value: "<< pos->second << endl;
        BOOST_AUTO(pos2, bmt.right.find("one"));
        cout << "key: " << pos2->first << "\t" << "value: " << pos2->second << endl;

        bmt.left.replace_key(pos, 22);
        bmt.left.replace_data(pos, "replaced two");

        print_map(bmt.left);

        return 0;
    }

bimap 还有很多高级用法，等用到的时候查阅文档吧。

## circular_buffer
循环缓冲区数据结构，大小固定的循环队列。固定大小的缓存容量，当新增加的元素超过缓冲区的容量时，自动将最初的元素覆盖。

## tuple
tuple 元组 定义了固定数目元素的容器，其中每个元素类型都可以不相同，这与其他容器有本质的区别。

    #include <iostream>
    #include <string>
    #include <boost/assign.hpp>
    #include <boost/typeof/typeof.hpp>
    #include <boost/assign.hpp>
    #include <boost/tuple/tuple.hpp>
    #include <boost/tuple/tuple_comparison.hpp>
    #include <boost/tuple/tuple_io.hpp>
    using namespace boost;
    using namespace std;

    int main(int argc, const char * argv[]) {

        typedef boost::tuple<int, string, double> my_tuple;
        my_tuple tuple0(1,"test");
        my_tuple tuple1 = tuple0;
        my_tuple tuple2;
        tuple2 = tuple0;

        my_tuple t1 = boost::make_tuple(2,"test",100.0);
        assert(t1.get<0>() == 2);
        assert(t1.get<1>() == "test");

        // 比较
        my_tuple t2 = boost::make_tuple(3,"test",200.00);
        assert(t1 < t2);

        // io
        cout << t1 << endl;
        cout << "input tuple: example: (1 test 200.0)"<<endl;
        cin >> t1;
        cout << t1 << endl;

        using namespace boost::assign;

        vector<my_tuple> v = tuple_list_of(1, "1", 1.0)(2, "2", 2.0);
        assert(v.size() == 2);

        return 0;
    }

## any

特殊容器，只能容纳一个元素，但这个元素可以是任意类型—— int , double, string, STL 容器或者任意自定义类型。程序可以用 any 保存任意的数据，在任何需要的时候将它取出来，这种功能与 `shared_ptr<void>` 有些类似，但 any 是类型安全的。 any 不是一个模板类。

不要用 any 保存原始指针，代替用 shared_ptr 智能指针。

当 any 以指针的方式传入 any_cast() 的时候，返回的指针类型与传入的 any 对象具有相同的常量。如果 any 不持有任何对象，这两个 any_cast() 不会抛出异常，而是返回一个空指针。

    #include <iostream>
    #include <string>
    #include <boost/assign.hpp>
    #include <boost/typeof/typeof.hpp>
    #include <boost/assign.hpp>
    #include <boost/any.hpp>
    using namespace boost;
    using namespace std;

    // check object type in any
    template< typename T>
    bool can_cast(any &a){
        return typeid(T) == a.type();
    }

    // get value in any
    template< typename T>
    T& get(any &a){                     // &  不能丢失，否则无法修改 a 的值
        BOOST_ASSERT(can_cast<T>(a));
        return *any_cast<T>(&a);
    }

    template< typename T>
    T* get_pointer(any &a){
        BOOST_ASSERT(can_cast<T>(a));
        return any_cast<T>(&a);
    }

    int main(int argc, const char * argv[]) {

        any a(10);
        int n = any_cast<int>(a);       // get value return a copy of a's data : 10
        // any_cast<double>(a) 	throw bad_any_cast
        assert(n == 10);

        a = string("test");
        a = vector<vector<int> >();

        a = n;
        assert(can_cast<int>(a));
        get<int>(a) = 11;                   // Will change a value this line
        *get_pointer<int>(a) = 12;

        return 0;
    }

## variant
与 any 类似，是可变类型，对 C++中 union 概念增强和扩展。

需要头文件：

    #include <boost/variant.hpp>
    using namespace boost;

例子：

    #include <iostream>
    #include <string>
    #include <boost/assign.hpp>
    #include <boost/typeof/typeof.hpp>
    #include <boost/assign.hpp>
    #include <boost/variant.hpp>
    using namespace boost;
    using namespace std;

    int main(int argc, const char * argv[]) {

        typedef variant<int, double, string> var_t;
        var_t v;                                // v == 0
        assert(v.type() == typeid(int));
        assert(v.which() == 0);

        v = "test string";                      // v -> string
        cout << *get<string>(&v) << endl;       // get()

        try {
            cout << get<double>(v) << endl;
        } catch (bad_get &) {
            cout << "bad_get" << endl;
        }

        return 0;
    }

### variant 与 any 的区别
variant 和 any 都可以保存多类型的变量，但是他们的使用是有区别的。

- 都可以容纳一个可变类型的元素，但是 variant 是有界类型，类型范围由用户指定，而 any 则是无界类型，可以容纳任意的类型
- variant 可以在编译期类型检查
- variant 提供泛型的 vistor 方式访问内部元素

## multi_array

多维数组 的高效实现。
multi_array 是递归定义的。

    #include <boost/multi_array.hpp>
    using namespace boost;

具体用法：

    #include <iostream>
    #include <string>
    #include <boost/assign.hpp>
    #include <boost/typeof/typeof.hpp>
    #include <boost/assign.hpp>
    #include <boost/array.hpp>
    #include <boost/multi_array.hpp>
    #include <boost/multi_array/extent_gen.hpp>
    using namespace boost;
    using namespace std;

    int main(int argc, const char * argv[]) {

        multi_array<int, 3> ma;             // 定义三维数组
        multi_array<int, 3> ma1(extents[2][3][4]);      // 定义维度 2/ 3/ 4 的三维数组

        for (int i=0 , v= 0; i < 2; ++i) {
            for (int j =0 ; j< 3; ++j) {
                for (int k  = 0; k < 4; ++k) {
                    ma1[i][j][k] = v++;
                }
            }
        }

        boost::array<size_t, 3> idx = { 0,1,2};
        ma1(idx) = 10;
        cout << ma1(idx) << endl;

        boost::array<size_t, 3> arr = { 4,3,2};
        ma1.reshape(arr);

        for (int i = 0; i< ma1.shape()[0]; ++i) {
            for (int j = 0 ; j < ma1.shape()[1]; ++j) {
                for (int k = 0 ; k < ma1.shape()[2]; ++k) {
                    cout << ma1[i][j][k] << ",";
                }
            }
        }

        ma1.resize(extents[2][9][9]);           // 改变多维数组的大小

        // 创建子视图
        /**
         * (0, 1, 2, 3)
         * (4, 5, 6, 7)
         * (8, 9, 10, 11)
         */

        typedef multi_array<int, 2> ma_type;
        multi_array<int, 2> mademo(extents[3][4]);
        for (int i = 0, v = 0; i< mademo.shape()[0]; ++i) {
            for (int j = 0 ; j < mademo.shape()[1]; ++j) {
                mademo[i][j] = v++;
            }
        }
        cout << endl;

        typedef ma_type::index_range range;
        indices[range(0,2)][range(0,2)];
        /**
         * (0, 1)
         * (4, 5)
         */

        BOOST_AUTO(view, mademo[indices[range(0,2)][range(0,2)] ]);
    //    ma_type::array_view<2>::type view = ma[indices[range(0,2)[range(0,2)]];

        cout << view.num_dimensions() << endl;

        // 将一维数组适配成多维数组
        // 提供了 multi_array_ref 和 const_multi_array_ref
        // 适配完不能动态增长，其他和 multi_array 完全相同
        // const_multi_array_ref 功能少一些，因为它是只读的
        int arra[12];
        for (int i = 0; i < 12; ++i) {
            arra[i] = i;
        }
        multi_array_ref<int, 2> mar(arra, extents[3][4]);

        const_multi_array_ref<int, 2> cmar(arra, extents[2][6]);
        return 0;
    }


## property_tree

property_tree 容器比较复杂，它是一个保存了多个属性值得树形数据结构，功能强大，可以解析 xml, ini, json 和 info 四种格式的文本数据。单独拿一篇文章来讲它好了。


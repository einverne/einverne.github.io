---
layout: post
title: "boost 学习笔记 4：智能指针 smart_ptr"
tagline: "智能指针"
description: "boost 库中智能指针 smart_ptr shared_ptr scoped_ptr"
category: 学习笔记
tags: [boost, C++,]
last_updated: 
---

对应书中第三章 内存管理，着重讲 boost 实现的智能指针，和内存池pool 等概念。众所周知，C++没有提供Java中的垃圾回收机制，因此 boost 实现智能指针用来管理内存避免一些问题。C++继承 C 高效灵活地指针，但是同样带了了很多问题：

- 内存泄露 memory leak
- 野指针 wild pointer
- 越界访问 access denied

虽然STL提供了 `auto_ptr`，但是受限太多(不能放到容器中，因为不支持拷贝构造函数和赋值)，因此很少有人使用。

智能指针（`smart_ptr`）是Boost各组件中，应用最为广泛的一个。使用智能指针需包含以下头文件，如果只使用智能指针 shared_ptr 可以只包含同名头文件。

    #include <boost/smart_ptr.hpp>
    using namespace boost;

Boost从很早就提供了如下的智能指针，并且功能一直保持稳定：

- scoped_ptr：不可拷贝与赋值，承载new，只能在 scoped_ptr 声明的作用域内使用。
- scoped_array：不可拷贝与赋值，承载new []。
- shared_ptr：可拷贝，承载new。boost 库中重要组成，重点学习。
- shared_array：可拷贝，承载new []。
- weak_ptr：弱引用。
- intrusive_ptr：需要自实现计数功能的，引用计数智能指针。

有其他任何问题，请查阅官方文档： <http://www.boost.org/doc/libs/1_60_0/libs/smart_ptr/smart_ptr.htm>

## scoped_ptr

### 主要特点

- scoped_ptr 只限于作用域内使用
- 指针管理权不可转移，不支持拷贝构造函数与赋值操作。

从名字就可以看出，这种智能指针只限于作用域内使用，无法转移内置指针的管理权(不支持拷贝、=赋值等)
但是作用也很显然，例如：

    void test()
    {
        int* p = new int(3);
        ...
        delete p;
    }

假设定义到delete之中...发生了异常，那么p就无法被delete，造成了内存泄漏。使用scoped_ptr就可以很好解决这个问题，只需要new的时候放到scoped_ptr之中就可以了。

### 主要用法
scoped_ptr 常用方法：

假设：

	scoped_ptr<T> ptr_t(new T); // 假设内置指针为p_t

则：

* ptr_t->get()，返回内部管理的指针，但禁止在get()出来的指针上执行delete。
* ptr_t->xxx()，等同于p_t->xxx()
* ptr_t.reset()，delete内部持有的p_t。
* 假设T支持直接赋值，*ptr_t = xxx。
* 再次强调，scoped_ptr不能做拷贝、赋值等转移指针管理权限的事情。因此，class内置域为scoped_ptr\<T\>是不允许的，除非class也禁止拷贝、赋值

例子：

	// scoped_ptr usage
	scoped_ptr<string> sp(new string("text"));
	cout << *sp << endl;
	cout << sp->size() << endl;

	// pointer 管理权移交 scoped_ptr
	auto_ptr<int> ap(new int(10));
	scoped_ptr<int> scoped(ap);
	assert(ap.get() == 0);

	ap.reset(new int(20));
	cout << *ap << ", " << *scoped << endl;

	auto_ptr<int> ap2;
	ap2 = ap;
	assert(ap.get() == 0);			// ap is null-pointer

具体例子如下：

    #include <iostream>
    #include <boost/smart_ptr.hpp>

    class SmallClass
    {
        public:
            SmallClass(int x_val)
            {
                x = x_val;
                std::cout << "SmallClass construct " << x << std::endl;
            }

            virtual ~SmallClass()
            {
                std::cout << "SmallClass destory " << x << std::endl;
            }

            int GetX()
            {
                return x;
            }

        private:
            int x;
    };

    int main()
    {
        std::cout << "main start" << std::endl;

        // scoped_ptr on basic
        boost::scoped_ptr<int> int_ptr(new int);
        *int_ptr = 100;
        ++*int_ptr;
        std::cout << *int_ptr << std::endl;

        // scoped_ptr on class
        boost::scoped_ptr<SmallClass> sc_ptr(new SmallClass(0));
        std::cout << sc_ptr->GetX() << std::endl;
        sc_ptr.reset();
        std::cout << "main end" << std::endl;

        return 0;
    }

## scoped_array

### 主要特点
同 scoped_ptr 基本一样，只不过可接受数组的new []，多了下标访问操作，其他类似。

- 构造函数指针必须是 new[] 的结果，而不能是 new 表达式的结果
- 没有 *， -> 操作符重载，因为 scoped_array 持有的不是一个普通指针
- 析构函数使用 delete[] 释放资源，而不是 delete
- 提供 operator[] 操作符重载，可以像普通数组一样用下标访问
- 没有 begin(), end() 等类似容器迭代器操作函数

### 主要用法

scoped_array 轻巧方便，没有给程序增加额外负担，但是 scoped_array 功能有限，不能动态增长，也没有迭代器支持，不能搭配 STL 算法，仅有一个纯粹的“裸”数组接口。在需要动态数组的情况下我们应该使用 std::vector 。

例子如下:

    #include <iostream>
    #include <string>
    #include <vector>
    #include <boost/smart_ptr.hpp>

    using namespace std;
    using namespace boost;

    int main(int argc, const char * argv[]) {

        scoped_array<int> scopedarr(new int[100]);
        scopedarr[0] = 100;           // 赋值
    //    *(scopedarr+1) = 200;       // error

		// fill array with 100 value 2
        fill_n(&scopedarr[0], 100, 2);
        cout << scopedarr[2] << endl;

        scopedarr[3] = scopedarr[0]+scopedarr[1];
        cout << scopedarr[3] << endl;

        cout << scopedarr.get()[3] << endl;

        return 0;
    }

## shared_ptr

### 主要特点

最像指针的“智能指针”，是 boost.smart_ptr 库中最有价值，最重要的组成部分。支持拷贝构造函数、支持赋值操作。重载了*和->操作符用来模仿原始指针的行为。目前已成为tr1标准的一部分，发展自原始的auto_ptr，内置引用计数。

- 支持拷贝构造函数，赋值操作
- 重载 * 和 -> 操作符模仿原始指针
- 内置引用计数

使用时候有3点要特别注意：

1. 禁止get()得到指针地址后，执行delete，这个同scoped_ptr。
2. 禁止循环引用，否则会出内存泄漏。
3. 不要将shared_ptr用于函数的临时参数：

    // 下面这个是OK的。
    void ok()
    {
        shared_ptr<int> p(new int(2));
        f(p, g());
    }

    // 下面这个就可能内存泄漏！
    void bad()
    {
        f(shared_ptr<int>(new int(2)), g());
    }

### 主要使用

看看基本的使用例子。

    #include <iostream>
    #include <string>
    #include <vector>
    #include <random>
    #include <boost/smart_ptr.hpp>
    #include <boost/make_shared.hpp>

    using namespace boost;

    void print_count_func(shared_ptr<int> p){
        std::cout << "cout: " << p.use_count() << " value= " << *p << std::endl;
    }

    class shared {
    private:
        shared_ptr<int> p;

    public:
        shared(shared_ptr<int> _p):p(_p) {}
        void print(){
            std::cout << "cout: " << p.use_count() << " value= " << *p << std::endl;
        }
    };

    int main(int argc, const char * argv[]) {

        // 构造函数
        // 无参数构造空指针 shared_ptr
        shared_ptr<int> p0;

        // shared_ptr(Y * p) 获得指向类型 T 的指针 p 的管理权
        shared_ptr<int> p1(new int);
        *p1 = 12;

        // shared_ptr(shared_ptr const & r) 从另外 shared_ptr 获取管理权，两个 shared_ptr 同时共享一个指针管理权
        shared_ptr<int> p2(p1);                 // p1 引用计数加1
        std::cout << "p1 count: " << p1.use_count() << " value: " << *p2 << std::endl;
        *p2 = 13;
        std::cout << "p1 count: " << p1.use_count() << " value: " << *p2 << std::endl;
        p2.reset();
        std::cout << "p1 count: " << p1.use_count() << std::endl;


        // shared_ptr(std::auto_ptr<Y> & r) 从 auto_ptr 获得指针管理权， 同时 auto_ptr 失去管理权
        std::auto_ptr<int> p;
        shared_ptr<int> p3(p);

        // operator= 赋值操作符，从另外一个 shared_ptr 或 auto_ptr 获得指针管理权，等同于构造函数
        shared_ptr<int> p4 = p1;

        // shared_ptr(Y * p, D d) 类似于 shared_ptr(Y * p)
        // 第一个参数是要被管理的指针，第二个删除参数 d 告诉 shared_ptr 在析构时不使用 delete 来操作指针 p，而使用 d 来操作，把 delete p 换成 d(p)


        // usage
        shared_ptr<int> sp(new int(100));
        print_count_func(sp);
        shared shared1(sp), shared2(sp);

        shared1.print();
        shared2.print();

        *sp = 200;

        print_count_func(sp);
        shared1.print();

        // make_shared
        // include <boost/make_shared.hpp>

        shared_ptr<std::string> strp = make_shared<std::string>("make_test");
        shared_ptr<std::vector<int> > vecp = make_shared< std::vector<int> >(10, 3);

        std::cout << *strp << " " << vecp->size() << std::endl;

        // shared_ptr in vector
        // 因为 shared_ptr 实现了拷贝构造、=赋值构造等函数，因此可以完美的放入STL容器中。
        typedef std::vector< shared_ptr<int> > vs;
        vs v(10);

        int i = 0;
        for (vs::iterator pos = v.begin(); pos != v.end(); ++pos) {
            *pos = make_shared<int>(++i);
            std::cout << *(*pos) << ", ";
        }
        std::cout << std::endl;

        shared_ptr<int> ptest = v[9];
        *ptest = 100;
        std::cout << *v[9] << std::endl;


        return 0;
    }



然后来讨论类中成员使用shared_ptr的例子，先扯一个稍微远一点的。假设我们类的成员需要new出来，先来看一个错误的例子：

    #include <iostream>
    #include <string>
    #include <vector>
    #include <random>
    #include <boost/smart_ptr.hpp>
    #include <boost/make_shared.hpp>

    using namespace boost;

    class ClassOne
    {
    public:
        ClassOne(int data_param):data(NULL)
        {
            init(data_param);
            std::cout << "construct" << std::endl;
        }

        virtual ~ClassOne()
        {
            if(data)
            {
                delete data;
            }
            data = NULL;
        }

        void init(int data_param)
        {
            if(data)
            {
                delete data;
            }
            data = new int(data_param);
        }

    private:
        int* data;
    };

    int main(int argc, const char * argv[]) {
        ClassOne c1(10);
        ClassOne c2(c1);
        ClassOne c3 = c2;

        return 0;
    }

上面的ClassOne没有问题，但是会由编译器生成默认的拷贝、赋值构造函数，于是，当c3=c2或者c2(c1)时， 指针data的地址被复制了多份，c1、c2、c3各持有一份，析构的时候就被delete了3次，于是memory error是必须的了。遇到这种情况传统做法就是，c1、c2、c3各保存独立的data区域，即深拷贝：自己写拷贝构造、赋值构造函数。

    #include <iostream>
    #include <string>
    #include <vector>
    #include <random>
    #include <boost/smart_ptr.hpp>
    #include <boost/make_shared.hpp>

    using namespace boost;

    class ClassOne
    {
    public:
        ClassOne():data(NULL) {}
        ClassOne(int data_param):data(NULL)
        {
            init(data_param);
            std::cout << "construct" << std::endl;
        }

        virtual ~ClassOne()
        {
            if (data) {
                delete data;
            }
            data = NULL;
        }

        ClassOne(const ClassOne& rhs){
            std::cout<< "copy " <<std::endl;
            data = NULL;
            init(*rhs.data);
        }

        ClassOne& operator = (const ClassOne& rhs){
            std::cout<< "assign " <<std::endl;
            delete data;               // delete your own old data
            data = new int(*rhs.data); // clone the rhs's data
            return *this;
        }

        void init(int data_param)
        {
            delete data;
            data = new int(data_param);
        }

    private:
        int* data;
    };

    int main(int argc, const char * argv[]) {
        ClassOne c1(10);
        ClassOne c2(c1);       // 实际调用的是B(A)拷贝操作 call copy constructor
        ClassOne c3;
        c3 = c1;               // 申明之后进行赋值运算 call assignment function
        return 0;
    }


现在我们假设另外一种情况，即data仍然需要从堆上new出来，但可以被若干实例共享。此时可以用 shared_ptr，而且甚至不需要编写拷贝构造、=赋值构造，就可以。如下：

    #include <iostream>
    #include <string>
    #include <vector>
    #include <random>
    #include <boost/smart_ptr.hpp>
    #include <boost/make_shared.hpp>

    using namespace boost;

    class ClassOne
    {
    public:
        ClassOne(int data_param):ptr_data(new int)
        {
            init(data_param);
            std::cout << "construct" << std::endl;
        }

        virtual ~ClassOne()
        {

        }

        int get_data() const{
            return *ptr_data;
        }

        long ptr_count() const {
            return ptr_data.use_count();
        }

        void init(int data_param)
        {
            *ptr_data = data_param;
        }

    private:
        shared_ptr<int> ptr_data;
    };

    int main(int argc, const char * argv[]) {
        ClassOne c1(10);
        ClassOne c2(c1);
        ClassOne c3 = c2;

        std::cout << c1.ptr_count() << std::endl;
        std::cout << c2.get_data() << std::endl;

        return 0;
    }

实际上，c++编译器自动生成的拷贝、=赋值构造函数完成了ptr_data的赋值拷贝工作，而智能指针赋值拷贝的同时，引用计数也加1了。在默认析构函数也是如此，析构函数执行之后，会调用所有成员(ptr_data)的析构函数，检查引用计数都为0后，会delete掉这个int。
从而完美的完成了无内存泄漏的、无内存出错的、多个实例之间的指针变量共享。


## shared_array
同scoped_array类似，shared_array是shared_ptr的数组版本，不再赘述。

## weak_ptr
weak_ptr 被设计为与 shared_ptr 共同工作，可以从一个 shared_ptr 或者另一个 weak_ptr 对象构造，获得资源的观测权。但是 weak_ptr 没有共享资源，它的构造不会引起指针引用计数的增加，同时，在析构的时候也不回引起引用计数的减少。

shared_ptr看起来已经很完美了，但有个致命缺陷：不能管理循环引用的对象。
看如下的例子：

    #include <string>
    #include <iostream>
    #include <boost/shared_ptr.hpp>
    #include <boost/weak_ptr.hpp>

    class parent;
    class children;

    typedef boost::shared_ptr<parent> parent_ptr;
    typedef boost::shared_ptr<children> children_ptr;

    class parent
    {
    public:
        ~parent() { std::cout <<"destroying parent\n"; }

    public:
        children_ptr children;
    };

    class children
    {
    public:
        ~children() { std::cout <<"destroying children\n"; }

    public:
        parent_ptr parent;
    };

    void test()
    {
        parent_ptr father(new parent());
        children_ptr son(new children);

        father->children = son;
        son->parent = father;
    }

    void main()
    {
        std::cout<<"begin test...\n";
        test();
        std::cout<<"end test.\n";
    }
    
由于parent和child相互引用，他们的计数永远都为1，所以这样使用shared_ptr必然会导致内存泄漏。
boost::weak_ptr必须从一个boost::share_ptr或另一个boost::weak_ptr转换而来，这也说明，进行该对象的内存管理的是那个强引用的boost::share_ptr。boost::weak_ptr只是提供了对管理对象的一个访问手段。
弱引用不更改引用计数，类似普通指针，只要把循环引用的一方使用弱引用，即可解除循环引用。
还有两个常用的功能函数：expired()用于检测所管理的对象是否已经释放；lock()用于获取所管理的对象的强引用指针。

    class children
    {
    public:
        ~children() { std::cout <<"destroying children\n"; }

    public:
        boost::weak_ptr<parent> parent;
    };
    
再次强调，weak_ptr必须从shared_ptr而来。

    #include <boost/smart_ptr.hpp>
    #include <iostream>

    int main()
    {
        boost::shared_ptr<int> ptr(new int(10));
        std::cout << ptr.use_count() << std::endl;
        boost::weak_ptr<int> ptr_weak(ptr);
        std::cout << ptr.use_count() << std::endl;
        std::cout << ptr_weak.expired() << std::endl;
        return 0;
    }
    
## intrusive_ptr

intrusive_ptr是一种“侵入式”的引用计数指针，实际并不提供引用计数功能，而是要求被存储的对象自己实现引用计数功能。可以应用于以下两种情形：

- 对内存占用要求非常严格，要求必须与原始指针一样；
- 现存代码已经有了引用计数机制管理的对象。
它提供intrusive_ptr_add_ref和intrusive_ptr_release函数接口供boost::intrusive_ptr调用。

## 参考 {#reference}

- [官方文档](http://www.boost.org/doc/libs/1_60_0/libs/smart_ptr/intrusive_ptr.html)
- [coder4.com](http://www.coder4.com/archives/3782)
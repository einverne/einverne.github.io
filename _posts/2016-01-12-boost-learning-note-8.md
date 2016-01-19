---
layout: post
title: "boost 学习笔记 8：算法"
tagline: ""
description: ""
category: 学习笔记
tags: [boost, C++]
last_updated: 
---

对应书中第8章 算法，这一章作者介绍的很简单，只是举例使用 foreach , minmax ，其他算法都略去了。


## foreach
将C++的语法扩充，使用 foreach 循环变量。

需包含头文件

    #include <boost/foreach_hpp>

具体用法：

    #include <iostream>
    #include <string>
    #include <boost/assign.hpp>
    #include <boost/typeof/typeof.hpp>
    #include <boost/assign.hpp>
    #include <boost/foreach.hpp>
    using namespace boost;
    using namespace std;

    int main(int argc, const char * argv[]) {

        using namespace boost::assign;
        vector<int> v = (list_of<int>(1),2,3,4,5);

        /**
         * 第一个参数 VAR 是循环变量声明 想要高效地使用序列内元素或者修改序列，需要声明使用引用
         * 第二个参数 COL 是要遍历的序列
         *
         */
        BOOST_FOREACH(int x, v){
            cout << x << "-";
        }
        cout << endl;

        string str("hello world");
        BOOST_FOREACH(char& c, str){
            cout << c << "-";
        }
        cout << endl;

        // use typeof
        BOOST_TYPEOF(*v.begin()) y;             // BOOST_AUTO(y, *v.begin())
        BOOST_FOREACH(y, v){
            cout << y << ",";
        }
        cout << endl;

        return 0;
    }

## minmax

在同一次操作中同时获取最大最小值。需包含头文件：

    #include <boost/algorithm/minmax.hpp>
    using namespace boost;

具体用法：

    #include <iostream>
    #include <string>
    #include <boost/assign.hpp>
    #include <boost/typeof/typeof.hpp>
    #include <boost/assign.hpp>
    #include <boost/algorithm/minmax_element.hpp>
    using namespace boost;
    using namespace std;

    int main(int argc, const char * argv[]) {

        using namespace boost::assign;

        vector<int> v = (list_of(543), 90, 23, 42, 3, 10);

        BOOST_AUTO(x ,boost::minmax_element(v.begin(), v.end()));
        cout << "min: " << *x.first << endl;
        cout << "max: " << *x.second << endl;

        // first_min_element  找到第一个最小值
        // last_min_element 最后一个最小值

        return 0;
    }

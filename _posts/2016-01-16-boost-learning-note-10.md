---
layout: post
title: "boost 学习笔记 10：Python"
tagline: ""
description: ""
category: 学习笔记
tags: [boost, C++]
last_updated: 
---

项目中需要将C++的程序暴露给网络使用，我也不想使用C++来用网络编程，就想到可以使用Python来解决Web端，然后将 C++ 的接口暴露给 Python 。于是在寻求解决方案的时候找到了 boost.python 库。

boost 中的 Python 库支持在 Python 和 C++ 之间的自由转换，包括 C++ 到 Python 的类型转换，默认参数，关键字参数，引用，指针等等。boost.python 库可以让 Python 轻易地调用 C++ 编写的模块，也可以很容易地在 C++ 中调用 Python 。

## 使用

C++ 文件中需要包含头文件

    #include <boost/python.hpp>
    using namespace boost::python;

还需要在链接的时候，加入 `-lboost_python`。

以下操作借助Linux下g++完成，Windows可能需要借助其他工具，导出C++函数具体实现：

hello.cpp

    char const* greet()
    {
        return "hello, world";
    }

    #include <boost/python.hpp>

    BOOST_PYTHON_MODULE(hello)			// Python 模块开始
    {
        using namespace boost::python;		// 打开命名空间
        def("greet", greet);
    }

Makefile

    PYTHON_VERSION = 2.7
    PYTHON_INCLUDE = /usr/include/python$(PYTHON_VERSION)

    # location of the Boost Python include files and library
    #  
    BOOST_INC = /usr/local/include
    BOOST_LIB = /usr/local/lib

    # compile mesh classes
    TARGET = hello

    $(TARGET).so: $(TARGET).o
        g++ -shared $(TARGET).o -L$(BOOST_LIB) -lboost_python -L/usr/lib/python$(PYTHON_VERSION)/config -lpython$(PYTHON_VERSION) -o $(TARGET).so

    $(TARGET).o: $(TARGET).cpp
        g++ -I$(PYTHON_INCLUDE) -I$(BOOST_INC) -fPIC -c $(TARGET).cpp

    clean:
        rm *.so *.o

hello.py

    #!/usr/bin/env python
    # -*- coding: UTF-8 -*-

    import hello
    print hello.greet()

输出： hello, world

注意将 python, boost 所在目录 include 进去，在链接时加上 `-lboost_python -lpython2.7` 并 include python 和 boost目录。


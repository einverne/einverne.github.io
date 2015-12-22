---
layout: post
title: "boost 学习笔记 1: lexical_cast"
tagline: ""
description: "C++ 类型转换"
category: 学习笔记
tags: [boost, C++]
last_updated: 
---

开始接触boost是因为项目中用到C++与Python的相互调用传值，后来找到一本《boost程序库完全开发指南》感觉boost库很强大，就学了一下。所以boost学习笔记基本沿用《boost程序库完全开发指南》书中脉络。

因为C++是强类型语言，所以对于Python，perl之类的动态语言来说很麻烦的一件事情就是类型转换，虽然C中也提供了atoi(),atof()之类的函数，但是总体也还是很麻烦。幸而有了`lexical_cast`，他可以用来进行字符串、整数/浮点数之间的字面转换。

## 头文件

lexical_cast 位于boost命名空间，为了使用 lexical_cast，需要包含头文件 <boost/lexical_cast.hpp>，即：

	#include <boost/lexical_cast.hpp>
	using namespace boost;

## 基本方法

lexical_cast在转换字符串时，字符串中只能包含数字和小数点，不能出现除e/E以外的英文字符或者其他非数字字符。

	using boost::lexical_cast;
	int a = lexical_cast<int>("123");					// string -> int
	long b = lexical_cast<long>("2015");				// string -> long
	double c = lexical_cast<double>("123.12");			// string -> double
	float pai = lexical_cast<float>("3.14159");			// string -> float

	std::cout << a << b << c << pai << std::endl;

数字转换成字符串时不支持高级格式控制。

	string str = lexical_cast<string>(123);				// int -> string
	std::cout << str << std::endl;
	cout << lexical_cast<string>(1.234) << endl;		// float -> string
	cout << lexical_cast<string>(0x11) << endl;			// 16进制 -> string

	// lexical_cast can cast 0 & 1 to bool, but only support 0 & 1, not support True or False string
	bool bl = lexical_cast<bool>("1");					// string -> bool, only support 1 & 0

## 异常操作

当 lexical_cast 无法执行转换时会抛出异常 bad_lexical_cast ，它是 std::bad_cast 的派生类。可以使用 try/catch 块来保护代码。

	try{
		cout << lexical_cast<int>("0x100");
		cout << lexical_cast<bool>("false");
	}catch (bad_lexical_cast& e){
		cout << "error: " << e.what() << endl;
	}
    
代码运行结果：

error: bad lexical cast: source type value could not be interpreted as target

## 转换对象要求

lexical_cast 对转换对象有如下要求：

1. 转换起点对象是可流输出的，即定义了 operator<<
2. 转换终点对象是可流输入的，即定义了 operator>>
3. 转换终点对象必须是可缺省构造和可拷贝构造的

C++中内建类型（int，double等）和std::string 都是符合三个条件的。

## 自定义类

如果想要将 lexical_cast 用于自定义类，实现 java 中 Object.toString() 的用法，只需要满足 lexical_cast 的要求，实现流输出操作符 operator<< 即可。

    class demo_class{
        friend ostream& operator<<(ostream& os, const demo_class& x){
            os << "class content" << endl;
            return os;
        }
    };
    int main() {
        demo_class demo = demo_class();
        cout << lexical_cast<string>(demo) << endl;
	}

输出结果：

class content


---
layout: post
title: "boost 学习笔记 2: timer and date_time"
tagline: ""
description: "时间"
category: 学习笔记
tags: [boost, C/C++,]
last_updated: 
---

C++中操作时间的类。timer 是一个很小的库，提供简易的度量时间和进度显示的功能，可用于测试性能计时任务等大多数情况。timer 库包含三个组件， 计时器类 timer, progress_timer 和进度条指示类 progress_display.

## timer
### 头文件

timer 位于boost命名空间，需要包含头文件 <boost/timer.hpp> 即：

	#include <boost/timer.hpp>
	using namespace boost;

### 基本方法
timer变量声明之后即开始计时工作，之后可以调用 `elapsed()` 方法来测量对象自创建之后所流逝的时间。成员函数 `elapsed_max()` 和 `elapsed_min()` 方法返回 timer 能够测量的时间最大值和最小值，输出单位秒。timer类的实现代码很少，可参考源码学习。

	/**
		 * timer simple and useful, suitable for short time task.
		 * Do not use it to calculate time for long time.
		 * For long time calculate check date_time lib
		 */
	using boost::timer;
	timer t;															// declare timer start counting
	cout << "max timespan:" << t.elapsed_max() / 3600 << "h" << endl;
	cout << "min timespan:" << t.elapsed_min() << "s" << endl;
	cout << "now time elapsed:" << t.elapsed() << "s" << endl;

### timer 实现源码
使用标准库头文件 <ctime> 中的 std::clock() 函数。

    class timer
    {
     public:
             timer() { _start_time = std::clock(); } // postcondition: elapsed()==0
    //         timer( const timer& src );      // post: elapsed()==src.elapsed()
    //        ~timer(){}
    //  timer& operator=( const timer& src );  // post: elapsed()==src.elapsed()
      void   restart() { _start_time = std::clock(); } // post: elapsed()==0
      double elapsed() const                  // return elapsed time in seconds
        { return  double(std::clock() - _start_time) / CLOCKS_PER_SEC; }

      double elapsed_max() const   // return estimated maximum value for elapsed()
      // Portability warning: elapsed_max() may return too high a value on systems
      // where std::clock_t overflows or resets at surprising values.
      {
        return (double((std::numeric_limits<std::clock_t>::max)())
           - double(_start_time)) / double(CLOCKS_PER_SEC); 
      }

      double elapsed_min() const            // return minimum value for elapsed()
       { return double(1)/double(CLOCKS_PER_SEC); }

     private:
      std::clock_t _start_time;
    }; // timer

### 使用建议

- 不适合高精度计时，精度依赖操作系统或编译器
- 不适合大跨度时间段测量，最大跨度只有几百小时，如需要天、月甚至年做时间单位，可使用 date_time 库

## progress_timer

### 头文件

	#include <boost/progress.hpp>
	using namespace boost;

### 基本用法

在定义 progress_timer 之后，析构对象时会自动输出流逝时间。可以使用花括号，来使 progress_timer 实现计时功能。

    progress_timer t;
    // do some work
    cout << t.elapsed() << endl;	//print out elapsed time for the task

progress_timer 精度问题，只能保留到小数点后两位，精确到百分之一秒。

## progress_display

### 头文件

	#include <boost/progress.hpp>
	using namespace boost;

### 基本用法
在构造函数中传入总数，然后迭代更新进度条。

    vector<string> v(100);
    ofstream fs("test.txt");
    progress_display pd(v.size());					// 构造函数，传入进度总数

    vector<string>::iterator pos;
    for (pos = v.begin(); pos != v.end(); ++pos){	// 遍历迭代，处理字符串，写文件
        fs << *pos << endl;
        ++pd;										// 更新进度
    }

### progress_display 问题

progress_display 向标准输出 cout 输出字符，无法将进度条和输出分离，如果循环中带有输出，则显示会很难看。
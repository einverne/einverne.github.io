---
layout: post
title: "boost 学习笔记 5：文本字符串相关"
tagline: ""
description: ""
category: 学习笔记
tags: [boost, C++]
last_updated: 
---

字符串相关库，对应书中第五章 字符串与文本处理，大大增强了C++在文本处理上的能力。 lexical_cast 实现了字符串和数字之间的方便转换；format库提供了C++ 类似 printf() 的能力，用以格式化输出；string_algo 是一个算法库，提供了大量与字符串和文本处理相关的算法；tokenizer 库专注于文本处理领域的分词功能；xpressive 是一个灵活且功能强大的正则表达式解析库。

## lexical_cast
之前单独有一篇文章讲 lexical_cast 这里不再重复。

## format

format 基本集成了 printf 的格式化语法，每个 printf 格式化选项都以 % 符号开始，后面是格式规则，例如

- %05d ：输出宽度为5的整数，不足位用0填充
- %-8.3f ：输出左对齐，总宽度为8，小数位3位浮点数
- % 10s ：输出10位字符串，不足位用空格填充
- %05X ：输出宽度为5的大写16进制整数，不足位用0填充。

新增格式：

- %\|spec\| ： 竖线分割，区分格式化选项和普通字符
- %N% ： 标记第N个参数，相当于占位符，不带任何其他的格式化选项

### 主要用法

需要包含头文件

    #include <boost/format.hpp>
    using namespace boost;

例子：

    cout << format ("%s:%d+%d=%d\n" )% "sum" % 1 % 2 % (1+2);

    format fmt("(%1% + %2%) * %2% = %3%\n" );
    fmt % 2 % 5 % ((2+5) * 5);
    cout << fmt.str();

    /**
    * 程序结果
    * sum:1+2=3
    * (2 + 5) * 5 = 35
    */

format 还有很多高级的用法，参见文档。

## string_algo

C++98 标准库中提供了字符串标准类 std::string , 它有一些基本成员函数用以查询子串，访问字符，等基本功能。

### 主要特点

提供全面的字符串算法库

- 大小写无关比较
- 修剪
- 特定模式子串查找

### 主要用法

包含头文件

    #include <boost/algorithm/string.hpp>
    using namespace boost;

例子：

    #include <iostream>
    #include <vector>
    #include <boost/algorithm/string.hpp>
    using namespace std;
    using namespace boost;

    int main() {

        string str("readme.txt");
        if (ends_with(str, " txt")) {
        	cout << to_upper_copy(str) + "UPPER" << endl;              // upper case
        }

        replace_first(str, "readme ", "followme ");                       // replace
        cout << str << endl;

        vector<char> v(str.begin(), str.end());
        vector<char> v2 = to_upper_copy(erase_first_copy(v, "txt ")); // delete sub string
        for (int i = 0; i < v2.size(); ++i) {
        	cout << v2[i];
        }

        return 0;
    }

string_algo 库命名遵循标准库惯例，算法名均为小写形式，并使用不同前缀或者后缀来区分不同版本，命名规则如下：

- 前缀 i  : 表示算法大小写不敏感，否则大小写敏感
- 后缀_copy : 表示算法不变动输入，返回处理结果的拷贝，否则算法原地处理，输入即输出
- 后缀_if : 需要判断式的谓词函数对象，否则使用默认的判断准则

string_algo 库提供算法共分为五大类：

- 大小写转换
- 判断式与分类
- 修建
- 查找与替换
- 分割与合并

每一类算法中都会包含一系列函数。

## tokenizer

### 主要特点
tokenizer 库是专门用于分词 token 字符串处理库，可以用简单方法把一个字符串分解成若干单词。

tokenizer 库可以容易地执行分词操作，但是它存在一些固有的缺陷。

- 只支持单字符分割，当遇到“\|\|”分割符时无能为力，智能自定义分词函数，或者使用 string_algo,  正则表达式等其他方法
- 对wstring(unicode) 缺乏完善的考虑

### 主要用法

需包含头文件：

    #include <boost/bokenizer.hpp>
    using namespace boost;

例子：

    #include <iostream>
    #include <vector>
    #include <cstring>
    #include <boost/assign.hpp>
    #include <boost/typeof/typeof.hpp>
    #include <boost/tokenizer.hpp>
    using namespace std;
    using namespace boost;

    template<typename T>
    void print(T &tok) {
        for (BOOST_AUTO(pos, tok.begin()); pos != tok.end(); ++pos) {
        cout << *pos << "|\t";
        }
        cout << endl;
    }
    int main() {
        string str("Link radfe the dfafe -adfead");

        tokenizer<> tok(str);

        print(tok);

        /**
         * char_separator
         * 第一个参数 dropped_delims 分隔符集合，这个集合中的字符不会作为分词结果出现
         * 第二个参数 kept_delims 分隔符集合，其中的字符会保留在分词结果中
         * 第三个参数 empty_tokens 类似 split 算法 eCompress 参数，处理两个连续出现的分隔符。 keep_empty_tokens 表示连续出现的分隔符标识了一个空字符串。
         * 使用默认构造函数，不传入任何参数，行为等同于 char_separator(" ",标点符号字符, drop_empty_tokens) ，以空格和标点符号分词，保留标点符号，不输出空白单词。
         */
        char * s = "xxx ;; <yyy-zzz> !!!";
        char_separator<char> sep;
        tokenizer<char_separator<char>, char *> tok1(s, s + strlen(s), sep);
        print(tok1);

        char_separator<char> sep1(";-<>！", "", keep_empty_tokens);
        tok1.assign(s, s + strlen(s), sep1);
        print(tok1);

        char_separator<char> sep2(" ;-!", "<>", drop_empty_tokens);
        tok1.assign(s, s + strlen(s), sep2);
        print(tok1);

        /**
         * escaped_list_separator
         * 专门处理 CSV 格式（Comma Split Value,逗号分割值）的分词对象
         * 第一个参数 e 指定了字符串中的转义字符，默认是斜杠\
                         * 第二个参数是分隔符，默认是逗号
         * 第三个参数是引号字符，默认是"
         */

        string strcom = "id,100,name,\" mario\"";
        escaped_list_separator<char> sepcom;
        tokenizer<escaped_list_separator<char> > tokcom(strcom, sepcom);
        print(tokcom);

        /**
         * offset_separator
         * 不是基于分隔符，而是使用偏移量，在处理某些不使用分隔符，而使用固定字段宽度文本时非常有用。
         * 构造函数接受两个迭代器，也可以是数组指针begin end,指定分词用的整数偏移量序列，整个序列每个元素是分词的宽度
         *
         bool 参数 bwrapoffsets ，决定是否在偏移量用完之后继续分词
         *
         bool 参数 return_partial_last 决定在偏移量序列最后是否返回分词不足的部分
         * 最后两个参数默认值都是true
         */
        string stroffset = "2233344445566666666";
        int offsets[] = { 2, 3, 4 };
        offset_separator sepoff(offsets, offsets + 3, true, false);
        tokenizer<offset_separator> tokoff(stroffset, sepoff);
        print(tokoff);

        offset_separator sepoff2(offsets, offsets + 3, false);
        tokoff.assign(stroffset, sepoff2);
        print(tokoff);

        offset_separator sepoff3(offsets, offsets + 3, true, false);
        print(tokoff);
        return 0;
    }

## xpressive

正则表达式是处理文本强有力的工具，使用复杂的语法规则，能够解决文本处理领域绝大多数问题，诸如验证、匹配、查找、替换等等。xpressive 是一个先进的、灵活的、功能强大的正则表达式库，提供了对正则表达式全面的支持，而且比原正则表达式库 boost.regex 要好的是它不需要编译，速度快，同时语法又很类似。

xpressive 提供动态和静态两种方式。静态方式使用操作符重载生成编译期的表达对象，可以在编译期进行正则表达式的语法检查。动态的方式则是较传统的用法，与 boost.regex  和 Python 中的 re 模块相似，以字符串作为一个表达式对象，在运行时进行语法检查和处理。

### 正则表达式介绍

正则表达式定义了一套完善而复杂的语法规则，用于匹配特定模式的字符串，少量字符被用于定义特殊匹配模式语法，它们是： .^$()*+?{}[]\\\|。

- 点号 (.) 匹配任意单个字符
- ^ 尖角号 行开头
- $ 行尾
- () 括号，子表达式，可重复
- \* 星号，表前面元素可以重复任意多次 (n>=0)
- \+ 加号，表前面元素可以重复一次或多次（n>0)
- ? 问号，表前面的元素可以重复0次或者1次 （n=0，1）
- {} 手动指定元素重复次数， {n}重复n次， {n,} 重复 >=n次， {n,m } 重复 n 到 m 次之间的次数, 即 n <= x <=m 次。
- [] 定义字符集合
- \\ 转义字符
- \| 逻辑或的概念，匹配两侧的元素之一。

其他经常使用 \d  匹配数字 [0-9] , \w 匹配字母 [a-z] , \s 匹配空格等。

C++ 代码中的斜杠需要变成双斜杠，在使用正则表达式时，在语句前使用注释保存原始表达式，以方便未来的调试和维护。

- basic_regex 是正则表达式的基本类，常用 `sregex` 和 `cregex` 用于操作std::string ，和 C风格字符串。
- match_results 保存正则匹配结果，常用 smatch 和 cmatch 用来支持 std::string 和 字符串。
- sub_match 模板类类似迭代器对的对象，继承自 std::pair ，可以把它当成作一个字符串的区间。

### 主要用法

- 混用两种方式，包含头文件 <boost/xpressive/xpressive.hpp>
- 仅仅想使用静态方式，可以只包含头文件  <boost/xpressive/xpressive_static.hpp>
- 仅仅想使用动态方式，可以只包含头文件 <boost/xpressive/xpressive_dynamic.hpp>

须有如下命名空间：

	using namespace boost::xpressive;

例子：

    #include <iostream>
    #include <vector>
    #include <cstring>
    #include <boost/assign.hpp>
    #include <boost/typeof/typeof.hpp>
    #include <boost/tokenizer.hpp>
    #include <boost/xpressive/xpressive_dynamic.hpp>
    using namespace std;
    using namespace boost;

    int main() {
        using namespace boost::xpressive;

        string s = "Hi world, I am from Mars!";
        sregex reg = sregex::compile("(M\\w{3})");
        bool ret = regex_match(s, reg);

        // match identity card number
        // 18 number , first 6 area code, middle 8 birthday, last 4 random number possible x
        // \d{6}(1|2)\d{3}(0|1)\d[0-3]\d\d{3}(X|\d)

        // regex_search
        // regex_search 检测输入表达式中是否包含正则表达式，即存在一个匹配正则表达式的子串
        char* str = "there is a power-suit item";
        cregex creg = cregex::compile("(power)-(.{4})\\s(\\w{4})", icase);
        ret = regex_search(str, creg);

        cmatch what;
        regex_search(str , what, creg);
        for (int i = 0; i < what.size() ; ++i){
        	cout << what[i] << endl;
        }

        // 替换
        // regex_replace()
        cout << regex_replace(s , reg , "Earth") << endl; // replace Mars with Earth
        cout << regex_replace(s , reg , "$1 haha") << endl;
        cout << regex_replace(s , reg , "$1 $&") << endl;

        s = regex_replace(s , reg , "Earth");
        cout << s << endl;
        // regex_iterator<>

        string ss = "boost1, Boost2, BoOst3, etc";
        sregex ssreg = sregex::compile("boost\\d",icase);
        sregex_iterator pos(ss.begin(), ss.end(), ssreg);
        sregex_iterator end;
        while(pos != end){
            cout << (*pos)[0] << "\t";
            ++pos;
        }

        return 0;
    }

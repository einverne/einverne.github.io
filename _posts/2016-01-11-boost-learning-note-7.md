---
layout: post
title: "boost 学习笔记 7：property_tree"
tagline: ""
description: "利用boost 中的 property_tree解析 json和 xml"
category: 学习笔记
tags: [boost, C++]
last_updated: 
---

上一篇文章boost容器中留下一个`property_tree` 没有学，觉得既然 boost 提供了 property_tree 这样好的工具来给C++ 解析xml和Json，必须要留有一定的篇幅来讲它。

原先项目中使用到JSON，需要使用C++解析一段返回值, JSON 格式如下：

    {
      "ret": "101",
      "error": [
        {
          "errortype": "A0001",
          "errorstroke": {
            "0": "0.2",
            "1": "0.3"
          }
        },
        {
          "errortype": "A0021",
          "errorstroke": {
            "0": "0.2",
            "1": "0.3"
          }
        }
      ]
    }

error 字段是一个数组，数组中的每个元素都是一个对象Object，每个Object中是一个键值对，其中 errorstroke 同样包含一个对象。我们都知道JSON只包含三种数据结构，矢量，数组和映射（[参考](http://www.ruanyifeng.com/blog/2009/05/data_types_and_json.html)），这样无疑给我们的解析工作带来很多遍历，这三种数据结构几乎可以将时间所有的信息包含进去。

下面就是解析这段 JSON 字符串的具体代码：（注意将JSON字符串 escape）

    #include <iostream>
    #include <boost/property_tree/ptree.hpp>
    #include <boost/property_tree/json_parser.hpp>
    #include <boost/foreach.hpp>
    #include <string>

    using namespace boost::property_tree;

    int main(int argc, const char * argv[]) {

        std::string str_json = "{\"ret\":\"101\",\"error\":[{\"errortype\":\"A0001\",\"errorstroke\":{\"0\":\"0.2\",\"1\":\"0.3\"}},{\"errortype\":\"A0021\",\"errorstroke\":{\"0\":\"0.2\",\"1\":\"0.3\"}}]}";

        ptree pt;                       //define property_tree object
        std::stringstream ss(str_json);
        try {
            read_json(ss, pt);          //parse json
        } catch (ptree_error & e) {
            return 1;
        }

        std::cout << pt.get<std::string>("ret") << std::endl;
        ptree errortype = pt.get_child("error");            // get_child to get errors

        // first way
        for (boost::property_tree::ptree::iterator it = errortype.begin(); it != errortype.end(); ++it) {
            std::cout << it->first;
            std::cout << it->second.get<std::string>("errortype") << std::endl;
            ptree errorstroke = it->second.get_child("errorstroke");
            for (ptree::iterator iter = errorstroke.begin(); iter != errorstroke.end(); ++iter) {
                std::string key = iter->first;
                std::cout << iter->first << std::endl;
                std::cout << iter->second.data() << std::endl;
            }
        }

        // second way: using boost foreach feature
    //    BOOST_FOREACH(ptree::value_type &v, errortype){
    //        ptree& childparse = v.second;
    //        std::cout << childparse.get<std::string>("errortype") << std::endl;
    //        ptree errorstroke = childparse.get_child("errorstroke");
    //        BOOST_FOREACH(ptree::value_type& w, errorstroke){
    //            std::cout << w.first << std::endl;
    //            std::cout << w.second.data() << std::endl;
    //        }
    //    }
        return 0;
    }

代码的输出：

     101
     A0001
     0
     0.2
     1
     0.3
     A0021
     0
     0.2
     1
     0.3

再换用另外一段 JSON 尝试解析，从下面这段 JSON 中能够轻易的看出 JSON 内部的结构，支持的数据结构和类型：

    {
      "array": [
        1,
        2,
        3
      ],
      "boolean": true,
      "null": null,
      "number": 123,
      "object": {
        "a": "b",
        "c": "d",
        "e": "f"
      },
      "string": "Hello World"
    }

具体解析代码：

    #include <iostream>
    #include <boost/property_tree/ptree.hpp>
    #include <boost/property_tree/json_parser.hpp>
    #include <boost/foreach.hpp>
    #include <string>
    using namespace std;
    using namespace boost::property_tree;

    int main(int argc, const char * argv[]) {

        std::string str_json = "{\"array\":[1,2,3],\"boolean\":true,\"null\":null,\"number\":123,\"object\":{\"a\":\"b\",\"c\":\"d\",\"e\":\"f\"},\"string\":\"Hello World\"}";

        ptree pt;                       //define property_tree object
        std::stringstream ss(str_json);
        try {
            read_json(ss, pt);          //parse json
        } catch (ptree_error & e) {
            return 1;
        }

        ptree arraypt =pt.get_child("array");
        for (boost::property_tree::ptree::iterator it = arraypt.begin(); it != arraypt.end(); ++it) {
            cout << it->second.data() << " ";
        }
        cout << endl;

        std::cout << pt.get<bool>("boolean") << std::endl;
        std::cout << pt.get<std::string>("null") << std::endl;
        std::cout << pt.get<int>("number") << std::endl;
        std::cout << pt.get<std::string>("string") << std::endl;
        ptree opt = pt.get_child("object");

        BOOST_FOREACH(ptree::value_type &v, opt){
            cout << v.first << " : ";
            cout << v.second.data() << endl;
        }

        return 0;
    }

利用 Boost property_tree 构造 JSON 字串,以下代码能够构造上面的JSON：

    #include <iostream>
    #include <boost/property_tree/ptree.hpp>
    #include <boost/property_tree/json_parser.hpp>
    #include <boost/foreach.hpp>
    #include <string>
    using namespace std;
    using namespace boost::property_tree;

    int main(int argc, const char * argv[]) {

        std::string str_json = "{\"array\":[1,2,3],\"boolean\":true,\"null\":null,\"number\":123,\"object\":{\"a\":\"b\",\"c\":\"d\",\"e\":\"f\"},\"string\":\"Hello World\"}";

        ptree root, arr,object;
        arr.push_back(std::make_pair("","1"));
        arr.push_back(std::make_pair("","2"));
        arr.push_back(std::make_pair("","3"));

        object.put("a","b");
        object.put("c","d");
        object.put("e","f");

        root.add_child("array", arr);
        bool boolvalue = true;
        root.put("boolean",boolvalue);
        root.put("null","null");
        int num = 123;
        root.put("number",num);
        root.add_child("object",object);
        root.put("string","Hello World");

        //write_json("out.json", root);
        stringstream s;
        write_json(s, root, false);
        string out = s.str();
        cout << out ;
        return 0;
    }

两个有用的JSON工具：

- JSON 在线编辑 <http://jsoneditoronline.org/>
- JSON Escape and Unescape 工具 <http://www.freeformatter.com/javascript-escape.html>

Boost property_tree 解析 XML 可参考这篇[文章](https://akrzemi1.wordpress.com/2011/07/13/parsing-xml-with-boost/) ，解释得非常清楚。


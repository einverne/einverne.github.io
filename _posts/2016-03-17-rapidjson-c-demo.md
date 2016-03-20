---
layout: post
title: "C++ 解析JSON"
tagline: "RapidJSON/property_tree"
description: "C++ 解析 JSON 字符串"
category: 经验总结
tags: [C++, JSON, 经验总结, rapidjson, boost,]
last_updated: 2016-03-20
---


因项目需求，需要使用 C++ 解析 JSON。

## RapidJSON

第一种方法，使用 RapidJSON 可以方便的用来生成或者解析 JSON。

项目地址：<https://github.com/miloyip/rapidjson>

RapidJSON 是只有头文件的 C++ 库。使用时只需要把 `include/rapidjson` 复制到项目目录中即可。

类似如下的JSON，其中包括Object，包括Array，掌握解析该JSON，基本 RapidJSON 解析可掌握：

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

代码如下：

    #include <iostream>
    #include <vector>
    #include <string>

    #include "rapidjson/document.h"
    #include "rapidjson/writer.h"
    #include "rapidjson/stringbuffer.h"

    using namespace rapidjson;
    using namespace std;

    int main() {

        string ret =
                "{\"ret\":\"101\",\"error\":[{\"errortype\":\"A0001\",\"errorstroke\":{\"0\":\"0.2\",\"1\":\"0.3\"}},{\"errortype\":\"A0021\",\"errorstroke\":{\"0\":\"0.2\",\"1\":\"0.3\"}}]}";
        rapidjson::Document doc;
        doc.Parse<kParseDefaultFlags>(ret.c_str());
        if (doc.HasMember("ret")) {
            string retjson = doc["ret"].GetString();
            for (unsigned i = 0; i < retjson.length(); ++i) {
                cout << retjson.at(i) << " ";
            }
        }
        cout << endl;
        if (doc.HasMember("error")) {
            const Value & errorjson = doc["error"];
            for (SizeType i = 0; i < errorjson.Size(); ++i) {
                // 或者这里可以换用一种遍历使用 Value::ConstValueIterator
                // http://rapidjson.org/md_doc_tutorial.html#QueryArray
                if (errorjson[i].HasMember("errortype")) {
                    string errortype = errorjson[i]["errortype"].GetString();
                    cout << "errortype: " << errortype << endl;
                }
                if (errorjson[i].HasMember("errorstroke")) {
                    const Value & errorstroke = errorjson[i]["errorstroke"];
                    cout << "errorstroke" << endl;
                    for (Value::ConstMemberIterator iter = errorstroke.MemberBegin();iter != errorstroke.MemberEnd(); ++iter) {
                        cout << iter->name.GetString() << ": " << iter->value.GetString() << endl;
                    }
                }
            }
        }

        return 0;
    }

关于 RapidJSON 的更多内容可以参考官网。

## boost property_tree

使用 boost 库中的 `property_tree` 解析如下：

    /*
     first config your project to include /usr/local/include
     second link lib /usr/local/lib
     */

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

        /*
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
         */

        return 0;
    }
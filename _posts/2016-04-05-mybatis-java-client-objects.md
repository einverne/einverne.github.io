---
layout: post
title: "MyBatis 自动生成的 Java client 方法区别"
tagline: ""
description: ""
category: 学习笔记
tags: [java, mybatis, mysql, ]
last_updated:
---

MyBatis 自动生成的 Java client generator 会产生如下的方法；

- countByExample
- deleteByPrimaryKey
- deleteByExample
- insert
- insertSelective
- selectByPrimaryKey
- selectByExample
- selectByExampleWithBLOBs
- updateByPrimaryKey (with an override to specify whether or not to update BLOB columns)
- updateByPrimaryKeySelective (will only update non-null fields in the parameter class)
- updateByExample (with an override to specify whether or not to update BLOB columns)
- updateByExampleSelective (will only update non-null fields in the parameter class)

前面一些方法看名字都能知道其用法，但是有些还是有些模棱两可。比如 withBLOBs 和 没有 BLOB 方法的区别。

## selectByExample 和 selectByExampleWithBLOBs 区别

如需检索的字段中包含大字段类型时，必须用 selectByExampleWithBLOBs，不检索大字段时，用 selectByExample 就足够了。update 同样如此。


## MyBatis Generator
MyBatis GeneratorXML 配置文件在大多数情况下由 [XML](http://www.mybatis.org/generator/configreference/xmlconfig.html) 配置提供。文件会配置 MyBatis Generator :

- 如何连接数据库
- 生成什么 Object，以及如何生成
- 哪一些数据表需要被生成 Object

下面是基础的模板

    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE generatorConfiguration
      PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
      "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

    <generatorConfiguration>
      <classPathEntry location="/Program Files/IBM/SQLLIB/java/db2java.zip" />

      <context id="DB2Tables" targetRuntime="MyBatis3">
        <jdbcConnection driverClass="COM.ibm.db2.jdbc.app.DB2Driver"
            connectionURL="jdbc:db2:TEST"
            userId="db2admin"
            password="db2admin">
        </jdbcConnection>

        <javaTypeResolver >
          <property name="forceBigDecimals" value="false" />
        </javaTypeResolver>

        <javaModelGenerator targetPackage="test.model" targetProject="\MBGTestProject\src">
          <property name="enableSubPackages" value="true" />
          <property name="trimStrings" value="true" />
        </javaModelGenerator>

        <sqlMapGenerator targetPackage="test.xml"  targetProject="\MBGTestProject\src">
          <property name="enableSubPackages" value="true" />
        </sqlMapGenerator>

        <javaClientGenerator type="XMLMAPPER" targetPackage="test.dao"  targetProject="\MBGTestProject\src">
          <property name="enableSubPackages" value="true" />
        </javaClientGenerator>

        <table schema="DB2ADMIN" tableName="ALLTYPES" domainObjectName="Customer" >
          <property name="useActualColumnNames" value="true"/>
          <generatedKey column="ID" sqlStatement="DB2" identity="true" />
          <columnOverride column="DATE_FIELD" property="startDate" />
          <ignoreColumn column="FRED" />
          <columnOverride column="LONG_VARCHAR_FIELD" jdbcType="VARCHAR" />
        </table>

      </context>
    </generatorConfiguration>

### context 元素
`<context>` 元素用来定义生成 Object 的环境，子元素用来定义数据库连接方式，生成对象的类型，和需要生成的 table. 多个 `<context>` 标签可以配置在 `<generatorConfiguration>` 下，允许配置多个数据库连接。

### jdbcConnection
顾名思义，连接数据库配置

### plugin 元素
`<plugin>` 下定义一些插件，这些插件用来扩展或者修改 MyBatis Generator 生成的代码。plugin 是 context 的子元素。

- [如何实现插件](http://www.mybatis.org/generator/reference/pluggingIn.html)
- [MyBatis Generator 提供的插件](http://www.mybatis.org/generator/reference/plugins.html)




### generatorConfiguration

generatorConfiguration 配置，文档地址[这里](http://www.mybatis.org/generator/configreference/generatorConfiguration.html)，每个子元素文档都存在。

### javaTypeResolver
这个标签用来配置 MySQL 数据类型到 Java 类型转换过程的精度，比如使用 `forceBigDecimals` 那么就是默认尝试使用 `java.math.BigDecial` 来处理 Decimal 和 Numberic 字段。


## reference

- [[MyBatis]]
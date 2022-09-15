---
layout: post
title: "Mybatis Generator 配置详解"
aliases: "Mybatis Generator 配置详解"
tagline: ""
description: ""
category: 经验总结
tags: [mybatis, orm, mysql, java, ]
last_updated:
---

通常情况下会用 xml 来配置 MyBatis Generator 通常在 `src/main/resources/generatorConfig.xml` 文件中。

官方的配置文档可以在[这里](http://www.mybatis.org/generator/configreference/xmlconfig.html) 找到。

Generator 的配置文件主要定义了：

- 如何连接数据库
- 需要自动生成什么 Objects，以及如何生成
- 哪一张 table 需要用来生成 Objects

下面是一个简单的示例：

```
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
```


更加复杂的例子：

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
  PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
"http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<!-- 配置生成器 -->
<generatorConfiguration>
<!-- 可以用于加载配置项或者配置文件，在整个配置文件中就可以使用 ${propertyKey}的方式来引用配置项
    resource：配置资源加载地址，使用 resource，MBG 从 classpath 开始找，比如 com/myproject/generatorConfig.properties
    url：配置资源加载地质，使用 URL 的方式，比如 file:///C:/myfolder/generatorConfig.properties.
    注意，两个属性只能选址一个；

    另外，如果使用了 mybatis-generator-maven-plugin，那么在 pom.xml 中定义的 properties 都可以直接在 generatorConfig.xml 中使用
<properties resource="" url="" />
 -->

 <!-- 在 MBG 工作的时候，需要额外加载的依赖包
    location 属性指明加载 jar/zip 包的全路径
<classPathEntry location="/path/to/IBM/SQLLIB/java/db2java.zip" />
  -->

<!--
    context: 生成一组对象的环境
    id: 必选，上下文 id，用于在生成错误时提示
    defaultModelType: 指定生成对象的样式
        1，conditional：类似 hierarchical；
        2，flat：所有内容（主键，blob）等全部生成在一个对象中；
        3，hierarchical：主键生成一个 XXKey 对象 (key class)，Blob 等单独生成一个对象，其他简单属性在一个对象中 (record class)
    targetRuntime:
        1，MyBatis3：默认的值，生成基于 MyBatis3.x 以上版本的内容，包括 XXXBySample；
        2，MyBatis3Simple：类似 MyBatis3，只是不生成 XXXBySample；
    introspectedColumnImpl：类全限定名，用于扩展 MBG
-->
<context id="mysql" defaultModelType="hierarchical" targetRuntime="MyBatis3Simple" >

    <!-- 自动识别数据库关键字，默认 false，如果设置为 true，根据 SqlReservedWords 中定义的关键字列表；
        一般保留默认值，遇到数据库关键字（Java 关键字），使用 columnOverride 覆盖
     -->
    <property name="autoDelimitKeywords" value="false"/>
    <!-- 生成的 Java 文件的编码 -->
    <property name="javaFileEncoding" value="UTF-8"/>
    <!-- 格式化 java 代码 -->
    <property name="javaFormatter" value="org.mybatis.generator.api.dom.DefaultJavaFormatter"/>
    <!-- 格式化 XML 代码 -->
    <property name="xmlFormatter" value="org.mybatis.generator.api.dom.DefaultXmlFormatter"/>

    <!-- beginningDelimiter 和 endingDelimiter：指明数据库的用于标记数据库对象名的符号，比如 ORACLE 就是双引号，MYSQL 默认是`反引号； -->
    <property name="beginningDelimiter" value="`"/>
    <property name="endingDelimiter" value="`"/>

    <!-- 必须要有的，使用这个配置链接数据库
        @TODO: 是否可以扩展
     -->
    <jdbcConnection driverClass="com.mysql.jdbc.Driver" connectionURL="jdbc:mysql:///pss" userId="root" password="admin">
        <!-- 这里面可以设置 property 属性，每一个 property 属性都设置到配置的 Driver 上 -->
    </jdbcConnection>

    <!-- java 类型处理器
        用于处理 DB 中的类型到 Java 中的类型，默认使用 JavaTypeResolverDefaultImpl；
        注意一点，默认会先尝试使用 Integer，Long，Short 等来对应 DECIMAL 和 NUMERIC 数据类型；
    -->
    <javaTypeResolver type="org.mybatis.generator.internal.types.JavaTypeResolverDefaultImpl">
        <!--
            true：使用 BigDecimal 对应 DECIMAL 和 NUMERIC 数据类型
            false：默认，
                scale>0;length>18：使用 BigDecimal;
                scale=0;length[10,18]：使用 Long；
                scale=0;length[5,9]：使用 Integer；
                scale=0;length<5：使用 Short；
         -->
        <property name="forceBigDecimals" value="false"/>
    </javaTypeResolver>


    <!-- java 模型创建器，是必须要的元素
        负责：1，key 类（见 context 的 defaultModelType）；2，java 类；3，查询类
        targetPackage：生成的类要放的包，真实的包受 enableSubPackages 属性控制；
        targetProject：目标项目，指定一个存在的目录下，生成的内容会放到指定目录中，如果目录不存在，MBG 不会自动建目录
     -->
    <javaModelGenerator targetPackage="com._520it.mybatis.domain" targetProject="src/main/java">
        <!--  for MyBatis3/MyBatis3Simple
            自动为每一个生成的类创建一个构造方法，构造方法包含了所有的 field；而不是使用 setter；
         -->
        <property name="constructorBased" value="false"/>

        <!-- 在 targetPackage 的基础上，根据数据库的 schema 再生成一层 package，最终生成的类放在这个 package 下，默认为 false -->
        <property name="enableSubPackages" value="true"/>

        <!-- for MyBatis3 / MyBatis3Simple
            是否创建一个不可变的类，如果为 true，
            那么 MBG 会创建一个没有 setter 方法的类，取而代之的是类似 constructorBased 的类
         -->
        <property name="immutable" value="false"/>

        <!-- 设置一个根对象，
            如果设置了这个根对象，那么生成的 keyClass 或者 recordClass 会继承这个类；在 Table 的 rootClass 属性中可以覆盖该选项
            注意：如果在 key class 或者 record class 中有 root class 相同的属性，MBG 就不会重新生成这些属性了，包括：
                1，属性名相同，类型相同，有相同的 getter/setter 方法；
         -->
        <property name="rootClass" value="com._520it.mybatis.domain.BaseDomain"/>

        <!-- 设置是否在 getter 方法中，对 String 类型字段调用 trim() 方法 -->
        <property name="trimStrings" value="true"/>
    </javaModelGenerator>


    <!-- 生成 SQL map 的 XML 文件生成器，
        注意，在 Mybatis3 之后，我们可以使用 mapper.xml 文件 +Mapper 接口（或者不用 mapper 接口），
            或者只使用 Mapper 接口 +Annotation，所以，如果 javaClientGenerator 配置中配置了需要生成 XML 的话，这个元素就必须配置
        targetPackage/targetProject: 同 javaModelGenerator
     -->
    <sqlMapGenerator targetPackage="com._520it.mybatis.mapper" targetProject="src/main/resources">
        <!-- 在 targetPackage 的基础上，根据数据库的 schema 再生成一层 package，最终生成的类放在这个 package 下，默认为 false -->
        <property name="enableSubPackages" value="true"/>
    </sqlMapGenerator>


    <!-- 对于 mybatis 来说，即生成 Mapper 接口，注意，如果没有配置该元素，那么默认不会生成 Mapper 接口
        targetPackage/targetProject: 同 javaModelGenerator
        type：选择怎么生成 mapper 接口（在 MyBatis3/MyBatis3Simple 下）：
            1，ANNOTATEDMAPPER：会生成使用 Mapper 接口 +Annotation 的方式创建（SQL 生成在 annotation 中），不会生成对应的 XML；
            2，MIXEDMAPPER：使用混合配置，会生成 Mapper 接口，并适当添加合适的 Annotation，但是 XML 会生成在 XML 中；
            3，XMLMAPPER：会生成 Mapper 接口，接口完全依赖 XML；
        注意，如果 context 是 MyBatis3Simple：只支持 ANNOTATEDMAPPER 和 XMLMAPPER
    -->
    <javaClientGenerator targetPackage="com._520it.mybatis.mapper" type="ANNOTATEDMAPPER" targetProject="src/main/java">
        <!-- 在 targetPackage 的基础上，根据数据库的 schema 再生成一层 package，最终生成的类放在这个 package 下，默认为 false -->
        <property name="enableSubPackages" value="true"/>

        <!-- 可以为所有生成的接口添加一个父接口，但是 MBG 只负责生成，不负责检查
        <property name="rootInterface" value=""/>
         -->
    </javaClientGenerator>

    <!-- 选择一个 table 来生成相关文件，可以有一个或多个 table，必须要有 table 元素
        选择的 table 会生成一下文件：
        1，SQL map 文件
        2，生成一个主键类；
        3，除了 BLOB 和主键的其他字段的类；
        4，包含 BLOB 的类；
        5，一个用户生成动态查询的条件类（selectByExample, deleteByExample），可选；
        6，Mapper 接口（可选）

        tableName（必要）：要生成对象的表名；
        注意：大小写敏感问题。正常情况下，MBG 会自动的去识别数据库标识符的大小写敏感度，在一般情况下，MBG 会
            根据设置的 schema，catalog 或 tablename 去查询数据表，按照下面的流程：
            1，如果 schema，catalog 或 tablename 中有空格，那么设置的是什么格式，就精确的使用指定的大小写格式去查询；
            2，否则，如果数据库的标识符使用大写的，那么 MBG 自动把表名变成大写再查找；
            3，否则，如果数据库的标识符使用小写的，那么 MBG 自动把表名变成小写再查找；
            4，否则，使用指定的大小写格式查询；
        另外的，如果在创建表的时候，使用的""把数据库对象规定大小写，就算数据库标识符是使用的大写，在这种情况下也会使用给定的大小写来创建表名；
        这个时候，请设置 delimitIdentifiers="true"即可保留大小写格式；

        可选：
        1，schema：数据库的 schema；
        2，catalog：数据库的 catalog；
        3，alias：为数据表设置的别名，如果设置了 alias，那么生成的所有的 SELECT SQL 语句中，列名会变成：alias_actualColumnName
        4，domainObjectName：生成的 domain 类的名字，如果不设置，直接使用表名作为 domain 类的名字；可以设置为 somepck.domainName，那么会自动把 domainName 类再放到 somepck 包里面；
        5，enableInsert（默认 true）：指定是否生成 insert 语句；
        6，enableSelectByPrimaryKey（默认 true）：指定是否生成按照主键查询对象的语句（就是 getById 或 get）；
        7，enableSelectByExample（默认 true）：MyBatis3Simple 为 false，指定是否生成动态查询语句；
        8，enableUpdateByPrimaryKey（默认 true）：指定是否生成按照主键修改对象的语句（即 update)；
        9，enableDeleteByPrimaryKey（默认 true）：指定是否生成按照主键删除对象的语句（即 delete）；
        10，enableDeleteByExample（默认 true）：MyBatis3Simple 为 false，指定是否生成动态删除语句；
        11，enableCountByExample（默认 true）：MyBatis3Simple 为 false，指定是否生成动态查询总条数语句（用于分页的总条数查询）；
        12，enableUpdateByExample（默认 true）：MyBatis3Simple 为 false，指定是否生成动态修改语句（只修改对象中不为空的属性）；
        13，modelType：参考 context 元素的 defaultModelType，相当于覆盖；
        14，delimitIdentifiers：参考 tableName 的解释，注意，默认的 delimitIdentifiers 是双引号，如果类似 MYSQL 这样的数据库，使用的是`（反引号，那么还需要设置 context 的 beginningDelimiter 和 endingDelimiter 属性）
        15，delimitAllColumns：设置是否所有生成的 SQL 中的列名都使用标识符引起来。默认为 false，delimitIdentifiers 参考 context 的属性

        注意，table 里面很多参数都是对 javaModelGenerator，context 等元素的默认属性的一个复写；
     -->
    <table tableName="userinfo" >

        <!-- 参考 javaModelGenerator 的 constructorBased 属性 -->
        <property name="constructorBased" value="false"/>

        <!-- 默认为 false，如果设置为 true，在生成的 SQL 中，table 名字不会加上 catalog 或 schema； -->
        <property name="ignoreQualifiersAtRuntime" value="false"/>

        <!-- 参考 javaModelGenerator 的 immutable 属性 -->
        <property name="immutable" value="false"/>

        <!-- 指定是否只生成 domain 类，如果设置为 true，只生成 domain 类，如果还配置了 sqlMapGenerator，那么在 mapper XML 文件中，只生成 resultMap 元素 -->
        <property name="modelOnly" value="false"/>

        <!-- 参考 javaModelGenerator 的 rootClass 属性
        <property name="rootClass" value=""/>
         -->

        <!-- 参考 javaClientGenerator 的  rootInterface 属性
        <property name="rootInterface" value=""/>
        -->

        <!-- 如果设置了 runtimeCatalog，那么在生成的 SQL 中，使用该指定的 catalog，而不是 table 元素上的 catalog
        <property name="runtimeCatalog" value=""/>
        -->

        <!-- 如果设置了 runtimeSchema，那么在生成的 SQL 中，使用该指定的 schema，而不是 table 元素上的 schema
        <property name="runtimeSchema" value=""/>
        -->

        <!-- 如果设置了 runtimeTableName，那么在生成的 SQL 中，使用该指定的 tablename，而不是 table 元素上的 tablename
        <property name="runtimeTableName" value=""/>
        -->

        <!-- 注意，该属性只针对 MyBatis3Simple 有用；
            如果选择的 runtime 是 MyBatis3Simple，那么会生成一个 SelectAll 方法，如果指定了 selectAllOrderByClause，那么会在该 SQL 中添加指定的这个 order 条件；
         -->
        <property name="selectAllOrderByClause" value="age desc,username asc"/>

        <!-- 如果设置为 true，生成的 model 类会直接使用 column 本身的名字，而不会再使用驼峰命名方法，比如 BORN_DATE，生成的属性名字就是 BORN_DATE, 而不会是 bornDate -->
        <property name="useActualColumnNames" value="false"/>


        <!-- generatedKey 用于生成生成主键的方法，
            如果设置了该元素，MBG 会在生成的<insert>元素中生成一条正确的<selectKey>元素，该元素可选
            column: 主键的列名；
            sqlStatement：要生成的 selectKey 语句，有以下可选项：
                Cloudscape: 相当于 selectKey 的 SQL 为： VALUES IDENTITY_VAL_LOCAL()
                DB2       : 相当于 selectKey 的 SQL 为： VALUES IDENTITY_VAL_LOCAL()
                DB2_MF    : 相当于 selectKey 的 SQL 为：SELECT IDENTITY_VAL_LOCAL() FROM SYSIBM.SYSDUMMY1
                Derby     : 相当于 selectKey 的 SQL 为：VALUES IDENTITY_VAL_LOCAL()
                HSQLDB    : 相当于 selectKey 的 SQL 为：CALL IDENTITY()
                Informix  : 相当于 selectKey 的 SQL 为：select dbinfo('sqlca.sqlerrd1') from systables where tabid=1
                MySql     : 相当于 selectKey 的 SQL 为：SELECT LAST_INSERT_ID()
                SqlServer : 相当于 selectKey 的 SQL 为：SELECT SCOPE_IDENTITY()
                SYBASE    : 相当于 selectKey 的 SQL 为：SELECT @@IDENTITY
                JDBC      : 相当于在生成的 insert 元素上添加 useGeneratedKeys="true"和 keyProperty 属性
        <generatedKey column="" sqlStatement=""/>
         -->

        <!--
            该元素会在根据表中列名计算对象属性名之前先重命名列名，非常适合用于表中的列都有公用的前缀字符串的时候，
            比如列名为：CUST_ID,CUST_NAME,CUST_EMAIL,CUST_ADDRESS 等；
            那么就可以设置 searchString 为"^CUST_"，并使用空白替换，那么生成的 Customer 对象中的属性名称就不是
            custId,custName 等，而是先被替换为 ID,NAME,EMAIL, 然后变成属性：id，name，email；

            注意，MBG 是使用 java.util.regex.Matcher.replaceAll 来替换 searchString 和 replaceString 的，
            如果使用了 columnOverride 元素，该属性无效；

        <columnRenamingRule searchString="" replaceString=""/>
         -->

         <!-- 用来修改表中某个列的属性，MBG 会使用修改后的列来生成 domain 的属性；
            column: 要重新设置的列名；
            注意，一个 table 元素中可以有多个 columnOverride 元素哈~
          -->
         <columnOverride column="username">
            <!-- 使用 property 属性来指定列要生成的属性名称 -->
            <property name="property" value="userName"/>

            <!-- javaType 用于指定生成的 domain 的属性类型，使用类型的全限定名
            <property name="javaType" value=""/>
             -->

            <!-- jdbcType 用于指定该列的 JDBC 类型
            <property name="jdbcType" value=""/>
             -->

            <!-- typeHandler 用于指定该列使用到的 TypeHandler，如果要指定，配置类型处理器的全限定名
                注意，mybatis 中，不会生成到 mybatis-config.xml 中的 typeHandler
                只会生成类似：where id = #{id,jdbcType=BIGINT,typeHandler=com._520it.mybatis.MyTypeHandler}的参数描述
            <property name="jdbcType" value=""/>
            -->

            <!-- 参考 table 元素的 delimitAllColumns 配置，默认为 false
            <property name="delimitedColumnName" value=""/>
             -->
         </columnOverride>

         <!-- ignoreColumn 设置一个 MGB 忽略的列，如果设置了改列，那么在生成的 domain 中，生成的 SQL 中，都不会有该列出现
            column: 指定要忽略的列的名字；
            delimitedColumnName：参考 table 元素的 delimitAllColumns 配置，默认为 false

            注意，一个 table 元素中可以有多个 ignoreColumn 元素
         <ignoreColumn column="deptId" delimitedColumnName=""/>
         -->
    </table>
</context>
</generatorConfiguration>
```

## reference


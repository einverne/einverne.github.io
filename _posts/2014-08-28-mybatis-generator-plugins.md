---
layout: post
title: "MyBatis Generator Plugins"
aliases: "MyBatis Generator Plugins"
tagline: ""
description: ""
category: 学习笔记
tags: [mybatis, mybatis-generator, java, orm, mysql,]
last_updated:
---

MyBatis Generator（以下简称 MBG) 插件可以很方便的生成 Objects、Mapper 接口以及对应的 XML 文件。在使用 MBG 的时候也可以配置一些插件来自定义生成的文件的内容。

MBG 提供了一些自带的插件，比如缓存的，分页的等等，如果想要实现更多的功能可以参考[这里](http://www.mybatis.org/generator/reference/pluggingIn.html) 自己实现插件。

MBG 提供的插件都在 `org.mybatis.generator.plugins` 包下。插件源代码可以参考[这里](https://github.com/mybatis/generator/tree/master/core/mybatis-generator-core/src/main/java/org/mybatis/generator/plugins)

## org.mybatis.generator.plugins.CachePlugin
缓存插件，用来生成在 XML 中的 `<cache>` 元素

- cache_eviction
- cache_flushInterval
- cache_readOnly
- cache_size
- cache_type


## org.mybatis.generator.plugins.CaseInsensitiveLikePlugin
用来在 Example 类中生成大小写敏感的 LIKE 方法

## org.mybatis.generator.plugins.EqualsHashCodePlugin
用来给 Java 模型生成 equals 和 hashcode 方法

## org.mybatis.generator.plugins.FluentBuilderMethodsPlugin
生成带有 fluent 风格的 model 代码，该插件不接受任何参数。

通常是生成 setXX 方法，而使用这个插件后会生成 public MyClass withXX(String XX) 这样的方法。

这样就可以像使用 Builder 方法一样级联起来使用，比如

    new MyDomain().withFoo("Test").withBar(4711);

## org.mybatis.generator.plugins.MapperAnnotationPlugin
Only MyBatis3 环境，用来在 mapper 接口中增加 `@Mapper` 注解。

## org.mybatis.generator.plugins.MapperConfigPlugin
插件会产生一个 MapperConfig.xml 模板文件，该文件包含了 MBG 产生的 XML mapper 文件。

## org.mybatis.generator.plugins.RenameExampleClassPlugin
这个插件演示了使用 `initialized` 方法来重命名 MBG 自动产生的 example classes。

插件有两个属性

- searchString 必须，正则表达式用来搜索默认的产生的名字
- replaceString 必须，用来替换 searchString 搜索到的内容

比如，重命名 example 类从 xxxExample 到 xxxCriteria，那么在 searchString 中使用 `Example$` 然后配置 replaceString 为 `Criteria`.

    <property name="searchString" value="Example$" />
    <property name="replaceString" value="Criteria" />

## org.mybatis.generator.plugins.RowBoundsPlugin
该插件会增加一个新版本的 selectByExample 方法，接受一个 `RowBounds` 参数。该方法支持 MyBatis RowBounds 方法会返回指定开始位置之后一个指定长度的结果列表，在分页应用中非常有用。

## org.mybatis.generator.plugins.SerializablePlugin
该插件给生成的 Java 类增加了接口 java.io.Serializable。该插件同样会增加一个 serialVersionUID 字段。

## org.mybatis.generator.plugins.SqlMapConfigPlugin
该插件产生一个 SqlMapConfig.xml 模板，包含 sqlMap 条目所有生成的 SQL 映射

## org.mybatis.generator.plugins.ToStringPlugin
该插件给生成的 Java 类增加 `toString()` 方法。

## org.mybatis.generator.plugins.UnmergeableXmlMappersPlugin
该插件会禁用 XML 覆盖生成。

## org.mybatis.generator.plugins.VirtualPrimaryKeyPlugin
该插件会模拟指定的 columns 作为 primary key，即使在数据库中并没有定义为 primary key。通常在数据库没有指定 primary key 的时候有用。正常情况下如果没有定义 primary key， MBG 只会产生非常少的方法，而该插件可以生成很多的方法。

启用该插件的方法，在 table 配置下增加一个 `virtualKeyColumns` 属性

    <table tableName="foo">
      <property name="virtualKeyColumns" value="ID1, ID2" />
    </table>

## 自定义插件
所有 MBG 的插件都是实现的 Plugin 接口，其中定义了一些方法，这些方法都是在代码生成中可能被多次调用的，PluginAdapter 抽象类实现了 Plugin 部分方法。推荐在实现自己的插件时继承 PluginAdapter 类即可。或者如果有能力完整实现 Plugin 接口也可以。

插件是有生命周期的

- The setXXX methods are called one time
- The validate method is called one time
- The initialized method is called for each introspected table
- The clientXXX methods are called for each introspected table
- The providerXXX methods are called for each introspected table
- The modelXXX methods are called for each introspected table
- The sqlMapXXX methods are called for each introspected table
- The contextGenerateAdditionalJavaFiles(IntrospectedTable) method is called for each introspected table
- The contextGenerateAdditionalXmlFiles(IntrospectedTable) method is called each introspected table
- The contextGenerateAdditionalJavaFiles() method is called one time
- The contextGenerateAdditionalXmlFiles() method is called one time

插件和 contexts 相关，每一个 contexts 都可能有一个或者多个插件，如果同一个插件在不同的 context 中，那么每一个 context 都会持有一个插件的实例。

几个重要的方法

   void initialized(IntrospectedTable introspectedTable);

该方法在 getGeneratedXXXFiles 方法调用前被调用，插件可以复写该方法来在真正生成代码前覆盖任何属性，或者数据库 introspection 的结果。属性会在 IntrospectedTable 中作为静态 Strings 被列出，并且拥有 ATTR_ 前缀。

一个比较好的例子是在重写该方法来改变生成的代码文件名字，改变 target 包，或者改变生成的 SQL map 文件。官方提供的插件 RenameExampleClassPlugin 就是一个很好的例子，在该方法中改变了 Example 文件的名字。

    boolean validate(List<String> warnings);

validate 方法会在所有 setXXX 方法后被调用，但是会在其他方法调用前被调用。该方法用来决定插件是否运行，例如插件需要依赖某配置属性来运行，然而该配置没有设置，那么插件无效，并不会执行。对于不需要任何配置的插件，直接返回 true 即可。

    boolean clientGenerated(Interface interfaze, TopLevelClass topLevelClass, IntrospectedTable introspectedTable);

该方法会在整个 client 生成后被调用。如果要增加额外的方法或者字段就实现该方法。

    boolean clientCountByExampleMethodGenerated(Method method, TopLevelClass topLevelClass, IntrospectedTable introspectedTable);

该方法会在 client 实现类中 countByExample 方法生成后被调用。

    boolean clientDeleteByExampleMethodGenerated(Method method, TopLevelClass topLevelClass, IntrospectedTable introspectedTable);

同理在客户端实现类生成 deleteByExample 后被调用。其他的方法列举如下：

    boolean clientDeleteByPrimaryKeyMethodGenerated(Method method, TopLevelClass topLevelClass, IntrospectedTable introspectedTable);
    boolean clientInsertMethodGenerated(Method method, TopLevelClass topLevelClass, IntrospectedTable introspectedTable);
    boolean clientInsertSelectiveMethodGenerated(Method method, TopLevelClass topLevelClass, IntrospectedTable introspectedTable);
    boolean clientSelectByExampleWithBLOBsMethodGenerated(Method method, TopLevelClass topLevelClass, IntrospectedTable introspectedTable);
    boolean clientSelectByExampleWithoutBLOBsMethodGenerated(Method method, TopLevelClass topLevelClass, IntrospectedTable introspectedTable);
    boolean clientSelectByPrimaryKeyMethodGenerated(Method method, TopLevelClass topLevelClass, IntrospectedTable introspectedTable);
    boolean clientUpdateByExampleSelectiveMethodGenerated(Method method, TopLevelClass topLevelClass, IntrospectedTable introspectedTable);
    boolean clientUpdateByExampleWithBLOBsMethodGenerated(Method method, TopLevelClass topLevelClass, IntrospectedTable introspectedTable);
    boolean clientUpdateByExampleWithoutBLOBsMethodGenerated(Method method, TopLevelClass topLevelClass, IntrospectedTable introspectedTable);
    boolean clientUpdateByPrimaryKeySelectiveMethodGenerated(Method method, TopLevelClass topLevelClass, IntrospectedTable introspectedTable);

等等等，太多了就略去一部分。 clientXXX 这组方法还有一组参数不同的方法，其中第二个参数是 Interface

    boolean clientCountByExampleMethodGenerated(Method method, Interface interfaze, IntrospectedTable introspectedTable);

这组方法会在 client interface 的 countByExample 方法被生成后调用。

    boolean modelFieldGenerated(Field field, TopLevelClass topLevelClass,
            IntrospectedColumn introspectedColumn,
            IntrospectedTable introspectedTable, ModelClassType modelClassType);

modelXXX 方法会在 table 中指定的列 field 被生成后调用。


## reference

- <http://www.mybatis.org/generator/reference/plugins.html>
- <https://github.com/mybatis/generator>

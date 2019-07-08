---
layout: post
title: "Spring 自定义 namespace and handlers"
tagline: ""
description: ""
category: 学习笔记
tags: [spring, java, java-web, spring-mvc]
last_updated:
---


自定义 namespaces 可以让用户有一种更方便的方式来定义 Bean。

Spring 提供了一些开箱及用的方式，比如 `<mvc:annotation-driven/>` 可以参考[这篇文章](http://www.codelooru.com/2010/10/what-does-mvcannotation-driven-do.html) 来查看该配置的作用。

Spring 从 2.0 开始可以支持自定义扩展 XML Schema。

## XML Schema-based configuration
在了解自定义 XML Schema 之前首先要熟悉一下 Spring 的 XML Schema 配置。最简单的配置

    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="
            http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

        <!-- bean definitions here -->

    </beans>

如果要引入 util schema 需要这样修改

    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:util="http://www.springframework.org/schema/util" xsi:schemaLocation="
            http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
            http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util.xsd"> <!-- bean definitions here -->

    </beans>

## 扩展 XML
实现自己的 XML

- 创建 XML Schema 文件 `xsd`
- 自定义处理器，实现 `NamespaceHandler` 接口
- 自定义解析器，实现 `BeanDefinitionParser` 接口，可多个
- 注册到 Spring 容器中

官方文档举了一个简单的例子，比如想要在 context 中定义

    <myns:dateformat id="dateFormat"
        pattern="yyyy-MM-dd HH:mm"
        lenient="true"/>

这样的代码，那么需要做下面一些事情。

### 定义 XML

定义如下 `dateformat.xsd`

    <?xml version="1.0" encoding="UTF-8"?>
    <xsd:schema xmlns="http://www.mycompany.com/schema/myns"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:beans="http://www.springframework.org/schema/beans"
            targetNamespace="http://www.mycompany.com/schema/myns"
            elementFormDefault="qualified"
            attributeFormDefault="unqualified">

        <xsd:import namespace="http://www.springframework.org/schema/beans"/>

        <xsd:element name="dateformat">
            <xsd:complexType>
                <xsd:complexContent>
                    <xsd:extension base="beans:identifiedType">
                        <xsd:attribute name="lenient" type="xsd:boolean"/>
                        <xsd:attribute name="pattern" type="xsd:string" use="required"/>
                    </xsd:extension>
                </xsd:complexContent>
            </xsd:complexType>
        </xsd:element>
    </xsd:schema>

### 编写 NamespaceHandler

编写 NamespaceHandler 来处理特定 namespace 下的元素。NamespaceHandler 在这个例子中应该处理好 `myns:dateformat` 的解析工作。

NamespaceHandler 接口非常简单，有三个方法：

- `init()` 初始化 NamespaceHandler
- `BeanDefinition parse(Element, ParserContext)` 会被 Spring 在顶层元素处理时调用
- `BeanDefinitionHolder decorate(Node, BeanDefinitionHolder, ParserContext)` 处理属性或者嵌套元素时使用

比如：

    import org.springframework.beans.factory.xml.NamespaceHandlerSupport;

    public class MyNamespaceHandler extends NamespaceHandlerSupport {

        public void init() {
            registerBeanDefinitionParser("dateformat", new SimpleDateFormatBeanDefinitionParser());
        }

    }

### 编写 BeanDefinitionParser

BeanDefinitionParser 会被 NamespaceHandler 内部使用，当解析特定的元素时会对应不同的解析器。比如这个例子中 dateformat 使用了 SimpleDateFormatBeanDefinitionParser 。

    import org.springframework.beans.factory.support.BeanDefinitionBuilder;
    import org.springframework.beans.factory.xml.AbstractSingleBeanDefinitionParser;
    import org.springframework.util.StringUtils;
    import org.w3c.dom.Element;

    import java.text.SimpleDateFormat;

    public class SimpleDateFormatBeanDefinitionParser extends AbstractSingleBeanDefinitionParser { 1

        protected Class getBeanClass(Element element) {
            return SimpleDateFormat.class; 2
        }

        protected void doParse(Element element, BeanDefinitionBuilder bean) {
            // this will never be null since the schema explicitly requires that a value be supplied
            String pattern = element.getAttribute("pattern");
            bean.addConstructorArg(pattern);

            // this however is an optional property
            String lenient = element.getAttribute("lenient");
            if (StringUtils.hasText(lenient)) {
                bean.addPropertyValue("lenient", Boolean.valueOf(lenient));
            }
        }
    }

### Registering the handler and the schema
所有的编程都已经结束，剩下来的就是如何让 Spring XML 感知到所做的修改，将自定义内容注册到 Spring 中。

要实现这一点，需要考虑两点

- 注册自定义的 NamespaceHandler
- 注册 XSD 文件

在 resources 下创建 META-INF 目录，并创建如下两个文件

- spring.handlers  包含对应的 XML Schema URI 到 Handler 类的映射
- spring.schemas  包含 xsd 文件路径

#### META-INF/spring.handlers
定义 XML Schema 到 Handler 类映射，这个例子中

    http\://www.mycompany.com/schema/myns=org.springframework.samples.xml.MyNamespaceHandler

#### META-INF/spring.schemas

定义 XML Schema 到自定义 XSD 文件映射

    http\://www.mycompany.com/schema/myns/myns.xsd=org/springframework/samples/xml/myns.xsd


当做完这些后，那么上面定义的内容就和如下的定义可以实现完全相同的功能。

    <bean id="dateFormat" class="java.text.SimpleDateFormat">
        <constructor-arg value="yyyy-HH-dd HH:mm"/>
        <property name="lenient" value="true"/>
    </bean>

## 使用自定义 XML Schema

    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:myns="http://www.mycompany.com/schema/myns"
        xsi:schemaLocation="
            http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
            http://www.mycompany.com/schema/myns http://www.mycompany.com/schema/myns/myns.xsd">

        <!-- as a top-level bean -->
        <myns:dateformat id="defaultDateFormat" pattern="yyyy-MM-dd HH:mm" lenient="true"/>

        <bean id="jobDetailTemplate" abstract="true">
            <property name="dateFormat">
                <!-- as an inner bean -->
                <myns:dateformat pattern="HH:mm MM-dd-yyyy"/>
            </property>
        </bean>

    </beans>


代码见 <https://github.com/einverne/thrift-swift-demo/tree/master/spring-mvc-demo>

## reference

- <https://docs.spring.io/spring/docs/4.3.20.RELEASE/spring-framework-reference/html/xsd-configuration.html>
- <https://docs.spring.io/spring/docs/4.3.20.RELEASE/spring-framework-reference/html/xml-custom.html>
- <https://www.codelooru.com/2017/04/spring-custom-namespaces.html>

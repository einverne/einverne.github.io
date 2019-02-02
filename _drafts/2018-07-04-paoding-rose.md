---
layout: post
title: "paoding rose 框架"
tagline: ""
description: ""
category: 学习笔记
tags: [java, web, rose,]
last_updated:
---

ROSE 是在 Servlet 和 Spring 的基础之上使用的 web 框架，提供了和 springMvc+Spring+Mybatis 的管理功能，集成在了一个框架里面，我们只需要配置参数和使用编写业务代码即可。

Rose 框架通过在 web.xml 配置过滤器拦截并处理匹配的 web 请求，如果一个请求应该由在 Rose 框架下的类来处理， 该请求将在 Rose 调用中完成对客户端响应。如果一个请求在 Rose 中没有找到合适的类来为他服务，Rose 将把该请求移交给 web 容器的其他组件来处理。

src
└── main
    ├── java
    └── resources

- controllers 是 rose 框架默认的加载 controller 的 package name
- Controller 是 rose 框架默认的 controller 层的 class 后缀
- @Path 注解是 rose 框架提供的标识每个 controller 的对外访问时的基础路径

Demo:

    @Path("hello")
    public class HelloController {

        @Get("index")
        public String index() {
            return "@hello world";
        }
    }


在 web.xml 中配置了 ROSE 的过滤器。项目启动时将根据 servlet 的启动顺序启动 Rose 过滤器（Filter）

net.paoding.rose.RoseFilter
我们知道在 servlet 中配置过滤器是需要实现 Filter 接口的，但是这里我们是继承了

GenericFilterBean 抽象类
这个是 Spring 提供的，它实现了 javax.servlet.Filter、org.springframework.beans.factory.BeanNameAware、org.springframework.context.EnvironmentAware、org.springframework.web.context.ServletContextAware、org.springframework.beans.factory.InitializingBean 和 org.springframework.beans.factory.DisposableBean 五个接口，作用如下：

Filter，实现过滤器；

-  BeanNameAware，实现该接口的 setBeanName 方法，便于 Bean 管理器生成 Bean；(SpringFramework)
-  EnvironmentAware，实现该接口的 setEnvironment 方法，指明该 Bean 运行的环境；(SpringFramework)
-  ServletContextAware，实现该接口的 setServletContextAware 方法，指明上下文，我们需要写入我们的 application*.xml 引入 spring 的上下文环境 (SpringFramework)
-  InitializingBean，实现该接口的 afterPropertiesSet 方法，指明设置属性生的操作，这个就是可以进行初始化方法的配置 (SpringFramework)
-  DisposableBean，实现该接口的 destroy 方法，用于回收资源。指明项目销毁时进行销毁方法 (SpringFramework)。





GenericFilterBean 抽象类的工作流程是：init-doFilter-destory，其中的 init 和 destory 在该类中实现，doFilter 在具体实现类中实现。


服务端 java WEB 开发
1 层次
1.1 Control 层
1.2 Service 层
1.3 Biz 层
1.4 DAO 层
1.5 图示
2 重要细节
2.1 版本控制（必须特殊处理的请文档注明）
层次

## Control 层
Control 层是负责展现和连通业务逻辑的入口点。

- Control 中只允许出现和页面展现相关的逻辑，例如合法性校验，分页。 不允许出现业务逻辑代码。*
- Control 只允许调用 Service 层。 Control 和 Service 层间松散耦合。原则上 Control 只允许调用一个 Service 的方法
- Control 不允许出现异常抛出，日志记录等操作。
- Control 调用 Service 层需要通过标准结构传递参数。

## Service 层
Service 层是系统业务的边界，具体业务逻辑实现的主体。理论上任何表现层技术的更换不会影响到 Service 层及以下代码

Service 调用 Biz 层完成系统所有的应用逻辑操作，对于简单的业务，Service 层可以调用 DAO 层；对于需要调用 DAO 两个以上方法才能完成的业务逻辑，建议 放到 Biz 层中。

Service 层封装业务逻辑结果，返回统一的结构 (Result)
事务封装只应该出现在 Service 层
日志记录只应该出现在 Service 层
Service 层捕获下层的异常，并记录日志
Service 层处理系统异常
Service 中可以调用多个 Biz
Service 无需有接口
Service 为单例
Service 层提供的 public 方法必须有注释
Service 默认继承 BaseService
Package 划分规则（暂缺）

## Biz 层
定义：Biz 层中是具体细粒度可重用的业务逻辑
Biz 层完成所需的业务逻辑

所有可重用，可抽象的业务逻辑应该放在 Biz 层实现
Biz 需要建立接口
Biz 层调用 DAO 层
Biz 层捕获 DAO 层的异常，包装成 Biz 异常后抛出
Biz 层抛出 BizException 异常
Biz 层 *不* 应该返回同一结构 (Result)
Biz 默认继承 BaseBO
Package 划分规则（暂缺）

## DAO 层
DAO 层只关注和持久化相关的逻辑，目前 DAO 层调用中间层或者直接操作数据库

- 每一个 DAO 必须有接口和实现
- DAO 必须抛出 DAOException 异常
- DAO 层不允许出现除持久化之外的业务逻辑
- DAO 默认继承 BaseDAO

重要细节
Service/Biz 中需要注入的对象写在 class 的定义之下，get set 方法放在业务方法的后面，设计常量优先考虑使用 enum, 禁止使用魔法数字。

Service Biz 方法命名如果涉及到 CRUD 的逻辑，请使用如下字母做为前缀：

层          |增         |改	        |删	        |查	                                        |判断
------------|-----------|-----------|-----------|-------------------------------------------|--------------
Sevice/Biz	|create*	|modify*	|remove*	|find*（返回列表） get*（返回单个对象）	|is*
DAO	        |insert*	|update*	|delete*	|find*（返回列表） get*（返回单个对象）	|is*

习惯使用 Eclipse 的 Ctrl+Shift+F 格式化代码。习惯使用 Ctrl+Shift+O 整理 import

禁止下层调用上层代码

原则上不允许 Biz 层间相互调用


## jetty 启动 Rose 项目

在本地简单使用 jetty 容器对 rose 项目进行加载，在当前普遍使用 maven 进行项目依赖管理的背景下，使用 jetty 对 rose 项目进行加载非常简单，只需要两步操作即可。

### 添加插件
修改 pom 文件，配置 jetty 的 maven 插件。将下列代码加入 pom

    <build>
     <plugins>
       <plugin>
        <groupId>org.eclipse.jetty</groupId>
        <artifactId>jetty-maven-plugin</artifactId>
        <version>9.2.10.v20150310</version>
       </plugin>
     </plugins>
    </build>

如果 build 和 plugins 已经存在，则只需要将 plugin 和中间的片段插入相应位置即可。


### 打包

    mvn package

### 执行
在项目目录下，执行如下命令

    mvn jetty:run

默认会以 8080 端口执行，如果需要自定义端口，请执行如下命令

    mvn -Djetty.port=9999 jetty:run

如果特殊情况下需要以 war 包的形式运行则执行

    mvn jetty:run-war

和第二步可以连在一起执行

    mvn clean package jetty:run

### 版本选择

上述文档采用了 jetty 9.2 系列版本，采用这个版本的原因在于 jetty9.2 是 java7 支持的最后一个版本。后续版本最低需要 java8。

而采用 9.2 系列中的 10.v20150310 是因为官方目录中以该版本撰写了文档。


## reference

- http://www.54chen.com/rose.html
- https://www.eclipse.org/jetty/documentation/9.2.10.v20150310/jetty-maven-plugin.html

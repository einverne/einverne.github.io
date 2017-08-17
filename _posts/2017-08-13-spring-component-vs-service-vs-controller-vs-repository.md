---
layout: post
title: "Spring @Component vs @Service vs @Controller vs @Repository"
tagline: ""
description: ""
category: 学习笔记
tags: [Spring, Bean, Java, DI, IoC]
last_updated: 
---

`@Component`, `@Service`, `@Controller` 和 `@Repository` 四个注解在 Spring 中等同于在XML中定义 `<bean>` 标签，他们注解的对象都是 Spring 的 Bean。`@Service`，`@Controller` 和 `@Repository` 本质上就是 `@Component`。 `@Controller`，`@Service`，`@Repository` 他们在功能上几乎相同，主要的功能是用来给应用分层。

- `@Controller`: 处理对应的请求，对应表现层（控制层），使用 `@RequestMapping` 注解来定义请求 Path，在该层中做请求分发，转发，调用Service方法等
- `@Service`: 所有业务逻辑放在 Service 中，对应业务层，包括数值计算，业务逻辑，在该层中直接调用持久层的方法
- `@Repository`: 持久层，访问数据，保存数据，DAO(Data Access Objects)，比如所有数据库相关的操作
- `@Component`: 通用的Spring 组件，generic stereotype for any Spring-managed component，当组件不好归类时可以使用该注解

在配置文件中定义

	<context:component-scan base-package="com.mycompany.mypackage" />

Spring 就会自动扫描package下所有类，将带有`@Component`、`@Repository`、`@Service`、`@Controller` 标签的类自动注册到Spring容器。 简而言之，注解的方式省去了过去需要在 XML 中定义 `<bean class="...">` 的繁重工作。`component-scan` 包含了annotation-config标签的作用。 `@Repository`、`@Service`、`@Controller` 这三个注解除了作用于不同的软件层面外，其他使用方式和 `@Repository` 几乎一致。

除了上面的四个注解外，用户同样也可以创建自定义的注解，然后在注解上标注 `@Component`，那么，该自定义注解便具有了与所 @Component 相同的功能。

当一个 Bean 被自动检测到时，会根据那个扫描器的 BeanNameGenerator 策略生成它的 bean 名称。默认情况下，对于包含 name 属性的 `@Component`、`@Repository`、 `@Service` 和 `@Controller`，会把 name 取值作为 Bean 的名字。如果这个注解不包含 name 值或是其他被自定义过滤器发现的组件，默认 Bean 名称会是小写开头的非限定类名。如果你不想使用默认 bean 命名策略，可以提供一个自定义的命名策略。首先实现 BeanNameGenerator 接口，确认包含了一个默认的无参数构造方法。然后在配置扫描器时提供一个全限定类名，如下所示： 

	<beans ...> 
	<context:component-scan 
		base-package="a.b" name-generator="a.SimpleNameGenerator"/> 
	</beans> 

与通过 XML 配置的 Spring Bean 一样，通过上述注解标识的 Bean，其默认作用域是"singleton"，为了配合这四个注解，在标注 Bean 的同时能够指定 Bean 的作用域，Spring 2.5 引入了 @Scope 注解。
可以在定义Component 的时候指定 `@Scope("prototype”)` 来改变。

	@Component
	@Scope("prototype")
	public class UserService {
		private int counter;

	}

## 通过名字获取Bean
在一些特殊情况下当我们无法使用注解直接使用 Spring Bean 时，比如在 Filter 中，有一些教程提示我们可以直接使用 `ApplicationContext.getBean()` 来后去 Bean，但这样的方式[不优雅](https://stackoverflow.com/questions/812415/why-is-springs-applicationcontext-getbean-considered-bad) ，我们可以考虑实现 [org.springframework.context.ApplicationContextAware](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/ApplicationContextAware.html) 接口，来动态的根据名字来获取 Bean。文档上

> Interface to be implemented by any object that wishes to be notified of the ApplicationContext that it runs in.
> Implementing this interface makes sense for example when an object requires access to a set of collaborating beans. Note that configuration via bean references is preferable to implementing this interface just for bean lookup purposes.

具体实现如下：

	import org.springframework.beans.BeansException;
	import org.springframework.context.ApplicationContext;
	import org.springframework.context.ApplicationContextAware;
	import org.springframework.stereotype.Component;
	 
	@Component
	public class ContextProvider implements ApplicationContextAware {
	 
		private static ApplicationContext CONTEXT;
	 
		@Override
		public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
			CONTEXT = applicationContext;
		}
	 
		/**
		 * Get a Spring bean by type.
		 **/
		public static <T> T getBean(Class<T> beanClass) {
			return CONTEXT.getBean(beanClass);
		}
	 
		/**
		 * Get a Spring bean by name.
		 **/
		public static Object getBean(String beanName) {
			return CONTEXT.getBean(beanName);
		}
	}

上面的类实现，定义了一个简单的 `@Component` 实现了 `ApplicationContextAware` 接口，当 Spring Context 被创建时会被通知到。当被通知后 Spring context 会被放到唯一的静态变量 CONTEXT 中，因此静态方法能够通过 getBean 方法找到相应的 Bean 实例。

`getBean` 的默认名称是类名（头字母小写），如果想简单自定义Bean名字，可以`@Service("serviceNewName")` 这样来指定。


## 使用 @PostConstruct 和 @PreDestroy 指定生命周期回调方法 

可以使用以下方式指定初始化方法和销毁方法： 

	@PostConstruct
	public void init() { 

	} 

	@PreDestroy
	public void destory() { 

	}

Spring Bean 是受 Spring IoC 容器管理，由容器进行初始化和销毁的（prototype 类型由容器初始化之后便不受容器管理），通常我们不需要关注容器对 Bean 的初始化和销毁操作，由 Spring 经过构造函数或者工厂方法创建的 Bean 就是已经初始化完成并立即可用的。然而在某些情况下，可能需要我们手工做一些额外的初始化或者销毁操作，这通常是针对一些资源的获取和释放操作。

Spring 2.5 在保留以上两种方式的基础上，提供了对 JSR-250 的支持。JSR-250 规范定义了两个用于指定声明周期方法的注解：@PostConstruct 和 @PreDestroy。这两个注解使用非常简单，只需分别将他们标注于初始化之后执行的回调方法或者销毁之前执行的回调方法上。由于使用了注解，因此需要配置相应的 Bean 后处理器，亦即在 XML 中增加如下一行： <context:annotation-config /> 

比较上述三种指定生命周期回调方法的方式，第一种是不建议使用的，不但其用法不如后两种方式灵活，而且无形中增加了代码与框架的耦合度。后面两种方式开发者可以根据使用习惯选择其中一种，但是最好不要混合使用，以免增加维护的难度。 



## reference

- <https://stackoverflow.com/questions/6827752/whats-the-difference-between-component-repository-service-annotations-in>
- <https://brunozambiazi.wordpress.com/2016/01/16/getting-spring-beans-programmatically/>
- <https://www.ibm.com/developerworks/cn/opensource/os-cn-spring-iocannt/index.html?ca=drs-cn-0506>

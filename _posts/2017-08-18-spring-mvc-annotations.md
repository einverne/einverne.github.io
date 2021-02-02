---
layout: post
title: "Spring MVC 中常用的注解"
tagline: ""
description: ""
category: 学习笔记
tags: [spring, spring-mvc, spring-boot, java, web, 注解 , 拦截器 , 反射 ]
last_updated:
---

一般的注解，比如常见的 `@Override` 是 Java 从 1.5 版本开始引入，注解一般用来对代码进行说明，可以对包、类、接口、字段、方法参数、局部变量等等进行注解，他的作用一般分为如下四个方面：

1. 生成文档
2. 编译检查，通过注解让编译器在编译期间进行检查校验
3. 编译时动态处理，编译时通过注解标示进行动态处理，比如生成代码
4. 运行时动态处理，反射注入实例等等

一般的注解可以分为三类：

1. Java 自带的注解，包括 @Override @Deprecated 等等
2. 元注解，用于定义注解，包括 @Retention @Target @Inherited @Documented @Retention 用于标明注解被保留的阶段，@Target 用于标明注解使用的范围，@Inherited 用于标明注解可继承，@Documented 用于标明是否生成 javadoc 文档
3. 自定义注解，根据需求使用元注解自定义注解

## Spring 中的注解
Spring 中的注解大概可以分为两大类：

- Spring 的 bean 容器相关的注解，或者说 bean 工厂相关的注解
- Spring mvc 相关的注解

Spring 的 bean 容器相关的注解，先后有：`@Required`，` @Autowired`, `@PostConstruct`， `@PreDestory`，还有 Spring3.0 开始支持的 JSR-330 标准 `javax.inject.*` 中的注解 (`@Inject`, `@Named`, `@Qualifier`, `@Provider`, `@Scope`, `@Singleton`).

Spring MVC 相关的注解有：`@Controller`, `@RequestMapping`, `@RequestParam`， `@ResponseBody` 等等。

要理解 Spring 中的注解，先要理解 Java 中的注解。

## Java 中的注解

Java 中 1.5 中开始引入注解，最熟悉的应该是：@Override, 它的定义如下：

	/**
	 * Indicates that a method declaration is intended to override a
	 * method declaration in a supertype. If a method is annotated with
	 * this annotation type compilers are required to generate an error
	 * message unless at least one of the following conditions hold:
	 * The method does override or implement a method declared in a
	 * supertype.
	 * The method has a signature that is override-equivalent to that of
	 * any public method declared in Object.
	 *
	 * @author  Peter von der Ah&eacute;
	 * @author  Joshua Bloch
	 * @jls 9.6.1.4 @Override
	 * @since 1.5
	 */
	@Target(ElementType.METHOD)
	@Retention(RetentionPolicy.SOURCE)
	public @interface Override {
	}

从注释，我们可以看出，@Override 的作用是，提示编译器，使用了 @Override 注解的方法必须 override 父类或者 java.lang.Object 中的一个同名方法。我们看到 @Override 的定义中使用到了 @Target, @Retention，它们就是所谓的“元注解”——就是定义注解的注解，或者说注解注解的注解。我们看下 @Retention

	/**
	 * Indicates how long annotations with the annotated type are to
	 * be retained.  If no Retention annotation is present on
	 * an annotation type declaration, the retention policy defaults to
	 * RetentionPolicy.CLASS.
	 */
	@Documented
	@Retention(RetentionPolicy.RUNTIME)
	@Target(ElementType.ANNOTATION_TYPE)
	public @interface Retention {
		/**
		 * Returns the retention policy.
		 * @return the retention policy
		 */
		RetentionPolicy value();
	}

@Retention 用于提示注解被保留多长时间，有三种取值：

	public enum RetentionPolicy {
		/**
		 * Annotations are to be discarded by the compiler.
		 */
		SOURCE,
		/**
		 * Annotations are to be recorded in the class file by the compiler
		 * but need not be retained by the VM at run time.  This is the default
		 * behavior.
		 */
		CLASS,
		/**
		 * Annotations are to be recorded in the class file by the compiler and
		 * retained by the VM at run time, so they may be read reflectively.
		 *
		 * @see java.lang.reflect.AnnotatedElement
		 */
		RUNTIME
	}

RetentionPolicy.SOURCE 保留在源码级别，被编译器抛弃 (@Override 就是此类）； RetentionPolicy.CLASS 被编译器保留在编译后的类文件级别，但是被虚拟机丢弃；
RetentionPolicy.RUNTIME 保留至运行时，可以被反射读取。

再看 @Target:

	package java.lang.annotation;

	/**
	 * Indicates the contexts in which an annotation type is applicable. The
	 * declaration contexts and type contexts in which an annotation type may be
	 * applicable are specified in JLS 9.6.4.1, and denoted in source code by enum
	 * constants of java.lang.annotation.ElementType
	 * @since 1.5
	 * @jls 9.6.4.1 @Target
	 * @jls 9.7.4 Where Annotations May Appear
	 */
	@Documented
	@Retention(RetentionPolicy.RUNTIME)
	@Target(ElementType.ANNOTATION_TYPE)
	public @interface Target {
		/**
		 * Returns an array of the kinds of elements an annotation type
		 * can be applied to.
		 * @return an array of the kinds of elements an annotation type
		 * can be applied to
		 */
		ElementType[] value();
	}

@Target 用于提示该注解使用的地方，取值有：

	public enum ElementType {
		/** Class, interface (including annotation type), or enum declaration */
		TYPE,
		/** Field declaration (includes enum constants) */
		FIELD,
		/** Method declaration */
		METHOD,
		/** Formal parameter declaration */
		PARAMETER,
		/** Constructor declaration */
		CONSTRUCTOR,
		/** Local variable declaration */
		LOCAL_VARIABLE,
		/** Annotation type declaration */
		ANNOTATION_TYPE,
		/** Package declaration */
		PACKAGE,
		/**
		 * Type parameter declaration
		 * @since 1.8
		 */
		TYPE_PARAMETER,
		/**
		 * Use of a type
		 * @since 1.8
		 */
		TYPE_USE
	}

分别表示该注解可以被使用的地方：1)TYPE 用于类，接口（包括注解），enum 定义；2) FIELD 属性域；3）METHOD 方法；4）PARAMETER 参数；5）CONSTRUCTOR 构造函数；6）`LOCAL_VARIABLE` 局部变量；7）`ANNOTATION_TYPE` 注解类型；8）PACKAGE 包

所以：

	@Target(ElementType.METHOD)
	@Retention(RetentionPolicy.SOURCE)
	public @interface Override {
	}

表示 @Override 只能使用在方法上，保留在源码级别，被编译器处理，然后抛弃掉。

还有一个经常使用的元注解 @Documented ：

	/**
	 * Indicates that annotations with a type are to be documented by javadoc
	 * and similar tools by default.  This type should be used to annotate the
	 * declarations of types whose annotations affect the use of annotated
	 * elements by their clients.  If a type declaration is annotated with
	 * Documented, its annotations become part of the public API
	 * of the annotated elements.
	 */
	@Documented
	@Retention(RetentionPolicy.RUNTIME)
	@Target(ElementType.ANNOTATION_TYPE)
	public @interface Documented {
	}

表示注解是否能被 javadoc 处理并保留在文档中。

## 使用 元注解 来自定义注解 和 处理自定义注解

有了元注解，那么我就可以使用它来自定义我们需要的注解。结合自定义注解和 AOP 或者过滤器，是一种十分强大的武器。比如可以使用注解来实现权限的细粒度的控制——在类或者方法上使用权限注解，然后在 AOP 或者过滤器中进行拦截处理。下面是一个关于登录的权限的注解的实现：

	/**
	 * 不需要登录注解
	 */
	@Target({ ElementType.METHOD, ElementType.TYPE })
	@Retention(RetentionPolicy.RUNTIME)
	@Documented
	public @interface NoLogin {
	}

我们自定义了一个注解 @NoLogin, 可以被用于 方法 和 类 上，注解一直保留到运行期，可以被反射读取到。该注解的含义是：被 @NoLogin 注解的类或者方法，即使用户没有登录，也是可以访问的。下面就是对注解进行处理了：


	/**
	 * 检查登录拦截器
	 * 如不需要检查登录可在方法或者 controller 上加上 @NoLogin
	 */
	public class CheckLoginInterceptor implements HandlerInterceptor {
		private static final Logger logger = Logger.getLogger(CheckLoginInterceptor.class);

		@Override
		public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
								 Object handler) throws Exception {
			if (!(handler instanceof HandlerMethod)) {
				logger.warn("当前操作 handler 不为 HandlerMethod=" + handler.getClass().getName() + ",req="
							+ request.getQueryString());
				return true;
			}
			HandlerMethod handlerMethod = (HandlerMethod) handler;
			String methodName = handlerMethod.getMethod().getName();
			// 判断是否需要检查登录
			NoLogin noLogin = handlerMethod.getMethod().getAnnotation(NoLogin.class);
			if (null != noLogin) {
				if (logger.isDebugEnabled()) {
					logger.debug("当前操作 methodName=" + methodName + "不需要检查登录情况");
				}
				return true;
			}
			noLogin = handlerMethod.getMethod().getDeclaringClass().getAnnotation(NoLogin.class);
			if (null != noLogin) {
				if (logger.isDebugEnabled()) {
					logger.debug("当前操作 methodName=" + methodName + "不需要检查登录情况");
				}
				return true;
			}
			if (null == request.getSession().getAttribute(CommonConstants.SESSION_KEY_USER)) {
				logger.warn("当前操作" + methodName + "用户未登录，ip=" + request.getRemoteAddr());
				response.getWriter().write(JsonConvertor.convertFailResult(ErrorCodeEnum.NOT_LOGIN).toString()); // 返回错误信息
				return false;
			}
			return true;
		}
		@Override
		public void postHandle(HttpServletRequest request, HttpServletResponse response,
							   Object handler, ModelAndView modelAndView) throws Exception {
		}
		@Override
		public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
									Object handler, Exception ex) throws Exception {
		}
	}

上面我们定义了一个登录拦截器，首先使用反射来判断方法上是否被 @NoLogin 注解：

	NoLogin noLogin = handlerMethod.getMethod().getAnnotation(NoLogin.class);

然后判断类是否被 @NoLogin 注解：

	noLogin = handlerMethod.getMethod().getDeclaringClass().getAnnotation(NoLogin.class);

如果被注解了，就返回 true，如果没有被注解，就判断是否已经登录，没有登录则返回错误信息给前台和 false. 这是一个简单的使用 注解 和 过滤器 来进行权限处理的例子。扩展开来，那么我们就可以使用注解，来表示某方法或者类，只能被具有某种角色，或者具有某种权限的用户所访问，然后在过滤器中进行判断处理。

## Spring 的 bean 容器相关的注解

- @Autowired 是我们使用得最多的注解，其实就是 autowire=byType 就是根据类型的自动注入依赖（基于注解的依赖注入），可以被使用再属性域，方法，构造函数上。

- @Qualifier 就是 autowire=byName, @Autowired 注解判断多个 bean 类型相同时，就需要使用 @Qualifier("xxBean") 来指定依赖的 bean 的 id：

		@Controller
		@RequestMapping("/user")
		public class HelloController {
			@Autowired
			@Qualifier("userService")
			private UserService userService;

- @Resource 属于 JSR250 标准，用于属性域和方法上。也是 byName 类型的依赖注入。使用方式：@Resource(name="xxBean"). 不带参数的 @Resource 默认值类名首字母小写。关于 Autowired 和 @Resouece 的区别可以参考[这篇](/post/2017/08/autowired-vs-resource-vs-inject.html)

- JSR-330 标准 `javax.inject.*` 中的注解 (@Inject, @Named, @Qualifier, @Provider, @Scope, @Singleton)。@Inject 就相当于 @Autowired, @Named 就相当于 @Qualifier, 另外 @Named 用在类上还有 @Component 的功能。

- @Component， @Controller, @Service, @Repository, 这几个注解不同于上面的注解，上面的注解都是将被依赖的 bean 注入进入，而这几个注解的作用都是生产 bean, 这些注解都是注解在类上，将类注解成 Spring 的 bean 工厂中一个一个的 bean。@Controller, @Service, @Repository 基本就是语义更加细化的 @Component。关于这几个注解可以参考这篇『文章』()

- @PostConstruct 和 @PreDestroy 不是用于依赖注入，而是 bean 的生命周期。类似于 init-method(InitializeingBean) destory-method(DisposableBean)

## Spring 中注解的处理

Spring 中注解的处理基本都是通过实现接口 BeanPostProcessor 来进行的：

	public interface BeanPostProcessor {
		Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException;
		Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException;
	}

相关的处理类有： AutowiredAnnotationBeanPostProcessor，CommonAnnotationBeanPostProcessor，PersistenceAnnotationBeanPostProcessor，  RequiredAnnotationBeanPostProcessor

这些处理类，可以通过 `<context:annotation-config/>` 配置隐式的配置进 Spring 容器。这些都是依赖注入的处理，还有生产 bean 的注解 (@Component， @Controller, @Service, @Repository) 的处理：

	<context:component-scan base-package="net.aazj.service,net.aazj.aop" />

这些都是通过指定扫描的基包路径来进行的，将他们扫描进 Spring 的 bean 容器。注意 context:component-scan 也会默认将 AutowiredAnnotationBeanPostProcessor，CommonAnnotationBeanPostProcessor 配置进来。所以<context:annotation-config/>是可以省略的。另外 context:component-scan 也可以扫描 @Aspect 风格的 AOP 注解，但是需要在配置文件中加入 <aop:aspectj-autoproxy/> 进行配合。

## Spring 注解和 JSR-330 标准注解的区别：

Spring                     	  | javax.inject.*                       | javax.inject restrictions/ comments
------------------------------|--------------------------------------|--------------------------------------
@Autowired                    | @Inject 						     | @Inject 没有 required 属性
@Component 					  | @Named 								|
@Scope("singletion")          | @Singleton 							| JSR-330 默认 scope 和 Spring `prototype` 类似，为了和 Spring 中默认保持一直， JSR-330 bean 使用 `singleton` 作为默认值。
@Qualifier                    | @Named                               | -
@Value   |-|  no equivalent
@Required |- | no equivalent
@Lazy | - | no equivalent

## 注解的原理

注解被编译后本质上就是一个继承 Annotation 接口的接口


## reference

- <http://www.cnblogs.com/digdeep/p/4525567.html>
- <http://blog.csdn.net/wangyangzhizhou/article/details/51698638>
- <http://www.techferry.com/articles/spring-annotations.html>

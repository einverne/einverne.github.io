---
layout: post
title: "Spring Interceptor vs Filter 拦截器和过滤器区别"
tagline: ""
description: ""
category: 学习笔记
tags: [Spring, Java, Web, ]
last_updated: 
---

Spring的Interceptor(拦截器)与Servlet的Filter有相似之处，都能实现权限检查、日志记录等。不同的是：

Filter                            |Interceptor 							| Summary
----------------------------------|-------------------------------------|-------------------------------
Filter 接口定义在 javax.servlet 包中 | 接口 HandlerInterceptor 定义在org.springframework.web.servlet 包中 |
Filter 定义在 web.xml 中 | 
Filter在只在 Servlet 前后起作用。Filters 通常将 请求和响应（request/response） 当做黑盒子，Filter 通常不考虑servlet 的实现。|拦截器能够深入到方法前后、异常抛出前后等，因此拦截器的使用具有更大的弹性。允许用户介入（hook into）请求的生命周期，在请求过程中获取信息，Interceptor 通常和请求更加耦合。 | 在Spring构架的程序中，要优先使用拦截器。几乎所有 Filter 能够做的事情， interceptor 都能够轻松的实现[^top]
Filter 是 Servlet 规范规定的。|而拦截器既可以用于Web程序，也可以用于Application、Swing程序中。| 使用范围不同
Filter 是在 Servlet 规范中定义的，是 Servlet 容器支持的。|而拦截器是在 Spring容器内的，是Spring框架支持的。 | 规范不同
Filter 不能够使用 Spring 容器资源    |拦截器是一个Spring的组件，归Spring管理，配置在Spring文件中，因此能使用Spring里的任何资源、对象，例如 Service对象、数据源、事务管理等，通过IoC注入到拦截器即可 | Spring 中使用 interceptor 更容易
Filter 是被 Server(like Tomcat) 调用 |  Interceptor 是被 Spring 调用  | 因此 Filter 总是优先于 Interceptor 执行



[^top]: https://stackoverflow.com/a/8006315/1820217


## interceptor 使用
interceptor 的执行顺序大致为：

1. 请求到达 DispatcherServlet
2. DispatcherServlet 发送至 Interceptor ，执行 preHandle
3. 请求达到 Controller
4. 请求结束后，postHandle 执行

Spring 中主要通过 HandlerInterceptor 接口来实现请求的拦截，实现 HandlerInterceptor 接口需要实现下面三个方法：

- **preHandle()** – 在handler执行之前，返回 boolean 值，true 表示继续执行，false 为停止执行并返回。
- **postHandle()** – 在handler执行之后, 可以在返回之前对返回的结果进行修改
- **afterCompletion()** – 在请求完全结束后调用，可以用来统计请求耗时等等

统计请求耗时

	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;

	import org.apache.log4j.Logger;
	import org.springframework.web.servlet.ModelAndView;
	import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

	public class ExecuteTimeInterceptor extends HandlerInterceptorAdapter{

		private static final Logger logger = Logger.getLogger(ExecuteTimeInterceptor.class);

		//before the actual handler will be executed
		public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler)
			throws Exception {

			long startTime = System.currentTimeMillis();
			request.setAttribute("startTime", startTime);

			return true;
		}

		//after the handler is executed
		public void postHandle(
			HttpServletRequest request, HttpServletResponse response,
			Object handler, ModelAndView modelAndView)
			throws Exception {

			long startTime = (Long)request.getAttribute("startTime");

			long endTime = System.currentTimeMillis();

			long executeTime = endTime - startTime;

			//modified the exisitng modelAndView
			modelAndView.addObject("executeTime",executeTime);

			//log it
			if(logger.isDebugEnabled()){
			   logger.debug("[" + handler + "] executeTime : " + executeTime + "ms");
			}
		}
	}

例子来源 [mkyong](https://www.mkyong.com/spring-mvc/spring-mvc-handler-interceptors-example/)

使用mvc:interceptors标签来声明需要加入到SpringMVC拦截器链中的拦截器

	<mvc:interceptors>  
	<!-- 使用bean定义一个Interceptor，直接定义在mvc:interceptors根下面的Interceptor将拦截所有的请求 -->  
    <bean class="com.company.app.web.interceptor.AllInterceptor"/>  
		<mvc:interceptor>  
			 <mvc:mapping path="/**"/>  
			 <mvc:exclude-mapping path="/parent/**"/>  
			 <bean class="com.company.authorization.interceptor.SecurityInterceptor" />  
		</mvc:interceptor>  
		<mvc:interceptor>  
			 <mvc:mapping path="/parent/**"/>  
			 <bean class="com.company.authorization.interceptor.SecuritySystemInterceptor" />  
		</mvc:interceptor>  
	</mvc:interceptors>  

可以利用mvc:interceptors标签声明一系列的拦截器，然后它们就可以形成一个拦截器链，拦截器的执行顺序是按声明的先后顺序执行的，先声明的拦截器中的preHandle方法会先执行，然而它的postHandle方法和afterCompletion方法却会后执行。

在mvc:interceptors标签下声明interceptor主要有两种方式：

- 直接定义一个Interceptor实现类的bean对象。使用这种方式声明的Interceptor拦截器将会对所有的请求进行拦截。
- 使用mvc:interceptor标签进行声明。使用这种方式进行声明的Interceptor可以通过mvc:mapping子标签来定义需要进行拦截的请求路径。

经过上述两步之后，定义的拦截器就会发生作用对特定的请求进行拦截了。

## Filter 使用

Servlet 的 Filter 接口需要实现如下方法：

- `void init(FilterConfig paramFilterConfig)` – 当容器初始化 Filter 时调用，该方法在 Filter 的生命周期只会被调用一次，一般在该方法中初始化一些资源，FilterConfig 是容器提供给 Filter 的初始化参数，在该方法中可以抛出 ServletException 。init 方法必须执行成功，否则 Filter 可能不起作用，出现以下两种情况时，web 容器中 Filter 可能无效： 1）抛出 ServletException 2）超过 web 容器定义的执行时间。
- `doFilter(ServletRequest paramServletRequest, ServletResponse paramServletResponse, FilterChain paramFilterChain)` – Web 容器每一次请求都会调用该方法。该方法将容器的请求和响应作为参数传递进来， FilterChain 用来调用下一个 Filter。
- `void destroy()` – 当容器销毁 Filter 实例时调用该方法，可以在方法中销毁资源，该方法在 Filter 的生命周期只会被调用一次。 


    <filter>
        <filter-name>FrequencyLimitFilter</filter-name>
        <filter-class>com.company.filter.FrequencyLimitFilter</filter-class>
    </filter>

    <filter-mapping>
        <filter-name>FrequencyLimitFilter</filter-name>
        <url-pattern>/login/*</url-pattern>
    </filter-mapping>

## Filter 和 Interceptor 的一些用途

- Authentication Filters
- Logging and Auditing Filters
- Image conversion Filters
- Data compression Filters
- Encryption Filters
- Tokenizing Filters
- Filters that trigger resource access events
- XSL/T filters
- Mime-type chain Filter

Request Filters 可以:

- 执行安全检查 perform security checks
- 格式化请求头和主体 reformat request headers or bodies
- 审查或者记录日志 audit or log requests
- 根据请求内容授权或者限制用户访问 Authentication-Blocking requests based on user identity.
- 根据请求频率限制用户访问

Response Filters 可以:

- 压缩响应内容,比如让下载的内容更小 Compress the response stream
- 追加或者修改响应 append or alter the response stream
- 创建或者整体修改响应 create a different response altogether
- 根据地方不同修改响应内容 Localization-Targeting the request and response to a particular locale.


## reference

- <https://gopalakrishnadurga.wordpress.com/2012/06/08/filter-vs-interceptor/>


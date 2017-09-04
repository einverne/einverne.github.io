---
layout: post
title: "Spring MVC 应用处理 CORS"
tagline: ""
description: ""
category: 经验总结
tags: [Spring, CORS, JS, Web, HTTP, 跨域，]
last_updated: 
---

什么是跨域或者说什么是CORS（Cross-origin resource sharing），中文叫"跨域资源共享"。在了解 CORS 之前首先要知道“同源策略”，出于安全考虑，浏览器会限制Ajax中发起的跨站请求。比如，使用 XMLHttpRequest 对象发起 HTTP 请求就必须遵守**同源策略**（same-origin policy）,”同源策略“是浏览器安全的基石。具体而言，Web 应用程序能且只能使用 XMLHttpRequest 对象向其加载的源域名发起 HTTP 请求，而不能向任何其它域名发起请求。阮一峰写的一篇关于 CORS 的[文章](http://www.ruanyifeng.com/blog/2016/04/cors.html) 介绍得非常详细，这里主要记录一下重点以及 Spring MVC 中如何处理 CORS。

CORS 做到了不破坏即有规则，只要服务端实现了 CORS 接口，就可以跨源通信。

## 简单请求 VS 非简单请求处理

浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

需要同时满足以下两大条件，才属于简单请求。

- 请求方法仅仅为以下三种方法之一：

	HEAD、GET、POST

- HTTP的头信息不超出以下几种字段：

	Accept、Accept-Language、Content-Language、Last-Event-ID、Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

### 简单请求处理

Response Header  |      选项            
------------------------------|--------------------------------
Access-Control-Allow-Origin   | **必须**，值要么是请求的 Origin，要么是 `*` ，表示接受所有域名请求
Access-Control-Allow-Credentials |  该字段可选。它的值是一个布尔值，表示是否允许客户端发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可。
Access-Control-Expose-Headers  | 该字段可选。扩展客户端能够访问的字段。CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。上面的例子指定，getResponseHeader('FooBar')可以返回FooBar字段的值。

简单请求的处理过程可以参考下图：

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/8CpF04" title="简单请求流程"><img src="https://farm5.staticflickr.com/4380/36149006303_7bec3d58ac_b.jpg" width="1024" height="648" alt="简单请求流程"></a>

对于简单请求，CORS 的策略是请求时，在头信息中添加一个 **Origin** 字段，服务器收到请求后，根据该字段判断是否允许该请求。

- 如果允许，则在 HTTP 头信息中添加 Access-Control-Allow-Origin 字段，并返回正确的结果
- 如果不允许，则不在头信息中添加 Access-Control-Allow-Origin 字段。

浏览器先于用户得到返回结果，根据有无 Access-Control-Allow-Origin 字段来决定是否拦截该返回结果。

script 或者 image 标签触发的 GET 请求不包含 Origin 头，所以不受到 CORS 的限制，依旧可用。如果是 Ajax 请求，HTTP 头信息中会包含 Origin 字段，由于服务器没有做任何配置，所以返回结果不会包含 Access-Control-Allow-Origin，因此返回结果会被浏览器拦截，接口依旧不可以被 Ajax 跨源访问。

### 非简单请求
而对于真正实现中的请求，可能会使用 `Content-Type:application/json`，也有可能有自定义 Header，所以了解非简单请求的处理也非常必要。

对于 `Content-Type` 为 `application/json` 的特殊请求，需要服务端特殊对待的请求，在正式通信前会增加一次“预检”请求（preflight）。浏览器会先询问服务器，当前网页所在的域名是否在服务器的许可名单，以及可以使用哪些HTTP动词和头信息，得到服务端回复才会发出正式的请求，否则报错。

CORS 请求相关 Header

Request Header                  | value
Access-Control-Request-Method   | 真实请求使用的 HTTP 方法
Access-Control-Request-Headers  | 真实请求包含的自定义 Header

在服务端收到客户端发出的预检请求后，校验 `Origin`，`Access-Control-Request-Method`，`Access-Control-Request-Headers`，通过校验后在返回中加入如下的header：

Response Header 				| value       
--------------------------------|---------------------------------------------
Access-Control-Allow-Methods    | 必须，值为逗号分割的字符串，表明服务器支持的所有跨域请求方法，返回的是所有支持的方法，为了避免多次“预检”请求。
Access-Control-Allow-Headers    | 如果浏览器请求包括 `Access-Control-Request-Headers` 字段，则 `Access-Control-Allow-Headers` 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。
Access-Control-Allow-Credentials  | 与简单请求含义相同
Access-Control-Max-Age          | 该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是20天（1728000秒），即允许缓存该条回应1728000秒（即20天），在此期间，不用发出另一条预检请求。

一旦服务器通过了"预检"请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样，会有一个Origin头信息字段。服务器的回应，也都会有一个`Access-Control-Allow-Origin`头信息字段。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/jo3YB4" title="非简单请求流程"><img src="https://farm5.staticflickr.com/4351/36770119076_8cb02f6801_b.jpg" width="1024" height="931" alt="非简单请求流程"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

## Spring 处理跨域
这里主要针对 Spring 3.x 来处理， 在 Spring 4.2 之后官方引入了 @CrossOrigin 注解，处理 CORS 变的非常方便。所以接下来就记录下 3.x 中的处理方法。

### 更新 web.xml 
更新 web.xml 让 Spring 开启 OPTIONS 处理.

	<servlet>    
	   <servlet-name>application</servlet-name>    
	   <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>  
	   <init-param>  
			<param-name>dispatchOptionsRequest</param-name>  
			<param-value>true</param-value>  
	   </init-param>    
	   <load-on-startup>1</load-on-startup>    
	</servlet>    

### 添加Header

使用 Interceptor

	public class CorsInterceptor extends HandlerInterceptorAdapter {

		@Override
		public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
			addOriginHeader(request, response);
			if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
				response.setStatus(200);
				return false;
			}	
			return true;
		}

		private void addOriginHeader(HttpServletRequest request, HttpServletResponse response) {
			String origin = request.getHeader("Origin");
			response.addHeader("Access-Control-Allow-Origin", origin);
			response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type");
			response.addHeader("Access-Control-Allow-Credentials", "true");         // 可选，是否允许Cookie
			response.addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
			response.addHeader("Access-Control-Max-Age", "1728000");
		}
	}

在 XML 中配置 Interceptor 

然后在 Controller 中

	@RequestMapping(value = "/test/hello", method = {RequestMethod.GET, RequestMethod.OPTIONS})

然后OK



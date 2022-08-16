---
layout: post
title: "《Spring MVC 实战》笔记"
aliases: "《Spring MVC 实战》笔记"
tagline: ""
description: ""
category: [ 学习笔记 , 读书笔记 ]
tags: [spring-mvc, spring, notes, java,  ]
last_updated:
---

从 WizNote 中整理。

POJO, Plain Old java object, 最简单的 Java 对象

[[Dependency Injection]] 带来的最大好处，松耦合，如果一个对象只通过接口（而不是具体实现或初始化过程）来表明依赖关系，那么这种依赖就能够在对象本身毫不知情的情况下，用不同的具体实现进行替换。

AOP aspect-oriented programming, 面向切面编程允许将遍布应用各处的功能分离出来形成可重用的组件

依赖注入让互相协作的软件组件保持松散耦合，而 AOP 则是让遍布各处的功能分离出来形成可重用的组件。

## 体系结构
Spring 框架提供约 20 个模块。

### 核心容器
由核心，Bean，上下文，表达式语言模块

- 核心模块提供框架基本组成部分，包括 IoC （控制反转） 和 依赖注入 DI
- Bean 模块提供 BeanFactory，是一个工厂模式的复杂实现
- 上下文，在核心和 Bean 模块基础上，访问定义和配置的任何对象的媒介，ApplicationContext 接口是上下文模块的重点
- 表达式语言模块在运行时提供查询和操作一个对象图的表达式

### 数据访问 / 集成
数据访问 / 集成层包括 JDBC，ORM，OXM，JMS 和事务处理模块

### Web
Web 层由 Web，Web-MVC，Web-Socket 和 Web-Portlet 组成

### 其他
还有其他一些重要的模块，像 AOP，Aspects，Instrumentation，Web 和测试模块

1. DispatcherServlet

　　DispatcherServlet 是前置控制器，配置在 web.xml 文件中的。拦截匹配的请求，Servlet 拦截匹配规则要自已定义，把拦截下来的请求，依据相应的规则分发到目标 Controller 来处理，是配置 spring MVC 的第一步。

2. InternalResourceViewResolver

　　视图名称解析器


## 常用注解

`@Controller` 负责注册一个 bean 到 spring 上下文中，类名前加此注解，告知 Spring 容器这是一个控制器组件，负责注册一个 bean 到 spring 上下文中

Controller 注解示例

    @Controller
    @RequestMapping("/mvc")
    public class mvcController {
        @RequestMapping("/hello")
        public String hello(){
            return "hello";
        }
    }

    @Controller
    @RequestMapping("/rest")
    public class RestController {
        @RequestMapping(value="/user/{id}",method=RequestMethod.GET)
        public String get(@PathVariable("id") Integer id){
            System.out.println("get"+id);
            return "/hello";
        }

        @RequestMapping(value="/user/{id}",method=RequestMethod.POST)
        public String post(@PathVariable("id") Integer id){
            System.out.println("post"+id);
            return "/hello";
        }

        @RequestMapping(value="/user/{id}",method=RequestMethod.PUT)
        public String put(@PathVariable("id") Integer id){
            System.out.println("put"+id);
            return "/hello";
        }

        @RequestMapping(value="/user/{id}",method=RequestMethod.DELETE)
        public String delete(@PathVariable("id") Integer id){
            System.out.println("delete"+id);
            return "/hello";
        }
    }

`@RequestMapping` 类方法前加，注解为 Controller 指定可以处理哪些 URL 请求

	@RequestMapping(value = "/register", method = RequestMethod.POST)

三个常用属性：value，params，method

value 必填属性，代表请求的 url，支持模糊配置。(value 字可以省略，但是属性值必须填）

    @RequestMapping(value="/users/**")   匹配"/users/abc/abc"；
    @RequestMapping(value="/product?")   匹配"/product1"或"/producta"，但不匹配"/product"或"/productaa"；
    @RequestMapping(value="/product*")   匹配“/productabc”或“/product”，但不匹配“/productabc/abc”；
    @RequestMapping(value="/product/*")   匹配“/product/abc”，但不匹配“/productabc”；

params 可选属性，代表对请求参数进行过滤

    @RequestMapping(value="/login.do",params="flag")   代表请求中必须要有名为 flag 的提交项
    @RequestMapping(value="/login.do",params="!flag")  代表请求中不能有名为 flag 的提交项
    @RequestMapping(value="/login.do",params="flag=hello") 代表请求中必须有名为 flag 的提交项，且值为 hello
    @RequestMapping(value="/login.do",params="flag!=hello") 代表请求中如果有名为 flag 的提交项，其值不能为 hello
    @RequestMapping(value="/login.do",params={"flag1","flag2=hello"}) 代表请求中必须有名为 flag1 的提交项，同时必须有名为 flag2 的提交项，且 flag2 的值必须为 hello

method 可选属性，代表请求方式

    @RequestMapping(value="/login.do",method=RequestMethod.POST)
    @RequestMapping(value="/login.do",method=RequestMethod.GET)
    @RequestMapping(value="/login.do", method= {RequestMethod.POST, RequestMethod.GET}"

@RequestBody 该注解用于读取 Request 请求的 body 部分数据，使用系统默认配置的 HttpMessageConverter 进行解析，然后把相应的数据绑定到要返回的对象上 , 再把 HttpMessageConverter 返回的对象数据绑定到 Controller 中方法的参数上

@ResponseBody 该注解用于将 Controller 的方法返回的对象，通过适当的 HttpMessageConverter 转换为指定格式后，写入到 Response 对象的 body 数据区

@ModelAttribute 在方法定义上使用 @ModelAttribute 注解：Spring MVC 在调用目标处理方法前，会先逐个调用在方法级上标注了 @ModelAttribute 的方法

在方法的入参前使用 @ModelAttribute 注解：可以从隐含对象中获取隐含的模型数据中获取对象，再将请求参数 –绑定到对象中，再传入入参将方法入参对象添加到模型中

@RequestParam　在处理方法入参处使用 @RequestParam 可以把请求参数传递给请求方法

    @RequestMapping(value = "/check", method = RequestMethod.GET)
    public
    @ResponseBody
    String check(@RequestParam(value = "signature", required = true, defaultValue = "") String signature,
                 @RequestParam(value = "timestamp", required = true, defaultValue = "") String timestamp,
                 @RequestParam(value = "nonce", required = true, defaultValue = "") String nonce,
                 @RequestParam(value = "echostr", required = true, defaultValue = "") String echostr,
                 HttpServletRequest request,
                 HttpServletResponse response
    ) {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        if (checkSignature(signature, timestamp, nonce)) {
            return echostr;
        }
        return "";
    }

@PathVariable

　　绑定 URL 占位符到参数

@ExceptionHandler

　　注解到方法上，出现异常时会执行该方法

@ControllerAdvice

使 Contoller 成为全局的异常处理类，类中用 @ExceptionHandler 方法注解的方法可以处理所有 Controller 中发生的异常

    @ControllerAdvice
    public class GlobalExceptionHandler {
        private static Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        @ExceptionHandler(value = Exception.class)
        @ResponseBody
        public void exceptionHandler(HttpServletRequest req, Exception e) throws Exception {
            //todo add request info to log
            logger.error("error: {}", e);
            return;
        }

    }

自动装配主要使用 @ComponentScan、@Component 和 @Autowired。

- @ComponentScan：作用在配置类上，启用组件扫描。扫描并注册标注了 @Component（@Controller/@Service/@Repository）的类型。@Configuration 已经应用了 @Component 注解。
- @Autowired：按类型自动装配。@Autowired 和使用 @Inject（JSR-330）或 @Resource（JSR-250）的效果是类似的。@Autowired 和 @Inject 默认按类型注入，@Resource 默认按名称注入。

@Autowired

@Resource

参数绑定注解

- 处理 requet uri 部分（这里指 uri template 中 variable，不含 queryString 部分）的注解：   @PathVariable;
- 处理 request header 部分的注解：   @RequestHeader, @CookieValue;
- 处理 request body 部分的注解：@RequestParam,  @RequestBody;
- 处理 attribute 类型是注解： @SessionAttributes, @ModelAttribute;

@PathVariable

当使用 @RequestMapping URI template 样式映射时， 即 someUrl/{paramId}, 这时的 paramId 可通过 @Pathvariable 注解绑定它传过来的值到方法的参数上。

示例代码：

```
@Controller
@RequestMapping("/owners/{ownerId}")
public class RelativePathUriTemplateController {

	@RequestMapping("/pets/{petId}")
	public void findPet(@PathVariable String ownerId, @PathVariable String petId, Model model) {
	// implementation omitted
	}
}
```

上面代码把 URI template 中变量 ownerId 的值和 petId 的值，绑定到方法的参数上。若方法参数名称和需要绑定的 uri template 中变量名称不一致，需要在 @PathVariable("name") 指定 uri template 中的名称。

@RequestHeader、@CookieValue

@RequestHeader 注解，可以把 Request 请求 header 部分的值绑定到方法的参数上。

示例代码：

这是一个 Request 的 header 部分：

	Host
	localhost:8080
	Accept                  text/html,application/xhtml+xml,application/xml;q=0.9
	Accept-Language         fr,en-gb;q=0.7,en;q=0.3
	Accept-Encoding         gzip,deflate
	Accept-Charset          ISO-8859-1,utf-8;q=0.7,*;q=0.7
	Keep-Alive              300

代码：

	@RequestMapping("/displayHeaderInfo.do")
	public void displayHeaderInfo(@RequestHeader("Accept-Encoding") String encoding,                                @RequestHeader("Keep-Alive") long keepAlive)  {
		//...
	}

上面的代码，把 request header 部分的 Accept-Encoding 的值，绑定到参数 encoding 上了， Keep-Alive header 的值绑定到参数 keepAlive 上。


@CookieValue 可以把 Request header 中关于 cookie 的值绑定到方法的参数上。

例如有如下 Cookie 值：

JSESSIONID=415A4AC17

参数绑定的代码：

```
@RequestMapping("/displayHeaderInfo.do")  public void displayHeaderInfo(@CookieValue("JSESSIONID") String cookie)  {      //...    }  即把 JSESSIONID 的值绑定到参数 cookie 上。
```

@RequestParam, @RequestBody

@RequestParam

- 常用来处理简单类型的绑定，通过 Request.getParameter() 获取的 String 可直接转换为简单类型的情况（ String--> 简单类型的转换操作由 ConversionService 配置的转换器来完成）；因为使用 request.getParameter() 方式获取参数，所以可以处理 get 方式中 queryString 的值，也可以处理 post 方式中 body data 的值；
- 用来处理 Content-Type: 为 application/x-www-form-urlencoded 编码的内容，提交方式 GET、POST；
- 该注解有两个属性： value、required； value 用来指定要传入值的 id 名称，required 用来指示参数是否必须绑定；

示例代码：

```
@Controller
@RequestMapping("/pets")
@SessionAttributes("pet")
public class EditPetForm {

	@RequestMapping(method = RequestMethod.GET)
	public String setupForm(@RequestParam("petId") int petId, ModelMap model) {
		Pet pet = this.clinic.loadPet(petId);
		model.addAttribute("pet", pet);
		return "petForm";
	}
}
```

@RequestBody

该注解常用来处理 Content-Type: 不是 application/x-www-form-urlencoded 编码的内容，例如 application/json, application/xml 等；

它是通过使用 HandlerAdapter 配置的 HttpMessageConverters 来解析 post data body，然后绑定到相应的 bean 上的。

因为配置有 FormHttpMessageConverter，所以也可以用来处理 application/x-www-form-urlencoded 的内容，处理完的结果放在一个 MultiValueMap<String, String>里，这种情况在某些特殊需求下使用，详情查看 FormHttpMessageConverter api;

示例代码：

```
@RequestMapping(value = "/something", method = RequestMethod.PUT)  public void handle(@RequestBody String body, Writer writer) throws IOException {    writer.write(body);  }
```

4、@SessionAttributes, @ModelAttribute

@SessionAttributes:

该注解用来绑定 HttpSession 中的 attribute 对象的值，便于在方法中的参数里使用。

该注解有 value、types 两个属性，可以通过名字和类型指定要使用的 attribute 对象；

示例代码：

```
@Controller  @RequestMapping("/editPet.do")  @SessionAttributes("pet")  public class EditPetForm {      // ...  }
```

@ModelAttribute

该注解有两个用法，一个是用于方法上，一个是用于参数上；

用于方法上时：  通常用来在处理 @RequestMapping 之前，为请求绑定需要从后台查询的 model；

用于参数上时： 用来通过名称对应，把相应名称的值绑定到注解的参数 bean 上；要绑定的值来源于：

A） @SessionAttributes 启用的 attribute 对象上；

B） @ModelAttribute 用于方法上时指定的 model 对象；

C） 上述两种情况都没有时，new 一个需要绑定的 bean 对象，然后把 request 中按名称对应的方式把值绑定到 bean 中。

用到方法上 @ModelAttribute 的示例代码：

```
// Add one attribute  // The return value of the method is added to the model under the name "account"  // You can customize the name via @ModelAttribute("myAccount")    @ModelAttribute  public Account addAccount(@RequestParam String number) {      return accountManager.findAccount(number);  }
```

这种方式实际的效果就是在调用 @RequestMapping 的方法之前，为 request 对象的 model 里 put（“account”， Account）；

用在参数上的 @ModelAttribute 示例代码：


```
@RequestMapping(value="/owners/{ownerId}/pets/{petId}/edit", method = RequestMethod.POST)
public String processSubmit(@ModelAttribute Pet pet) {       }
```

首先查询 @SessionAttributes 有无绑定的 Pet 对象，若没有则查询 @ModelAttribute 方法层面上是否绑定了 Pet 对象，若没有则将 URI template 中的值按对应的名称绑定到 Pet 对象的各属性上。

补充讲解：

问题： 在不给定注解的情况下，参数是怎样绑定的？

通过分析 AnnotationMethodHandlerAdapter 和 RequestMappingHandlerAdapter 的源代码发现，方法的参数在不给定参数的情况下：

若要绑定的对象时简单类型：  调用 @RequestParam 来处理的。

若要绑定的对象时复杂类型：  调用 @ModelAttribute 来处理的。

这里的简单类型指 Java 的原始类型 (boolean, int 等）、原始类型对象（Boolean, Int 等）、String、Date 等 ConversionService 里可以直接 String 转换成目标对象的类型；


RequestMappingHandlerAdapter 中使用的参数绑定，代码稍微有些不同，有兴趣的可以分析下，最后处理的结果都是一样的。


示例：

```
@RequestMapping ({"/", "/home"})      public String showHomePage(String key){                    logger.debug("key="+key);
return "home";
}
```

这种情况下，就调用默认的 @RequestParam 来处理。


```
@RequestMapping (method = RequestMethod.POST)  public String doRegister(User user){      if(logger.isDebugEnabled()){          logger.debug("process url[/user], method[post] in "+getClass());          logger.debug(user);      }        return "user";  }
```

这种情况下，就调用 @ModelAttribute 来处理。

## reference

- Spring Web Doc：  spring-3.1.0/docs/spring-framework-reference/html/mvc.html



---
layout: post
title: "在 Spring Boot 中使用 Swagger"
tagline: ""
description: ""
category: 学习笔记
tags: [Spring, Swagger, Java]
last_updated: 
---

在使用 Spring Boot 构建一套 RESTful 接口的时候经常需要手工维护一份接口文档以提供给不同的客户端使用，有的时候手工维护成本太高，今天发现了一套自动化生成 RESTful 接口文档的工具 Swagger 。

Swagger 能根据 Spring Controller 接口自动生成一个文档页面，在代码中使用注解将接口文档注释，非常方便。 Swagger 整合到 Spring boot 项目中也非常方便。

## 添加依赖
在 `pom.xml` 中添加

	<dependency>
		<groupId>io.springfox</groupId>
		<artifactId>springfox-swagger2</artifactId>
		<version>2.7.0</version>
	</dependency>
	<dependency>
		<groupId>io.springfox</groupId>
		<artifactId>springfox-swagger-ui</artifactId>
		<version>2.7.0</version>
	</dependency>
 
最新的版本可以在 mvnrepository 上查到，或者上官网或者 github。

## 添加配置类


	@Configuration
	@EnableSwagger2
	public class SwaggerConfig {

		@Bean
		public Docket helloApi() {
			return new Docket(DocumentationType.SWAGGER_2)
					.apiInfo(apiInfo())
					.select()
					.apis(RequestHandlerSelectors.basePackage("info.einverne.springboot.demo"))
					.paths(PathSelectors.any())
					.build();
		}

		private ApiInfo apiInfo() {
			return new ApiInfoBuilder()
					// 文档标题
					.title("API 文档")
					// 文档描述
					.description("https://github.com/einverne/thrift-swift-demo/tree/master/spring-boot-demo")
					.termsOfServiceUrl("https://github.com/einverne/thrift-swift-demo/tree/master/spring-boot-demo")
					.version("v1")
					.build();
		}

	}

通过`@Configuration`注解，让Spring来加载该类配置。再通过`@EnableSwagger2`注解来启用Swagger2。

- `apiInfo()` 用来创建 API 的基本信息，展现在文档页面中。
- `select()` 函数返回一个 `ApiSelectorBuilder` 实例用来控制哪些接口暴露给 Swagger ，这里使用定义扫描包路径来定义， Swagger 会扫描包下所有 Controller 的定义并产生文档内容，除了被 `@ApiIgnore` 注解的接口。

## 添加接口注释

@ApiOperation注解来给API增加说明、通过@ApiImplicitParams、@ApiImplicitParam注解来给参数增加说明。

一个简单的注释

    @ApiOperation(value = "创建用户", notes = "根据User对象创建用户")
    @ApiImplicitParam(name = "user", value = "用户详细实体user", required = true, dataType = "User")
    @RequestMapping(value = "", method = RequestMethod.POST)
    public String postUser(@RequestBody User user) {
        users.put(user.getId(), user);
        return "success";
    }

详细的例子可以参考源代码 <https://github.com/einverne/thrift-swift-demo> 

再添加注释后启动 Spring boot, 访问 <http://localhost:8080/swagger-ui.html> 即可看到API文档

### Api 注解
`@Api` 注解用于类上，说明类作用

- value url
- description
- tags 设置该值，value 会被覆盖
- basePath 基本路劲不可配置
- position
- produces "application/json"
- consumes "application/json"
- protocols http, https, wss
- authorizations 认证
- hidden 是否在文档隐藏

### ApiOperation 注解

标记在方法上，对一个操作或HTTP方法进行描述。具有相同路径的不同操作会被归组为同一个操作对象。不同的HTTP请求方法及路径组合构成一个唯一操作。此注解的属性有：

- value 对操作的简单说明，长度为120个字母，60个汉字。
- notes 对操作的详细说明。
- httpMethod HTTP请求的动作名，可选值有："GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS" and "PATCH"。
- code 默认为200，有效值必须符合标准的 [HTTP Status Code Definitions](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)

### ApiImplicitParams

注解ApiImplicitParam的容器类，以数组方式存储。

### ApiImplicitParam

对API的单一参数进行注解。虽然注解@ApiParam同JAX-RS参数相绑定，但这个@ApiImplicitParam注解可以以统一的方式定义参数列表，也是在Servelet及非JAX-RS环境下，唯一的方式参数定义方式。注意这个注解@ApiImplicitParam必须被包含在注解@ApiImplicitParams之内。可以设置以下重要参数属性：

- name 参数名称
- value 参数的简短描述
- required 是否为必传参数
- dataType 参数类型，可以为类名，也可以为基本类型（String，int、boolean等）
- paramType 参数的传入（请求）类型，可选的值有path, query, body, header or form。

@RequestBody这样的场景请求参数无法使用@ApiImplicitParam注解进行描述

### ApiParam

增加对参数的元信息说明。这个注解只能被使用在JAX-RS 1.x/2.x的综合环境下。其主要的属性有：

- required 是否为必传参数
- value 参数简短说明

### ApiModel

提供对Swagger model额外信息的描述。在标注@ApiOperation注解的操作内，所有的类将自动被内省（introspected），但利用这个注解可以做一些更加详细的model结构说明。主要属性有：

- value model的别名，默认为类名
- description model的详细描述

### ApiModelProperty

对model属性的注解，主要的属性值有：

- value 属性简短描述
- example 属性的示例值
- required 是否为必须值
- hidden 隐藏该属性

### ApiResponse
响应配置

- code http状态码
- message 描述

### ApiResponses
多个 Response

### 验证机制
考虑到安全的问题，每次请求API需要对用户进行验证与授权。目前主流的验证方式采用请求头部（request header）传递token，即用户登录之后获取一个token，然后每次都使用这个token去请求API。如果想利用 swagger-UI 进行API测试，必须显式为每个需要验证的API指定token参数。这时可以为每个操作添加一个注解 @ApiImplicitParams，具体代码如下：

    @ApiImplicitParams({@ApiImplicitParam(name = "TOKEN", value = "Authorization token", required = true, dataType = "string", paramType = "header")})


## reference

- <https://github.com/swagger-api/swagger-core/wiki/Annotations-1.5.X#apiimplicitparam-apiimplicitparams>
- 项目源代码 <https://github.com/einverne/thrift-swift-demo/tree/master/spring-boot-demo>

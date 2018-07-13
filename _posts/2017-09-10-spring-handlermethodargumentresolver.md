---
layout: post
title: "Spring 中 HandlerMethodArgumentResolver 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [spring, resolver, spring-boot, ]
last_updated:
---

HandlerMethodArgumentResolver 是一个接口：

    public interface HandlerMethodArgumentResolver {
        boolean supportsParameter(MethodParameter var1);

        @Nullable
        Object resolveArgument(MethodParameter var1, @Nullable ModelAndViewContainer var2, NativeWebRequest var3, @Nullable WebDataBinderFactory var4) throws Exception;
    }

HandlerMethodArgumentResolver 的接口定义如下：

- supportsParameter() 用于判断是否支持对某种参数的解析
- resolveArgument() 当判断支持后将请求中的参数值进行相应的转换

关于 HandlerMethodArgumentResolver 执行流程，大部分可以在类 InvocableHandlerMethod 中看到

    @Nullable
    public Object invokeForRequest(NativeWebRequest request, @Nullable ModelAndViewContainer mavContainer, Object... providedArgs) throws Exception {
        // 获取 Controller 中函数的参数对象
        Object[] args = this.getMethodArgumentValues(request, mavContainer, providedArgs);
        if (this.logger.isTraceEnabled()) {
            this.logger.trace("Invoking '" + ClassUtils.getQualifiedMethodName(this.getMethod(), this.getBeanType()) + "' with arguments " + Arrays.toString(args));
        }

        Object returnValue = this.doInvoke(args);
        if (this.logger.isTraceEnabled()) {
            this.logger.trace("Method [" + ClassUtils.getQualifiedMethodName(this.getMethod(), this.getBeanType()) + "] returned [" + returnValue + "]");
        }

        return returnValue;
    }

    private Object[] getMethodArgumentValues(NativeWebRequest request, @Nullable ModelAndViewContainer mavContainer, Object... providedArgs) throws Exception {
        // 获取执行的具体函数的参数
        MethodParameter[] parameters = this.getMethodParameters();
        Object[] args = new Object[parameters.length];

        for(int i = 0; i < parameters.length; ++i) {
            MethodParameter parameter = parameters[i];
            parameter.initParameterNameDiscovery(this.parameterNameDiscoverer);
            args[i] = this.resolveProvidedArgument(parameter, providedArgs);
            if (args[i] == null) {
                // 首先判断是否有参数解析器支持参数 parameter，采用职责链的设计模式
                if (this.argumentResolvers.supportsParameter(parameter)) {
                    try {
                        // 如果参数解析器支持解析参数 parameter，那么解析参数成 Controller 的函数需要的格式
                        args[i] = this.argumentResolvers.resolveArgument(parameter, mavContainer, request, this.dataBinderFactory);
                    } catch (Exception var9) {
                        if (this.logger.isDebugEnabled()) {
                            this.logger.debug(this.getArgumentResolutionErrorMessage("Failed to resolve", i), var9);
                        }

                        throw var9;
                    }
                } else if (args[i] == null) {
                    throw new IllegalStateException("Could not resolve method parameter at index " + parameter.getParameterIndex() + " in " + parameter.getExecutable().toGenericString() + ": " + this.getArgumentResolutionErrorMessage("No suitable resolver for", i));
                }
            }
        }

        return args;
    }

## 外延

### 解析请求头及参数 AbstractNamedValueMethodArgumentResolver
AbstractNamedValueMethodArgumentResolver 抽象类主要用来解析方法参数 (resolving method arguments from a named value)，请求参数，请求头，path 变量都是 named value 的例子。他下面有很多的子类

    AbstractCookieValueMethodArgumentResolver
    ExpressionValueMethodArgumentResolver
    MatrixVariableMethodArgumentResolver
    PathVariableMethodArgumentResolver
    RequestAttributeMethodArgumentResolver
    RequestHeaderMethodArgumentResolver
    RequestParamMethodArgumentResolver
    ServletCookieValueMethodArgumentResolver
    SessionAttributeMethodArgumentResolver

### PathVariableMethodArgumentResolver

PathVariableMethodArgumentResolver 用来解析注解 `@PathVariable` 的参数。

`@PathVariable` 用来解析 URI 中的 Path 变量，Path 变量是必须的，并且没有默认值。

### RequestParamMethodArgumentResolver
用来将请求参数解析到注解 `@RequestParam` 修饰的方法参数中。

比如请求 `https://localhost:8080/hello?uid=1234`

    @RequestMapping(value="/hello",method=RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> test(@RequestParam(value = "uid", required = true, defaultValue = "1") String uid){
        return m;
    }

其中将请求的 uid 值解析到方法参数 uid 就是通过 RequestParamMethodArgumentResolver 来实现的。

### 解析请求体 AbstractMessageConverterMethodArgumentResolver
AbstractMessageConverterMethodArgumentResolver 是一个抽象类，主要用来将请求 body 中的内容解析到方法参数中，其子类：

- AbstractMessageConverterMethodProcessor
- HttpEntityMethodProcessor
- RequestPartMethodArgumentResolver
- RequestResponseBodyMethodProcessor

代码片段

    public abstract class AbstractMessageConverterMethodArgumentResolver implements HandlerMethodArgumentResolver {
        protected final List<HttpMessageConverter<?>> messageConverters;
        protected final List<MediaType> allSupportedMediaTypes;
    }

AbstractMessageConverterMethodProcessor 的子类 RequestResponseBodyMethodProcessor：支持 `@RequestBody` 和 `@ResponseBody`，使用举例：

    @RequestMapping(value="/hello/test",method=RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> test(@RequestBody Map<String,Object> m){
        return m;
    }

## reference

- Spring doc

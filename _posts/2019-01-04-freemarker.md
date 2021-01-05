---
layout: post
title: "Java 模板引擎 freemarker"
tagline: ""
description: ""
category:
tags: [java, template-engine, freemarker, email-template, html, ]
last_updated:
---

FreeMarker is a free Java-based template engine, originally focusing on dynamic web page generation with MVC software architecture. However, it is a general purpose template engine, with no dependency on servlets or HTTP or HTML, and is thus often used for generating source code, configuration files or e-mails. [by Wikipedia](https://en.wikipedia.org/wiki/Apache_FreeMarker)

Official site:

- <http://freemarker.org/>

## Maven dependencies
Since with maven-based project, add these requirement to __pom.xml__

    <dependency>
        <groupId>org.freemarker</groupId>
        <artifactId>freemarker</artifactId>
        <version>2.3.23</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context-support</artifactId>
        <version>${spring.version}</version>
    </dependency>


## FreeMarker with Spring MVC

    import freemarker.template.*;
    import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

    private Configuration configuration;
    configuration = new Configuration(new Version(2, 3, 20));
    configuration.setClassForTemplateLoading(FreeMarkerTemplateUtils.class, "/templates");
    configuration.setDefaultEncoding("UTF-8");
    configuration.setLocale(Locale.CHINA);
    configuration.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
    try {
      Template template = configuration.getTemplate("user_email.ftl");

      String body = FreeMarkerTemplateUtils.processTemplateIntoString(template, userTemplateVariable);
    } catch (IOException | TemplateException e) {
      log.error("userTemplate error", e);
    }


### Write to file

    Writer out = new FileWriter(dir + "/freemarker.html");
    template.process(root, out);

## Syntax

### default value
Starting from freemarker 2.3.7, you can use [this syntax](http://freemarker.org/docs/dgui_template_exp.html#dgui_template_exp_missing) :

    ${(object.attribute)!}

or, if you want display a default text when the attribute is `null` :

    ${(object.attribute)!"default text"}

### list
If you have a list as `List<Food> menu`

    <#list menu as food>
        ${food.name} ${food.price?string.currency}
    </#list>

### if/switch

    <#if var == 1>
    1
    <#elseif var == 2>
    2
    <#else>
    0
    </#if>

and switch

    <#switch y>
    <#case "one">
        one
        <#break>
    <#case "two">
        two
        <#break>
    <#case "three">
        three
        <#break>
    <#default>
        zero
    </#switch>

### function

    <#function fact n>
      <#if n == 0>
        <#return 1 />
      <#else>
        <#return fact(n - 1) * n />
      </#if>
    </#function>

    <#list 0..10 as i>
      ${i}! => ${fact(i)}
    </#list>

## reference

- <https://freemarker.apache.org/docs/pgui_quickstart.html>

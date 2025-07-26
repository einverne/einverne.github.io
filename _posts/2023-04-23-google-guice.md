---
layout: post
title: "Google Guice 轻量依赖注入使用"
aliases:
- "Google Guice 轻量依赖注入使用"
tagline: ""
description: ""
category: 学习笔记
tags: [guice, google, dependency-injection, java]
create_time: 2023-01-12 10:56:53
last_updated: 2023-10-13 10:58:02
---

[Guice](https://github.com/google/guice) 是 Google 推出的一个轻量级的依赖注入框架（dependency injection），可以帮助我们管理 Java 应用程序中的对象依赖关系。如果我们使用 Spring Framework 那可以直接使用 Spring 提供的 DI，但如果是使用 [[Javalin]] 或者自己的小型项目，但是也想使用灵活的 DI，但又不想要引用庞大的 Spring，就可以考虑 Guice。

Guice 根据'Apache 许可证版本 2'（Apache License version 2）发布，允许任何人免费使用、修改和重新发布，用于商业和非商业用途。

## Guice 的特性

最著名的依赖注入的实现是 Spring 框架。在最初开发时，Spring 框架是一个实现 DI 和 AOP 的轻量级框架，发展到今天，Spring 已经是一个具有众多功能的庞大框架。 除了 Spring 框架，DI 也可以通过 Seasar2 和 Java EE 来实现，但这两个框架都非常复杂，不能称为轻量级框架。 如果目标是只实现 DI，可以考虑选择 Guice，它是轻量级的。

特点

- 轻量，简单
- 基于注释
- 可与 Struts 和 Spring 集成
- JSR 330 参考实现

和工厂模式将客户端和实现类解耦类似，依赖注入是一种设计模式，将行为和依赖解析分离。

在 Guice 的说明文档中有一个非常清晰的[说明](https://github.com/google/guice/wiki/Motivation)，为什么我们需要依赖注入。

## Guice 核心概念

`@Inject` 注解的 Java 构造函数可以为 Guice 调用，称为「构造函数注入」

```java
class Greeter {
  private final String message;
  private final int count;

  // Greeter declares that it needs a string message and an integer
  // representing the number of time the message to be printed.
  // The @Inject annotation marks this constructor as eligible to be used by
  // Guice.
  @Inject
  Greeter(@Message String message, @Count int count) {
    this.message = message;
    this.count = count;
  }

  void sayHello() {
    for (int i=0; i < count; i++) {
      System.out.println(message);
    }
  }
}
```

例子中，Greeter 类有一个构造函数，当应用程序请求 Guice 创建 Greeter 实例时，构造函数会被调用，Guice 将创建这两个所需参数，然后调用构造函数。应用通过 Module 来告诉 Guice 如何满足这些依赖。

通过 Module 来定义依赖

```java
/**
 * Guice module that provides bindings for message and count used in
 * {@link Greeter}.
 */
import com.google.inject.Provides;

class DemoModule extends AbstractModule {
  @Provides
  @Count
  static Integer provideCount() {
    return 3;
  }

  @Provides
  @Message
  static String provideMessage() {
    return "hello world";
  }
}
```

`@Provides` 注解来指定依赖项。实际应用中，对象的依赖图会更加复杂，Guice 会自动创建所有传递依赖关系。

### Guice injectors 注入器

创建一个 Guice Injector 一个或者多个模块。

在 main 函数或者对应初始化的方法中。

```java
  public static void main(String[] args) {
    // Creates an injector that has all the necessary dependencies needed to
    // build a functional server.
    Injector injector = Guice.createInjector(
        new RequestLoggingModule(),
        new RequestHandlerModule(),
        new AuthenticationModule(),
        new DatabaseModule(),
        ...);
    // Bootstrap the application by creating an instance of the server then
    // start the server to handle incoming requests.
    injector.getInstance(MyWebServer.class)
        .start();
  }
```

## Guice DSL syntax

- `bind(key).toInstance(value)`
- `bind(key).toProvider(provider)`

## 使用

`@Named` 注解是 Guice 中的一种绑定注解，用于标记一个依赖项的名称，以便在注入时进行区分。

使用 `@Named` 注解时，需要在注入时指定相应的名称，例如：

```java
public class MyService {
  private final String message;

  @Inject
  public MyService(@Named("message") String message) {
    this.message = message;
  }
}
```

在这个例子中，我们使用 `@Named` 注解标记了一个名为"message"的依赖项。在注入时，我们可以使用 `@Named` 注解指定相应的名称，例如：

```java
public class MyAppModule extends AbstractModule {
  @Override
  protected void configure() {
    bind(String.class)
        .annotatedWith(Names.named("message"))
        .toInstance("Hello, world!");
  }
}
```

在这个例子中，我们使用 bind 方法将一个字符串"Hello, world!"绑定到名称为"message"的依赖项上。在注入时，我们可以使用@Named 注解指定相应的名称，例如：

```java
public class MyApp {
  public static void main(String[] args) {
    Injector injector = Guice.createInjector(new MyAppModule());
    MyService myService = injector.getInstance(MyService.class);
    System.out.println(myService.getMessage()); // 输出 "Hello, world!"
  }
}
```

在这个例子中，我们通过 Guice 创建了一个 Injector 对象，并使用 getInstance 方法获取了一个 MyService 对象。在 MyService 的构造函数中，我们使用 `@Named` 注解指定了名称为"message"的依赖项，Guice 会自动将名称为"message"的依赖项注入到构造函数中。最后，我们调用 `myService.getMessage()` 方法输出了"Hello, world!"。

## Multibindings

Guice 中的 MultiBinder 是一个多实例绑定。一个类型（Type） 有多个 `Set<TypeImpl>` 的实现。

比如可以定义一个接口，可能有很多个实现。

```
interface UriSummarizer {
  /**
   * Returns a short summary of the URI, or null if this summarizer doesn't
   * know how to summarize the URI.
   */
  String summarize(URI uri);
}
```

比如有一个实现

```
class FlickrPhotoSummarizer implements UriSummarizer {
  private static final Pattern PHOTO_PATTERN
      = Pattern.compile("http://www\\.flickr\\.com/photos/[^/]+/(\\d+)/");

  public String summarize(URI uri) {
    Matcher matcher = PHOTO_PATTERN.matcher(uri.toString());
    if (!matcher.matches()) {
      return null;
    } else {
      String id = matcher.group(1);
      Photo photo = lookupPhoto(id);
      return photo.getTitle();
    }
  }
}
```

通过 Module 来注册绑定关系。

```
public class FlickrPluginModule extends AbstractModule {
  public void configure() {
    Multibinder<UriSummarizer> uriBinder = Multibinder.newSetBinder(binder(), UriSummarizer.class);
    uriBinder.addBinding().to(FlickrPhotoSummarizer.class);

    ... // bind plugin dependencies, such as our Flickr API key
  }
}
```

最后注册 Module

```
public class PrettyTweets {
  public static void main(String[] args) {
    Injector injector = Guice.createInjector(
        new GoogleMapsPluginModule(),
        new BitlyPluginModule(),
        new FlickrPluginModule()
        ...
    );

    injector.getInstance(Frontend.class).start();
  }
}
```

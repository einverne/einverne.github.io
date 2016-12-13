---
layout: post
title: "Android lib Timber"
tagline: "Advanced Android Log System"
description: "Timber make Android Log easier"
category: Android
tags: [Android, AndroidDev, 学习]
last_updated: 
---

今天查询Android在release下不显示Log信息，偶然间接触到 Timber 这个库。 Android 原生提供了很多调试 Log 的方法，但是如果想要在release情况下禁用所有调试信息，除非在原生 Log 外再嵌套实现一层自己的方法，或者使用 ProGuard 。Android 本身没有提供一种简单的方式实现，幸而有大神提供了这样的一个库。

Android 原生 Logcat 分成 v/d/i/w/e/wtf . 官方推荐的最佳实践就是定义一个 TAG 变量：

    private static final String TAG = "EV_TAG_MyActivity";

然后过滤关键字就能找到对应的 Log 信息。大部分的情况下使用 Log.d 即可，但是各个方法都有其适用的情况：

- **Log.e** : 错误输出，用在 catch 语句下，你知道有可能有错误发生，因此打印出 Error
- **Log.w** : 警告，用来输出不可判断的错误出现的情况，如果出现了，需要查看
- **Log.i** : 信息，用来打印有用的信息，比如连接服务器成功，一般用来报告成功事件
- **Log.d**： 用来调试，只在 debug 下出现
- **Log.v**：各种小调试信息
- **Log.wtf**: 非常严重的错误发生时打 Log

## 设置Timber {#set-up-timber}

去GitHub 找项目主页 [Timber](https://github.com/JakeWharton/timber) ，在 build.gradle 中加入：

    compile 'com.jakewharton.timber:timber:4.1.2'

在 Application 下初始化 Timber

```
public class ExampleApp extends Application {
  @Override public void onCreate() {
    super.onCreate();

    if (BuildConfig.DEBUG) {
      Timber.plant(new DebugTree());
    } else {
      Timber.plant(new ReleaseTree());
    }
  }
}
```

调用 `Timber.plant(new DebugTree())` 之后，再使用 Timber 的静态方法，则使用了 DebugTree 中设定。DebugTree 是 Timber 库中默认实现的。

```
Timber.plant(new Timber.DebugTree(){
@Override
protected String createStackElementTag(StackTraceElement element) {
  return super.createStackElementTag(element) + ":" + element.getLineNumber();
}
});
```

重新实现 `createStackElementTag` 方法，可以在 Debug 下打印出 Log 所在的行号。

## using Timber

同Android提供的 Log 方法类似 Timber 也有 i/v/d/w/e/wtf  这些方法。 Timber 默认 TAG为文件名。当然可以使用 Timber.tag() 方法来设置一次性 tag 。

```
Timber.tag("LifeCycles");
Timber.d("Activity Created");
```

官方的使用教程其实只有两条：

1. 在 application class 下 plant Tree
2. 然后调用 Timber 的静态方法即可。

但是 Timber 提供了更多的自定义。可以通过继承 Timber.Tree 来实现。

Timber 可以种树也可以移除一棵树，也可以移走全部的树：

- plant(Tree)
- uproot(Tree)
- uprootAll()

## Timber Tree

先看看 Timber Tree 实现，这个类是一个抽象类，主要实现管理 TAG，并且提供各个 Log 方法的实现，类中有一个抽象方法

```
/**
 * Write a log message to its destination. Called for all level-specific methods by default.
 *
 * @param priority Log level. See {@link Log} for constants.
 * @param tag Explicit or inferred tag. May be {@code null}.
 * @param message Formatted log message. May be {@code null}, but then {@code t} will not be.
 * @param t Accompanying exceptions. May be {@code null}, but then {@code message} will not be.
 */
protected abstract void log(int priority, String tag, String message, Throwable t);
```

DebugTree 实现了 Timber.Tree ， 和 `log(int priority, String tag, String message, Throwable t)`方法。

```
@Override protected void log(int priority, String tag, String message, Throwable t) {
  if (message.length() < MAX_LOG_LENGTH) {
    if (priority == Log.ASSERT) {
      Log.wtf(tag, message);
    } else {
      Log.println(priority, tag, message);
    }
    return;
  }

  // Split by line, then ensure each line can fit into Log's maximum length.
  for (int i = 0, length = message.length(); i < length; i++) {
    int newline = message.indexOf('\n', i);
    newline = newline != -1 ? newline : length;
    do {
      int end = Math.min(newline, i + MAX_LOG_LENGTH);
      String part = message.substring(i, end);
      if (priority == Log.ASSERT) {
        Log.wtf(tag, part);
      } else {
        Log.println(priority, tag, part);
      }
      i = end;
    } while (i < newline);
  }
}
```
基本上能看到是为了避免打印长度超出 Log 的最大长度而做的设置。

## release logging
在给出来的 Demo 中，JakeWharton 实现了一个发布版本的 Tree，

```
private static class CrashReportingTree extends Timber.Tree {
@Override protected void log(int priority, String tag, String message, Throwable t) {
  if (priority == Log.VERBOSE || priority == Log.DEBUG) {
    return;
  }

  FakeCrashLibrary.log(priority, tag, message);

  if (t != null) {
    if (priority == Log.ERROR) {
      FakeCrashLibrary.logError(t);
    } else if (priority == Log.WARN) {
      FakeCrashLibrary.logWarning(t);
    }
  }
}
}
```
通过优先级，在 release 下 VERBOSE 和 DEBUG 就不产生 Log 信息了。而 Error 和 WARN 就交给了 FakeCrashLibrary 去处理了。

更多的方法可以参考 [文档](http://jakewharton.github.io/timber/) 。

## reference

- <http://jakewharton.github.io/timber/>
- <http://stackoverflow.com/questions/2446248/remove-all-debug-logging-calls-before-publishing-are-there-tools-to-do-this>
- <http://stackoverflow.com/questions/7959263/android-log-v-log-d-log-i-log-w-log-e-when-to-use-each-one>
- <http://code.tutsplus.com/tutorials/android-essentials-application-logging--mobile-4578>
- <https://caster.io/episodes/episode-14-logging-with-timber/>

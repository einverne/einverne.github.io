---
layout: post
title: "Maven 插件学习之： shade 插件"
aliases: "Maven 插件学习之： shade 插件"
tagline: ""
description: ""
category: 学习笔记
tags: [maven, maven-plugin, build, java,]
last_updated:
---


maven shade plugin 插件允许把工程使用到的依赖打包到一个 `uber-jar`（单一 jar 包） 中并隐藏（重命名）起来。

Shade Plugin 绑定到 `package` 生命周期。

使用 shade 常见的场景：

- 对包名进行重命名
- 生成单一 jar 包

## 使用

    <project>
      ...
      <build>
        <plugins>
          <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-shade-plugin</artifactId>
            <version>3.2.1</version>
            <configuration>
              <!-- put your configurations here -->
            </configuration>
            <executions>
              <execution>
                <phase>package</phase>
                <goals>
                  <goal>shade</goal>
                </goals>
              </execution>
            </executions>
          </plugin>
        </plugins>
      </build>
      ...
    </project>

## 实例

该插件允许我们选择最终打的包中包含或者去除那些包，具体可以参考[官网](https://maven.apache.org/plugins/maven-shade-plugin/examples/includes-excludes.html)

该插件也允许我们将一些类重定位到其他地方（Relocating Classes)，如果 uber JAR 被其他项目所以来，直接使用 uber JAR artifact 依赖中的类可能导致和其他相同类的冲突。解决这种问题的方法之一，就是将类重新移动到新位置。[官网](https://maven.apache.org/plugins/maven-shade-plugin/examples/class-relocation.html)

默认情况下，到执行 installed/deployed 时默认会生成两个 jar 包，一个以 `-shaded` 结尾，这个名字是可以配置的。

```
<build>
<plugins>
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-shade-plugin</artifactId>
    <version>3.2.1</version>
    <executions>
      <execution>
        <phase>package</phase>
        <goals>
          <goal>shade</goal>
        </goals>
        <configuration>
          <shadedArtifactAttached>true</shadedArtifactAttached>
          <shadedClassifierName>customName</shadedClassifierName> <!-- Any name that makes sense -->
        </configuration>
      </execution>
    </executions>
  </plugin>
</plugins>
</build>
```

创建可执行 jar 包，可以将入口添加进来。 [官网](https://maven.apache.org/plugins/maven-shade-plugin/examples/executable-jar.html)



## reference

- <https://maven.apache.org/plugins/maven-shade-plugin/>

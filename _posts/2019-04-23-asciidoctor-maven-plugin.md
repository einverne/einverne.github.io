---
layout: post
title: "Asciidoctor Maven Plugin 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [maven, asciidoctor, maven-plugin, ]
last_updated:
---

Asciidoctor Maven Plugin 这一款 maven 插件可以使用 [Asciidoctor](http://asciidoctor.org/) 将 AsciiDoc 文档转变成可读文档。



## Setup

    <plugins>
        <plugin>
            <groupId>org.asciidoctor</groupId>
            <artifactId>asciidoctor-maven-plugin</artifactId>
            <version>1.5.6</version>
            ...
        </plugin>
    </plugins>

and

    <plugin>
        ...
        <executions>
            <execution>
                <id>output-html</id>
                <phase>generate-resources</phase>
                <goals>
                    <goal>process-asciidoc</goal>
                </goals>
            </execution>
        </executions>
    </plugin>


## reference

- <https://asciidoctor.cn/docs/>

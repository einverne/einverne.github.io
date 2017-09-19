---
layout: post
title: "IntelliJ IDEA 中使用 Resin 调试"
tagline: ""
description: ""
category: 经验总结
tags: [Resin, IntelliJ, Java]
last_updated: 
---

平时开发环境使用的是 jetty，而 Java Web 有一个更好更快的服务器 Resin，这篇文章就来说一下什么是 Resin，以及在 Debug 中如何使用。

## 什么是 Resin
Resin是一个提供高性能的，支持 Java/PHP 的应用服务器。目前有两个版本：一个是GPL下的开源版本，提供给一些爱好者、开发人员和低流量网站使用；一种是收费的专业版本，增加了一些更加适用于生产环境的特性。

Resin也可以和许多其他的web服务器一起工作，比如Apache Server和IIS等。Resin支持Servlets 2.3标准和JSP 1.2标准。熟悉ASP和PHP的用户可以发现用Resin来进行JSP编程是件很容易的事情。Resin支持负载平衡，可以增加WEB站点的可靠性。方法是增加服务器的数量。比如一台Server的错误率是1%的话，那么支持负载平衡的两个Resin服务器就可以使错误率降到0.01%。到目前为止，Resin对WEB应用的支持已经远远超过Tomcat等各种大型的Server。


## Resin 安装

在 Resin 的官方 [quick start](http://www.caucho.com/resin-4.0/admin/starting-resin.xtp) 教程中有各大平台详细的安装指导。我在使用 apt 安装时没有成功，这里就记录下手工安装的过程。

在 <http://caucho.com/download> 网址下载， Resin 有两个版本， Pro 版和GPL开源版，个人使用开源基础版本已经足够。安装过程如下：

1. 安装JDK 6 或者以上版本，将 java 可执行程序配置到环境变量 `JAVA_HOME` 中
2. `tar -vzxf resin-4.0.x.tar.gz` 根据下载的最新版本解压
3. `cd resin-`
4. `./configure` 更多参数参考 [configure options](http://www.caucho.com/resin-4.0/admin/starting-resin-command-line.xtp)
5. `make`
6. `sudo make install`
7. 执行 `sudo resinctl start`, 或者运行  `java -jar lib/resin.jar start`
8. 浏览 `http://localhost:8080`

可以使用 `sudo resinctl stop` 来停止运行，更多内容可以参考官方[指南](http://www.caucho.com/resin-4.0/admin/starting-resin.xtp) 。

## IntelliJ IEDA 中使用 Resin 调试

第一步，添加 Resin Local 选项，在 IDEA 中 `Run/Debug Configuration` 中添加 Resin Local 选项

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/7P7xz7" title="resin-local"><img src="https://farm5.staticflickr.com/4402/36509373043_a97ff426ae_b.jpg" width="1024" height="648" alt="resin-local"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

点击configure按钮，在弹出窗Application Servers中选择部分一中安装的Resin目录路径和目录下Resin的配置文件路径。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/0Pck0B" title="resin-configure"><img src="https://farm5.staticflickr.com/4334/37323134305_02c7d6687c_b.jpg" width="1024" height="648" alt="resin-configure"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>


Run/Debug Configurations 中Server页面配置，基本都是默认。

Run/Debug Configurations 中Deployment页面配置,注意红色方框部分选择。选择resin.xml而不是JMX否则项目的index路径是localhost:8080/appname/ 而不是localhost:8080/

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/nF28t0" title="resin-deplyment"><img src="https://farm5.staticflickr.com/4414/36509372513_6bdaccf9b9_b.jpg" width="1024" height="648" alt="resin-deplyment"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

在Resin的服务器配置下 Depolyment中 Depolyment method：有 JMX 和resin.xml 两种选择, JMX 是把项目打包的文件放在resin 服务器下webapp下 只有在服务器启动时 才把项目给拷贝过去 无法在intellij中实时更新; resin.xml 是在C盘Temp 目录下 copy了一份resin.xml的配置文件 然后把服务器目录空间指向了你的项目工作空间  可以实现IntelliJ 修改实时更新。IntelliJ 默认的选择是JMX 所以我们要选中resin.xml模式。同时当项目 Artifacts 指向的目录是 ROOT 时 上图中的Use default context name(always true if depolyment method is JMX)取消勾选

执行build，得到war文件。执行resin run/debug，会自动在你选择的浏览器中打开项目index页面。也可以在IDEA下方的Application Servers面板中进行Resin的启动，停止等操作。Resin启动的打印信息也在此窗口显示。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/7027Hm" title="run-resin"><img src="https://farm5.staticflickr.com/4426/37323133865_6f9e05e8e9_b.jpg" width="1024" height="419" alt="run-resin"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>



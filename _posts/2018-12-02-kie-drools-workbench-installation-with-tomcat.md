---
layout: post
title: "Set up Drools Workbench with tomcat"
tagline: ""
description: ""
category: 学习笔记
tags: [drools, kie, drools-workbench, tomcat, linux, rule-engine, ]
last_updated:
---

在本机使用 Tomcat 启动 Drools Workbench，通常情况下直接使用 Docker 起就行了，但是为了学习 KIE Drools Workbench，这边就补习一下 Tomcat 启动方式。

基本的准备工作包括：

- JDK， JAVA_HOME
- Tomcat
- Drools 相关工具
- sudo 使用权限

## installation
Make sure you have [Tomcat](/post/2018/12/tomcat-usage.html) installed.

Follow this [link](http://drools.org/download/download.html) to download the drools workbench. And choose the [Tomcat version](https://download.jboss.org/drools/release/7.11.0.Final/) to download.

You will get `kie-drools-wb-7.11.0.Final-tomcat8.war` file. And you can just rename it to `kie-drools-wb.war` .

And copy(deploy) the `.war` to `TOMCAT/webapps` directory. 这个名字决定了在 URL 中的路径，需要注意下。

### dependency jars
Download following related jars and copy them to `TOMCAT/lib`:

- btm-2.1.4.jar
- btm-tomcat55-lifecycle-2.1.4.jar
- h2-1.4.193.jar
- jta-1.1.jar
- slf4j-api-1.7.2.jar
- slf4j-jdk14-1.7.2.jar
- kie-tomcat-integration-7.11.0.Final.jar kie-tomcat-integration
- javax.security.jacc-api-1.6.jar JACC (javax.security.jacc:artifactId=javax.security.jacc-api)

These jars can be found at <https://mvnrepository.com/>

### conf
Firstly, modify the `vim tomcat\conf\tomcat_user.xml` file, and add following between `<tomcat-users></tomcat-users>`. This file control the privilege of tomcat which is used by KIE:

    <role rolename="admin"/>
    <role rolename="analyst"/>
    <role rolename="user"/>
    <role rolename="kie-server"/>
    <role rolename="manager"/>
    <role rolename="manager-gui"/>
    <role rolename="manager-status"/>
    <user username="workbench" password="workbench" roles="admin,kie-server"/>
    <user username="kieserver" password="kieserver" roles="kie-server"/>
    <user username="admin" password="admin" roles="admin,manager-gui,manager-status,manager, user"/>

Note, `analyst` or `admin` roles is required to be authorized to use kie-wb.

Secondly, create `setenv.sh` (or setenv.bat) under `tomcat/bin/`

    TOMCAT_HOME="/opt/tomcat/"
    DATA_PATH="/home/einverne/data/kie-wb"
    CATALINA_OPTS="-Xmx512M  \
                -XX:MaxPermSize=512m  \
                -Dbtm.root=$TOMCAT_HOME \
                -Dbitronix.tm.configuration=$TOMCAT_HOME\conf\btm-config.properties \
                -Djbpm.tsr.jndi.lookup=java:comp/env/TransactionSynchronizationRegistry \
                -Djava.security.auth.login.config=$TOMCAT_HOME\webapps\kie-drools-wb\WEB-INF\classes\login.config \
                -Dorg.jboss.logging.provider=jdk \
                -Dorg.uberfire.nio.git.dir=$DATA_PATH \
                -Dorg.uberfire.nio.git.ssh.cert.dir=$DATA_PATH \
                -Dorg.guvnor.m2repo.dir=$DATA_PATH/repo \
                -Dorg.uberfire.metadata.index.dir=$DATA_PATH"

NOTE: On Debian based systems `$CATALINA_HOME` needs to be replaced with `$CATALINA_BASE`. (`$CATALINA_HOME` defaults to `/usr/share/tomcat8` and `$CATALINA_BASE` defaults to `/var/lib/tomcat8/`)

NOTE: this is an example for unix like systems for Windows `$CATALINA_HOME` needs to be replaced with windows env variable or absolute path

NOTE: java.security.auth.login.config value includes name of the folder in which application is deployed by default it assumes kie-drools-wb so ensure that matches real installation.
login.config file can be externalized as well meaning be placed outside of war file.

还有一个需要注意的是，如果想要在 Drools Workbench 中使用 git clone ssh://admin@localhost:8001/ 这样的工具，有两点需要特别注意，一个就是这个配种中的

    -Djava.security.auth.login.config=$TOMCAT_HOME\webapps\kie-drools-wb\WEB-INF\classes\login.config \

这个 `login.config` 地址一定要配置正确，尤其是 webapps 后面的路径，不同的环境可能配置的路径不一样。第二点就是在上面的角色配置中需要启用一个叫做 user 的角色，并且将自己的用户名配置到 user 角色下。[^login] [^github]

[^login]: <https://groups.google.com/forum/#!topic/drools-setup/pXwQRyg86S8>
[^github]: <https://github.com/kiegroup/kie-wb-distributions/blob/6.2.x/kie-wb/kie-wb-distribution-wars/src/main/assembly/tomcat7/README.txt#L48>

Then add valve configuration into TOMCAT_HOME/conf/server.xml inside Host element as last valve definition:

    <Valve className="org.kie.integration.tomcat.JACCValve" />

Create `btm-config.properties` file under `tomcat/conf` and add this:

    bitronix.tm.serverId=tomcat-btm-node0
    bitronix.tm.journal.disk.logPart1Filename=%{btm.root}%\work\btm1.tlog
    bitronix.tm.journal.disk.logPart2Filename=%{btm.root}%\work\btm2.tlog
    bitronix.tm.resource.configuration=%{btm.root}%\conf\resources.properties

Create `resources.properties` file under `tomcat/conf`:

    resource.ds1.className=bitronix.tm.resource.jdbc.lrc.LrcXADataSource
    resource.ds1.uniqueName=jdbc/jbpm
    resource.ds1.minPoolSize=10
    resource.ds1.maxPoolSize=20
    resource.ds1.driverProperties.driverClassName=org.h2.Driver
    resource.ds1.driverProperties.url=jdbc:h2:mem:jbpm
    resource.ds1.driverProperties.user=sa
    resource.ds1.driverProperties.password=
    resource.ds1.allowLocalTransactions=true

## 打开 KIE
打开 <http://localhost:8080> 端口应该能看到 Tomcat 页面，在 Tomcat 管理 app 页面中 (http://localhost:8080/manager/html) 启动 KIE

在列表中会看到 `kie-wb` 这个项目，初始状态应该是 stop 状态，点击启动，观察 Tomcat 下 logs/catalina.out 应该能够看到启动日志，如果出现错误，需要处理一下。通常情况下可能会出现创建目录失败的问题，手动创建目录并给予写入权限即可。

等待启动后，点击左边的 path 进入应用，使用 Tomcat 中配置的权限登录。


## reference

- <https://tharakatechmind.wordpress.com/2018/02/01/how-to-setup-drool-rule-engine-with-tomcat/>

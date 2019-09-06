---
layout: post
title: "drools workbench"
tagline: ""
description: ""
category: 学习笔记
tags: [drools, rule-engine, ]
last_updated:
---

Drools 是一个 Java 的商业过程实现，这是 Bob McWhirter 所编写的一个开源项目，由 JBoss 和 Red Hat Inc 支持。 Drools 提供一个核心的 Business Rules Engine(BRE) 和一个网页编写规则的管理系统（Drools Workbench）和 一个 Eclipse IDE 的插件，一同构成完整的 Drools 生态。

而这篇文章则主要侧重于 Drools Workbench。


## Workbench


org.guvnor.m2repo.dir



The workbench stores its data, by default in the directory $WORKING_DIRECTORY/.niogit, for example wildfly-8.0.0.Final/bin/.niogit, but it can be overridden with the system property -Dorg.uberfire.nio.git.dir.

Note
In production, make sure to back up the workbench data directory.

18.1.3. System properties
Here's a list of all system properties:

org.uberfire.nio.git.dir: Location of the directory .niogit. Default: working directory

org.uberfire.nio.git.daemon.enabled: Enables/disables git daemon. Default: true

org.uberfire.nio.git.daemon.host: If git daemon enabled, uses this property as local host identifier. Default: localhost

org.uberfire.nio.git.daemon.port: If git daemon enabled, uses this property as port number. Default: 9418

org.uberfire.nio.git.ssh.enabled: Enables/disables ssh daemon. Default: true

org.uberfire.nio.git.ssh.host: If ssh daemon enabled, uses this property as local host identifier. Default: localhost

org.uberfire.nio.git.ssh.port: If ssh daemon enabled, uses this property as port number. Default: 8001

org.uberfire.nio.git.ssh.cert.dir: Location of the directory .security where local certificates will be stored. Default: working directory

org.uberfire.nio.git.ssh.passphrase: Passphrase to access your Operating Systems public keystore when cloning git repositories with scp style URLs; e.g. git@github.com:user/repository.git.

org.uberfire.metadata.index.dir: Place where Lucene .index folder will be stored. Default: working directory

org.uberfire.cluster.id: Name of the helix cluster, for example: kie-cluster

org.uberfire.cluster.zk: Connection string to zookeeper. This is of the form host1:port1,host2:port2,host3:port3, for example: localhost:2188

org.uberfire.cluster.local.id: Unique id of the helix cluster node, note that ':' is replaced with '_', for example: node1_12345

org.uberfire.cluster.vfs.lock: Name of the resource defined on helix cluster, for example: kie-vfs

org.uberfire.cluster.autostart: Delays VFS clustering until the application is fully initialized to avoid conflicts when all cluster members create local clones. Default: false

org.uberfire.sys.repo.monitor.disabled: Disable configuration monitor (do not disable unless you know what you're doing). Default: false

org.uberfire.secure.key: Secret password used by password encryption. Default: org.uberfire.admin

org.uberfire.secure.alg: Crypto algorithm used by password encryption. Default: PBEWithMD5AndDES

org.uberfire.domain: security-domain name used by uberfire. Default: ApplicationRealm

org.guvnor.m2repo.dir: Place where Maven repository folder will be stored. Default: working-directory/repositories/kie

org.guvnor.project.gav.check.disabled: Disable GAV checks. Default: false

org.kie.example.repositories: Folder from where demo repositories will be cloned. The demo repositories need to have been obtained and placed in this folder. Demo repositories can be obtained from the kie-wb-6.2.0-SNAPSHOT-example-repositories.zip artifact. This System Property takes precedence over org.kie.demo and org.kie.example. Default: Not used.

org.kie.demo: Enables external clone of a demo application from GitHub. This System Property takes precedence over org.kie.example. Default: true

org.kie.example: Enables example structure composed by Repository, Organization Unit and Project. Default: false

org.kie.build.disable-project-explorer: Disable automatic build of selected Project in Project Explorer. Default: false

To change one of these system properties in a WildFly or JBoss EAP cluster:

Edit the file $JBOSS_HOME/domain/configuration/host.xml.

Locate the XML elements server that belong to the main-server-group and add a system property, for example:

<system-properties>
  <property name="org.uberfire.nio.git.dir" value="..." boot-time="false"/>
  ...
</system-properties>

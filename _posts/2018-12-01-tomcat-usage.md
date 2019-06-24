---
layout: post
title: "Tomcat 安装及使用"
tagline: ""
description: ""
category: 学习笔记
tags: [tomcat, java-ee, java-web, ]
last_updated:
---

DescriptionApache Tomcat implements several Java EE specifications including Java Servlet, JavaServer Pages, Java EL, and WebSocket, and provides a "pure Java" HTTP web server environment in which Java code can run.

Apache License 2.0

## installation
Firstly, make sure jdk is installed.

Download the latest binary release of Tomcat from the official [site](https://tomcat.apache.org/download-90.cgi)

    wget http://apache.website-solution.net/tomcat/tomcat-8/v8.5.41/bin/apache-tomcat-8.5.41.tar.gz
    sudo tar zxvf apache-tomcat-8.5.41.tar.gz -C /opt/
    sudo ln -s /opt/apache-tomcat-8.5.41 /opt/tomcat

Then, for security purposes, Tomcat should be run as an unprivileged user( not root), so we have to create necessary group and users.

    sudo groupadd tomcat

And create a `tomcat` user. And we make this user a member of `tomcat` group, with a shell of `/bin/false`( so nobody can log into the account ), and with a home directory of `/opt/tomcat` (where we install Tomcat)
    sudo useradd -s /bin/false -g tomcat -d /opt/tomcat tomcat

Now, `tomcat` user is set up.

Give the `tomcat` group ownership over the entire installation directory:

    sudo chgrp -R tomcat /opt/tomcat

And give the `tomcat` group read access to the `conf` directory and all of its contents.

    sudo chmod -R g+r conf
    sudo chmod g+x conf
    sudo chown -R tomcat webapps/ work/ temp/ logs/

Create a systemd Service file

    sudo vim /etc/systemd/system/tomcat.service

And paste this:

    [Unit]
    Description=Apache Tomcat Web Application Container
    After=network.target

    [Service]
    Type=forking

    Environment=JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64/jre
    Environment=CATALINA_PID=/opt/tomcat/temp/tomcat.pid
    Environment=CATALINA_HOME=/opt/tomcat
    Environment=CATALINA_BASE=/opt/tomcat
    Environment='CATALINA_OPTS=-Xms512M -Xmx1024M -server -XX:+UseParallelGC'
    Environment='JAVA_OPTS=-Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom'

    ExecStart=/opt/tomcat/bin/startup.sh
    ExecStop=/opt/tomcat/bin/shutdown.sh

    User=tomcat
    Group=tomcat
    UMask=0007
    RestartSec=10
    Restart=always

    [Install]
    WantedBy=multi-user.target

And **remember to replace your own java home**.

Next, reload the systemd daemon

    sudo systemctl daemon-reload
    sudo systemctl start tomcat
    sudo systemctl status tomcat

How you can visit <http://localhost:8080> to check Tomcat page. Oh if you have ufw installed, don't forget to allow traffic by:

    sudo ufw allow 8080

And finally, if you want to go with Tomcat when start up, you can enable Tomcat automatically starts at boot:

    sudo systemctl enable tomcat


## management
In order to use the manager web app that comes with Tomcat, we must add a login to our Tomcat server.

    sudo vim /opt/tomcat/conf/tomcat-users.xml

and edit:

    <tomcat-users . . .>
      <user username="admin" password="password" roles="manager-gui,admin-gui"/>
    </tomcat-users>

Restart your server

    sudo systemctl restart tomcat

you can get what you want:

    http://localhost:8080/manager/html
    http://localhost:8080/host-manager/html

## questions

### 修改 Tomcat 端口
修改 `conf` 目录下 `server.xml` 文件，修改 http 访问端口，默认为 8080

    <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />

搜索 `Connector port` 修改这里的端口号。

## reference

- <https://www.digitalocean.com/community/tutorials/how-to-install-apache-tomcat-8-on-ubuntu-16-04>

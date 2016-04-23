---
layout: post
title: "should I git ignore .project file under eclipse"
tagline: ""
description: ""
category: 经验总结
tags: [eclipse, C++, CDT, git, gitignore,]
last_updated: 
---

Recently, I have worked on a C++ project create by eclipse using CDT. And I generate my `.gitignore` file at [gitignore.io](https://www.gitignore.io/api/eclipse). However when I shared my project to Git, and want to import my project on other computer. I find I cannot import my Exist project into Eclipe workspace.

After I did search, I notice that my gitignore file just ignore `.project` file which has an annotation says that it's Eclipse Core. I found that each time Eclipse want to import an exist project. Eclipse will try to find this file. The [eclipse documentation](http://help.eclipse.org/indigo/index.jsp?topic=/org.eclipse.platform.doc.isv/reference/misc/project_description_file.html) states the porpuse of `.project` file as follow:

> The purpose of this file is to make the project self-describing, so that a project that is zipped up or released to a server can be correctly recreated in another workspace.

and

> If a new project is created at a location that contains an existing project description file, the contents of that description file will be honoured as the project description. One exception is that the project name in the file will be ignored if it does not match the name of the project being created. If the description file on disk is invalid, the project creation will fail.

So I decide to not ignore `.project` in git version control. And remove the `.project` ignore in `.gitignore` file. After that it is easy for me to import project into Eclipse.

I followed @lanoxx's idea to keep `.project` file under git version control. So after you cloned your repository on other place, you can simply use Import -> Existing Project from Workspace. Eclipse will take care the `.project` file and recreate other project related config files for you, like `.cproject` under C++ project, and `.classpath` or `.settings/` under java environment.

If you do not share the `.project` file, then it is not possible to import the project with Eclipse. You will need to create a new project with the project wizard first, and then you can choose import "General->File System", this will copy all the files into your workspace. This is probably not what you want, because it means that you cannot clone the git repository into the workspace, you must clone it somewhere else and then import it from there. Therefore you should always share the .project file.

About all, I talk about the `.project` file. Following I have done a little search for the `.cproject`. This file contain all the settings provided for the particular selected Toolchain. For example, if the project needs to be created with gcc, then this .cproject file will contain all the compiler, linker options used by gcc. This file is also important to reimport the project. All your settings in project properties will remain if you choose to keep this file under track.


## reference

- <http://stackoverflow.com/a/8368918/1820217>
- <http://stackoverflow.com/questions/2251879/understanding-the-eclipse-cdt-projects>

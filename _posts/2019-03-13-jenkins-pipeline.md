---
layout: post
title: "Jenkins 使用"
tagline: ""
description: ""
category:
tags: [jenkins, ci-cd, program,]
last_updated:
---

这篇文章主要记录一下 Jenkins Pipeline Syntax 的使用。

## Pipeline
Jenkins Pipeline 是什么，简单的来说就是一组定义好的任务，相互连接在一起串行或者并行的来执行，比如非常常见的 build，test，deploy 这样需要重复频繁进行的工作。

更加具体地来说就是 Jenkins 定义了一组非常强大的扩展插件用来支持 CI/CD ，用户可以扩展这些内容来实现自己的内容。这么定义呢？那就是本文的重点，Jenkins 允许用户用一种近似伪代码的形式来编写自己的自定义任务，这个特殊的语法叫做 Pipeline DSL(Domain-Specific Language 特定领域语言）。这一套语法借鉴了 Groovy 的语法特点，有一些些略微的差别。

Jenkins Pipeline 的定义会以文本形式写到 `Jenkinsfile` 文件中。

举例说明：

    pipeline {
      agent any ①
      stages {
          stage('Build') { ②
              steps { ③
                  sh 'make' ④
              }
          }
          stage('Test'){
              steps {
                  sh 'make check'
                  junit 'reports/**/*.xml' ⑤
              }
          }
          stage('Deploy') {
              steps {
                  sh 'make publish'
              }
          }
      }
    }

说明：

1. agent 表示 Jenkins 需要分配一个 executor 和 workspace 给该 pipeline
2. stage 表示 Pipeline 的 stage
3. steps 表示 stage 中需要进行的步骤 单一任务，定义具体让 Jenkins 实现的内容。比如执行一段 shell 脚本
4. sh 执行给定的 shell 命令
5. junit 是由  `plugin:junit[JUnit plugin]` 提供的聚合测试

Pipeline 定义的脚本使用 Groovy 书写，基本的 Pipeline 可以通过如下方式创建：

- 在 Jenkins web UI 中直接填写脚本
- 项目根目录创建 `Jenkinsfile` 文件，并提交到项目版本控制

Jenkinsfile 的使用有如下优势：

- 允许用户通过一个文件来定义所有分支，所有 pull requests 的自动化任务
- 可以 review Pipeline 的代码并进行审计
- 通过文件进行管理可以便捷的进行多人协作

### Pipeline 语法
Jenkins Pipeline 其实有两种语法

- Declarative
- Scripted

Declarative Pipeline, 提供了一种比较易读的方式，这种语法包含了预先定义好的层级结构，用户可以在此基础上进行扩展。但是这种模式也有一定的限制，比如所有声明式管道都必须包含在 pipeline 块中。

Scripted Pipeline 会在 Jenkins master 节点中借助一个轻量的执行器来运行。它使用极少的资源来将定义好的 Pipeline 转换成原子的命令。

Declarative 和 Scripted 方式都很大的差别，需要注意。

### post 语法块

post section 定义了 Pipeline 执行结束后要进行的操作。支持在里面定义很多 Conditions 块：always, changed, failure, success 和 unstable。这些条件块会根据不同的返回结果来执行不同的逻辑。比如常用的 failure 之后进行通知。

- always：不管返回什么状态都会执行，可以在其中定义一些清理环境等等操作
- changed：如果当前管道返回值和上一次已经完成的管道返回值不同时候执行，比如说从失败恢复成功状态
- failure：当前管道返回状态值为”failed”时候执行，在 Web UI 界面上面是红色的标志
- success：当前管道返回状态值为”success”时候执行，在 Web UI 界面上面是绿色的标志
- unstable：当前管道返回状态值为”unstable”时候执行，通常因为测试失败，代码不合法引起的。在 Web UI 界面上面是黄色的标志
- aborted: 当 Pipeline 中止时运行，通常是被手动中止

post 指令可以和 agent 同级，也可以和放在 stage 中。

    // Declarative //
    pipeline {
        agent any
        stages {
            stage('Example') {
                steps {
                    echo 'Hello World'
                }
            }
        }
        post {
            always {
                echo 'I will always say Hello again!'
            }
        }
    }

### Node 块
Jenkins 执行的机器被称作 node，主节点是 master，其他节点 slave。在 Pipeline 文件中可以指定当前任务运行在哪一个节点中。

### stages 块

由一个或者多个 stage 指令组成，stages 块是核心逻辑。对主要部分 Build，Test，Deploy 单独定义 stage 指令。

一个 stage 下至少需要一个 steps，一般也就定义一个就足够了。

### step 块

在 steps 中定义 step。

## Jenkins 中其他指令

### agent
指定整个 pipeline 或某个特定的 stage 的执行环境

- any - 任意一个可用的 agent，那么定义的任务会跑在任意一个可用的 agent 上
- none - 如果放在 pipeline 顶层，那么每一个 stage 都需要定义自己的 agent 指令
- label - 在 jenkins 环境中指定标签的 agent 上面执行，比如 agent { label 'my-defined-label' }
- node - agent { node { label 'labelName' } } 和 label 一样，但是可用定义更多可选项
- docker - 指定在 docker 容器中运行
- dockerfile - 使用源码根目录下面的 Dockerfile 构建容器来运行

### parameters
参数指令，触发这个管道需要用户指定的参数，然后在 step 中通过 params 对象访问这些参数。

    pipeline {
        agent any
        parameters {
            string(name: 'PERSON', defaultValue: 'Mr Jenkins', description: 'Who should I say hello to?')
        }
        stages {
            stage('Example') {
                steps {
                    echo "Hello ${params.PERSON}"
                }
            }
        }
    }


### triggers
触发器指令定义了这个管道何时该执行，一般我们会将管道和 GitHub、GitLab、BitBucket 关联， 然后使用它们的 webhooks 来触发，就不需要这个指令了。如果不适用 webhooks，就可以定义两种 cron 和 pollSCM

- cron - linux 的 cron 格式 `triggers { cron('H 4/* 0 0 1-5') }`
- pollSCM - jenkins 的 poll scm 语法，比如 `triggers { pollSCM('H 4/* 0 0 1-5') }`

    pipeline {
        agent any
        triggers {
            cron('H 4/* 0 0 1-5')
        }
        stages {
            stage('Example') {
                steps {
                    echo 'Hello World'
                }
            }
        }
    }

### stage
stage 指令定义在 stages 块中，里面必须至少包含一个 steps 指令，一个可选的 agent 指令，以及其他 stage 相关指令。

    pipeline {
        agent any
        stages {
            stage('Example') {
                steps {
                    echo 'Hello World'
                }
            }
        }
    }

### tools
定义自动安装并自动放入 PATH 里面的工具集合，工具名称必须预先在 Jenkins 中配置好了 → Global Tool Configuration.

    pipeline {
        agent any
        tools {
            maven 'apache-maven-3.0.1' ①
        }
        stages {
            stage('Example') {
                steps {
                    sh 'mvn --version'
                }
            }
        }
    }

### 内置条件

- branch - 分支匹配才执行 `when { branch 'master' }`
- environment - 环境变量匹配才执行 when { environment name: 'DEPLOY_TO', value: 'production' }
- expression - groovy 表达式为真才执行 expression { return params.DEBUG_BUILD } }

### Pipeline global variables

地址：

- http://jenkins.url/pipeline-syntax/globals
- http://jenkins.url/env-vars.html

## reference

- <https://jenkins.io/doc/book/pipeline/syntax/>
- <https://jenkins.io/doc/book/pipeline/>
- <https://jenkins.io/doc/pipeline/tour/hello-world/>
- <https://jenkins.io/doc/tutorials/build-a-java-app-with-maven/>
- <https://www.guru99.com/jenkins-pipeline-tutorial.html>

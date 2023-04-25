---
layout: post
title: "Terraform 使用笔记"
aliases: 
- "Terraform 使用笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [ terraform,  ]
last_updated:
---

在之前看 Perfect Media Server 的时候看到作者有推荐一本叫做 《Infrastructure as Code》， O'REILLY 出品，作者描述了一个使用文本文件来定义基础设施的框架。在没有了解到这个概念之前我只是简单了解过 [[Ansible]] 这个代码即配置的应用，也就是定义了软件的配置，而 [[Terraform]] 则更像是用纯文本（代码）定义了硬件配置。

这句话让我茅塞顿开：

> Infrastructure as Code

在过去很长的一段时间里面，我都保存我使用的 `docker-compose` 配置文件，这样使得我无论拿到哪一台机器都可以快速的恢复之前的服务，这都依赖于这些年 Docker 的兴起。

<blockquote class="twitter-tweet"><p lang="ca" dir="ltr">Infrastructure as Code - Ansible Terraform <a href="https://t.co/RlqVlXGUCk">https://t.co/RlqVlXGUCk</a></p>&mdash; Ein Verne (@einverne) <a href="https://twitter.com/einverne/status/1451428075133026304?ref_src=twsrc%5Etfw">October 22, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

管理配置文件的方式就和代码开发一样，像 Ansible 和 Terraform 这样的工具可以将对基础设施的配置完全配置化。使用 Terraform 来创建基础设施，而使用 Ansible 来配置。想象一下如果有一台全新的 Ubuntu，可以通过一行配置，在几分钟之内就可以恢复到一个可用的环境，这远比维护很多 bash 脚本来的方便。

## Terraform 是什么

[[Terraform]] 是一个安全有效地构建、更改和版本控制基础设施的工具(基础架构自动化的编排工具)。Terraform 由 HashiCorp 创立并开源，Terraform 提倡「基础架构即代码」的哲学。它的口号是「Write，Plan，and Create Infrastructure as Code」。

Terraform 是一种声明式编码工具，让开发人员通过 HCL（HashiCorp 配置语言）来描述运行应用程序的最终状态环境。

> Terraform is a tool to express the nuts of bolts of infrastructure as code. Think VMs, load balancers, storage, DNS, etc defined as code and stored in versioned source control.

## Terraform 解决了什么问题

在没有 Terraform 之前，运维人员需要手动定位对基础硬件进行管理，在有了 Terraform 之后运维人员也可以通过文本来定义硬件资源的分配，并让 Terraform 去管理资源的分配问题。

Terraform 特点：

- 开源
- 并发，效率高
- HCL 配置预发，使得基础设施的控制可以和代码一样管理，共享和重用
- planning 步骤会生成执行计划，调用时会显示所有操作，避免人为误操作
- 硬件资源分配问题
- 平台无关，可以配合任何云服务提供商
- 不可变基础架构

## Terraform 安装

Ubuntu:

    sudo apt install terraform

Ubuntu 下安装：

    sudo wget https://releases.hashicorp.com/terraform/0.12.18/terraform_0.12.18_linux_amd64.zip
    sudo unzip terraform_0.12.18_linux_amd64.zip
    sudo mv terraform /usr/local/bin/

macOS:

    brew install terraform

安装完成后命令是 `terraform`。常用的是 terraform init, terraform plan, terraform apply

更多安装方式可以参考[官网](https://www.terraform.io/downloads.html)

## Terraform 配置

Terraform 的配置文件以 `.tf` 为后缀，配置文件有两种格式：

- JSON，以 `.tf.json` 结尾
- Terraform，Terraform 格式支持注释，通常更加可读，推荐，以 `.tf` 结尾

配置[文档](https://www.terraform.io/docs/configuration/index.html)

Terraform 配置，将按照字母顺序加载指定目录中的配置文件。

配置举例：

```
provider "aws" {
    region           = "us-east-1"
    access_key  = "your-access-key-here"
    secret_key   = "your-secret-key-here"
}
resource "aws_s3_bucket" "b" {
  bucket = "my-tf-test-bucket"
  acl    = "private"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}
```

`provider` 部分指定了使用什么 provider，通过指定 access_key 和 secret_key 来访问资源。

`aws_s3_bucket` 表示的是配置 S3 Bucket 资源，更多的资源配置方式可以参考[这里](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

如果指定的 `my-tf-test-bucket` 不存在的话，`terraform apply` 会创建。

### terraform init

在执行 `apply` 等命令之前需要先初始化工作目录：

    terraform init

执行后，会在当前目录中生成 `.terraform` 目录，并按照 `*.tf` 文件中的配置下载插件。

### terraform plan

可以使用 `terraform plan` 命令预览执行计划。

### terraform apply

执行 `terraform apply` 会根据配置应用，并生效。

## 工作目录设定

Terraform 执行时会读取所有 `*.tf` 命令

```
provider.tf                -- provider 配置
terraform.tfvars      -- 配置 provider 要用到的变量
varable.tf                  -- 通用变量
resource.tf                -- 资源定义
data.tf                        -- 包文件定义
output.tf                    -- 输出
```

### HCL

Terraform 配置语法称为 HashiCorp 配置语言，简称 HCL。
语法说明可以参考如下：
https://www.terraform.io/docs/configuration/syntax.html

示例：

```
# An AMI
variable "ami" {
  description = "the AMI to use"
}

/* A multi
   line comment. */
resource "aws_instance" "web" {
  ami               = "${var.ami}"
  count             = 2
  source_dest_check = false

  connection {
    user = "root"
  }
}
```

http://hashivim.github.io/vim-terraform/

可以安装 hashivim/vim-terraform 插件，在 Vim 中实现 HCL 语法加亮。写好的 `*.tf` 文件后可以调用 terraform fmt 对配置文件进行格式化。

## 延伸

- [awesome-terraform](https://github.com/shuaibiyy/awesome-terraform)
- [[Terraform]]

---
layout: post
title: "使用 Travis 自动部署静态网站到 GitHub Pages"
tagline: ""
description: ""
category: 经验总结
tags: [github, git, travis, github-pages, jekyll, gitbook]
last_updated: 
---

GitHub Pages 可以用来托管静态网站，而 Jekyll，Gitbook 等等程序都可以生成静态网站，那么如果使用 master 分之托管源码的话， `gh-pages` 分支就可以用来托管静态网站。而使用 Travis 就可以将每一次 master 分支的提交，自动编译静态站点之后提交到 `gh-pages` 分支。

既然要使用到git的推送，那么必然避不了需要验证，Travis 提供很多验证方式，这里有两种：

- Encryption keys 使用加密 TOKEN <https://docs.travis-ci.com/user/encryption-keys/>
- Encrypting Files 加密文件 <https://docs.travis-ci.com/user/encrypting-files/>

## Encryption keys
加密TOKEN，需要使用到 GitHub 提供的 [Personal API tokens](https://blog.github.com/2013-05-16-personal-api-tokens/)，Token 与 帐号密码 以及 SSH Keys 同样具有 Github 写入能力，因此只要使用 Travis CI 提供的加密工具来加密这个 Token 即可。

Travis CI 会使用一对密钥中的 Public Key 来加密提供的 TOKEN，然后得到的 secure token 可以安全地放在 `.travis.yml` 文件中，在 Build 的时候 Travis 会使用 Private Key 来解密这个 Secure Token 获取最初提供的 Github Personal Access Token，并使用该 TOKEN 来进行一系列操作。

操作具体步骤

1. 获取 GitHub Personal access tokens <https://github.com/settings/tokens>， Github 帐号 Settings 页面侧边栏最下面 Developer 中有 Personal access tokens。新建一个 token，只需要选择 repo 相关权限。创建完的 token 只会显示一次，保存好该 token 下面需要使用。
2. 安装 travis 工具，需要提前安装好 Ruby 环境 `gem install travis`
3. 生成 secure token `travis encrypt GH_TOKEN=<token>`

如果使用 `travis encrypt <token> --add deploy.github-token` 可以自动添加到 `.travis.yml` 文件中。

下面以 Gitbook 使用 Travis 自动编译部署到 GitHub Pages 为例，这里使用到了 Travis 的发布到 GitHub Pages 的[功能](https://docs.travis-ci.com/user/deployment/pages/)。

```
language: node_js

node_js:
  - "8"

before_install:
  - export TZ='Asia/Shanghai' # 更改时区

# 依赖安装
install:
  - npm install gitbook-cli -g
  # 安装 gitbook 插件
  - gitbook install

# 构建脚本
script:
    # 自定义输出目录 gitbook build src dest
    # 默认会输出到 _book 目录下
  - gitbook build . 

# 分支白名单
branches:
  only:
    - master # 只对 master 分支进行构建

# GitHub Pages 部署
deploy:
  provider: pages
  skip_cleanup: true
  github_token: 
    secure: <secure token>
  # 将下面的目录中内容推送到 gh-pages 分支
  local_dir: build
  fqdn: $CUSTOM_DOMAIN
  name: $GIT_NAME
  email: $GIT_EMAIL
  on:
    branch: master
```

大概原理就是如此，记住 `skip_cleanup: true` 这个一定要写上，否则 Travis 在 build 的时候会自动清理掉 repo 中编译生成的内容。



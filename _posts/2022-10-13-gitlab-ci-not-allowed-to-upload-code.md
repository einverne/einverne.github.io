---
layout: post
title: "GitLab CI 提交代码 not allowe to upload code 问题解决"
aliases:
- "GitLab CI 提交代码 not allowe to upload code 问题解决"
tagline: ""
description: ""
category: 经验总结
tags: [ gitlab, git, git-push, gitlab-ci, ]
create_time: 2022-10-14 14:08:01
last_updated: 2022-10-14 14:08:01
---

记录一下在 GitLab CI 中提交代码出现的错误。

在 CI 中 `git push` 提交代码，遇到如下的错误：

```
remote: You are not allowed to upload code.
fatal: unable to access 'https://gitlab-ci-token:[MASKED]@git.xxx.com/group/repo.git/': The requested URL returned error: 403
```

看起来是 403 权限不足，但是可以看到的是提交代码的时候，使用的 remote 地址是 `https://gitlab-ci-token` 开头的。这是因为 GitLab CI runner 在 HTTPS 协议下执行时，不支持 `git push` 操作。

必须配置使用 `ssh` 协议，然后需要使用 `/root/.ssh` 目录中配置的私钥，该私钥需要有代码访问权限。

## 解决方案

首先需要将 SSH KEY 配置到 GitLab 后台，然后将私钥放到 CI 的镜像中。

```
mkdir -p ~/.ssh
cp "${CI_GIT_SSH_KEY}" ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-keyscan gitlab.com > ~/.ssh/known_hosts
```

在 CI 脚本中将仓库的地址修改为 SSH：

```
git remote rm origin && git remote add origin git@gitlab.com:$CI_PROJECT_PATH.git
```

然后再使用 `git push` 就没有问题了。

## reference

- <https://stackoverflow.com/a/54487966/1820217>

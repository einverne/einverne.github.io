---
layout: post
title: "使用 GitHub Actions 构建 Docker 镜像并上传到 GitHub Packages"
aliases:
- "使用 GitHub Actions 构建 Docker 镜像并上传到 GitHub Packages"
tagline: ""
description: ""
category: 经验总结
tags: [github, github-actions, github-packages, docker, docker-image, docker-build, docker-compose]
create_time: 2025-04-30 23:04:32
last_updated: 2025-04-30 23:04:32
dg-home: false
dg-publish: false
---

本文介绍一下如何使用 GitHub Actions 构建 Docker 镜像，并上传到 [GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages)。

## GitHub Actions

GitHub Actions 是 GitHub 官方提供的一项自动化平台服务，主要用于自动化软件开发流程中的各类任务，尤其适合实现 CI/CD（持续集成与持续交付）。

详情可参考[这一篇](https://blog.einverne.info/post/2020/04/github-actions-usage.html)

## GitHub Packages

GitHub Packages 是 GitHub 提供的一项软件包托管与管理服务，支持开发者将各种类型的软件包（如依赖库、容器镜像等）与源代码一同集中管理。通过这一平台，开发者可以在 GitHub 上安全地发布、安装和管理自己的包，无论是公开还是私有项目都能适用。

支持多种主流包管理器，包括 npm、Maven、NuGet、Docker、RubyGems、Gradle 等。

GitHub Packages 对于开源项目完全免费，对私有仓库也有[免费额度](https://github.com/features/packages#pricing)。

## 手动上传镜像

基础用法和 Docker Hub 一样，但是域名为 `ghcr.io`。

- 创建一个 Personal Access Token， <https://github.com/settings/tokens/new?scopes=write:packages>
- 勾选 `write:packages` 权限

如果是在 GitHub Actions 中访问 GitHub Packages，可以使用 GITHUB_TOKEN 。

一旦获取了 Token 就可以来使用登录访问镜像仓库。

```
export CR_PAT=YOUR_TOKEN
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
```

然后可以根据如下的命令来推送镜像。

```
docker build -t your-tag .
docker tag hello:latest ghcr.io/einverne/hello:latest
docker push ghcr.io/einverne/hello:latest
```

然后就可以在 GitHub 页面上看到。

## 自动构建并上传镜像

上面提到过 GitHub Actions 是 GitHub 推出的 CICD，既然都已经使用 GitHub Packages，那么直接使用 Actions 更方便。

```
name: Build Docker Image

# 当 push 到 master 分支，或者创建以 v 开头的 tag 时触发，可根据需求修改
on:
  push:
    branches:
      - master
    tags:
      - v*

env:
  REGISTRY: ghcr.io
  IMAGE: einverne/hello

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    # 这里用于定义 GITHUB_TOKEN 的权限
    permissions:
      packages: write
      contents: read

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      # 缓存 Docker 镜像以加速构建
      - name: Cache Docker layers
        uses: actions/cache@v2
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-buildx-

      # 配置 QEMU 和 buildx 用于多架构镜像的构建
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v1

      - name: Set up Docker Buildx
        id: buildx
        uses: docker/setup-buildx-action@v1

      - name: Inspect builder
        run: |
          echo "Name:      ${{ steps.buildx.outputs.name }}"
          echo "Endpoint:  ${{ steps.buildx.outputs.endpoint }}"
          echo "Status:    ${{ steps.buildx.outputs.status }}"
          echo "Flags:     ${{ steps.buildx.outputs.flags }}"
          echo "Platforms: ${{ steps.buildx.outputs.platforms }}"

      # 登录到 GitHub Packages 容器仓库
      # secrets.GITHUB_TOKEN 不需要手动添加，直接就可以用
      - name: Log in to the Container registry
        uses: docker/login-action@v1
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # 根据输入自动生成 tag 和 label 等数据，说明见下
      - name: Extract metadata for Docker
        id: meta
        uses: docker/metadata-action@v3
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE }}

      # 构建并上传
      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          context: .
          file: ./Dockerfile
          target: production
          builder: ${{ steps.buildx.outputs.name }}
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=local,src=/tmp/.buildx-cache
          cache-to: type=local,dest=/tmp/.buildx-cache

      - name: Inspect image
        run: |
          docker buildx imagetools inspect \
          ${{ env.REGISTRY }}/${{ env.IMAGE }}:${{ steps.meta.outputs.version }}
```

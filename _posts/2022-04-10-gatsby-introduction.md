---
layout: post
title: "Gatsby 静态站点使用入门"
aliases:
- "Gatsby 静态站点使用入门"
tagline: ""
description: ""
category: 学习笔记
tags: [ gatsby, react, graphql, seo, static-website, cms, markdown, webpack ]
create_time: 2022-07-19 16:28:46
last_updated: 2022-07-19 16:28:46
---

Gatsby 是一个基于 React 的、免费开源的、用于搭建静态站点的框架。Gatsby 虽然是一个静态站点框架，但其数据却可以从任何地方获取之后渲染。
Gatsby 是基于 React 和 GraphQL. 结合了 webpack, babel, react-router 等前端领域中最先进的工具. 对开发人员来说开发体验非常好。

Gatsby 采用数据层和 UI 层分离的现代前端开发模式。静态 HTML 访问快，对 SEO 非常友好。

数据来源多样化: Headless CMS, markdown, API 等多种方式获取数据。

之前学习的时候建的[券商推荐网站](https://broker.einverne.info/) 就是使用 Gatsby 搭建。

## 为什么使用 Gatsby

- 充分享受现代 Web 开发工具带来的便捷，GraphQL，React，Webpack
- 数据与界面的分离

## Gatsby 项目结构

- `/src/pages` 目录下的组件会被生成同名页面
- `/src/templates` 目录下放渲染数据的模板组件，如渲染 Markdown 文章，在其它博客系统中一般叫 layout。
- `/src/components` 公共可复用的组件
- `/static` 静态资源， webpack 会跳过
- `gatsby-config.js` 配置
    - siteMetadata 全局配置
    - plugins 插件配置
- `gatsby-node.js` 可以调用 [Gatsby node APIs](https://www.gatsbyjs.org/docs/node-apis/)
    - 添加额外的配置
- `gatsby-browser.js` 调用 Gatsby 浏览器 API

## GraphQL
作为 Gatsby 在本地管理资源的一种方式，作为一个数据库查询语言，它有非常完备的查询语句。

在 `src/pages` 下的页面可以直接 `export` GraphQL 查询，在其它页面需要用 [StaticQuery](https://www.gatsbyjs.org/docs/static-query/) 组件或者 [useStaticQuery](https://www.gatsbyjs.org/docs/use-static-query/) hook。

在开发时默认的查询地址： http://localhost:8000

## Installation

Gatsby 命令行：

    npm install -g gatsby-cli

新建项目：

    gatsby new gatsby-start

gatsby 默认会使用 gatsby-starter-default 来新建项目，你可以在后面加上其他 starter 的 GitHub 地址，来使用这个 starter 初始化项目。比如说：

    gatsby new gatsby-start https://github.com/gatsbyjs/gatsby-starter-hello-world

启动项目：

    cd gatsby-start
    gatsby develop
    # 或者
    yarn develop

打开 localhost:8080 查看生成页面，可以打开 <http://localhost:8000/__graphiql> GraphiQL 调试界面。

几个常用的命令：

- gastby develop：开启热加载开发环境
- gastby build：打包到 public 下，构建生产环境用的优化过的静态网站所需的一切静态资源、静态页面与 js 代码
- gatsby serve：在打包之后，启动一个本地的服务，供你测试刚才"gatsby build"生成的静态网页

在 `src/pages/`` 目录下，新建一个 JS 文件即可。在 src/pages/ 目录下的页面，Gatsby 会自动添加路由，生成页面。

新建 about.js

```
import React from 'react'

export default () => (
  <div>
    <h1>About</h1>
    <p>location: </p>
  </div>
)
```

访问 http://localhost:8000/about 即可查看。

## Plugins
在 Gatsby 中有三种类型的插件: 分别为数据源插件 ( source ), 数据转换插件 ( transformer ), 功能插件 ( plugin )

- 数据源插件负责从应用外部获取数据，将数据统一放在 Gatsby 的数据层中。
- 数据转换插件负责转换特定类型的数据的格式，比如我们可以将 markdown 文件中的内容转换为对象形式。
- 功能插件是为应用提供功能，比如通过插件让应用支持 Less 或者 TypeScript。

插件的命名是有规范的，数据源插件名称中必须包含 source，数据转换插件必须包含 transformer，功能插件名称必须包含 plugin。

所有插件的地址：<https://www.gatsbyjs.org/plugins/>

### 插件的使用

- 首先需要下载插件，npm install
- 在根目录的 gatsby-config.js 文件中配置插件，在 plugins 属性中添加我们的插件。

plugins 是一个数组，每一项都是一个插件，他支持字符串和对象两种类型，如果需要配置插件参数就是用对象，resolve 指明要配置什么插件，options 就是配置选项，name 表示资源类别，这个是自定义的这里写 json，path 是数据源文件路径。

```
modules.exports = {
    plugins: [
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "json",
                path: `${__dirname}/data.json`
            }
        },
        "gatsby-transformer-json"
    ]
}
```

gatsby-source-filesystem 他是用于将本地文件信息添加至数据层当中

第二个是 gatsby-plugin-sharp:他是用于提供本地图像的处理功能(调整图像尺寸, 压缩图像体积 等等)
第三个是 gatsby-transformer-sharp 是将 gatsby-plugin-sharp 插件处理后的图像信息添加到数据层。

最后我们要用到 gatsby-image，这是一个 React 组件, 优化图像显示, 他是基于 gatsby-transformer-sharp 插件转化后的数据。

### gatsby-plugin-image

安装：

    npm install gatsby-plugin-image gatsby-plugin-sharp gatsby-source-filesystem

- gatsby-plugin-sharp 处理图片
- gatsby-source-filesystem，从文件系统加载图片

通过 YAML 加载数据

- <https://www.gatsbyjs.com/docs/how-to/sourcing-data/sourcing-from-json-or-yaml/>

- The `StaticImage` component is for _static_ image sources, like a hard-coded file path or remote URL. In other words, the source for your image is always going to be the same every time the component renders.
- The `GatsbyImage` component is for _dynamic_ image sources, like if the image source gets passed in as a prop.

https://www.gatsbyjs.com/docs/tutorial/part-7/#whats-the-difference-between-gatsbyimage-and-staticimage

https://www.gingerdoc.com/tutorials/how-to-handle-images-with-graphql-and-the-gatsby-image-api

https://www.labnol.org/code/gatsby-images-200607

## Netlify

[[2018-03-24-netlify-to-host-static-website]]

## reference
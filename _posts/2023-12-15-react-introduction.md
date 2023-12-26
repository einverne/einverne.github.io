---
layout: post
title: "React 学习笔记之了解 React"
aliases:
- "React 学习笔记之了解 React"
tagline: ""
description: ""
category: 学习笔记
tags: [react, javascript, typescript]
create_time: 2023-12-21 09:42:54
last_updated: 2023-12-21 09:42:54
---

这一期的 21 天计划中，我将了解和学习 React 并使用 React 制作一个简单的网站列入了计划，和之前学习了解 [[Lavarvel]] 一样，我在笔记里面制作了一个短期的学习计划，并看了一些官网的教程和书籍的目录，制定了几大块的知识点。这是这个系列的第一篇文章。

## React 是什么

[[React]] 是一个用来构建用户界面的 JavaScript 库，用于构建 UI 界面，起源于 Facebook 的内部项目，用来构建 Instagram 的网站，于 2013 年 5 月开源。React 拥有较好的性能，代码逻辑简单，现在已经有很多项目使用 React 来实现，并且占据了当前前端开发的市场，另外一大山脉 [[Vue]] 等有时间再看看吧。

## 学习 React 的目的

和之前 [[Laravel]] 一样，主要的目的是为了可以快速实现一些小的想法，之前有很多想法都停留在 Todo-List 里面，如果有一个顺手的工具，就可以快速实现。另外一个目的就是为了看懂现在的开源代码，以及一些感兴趣的项目。初步的目的只是为了能看懂，并且能在此基础上做一些小的改动吧。

为什么要学 React

- 为了看懂一些开源代码
- 用来快速实现一些小想法，验证想法

## React 的优势是什么

- 声明式设计，React 的状态和行为是通过声明的方式来定义的，React 负责将其渲染到 UI 上。
  - 声明式的设计提升了可读性，可维护性
- 组件，复用代码，React 使用组件来构建 UI，而组件是独立，可重用的代码块，用于渲染 UI 元素
- 高效，模拟 DOM，最大限度减少直接和 DOM 交互，提升了 UI 渲染速度
- 灵活，可以于已知的库配合
- JSX 扩展语法
- 单向响应数据流，可维护，更容易理解

## React 是如何工作的？

React 会在内存中创建 Virtual DOM，React 会首先将修改应用到内存的 Virtual DOM 中，然后再将修改反应到浏览器的 DOM 中。React 只会去渲染需要修改的内容。

## React 基本概念

每一次学习新的东西，最开始就是要了解概念，React 中有一些非常核心的概念，这里先列举一下，之后还会展开。

- JSX，JSX 是 JavaScript 的扩展集，可以让开发者在 JavaScript 中直接编辑 HTML 代码
- 组件，React 程序的基本组成单位，独立，可复用，用于渲染 UI
  - 组件的生命周期，组件在其生命周期中不同阶段调用的函数
- props，从父组件传递给子组件的数据，可以是任何类型的数据
- 状态（State），组件的内部状态，控制组件的行为

### 理解基于组件的结构

下面的方法定义了一个最基本的组件，包括了一个叫 name 的状态。

```
function MyComponent() {
  const [name, setName] = useState("John Doe");

  return (
    <div>
      <h1>Hello, {name}</h1>
      <button onClick={() => setName("Jane")}>Click here to set name</button>
    </div>
  );
}
```

## 设置开发环境

### Node.js

因为我使用 asdf ，所以直接安装 Node.js 即可。

```
asdf install nodejs 20.10.0
```

### TypeScript

TypeScript 是一种向 JavaScript 代码添加类型定义的常用方法。TypeScript 天然支持 JSX——只需在项目中添加 [`@types/react`](https://www.npmjs.com/package/@types/react) 和 [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) 即可获得完整的 React Web 支持。

### 安装 React

要使用 React，首先需要 npm 和 Node.js 环境。

通过 npm 安装， 使用 `create-react-app` 构建一个 React 开发环境，这个环境包括了常用的工具比如 [[Webpack]]，ESLint 等。

```
npx create-react-app my-react-app
```

运行代码

```
npm start
```

## JSX 语法

[JSX](https://legacy.reactjs.org/docs/introducing-jsx.html) 是一种 JavaScript 语法扩展，用于将 HTML、JavaScript 和 CSS 代码混合在一起。JSX 使 React 开发人员能够以更简洁的方式编写代码。

JSX 语法简化了 React 的开发，在编译时会自动转化为 JavaScript 代码，并编译成输出 HTML。

可以来看一个简单的例子

```
const MyComponent = () => {
  return (
    <div>
      <h1>Hello, world!</h1>
      <button onClick={() => console.log("Hello, world!")}>Click me</button>
    </div>
  );
};
```

### 6 条 JSX 原则

- 永远只 return 一个根元素

```
return (
  <div>
    <h1>Hello World!</h1>
    <p>This is my first React component.</p>
  </div>
)
```

- 使用 `className` 而不是 `class`

```
<div className="my-class">This element has a CSS class.</div>
```

- 使用花括号(Curly Braces) 来使用 JavaScript

```
<div>{myVariable}</div>
```

- 使用 camelCase

```
<button onClick={handleClick} className="btn">Click me!</button>
```

- 永远要记得关闭

```
<div></div>
```

- 空元素，使用 Self-Closing 标签关闭

```
<img src="my-image.jpg" alt="My Image"/>

```

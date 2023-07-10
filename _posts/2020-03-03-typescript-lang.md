---
layout: post
title: "TypeScript 初识"
aliases:
- "TypeScript 初识"
tagline: ""
description: ""
category: 学习笔记
tags: [typescript, javascript, web, frontend, ]
last_updated:
---

最近浏览 GitHub 发现一个有趣的[项目 PT Plugin Plus](https://github.com/ronggang/PT-Plugin-Plus/) 代码拉下来发现是 ts 语言写的，就顺便了解一下。[^ts] 目标很简单，不是为了写 ts 项目，只是为了能看懂项目。

## ts in 5 minutes

### 强类型

在 JavaScript 中，变量是没有类型的，只有运行时赋值了才决定变量的类型（这就是所谓的动态语言），但是 TypeScript 在方法定义的时候可以给参数加上类型校验：

```
function greeter(person: string) {
    return "Hello, " + person;
}
```

一旦变量类型不匹配，在编译时就会报错。

### Interfaces

TypeScript 使用 interface 来定义对象

```
	interface Person {
		firstName: string;
		lastName: string;
	}
```

### Classes

ts 支持基于类的面向对象编程，classes 和 interfaces 可以协同工作，

```
class Student {
    fullName: string;
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

document.body.textContent = greeter(user);
```

## handbook

[TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html)

### 类型

ts 支持 JavaScript 的类型，number, string, structure, boolean 等等，不过 ts 增加了枚举类型。

#### Boolean

    let isDone: boolean = false;

#### Number

    let decimal: number = 6;
    let hex: number = 0xf00d;
    let binary: number = 0b1010;
    let octal: number = 0o744;

#### String

文本是任何一门语言都避免不了的，和 js 一样可以使用双引号和单引号。

    let color: string = "blue";
    color = 'red';

也可以使用 template strings, 使用反引号 (\`) 来框住长文本。

#### Array

直接声明：

    let list: number[] = [1, 2, 3];

或者使用 Array:

    let list: Array<number> = [1, 2, 3];

#### Tuple

元组，用来表达固定长度数组，其他元素不一定类型相同。

定义：

    let x: [string, number];

初始化：

    x = ["abc", 123];

#### Enum

枚举类型是 ts 新增加的，用来扩展 number 表达的含义。

    enum Color {RED, GREEN, BLUE}
    let c: Color = Color.RED;

枚举类型默认从 0 开始，可以手动指定。

    enum Color { RED=1, GREEN, BLUE}
    enum Color { RED=1, GREEN=2, BLUE=4}

#### Any

`any` 类型可以使得开发者可以自行选择使用类型检查，或者不使用。

    let notSure: any = 4;
    notSure = "maybe a string instead";
    notSure = false; // okay, definitely a boolean

#### Void

`void` 像是 `any` 类型的反面，`void` 经常被用来作为方法的 void 返回。

#### Null and Undefined

在 ts 中，undefined 和 null 都有各自的类型，和 void 一样，null 和 undefined 一般都不自己使用。默认 null 和 undefined 是其他类型的子类型，这意味着可以将 null 和 undefined 赋值给 number.

#### Never

`never` 类型表示类型的值永远不会发生。

#### Object

非原始类型，不是 number, string, boolean, bigint, symbol, null 或者 undefined.

#### Type assertions

尖括号语法：

    let someValue: any = "this is a string";
    let strLength: number = (<string>someValue).length;

as 语法：

    let someValue: any = "this is a string";
    let strLength: number = (someValue as string).length;

## TypeScript 的关键字

### let vs var

在 TypeScript 中，`var` 和 `let` 是用于声明变量的关键字，它们有一些重要的区别。

1. 作用域：使用 `var` 声明的变量具有函数作用域，而使用 `let` 声明的变量具有块级作用域。换句话说，`var` 变量在整个函数内都是可见的，而 `let` 变量只在声明的块（例如，if 语句块、for 循环块）内可见。
2. 变量提升：使用 `var` 声明的变量存在变量提升的特性，即变量可以在声明之前被访问。而 `let` 声明的变量没有变量提升，必须在声明之后才能访问。
3. 重复声明：使用 `var` 可以重复声明同一个变量，而使用 `let` 在同一个作用域内重复声明同一个变量会导致编译错误。
4. 全局作用域：在全局作用域中使用 `var` 声明的变量会成为全局对象（`window` 或 `global`）的属性，而使用 `let` 声明的变量不会成为全局对象的属性。

推荐在 TypeScript 中使用 `let` 来声明变量，因为它具有更严格的作用域规则，避免了一些潜在的问题。`var` 主要用于与旧版 JavaScript 代码的兼容性或特定的使用场景。

### const

在 TypeScript 中，`const` 是用于声明常量的关键字。使用 `const` 声明的变量必须初始化，并且不能再被重新赋值。

使用 `const` 声明的常量具有以下特点：

1. 值不能被修改：一旦使用 `const` 声明了一个变量并赋予初始值，就不能再对其进行重新赋值。尝试重新赋值会导致编译错误。
2. 块级作用域：与 `let` 类似，`const` 也具有块级作用域。它在声明的块（例如，if 语句块、for 循环块）内有效。
3. 对象属性和数组元素：使用 `const` 声明的常量可以是对象的属性或数组的元素。虽然不能对整个对象或数组进行重新赋值，但可以修改对象的属性或数组的元素。

```typescript
const person = {
 name: "John",
 age: 25
};
person.age = 26; // 可以修改对象的属性
const numbers = [1, 2, 3];
numbers.push(4); // 可以修改数组的元素
```

使用 `const` 可以提高代码的可读性和可维护性，并且在编译时会进行常量折叠，有助于优化代码执行效率。建议在需要声明不可变的常量时使用 `const`。

## reference

- <https://www.typescriptlang.org/docs/handbook/basic-types.html>

[^ts]: <https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html>

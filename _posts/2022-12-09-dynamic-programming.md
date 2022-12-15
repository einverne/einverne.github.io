---
layout: post
title: "动态规划问题梳理"
aliases:
- "动态规划问题梳理"
tagline: ""
description: ""
category: 学习笔记
tags: [dp, dynamic-programming, algorithm, computer-science, ]
create_time: 2022-12-09 17:09:27
last_updated: 2022-12-09 17:09:27
---

很久以来一直没有好好地梳理一下 Dynamic Programming 的问题，虽然 DP （动态规划）的问题一直出现，但每次遇到总是会卡壳一下。既然前人已经将这一类问题总结成一个专有名词了，那就证明这一类的问题已经可以用一套现成的模式来解决，这篇文章就整理一下 DP 问题的常见模式。下面的部分内容是看了 MIT Dynamic Programming 的公开课之后总结得出，教授用一个 Fibonacci 的问题，自顶向下，自底向上，去系统的讲了什么是 DP。 DP 就是递归问题再加上把求解的子问题结果存储「记忆」。这个教授将什么是 DP 问题一下子就解释清楚了。

动态规划是一种分阶段求解问题的思想。用简单的话归纳**动态规划**就是 **递推+记忆**。通过子问题递推出原始问题，通过额外的空间来存储子问题解。

> Simplifying a complicated problem by breaking it down into simpler sub-problems ( in a recursive manner)

类似递归问题，没有本质区别，但是动态规划的区别在于，只需要存最优的状态，推导出全局最优。

DP 算法最初由 Richard Bellman 发明。DP 就是 recursion（递归） + memorization (子问题结果记忆)

DP 问题如果从子问题开始往上推导，那么就可以将递归的写法变成循环的写法。这也就是为什么在讲斐波那契数列的递推的时候，通常会有两种写法。如果已经求解了子问题，那么从下往上递推，就可以使用循环（而非递归）来求解问题了。

## Fibonacci
先来看看最经典的 Fibonacci 数列的求解方法。

如果使用递归，指数级复杂度 O(2^n)。

```
public int fib(int n) {
    if (n == 0 || n == 1) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}
```

但是如果引入一个数组来存储以及计算过的结果，可以进一步降低时间复杂度，从指数级降到 O(n) 的复杂度。

更进一步可以将空间复杂度也从 O(n) 降到 O(1)

```
    public int fib(int n) {
        if (n == 0 || n == 1) return n;
        int[] dp = new int[2];
        dp[0] = 0;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            int temp = dp[0] + dp[1];
            dp[0] = dp[1];
            dp[1] = temp;
        }
        return dp[1];
    }
```

如果我们在脑海里模拟 Fib(n) 的原始求解步骤，自顶向下会发现是一棵向下的二叉树，求解 Fib(n) 首先要求解 Fib(n-1) 和  Fib(n-2)，而与此同时又需要进一步求解 Fib(n-2), Fib(n-3) .......等等，并且向下求解的过程中我们会发现很多重复的计算过程。这个时候就需要看到 DP 问题的第二个特征，memorization（子问题的记忆化）。如果能够将子问题的结果保存下来，那就可以避免很多的重复计算过程。

## Climbing Stairs
再来看一个相似的简单爬楼梯问题，假设有一个  n 阶的楼梯，每次可以爬 1 阶或 2 阶，问有几种方式可以爬到顶。

同样如果 n 是 2，那么可以是 1+1，或者 2。如果是 n 是 3，那就可以是在 n = 2 的时候往上爬 1 阶，加上 n = 1 的时候往上爬 2 阶。

## Count the paths

再来看看延伸一些的问题，如果在一个 m * n 的棋盘上从左上角走到右下角，每次只能走右或下，请问有多少种走法。

将原始的问题拆分为子问题：

![count path solution](https://photo.einverne.info/images/2022/12/15/ZKMr.png)

编写伪代码：

```
int countPaths(boolean[][] grid, int row, int col) {
    if(!validSquare[grid, row, col]) return 0;
    if(isAtEnd(grid, row, col)) return 1;
    return countPaths(grid, row+1, col) + countPaths(grid, row, col+1);
}
```

状态转移方程：

```
opt[i, j] = opt[i+1, j] + opt[i, j+1];

if a[i,j] is 空地:
    opt[i,j] = opt[i+1, j]+opt[i,j+1]
else:
    opt[i,j] = 0
```

## 解决动态规划问题的一般思路
5 个步骤：

- define subproblems  定义子问题，分治思想
- guess (part of solution)   递推方程
- relate subproblem solutions  子问题的解合并
- recursive & memoize or build DP table bottom-up  递归和记忆，DP 状态表（存储中间状态），自底向上递推
- 解决原始问题

如果要去学习和理解 DP 问题就必须打破原有的思维习惯，去理解机器思维，因为机器只能执行 if, while, for，条件，循环，递归等等。也必须要去锻炼拆分复杂问题的能力。

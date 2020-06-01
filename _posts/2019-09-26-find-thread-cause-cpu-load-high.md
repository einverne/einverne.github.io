---
layout: post
title: "排查导致 CPU load 过高的 Java 线程"
tagline: ""
description: ""
category: 学习笔记
tags: [java, linux, top, cpu, load, ]
last_updated:
---


When you encouter the high cpu load caused by java application, you may follow these steps to troubleshooting.

## identify the PID

identify the PID, use `top` or `htop` then press `P`, sorted by CPU

## identify the thread
identify the thread using `top -n 1 -H -p PID`, this command will give an output listing all the threads in the selected process

like this:

	KiB Mem : 16342620 total,   270500 free, 12773428 used,  3298692 buff/cache
	KiB Swap:  7812092 total,  2654116 free,  5157976 used.  1999284 avail Mem

	PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND
	28958 einverne  20   0 8824828 3.021g  23784 S  30.0 19.4   0:00.00 java
	28959 einverne  20   0 8824828 3.021g  23784 S  0.0 19.4   0:00.56 java
	28960 einverne  20   0 8824828 3.021g  23784 S  0.0 19.4   0:10.35 GC Thread#0
	28961 einverne  20   0 8824828 3.021g  23784 S  0.0 19.4   0:00.06 G1 Main Marker
	28962 einverne  20   0 8824828 3.021g  23784 S  0.0 19.4   0:07.24 G1 Conc#0
	28963 einverne  20   0 8824828 3.021g  23784 S  0.0 19.4   0:00.42 G1 Refine#0

Here for example, PID 28958 use 30% of CPU.

## jstack

Then use `jstack` to show the stack trace for the PID

	jstack PID > jstack.out

## Convert thread ID to Hexadecimal value
Use the above result as example, thread id 28958 is the problem thread. Then convert it to hex value.
	28958 -> 711e

Here I provide an easy way to convert decimal to hexadecimal under bash:

	printf '%x\n' 28958
	# or
	echo "obase=16; 28958" | bc

Search the stack trace output for the hex value using the tools you're familiar with, `grep`, `less` etc.

	less jstack.out

Then you will found the thread details.

## reference

- <https://backstage.forgerock.com/knowledge/kb/article/a39551500>
- <https://stackoverflow.com/a/379422/1820217>

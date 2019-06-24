---
layout: post
title: "Intellij IDEA 中删除所有未使用的类"
tagline: ""
description: ""
category:
tags: [intellij, ]
last_updated:
---

修改设置

- Press Ctrl+Shift+A
- Enter "unused declar"
- Double-click on "Unused declaration"
- Settings will pop up

设置

- Click on Java/Declaration redundancy/Unused declaration
- on the right bottom select "On the fly editor settings"
- untick check fields, ..., check parameters. Only Check Classes should be ticked.
- Press OK

Settings closes

- On the menu bar, click on Analyze / Run Inspection by Name (or Ctrl+Alt+Shift+I)
- Insert text "Unused decla"
- Select "Unused declaration Java|Declaration redundancy"
- Search starts

Check the job state on bottom of Idea, when finished: enjoy the results and the great feeling of cleaning up the messed code. :)

## reference

- <https://stackoverflow.com/a/38244028/1820217>

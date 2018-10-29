---
layout: page
title: "Friends"
description: "这些是一些友链"
group: navigation
---

<h2 id="friends" itemprop="about">友链</h2>

如今写博客的人已经不多，能够交到一个朋友已经不太容易，珍惜现在的拥有。<br/>

<ul>
{% for friend in site.data.friends %}
  <li>
    <a href="{{ friend.url }}">
      {{ friend.name }}
    </a>
  </li>
{% endfor %}
</ul>

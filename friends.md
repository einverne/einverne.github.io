---
layout: page
title: "Friends"
description: "这些是一些友链"
group: navigation
permalink: /friends.html
---

<h2 id="friends" itemprop="about">友链</h2>

如今写博客的人已经不多，能够交到一个朋友已经不太容易，珍惜现在的拥有。如果你也在坚持写博客，并且坚持公布到互联网上，而不是发布到**局域网**中，欢迎[联系我](about) 交换链接。<br/>

<ul>
{% for friend in site.data.friends %}
  <li>
    <a href="{{ friend.url }}">
      {{ friend.name }}
    </a>
    {% if friend.desc != '' %}
	  <small>{{ friend.desc }}</small>
	{% endif %}
  </li>
{% endfor %}
</ul>


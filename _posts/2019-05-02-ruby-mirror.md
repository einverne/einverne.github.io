---
layout: post
title: "Ruby 国内镜像"
tagline: ""
description: ""
category: 经验总结
tags: [ruby, source, bundler, jekyll, ]
last_updated:
---

Update ruby

	gem update --system
	gem -v
	gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/
	gem sources -l

确保只有 gems.ruby-china.com

Bundler

	bundle config mirror.https://rubygems.org https://gems.ruby-china.com
	bundle install

## reference

- <https://gems.ruby-china.com/>

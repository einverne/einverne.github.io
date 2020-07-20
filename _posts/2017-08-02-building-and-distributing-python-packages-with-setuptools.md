---
layout: post
title: "使用 setuptools 创建并发布 python 包"
tagline: ""
description: ""
category: 学习笔记
tags: [python, linux, packages, module, ]
last_updated:
---

If you write something, and you want to share with the world. And let others use through `pip install`, you can upload your package to pypi.

## Create project layout
Put your code in some fold like `douban`. Write your own `setup.py` to give basic info about this lib or package. And you can put a `README.md` file and LICENSE file

	douban-dl/
		LICENSE.txt
		README.md
		setup.py
		douban/
			__init__.py
			__main__.py
			other_packages.py

## Create setup.py to describe project
setup file often used to describe your project, you can have a template like this:

	from setuptools import setup, find_packages

	def readme():
		with open('README.md') as f:
			return f.read()

	requirements = [
		"bs4",
		"requests"
	]

	setup(
		name='douban-dl',
		version='0.0.1',
		description='',
		long_description=readme(),
		packages=['douban',],
		url="https://github.com/einverne/douban-dl",
		author="einverne",
		author_email="your@email.com",
		entry_points={
			'console_scripts': [
				'douban-dl = douban.__main__:main',
			]},
		keywords="douban downloader",
		packages=find_packages(exclude=["tests"]),
		license='MIT',
	    install_requires=requirements,
	)

## Create .pypirc file
Register your own account at <https://pypi.python.org/pypi>. And create following file under `~/.pypirc`.

	[distutils]
	index-servers =
	  pypi
	  testpypi

	[pypi]
	username: einverne
	password: password

	[testpypi]
	repository: https://test.pypi.org/legacy
	username: einverne
	password: password

## Upload your first release
Use following command to create a compressed archive file which is under `dist` sub-directory. This file will wrap-up all project's source code.

	python setup.py sdist

And upload

	python setup.py sdist [bdist_wininst] upload

this command upload archive file to pypi. `bdist_wininst` option alse create windows distribution.

All above had beed tested by myself -> <https://pypi.python.org/pypi/douban-dl>

## reference

- <http://the-hitchhikers-guide-to-packaging.readthedocs.io/en/latest/quickstart.html>
- <https://setuptools.readthedocs.io/en/latest/setuptools.html#automatic-script-creation>

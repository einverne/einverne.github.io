---
layout: post
title: "使用 openpyxl python lib 来读写 Excel"
tagline: ""
description: ""
category: 学习笔记
tags: [python, excel, openpyxl, ]
last_updated:
---

Openpyxl 是一个用来处理 Excel 格式文件的 Python 库，它能用来处理 Excel 2007 及以上版本的 excel 文件，也就是 .xlsx/.xlsm/.xltx/.xltm 格式的表格文件。

## installation

使用 pip 安装

	pip install openpyxl

## usage

使用方法包括读和写，参考如下例子：

	#!/usr/bin/env python
	# -*- coding: utf-8 -*-

	from openpyxl import Workbook, load_workbook


	class ExcelWriter:
		def __init__(self, name):
			self.name = name
			self.wb = Workbook()

		def create_work_sheet(self, sheet_name, index):
			ws = self.wb.create_sheet(sheet_name, index)
			ws.sheet_properties.tabColor = "1072BA"

		def write_row(self):
			ws = self.wb.active
			for row in range(1, 10):  # 1 到 10 行
				ws.append(range(10))  # 10 列
			self.wb.save(self.name)

		def set_cell_value(self, row, col, value):
			ws = self.wb.active
			ws.cell(row=row, column=col).value = value

		def save(self):
			self.wb.save(self.name)


	class ExcelReader:
		def __init__(self, path):
			self.path = path
			self.wb = load_workbook(path)

		def get_all_sheetnames(self):
			return self.wb.get_sheet_names

		def get_all_rows(self, sheet_name):
			"""
			按行进行迭代
			:param sheet_name:
			:return:
			"""
			ws = self.wb.get_sheet_by_name(sheet_name)  # 调用 get_sheet_by_name 如果 sheet name 不存在返回 None
			if ws is None:
				return
			rows = ws.rows
			for row in rows:
				if row is None:
					return
				yield [col.value for col in row]

		def get_cell_value(self, sheet_name, row, col):
			ws = self.wb.get_sheet_by_name(sheet_name)
			if ws is None:
				return
			return ws.cell(row=row, column=col).value


	if __name__ == '__main__':
		writer = ExcelWriter("sample.xlsx")

		writer.write_row()

		reader = ExcelReader('sample.xlsx')
		sn = reader.get_all_sheetnames()

		for data in reader.get_all_rows('Sheet'):
			print data


## 图片图标

openpyxl 还有很多重量级的功能，比如绘图等等，具体可参考文档。

## 其他
Python 其他处理 Excel 的库

- <https://www.pyxll.com/blog/tools-for-working-with-excel-and-python/>

## reference

- 官方文档 <https://openpyxl.readthedocs.io/en/latest/>

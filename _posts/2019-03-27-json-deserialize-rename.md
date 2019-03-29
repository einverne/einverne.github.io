---
layout: post
title: "JSON 反序列化重命名"
tagline: ""
description: ""
category: 经验总结
tags: [json, gson, fastjson, ]
last_updated:
---

Java 中有很多 JSON 相关的类库，项目中也频繁的使用 Jackson, fastjson, gson 等等类库。不过这些类库在反序列化 JSON 字符串到 Object 并且进行重命名字段的方法都不太一致，这里就列一下做个参考。

假设有原始字符串

    String originStr = "{\"familyName\":\"Ein\",\"age\":20,\"salary\":1000.0}";

反序列化到类 Employee 上。

## GSON

类定义

    @Data
    public class EmployeeGson {

        @SerializedName(value = "fullname", alternate = {"Name", "familyName"})
        private String name;
        private int age;
        @SerializedName("salary")
        private float wage;
    }

测试方法

	@Test
	public void testRenameFieldGson() {
		String originStr = "{\"familyName\":\"Ein\",\"age\":20,\"salary\":1000.0}";
		EmployeeGson employee = new Gson().fromJson(originStr, EmployeeGson.class);
		System.out.println(employee);
	}

## Fastjson
类

    @Data
    public class EmployeeFastjson {
        @JSONField(name = "familyName")
        private String name;
        private int age;
        @JSONField(name = "salary")
        private float wage;
    }

测试方法

	@Test
	public void testRenameFieldFastjson() {
		String originStr = "{\"familyName\":\"Ein\",\"age\":20,\"salary\":1000.0}";
		EmployeeFastjson employee = JSON.parseObject(originStr, EmployeeFastjson.class);
		System.out.println(employee);
	}

## Jackson

    @Data
    public class EmployeeJackson {

        @JsonProperty("familyName")
        private String name;
        private int age;
        @JsonProperty("salary")
        private float wage;

    }

测试方法

	@Test
	public void testRenameFieldJackson() throws IOException {
		String originStr = "{\"familyName\":\"Ein\",\"age\":20,\"salary\":1000.0}";
		EmployeeJackson employeeJackson = new ObjectMapper()
				.readValue(originStr, EmployeeJackson.class);
		System.out.println(employeeJackson);
	}



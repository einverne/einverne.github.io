---
layout: post
title: "GraphQL 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [graphql, apollo, facebook, restful, api, ]
last_updated:
---

很多人都知道 GraphQL 起源于 Facebook，但是似乎很少中文材料提到 GraphQL 出现的契机，我在看完[这个纪录片](https://www.youtube.com/watch?v=783ccP__No8) 之后才对 GraphQL 的出现有更加深刻的了解。都知道当年 Facebook 的移动客户端都是网页，随着移动互联网发展，Facebook 网页实现的客户端性能和体验受到非常严重的影响，所以后来不得不去做原生的应用。那么这个时候就遇到了一个问题，原来直接使用网页，那么不同客户端用的接口都是给网页用的，最多做一下屏幕的适配，但是如果使用原生的应用，那么必然会需要设计不同的 API，而 Facebook 的工程师发现，对于复杂的 Feed 流，评论等等，用 RESTful 接口将是一个灾难，所以一帮人开始设计一种查询语言，这就是后来的 GraphQL。也应该纠正一下 Facebook 那帮工程师，只是开源了一份设计和一份实现，但他们万万没有想到开源社区的力量，就像片中 Nick Schrock 说的那样，他低估了社区的力量，在短短的几个月，几年时间中，GraphQL 就已经有了非常多语言的支持，周边应用也非常丰富。原来在脑海里的想法，都没有到生产环境中用过，就这样在所有社区的人的努力下成为了改变这个行业的一部分。

在了解 GraphQL 的过程中，看到一个非常有意思的比喻，经常有人会问起 GraphQL 和 RESTful 接口的区别，如果用去餐厅吃放，自助餐或者点餐来比喻，那么 GraphQL 就像是自助餐，你想要吃什么去餐盘中自己选择，而 RESTful 就像是点菜，需要看菜单，然后根据菜单选择。虽然两者都能吃饱，但是使用感受完全不同。[^1] 当然这篇文章就不再继续讲 GraphQL 是什么，有什么用了，之前的 [文章](/post/2018/10/graphql-introduction.html) 也列了很多资料，差不多可以了解到它的具体使用场景了。这篇文章重点在于怎么把 GraphQL 用到实际项目中。

GitHub 上的 awesome-graphql 项目列举了太多的开源实现，从 c++, java, 到 python, nodejs, ruby 等等，这里我就选择上手最快的 python 更具体一些是 Django 来体验一下 GraphQL 和 Django 结合的效果。

[^1]: https://www.youtube.com/watch?v=X3QM6Ap6u-4

先放上代码：

- <https://github.com/einverne/zero-to-graphql/tree/master/zero-django>

原始项目有些时间了，所以更新了一下，加了一些其他特性。

## Python
主要借用的是这个项目：

- <https://github.com/graphql-python/graphene>

Django 支持 <https://github.com/graphql-python/graphene-django/>


## 查询 Query
GraphQL 的查询语法。

### Field
最常见的查询，请求方根据 Schema 定义结构，查询：

	query {
		allPeople {
			id
			username
		}
	}

结果和查询结构相同，包裹在 `data` 结构中：

	{
	  "data": {
		"allPeople": [
		  {
			"id": "1",
			"username": "steve"
		  },
		  {
			"id": "2",
			"username": "aholovaty"
		  },
		  {
			"id": "3",
			"username": "swillison"
		  },
		  {
			"id": "4",
			"username": "gvr"
		  },
		  {
			"id": "5",
			"username": "admin"
		  }
		]
	  }
	}

GraphQL 的接口是有类型定义的，对于上面的查询可以总结出

	type RootQuery {
		allPeople: Person
	}

	type Person {
		id: int
		username: String
	}

### 条件查询 Arguments
官方的[说法](https://graphql.org/learn/queries/#arguments) 叫做 Arguments，参数化请求。

比如查询条件为 id 为 5 的用户信息

	query {
	  person(id: "5") {
		id
		username
		email
	  }
	}

结果是

	{
	  "data": {
		"person": {
		  "id": "5",
		  "username": "admin",
		  "email": "i@gmail.com"
		}
	  }
	}

结构

	type RootQuery {
		person(id: int) : Person
	}


GraphQL 可以有不同的参数类型，这取决于你的类型定义，Schema 定义。[^schema] 并且你可以自定义你的参数类型，只要你能够序列化该参数，这就使得 GraphQL 扩展性大大增强。

[^schema]: https://graphql.org/learn/schema/

### Aliases
没有看到官方的翻译，暂且称之为“别名”好了 [^aliases]，某些情况下想要重写结果的 KEY，可以使用改方式来实现。


假如查询的时候要查两个用户的信息

	query {
	  person(id: "5") {
		id
		username
		email
	  },
	  person(id: "4") {
		id
		username
		email
	  }
	}

这么查肯定是会返回两个 person 的 key 的 JSON，那么就会有问题，GraphQL 允许我们重命名

	query {
	  p5: person(id: "5") {
		id
		username
		email
	  },
	  p4: person(id: "4") {
		id
		username
		email
	  }
	}


返回值是这样的：

	{
	  "data": {
		"p5": {
		  "id": "5",
		  "username": "admin",
		  "email": "i@gmail.com"
		},
		"p4": {
		  "id": "4",
		  "username": "gvr",
		  "email": "gvr@dropbox.com"
		}
	  }
	}

[^Aliases](http://graphql.org/learn/queries/#aliases)

### Fragments
Fragments Android 里面也用了这个名词，我也不知道怎么翻译，暂且叫做“片段”好了，为什么要有 Fragments 呢？ 就是因为要重用，看到上面请求两个用户的 Query 语句了吗？其中每个用户都想要请求其 id, username, email，这些参数是不是每次都要手写，假如这个 Person 信息不仅包含着三个，还有很多，假如不止请求两个用户信息，难道还要复制 N 遍，这显然是不合理的，所以 GraphQL 引入了 Fragments 概念，可以定义片段，然后再复用。

	{
		p4: person(id: "4") {
		...personFields
	  },
	  p5: person(id: "5") {
		...personFields
	  }
	}

	fragment personFields on PersonType {
	  id
	  username
	  email
	  fullName
	  firstName
	  lastName
	  friends {
		id
		username
	  }
	}

结果就是对应的

	{
	  "data": {
		"p4": {
		  "id": "4",
		  "username": "gvr",
		  "email": "gvr@dropbox.com",
		  "fullName": "Guido van Rossum",
		  "firstName": "Guido",
		  "lastName": "van Rossum",
		  "friends": [
			{
			  "id": "2",
			  "username": "aholovaty"
			},
			{
			  "id": "3",
			  "username": "swillison"
			}
		  ]
		},
		"p5": {
		  "id": "5",
		  "username": "admin",
		  "email": "i@gmail.com",
		  "fullName": " ",
		  "firstName": "",
		  "lastName": "",
		  "friends": []
		}
	  }
	}

### Use Variables in Fragments
如果再进一步，既然能够定义 Fragments 了，那么在其中定义变量也是可以的吧。

	query person($first: Int = 2) {
		p4: person(id: "4") {
		...personFields
	  },
	  p5: person(name: "admin") {
		...personFields
	  }
	}

	fragment personFields on PersonType {
	  id
	  username
	  email
	  fullName
	  friends(first: $first) {
		id
		username
	  }
	}

结果是这样的

	{
	  "data": {
		"p4": {
		  "id": "4",
		  "username": "gvr",
		  "email": "gvr@dropbox.com",
		  "fullName": "Guido van Rossum",
		  "friends": [
			{
			  "id": "2",
			  "username": "aholovaty"
			},
			{
			  "id": "3",
			  "username": "swillison"
			}
		  ]
		},
		"p5": {
		  "id": "5",
		  "username": "admin",
		  "email": "i@gmail.com",
		  "fullName": " ",
		  "friends": [
			{
			  "id": "1",
			  "username": "steveluscher"
			},
			{
			  "id": "2",
			  "username": "aholovaty"
			}
		  ]
		}
	  }
	}


要使用变量，需要有三个步骤：

- 将静态变量替换为带`$` 操作符的 `$variableName` 变量名
- 将变量名作为某个查询 operation name 的参数
- 将 `variableName: value` 参数以可以传输的格式（通常是 JSON) 传递给查询

变量在定义时需要注意会在后面跟着 `: type` 来表示该变量的类型。定义的变量只能是这些类型

- scalars 标量
- enums 枚举
- input object types

对于复杂变量，需要到 Schema 中知道该变量的内容。这部分可以参考 Schema.

变量如果是必须的，那么需要在变量类型后面增加 `!` 来表示


### 操作名 Operation name
在上面的例子中也能看到，在 Query 的时候，有些情况下可以省略最前面的 `query` 关键字，这个 `query` 关键字在 GraphQL 中叫做 `operation type`，之所以叫做 type，是因为这只是查询，到后面还有 mutation （修改）, subscription 等等。这个操作类型隐含了此次操作的具体动作，比如说是查询，还是修改，还是订阅等等。

接在 `query` 关键字后面的是 `operation name`，操作名，该名字定义了此次查询的含义，比如上面的例子就是查询 person 信息。operation name 就像是大部分语言里面的方法，operation name 在获取多个文档时才是必须的，但是非常建议给予每一个查询一个名字，operation name 在调试服务端程序时非常有用，可以快速定位问题。


## 更改 mutation
插入或者更新数据，和查询类似，使用 `mutation` operation type， 后面接 operation name，再就是传参，以及定义返回值。

	mutation createCategory {
		createCategory(name: "Milk") {
		category {
		  id
		  name
		}
	  }
	}

	class CreateCategory(graphene.Mutation):
		"""
		"""
		class Arguments:
			name = graphene.String(required=True)

		category = graphene.Field(CategoryType)

		def mutate(self, info, **kwargs):
			name = kwargs.get('name')
			category = Category(name=name)
			Category.save(category)
			return CreateCategory(category=category)


	class UpdateCategory(graphene.Mutation):
		"""
	mutation updateCategory {
		updateCategory(id: "5", name: "MilkV2") {
		category {
		  id
		  name
		}
	  }
	}
		"""
		class Arguments:
			id = graphene.ID()
			name = graphene.String(required=True)

		category = graphene.Field(CategoryType)

		def mutate(self, info, id, name):
			ca = Category.objects.get(pk=id)
			ca.name = name
			ca.save()
			return UpdateCategory(category=ca)


	class Mutation(graphene.ObjectType):
		create_category = CreateCategory.Field()
		update_category = UpdateCategory.Field()

Mutation 和 Query 有一个显著的差异，Query Field 会同时查询，而 Mutation Field 只会顺序，一个接一个查询。

## 扩展阅读
其他 Python 实现的 GraphQL

- <https://github.com/strawberry-graphql/strawberry>
- <https://github.com/ethe/pygraphy>

用 node 实现第一个 GraphQL

- <https://medium.com/the-graphqlhub/your-first-graphql-server-3c766ab4f0a2>

GraphQL with Flask

- <https://www.youtube.com/watch?v=oQc7DC3srNM>

JSON API

- <https://jsonapi.org/format/>

这里是一些已经实现 GraphQL 的公开的 API

- <https://github.com/APIs-guru/graphql-apis>

## reference

- <https://graphql.org/learn/>
- <https://github.com/chentsulin/awesome-graphql>
- <https://www.apollographql.com>
- <https://www.apollographql.com/docs/apollo-server/getting-started/>
- <https://medium.com/airbnb-engineering/reconciling-graphql-and-thrift-at-airbnb-a97e8d290712>
- [中文网站](https://graphql.cn)
- <https://github.com/google/rejoiner>
- [从 RESTful 迁移到 GraphQL](https://jacobwgillespie.com/from-rest-to-graphql-b4e95e94c26b#.a35rlsech)

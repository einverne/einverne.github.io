---
layout: post
title: "RESTful 接口"
tagline: ""
description: ""
category: 经验总结
tags: [Web, API, RESTful,]
last_updated: 2017-02-12
---

RESTful 为 Representational State Transfer 的缩写，拆分开这三个单词来就是：

- Representational - REST resources can be represented in virtually any form, include XML, JSON, or even HTML 表现层，资源的表现形式
- State - concerned with the state of a resource 状态，指的是互联网上资源的状态
- Transfer - transferring resource data 转换，服务端/客户端的转换

Put more succinctly, REST is about transferring the state of resources in a representational form that is most appropriate for the client or server from a server to a client (or vice versa).

These HTTP methods are often mapped to CRUD verbs as follows:

- Create—POST 新建资源，更新
- Read—GET 获取资源
- Update—PUT or PATCH 更新资源，PUT时客户端提供修改的完整资源，PATCH 为客户端提供改变的属性
- Delete—DELETE 删除资源

对于一个 HTTP 请求可以分成一下部分：

`VERB` is one of the HTTP methods like GET, PUT, POST, DELETE, OPTIONS, etc

`URI` is the URI of the resource on which the operation is going to be performed

`HTTP Version` is the version of HTTP, generally "HTTP v1.1" .

`Request Header` contains the metadata as a collection of key-value pairs of headers and their values. These settings contain information about the message and its sender like client type, the formats client supports, format type of the message body, cache settings for the response, and a lot more information.

`Request Body` is the actual message content. In a RESTful service, that's where the representations of resources sit in a message.

对于一个 Http Response 可以分成一下部分：

HTTP Version

Response Code

Response Header

Response Body contains the representation if the request was successful

## 一些常见问题

### API版本控制
将API版本放入 URI

	https://api.example.com/v1

或者将版本信息放入 HTTP 头信息中。


以下是读 《Oreilly REST API Design Rulebook》 的一些笔记。

A Web API conforming to the REST architectural style is a REST API.

## URI

### 格式

RFC 3986 * defines the generic URI syntax as shown below:

    URI = scheme "://" authority "/" path [ "?" query ] [ "#" fragment ]

建议：

- 使用前置的 "/" (forward slash separator)  来表达资源层级，在 URI 结尾不添加 "/"
- 使用 Hyphens “-” 来增加可读性，不使用 Underscores "_"
- 使用小写
- 不使用 File extensions

### Resource Archetypes

A REST API 有 4 种不同的资源原型( Resource Archetypes ) : document, collection, store and controller. 下面四种资源类型翻译出来不伦不类，直接原文反而比较容易明白。

- A document resource is a singular concept that is akin to an object instance or database record. A document’s state representation typically includes both fields with values and links to other related resources.

- A collection resource is a server-managed directory of resources. 服务端托管资源的目录

- A store is a client-managed resource repository. 客户端管理的资源

	The example interaction below shows a user (with ID 1234) of a client program using a fictional Soccer REST API to insert a document resource named alonso in his or her store of favorites:

    	PUT /users/1234/favorites/alonso

- A controller resource models a procedural concept. Controller resources are like executable functions, with parameters and return values; inputs and outputs.


### URI Path Design 路径设计

- 单数名词用于 document
- 复数名词用于 collection
- 复数名词用于 store
- 动词或者动词短语用于 Controller 名字
- Variable path segments may be substituted with identity-based values
- CRUD 名字不应该在URI中使用，而应该使用 `DELETE /users/1234`


### URI Query Design 参数设计

- The query component of a URI may be used to filter collections or stores

	比如 GET /users?role=admin

- 用来分页

	GET /users?pageSize=25&pageStartIndex=50

## Interaction Design with HTTP

REST API 使用 HyperText Transfer Protocol , version 1.1 (HTTP/1.1) , 包括：

- request methods
- response codes
- message headers

RFC 2616 defines the Status-Line syntax as shown below:

    Status-Line = HTTP-Version SP Status-Code SP Reason-Phrase CRLF

### Request Methods
请求的方法区别：

The purpose of GET is to retrieve a representation of a resource’s state. HEAD is used to retrieve the metadata associated with the resource’s state. PUT should be used to add a new resource to a store or update a resource. DELETE removes a resource from its parent. POST should be used to create a new resource within a collection and execute controllers.

需要注意：

- GET and POST must not be used to tunnel other request methods
- GET must be used to retrieve a representation of a resource
- HEAD should be used to retrieve response headers
- PUT must be used to both insert and update a stored resource
- POST must be used to create a new resource in a collection
- POST must be used to execute controllers
- DELETE must be used to remove a resource from its parent
- OPTIONS should be used to retrieve metadata that describes a resource’s available interactions

### Response Status Codes 返回码

Category Description 分组描述

1xx: Informational Communicates transfer protocol-level information.

2xx: Success Indicates that the client’s request was accepted successfully.

3xx: Redirection Indicates that the client must take some additional action in order to complete their request.

4xx: Client Error This category of error status codes points the finger at clients. 客户端请求错误

5xx: Server Error The server takes responsibility for these error status codes. 服务器内部错误

具体的状态码：

- 200  表明成功， response 需携带 response body
- 201 Create 表示资源创建成功
- 202 Accepted 用于表示成功开始了异步动作
- 204 No Content，通常用于 PUT，POST，和 DELETE 请求的response，如果 GET 返回结果为空，通常也用204
- 301 “Moved Permanently”，通常应该在返回结果 header 中包含 Location 重定向的请求地址
- 302 (“Found”) should not be used
- 303 “See Other” refer the client to a different URI
- 304 Not Modified preserve bandwidth  , client already has the most recent version of the representation
- 307 Temporary Redirect tell clients to resubmit the request to another URI
- 400 Bad Request may be used to indicate nonspecific failure，客户端请求错误
- 401 Unauthorized，must be used 客户端无授权，令牌，密码等无验证
- 403 Forbidden，should be used to forbid access regardless of authorization state
- 404 Not found，must be used when a client’s URI cannot be mapped to a resource 不存在该记录
- 405 (“Method Not Allowed”) must be used when the HTTP method is not supported
- 406 Not Acceptable，must be used when the requested media type cannot be served
- 409 Conflict should be used to indicate a vialation of resource state
- 412 Precondition Failed should be used to support conditional operations
- 415 Unsupported Media Type must be used when the media type of a request's payload cannot be processed
- 500 Internal Server Error should be used to indicate API malfunction

## Metadata Design

### HTTP Headers

- Content-Type must be used

- Content-Length should be used， Content-Length header 给出了整个 body bytes 大小，给出他的理由有两个：1. 客户端可以检查是否读取完整的大小 2. 客户端可以通过 HEAD 请求来得知整个body 的大小，而不同下载。

- Last-Modified should be used in responses 

- ETag should be used in responses ETag是HTTP协议提供的若干机制中的一种Web缓存验证机制，并且允许客户端进行缓存协商。 这就使得缓存变得更加高效，而且节省带宽。 如果资源的内容没有发生改变，Web服务器就不需要发送一个完整的响应。 ETag也可用于乐观并发控制，作为一种防止资源同步更新而相互覆盖的方法。

- Location must be used to specify the URI of a newly created resource

- Cache-Control, Expires, and Date response headers should be used to encourage caching





### Media Types

Media Type 有如下语法：

    type "/" subtype *( ";" parameter )


type 的值可以有：  application, audio, image, message, model, multipart, text 和 video.

A typical REST API will most often work with media types that fall under the application type.



text/plain

A plain text format with no specific content structure or markup. ‡

text/html

Content that is formatted using the HyperText Markup Language (HTML). §

image/jpeg

An image compression method that was standardized by the Joint Photographic

Experts Group (JPEG). ‖

application/xml

Content that is structured using the Extensible Markup Language (XML). #

application/atom+xml

Content that uses the Atom Syndication Format (Atom), which is an XML-based

format that structures data into lists known as feeds. *

application/javascript

Source code written in the JavaScript programming language. †

application/json

The JavaScript Object Notation (JSON) text-based format that is often used by

programs to exchange structured data. ‡


### Media Type Design

Client developers are encouraged to rely on the self-descriptive features of a REST API.


## Representation Design

REST API 通常使用 response message 的 body 来传递资源的状态。 REST APIs 通常使用文本格式来表示资源。

- JSON should be supported for resource representation

## Client Concerns



### Versioning

- 使用新的 URIs
- Schemas
- Entity tags

### Security

- OAuth

CORS(Cross-origin resource sharing 跨域资源共享) should be supported to provide multi-origin read/write access from JavaScript，克服了 AJAX 只能同源使用资源的限制。

Access-Control-Allow-Origin

该字段是必须的。它的值要么是请求时Origin字段的值，要么是一个*，表示接受任意域名的请求。

Access-Control-Allow-Credentials

该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可。

Access-Control-Expose-Headers

该字段可选。CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。上面的例子指定，getResponseHeader('FooBar')可以返回FooBar字段的值。

CORS 请求默认不发送 Cookie 和 HTTP 认证信息，如果想要把 Cookie 发送到服务器，一方面要服务器同意，指定 `Access-Control-Allow-Credentials` 为 true。


## 调试 RESTful 接口


接口调试工具 Postman <https://www.getpostman.com/>

其他工具

- curl <https://curl.haxx.se/>
- DHC <https://chrome.google.com/webstore/detail/dhc-restlet-client/aejoelaoggembcahagimdiliamlcdmfm>
- Advanced rest client <https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo>
- Java 版本 rest-client <https://github.com/wiztools/rest-client/releases>
- 在线 RESTful 测试 <https://httpbin.org/>

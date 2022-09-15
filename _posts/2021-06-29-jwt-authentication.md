---
layout: post
title: "JWT 认证使用"
aliases: 
- JWT 认证
- JSON Web Token 认证
tagline: ""
description: ""
category: 学习笔记
tags: [ jwt, authentication, session, cookie, python, java ]
last_updated:
---


现代 Web 应用一般常用的认证方式有如下两种：

- session
- cookie

session 认证需要服务端大量的逻辑处理，保证 session 一致性，并且需要花费一定的空间实现 session 的存储。

所以现代的 Web 应用倾向于使用客户端认证，在浏览器中就是 cookie 认证, 但是 Cookie 有明显的缺陷：

- Cookie 会有数量和长度限制
- Cookie 如果被拦截可能存在安全性问题


## 为什么要认证
数据安全：

- 进行安全的验证，服务端可以无状态认证

签名，只有信息发送者才能产生别人无法伪造的字串，这个字串同时是发送者真实信息的证明。

用户登录成功后，服务端产生 token 字串，并将字串下发客户端，客户端在之后的请求中携带 token。

## Token 验证的优点

- 支持跨域访问，Cookie 不允许跨域访问
- 无状态，服务端不需要存储 session 信息，Token 自身包含了所有登录用户的信息
- 解耦，不需要绑定到一个特定的身份验证方案，Token 可以在任何地方生成
- 适用范围广，只要支持 HTTP 协议客户端就可以使用 Token 认证
- 服务端只需要验证 Token 安全，不必再获取登录用户信息
- 标准化，API 可以采用标准化的 JWT（JSON Web Token）


## Token 的缺点

- 数据传输量大，Token 存储了用户相关的信息，比单纯的 Cookie 信息要多，传输过程中消耗更多的流量
- 和所有客户端认证方式一样，很难在服务端注销 Token，很难解决客户端劫持问题。并且 Token 一旦签发了，在到期之前就始终有效，除非服务器部署额外的逻辑
- Token 信息在服务端增加了一次验证数据完整性的操作，比 Session 认证方式增加了 CPU 开销

## JWT
JSON Web Token(JWT) 是一个开放标准（[RFC 7519](https://tools.ietf.org/html/rfc7519)），定义了紧凑、自包含的方式，用于 JSON 对象在各方之间传输。

JWT 实际就是一个字符串，三部分组成：

- 头部
- 载荷
- 签名


### header
Header 由两部分组成，token 类型和算法名称（HMAC SHA256，RSA 等等）

```
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### payload
Payload 部分也是 JSON 对象，存放实际传输的数据，JWT 定义了7个官方的字段。

```
iss (issuer)：签发人
exp (expiration time)：过期时间
sub (subject)：主题
aud (audience)：受众
nbf (Not Before)：生效时间
iat (Issued At)：签发时间
jti (JWT ID)：编号
```

可以添加任何字段：

```
{
    "Name":"Ein Verne",
    "Age":18
}
```

### Signature

签名部分通过如下内容生成：

- 编码过的 header
- 编码过的 payload
- 一个密钥（只有服务端知道）

通过指定的签名算法加密：

```
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

算出签名之后，header, payload, signature 三个部分拼成字符串，用 `.` 分隔，返回给用户。



## Token 认证流程

1. 客户端携带用户登录信息（用户名、密码）提交请求
2. 服务端收到请求，验证登录信息，如果正确，则按照协议规定生成 Token，经过签名并返回给客户端
3. 客户端收到 Token，保存在 Cookie 或其他地方，每次请求时都携带 Token
4. 业务服务器收到请求，验证 Token 正确性

无论是 Token，Cookie 还是 Session 认证，一旦拿到客户端标识，都可以伪造。为了安全，任何一种认证方式都要考虑加入来源 IP 或白名单，过期时间。

## JWT 如何保证安全性
JWT 安全性保证的关键就是 HMACSHA256，等等加密算法，该加密过程不可逆，无法从客户端的 Token 中解出密钥信息，所以可以认为 Token 是安全的，继而可以认为客户端调用是发送过来的 Token 是可信任的。



## 常用的 Python 库

### pyjwt

- <https://pyjwt.readthedocs.io/en/stable/>


## 常用的 Java 库

### jjwt

- <https://github.com/jwtk/jjwt>


### auth0

    <dependency>
        <groupId>com.auth0</groupId>
        <artifactId>java-jwt</artifactId>
        <version>3.10.3</version>
    </dependency>

用法：

    public static String create(){
      try {
        Algorithm algorithm = Algorithm.HMAC256("secret");
        String token = JWT.create()
          .withIssuer("auth0")
          .withSubject("subject")
          .withClaim("name","古时的风筝")
          .withClaim("introduce","英俊潇洒")
          .sign(algorithm);
        System.out.println(token);
        return token;
      } catch (JWTCreationException exception){
        //Invalid Signing configuration / Couldn't convert Claims.
        throw exception;
      }
    }

验证 Token

    public static Boolean verify(String token){
      try {
        Algorithm algorithm = Algorithm.HMAC256("secret");
        JWTVerifier verifier = JWT.require(algorithm)
          .withIssuer("auth0")
          .build(); //Reusable verifier instance
        DecodedJWT jwt = verifier.verify(token);
        String payload = jwt.getPayload();
        String name = jwt.getClaim("name").asString();
        String introduce = jwt.getClaim("introduce").asString();
        System.out.println(payload);
        System.out.println(name);
        System.out.println(introduce);
        return true;
      } catch (JWTVerificationException exception){
        //Invalid signature/claims
        return false;
      }
    }

## 相关工具

- <https://mkjwk.org/>

## reference

- <https://segmentfault.com/a/1190000023870645>
---
layout: post
title: "使用 itsdangerous 签名校验"
tagline: ""
description: ""
category: 学习笔记
tags: [itsdangerous, python, sign, ]
last_updated:
---

一般在开发网站时使用 `session` 或者 `cookie` 来处理用户登陆等等权限问题，而在移动应用中要验证用户身份采用登录时给用户生成一个 token（令牌）的方式。每次用户发出需要身份认证的请求时，就需要验证一次 token 是否有效，无效的情况包括 token 无法被解析等。在向不可信环境发送数据时，确保数据经过签名，使用只有自己知道的密钥来签名数据，加密后发送，在取回数据时，确保没有人篡改过。

Python 有个 `itsdangerous` 包含了很多安全校验 token 验证相关的方案。 itsdangerous 就是这样一个签名校验的工具，内部使用 HMAC 和 SHA1 来签名。基于 Django 签名模块，支持 JSON Web 签名 ([JWS](https://tools.ietf.org/html/rfc7515)), 这个库采用 BSD 协议。

## 给定字符串签名
发送方和接收方拥有相同的密钥 `secret-key` ，发送方使用密钥对发送内容进行签名，接收方使用相同的密钥对接收到的内容进行验证，看是否是发送方发送的内容。

    >>> from itsdangerous import Signer
    >>> s = Signer('secret-key')
    >>> s.sign('my string')
    'my string.wh6tMHxLgJqB6oY1uT73iMlyrOA'

签名过的字符串使用 `.` 分割。验证使用 `unsign`

    >>> s.unsign('my string.wh6tMHxLgJqB6oY1uT73iMlyrOA')

## 带时间戳的签名
签名有一定的时效性，发送方发送时，带上时间信息，接收方判断多长时间内是否失效

    >>> from itsdangerous import TimestampSigner
    >>> s = TimestampSigner('secret-key')
    >>> string = s.sign('foo')
    foo.DlGDsw.dpJ37ffyfNAVufH21lH_yoelnKA
    >>> s.unsign(string, max_age=5)

如果验证时间不对会抛出异常

## 序列化

    >>> from itsdangerous import Serializer
    >>> s = Serializer('secret-key')
    >>> s.dumps([1, 2, 3, 4])
    >>> s.loads('[1, 2, 3, 4].r7R9RhGgDPvvWl3iNzLuIIfELmo')

### 带时间戳的序列化

    >>> from itsdangerous import TimedSerializer
    >>> s=TimedSerializer('secret-key')
    >>> s.dumps([1,2,3,4])
    >>> s.loads('[1, 2, 3, 4].DlGEjg.1yG-U7iBk92FBYAZLezoBv2mfJs')

### URL 安全序列化
如果加密过的字符串需要在 URL 中传输，可以使用这种方式。常见的就是在邮件验证 token 中。

    >>> from itsdangerous import URLSafeSerializer
    >>> s = URLSafeSerializer('secret-key')
    >>> s.dumps([1, 2, 3, 4])
    'WzEsMiwzLDRd.wSPHqC0gR7VUqivlSukJ0IeTDgo'
    >>> s.loads('WzEsMiwzLDRd.wSPHqC0gR7VUqivlSukJ0IeTDgo')
    [1, 2, 3, 4]

### JSON Web Signatures


    >>> from itsdangerous import JSONWebSignatureSerializer
    >>> s = JSONWebSignatureSerializer('secret-key')
    >>> s.dumps({'x': 42})
    'eyJhbGciOiJIUzI1NiJ9.eyJ4Ijo0Mn0.ZdTn1YyGz9Yx5B5wNpWRL221G1WpVE5fPCPKNuc6UAo'


### 带时间戳的 JSON Web 签名

    from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
    s = Serializer('secret-key', expires_in=60)
    s.dumps({'id': user.id}) # user 为 model 中封装过的对象

在 Flask 中应用

    from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
    from itsdangerous import SignatureExpired, BadSignature
    from config import config

    def gen_token(user, expiration=1440*31*60):  # 单位为秒，设定 31 天过期
        s = Serializer(config.SECRET_KEY, expires_in=expiration)
        return s.dumps({'id': user.id})  # user 为 model 中封装过的对象

装饰器

    from functools import wraps
    def token_required(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            token = request.form['token']
            s = Serializer(config.SECRET_KEY)
            try:
                data = s.loads(token)
            except SignatureExpired:
                return jsonify({'status': 'fail', 'data': {'msg': 'expired token'}})
            except BadSignature:
                return jsonify({'status': 'fail', 'data': {'msg': 'useless token'}})
            kwargs['user_id'] = data['id']
            return func(*args, **kwargs)
        return wrapper


## 盐值
不同的盐值，生成的签名或者序列化的数值不一样，这里的盐 （SALT）不同于加密算法中的盐值，这里的盐值是用来避免[彩虹表破解](https://zh.wikipedia.org/wiki/%E5%BD%A9%E8%99%B9%E8%A1%A8)。

## Hash
哈希（Hash）算法就是单向散列算法，它把某个较大的集合 P 映射到另一个较小的集合 Q 中，假如这个算法叫 H，那么就有 Q = H（P）。对于 P 中任何一个值 p 都有唯一确定的 q 与之对应，但是一个 q 可以对应多个 p。作为一个有用的 Hash 算法，H 还应该满足：H(p) 速度比较快； 给出一个 q，很难算出一个 p 满足 q = H(p)；给出一个 p1，很难算出一个不等于 p1 的 p2 使得 H(p1)=H(p2)。正因为有这样的特性，Hash 算法经常被用来保存密码————这样不会泄露密码明文，又可以校验输入的密码是否正确。常用的 Hash 算法有 MD5、SHA1 等。

破解 Hash 的任务就是，对于给出的一个 q，反算出一个 p 来满足 q = H(p)。通常我们能想到的两种办法，一种就是暴力破解法，把 P 中的每一个 p 都算一下 H(p)，直到结果等于 q；另一种办法是查表法，搞一个很大的数据 库，把每个 p 和对应的 q 都记录下来，按 q 做一下索引，到时候查一下就知道了。这两种办法理论上都是可以的，但是前一种可能需要海量的时间，后一种需要海量 的存储空间，以至于以目前的人类资源无法实现。

## 扩展
[[2021-06-29-jwt-authentication]] 是一次性认证完毕加载信息到 token 里的，token 的信息内含过期信息。过期时间过长则被重放攻击的风险太大，而过期时间太短则请求端体验太差（动不动就要重新登录）

第三方认证协议 Oauth2.0 [RFC6749](https://tools.ietf.org/html/rfc6749) ，它采取了另一种方法：`refresh_token`，一个用于更新令牌的令牌。在用户首次认证后，签发两个 token： 一个为 `access_token`，用于用户后续的各个请求中携带的认证信息；另一个是 `refresh_token`，为 `access_token` 过期后，用于申请一个新的 `access_token`。

由此可以给两类不同 token 设置不同的有效期，例如给 `access_token` 仅 1 小时的有效时间，而 `refresh_token` 则可以是一个月。api 的登出通过 access token 的过期来实现（前端则可直接抛弃此 token 实现登出），在 refresh token 的存续期内，访问 api 时可执 refresh token 申请新的 access token（前端可存此 refresh token，access token 过其实进行更新，达到自动延期的效果）。refresh token 不可再延期，过期需重新使用用户名密码登录。

这种方式的理念在于，将证书分为三种级别：

- access token 短期证书，用于最终鉴权
- refresh token 较长期的证书，用于产生短期证书，不可直接用于服务请求
- 用户名密码 几乎永久的证书，用于产生长期证书和短期证书，不可直接用于服务请求


## reference

- <https://pythonhosted.org/itsdangerous/>

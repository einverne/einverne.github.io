---
layout: post
title: "一周 CP 反编译记录"
tagline: ""
description: ""
category: 经验总结
tags: [android, decompiler, crack, sign, ]
last_updated:
---

记录一下反编译一周 CP Android 3.26.0.451 版本，并拿到请求 sign 加密方法的过程。反编译的过程基本上可以划分为几个步骤

- 将 Android apk 文件反编译得到混淆的 java 代码
- 在混淆过的代码中找到发起请求的部分
- 找到请求发起 sign 加密部分加密方式

## 反编译 Android apk
关于第一步 [Android 反编译的教程和工具](/post/2017/02/android-decompiler.html) 可以参考之前的[文章](/post/2017/02/android-decompiler.html)。

## 查看混淆的代码
在反编译得到混淆过后的代码之后，这个时候不能盲目的去看，之前可以抓包看下应用内发出去的请求 path，找到关注的 path，比如在这里，找到一个请求的 path，然后沿着这个请求的 path 找到了发起请求的通用方法 `prepareRequest()`，看到这里就能清晰的看到请求发出去的时候带的几个通用参数 `user_id`， `sm_device_id` ，然后签名部分 `timestamp` ，`Token` ，`sign`，最关键的部分就是这里的 `sign` 的生成方式。

![prepare request](/assets/week_cp_prepare_request_2018-08-01-14-37-16.png)

然后到这里看到生成 sign 的方法，第一眼看过去就看到了希望 `SHA-1` 他使用的是这个哈希算法，这个算法也主要就是用于签名校验。

![sign sha1](/assets/week_cp_sha1_2018-08-01-14-42-12.png)

然后可以沿着这个思路去看各个参数的值，比如这里他用到了 `RequestData.buildQueryString()` 这个方法

![request data](/assets/week_cp_requestdata_2018-08-01-17-15-25.png)

大致看一下这个代码大概能猜到是将请求参数的 key value 拼接起来连成字符串返回。这个时候大致思路已经清晰，所以我用 Java 大致实现了一下 sign 生成的代码。

## Java 实现

```
import com.jutils.base.RequestData;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class WeekCPTest {
	private static String sha1(String str) throws NoSuchAlgorithmException, UnsupportedEncodingException {
		MessageDigest instance = MessageDigest.getInstance("SHA-1");
		byte[] bytes = str.getBytes("UTF-8");
		instance.update(bytes, 0, bytes.length);
		return O000000o(instance.digest());
	}

	private static String O000000o(byte[] bArr) {
		StringBuilder stringBuilder = new StringBuilder();
		for (byte b : bArr) {
			int i = (b >>> 4) & 15;
			int i2 = 0;
			while (true) {
				char c = (i < 0 || i > 9) ? (char) ((i - 10) + 97) : (char) (i + 48);
				stringBuilder.append(c);
				int i3 = b & 15;
				i = i2 + 1;
				if (i2 >= 1) {
					break;
				}
				i2 = i;
				i = i3;
			}
		}
		return stringBuilder.toString();
	}

	public static String makeSign(Map<String, Object> map, Map<String, Object> map2, String str) {
		Map treeMap = new TreeMap();
		if (!(map == null || map.isEmpty())) {
			treeMap.putAll(map);
		}
		if (!(map2 == null || map2.isEmpty())) {
			treeMap.putAll(map2);
		}
		treeMap.remove("token");
		treeMap.remove("sign");
		try {
			return sha1(RequestData.buildQueryString(treeMap, null, false) + str);
		} catch (Exception e) {
			e.printStackTrace();
			return "";
		}
	}



	public static void main(String[] args) {
		HashMap<String, Object> query = new HashMap<>();
		query.put("d", "a");
		query.put("user_id", "5624198");
		query.put("timestamp", "1533102328");
		query.put("sm_device_id", "201807021511598922958a5fbc8a5de09cb9019d34a48b01c51f66d9435c31");
//		query.put("Token", "1576511275532288_5624198_1559013109_58f16d8bd82677acc30d87542f5504b0");

		query.put("start", "80");
		query.put("last_object_id", "1742");
		query.put("keyword", "");
		query.put("num", "20");
		String s = makeSign(query, new HashMap<>(), "025d25f5a69eb2818b6811ff6edb51b4");
		System.out.println(s);
	}
}
```

然后使用[抓包工具](/post/2016/11/android-http-proxy-debug.html) 抓出一个请求，将参数凭借起来使用这个 Test 跑一下，发现是一致的。这个时候再使用 Python 实现一下。

    def __sha1(self, str):
        m = hashlib.sha1()
        m.update(str)
        return m.hexdigest()

    def __sign(self, params, secret_key, data={}):
        """
        通过请求参数和 secret_key 生成 sign
        :param params: 请求参数
        :param secret_key: 加密 key 和 用户绑定，在登录或者刷新 token 中获取
        :return:
        """
        to_sign = ""
        merged_dict = params.copy()
        merged_dict.update(data)
        if "sign" in merged_dict.keys():
            merged_dict.pop("sign")
        if "token" in merged_dict.keys():
            merged_dict.pop("token")
        for key in sorted(merged_dict.iterkeys()):
            value = merged_dict.get(key)
            logger.info("params %s %s" % (key, value))
            pair = str(key) + "=" + str(merged_dict.get(key))
            if to_sign == '':
                to_sign = to_sign + pair
            else:
                to_sign = to_sign + '&' + pair
        return self.__sha1(to_sign + secret_key)

然后这个时候就发现其实破解一周 CP 的难点不在 sign 而在拿到 secret_key，这个 secret_key 只有在登录和刷新 token 的接口中才会返回。

---
layout: post
title: "Android 使用自定义 keystore 调试"
tagline: ""
description: ""
category: 学习笔记
tags: [Android, AndroidDev]
last_updated: 
---

可以在 `build.gradle` 文件中指定debug 下的 keystore 文件路径，一般放到项目跟目录下，并使用如下方式指定。 更多语法可以参考 Signing Configurations 部分 <http://tools.android.com/tech-docs/new-build-system/user-guide>

指定 debug variant 下 keystore 路径：

    android {
        signingConfigs {
            debug {
                storeFile file('your.keystore')
                keyAlias 'androiddebugkey'
                keyPassword 'android'
                storePassword 'android'
            }
        }
    }

推荐还是讲 debug 和 release 下的 keystore 分开。

## 保存一些和 keystore 相关的命令

1. 查询 keystore 中条目

	keytool -list -keystore your.keystore -storepass yourpassword

2. 修改 keystore 中，使用上一步获取到的证书名字

	keytool -changealias -alias 证书名字 -destalias androiddebugkey -keystore your.keystore -storepass yourpassword

3. 修改密钥库密码

	keytool -storepasswd -keystore your.keystore -storepass yourpassword

4. 修改证书密码

	keytool -keypasswd  -alias androiddebugkey -keystore 证书名字 -storepass yourpassword


## reference

- <http://stackoverflow.com/questions/17189076/what-is-the-equivalent-of-eclipse-custom-debug-keystore-in-android-studio>
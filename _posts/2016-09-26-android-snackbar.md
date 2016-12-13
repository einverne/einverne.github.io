---
layout: post
title: "Android Snackbar 使用"
tagline: ""
description: ""
category: Android
tags: [Android, AndroidDev, ]
last_updated: 
---

Snackbar 提供操作的轻量级反馈。显示在手机底部或者大屏幕的左下，Snackbar显示在所有界面的最上层，并且只显示一次。

Snackbar 可以包含一个操作，使用 `setAction(CharSequence, android.view.View.onClickListener)`  设置。 Snackbar 可以通过 `setCallback(Callback)` 来设置显示和消失的回调 `Snackbar.Callback`

显示时间长短的常量

- int    LENGTH_INDEFINITE   没有操作不消失
- int    LENGTH_LONG    显示长时间
- int    LENGTH_SHORT   显示短时间

Android Support Library (22.2.1) 起才支持 `LENGTH_INDEFINITE`。如果使用该属性， Snackbar 会一直显示，直到调用 `dismiss()` 或者下一个 Snackbar 出现。

`make` 方法的第一个参数表示 Snackbar 会寻找该 View 来hold Snackbar 的View。第二个参数为需要显示的字符串。第三个参数为显示时间，使用以上三个常量。

    Snackbar.make(mLayout, R.string.permission_camera_rationale,
            Snackbar.LENGTH_INDEFINITE)
            .setAction(R.string.ok, new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    ActivityCompat.requestPermissions(MainActivity.this,
                            new String[]{Manifest.permission.CAMERA},
                            REQUEST_CAMERA);
                }
            })
            .setCallback(new Snackbar.Callback() {
                @Override
                public void onDismissed(Snackbar snackbar, int event) {
                    super.onDismissed(snackbar, event);
                    Toast.makeText(getApplicationContext(), "onDismissed", Toast.LENGTH_LONG).show();
                }

                @Override
                public void onShown(Snackbar snackbar) {
                    super.onShown(snackbar);
                    Toast.makeText(getApplicationContext(), "onShown", Toast.LENGTH_LONG).show();
                }
            })
            .show();

综上，Snackbar 作为带响应的通知来说能带来不错的体验。相较于 Toast 来说，Snackbar 能够提供一种操作，对于修改内容来说，提供短时间内的撤销操作应该是不错的。其他能够想到的一些操作，比如撤销邮件的发送，撤销消息的发送，等等。
---
layout: post
title: "android 6 runtime permission"
tagline: ""
description: "Android 6.0 引入的新权限系统"
category: Android
tags: [Android, AndroidDev, ]
last_updated: 
---

在 target API 23 之前，应用申请权限为一次性给予，开发者需要在 Manifest 中使用 users-permission 来申请权限，而用户则是在安装应用时一次性赋予应用所有申请的权限。

```
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.android.app.myapp" >
    <uses-permission android:name="android.permission.RECEIVE_SMS" />
    ...
</manifest>
```

而在 Android API Level 23 也就是 Android 6.0 以后权限的问题被进一步细化，开发者可以在运行时申请权限(Runtime permissions)，而此时众多的Android 权限也被[细分](https://developer.android.com/guide/topics/security/permissions.html#normal-dangerous)为 Normal 普通权限 和 Dangerous 危险权限，普通权限和 6.0 以前一样在 Manifest 中申请，并且在安装应用时一次性赋予，而危险权限的申请则需要额外的注意。否则可能会引发异常

    java.lang.SecurityException: Permission Denial

所有的权限列表在[官方文档](https://developer.android.com/reference/android/Manifest.permission.html) 可以查到，每一个权限都标明了 Protection level: normal or dangerous.

## 运行时获取权限 {#runtime}

申请照相权限例子:

    /**
     * Requests the Camera permission.
     * If the permission has been denied previously, a SnackBar will prompt the user to grant the
     * permission, otherwise it is requested directly.
     */
    private void requestCameraPermission() {
        Log.i(TAG, "CAMERA permission has NOT been granted. Requesting permission.");

        // BEGIN_INCLUDE(camera_permission_request)
        if (ActivityCompat.shouldShowRequestPermissionRationale(this,
                Manifest.permission.CAMERA)) {
            // Provide an additional rationale to the user if the permission was not granted
            // and the user would benefit from additional context for the use of the permission.
            // For example if the user has previously denied the permission.
            Log.i(TAG,
                    "Displaying camera permission rationale to provide additional context.");
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
                        .show();
        } else {

            // Camera permission has not been granted yet. Request it directly.
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA},
                    REQUEST_CAMERA);
        }
        // END_INCLUDE(camera_permission_request)
    }

## 重要方法

### 检查权限
ContextCompat 中

    public static int checkSelfPermission (Context context, String permission)

检查是否拥有权限，如果有返回 PackageManager `PERMISSION_GRANTED`， 如果没有则返回 `PERMISSION_DENIED`。

在 ActivityCompat 中

    public static boolean shouldShowRequestPermissionRationale (Activity activity, String permission)

在 UI 中弹出对话框申请权限，仅仅只有当当前功能需要权限的时候才需要申请。需要参数，目标 activity ，和需要申请的权限，返回是否需要弹出对话框。该方法监测是否需要申请权限。

### 申请权限

    public static void requestPermissions (Activity activity, String[] permissions, int requestCode)

申请权限的权限需要在 manifest 中定义，权限需要是危险权限 #PROTECTION_DANGEROUS dangerous

普通权限 `PROTECTION_NORMAL` 会在安装时一次性授予， 同样 `PROTECTION_SIGNATURE` 权限也会在安装时授予。

定义 signature 权限时，不仅需要添加权限说明，还需要相同的签名。

如果app不拥有申请的权限，在用户接受或者拒绝之后，会收到一个回调，说明是否授予了权限，需要实现接口。

    public abstract void onRequestPermissionsResult (int requestCode, String[] permissions, int[] grantResults)

因为申请权限不能保证被授予，所以无论在有没有权限的情况下都要保证app能够运行。

requestPermissions 方法会开始一个 activity 来让用户选择是否授予权限，因此程序自身 Activity 可能会 paused 或者 resumed。进一步，授予某些权限可能会导致重启应用，这种情况下系统会重新生成 activity stack ，之后再调用 onRequestPermissionsResult 。

回调方法 onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) 的第一个参数时 requestPermissions 方法传入的，第二个参数是申请的权限，Never null，第三个参数是是否授予权限的结果，也就是 PERMISSION_GRANTED 或者 PERMISSION_DENIED，Never null。

## 权限介绍

Android 的权限分成四个类别

- normal 普通级别
- dangerous 危险级别
- signature 签名级别
- signatureOrSystem 系统/签名级别

前两个权限直接定义时候即可，6.0以后 dangerous 可以在运行时申请。后两个权限为高级权限，拥有 platform 级别认证才可以申请，应用在没有权限情况下做受限操作，应用会被系统杀掉。

在 Manifest 中使用 <permission> 来定义权限， 使用 <users-permission> 来申请权限。申请的权限需要被系统或者其他应用定义，否则视为无效申请。

## users Permission

申请普通权限可以使用 <uses-permission> 简单语法如下：

    <uses-permission android:name="string"
            android:maxSdkVersion="integer" />

前一个参数简单，后以参数 maxSDKVersion 表示，如果应用从某一个版本开始不需要特定的权限，可以设置该属性。表示高于该 API Level 之后就不授予该权限。

如下定义

    <uses-permission-sdk-23 android:name="string"
            android:maxSdkVersion="integer" />

表示只有当app运行在 API Level 23 或以上时才申请权限，以下不申请权限。

## 自定义权限

    <permission android:description="string resource"
                android:icon="drawable resource"
                android:label="string resource"
                android:name="string"
                android:permissionGroup="string"
                android:protectionLevel=["normal" | "dangerous" |
                                         "signature" | "signatureOrSystem"] />

- android:description：对权限的描述，比lable更加的详细，介绍该权限的相关使用情况，比如当用户被询问是否给其他应用该权限时。注意描述应该使用的是string资源，而不是直接使用string串。 android:icon：用来标识该权限的一个图标。
- android:label：权限的一个给用户展示的简短描述。方便的来说，这个可以直接使用一个string字串来表示，但是如果要发布的话，还是应该使用string资源来表示。
- android:name：权限的唯一名字，由于独立性，一般都是使用包名加权限名，该属性是必须的，其他的可选，未写的系统会指定默认值。
- android:permissionGroup： 权限所属权限组的名称，并且需要在这个或其他应用中使用<permission-group>标签提前声明该名称，如果没有声明，该权限就不属于该组。
- android:protectionLevel：权限的等级

## reference

- <http://developer.android.com/guide/topics/manifest/permission-element.html>
- <https://developer.android.com/guide/topics/manifest/permission-element.html#plevel>
- <http://blog.csdn.net/self_study/article/details/50074781>
- <http://blog.csdn.net/self_study/article/details/50186435>
- <http://blog.csdn.net/t12x3456/article/details/7749200>
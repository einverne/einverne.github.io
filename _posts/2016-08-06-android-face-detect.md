---
layout: post
title: "Android 人脸检测"
tagline: "Android 人脸检测方法， 使用 android.media, play service 和 Face++ 识别人脸"
description: ""
category: 学习笔记
tags: [Android, AndroidDev, ]
last_updated: 
---

最近项目使用，总结了目前 Android 中使用到的人脸检测技术，主要分成三部分来介绍：

1. Android 原生支持人脸检测，从 [API 1](https://developer.android.com/reference/android/media/FaceDetector.html) 开始就提供原生的人脸检测，但是该方法识别率相对较低
2. 在后来的发展中 Google 将人脸识别技术放到了 [Google Play Services](http://android-developers.blogspot.com/2015/08/face-detection-in-google-play-services.html) 中，从 Google Play Service 7.8 之后提供的 Mobile Vision API 中我们可以使用新的人脸检测API。这个方法不仅能够识别有没有人脸，还能够识别人脸的区域，甚至在视频流中追踪相同的人脸，并且提供了一系列方法来获取眼睛、嘴巴、鼻子、脸颊的位置，利用这个 API 就能够在动态的视频中给人脸增加一些有趣的效果，加个胡子，带个帽子，等等，市面上有一些动态增加表情的 App 利用的似乎就是这个技术。
3. Face++， 国内一家做人脸检测的提供商，不过其免费版服务需经过网络，也就意味着需要联网将照片上传到其服务器，然后他返回识别的结果回来。
4. 其他服务，经过搜索 OpenCV 也能提供[类似的服务](https://github.com/crankdaworld/OpenCV-Android-FaceDetect-GoodFeature)，但是目前我还没有详细了解。 OpenCV 做计算机视觉有一定积累，相信识别准确率应该有保障。

接下来就依次介绍前三种人脸检测的方法。

## Android 原生人脸检测API

`android.media` 包中的人脸检测API 有如下两个限制：

1. Bitmap 必须以 Config.RGB_565 解码
1. 输入的 Bitmap 宽度需要为偶数

只要注意这两个限制，另图片眼睛的距离不要太小，其他的代码核心的没几句话。

```java
/**
 * There are some limitation in this 用android.media 包中识别人脸package.
 * 使用使用使Face Detection API's input Bitmap must :
 * <p/>
 * 1. config with Config.RGB_565<br/>
 * 2. Bitmap width must be even<br/>
 * <p/>
 * more details can be checked
 * http://stackoverflow.com/q/17640206/1820217
 *
 * @param bitmap Bitmap
 */
private void detectUsingNative(final Bitmap bitmap) {
    if (null == bitmap || isRunning) {
        if (listener != null) {
            listener.onFail();
        }
        return;
    }
    facesCount = 0;
    final android.media.FaceDetector faceDetector = new android.media.FaceDetector(bitmap.getWidth(), bitmap.getHeight(), MEDIA_MAX_DETECT_FACE_NUMBER);
    androidNativeFacesResults = new android.media.FaceDetector.Face[MEDIA_MAX_DETECT_FACE_NUMBER];
    final Handler handler = new Handler();
    thread = new Thread() {
        @Override
        public void run() {
            facesCount = faceDetector.findFaces(bitmap, androidNativeFacesResults);

            handler.post(new Runnable() {
                @Override
                public void run() {
                    if (listener != null) {
                        listener.onSuccess();
                    }
                }
            });

            isRunning = false;
        }
    };
    thread.start();
    isRunning = true;
}
```

## Play Service 中人脸检测

Play Service 中的人脸检测是随着 Mobile Vision API 一同[出现](https://developers.google.com/vision/)的，这个库中还有一些其他的API，比如识别二维码，识别文字等等，并且 Play Service 中的人脸识别更准确的说应该叫人脸追踪，在官方实现的 [Demo](https://github.com/googlesamples/android-vision) 中，直接调用手机摄像，能够一直追踪镜头中的同一人头像。

以下是部分实现，详细代码可参考文末给出的 GitHub 代码。

```java
/**
 * 使用 Play Service 中人脸检测
 *
 * @param bitmap Bitmap
 */
private void detectUsingGms(Bitmap bitmap) {
    if (null == bitmap) {
        if (listener != null) {
            listener.onFail();
        }
        return;
    }
    facesCount = 0;

    detector = new FaceDetector.Builder(context)
            .setTrackingEnabled(false)
            .setLandmarkType(FaceDetector.ALL_LANDMARKS)
            .setClassificationType(FaceDetector.ALL_CLASSIFICATIONS)
            .build();

    // This is a temporary workaround for a bug in the face detector with respect to operating
    // on very small images.  This will be fixed in a future release.  But in the near term, use
    // of the SafeFaceDetector class will patch the issue.
    Detector<Face> safeDetector = new SafeFaceDetector(detector);

    // Create a frame from the bitmap and run face detection on the frame.
    Frame frame = new Frame.Builder().setBitmap(bitmap).build();

    faces = safeDetector.detect(frame);

    if (!safeDetector.isOperational()) {
        // Note: The first time that an app using face API is installed on a device, GMS will
        // download a native library to the device in order to do detection.  Usually this
        // completes before the app is run for the first time.  But if that download has not yet
        // completed, then the above call will not detect any faces.
        //
        // isOperational() can be used to check if the required native library is currently
        // available.  The detector will automatically become operational once the library
        // download completes on device.

        if (listener != null) {
            listener.onFail();
        }
        return;
    }
    if (listener != null) {
        listener.onSuccess();
    }
}
```


## Face++ 人脸检测服务

Face++ 提供了联网的人脸检测服务，需要到其网站上注册开发者账号获取API使用权限。其大概检测代码如下：

```Java
    /**
     * 使用 Face++ 人脸检测
     *
     * @param file File
     */
    private void detectUsingFacePlus(File file) {
        if (!file.exists() || isRunning) {
            if (listener != null) {
                listener.onFail();
            }
            return;
        }
        final PostParameters parameters = new PostParameters();
        parameters.setImg(file);
        final Handler handler = new Handler();
        facesCount = 0;
        thread = new Thread() {
            @Override
            public void run() {
                boolean hasFace = false;
                boolean detectSucceed = false;
                Log.d("FacePlusDetect", "Detect Request :" + parameters.toString());
                HttpRequests httpRequests = new HttpRequests(FACEPLUSPLUS_APIKEY, FACEPLUSPLUS_APISECRET, false, true);
                JSONObject result;
                try {
                    result = httpRequests.detectionDetect(parameters);
                    if (result != null) {
                        detectSucceed = true;
                        JSONArray faces = result.getJSONArray("face");
                        double imgWidth = result.getDouble("img_width");
                        double imgHeight = result.getDouble("img_height");
                        if (faces != null && faces.length() > 0 && null != listener) {
                            // Has face!!
                            facesCount = faces.length();
                            facePlusResults = new RectF[facesCount];
                            hasFace = true;
                            for (int i = 0; i < facesCount; i++ ){
                                float x, y, w, h;
                                facePlusResults[i] = new RectF();
                                // 需注意返回结果的center,width,height 都为0~100,百分比
                                x = (float) faces.getJSONObject(i).getJSONObject("position").getJSONObject("center").getDouble("x");
                                y = (float) faces.getJSONObject(i).getJSONObject("position").getJSONObject("center").getDouble("y");
                                w = (float) faces.getJSONObject(i).getJSONObject("position").getDouble("width");
                                h = (float) faces.getJSONObject(i).getJSONObject("position").getDouble("height");
                                float realx = (float) (x * imgWidth / 100);
                                float realy = (float) (y * imgHeight / 100);
                                float realw = (float) (w * imgWidth / 100);
                                float realh = (float) (h * imgHeight / 100);
                                facePlusResults[i].set(realx - realw /2,
                                        realy - realh / 2,
                                        realx + realw / 2,
                                        realy + realh / 2);
                            }
//                            String genderStr = playServiceFaces.getJSONObject(0).getJSONObject("attribute").getJSONObject("gender").getString("value");
//                            gender = Gender.getValueOf(genderStr);
                        } else {
                            hasFace = false;
//                            detectSucceed = true;
//                            gender = Gender.OTHER;
                        }
//                        Log.d("FacePlusDetect", "Detect Result : hasFace = " + hasFace + "; gender = " + gender.toString());
                    }
                } catch (FaceppParseException e) {
                    detectSucceed = false;
                    Log.d(TAG, "Detect FaceppParseException !");
                    e.printStackTrace();
                } catch (JSONException e) {
//                    if (hasFace) {
//                        gender = Gender.OTHER;
//                    }
                    Log.d(TAG, "Detect JSONException !");
                    e.printStackTrace();
                }

                if (detectSucceed) {
                    handler.post(new Runnable() {
                        @Override
                        public void run() {
                            if (listener != null) {
                                listener.onSuccess();
                            }
                        }
                    });
                } else {
                    handler.post(new Runnable() {
                        @Override
                        public void run() {
                            if (listener != null) {
                                listener.onFail();
                            }
                        }
                    });
                }

                isRunning = false;
            }
        };
        thread.start();
        isRunning = true;
    }
```

## Detect Result

![Face++ Detect](https://lh4.googleusercontent.com/-zNsRgSMnO10/V6899VHy_BI/AAAAAAABA94/nejE8EBBYn0Q8Zx_Xbx_tIZFjT1SSY5YwCL0B/w506-h900-no/Screenshot_20160813-233236.png)

![Detect result](https://lh4.googleusercontent.com/-b2xwMmkue54/V6899QoTCzI/AAAAAAABA94/qs11ZhIW2E0PUjY6AoHRS92QpFmFNOqrQCL0B/w506-h900-no/Screenshot_20160807-214743.png)

FaceDetectDemo 代码可参考：<https://github.com/einverne/AndroidFaceDetectDemo>


## Reference

全部代码可参考 ： <https://github.com/einverne/Android-Face-Recognition>

- <http://opencv.org/platforms/android.html>
- <https://github.com/crankdaworld/OpenCV-Android-FaceDetect-GoodFeature>
- <http://code.tutsplus.com/tutorials/an-introduction-to-face-detection-on-android--cms-25212>
- <http://stackoverflow.com/questions/17839388/creating-a-scaled-bitmap-with-createscaledbitmap-in-android>
- <http://stackoverflow.com/questions/37300874/why-isnt-the-new-play-services-facedetector-available-on-some-devices>
- <http://stackoverflow.com/questions/17640206/how-to-overcome-the-face-detection-api-restrictions>
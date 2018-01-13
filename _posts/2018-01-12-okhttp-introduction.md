---
layout: post
title: "okhttp 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [okhttp, ]
last_updated: 
---


OkHttp是一个非常高效的HTTP客户端，默认情况下：

- 支持HTTP/2，允许对同一主机的请求共用一个套接字。 
- 如果HTTP/2 不可用，连接池会减少请求延迟。 
- 透明的GZIP可以减少下载流量。 
- 响应的缓存避免了重复的网络请求。


## 同步 GET 方法
阻塞请求

    private final OkHttpClient client = new OkHttpClient();

    public void run() throws Exception {
        Request request = new Request.Builder()
            .url("http://publicobject.com/helloworld.txt")
            .build();

        Response response = client.newCall(request).execute();
        if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

        Headers responseHeaders = response.headers();
        for (int i = 0; i < responseHeaders.size(); i++) {
          System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
        }

        System.out.println(response.body().string());
    }

## 异步 GET 请求

响应可读时回调 Callback 接口，读取响应时阻塞当前线程

    private final OkHttpClient client = new OkHttpClient();

    public void run() throws Exception {
        Request request = new Request.Builder()
            .url("http://publicobject.com/helloworld.txt")
            .build();

        client.newCall(request).enqueue(new Callback() {
          @Override public void onFailure(Request request, Throwable throwable) {
            throwable.printStackTrace();
          }

          @Override public void onResponse(Response response) throws IOException {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

            Headers responseHeaders = response.headers();
            for (int i = 0; i < responseHeaders.size(); i++) {
              System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
            }

            System.out.println(response.body().string());
          }
        });
    }


## POST 提交信息

    public static final MediaType MEDIA_TYPE_MARKDOWN
      = MediaType.parse("text/x-markdown; charset=utf-8");

    private final OkHttpClient client = new OkHttpClient();

    public void run() throws Exception {
        String postBody = ""
            + "Releases\n"
            + "--------\n"
            + "\n"
            + " * _1.0_ May 6, 2013\n"
            + " * _1.1_ June 15, 2013\n"
            + " * _1.2_ August 11, 2013\n";

        Request request = new Request.Builder()
            .url("https://api.github.com/markdown/raw")
            .post(RequestBody.create(MEDIA_TYPE_MARKDOWN, postBody))
            .build();

        Response response = client.newCall(request).execute();
        if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

        System.out.println(response.body().string());
    }

## 流方式提交请求体

流的方式提交请求体

    public static final MediaType MEDIA_TYPE_MARKDOWN
          = MediaType.parse("text/x-markdown; charset=utf-8");

    private final OkHttpClient client = new OkHttpClient();

    public void run() throws Exception {
        RequestBody requestBody = new RequestBody() {
          @Override public MediaType contentType() {
            return MEDIA_TYPE_MARKDOWN;
          }

          @Override public void writeTo(BufferedSink sink) throws IOException {
            sink.writeUtf8("Numbers\n");
            sink.writeUtf8("-------\n");
            for (int i = 2; i <= 997; i++) {
              sink.writeUtf8(String.format(" * %s = %s\n", i, factor(i)));
            }
          }

          private String factor(int n) {
            for (int i = 2; i < n; i++) {
              int x = n / i;
              if (x * i == n) return factor(x) + " × " + i;
            }
            return Integer.toString(n);
          }
        };

        Request request = new Request.Builder()
            .url("https://api.github.com/markdown/raw")
            .post(requestBody)
            .build();

        Response response = client.newCall(request).execute();
        if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

        System.out.println(response.body().string());
    }

## POST 提交文件
POST 方式提交文件

    public static final MediaType MEDIA_TYPE_MARKDOWN
      = MediaType.parse("text/x-markdown; charset=utf-8");

    private final OkHttpClient client = new OkHttpClient();

    public void run() throws Exception {
        File file = new File("README.md");

        Request request = new Request.Builder()
            .url("https://api.github.com/markdown/raw")
            .post(RequestBody.create(MEDIA_TYPE_MARKDOWN, file))
            .build();

        Response response = client.newCall(request).execute();
        if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

        System.out.println(response.body().string());
    }


## 提交表单


    public void run() throws Exception {
        RequestBody formBody = new FormEncodingBuilder()
            .add("search", "Jurassic Park")
            .build();
        Request request = new Request.Builder()
            .url("https://en.wikipedia.org/w/index.php")
            .post(formBody)
            .build();

        Response response = client.newCall(request).execute();
        if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

        System.out.println(response.body().string());
    }

## 分块POST提交

    private static final String IMGUR_CLIENT_ID = "...";
    private static final MediaType MEDIA_TYPE_PNG = MediaType.parse("image/png");

    private final OkHttpClient client = new OkHttpClient();

    public void run() throws Exception {
        // Use the imgur image upload API as documented at https://api.imgur.com/endpoints/image
        RequestBody requestBody = new MultipartBuilder()
            .type(MultipartBuilder.FORM)
            .addPart(
                Headers.of("Content-Disposition", "form-data; name=\"title\""),
                RequestBody.create(null, "Square Logo"))
            .addPart(
                Headers.of("Content-Disposition", "form-data; name=\"image\""),
                RequestBody.create(MEDIA_TYPE_PNG, new File("website/static/logo-square.png")))
            .build();

        Request request = new Request.Builder()
            .header("Authorization", "Client-ID " + IMGUR_CLIENT_ID)
            .url("https://api.imgur.com/3/image")
            .post(requestBody)
            .build();

        Response response = client.newCall(request).execute();
        if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

        System.out.println(response.body().string());
    }



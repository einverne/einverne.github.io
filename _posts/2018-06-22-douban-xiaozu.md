---
layout: post
title: "douban 小组接口研究"
tagline: ""
description: ""
category: 经验总结
tags: [douban, api, app,]
last_updated:
---


## 豆瓣

    curl -X GET \
      'https://frodo.douban.com/api/v2/group/622198/topics?count=30&sortby=new&os_rom=android&apikey=0dad551ec0f84ed02907ff5c42e8ec70&channel=Google_Market&udid=5e4159565b89f86cccda&_sig=YWtLhd6UEq%2Bh7xDWs%3D&_ts=1529656502' \
      -H 'Cache-Control: no-cache' \
      -H 'Host: frodo.douban.com' \
      -H 'User-Agent: api-client/1 com.douban.frodo/5.26.0(134) Android/23 product/OnePlus3 vendor/One model/ONE rom/android  network/wifi'

python

    import requests

    url = "https://frodo.douban.com/api/v2/group/622198/topics"

    querystring = {"count":"30","sortby":"new","os_rom":"android","apikey":"0dad2907ff5c42e8ec70","channel":"Google_Market","udid":"5e3fff058b89f86cccda","_sig":"YWtLhDWs%3D","_ts":"1529656502"}

    headers = {
        'User-Agent': "api-client/1 com.douban.frodo/5.26.0(134) Android/23 product/OnePlus3 vendor/One model/ rom/android  network/wifi",
        'Host': "frodo.douban.com",
        'Cache-Control': "no-cache",
        'Postman-Token': "1c40a79a-90ba-6d85aeb074e8"
        }

    response = requests.request("GET", url, headers=headers, params=querystring)

    print(response.text)

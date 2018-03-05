---
layout: post
title: "使用Python控制Headless Chrome"
tagline: ""
description: ""
category: 学习笔记
tags: [chrome, headless-chrome, linux, python,]
last_updated: 
---

首先要解释一下 Headless Chrome，通俗的讲就是运行一个没有GUI的Chrome，在 Headless Chrome 出现以前有 [PhantomJS](https://github.com/ariya/phantomjs) ，但是自从 Headless Chrome 出现之后 PhantomJS 活跃度下降，所以维护者就[宣布](https://github.com/ariya/phantomjs/issues/15344) 了停止继续开发。那么 Headless Chrome 能够什么呢？自动化测试，网页截图，网络调试，爬虫等等任务。Google 说[在可预见的未来会一直维护](https://youtu.be/GivjumRiZ8c)。

关于 Headless Chrome 官方有两篇教程

- Getting Started with Headless Chrome <https://developers.google.com/web/updates/2017/04/headless-chrome>
- Headless Chromium readme <https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md>

在 Headless Chrome 之前使用 Python 可以结合Chrome推出的 chromedriver 来操作 PhantomJS，那么现在有了Chrome的Headless模式怎么来控制Chrome就是这篇文章要讲的内容。

## Chrome DevTools Protocol
在此之前几个重要的网址:

- Chrome DevTools Protocol <https://github.com/ChromeDevTools/devtools-protocol>
- API 文档 <https://chromedevtools.github.io/devtools-protocol/>

Google官方维护了一份协议叫做 Chrome DevTools Protocol，只要是实现了这一份协议就能够编程来控制Chrome，Chrome 自带的开发者工具其实也是这一份协议的[实现](https://developers.google.com/web/tools/chrome-devtools/)。
    
再看几个 Chrome [Devtools Protocol](https://chromedevtools.github.io/devtools-protocol/) 中的概念：

- Browser 实例可以拥有多个 Page
- Page 拥有至少一个 frame: main frame， 其他的 frame 可能被网页标记 iframe 和 frame 创建
- Frame 拥有一个可执行的上下文，在该上下文中 JavaScript 可以被执行，Frame 中也可能有浏览器扩展 [extensions](https://developer.chrome.com/extensions) 产生的内容被执行

可以用这张[图](https://docs.google.com/drawings/d/1Q_AM6KYs9kbyLZF-Lpp5mtpAWth73Cq8IKCsWYgi8MM/edit?usp=sharing) 来显示其结构。

常用API 

- Browser 浏览器版本，关闭，命令行等等管理操作
- [Page](https://chromedevtools.github.io/devtools-protocol/tot/Page) 该域包含和页面相关接口，页面加载，资源内容，截图，打印等
- Network 网络请求，Cookie，缓存，证书等内容
- DOM 文档DOM的获取，修改，删除等
- [Runtime](https://chromedevtools.github.io/devtools-protocol/tot/Runtime) 该域下暴露 JavaScript 相关运行时接口，可以用来执行代码

## 本地启动 Headless Chrome

本地启动 Headless Chrome 可以参考[这篇文章](/post/2017/10/headless-chrome-puppeteer.html)。

如果需要使用 Docker 来启动Headless Chrome 也可以使用

    docker run -it --rm --name alpine-chrome -p 9222:9222 einverne/alpine-chrome

更加具体的使用介绍可以查看 [GitHub](https://github.com/einverne/dockerfile/tree/master/headless-chrome)

启动之后可以访问: <http://localhost:9222/json> 来查看是否启动成功。

## pychrome
[pychrome](https://github.com/fate0/pychrome) 是 Chrome Devtools Protocol 的 Python 实现，其他语言的实现，可以查看这个[项目](https://github.com/ChromeDevTools/awesome-chrome-devtools#chrome-devtools-protocol)。Chrome官方推荐js/nodejs的实现 [chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface) 还有 node.js 实现的更高层级的 [Puppeteer](https://github.com/GoogleChrome/puppeteer/)。

这里主要摘录几个常用的操作

### 截图
使用 `Page.captureScreenshot`

    def screenshot(browser, url, filename='image.png'):
        tab = browser.new_tab()
        tab.start()
        tab.call_method('Page.navigate', url=url, _timeout=5)
        tab.wait(10)
        # 截取当前Tab屏幕，结果为图片内容Base64
        screen_base64 = tab.call_method("Page.captureScreenshot")
        image_data = screen_base64.get('data', '')
        with open(filename, 'wb') as f:
            f.write(image_data.decode('base64'))
        tab.stop()
        browser.close_tab(tab) 

### 打印PDF
同样使用 `Page` 下方法

    def print_to_pdf(browser, url, filename='file.pdf'):
        tab = browser.new_tab()
        tab.start()
        tab.call_method('Page.navigate', url=url, _timeout=5)
        tab.wait(10)
        pdf_data = tab.call_method('Page.printToPDF', landscape=False).get('data')
        with open(filename, 'wb') as f:
            f.write(pdf_data.decode('base64'))
        tab.stop()
        browser.close_tab(tab)


### 向下翻页

    def perform_input(browser):
        """向下浏览页面"""
        tab = browser.new_tab()
        tab.start()
        tab.Page.enable()
        tab.Page.navigate(url='https://www.douban.com/', _timeout=5)
        tab.wait(5)
        # 更多 keycode 可以参考 https://msdn.microsoft.com/en-us/library/dd375731(VS.85).aspx
        keycode = int(0x22)
        tab.Input.dispatchKeyEvent(type='keyDown', windowsVirtualKeyCode=keycode, nativeVirtualKeyCode=keycode)
        tab.wait(3)
        screen_base64 = tab.call_method("Page.captureScreenshot")
        image_data = screen_base64.get('data', '')
        with open("keyDown.png", 'wb') as f:
            f.write(image_data.decode('base64'))
        tab.stop()
        browser.close_tab(tab)

### 获取网页HTML
获取动态网页的网页内容，等待JS执行完成后获取HTML

    def get_html(browser, url):
        tab = browser.new_tab()
        tab.start()
        tab.call_method('Page.navigate', url=url, _timeout=5)
        tab.wait(10)
        html = tab.Runtime.evaluate(expression="document.documentElement.outerHTML")
        tab.stop()
        browser.close_tab(tab)
        return html['result']['value']

### 操纵网页元素注入JS
下面这段代码是访问 baidu，输入关键字，并点击搜索按钮，解析搜索结果并打印

    def perform_click(browser):
        tab = browser.new_tab()

        # def loading_finished(**kwargs):
        #     print "[loading finished]"
        #
        # # when HTTP request has finished loading
        # tab.set_listener("Network.loadingFinished", loading_finished)

        tab.start()

        # call method
        # tab.Network.enable()
        tab.Network.enable()
        tab.Page.enable()
        tab.Runtime.enable()

        def dom_content_event_fired(**kwargs):
            print "[content] dom content event fired"
            tab.DOM.enable()
            root = tab.DOM.getDocument()
            root_node_id = root.get('root', {}).get('nodeId', '')
            # 找到输入框
            input_box = tab.DOM.querySelector(nodeId=root_node_id, selector='#kw')
            # tab.DOM.setNodeValue(nodeId=input_box, value='hello')
            tab.Runtime.evaluate(expression='document.getElementById("kw").value="Chrome"', )
            # 找到搜索按钮
            search_btn = tab.DOM.querySelector(nodeId=root_node_id, selector='#su')
            remote_node = tab.DOM.resolveNode(nodeId=search_btn.get('nodeId', ''))
            # 执行点击
            tab.Runtime.callFunctionOn(functionDeclaration='(function() { this.click(); })',
                                       objectId=remote_node.get('object', {}).get('objectId', {}))
            tab.wait(3)
            # 输出结果
            html = tab.Runtime.evaluate(expression="document.documentElement.outerHTML")
            html_value = html.get('result', {}).get('value', '').encode('utf-8')
            soup = BeautifulSoup(html_value, 'html.parser')
            l = soup.select('h3 > a')
            for result in l:
                print result.text
                print result['href']

            screen_base64 = tab.call_method("Page.captureScreenshot")
            image_data = screen_base64.get('data', '')
            with open("test.png", 'wb') as f:
                f.write(image_data.decode('base64'))

            # tab.DOM.performSearch(query='xpath', includeUserAgentShadowDOM=True)
            # stop the tab (stop handle events and stop recv message from chrome)
            tab.stop()

            # close tab
            browser.close_tab(tab)

        tab.set_listener("Page.domContentEventFired", dom_content_event_fired)

        # tab.call_method("Page.reload", ignoreCache=False)
        tab.call_method("Page.navigate", url='https://www.baidu.com', _timeout=5)
        tab.wait(20)



完整的代码可以参考 [GitHub](https://github.com/einverne/dockerfile/tree/master/headless-chrome/example)

## 其他可学习的网站

[这篇](https://blog.phantombuster.com/web-scraping-in-2017-headless-chrome-tips-tricks-4d6521d695e8)文章讲述了使用 nodejs 的库 [NickJS](https://nickjs.org/)来爬取网站的要点。

[这篇](https://blog.tech4startup.org/2017/08/31/chrome-headless-a-whole-new-world-of-web-scraping/)使用 nodejs 的chrome-remote-interface，来抓取网页。

其他

- https://stackoverflow.com/questions/28430479/using-google-chrome-remote-debugging-protocol
- https://blog.phantombuster.com/web-scraping-in-2017-headless-chrome-tips-tricks-4d6521d695e8
- https://stackoverflow.com/questions/7848878/how-to-use-google-chrome-remote-debugging-protocol-in-http
- https://github.com/auchenberg/devtools-remote
- https://github.com/auchenberg/chrome-devtools-app
- https://intoli.com/blog/running-selenium-with-headless-chrome
- https://duo.com/blog/driving-headless-chrome-with-python


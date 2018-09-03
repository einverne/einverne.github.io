---
layout: post
title: "Appium 介绍"
tagline: ""
description: ""
category: 学习笔记
tags: [appium, android, ios, web]
last_updated:
---

在接触爬虫的时候遇到了这个工具，看官网介绍应该可以归纳总结为：

- 开源的移动端自动化测试框架
- 跨平台，Linux，Mac，Windows 通吃
- 支持 Android，iOS，混合应用，Web 应用

## 设计初衷
设计哲学

- 不需要为了自动化而重新编译修改 App
- 不限定在某个语言或者框架， C/S 架构，Client 端实现语言不限制
- 不重造轮子，扩展 webdriver 协议
- 开源

Jason Huggins 在 2004 年发起了 Selenium 项目，Jason 和他所在的团队采用 Javascript 编写一种测试工具来验证浏览器页面的行为。关于 Selenium 的命名比较有意思，当时 QTP mercury 是主流的商业自化工具，是化学元素汞，而 Selenium 是开源自动化工具，是化学元素硒，硒可以对抗汞。

在 2006 年的时候，Google 的工程师 Simon Stewart 发起了 WebDriver 的项目。WebDriver 是通过原生浏览器支持或者浏览器扩展来直接控制浏览器。

## 技术架构

- iOS [UIAutomation](https://developer.apple.com/library/ios/documentation/DeveloperTools/Reference/UIAutomationRef/_index.html)
- Android 4.2+ [UIAutomator](http://developer.android.com/tools/help/uiautomator/index.html)  2.3+ [Google Instrumentation](http://developer.android.com/reference/android/app/Instrumentation.html)

## 安装
Appium Server

    npm install -g appium

client 可以参考这里，支持 Ruby，Python，Java，JS，OC，PHP，C# 等等

- <http://appium.io/docs/en/about-appium/appium-clients/index.html>

也可以选择 Appium Desktop

- <https://github.com/appium/appium-desktop>

环境安装检查，[appium-doctor](https://github.com/appium/appium-doctor)

    $ appium-doctor
    info AppiumDoctor Appium Doctor v.1.4.3
    info AppiumDoctor ### Diagnostic starting ###
    info AppiumDoctor  ✔ The Node.js binary was found at: /usr/bin/node
    info AppiumDoctor  ✔ Node version is 8.11.4
    info AppiumDoctor  ✔ ANDROID_HOME is set to: /home/einverne/Android/Sdk
    info AppiumDoctor  ✔ JAVA_HOME is set to: /usr/local/jdk1.8.0_131
    info AppiumDoctor  ✔ adb exists at: /home/einverne/Android/Sdk/platform-tools/adb
    info AppiumDoctor  ✔ android exists at: /home/einverne/Android/Sdk/tools/android
    info AppiumDoctor  ✔ emulator exists at: /home/einverne/Android/Sdk/tools/emulator
    info AppiumDoctor  ✔ Bin directory of $JAVA_HOME is set
    info AppiumDoctor ### Diagnostic completed, no fix needed. ###
    info AppiumDoctor
    info AppiumDoctor Everything looks good, bye!
    info AppiumDoctor

总结来看：

- JDK，配置 `JAVA_HOME`
- Android SDK，配置 `ANDROID_HOME`
- appium 自身，npm 或者 desktop 随意
- appium client
- Android 模拟器或者真机

## 几个概念

### Appium Desired Capabilities
大致可以认为 k-v 的配置，具体可以参考[官网](http://appium.io/docs/en/writing-running-appium/caps/)




## SDK 辅助工具
Android SDK 提供了一些辅助工具，大都在 SDK tools 目录下，不同系统可能命名方式有些差异，但基本都能够识别。

### uiautomatorviewer
工具在 `Sdk/tools/bin/uiautomatorviewer` 下， 这是 android sdk 自带的工具可以用来查看控件的属性，id，class 等等，也可以用来查看 package name。

如果目标设备的 API Level 低于 18 则 uiautomatorviewer 不能获得对应的 sesource id，只有等于大于 18 的时候才能使用。

![ui automator viewer](/assets/ui-automator-viewer-2018-09-03-18-46-01.png)


### Android Device Monitor
工具在 `sdk/tools/monitor`

![android device monitor](/assets/android-device-monitor-2018-09-04-09-56-56.png)

## 实例

### 查看应用包名
查看包名的方式有很多，有很多 root 权限的应用都可以直接查看包名

### 查看应用 Activity 名
上面提到的 uiautomatorviewer 是以一种方式，其他

- 源码
- 反编译
- Xposed Inspeckage
- `adb shell dumpsys activity activities | grep 'Hist #'` 其他常用的 [adb 命令](/post/2016/09/useful-adb-command.html)

### 查找控件
通过上面提到的 uiautomatorviewer 来查看界面中的控件 ID

`resource-id` 的方式比较简单，在界面中找到 resource-id 即可

    find_element_by_id('com.google.android.calculator:id/digit_1')                # 通过 resource-id 来查找

同理， uiautomatorviewer 中的 text 就是要找的 name，但是测试通过 name 找失败的可能性很大。

    find_element_by_name()              # 通过名字查找

同样通过 `class` 查找

    find_element_by_class_name('android.widget.TextView')   # 通过类名查找

同样可以使用 Accessibility 来获取控件，要找的是控件的 `content-desc` 属性：

    e_minus = self.driver.find_element_by_accessibility_id('einvernenus')
    e_minus.click()

通过 uiautomator

    e5 = self.driver.find_element_by_android_uiautomator("new UiSelector().text(\"5\")")
    e5.click()

### 模拟按键点击
在找到控件之后可以使用

    login_btn.click()

### 模拟输入

    user_input.send_keys('1234')


### 模拟返回键

    driver.press_keycode(4)

keycode 的定义可以在 [Android KeyEvent](https://developer.android.com/reference/android/view/KeyEvent) 中找到。

常用键 code

    KEYCODE_CALL 拨号键 5
    KEYCODE_ENDCALL 挂机键 6
    KEYCODE_HOME 按键 Home 3
    KEYCODE_MENU 菜单键 82
    KEYCODE_BACK 返回键 4
    KEYCODE_SEARCH 搜索键 84
    KEYCODE_CAMERA 拍照键 27
    KEYCODE_FOCUS 拍照对焦键 80
    KEYCODE_POWER 电源键 26
    KEYCODE_NOTIFICATION 通知键 83
    KEYCODE_MUTE 话筒静音键 91
    KEYCODE_VOLUME_MUTE 扬声器静音键 164
    KEYCODE_VOLUME_UP 音量增加键 24
    KEYCODE_VOLUME_DOWN 音量减小键 25

    KEYCODE_ENTER 回车键 66
    KEYCODE_ESCAPE ESC 键 111
    KEYCODE_DPAD_CENTER 导航键 确定键 23
    KEYCODE_DPAD_UP 导航键 向上 19
    KEYCODE_DPAD_DOWN 导航键 向下 20
    KEYCODE_DPAD_LEFT 导航键 向左 21
    KEYCODE_DPAD_RIGHT 导航键 向右 22
    KEYCODE_MOVE_HOME 光标移动到开始键 122
    KEYCODE_MOVE_END 光标移动到末尾键 123
    KEYCODE_PAGE_UP 向上翻页键 92
    KEYCODE_PAGE_DOWN 向下翻页键 93
    KEYCODE_DEL 退格键 67
    KEYCODE_FORWARD_DEL 删除键 112
    KEYCODE_INSERT 插入键 124
    KEYCODE_TAB Tab 键 61
    KEYCODE_NUM_LOCK 小键盘锁 143
    KEYCODE_CAPS_LOCK 大写锁定键 115
    KEYCODE_BREAK Break/Pause 键 121
    KEYCODE_SCROLL_LOCK 滚动锁定键 116
    KEYCODE_ZOOM_IN 放大键 168
    KEYCODE_ZOOM_OUT 缩小键 169

    KEYCODE_ALT_LEFT Alt+Left
    KEYCODE_ALT_RIGHT Alt+Right
    KEYCODE_CTRL_LEFT Control+Left
    KEYCODE_CTRL_RIGHT Control+Right
    KEYCODE_SHIFT_LEFT Shift+Left
    KEYCODE_SHIFT_RIGHT Shift+Right

    KEYCODE_0 按键’0’ 7
    KEYCODE_1 按键’1’ 8
    KEYCODE_2 按键’2’ 9
    KEYCODE_3 按键’3’ 10
    KEYCODE_4 按键’4’ 11
    KEYCODE_5 按键’5’ 12
    KEYCODE_6 按键’6’ 13
    KEYCODE_7 按键’7’ 14
    KEYCODE_8 按键’8’ 15
    KEYCODE_9 按键’9’ 16
    KEYCODE_A 按键’A’ 29
    KEYCODE_B 按键’B’ 30
    KEYCODE_C 按键’C’ 31
    KEYCODE_D 按键’D’ 32
    KEYCODE_E 按键’E’ 33
    KEYCODE_F 按键’F’ 34
    KEYCODE_G 按键’G’ 35
    KEYCODE_H 按键’H’ 36
    KEYCODE_I 按键’I’ 37
    KEYCODE_J 按键’J’ 38
    KEYCODE_K 按键’K’ 39
    KEYCODE_L 按键’L’ 40
    KEYCODE_M 按键’M’ 41
    KEYCODE_N 按键’N’ 42
    KEYCODE_O 按键’O’ 43
    KEYCODE_P 按键’P’ 44
    KEYCODE_Q 按键’Q’ 45
    KEYCODE_R 按键’R’ 46
    KEYCODE_S 按键’S’ 47
    KEYCODE_T 按键’T’ 48
    KEYCODE_U 按键’U’ 49
    KEYCODE_V 按键’V’ 50
    KEYCODE_W 按键’W’ 51
    KEYCODE_X 按键’X’ 52
    KEYCODE_Y 按键’Y’ 53
    KEYCODE_Z 按键’Z’ 54

### 其他
锁屏，解锁

    lock()
    unlock()

隐藏键盘

    hide_keyboard()

获取文件

    pull_file()

推送文件

    push_file()

打开任意的 activity

    def start_activity(self, app_package, app_activity, **opts):
        """Opens an arbitrary activity during a test. If the activity belongs to
        another application, that application is started and the activity is opened.

        This is an Android-only method.

        :Args:
        - app_package - The package containing the activity to start.
        - app_activity - The activity to start.
        - app_wait_package - Begin automation after this package starts (optional).
        - app_wait_activity - Begin automation after this activity starts (optional).
        - intent_action - Intent to start (optional).
        - intent_category - Intent category to start (optional).
        - intent_flags - Flags to send to the intent (optional).
        - optional_intent_arguments - Optional arguments to the intent (optional).
        - dont_stop_app_on_reset - Should the app be stopped on reset (optional)?
        """

打开通知栏 Android only

    open_notifications()

模拟摇晃设备

    shake()

### 操作应用
包括关闭应用，重启应用，让应用到后台，安装、卸载应用，终止应用。

    import time
    import unittest

    from appium import webdriver


    class AppAndroidTests(unittest.TestCase):

        def setUp(self):
            # 测试初始化
            desired_caps = {
                'platformName': 'Android',
                'platformVersion': '6.0.1',
                'deviceName': 'OnePlus3',
                'udid': '2dd11c6e',
                'automationName': 'Appium',
                'app': '/home/einverne/android/ApiDemos-debug.apk',
                'appPackage': 'io.appium.android.apis',
                'appActivity': '.ApiDemos'
            }
            self.driver = webdriver.Remote('http://localhost:4723/wd/hub',
                                           desired_caps)

            self.app_id = 'io.appium.android.apis'

        def tearDown(self):
            # 用例结束时调用
            time.sleep(5)
            self.driver.quit()

        def test_apk_install(self):
            if not self.driver.is_app_installed(self.app_id):
                self.driver.install_app("/home/einverne/android/ApiDemos-debug.apk")
            else:
                print("demo apis installed")
                self.driver.remove_app(self.app_id)

        def test_apk_close(self):
            self.driver.close_app()
            time.sleep(2)
            self.driver.launch_app()
            time.sleep(2)
            self.driver.background_app(2)
            time.sleep(4)
            self.driver.launch_app()
            time.sleep(2)
            self.driver.terminate_app(self.app_id)
            time.sleep(2)
            self.driver.reset()


    if __name__ == '__main__':
        suite = unittest.TestLoader().loadTestsFromTestCase(AppAndroidTests)
        unittest.TextTestRunner(verbosity=2).run(suite)

## 点击事件
各种点击事件，包括短按，长按，滑动等等，主要注意的是，界面的坐标是向下的象限，也就是左上角是 (0,0)，右下角是类似 (1080,1920) 这样的坐标。

    import time
    import unittest

    from appium import webdriver
    from appium.webdriver.common.touch_action import TouchAction


    class PressAndroidTests(unittest.TestCase):
        # 主要演示点击，长按，移动等操作
        def setUp(self):
            # 测试初始化
            desired_caps = {
                'platformName': 'Android',
                'platformVersion': '6.0.1',
                'deviceName': 'OnePlus3',
                'udid': '2dd11c6e',
                'automationName': 'Appium',
                'appPackage': 'com.google.android.calculator',
                'appActivity': 'com.android.calculator2.Calculator'
            }
            self.driver = webdriver.Remote('http://localhost:4723/wd/hub',
                                           desired_caps)
            time.sleep(2)

        def tearDown(self):
            # 用例结束时调用
            time.sleep(5)
            self.driver.quit()

        def test_press(self):
            for i in range(5):
                touch_action = TouchAction(self.driver)

                # release() 取消屏幕指针
                # perform() 执行操作发送命令
                touch_action.press(x=300, y=1700).release()
                touch_action.perform()

            e_del = self.driver.find_element_by_accessibility_id('delete')
            # tap
            time.sleep(2)
            tap_action = TouchAction(self.driver)
            tap_action.tap(e_del).release().perform()

            time.sleep(2)
            # long press
            del_action = TouchAction(self.driver)
            del_action.long_press(e_del, 2)
            del_action.release().perform()

            time.sleep(2)
            arrow = self.driver.find_element_by_id(
                'com.google.android.calculator:id/arrow')
            # move
            move_action = TouchAction(self.driver)
            move_action.press(arrow)
            move_action.move_to(x=500, y=1310)
            move_action.release().perform()

            time.sleep(2)


    if __name__ == '__main__':
        suite = unittest.TestLoader().loadTestsFromTestCase(PressAndroidTests)
        unittest.TextTestRunner(verbosity=2).run(suite)

## reference

- 官网 <http://appium.io/>
- <https://github.com/appium/appium-desktop>
- 官方的例子还是不错的 <https://github.com/appium-boneyard/sample-code/blob/master/sample-code/examples/python/android_simple.py>
- <https://github.com/appium/python-client>
- <http://www.testclass.net/selenium_python/selenium-history/>
- <https://blog.csdn.net/keeng2008/article/details/51426179>
- <https://nishantverma.gitbooks.io/appium-for-android/executing_test_on_real_devices/>

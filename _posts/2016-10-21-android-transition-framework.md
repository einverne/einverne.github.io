---
layout: post
title: "Android 过渡动画框架"
tagline: ""
description: ""
category: Android
tags: [Android, transition, animation, AndroidDev]
last_updated: 
---

为了帮助视图层次内部和视图之间的过渡更加容易实现动画效果，Android 提供了 Transition 框架。这一套框架能够在视图之间提供一种或者多种动画过渡效果。过渡动画要解决的另一个主要问题就是对同一场景中的多个 View 做动画，弥补了之前Android 在动画方面的缺失。

这一套框架提供如下功能：

- Group-level 动画
    在同一视图层次中一种或者多种动画效果

- Transition-based 动画
    在初始场景和终止场景之间动画

- Built-in 动画
    内置普通效果动画，包括 fade out 和 movement

- Resource 文件支持
    从 layout 资源文件中加载视图以及内置动画资源

- Lifecycle callbacks
    随心所欲的控制动画的过程

Transition API 在 Android 5.0 及以上被引入，但是在 4.4 Kitkat 时就引入了 Scenes 和 Transitions 的概念。在 Android 4.0 API level 14 及以上，可以使用 android.support.transition 包中内容


## 创建场景 {#create-scene}

Scene 保存视图状态及层次结构，包括所有的视图及其属性。 Transition 框架能够从场景到场景进行过渡动画。初始场景（Staring scene）经常是当前的视图层次，而结束场景（ending scene）通常由用户从 layout 创建或者用代码从一组视图中创建。

### 从 Layout 创建 Scene

利用静态方法 `Scene.getSceneForLayout()` 

    // Create the scene root for the scenes in this app
    mSceneRoot = (ViewGroup) findViewById(R.id.scene_root);

    // Create the scenes
    mAScene = Scene.getSceneForLayout(mSceneRoot, R.layout.a_scene, this);
    mAnotherScene =
        Scene.getSceneForLayout(mSceneRoot, R.layout.another_scene, this);

或者使用构造函数构造：

    Scene mScene;

    // Obtain the scene root element
    mSceneRoot = (ViewGroup) mSomeLayoutElement;

    // Obtain the view hierarchy to add as a child of
    // the scene root when this scene is entered
    mViewHierarchy = (ViewGroup) someOtherLayoutElement;

    // Create a scene
    mScene = new Scene(mSceneRoot, mViewHierarchy);

### 场景间动画

一般情况下 Android 系统会自动在场景间动画，自定义动画可省略，但是如果想自定义动画，可以在场景退出或者进入的时候自定义动画，需要注意以下两点：

- 动画视图不在同一个视图层次
- Transition 框架不能给 Listview 自动创建动画，Transition 框架的限制

可以使用 `Scene.setExitAction(Runnable action)` 或者 `Scene.setEnterAction(Runnable action)` 来自定义进入或者退出的动作。


### Scene 总结

Scene 类中几个重要的方法：

- 构造方法，`Scene(ViewGroup sceneRoot, View layout)`。 从 Layout 中创建 Scene，当调用 `enter()` 方法时将 sceneRoot 下子view 全部移除并将新 Layout 中内容填充。
- 静态方法，创建新 Scene `getSceneForLayout(ViewGroup sceneRoot, int layoutId, Context context)`
- enter() 方法 exit() 方法
- setEnterAction(Runnable action) 和 setExitAction(Runnable action) 

## Transition
在 Transition 框架中，动画在开始和结束场景间创建了一系列动画帧。


### 创建 Transition

系统提供的内置 transition 有如下：

Class       |      Tag         |  Attributes         |   Effect   |
-----------| ---------------|-------------------| -------------|
AutoTransition  |  <autoTransition/>   |   -  |  默认过渡动画，Fade out 渐隐， move 位移 和 resize 大小缩放，fade in 渐显 ，按顺序 |
Fade      |  <fade/> |   android:fadingMode="[fade_in fade_out  fade_in_out]"  |  fade_in_out (default) 渐隐之后跟随者 渐显 | 
ChangeBounds  |  <changeBounds/>  |  - |  位移和缩放 | 


### 通过资源文件创建

也通过资源文件即可修改过渡效果，避免大幅度修改 Activity 中代码。并且通过资源文件方式创建有效地将复杂的动画和代码文件分离。

通过如下步骤添加过渡动画资源：

- 添加 `res/transition/` 目录
- 在该目录下创建 XML 资源
- 在 XML 文件中添加内置的过渡动画子节点

例如如下资源文件则指定了渐隐渐显动画， `res/transition/fade_transition.xml` ：

    <fade xmlns:android="http://schemas.android.com/apk/res/android" />

利用如下代码片段从资源文件中创建 Transition：

    Transition mFadeTransition =
            TransitionInflater.from(this).
            inflateTransition(R.transition.fade_transition);

### 通过代码创建 Transition

可以在代码中动态地创建过渡效果，可以通过非常少的代码创建。通过直接调用 Transition 的子类构造函数直接创建，例如：

    Transition mFadeTransition = new Fade();


### 执行 Transition

直接调用 `TransitionManager.go()` 静态方法，并提供一个终止场景：

    TransitionManager.go(mEndingScene, mFadeTransition);


如果不指定 transition ，则系统自动套用默认的转场动画。



### 选择特定目标

转场动画默认对所有的Views进行动画，如果只希望某一些特定的 Views 动画，或者某一些不做动画。 在 transition 中，每一个视图都被称作一个 target，但是得注意，只有在Scene 中的views 才被称作 target。

可以使用 `removeTarget()` 来从 transition 中移除某一个 view，或者使用 `addTarget()` 来给 Transition 添加一个 view。

### 使用多重动画

如下定义的 transitionSet 和 AutoTransition 表现一致：

    <transitionSet xmlns:android="http://schemas.android.com/apk/res/android"
        android:transitionOrdering="sequential">
        <fade android:fadingMode="fade_out" />
        <changeBounds />
        <fade android:fadingMode="fade_in" />
    </transitionSet>

代码中可以使用 `TransitionInflater.from()` 来加载 TransitionSet ，因为 TransitionSet 继承自 Transition，因此可以像使用 Transition 一样使用 TransitionSet。


### 不使用 Scene 来使用 Transition

改变视图层次并不是唯一改变UI的方式，同样也可以通过添加、修改、移除子view来对当前的视图作出修改。或者当两个场景非常相似，为了避免维护两份近乎一致的视图层次，可以只维护一份，并做一些微小的调整。



此时可以使用  delayed transition 来在两个状态之间进行转换。Transition 系统自动选择当前的视图层次作为初始状态，并记录用户对视图的修改，然后应用为终止状态，并在之后进行动态地变化。

在单一视图中使用 delay transition ：

- 调用 ` TransitionManager.beginDelayedTransition()` 来提供提供一个父view包括所有的待变化的view，此时系统自动保存当前传入的所有 views 的状态及属性
- 修改子views ，系统会记录该views 的变化
- 当系统重绘时系统自动在原始及新状态间做动画


## 创建自定义 Transitions

自定义过渡动画（custom transition）可以实现区别于内置转场动画的效果。比如，你可以定义一个动画来将文字和输入框的前景颜色变成灰色来表示当前禁止输入。

### 继承 Transition 类

继承 Transition 类，并实现如下方法：

    public class CustomTransition extends Transition {

        @Override
        public void captureStartValues(TransitionValues values) {}

        @Override
        public void captureEndValues(TransitionValues values) {}

        @Override
        public Animator createAnimator(ViewGroup sceneRoot,
                                       TransitionValues startValues,
                                       TransitionValues endValues) {}
    }


Transition 动画使用 property 动画系统，属性动画动态地修改视图的属性，因此得知道初始和终止的值。

### captureStartValues

系统会对初始场景中的每一个view调用 `captureStartValues(transitionValues)` ，参数 TransitionValues 对象包含了一个指向 view 的引用和一个保存view状态的 Map 实例。在自己的实现中，获取这些属性，并将这些属性传回给map。

为了避免key 值和已经拥有的key值矛盾，可以使用如下的 TransitionValues 键的形式：

    package_name:transition_name:property_name

例如下面的例子：

    public class CustomTransition extends Transition {

        // Define a key for storing a property value in
        // TransitionValues.values with the syntax
        // package_name:transition_class:property_name to avoid collisions
        private static final String PROPNAME_BACKGROUND =
                "com.example.android.customtransition:CustomTransition:background";

        @Override
        public void captureStartValues(TransitionValues transitionValues) {
            // Call the convenience method captureValues
            captureValues(transitionValues);
        }


        // For the view in transitionValues.view, get the values you
        // want and put them in transitionValues.values
        private void captureValues(TransitionValues transitionValues) {
            // Get a reference to the view
            View view = transitionValues.view;
            // Store its background property in the values map
            transitionValues.values.put(PROPNAME_BACKGROUND, view.getBackground());
        }
        ...
    }

### captureEndValues

系统会给终止场景中的每一个target view自动调用 ` captureEndValues(TransitionValues)` ，其他方面，`captureEndValues()` 和 `captureStartValues()` 表现一致。



### animator

在初始和终止视图层次间进行动画，提供一个 animator ，通过复写 `createAnimator()` ，当系统调用此方法时，他将 root view 和开始和结束 TransitionValues 传入。系统调用 `createAnimator()` 方法的次数由开始和终止场景之间的变化决定。

## Android 系统自带 Transition

虽然教程上只罗列了一些 Transition ，但是看文档，还是能发现不少 Transition 的直接子类。


### Transition

Transition 在 XML 定义时有如下属性：



- android:duration 动画时长毫秒
- android:interpolator  动画使用的 interpolator 
- android:matchOrder 过渡动画执行顺序
- android:startDelay 在过渡动画之前延迟时间 毫秒



### TransitionSet

TransitionSet 在 XML 中有如下属性：

- android:transitionOrdering 过渡动画执行顺序，有两种值， together 和 sequential

以下转场动画中原生提供的包括 Fade，Slide，Explode，但场景之间存在共享元素时，有如下的转场动画 changeBound，changeClipBounds，changeImageTransform，ChangeTransform，ChangeScroll。

### Fade
渐隐渐显动画

Fade 在 XML 中有如下属性：

- android:fadingMode 渐变模式， `fade_in`, `fade_out` , `fade_in_out` ，默认为 `fade_in_out` 



### Slide
元素从四个方向滑动进入

Slide 属性：

- android:slideEdge 从那边滑动出，有 left, top, right, bottom, start, end 模式

### Explode

屏幕中间上下移走

### ChangeBounds

通过获取前后Scene 中 target view 的边界，并对这些 view 做动画，改变 View 的大小

### ChangeClipBounds

获取前后 Scene 中  `getClipBounds()`  的边界，并做动画，有如下属性：

- `android:resizeClip` 通过改变 clipBounds 来改变 view，而不是改变view 自身的大小

### ChangeImageTransform

通过获取开始和结束时 Scene 中 ImageView 的 matrix ，并对他们做动画。 和 ChangeBounds 一起使用，来对 ImageView 改变大小，形状，和 ScaleType 来使动画更加流畅。

### ChangeTransform

获取 Scene 中的尺寸和旋转角度，并做动画，有如下属性：

- `android:reparent`  追踪父view 的变化
- `android:reparentWithOverlay` A parent change should use an overlay or affect the transform of the transitionining View.


### ChangeScroll
改变滑动位置

下面分享一个 transitionSet 的 XML 语法：

    <transitionSet xmlns:android="http://schemas.android.com/apk/res/android"
         android:transitionOrdering="sequential">
        <changeBounds/>
        <fade android:fadingMode="fade_out" >
            <targets>
                <target android:targetId="@id/grayscaleContainer" />
            </targets>
        </fade>
    </transitionSet>

以上就是文档中对 Transition 的解释，关于自定义 Transition 还可以具体展开细讲，但是因为 Transition API 要求的 API 版本比较高，基本 Android 5.0 及以上才可以很好的支持，所以目前使用并不广，但是相信不久以后就能看到越来越多的转场动画了。

## reference

- <https://developer.android.com/training/transitions/index.html>
- <https://medium.com/@andkulikov/animate-all-the-things-transitions-in-android-914af5477d50#.4exs3bozi>
- 强烈推荐此lib <https://github.com/andkulikov/Transitions-Everywhere>

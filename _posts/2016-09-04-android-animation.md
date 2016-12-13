---
layout: post
title: "Android Animation"
tagline: ""
description: "Android 动画实现"
category: Android
tags: [Android, AndroidDev, Animation,]
last_updated: 
---


Android 的动画实现有不同的方式，在 3.0 以前 Android 的动画很简单只能在 View 层做，在后期版本中不断的加入动画实现，至今已经有这非常完善的动画系统了。Android 系统提供了 Property animation 和 View animation 两大动画系统。除去这两大动画系统之外，还有一类 Drawable Animation， 允许加载 drawable 并且一帧一帧播放：

- View Animation 视图动画
- Property Animation 属性动画
- Drawable Animation 帧动画

另外官方文档也有另外一种分类方法 将 Tween Animation 补间动画 和 Frame Animation 逐帧动画归纳为 View Animation。 见[文档](https://developer.android.com/guide/topics/resources/animation-resource.html)

## View Animation

旧的动画系统，只能用来对 View 进行动画。View Animation 很简单，不过只能支持简单的缩放、平移、旋转、透明度基本的动画，且有一定的局限性。

Android中提供的 4种 View 动画：

- AlphaAnimation 透明度动画效果，可以实现渐隐渐现
- ScaleAnimation 缩放动画效果
- TranslateAnimation 位移动画效果
- RotateAnimation 旋转动画效果

以及 AnimationSet 动画集合，可以混合使用多种动画。 View Animation 都在 [view.animation](https://developer.android.com/reference/android/view/animation/package-summary.html) 包名下。


Android 系统在 3.0 之后推出了 Property Animation (属性动画)框架，属性动画可以用于任何对象，相比属性动画，View Animation (视图动画)的一个非常大的缺陷就是不具备交互性，当某个元素发生视图动画后，其响应事件的位置还依然是在动画前的地方，所以视图动画只能做普通的动画效果，避免交互的发生。但它的优点也非常明显，即效率比较高且使用方便。

视图动画使用非常简单，不仅可以通过XML文件来描述一个动画过程，同样可以使用代码来控制整个动画过程。


### 通用方法

```
animation.setDuration(long durationMillis);           // 设置动画时长
animation.setRepeatCount(int repeatCount);        // 设置动画重复次数
animation.setFillAfter(boolean);           // 动画执行完后是否停留在执行完的状态
animation.setFillBefore(boolean);                 // 动画执行前是否应用状态
animation.setStartOffset(long startOffset);          // 动画执行前的等待时间
animation.setInterpolator(Interpolator i);         // 设置动画插值
// 设置重复模式， 这个模式只有在 repeat count 大于0 或者 INFINITE 时才生效，有 RESTART 和 REVERSE 两种，RESTART 为重头播放，REVERSE  为逆向播放动画。
animation.setRepeatMode(int repeatMode);
animation.setStartTime(long startTimeMillis);      // 设置动画开始时间
animation.start();            // 开始动画
animation.startNow();           // 立即开始动画
```

启动动画的两种方式：

```
view.startAnimation(animation);

//或者设置动画之后延后开始动画

view.setAnimation(animation);
animation.start();
```

### 使用 xml 定义动画

当使用 xml 配置动画时，需要放到 res 目录下  `res/anim/`  。 xml 定义的 root 元素可以是 ：

- `<alpha>`
- `<scale>`
- `<translate>`
- `<rotate>`
- `interpolator` 元素
- `<set>` 或者 set 中包含其他 set

举例:

```
<set android:shareInterpolator="false">
    <scale
        android:interpolator="@android:anim/accelerate_decelerate_interpolator"
        android:fromXScale="1.0"
        android:toXScale="1.4"
        android:fromYScale="1.0"
        android:toYScale="0.6"
        android:pivotX="50%"
        android:pivotY="50%"
        android:fillAfter="false"
        android:duration="700" />
    <set android:interpolator="@android:anim/decelerate_interpolator">
        <scale
           android:fromXScale="1.4"
           android:toXScale="0.0"
           android:fromYScale="0.6"
           android:toYScale="0.0"
           android:pivotX="50%"
           android:pivotY="50%"
           android:startOffset="700"
           android:duration="400"
           android:fillBefore="false" />
        <rotate
           android:fromDegrees="0"
           android:toDegrees="-45"
           android:toYScale="0.0"
           android:pivotX="50%"
           android:pivotY="50%"
           android:startOffset="700"
           android:duration="400" />
    </set>
</set>
```

可以使用如下代码，从 XML 中加载动画：

```
ImageView spaceshipImage = (ImageView) findViewById(R.id.spaceshipImage);
Animation hyperspaceJumpAnimation = AnimationUtils.loadAnimation(this, R.anim.hyperspace_jump);
spaceshipImage.startAnimation(hyperspaceJumpAnimation);
```

接下来就分别看一下不同 View Animation 的使用。

### AlphaAnimation

AlphaAnimation 动画，可实现淡入淡出。

```
AlphaAnimation(float fromAlpha, float toAlpha)

```
参数说明：float 设置透明度渐变动画， 1.0 完全不透明，  0.0 是完全透明

然后利用 View 的 startAnimation 方法就可以使用。

### RotateAnimation

旋转动画，可以在 X-Y 平面设置旋转的动画，可以指定旋转中心， (0,0) 表示 top left 坐点，如果不指定，默认为左上角为旋转中心。

有四个构造函数：

```
RotateAnimation(Context context, AttributeSet attrs)

// 默认旋转中心为 (0,0)
RotateAnimation(float fromDegrees, float toDegrees)

RotateAnimation(float fromDegrees, float toDegrees, float pivotX, float pivotY)

RotateAnimation(float fromDegrees, float toDegrees, int pivotXType, float pivotXValue, int pivotYType, float pivotYValue)
```

参数说明：

- float fromDegrees 旋转的开始角度。默认为角度， 0为原始角度， 90为顺时针个旋转90度。
- float toDegrees 旋转的结束角度。
- float pivotX  X方向旋转中心，默认为0，左
- float pivotY  Y方向旋转中心，默认为0， 上边缘
- int pivotXType X 轴的伸缩模式，可以取值为 `Animation.ABSOLUTE`、`RELATIVE_TO_SELF`、`RELATIVE_TO_PARENT`。决定了 pivotXValue 的方式。
- float pivotXValue X轴坐标的伸缩值，当方式为 ABSOLUTE 时，可以为固定值，也可以为百分数，1.0 为 100%。
- int pivotYType：Y轴的伸缩模式，可以取值为 `ABSOLUTE`、`RELATIVE_TO_SELF`、`RELATIVE_TO_PARENT`。
- float pivotYValue：Y轴坐标的伸缩值。同 X 轴

### ScaleAnimation

放缩动画，可指定缩放中心。

```
ScaleAnimation(Context context, AttributeSet attrs)

ScaleAnimation(float fromX, float toX, float fromY, float toY)

ScaleAnimation(float fromX, float toX, float fromY, float toY, float pivotX, float pivotY)

ScaleAnimation(float fromX, float toX, float fromY, float toY, int pivotXType, float pivotXValue, int pivotYType, float pivotYValue)
```

参数说明：

- float fromX 动画起始时 X坐标上的伸缩尺寸
- float toX 动画结束时 X坐标上的伸缩尺寸
- float fromY 动画起始时Y坐标上的伸缩尺寸
- float toY 动画结束时Y坐标上的伸缩尺寸
- float pivotX 缩放中心X坐标
- float pivotY 缩放中心Y坐标
- int pivotXType 动画在X轴 pivotValue 如何伸缩，有 `Animation.ABSOLUTE`, `Animation.RELATIVE_TO_SELF`,`Animation.RELATIVE_TO_PARENT.`.
- float pivotXValue 动画相对于物件的X坐标的开始位置
- int pivotYType 动画在Y轴相对于物件位置类型
- float pivotYValue 动画相对于物件的Y坐标的开始位置

### TranslateAnimation

位移动画，可以控制位置的动画

```
TranslateAnimation(Context context, AttributeSet attrs)

TranslateAnimation(float fromXDelta, float toXDelta, float fromYDelta, float toYDelta)

TranslateAnimation(int fromXType, float fromXValue, int toXType, float toXValue, int fromYType, float fromYValue, int toYType, float toYValue)
```

参数说明：

- float fromXDelta 动画开始的点离当前View X坐标上的差值 
- float toXDelta 动画结束的点离当前View X坐标上的差值 
- float fromYDelta 动画开始的点离当前View Y坐标上的差值 
- float toYDelta 动画开始的点离当前View Y坐标上的差值 
- int fromType 决定 fromXValue 如何被调用，`Animation.ABSOLUTE`, `Animation.RELATIVE_TO_SELF`, or `Animation.RELATIVE_TO_PARENT`
- int toXType 参数同上
- int fromYType 参数同上
- int toYType 参数同上


## Property Animation

Android 3.0, API 11 及以上，可以对任意类型进行动画。 属性动画在系统的 [android.animation](https://developer.android.com/reference/android/animation/package-summary.html) 包名下。总的来说，属性动画就是，动画的执行类来设置动画操作的对象的属性、持续时间，开始和结束的属性值，时间差值等，然后系统会根据设置的参数动态的变化对象的属性。


可定义如下参数：

- Duration 动画的持续时间，默认300ms
- Time interpolation 动画插值，LinearInterpolator 等等，定义动画变化率，可单独展开讲
- Repeat count 重复动作，无限播放，或者到达时间之后停止，或者反转播放动画
- Animator set 动画集合
- Frame refresh delay 动画刷新时间，默认为 10ms， 最终依赖系统状态，不一定为 10ms。

### 常用方法

```
addListener(Animator.AnimatorListener listener);      // 添加监听器，可以手动设置监听，手动设置属性
isRunning();     // 当前动画是否在执行
isStarted(); 	 // 动画是否开始
isPaused();      // 暂停状态

setDuration(long duration);    // 设置动画时长，单位为毫秒
setInterpolator(TimeInterpolator value);  // 设置动画插值
setStartDelay(long startDelay);     // start() 方法被调用之后延时
setTarget(Object target);          // 设置动画主体
start();   // 开始动画
cancel();   // 取消动画

static ValueAnimator ofArgb(int... values);   // 颜色动画
static ValueAnimator	ofFloat(float... values)
static ValueAnimator	ofInt(int... values)
static ValueAnimator	ofObject(TypeEvaluator evaluator, Object... values)

setRepeatCount(int value);      // 可选值 INFINITE 无限循环动画
setRepeatMode(int value);     //  RESTART，REVERSE

Object	getAnimatedValue();    // 运动时，当前运动点的值

// 监听动画变化时的实时值 
public static interface AnimatorUpdateListener {  
    void onAnimationUpdate(ValueAnimator animation);  
}
// 添加方法为：public void addUpdateListener(AnimatorUpdateListener listener)  

// 监听动画变化时四个状态
public static interface AnimatorListener {  
    void onAnimationStart(Animator animation);		// 动画开始
    void onAnimationEnd(Animator animation);  		// 动画结束
    void onAnimationCancel(Animator animation);  	// 动画 cancel
    void onAnimationRepeat(Animator animation);  	// 动画重复
}
//添加方法为：public void addListener(AnimatorListener listener)  

removeAllListeners();
removeListener(Animator.AnimatorListener listener);
removePauseListener(Animator.AnimatorPauseListener listener);

```

默认的 ValueAnimator 使用非线性的插值器 interpolation，加速进入减速退出，可以通过 setInterpolator(TimeInterpolator) 来改变默认的行为。

### xml 定义动画

可以类似 View Animation 定义 xml 来创建动画, 动画资源文件需要保存在 `res/animator/` 目录下。Animator 动画支持：

- ValueAnimator  `<animator>`
- ObjectAnimator `<objectAnimator`
- AnimatorSet  `<set>`


```
<animator xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="1000"
    android:valueFrom="1"
    android:valueTo="0"
    android:valueType="floatType"
    android:repeatCount="1"
    android:repeatMode="reverse"/>

<!-- 同样可以定义动画集合，顺序执行动画 -->
<set android:ordering="sequentially">
    <set>
        <objectAnimator
            android:propertyName="x"
            android:duration="500"
            android:valueTo="400"
            android:valueType="intType"/>
        <objectAnimator
            android:propertyName="y"
            android:duration="500"
            android:valueTo="300"
            android:valueType="intType"/>
    </set>
    <objectAnimator
        android:propertyName="alpha"
        android:duration="500"
        android:valueTo="1f"/>
</set>
```
定义动画资源之后可以使用如下代码使用动画：

```
AnimatorSet set = (AnimatorSet) AnimatorInflater.loadAnimator(myContext,
    R.animator.property_animator);
set.setTarget(myObject);
set.start();
```

更多XML定义的语法可以参考官方 [文档](https://developer.android.com/guide/topics/resources/animation-resource.html#Property)

ObjectAnimator  动画的执行类，后面详细介绍
ValueAnimator 动画的执行类
AnimatorSet 用于控制一组动画的执行：线性，一起，每个动画的先后执行等。
AnimatorInflater 用户加载属性动画的xml文件
TypeEvaluator  类型估值，主要用于设置动画操作属性的值。
TimeInterpolator 时间插值，有很多子类，可以具体展开再讲，AccelerateDecelerateInterpolator, AccelerateInterpolator, AnticipateInterpolator, AnticipateOvershootInterpolator, BaseInterpolator, BounceInterpolator, CycleInterpolator, DecelerateInterpolator, FastOutLinearInInterpolator, FastOutSlowInInterpolator, Interpolator, LinearInterpolator, LinearOutSlowInInterpolator, OvershootInterpolator, PathInterpolator

### ValueAnimator

```
ValueAnimator animator = ValueAnimator.ofInt(0,1000);  
animator.setDuration(1000);  

animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {  
    @Override  
    public void onAnimationUpdate(ValueAnimator animation) {  
        int curValue = (int)animation.getAnimatedValue();  
        Log.d(TAG,"curValue: "+curValue);  
    }  
});  
animator.start();
```
同样也可以通过 `ofFloat`, `ofObject` 等等静态方法构造不同类型的 ValueAnimator。然后通过监听器动态地更新属性。

### ObjectAnimator

```
ObjectAnimator anim = ObjectAnimator.ofFloat(foo, "alpha", 0f, 1f);
anim.setDuration(1000);
anim.start();
```
ObjectAnimator 使用范围更广，但是同样也有很多约束条件。


## Drawable Animation

可以在 `res/drawable/` 目录下定义 XML 文件：

```
<animation-list xmlns:android="http://schemas.android.com/apk/res/android"
    android:oneshot="true">
    <item android:drawable="@drawable/rocket_thrust1" android:duration="200" />
    <item android:drawable="@drawable/rocket_thrust2" android:duration="200" />
    <item android:drawable="@drawable/rocket_thrust3" android:duration="200" />
</animation-list>
```

用如下代码，将 Drawable 附加到 ImageView 中：

```
AnimationDrawable rocketAnimation;

public void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);
  setContentView(R.layout.main);

  ImageView rocketImage = (ImageView) findViewById(R.id.rocket_image);
  rocketImage.setBackgroundResource(R.drawable.rocket_thrust);
  rocketAnimation = (AnimationDrawable) rocketImage.getBackground();
}

public boolean onTouchEvent(MotionEvent event) {
  if (event.getAction() == MotionEvent.ACTION_DOWN) {
    rocketAnimation.start();
    return true;
  }
  return super.onTouchEvent(event);
}
```

`start()` 方法不能在 `onCreate()` 方法中调用， AnimationDrawable 此时还没有附加到window 上，如果需要动画自动播放，可以在 `onWindowFocusChanged()` 中调用。

更多的 XML 语法可以参考官方[文档](https://developer.android.com/guide/topics/resources/animation-resource.html#Frame)


## 区别

- View Animation 只能作用于 View， 而 Property Animation 因为修改属性，可以作用于任何对象。
- 命名方式 View Animation 都以 Animation 结束，在 view.animation 包下，而 Property Animator 属性动画都是 Animator 结尾，并在 android.animation 包下。
- View Animation 的动画实现是通过 Parent View 实现，实际在被 draw 时改变其位置，因此真实的属性并没有改变。而 Property Animator 属性动画正是相反，改变的属性值。


## reference

- <https://developer.android.com/guide/topics/graphics/prop-animation.html>
- <http://wiki.jikexueyuan.com/project/android-animation/4.html>
- <http://blog.csdn.net/lmj623565791/article/details/38067475>
- <http://www.jb51.net/article/32337.htm>
- <http://blog.csdn.net/tw19911005/article/details/51557150>
- <https://developer.android.com/guide/topics/graphics/overview.html>
- <http://blog.isming.me/2015/02/01/android-view-animation/>



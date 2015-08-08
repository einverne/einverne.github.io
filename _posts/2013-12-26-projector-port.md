---
layout: post
title: "电视机投影仪接口知识"
tagline: 
description: "电视机投影仪接口知识"
category: 经验总结
tags: [投影仪, 接口]
---

之前东拼西凑写了一篇《[投影仪选购指南](http://www.einverne.tk/2013/12/projector-shopping.html)》，今天再凑一篇配套接口知识。纯为自己了解，当然如果帮到其他人，那就更好了。先来随便看看一款投影仪的最简单的接口。

从左到右接口依次为：音频接口，S端子，VGA接口，HDMI，RS232，USB 
![projector interface][1]

从左到右依次是HDMI×2，色差分量接口Component，MINI USB B型，VAG，RS-232，S-端子，AV复合视频接口（RCA），音频输入输出接口
![W750][2]

然后看看平面解释的图
![projector port][3]

以下涉及到的接口可能有些在投影仪里面有，而有些投影仪不一定是要具备的，必备是对于电视来说的。

##必备接口

###HDMI
HDMI是新一代的多媒体接口标准，全称是High-Definition Multimedia Interface，中文意思为高清晰多媒体接口，该标准由索尼、日立、松下、飞利浦、东芝、Silicon image、Thomson (RCA)等7家公司在2002年4月开始发起的。其产生是为了取代传统的DVD碟机、电视及其它视频输出设备的已有接口，统一并简化用户终端接线，并提供更高带宽的数据传输速度和数字化无损传送音视频信号。
![HDMI cable][4]

- 2002年12月，7家公司正式推出了HDMI 1.0规格。
- 2004年5月，HDMI 1.1规格发布。
- 2005年8月，推出了HDMI的1.2版，为了更好的兼容PC系统，1.2版增加了若干条非常重要的改进，以方便PC连接和数字音频流等的传输。
- 2005年12月，推出HDMI 1.2a标准增加了CEC功能，并且完善了测试规范，CEC功能可以通过一个遥控器对所有家庭娱乐设备进行控制。
- 2006年5月22日，制定HDMI标准的7家企业共同宣布了HDMI 1.3，新标准将带宽和速率都提升了2倍以上，达到了340MHz的带宽和10.2Gbps速率，以满足最新的1440P/WAXGA分辨率的要求。

![HDMI details][5]

传统的AV复合和色差接口都需要独立分开音频和视频数据线来传输信号，同为数字接口的DVI接口则并不支持音频传输，目前唯有HDMI具备了在一条数据线上同时传送影音信号的能力，因此人们也习惯把HDMI称为高清一线通。

###DVI接口
DVI（Digital Visual Interface）接口，即数字视频接口。DVI接口标准是1999年由Silicon Image、Intel（英特尔）、Compaq（康柏）、IBM、HP（惠普）、NEC、Fujitsu（富士通）等公司共同组成DDWG（Digital Display Working Group，数字显示工作组）推出的接口标准。
![DVI cable][6]

DVI接口是以Silicon Image公司的PanalLink接口技术为基础，基于TMDS（Transition Minimized Differential Signaling，最小化传输差分信号）电子协议作为基本电气连接。TMDS是一种微分信号机制，可以将象素数据编码，并通过串行连接传递。显卡产生的数字信号由发送器按照TMDS协议编码后通过TMDS通道发送给接收器，经过解码送给数字显示设备。

![DVI to HDMI][7]
DVI转HDMI视频连接线


目前常见的DVI接口有两种，分别是DVI-Digital（DVI-D）与DVI-Integrated（DVI-I），DVI-D仅支持数字信号，而DVI-I则不仅支持数字信号，还可以支持模拟信号，也就是说**DVI-I**的兼容性更强。
DVI-I插口是兼容数字和模拟接头的，所以，DVI-I的插口就有24个数字插针＋5个模拟插针的插孔（就是旁边那个四针孔和一个十字花）。

DVI-D插口是纯数字的接口，所以，DVI-D的插口只有24个数字插针的插孔（没有模拟的那个四针孔和一个十字花）。

因此，DVI-I的插口可以插DVI-I和DVI-D接头的线，而DVI-D的插口只能接DVI-D的纯数字线。

###色差分量接口
![色差分量接口][8]

色差分量接口Component

![色差分量线材][9]

色差分量线材

色差分量（Component）接口采用YPbPr和YCbCr两种标识，前者表示逐行扫描色差输出，后者表示隔行扫描色差输出。色差分量接口一般利用3根信号线分别传送亮色和两路色差信号。这3组信号分别是：亮度以Y标注，以及从三原色信号中的两种——蓝色和红色——去掉亮度信号后的色彩差异信号，分别标注为Pb和Pr，或者Cb和Cr，在三条线的接头处分别用绿、蓝、红色进行区别。这三条线如果相互之间插错了，可能会显示不出画面，或者显示出奇怪的色彩来。色差分量接口是模拟接口，支持传送480i/480p/576p/720p/1080i/1080p等格式的视频信号，本身不传输音频信号。

###AV复合视频接口（3路RCA接口组成）
![复合视频接口][10]

复合视频接口

![复合视频线][11]

复合视频线

AV复合（Composite）视频接口是目前在视听产品中应用得最广泛的接口，属模拟接口，该接口由黄、白、红3路RCA接头组成，黄色接头传输视频信号，白色接头传输左声道音频信号，红色接头传输右声道音频信号。AV复合视频接口实现了音频和视频的分离传输，这就避免了因为音/视频混合干扰而导致的图像质量下降，但由于AV接口的传输仍然是一种亮度/色度(Y/C)混合的视频信号，仍然需要显示设备对其进行亮/色分离和色度解码才能成像，这种先混合再分离的过程必然会造成色彩信号的损失，色度信号和亮度信号也会有很大的机会相互干扰从而影响最终输出的图像质量。

###RF输入接口
![RF输入接口][12]

RF射频端子是最早在电视机上出现的，原意为无线电射频（Radio Frequency）。它是目前家庭有线电视采用的接口模式。

RF 的成像原理是将视频信号(CVBS)和音频信号(Audio)相混合编码后，输出然后在显示设备内部进行一系列分离/ 解码的过程输出成像。

由于步骤繁琐且音视频混合编码会互相干扰，所以它的输出质量也是最差的。带此类接口的显卡只需把有线电视信号线连接上，就能将有线电视的信号输入到显卡内。

##实用接口

###光纤音频接口

光纤音频接口TosLink，全名Toshiba Link，这是日本东芝（TOSHIBA）公司较早开发并设定的技术标准，在视听器材的背板上有Optical作标识。现在几乎所有的数字影音设备都具备这种格式的接头。TosLink光纤曾大量应用在普通的中低档CD、LD、MD、DVD机及组合音响上。光纤连接可以实现电气隔离，阻止数字噪音通过地线传输，有利于提高DAC的信噪比。但是，时基误差是影响音质的重要因素，所以衡量数字音响设备传输接口性能的好坏，应以引起时基误差的大小为标准。光纤连接的信号要经过发射器和接收器的两次转换，会产生严重影响音质的时基抖动误差（Jitter）。制造光纤常用的材料有塑料、石英、玻璃等，玻璃光纤（ST）是最昂贵的一种。

###RS-232C接口

RS-232C标准最初是远程通信连接数据终端设备DTE(Data Terminal Equipment)与数据通信设备DCE（Data Communication Equipment)而制定的。RS-232C标准（协定）的全称是EIA-RS-232C标准，其中EIA(Electronic Industry Association)代表美国电子工业协会，RS（Recommeded Standard）代表推荐标准，232是标识号，C代表RS232的最新一次修改（1969），在这之前有RS-232B和RS-232A。它规定连接电缆和机械、电气特性、信号功能及传送过程。RS-232C接口最大传输速率为20Kbps，线缆最长为15米。RS-232C接口通常被用于将电脑信号输入控制，当通信距离较近时，可不需要Modem，通信双方可以直接连接，这种情况下，只需使用少数几根信号线。

###VGA接口
![VGA][13]

VGA（Video Graphic Array）接口，即视频图形阵列，也叫D-Sub接口，是15针的梯形插头，分成3排，每排5个，传输模拟信号。VGA接口采用非对称分布的15针连接方式，其工作原理：是将显存内以数字格式存储的图像（帧）信号在RAMDAC里经过模拟调制成模拟高频信号，然后再输出到显示设备成像。

VGA支持在640×480的较高分辨率下同时显示16种色彩或256种灰度，同时在320×240分辨率下可以同时显示256种颜色。VGA由于良好的性能迅速开始流行，厂商们纷纷在VGA基础上加以扩充，如将显存提高至1M并使其支持更高分辨率如SVGA（800×600）或XGA（1024×768），这些扩充的模式就称之为视频电子标准协会VESA(Video Electronics Standards Association)的SVGA（Super VGA）模式，现在显卡和显示设备基本上都支持SVGA模式。

此外后来还有扩展的SXGA（1280×1024）、SXGA+（1400×1050）、UXGA（1600×1200）、WXGA（1280×768）、WXGA+（1440×900）、WSXGA（1600×1024）、WSXGA+（1680×1050）、WUXGA（1920×1200）、WQXGA（2560×1600）等模式，这些符合VESA标准的分辨率信号都可以通过VGA接口实现传输。

###S端子接口

S端子，即分离式影像端子S-video（Separate Video），它实际上是一种五芯接口，由视频亮度讯号Y和视频色度讯号C和一路公共遮罩地线组成。S端子将亮度和色度分离输出，避免了混合视频讯号输出时亮度和色度的相互干扰，它只能输入输出视频。

##可选接口

###USB接口
Universal Serial Bus（通用串行总线)简称USB，是目前电脑、数码、平板电视等产品上光方应用的一种接口规范。USB接口是一种四针接口，其中中间两个针传输数据，两边两个针给外设供电。USB有两个规范，即USB 1.1和USB 2.0。二者主要的却别是USB 1.1的最高传输速度是12Mbps（折算为MB为1.5MB/s）；USB2.0标准传输速率在25Mbps-400 Mbps （最大480 Mbps，折算为MB为60MB/s），二者相差最高40倍。同时，USB1.1版本接口对外的输出电源的负载能力很低，其最大输出电流只有250毫安，而USB2.0协议，其输出电流达到500毫安以上。USB1.1接口和USB2.0接口相比，USB2.0接口具有明显的优势，但产品价格相对也要比USB1.1接口的产品贵一些，2003年以后1.1版本逐渐被2.0版

USB（通用串行总线）将网络、计算机和家庭数码产品的媒体资源进行共享，是3C融合的一个趋势。具有流媒体功能的电视实现了让MP3、摄像机、照相机、移动硬盘、U盘以及各种各样存储卡的内容在电视机上直接播放，做到信息共享。流媒体电视与普通电视相比，最大的不同在于后者仅能收看电视节目，节目内容固定的，而流媒体电视不仅可以收看更清晰的电视节目，还可以播放数码相机、移动硬盘等数码设备里的图片、音乐、电影，使原来只能在电脑上播放的内容可以在更大、更清晰的平板电视上观看，让全家人共同欣赏。而流媒体这些美妙功能的实现必须依仗 作为中间媒介的“USB”接口。

目前市场销售的平板电视还有部分产品依然为了降低成本采用低速的USB1.1接口作为流媒体接口，而这个接口根本不能满足海量流媒体设备的供电和传输需要。目前家用数码设备，例如MP3已经向G容量过渡，数码相机也已经开始千万像素的换代，大容量的流媒体文件必须依靠可靠的高速接口才能流畅演示，因此购买流媒体电视，一定要先确定是否采用了USB2.0高速接口本所替代。

###蓝牙接口
蓝牙（Bluetooth）是由东芝、爱立信、IBM、Intel和诺基亚于1998年5月共同提出的近距离无线数据通讯技术标准。它能够在10米的半径范围内实现单点对多点的无线数据和声音传输，其数据传输带宽可达1Mbps。通讯介质为频率在2.402GHz到2.480GHz之间的电磁波。

蓝牙接口（BlueTooth）与其它同样具有蓝牙接口的设备连接同样可以实现无线连接，它具有无方向性限制，有效连接距离达10米，一般的传输速度都有1M，快速的高达10M甚至更快等优点，但目前配置蓝牙接口的电子设备却不是很多，与红外线接口的普及率有很大的差距，这是比较遗憾的一个地方。

不过，没有蓝牙接口的电脑可通过加装蓝牙适配器来实现蓝牙接口功能，这些蓝牙适配器一般都是USB接口的，可以插在电脑的USB接口上使用，而且只有闪盘大小，携带远比数据线要方便。

##趋势接口

###DisplayPort接口
1.高带宽
在高清晰视频即将流行之际，没有高带宽的显示接口是无法立足的。DisplayPort问世之初，它可提供的带宽就高达10.8Gb/s。要知道，HDMI 1.2a的带宽仅为4.95Gb/s，即便最新发布的HDMI 1.3所提供的带宽(10.2Gb/s)也稍逊于DisplayPort 1.0。DisplayPort可支持WQXGA+(2560×1600)、QXGA(2048×1536)等分辨率及30/36bit(每原色10/12bit)的色深，充足的带宽保证了今后大尺寸显示设备对更高分辨率的需求。


2.最大程度整合周边设备
和HDMI一样，DisplayPort也允许音频与视频信号共用一条线缆传输，支持多种高质量数字音频。但比HDMI更先进的是，DisplayPort在一条线缆上还可实现更多的功能。在四条主传输通道之外，DisplayPort还提供了一条功能强大的辅助通道。该辅助通道的传输带宽为1Mbps，最高延迟仅为500μs，可以直接作为语音、视频等低带宽数据的传输通道，另外也可用于无延迟的游戏控制。可见，DisplayPort可以实现对周边设备最大程度的整合、控制。

3.内外接口通吃

目前DisplayPort的外接型接头有两种:一种是标准型，类似USB、HDMI等接头;另一种是低矮型，主要针对连接面积有限的应用，比如超薄笔记型电脑。两种接头的最长外接距离都可以达到15米，虽然这个距离比HDMI要逊色一些，不过接头和接线的相关规格已为日后升级做好了准备，即便未来DisplayPort采用新的2X速率标准(21.6Gbps)，接头和接线也不必重新进行设计。

除实现设备与设备之间的连接外，DisplayPort还可用作设备内部的接口，甚至是芯片与芯片之间的数据接口。比如，DisplayPort就“图谋”取代LCD中液晶面板与驱动电路板之间主流接口——LVDS(Low Voltage Differential Signaling，低压差分信号)接口的位置。DisplayPort的内接型接头仅有26.3mm宽、1.1mm高，比LVDS接口小30%，但传输率却是LVDS的3.8倍。

##其它接口

###D端子接口
D端子中的D即Digital，也说是因为接口造型像倒置的“D”字母，其通过处理芯片将视频信号处理成符其传输标准的数码讯号，采用了类似电脑的多针D型插接头，通过数字方式传输视频信号，直接输入到具备D视频接收端子的视频显示设备，避免了通过模拟视频信号传输方式传输信号的过程中的数字-模拟的转换过程，因而更能提升数字视频还原质量。D端子依据规格的不同，分为目前有D1、D2、D3、D4、D5几个级别，分别对应480i/480p/1080i/720p/1080p视频信号，其中D5最高。目前D端子接口基本上只出现在日本的视听设备中。

###同轴音频接口
同轴音频接口（Coaxial），标准为SPDIF（Sony / Philips Digital InterFace），是由索尼公司与飞利浦公司联合制定的，在视听器材的背板上有Coaxial作标识，主要是提供数字音频信号的传输。它的接头分为RCA和BNC两种。数字同轴接口采用阻抗为75Ω的同轴电缆为传输媒介，其优点是阻抗恒定，传输频带较宽，优质的同轴电缆频宽可达几百兆赫。同轴数字传输线标准接头采用BNC头，其阻抗是75Ω，与75Ω的同轴电缆配合，可保证阻抗恒定，确保信号传输正确。也就是说在传输的线材搭配上，应该是以适用于传输高频率数字讯号的75欧姆同轴线材作为搭配标准。

###SCART接口
SCART（Syndicat des Constructeursd' Appareils Radiorécepteurs et Téléviseurs）接口是一种专用的音视频接口，它是由法国公司Peritel开发的视听设备互连工业标准，也是欧洲强制要求用于卫星电视接收机、电视机、录像机及其它音视频设备上的互连互通接口。标准的SCART接口为21针连接器，外型呈直角梯形，俗称“扫把头”。这21针中定义了音频和视频信号，可用来传输CVBS和隔行RGB信号等视频信号，也可以传送立体声音频信号。21针同时传输21个信号，这21个信号可分为视频信号、音频信号、控制信号、地线和数据线几种。此外，SCART接口还是双向传输，实现所谓的“LOOP”循环功能。

[1]: https://lh6.googleusercontent.com/zDmZNukzYSknwLr_K_k0N5rS4GowjLDO3cKub0knu9db=s640 "projector interface"
[2]: https://lh3.googleusercontent.com/NCk-uv-g8ECNGr-VQndaHuLaSdt7cXApiMagsMh3Yn3q=s640
[3]: https://lh5.googleusercontent.com/rt_zaYrTwlRDH1-oSypBo9Cagv1kMW0k8otxcNCDo1YV=s640 "projector port"
[4]: https://lh5.googleusercontent.com/zQ60uF7nZ4b7EoSR1ESQHd3HzpTUaHkV1G_ErvFyp8gC=s640 "HDMI cable"
[5]: https://lh6.googleusercontent.com/KK9lbL3siRnsz03ypJ8PjK1f3PYC0DDk-XzW96QNR7l0=s640 "HDMI details"
[6]: https://lh6.googleusercontent.com/4eKdOgpqN1_jYNwB3_w0VusbTodLVke4VbWDqBXjOjmS=s640 "DVI cable"
[7]: https://lh6.googleusercontent.com/V0sP72s6-p-b73L6lJRNdPOd58DSlILenJUFHpmf-8s_=s640 "DVI to HDMI"
[8]: https://lh6.googleusercontent.com/VlnzQs5XOpp57bOC5Qut22WEcurPeYnP1jdR8-KAUEe8=s640
[9]: https://lh6.googleusercontent.com/wGObHr63j_Go-DlR8tCAiZM_wagl1zyMHMx_sbAAmoAn=s640 "色差分量线材"
[10]: https://lh6.googleusercontent.com/WaFaWqjSwNAI7F5CGlT_xKHRUgV_RgQaxiEj1CeN13BA=s640 "复合视频接口"
[11]: https://lh3.googleusercontent.com/PrBW8-K0sGlkrKu1i6LffeuBJaaxjCL5xLF2AH-da7DY=s640 "复合视频线"
[12]: https://lh4.googleusercontent.com/Mw14XdUXxRxBuR0NS99gZEe7uZC-odjobyx1XG1Ih53o=s640
[13]: https://lh3.googleusercontent.com/bsB2EoUQ--ikvI-yusiKZ6GE32CIb8N0PVE-z-Aznqgn=s640 "VGA"

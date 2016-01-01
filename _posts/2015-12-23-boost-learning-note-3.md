---
layout: post
title: "boost 学习笔记 3: date_time"
tagline: ""
description: "日期"
category: 学习笔记
tags: [boost, C++]
last_updated: 
---

date_time 日期相关的库，是 boost 中少数需要编译的库，但是实践中，在 Linker 链接器中链接 `libboost_date_time.a` 即可。也就是在链接时，加上 -l(boost_date_time) 参数。


## 头文件
使用 date_timer 需要包含以下头文件。
diedaiqi
    #include <boost/date_time/gregorian/gregorian.hpp>
    using namespace boost::gregorian;

### date基本使用

将时间想象成无线延伸的实数轴，时间点是数轴上的一个点，时间段就是区间，时长是有正负号的标量，两个时间点差，不属于数轴。时间点，时间段，时长之间可以进行运算，有些有实际意义，例如时间点+时长=时间点，时长+时长=时长，时间段交集∩时间段=时间段，时间点属于∈时间段等等，有些无意义等等。

date_time 库支持无限时间和无效时间（NADT， Not Available Date Time）。

日期基于格里高利历，支持从 1400-01-01 到 9999-12-31 之间的日期计算，不支持公元前日期，名字空间 boost::gregorian, 需要包含上文所述头文件。

### 构造

date 是 date_time 库处理日期的核心类，使用32位整数作为内部存储，以天位单位表示时间点概念，日期的构造方法

    date d1;					// 无效日期
    date d2(2010,1,1);
    date d3(2000, Jan, 1);
    date d4(d2);				// 拷贝构造

    //you can compare between d1 d2 d3 d4 with == < >

也可以直接使用字符串来构造：

    date d0 = from_string("1999-12-31");
    date d5 ( from_string("2005/1/1") );
    date d6 = from_undelimited_string("20001109");

或者直接从工厂类构造，调用 day_clock 的静态成员函数 local_day() 或者 universal_day() 返回当天的日期对象，分别是本地日期和 UTC 日期。 local_day() 依赖于操作系统时区设置。

    // local date and UTC date
    cout << day_clock::local_day() << endl;
    cout << day_clock::universal_day() << endl;

特殊的日期：

    date neg(neg_infin);			//negative infinite time
    date pos(pos_infin);			//positive infinite time
    date notdate(not_a_date_time);	//not a date time
    date maxdate(max_date_time);	//max date
    date mindate(min_date_time); 	//min date
	cout << neg << endl << pos << endl << maxdate << endl << mindate <<endl;

### date访问

date 成员函数 year(), month(), day() 返回年月日； year_month_day() 返回 date::ymd_type 结构，一次性获取年月日信息。

    date nowdate = day_clock::local_day();
    date::ymd_type ymd = nowdate.year_month_day();
    cout << ymd.year << endl << ymd.month << endl << ymd.day << endl;

    // day_of_week() return Monday, Tuesday..
    // day_of_year() return number of the day in this year, max 366
    // end_of_month() return the date of end of month
    cout << nowdate.day_of_week() << endl;
    cout << nowdate.day_of_year() << endl;
    cout << nowdate.end_of_month() << endl;

day_of_week() 返回 date 星期数， 0 表示星期天； day_of_year() 返回 date 是当年第几天，最多366； end_of_month() 返回当月最后一天的 date 对象。

week_number() 返回date所在周是当年的第几个周，范围0到53. 如果年初的几天为去年的周，则周数为53，即第0周。

date 有5个 is_xxx() 函数，用于检验日期是否是一个特殊日期

- is_infinity()  		是否无限日期
- is_neg_infinity() 	是否负无限日期
- is_pos_infinity() 	是否正无限日期
- is_not_a_date() 		是否无效日期
- is_special() 			是否任意一个特殊日期

### date输出

date 对象转成字符串输出

    date now = day_clock::local_day();
    // date output
    cout << to_simple_string(now) << endl;			//YYYY-mmm-DD  mmm English
    cout << to_iso_string(now) << endl;				//YYYYMMDD
    cout << to_iso_extended_string(now) << endl;		//YYYY-MM-DD
    cout << now << endl;

支持流输入

    date inputdate;
    cout << "Input a date: ";						// 2010-Jan-01
    cin >> inputdate;								//default using YYYY-mmm-DD English abbr
    cout << "\nThe input date is: " << inputdate << endl;

## 日期长度 date_duration

日期长度类 date_duration , 天为单位，度量时间长度的标量。值为任意整数，可正可负。

成员函数 days() 返回时长天数， is_special() 和 is_negative() 可判断 date_duration 对象是否为特殊值，或者负值， unit() 返回时长最小单位，即1

date_duration 支持全序比较操作 ==, != , <, <= 等等，支持加减法，递增递减，支持除整数，其他乘法，取模，取余不支持。

date_time 库为 date_duration 定义了一个常用的 typedef:days 名字。

    days dd1(10);			// ten days
    weeks w(2);				// two weeks
    months m(5);			// five months
    years y(2);				// two years

    months m2 = y + m;		// two years and 5 months

### 日期计算
日期支持简单加减运算

    // date compute
    date dstart(2000,1,1), dend(2008,8,8);
    cout << dend - dstart << endl;			// 3142 days

    dstart += days(10);						// 2000-1-11
    dstart += months(2);					// 2000-3-11
    dstart -= weeks(1);						// 2000-3-4
    dstart += years(4);						// 2004-3-4

    //something need to be noticed
    date endofmonth(2010, 3, 30);
    endofmonth -= months(1);				//2010-2-28
    endofmonth -= months(1);				//2010-1-31
    endofmonth += months(2); 				//2010-3-31

## 日期区间 date_period

date_period 类来表示日期区间，时间轴上是一个左闭右开区间，端点是两个date对象，左值必须小于右值。

    // date period
    date_period pd(dstart, dend);			// (date, date)
    date_period pd1(dstart, days(10));		// (date, days)

    cout << pd << endl;

    pd.shift(days(10));						// shift days 平移N天，长度不变
    cout << pd << endl;
    pd.expand(days(3));						// expand days 像两端扩展三天，长度加2n天
    cout << pd << endl;

成员函数 begin() & end() 返回日期区间两个端点， end() 返回 last() 后的第一天。

date_period 可以全序比较运算，依据区间端点，即第一个区间的end() 和第二个区间的 begin(), 判断两个区间在时间轴上的位置大小。如果日期区间相交或者包含，比较操作无意义。

date_period 支持输入输出操作符，默认的输入输出格式是 YYYY-mmm-DD/YYYY-mmm-DD.

    date date2014 = from_string("2014-01-01");
    date nowdate = day_clock::local_day();
    date_period pdl(date2014, nowdate);
    date one_day_in_2015 = from_undelimited_string("20150101");
    cout << pdl.contains(one_day_in_2015) << endl;

    /*
     * date_period
     * is_before(), is_after()
     * contains()
     * intersects()				区间是否存在交集
     * intersections()			返回两个区间的交集
     * is_adjacent()			是否相邻
     * merge()					返回两个区间并集，如果无交集或者不相邻则返回无效区间
     * span()					合并两区间及两者间的间隔
     */

日期迭代器

    /*
     * date iterator
     * use only ++iterator, --iterator, don't use iterator++, iterator--
     */
    date d(2006,11,26);
    day_iterator d_iter(d);
    ++d_iter;

    year_iterator y_iter(d,3);		// 增减步长为3年
    ++y_iter;						// 增加3年
    cout << y_iter->year();

## 综合运用

	void print_one_month(){
		date nowdate = day_clock::local_day();
		date month_start(nowdate.year(), nowdate.month(), 1);
		date month_end = nowdate.end_of_month();

		for(day_iterator d_iter(month_start); d_iter != month_end; ++d_iter){
			cout << *d_iter << " " << d_iter->day_of_week() << "\t";
			if(d_iter->day_of_week() == boost::date_time::Sunday){
				cout << endl;
			}
		}
	}
	/*
	 * input your birthday and years after that output the day of
	 * future birthday
	 */
	void birthday_week(){
		date birthday(1992, 06, 05);
		years y30(30);
		date future_birthday = birthday + y30;
		cout << future_birthday.day_of_week() << endl;
	}
	/*
	 * printout the days passed since you were born.
	 */
	void days_passed(){
		date birthday(1990, 10, 8);
		date nowdate = day_clock::local_day();
		cout << "Since you were born, there were " << nowdate - birthday << " days passed!"<< endl;
	}

## 时间长度 time_duration

度量基本小时、分钟和秒钟，秒以下精确到微秒。

time_duration 有子类，度量不同时间分辨率，分别是： hours，minutes，seconds，millisec/milliseconds，microsec/microseconds和nanosec/nanoseconds。

    #include <boost/date_time/posix_time/posix_time.hpp>
    using namespace boost::posix_time;

    // 2 h 01 m 06.001 s
    time_duration td(1, 60, 60, 1000*1000*6 + 1000);

    hours h(1);				// one hour
    minutes m(10);
    seconds s(30);
    millisec ms(1);

    time_duration td1 = h + m + s + ms;

    time_duration td2 = duration_from_string("1:10:30:001");
    cout << td2 << endl;			// 01:10:30.001000
    cout << to_simple_string(td1) << endl;
    cout << to_iso_string(td2) << endl;

## 时间点 ptime

构造函数中同时指定date和time_duration对象，ptime等于一个日期加上当天的时间偏移，轻量级对象，可以被高效的任意拷贝和赋值，支持全序比较和加减运算。

    using namespace boost::gregorian;

    ptime p(date(2010,3,5), hours(1));
    ptime p1 = time_from_string("2012-09-11 09:09:09");
    cout << p1 << endl;
    ptime p2 = from_iso_string("20100909T011001");
    cout << p2 << endl;

    ptime nowtime = second_clock::local_time();			// second accurate
    ptime nowtime2 = microsec_clock::universal_time();	// milli second accurate

    ptime pnot(not_a_date_time);
    ptime pinf(pos_infin);

    cout << to_simple_string(nowtime) << endl;
    cout << to_iso_string(nowtime) << endl;
    cout << to_iso_extended_string(nowtime) << endl;

## 时间区间 time_period

    time_period tp1(nowtime, hours(8));					// start from nowtime, last for eight hours
    tp1.shift(hours(2));
    tp1.expand(hours(1));

时间迭代器和日期迭代器，时间迭代器需要时间点和时间长度来构造。

    ptime p(day_clock::local_day(),hours(10));
    for (time_iterator t_iter(p, minutes(10)); t_iter < p+hours(1); ++ t_iter) {
        cout << *t_iter << endl;
    }
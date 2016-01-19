---
layout: post
title: "boost 学习笔记 9：并发编程"
tagline: ""
description: ""
category: 学习笔记
tags: [boost, C++]
last_updated: 
---

Boost中有两个用于并发编程的组件。首先是thead库：它为C++增加了可移植的线程处理能力。然后是一个用于同步和异步IO操作的功能强大的库——asio，它使用了前摄器模式，可以处理串口，网络通信，而且有望成为C++标准底层通信库。

互斥量是一种用于线程同步的手段，它可以在线程编程中防止多个线程同时操作共享资源(或称临界区)。一旦一个线程锁定了互斥量，那么其他线程必须等待他解锁互斥量才能在访问共享资源。thead提供了7中互斥量类型（实际只有五种）：

- mutex 独占式互斥量
- try-mutex mutex 同义词
- timed_mutex 独占式互斥量，提供超时锁定功能
- recursive_mutex  递归式互斥量，可以多次锁定，相应也要多次解锁
- recursive_try_mutex recursive_mutex 同义词
- recursive_time_mutex 递归式互斥量，基本功能同 recursive_mutex ,提供超时锁定功能
- shared_mutex  multi-reader/single-writer 型共享互斥量 读写锁

mac下使用 boost thread 需要将 libboost_thread.dylib   libboost_thread-mt.dylib lib boost-system.dylib 加入到工程，链接进工程。

具体用法：

    #include <iostream>
    #include <string>
    #include <boost/assign.hpp>
    #include <boost/typeof/typeof.hpp>
    #include <boost/assign.hpp>
    #include <boost/thread.hpp>
    #include <boost/thread/mutex.hpp>
    #include <boost/ref.hpp>
    #include <boost/bind.hpp>
    using namespace boost;
    using namespace std;

    #define BOOST_DATE_TIME_SOURCE
    #define BOOST_THREAD_NO_LIB

    // 模板类配合模板参数提供不同范围的计数，提供隐式类型转换操作
    // 在多线程环境下安全计数
    template <typename T>
    class basic_atom: noncopyable {
    private:
        T n;
        typedef boost::mutex mutex_t;
        mutex_t mu;

    public:
        basic_atom(T x = T()):n(x) {}
        T operator++(){
            mutex_t::scoped_lock lock(mu);
            return ++n;
        }
    //    T operator=(const T _n){
    //        mutex_t::scoped_lock lock(mu);
    //        n = _n;
    //        return _n;
    //    }
        operator T()    {return n;}
    };

    boost::mutex io_mu;

    typedef basic_atom<int> atom_int;

    void printing(atom_int& x, const string& str){
        for (int i = 0;  i < 5; ++i) {
            boost::mutex::scoped_lock lock(io_mu);
            cout << str << ++x <<endl;
        }
    }

    void to_interrupt(atom_int& x, const string& str){
        try {
            for (int i = 0;  i < 5; ++i) {
                this_thread::sleep(posix_time::seconds(1));
                boost::mutex::scoped_lock lock(io_mu);
                cout << str << ++x <<endl;
            }
        } catch (thread_interrupted& ) {
            cout << "thread_interrupted" <<endl;
        }
    }

    int main(int argc, const char * argv[]) {

        cout << "start" <<endl;
        this_thread::sleep(posix_time::seconds(2));
        cout << "sleep 2 seconds" <<endl;

        boost::mutex mu;
        try {
            mu.lock();
            cout << "do some operations" << endl;
            mu.unlock();
        } catch (...) {
            mu.unlock();
        }

        boost::mutex mu1;
        boost::mutex::scoped_lock lock(mu1);
        cout << "some operations" <<endl;

        atom_int x;

        thread t1(printing, boost::ref(x), "hello");

    //    this_thread::sleep(posix_time::seconds(2));

        // join & timed_join
        if (t1.joinable()) {
            t1.join();          // 等待t1 线程结束再返回，不管执行多长时间
        }

        thread t2(printing, boost::ref(x), "boost");
        t2.timed_join(posix_time::seconds(1));      // 最多等待1秒返回

        thread t(to_interrupt, boost::ref(x), "interrupt");
        this_thread::sleep(posix_time::seconds(4));
        t.interrupt();
        t.join();

        return 0;
    }


## asio

Boost.Asio是一个跨平台的、主要用于网络和其他一些底层输入/输出编程的C++库。以下代码实现一个简单的tcp服务，访问`http://localhost:6688`可得到字符.

    #include <iostream>
    #include <string>
    #include <boost/assign.hpp>
    #include <boost/typeof/typeof.hpp>
    #include <boost/assign.hpp>
    #include <boost/thread.hpp>
    #include <boost/thread/mutex.hpp>
    #include <boost/asio.hpp>
    using namespace boost;
    using namespace std;

    int main(int argc, const char * argv[]) {
        using namespace boost::asio;

        try {
            io_service ios;

            ip::tcp::acceptor acceptor(ios, ip::tcp::endpoint(ip::tcp::v4(), 6688));
            cout << acceptor.local_endpoint().address() << endl;

            while (true) {
                ip::tcp::socket sock(ios);
                acceptor.accept(sock);

                cout << "client:" ;
                cout << sock.remote_endpoint().address() << endl;
                sock.write_some(buffer("hello asio"));
            }
        } catch (std::exception& e) {
            cout << e.what() << endl;
        }

        return 0;
    }

更多 boost.asio 相关内容查看[C++ 网络编程](https://mmoaay.gitbooks.io/boost-asio-cpp-network-programming-chinese/content/index.html)
---
layout: post
title: "几道 C++ 问题"
tagline: ""
description: ""
category: 
tags: []
last_updated: 
---

## Question 6

Method overriding is key to the concept of Polymorphism. 覆盖是多态的核心     True

多态可以概括成“一个接口，多个方法”，运行时决定调用函数。`C++` 多态利用虚函数实现，虚函数允许子类重新定义方法，子类重新定义方法的做法称为“覆盖”，或者重写。（直接覆盖成员函数和覆盖虚函数，只有重写了虚函数的才能算作是体现了`C++` 多态性）

封装可以使得代码模块化，继承可以扩展已存在的代码，而多态的目的则是为了接口重用。也就是说，不论传递过来的究竟是那个类的对象，函数都能够通过同一个接口调用到适应各自对象的实现方法。

最常见的用法就是**声明基类的指针，利用该指针指向任意一个子类对象，调用相应的虚函数，可以根据指向的子类的不同而实现不同的方法**。如果没有使用虚函数的话，即没有利用C++多态性，则利用基类指针调用相应的函数的时候，将总被限制在基类函数本身，而无法调用到子类中被重写过的函数。因为没有多态性，函数调用的地址将是一定的，而固定的地址将始终调用到同一个函数，这就无法实现一个接口，多种方法的目的了。

    #include <iostream>  
    using namespace std;  

    class A  
    {  
    public:  
        void foo()  
        {  
            printf("1\n");  
        }  
        virtual void fun()  
        {  
            printf("2\n");  
        }  
    };  
    class B : public A  
    {  
    public:  
        void foo()  
        {  
            printf("3\n");  
        }  
        void fun()  
        {  
            printf("4\n");  
        }  
    };  
    int main(void)  
    {  
        A a;  
        B b;  
        A *p = &a;  
        p->foo();  
        p->fun();  
        p = &b;  
        p->foo();  
        p->fun();  
        return 0;  
    }  

输出  
1 2  
1 4  

基类指针指向基类对象，调用基类函数；基类指针指向子类对象， p->foo() 指针是个基类指针，指向是一个固定偏移量的函数，因此此时指向的就只能是基类的foo()函数的代码了，因此输出的结果还是1。而p->fun() 指针是基类指针，指向的fun是一个虚函数，由于每个虚函数都有一个虚函数列表，此时p调用fun()并不是直接调用函数，而是通过虚函数列表找到相应的函数的地址，因此根据指向的对象不同，函数地址也将不同，这里将找到对应的子类的fun()函数的地址，因此输出的结果也会是子类的结果4。

上面例子，还有一种问法

	B *ptr = (B *)&a;  ptr->foo();  ptr->fun();

输出  
3 2

从原理上来解释，由于B是子类指针，虽然被赋予了基类对象地址，但是ptr->foo()在调用的时候，由于地址偏移量固定，偏移量是子类对象的偏移量，于是即使在指向了一个基类对象的情况下，还是调用到了子类的函数，虽然可能从始到终都没有子类对象的实例化出现。而ptr->fun()的调用，可能还是因为C++多态性的原因，由于指向的是一个基类对象，通过虚函数列表的引用，找到了基类中fun()函数的地址，因此调用了基类的函数。由此可见多态性的强大，可以适应各种变化，不论指针是基类的还是子类的，都能找到正确的实现方法。

“隐藏”是指派生类的函数屏蔽了与其同名的基类函数，规则如下：
（1）如果派生类的函数与基类的**函数同名，但是参数不同**。此时，不论有无virtual
关键字，基类的函数将被隐藏（注意别与重载混淆）。
（2）如果派生类的函数与基类的**函数同名，并且参数也相同**，但是基类函数没有virtual
关键字。此时，基类的函数被隐藏（注意别与覆盖混淆）。

纯虚函数，virtual ReturnType Function()= 0;

C++支持两种多态性：编译时多态性，运行时多态性。 
 
- 编译时多态性：通过**重载函数**实现 
- 运行时多态性：通过**虚函数**实现。 

虚函数是在基类中被声明为virtual，并在派生类中重新定义的成员函数，可实现成员函数的动态覆盖（Override）
包含纯虚函数的类称为抽象类。由于抽象类包含了没有定义的纯虚函数，所以不能定义抽象类的对象。


## Q16

Which objected oriented design concept is key to the factory design pattern?

Inheritance

## Q23

Which of the following describe the C++ programming language?

Compiled   Declarative


## Q25

The friend keyword is used to grant access to private class members.    True

1. 友元函数：普通函数对一个访问某个类中的私有或保护成员。
2. 友元类：类A中的成员函数访问类B中的私有或保护成员。

### 友元函数

	friend <类型><友元函数名>(<参数表>);  

友元函数只是一个普通函数，并不是该类的类成员函数，它可以在任何地方调用，友元函数中通过对象名来访问该类的私有或保护成员

    #include <iostream>
    using namespace std;

    class Base{
    public:
        Base(int _data):data(_data){};

        friend int getData(Base& _base);
    private:
        int data;
    };

    int getData(Base& _base){
        return _base.data;
    }

    int main() {
        Base b(2);
        std::cout << getData(b) << endl;
        return 0;
    }

### 友元类

    friend class <友元类名>;
    
友元类的声明在该类的声明中，而实现在该类外。


    #include <iostream>
    using namespace std;

    class Base{
    public:
        Base(int _data):data(_data){};

        friend class FClass;
    private:
        int data;
    };

    class FClass{
    public:
        int getData(Base _base){
            return _base.data;		// call friend class private data
        }
    };

    int main() {
        Base b(2);
        FClass c;
        cout << c.getData(b) << endl;
        return 0;
    }


## Q38

Choose word or words to describe UML language.

- Picture
- Relational
- Interpreted
- Abstract
- None of the answers are correct.

只有 Picture 正确

The Unified Modeling Language (UML) is a general-purpose, developmental, modeling language in the field of software engineering, that is intended to provide a standard way to visualize the design of a system.

为啥没有 Relation 有点神奇～ UML 图能够看出类与类的关系的啊

## Q40

Generalization is used by UML to describe Inheritance and the deriving of one class from another.

Generaliztion 是从属关系，可以表示继承，或者派生

<http://www.uml-diagrams.org/generalization.html>

## Q44

    #include <iostream>

    void f0(int& sum){
        sum = 3+2*7;
    }

    int main() {
        int *p, sum = 0;
        (*p)++;
        sum = sum * 3;
        f0(sum);
        std::cout << sum << ",";
        return 0;
    }

(*p)++ 一行有问题

具体问题内容请看[这里](../../../assets/paper.pdf)
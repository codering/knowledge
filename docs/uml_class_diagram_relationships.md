---
id: uml_class_diagram_relationships
title: UML类图几种关系的总结
sidebar_label: UML类图关系
---

from http://blog.csdn.net/tianhai110/article/details/6339565

在UML类图中，常见的有以下几种关系:泛化（Generalization）,  实现（Realization）,关联（Association）,聚合（Aggregation）,组合(Composition)，依赖(Dependency)

## 泛化(Generalization)

【泛化关系】：是一种继承关系,它指定了子类如何特化父类的所有特征和行为例如：老虎是动物的一种.

【箭头指向】：带三角箭头的实线，箭头指向父类

![Generalization](/knowledge/img/doc/generalization.gif)

## 实现(Realization)

【实现关系】：是一种类与接口的关系，表示类是接口所有特征和行为的实现

【箭头指向】：带三角箭头的虚线，箭头指向接口

![Realization](/knowledge/img/doc/realization.gif)

## 关联(Association)

【关联关系】：是一种拥有的关系,它使一个类知道另一个类的属性和方法；如：老师与学生，丈夫与妻子

关联可以是双向的，也可以是单向的。双向的关联可以有两个箭头或者没有箭头，单向的关联有一个箭头。

【代码体现】：成员变量

【箭头及指向】：带普通箭头的实心线，指向被拥有者

![Association](/knowledge/img/doc/association.gif)

上图中，老师与学生是双向关联，老师有多名学生，学生也可能有多名老师。但学生与某课程间的关系为单向关联，一名学生可能要上多门课程，课程是个抽象的东西他不拥有学生。

![Association2](/knowledge/img/doc/association2.gif)

上图为自身关联
 
## 聚合(Aggregation)

【聚合关系】：是整体与部分的关系.如车和轮胎是整体和部分的关系.

聚合关系是关联关系的一种，是强的关联关系；关联和聚合在语法上无法区分，必须考察具体的逻辑关系。

【代码体现】：成员变量

【箭头及指向】：带空心菱形的实心线，菱形指向整体

![Aggregation](/knowledge/img/doc/aggregation.gif)

## 组合(Composition)

【组合关系】：是整体与部分的关系.,没有公司就不存在部门      组合关系是关联关系的一种，是比聚合关系还要强的关系，它要求普通的聚合关系中代表整体的对象负责代表部分的对象的生命周期

【代码体现】：成员变量

【箭头及指向】：带实心菱形的实线，菱形指向整体

![Composition](/knowledge/img/doc/composition.gif)


## 依赖(Dependency)

【依赖关系】：是一种使用的关系,所以要尽量不使用双向的互相依赖。

【代码表现】：局部变量、方法的参数或者对静态方法的调用

【箭头及指向】：带箭头的虚线，指向被使用者

 ![Dependency](/knowledge/img/doc/dependency.gif)

## 各种关系的强弱顺序：

`泛化= 实现> 组合> 聚合> 关联> 依赖`

## 总示例图

下面这张UML图，比较形象地展示了各种类图关系：

![summary](/knowledge/img/doc/summary.gif)

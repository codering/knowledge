---
id: basic_object
title: Java对象之父-Object
sidebar_label: Java对象之父-Object
---

## 源码

源码(JDK1.8)如下：

```java

package java.lang;

public class Object {

    private static native void registerNatives();

    static {
        registerNatives();
    }

    public final native Class<?> getClass();

    public native int hashCode();

    public boolean equals(Object obj) {
        return (this == obj);
    }

    protected native Object clone() throws CloneNotSupportedException;

    public String toString() {
        return getClass().getName() + "@" + Integer.toHexString(hashCode());
    }

    public final native void notify();

    public final native void wait(long timeout) throws InterruptedException;

    public final void wait(long timeout, int nanos) throws InterruptedException {
        if (timeout < 0) {
            throw new IllegalArgumentException("timeout value is negative");
        }

        if (nanos < 0 || nanos > 999999) {
            throw new IllegalArgumentException(
                                "nanosecond timeout value out of range");
        }

        if (nanos > 0) {
            timeout++;
        }

        wait(timeout);
    }

    public final void wait() throws InterruptedException {
        wait(0);
    }

    protected void finalize() throws Throwable { }
}

```

## 知识点

### native

- 通常用在方法上，类似于abstract修饰的方法，只声明，无实现。
- 表明这个方法是通过JNI技术来调用Native语言写的函数来完成，Native语言一般是指C/C++编写的函数
- JNI是`Java Native Interface`的缩写 ，通常称为"`Java本地调用`",它将底层Native世界和Java世界联系起来,实现相互调用
- Java调用native函数，需要通过一个位于JNI层的动态库来实现，这个通常是在类的static语句中加载。动态库的名称，在不同平台对应的库文件名是不一样的。例如`xxx_jni`,Linux下为`libxxx_jni.so`,Windows下为`xxx_jni.dll`。但加载的时候只需要指定名称即可，系统会根据不同平台扩展成真实的动态库文件名。
- 在JAVA项目启动时，指定vm参数`-verbose:jni`就可以看到JDK中定义了哪些native方法。
  ```
  [Dynamic-linking native method java.lang.Object.registerNatives ... JNI]
  [Registering JNI native method java.lang.Object.hashCode]
  [Registering JNI native method java.lang.Object.wait]
  [Registering JNI native method java.lang.Object.notify]
  [Registering JNI native method java.lang.Object.notifyAll]
  [Registering JNI native method java.lang.Object.clone]
  [Dynamic-linking native method java.lang.System.registerNatives ... JNI]
  [Registering JNI native method java.lang.System.currentTimeMillis]
  [Registering JNI native method java.lang.System.nanoTime]
  [Registering JNI native method java.lang.System.arraycopy]
  [Dynamic-linking native method java.lang.Thread.registerNatives ... JNI]
  [Registering JNI native method java.lang.Thread.start0]
  [Registering JNI native method java.lang.Thread.stop0]
  [Registering JNI native method java.lang.Thread.isAlive]
  ...
  ...
  [Dynamic-linking native method sun.misc.VM.initialize ... JNI]
  [Dynamic-linking native method java.lang.System.initProperties ... JNI]
  [Dynamic-linking native method java.lang.String.intern ... JNI]
  [Dynamic-linking native method java.lang.Object.getClass ... JNI] //注意这里,getClass居然单独 Dynamic-linking
  [Dynamic-linking native method sun.reflect.Reflection.getClassAccessFlags ... JNI]
  [Dynamic-linking native method sun.reflect.NativeConstructorAccessorImpl.newInstance0 ... JNI]
  [Dynamic-linking native method java.lang.Runtime.maxMemory ... JNI]
  ...
  ...
  ```
  目前还没搞懂`Dynamic-linking` 和 `Registering JNI` 的区别
### final
- 用final修饰类，说明该类不可被继承(extends)。
- 用final修饰非private方法，说明该方法不可被子类重写(Override)。
- 用final修饰变量，说明该变量不可被修改，在声明时就要明确地初始化。对同时被static和final修饰的变量，也可以在类的static块中完成初始化。
  ```java
  public class App {
    private final String FINAL_NAME = "Game";
    private static final String FINAL_NAME_1;
    static {
        FINAL_NAME_1 = "Over";
    }
    ...
    ...
  }
  ```
- Object类中final方法有`getClass()`、`notify()`、`wait()`、`wait(long timeout)`、`wait(long timeout, int nanos)`，因此除Object外的所有类都不可用对这些方法的实现作任何修改，只能调用。

### equals & hashCode
`equals`用于判断当前对象与指定的对象是否相等
+ Object类的默认实现只是判断两个对象的内存地址是否一致，这在真实场景中用户不大，一般会进行重写。
+ 重写需满足如下规则：
  - 自反性: 对于任何非空引用x，x.equals(x)都应返回true
  - 对称性: 对于任何非空引用x、y，当且仅当y.equals(x)返回true时，x.equals(y)才应该返回true
  - 传递性: 对于任何非空引用x、y、z，如果x.equals(y)返回true，且y.equals(z)也返回true，则x.equals(z)也应该返回true
  - 一致性: 对于任何非空引用x、y，如果对象内部属性值没有改变，多次执行x.equals(y)始终返回true或者false。
  - 对于任何非空引用x，x.equals(null)都应该返回false

`hashCode` 返回该对象的hash码
- 一般情况下用途不大，主要用于与hash表相关的类，如HashMap, HashSet等，因为这些类的内部调用了该方法。
- Object类的内部默认实现是将该对象的内存地址转换为一个整数返回。不同对象返回不同的整数。
- 推荐当`equals`方法返回true时，hashCode的返回值也尽量相同；当`equals`方法返回false时，返回的hashCode尽量不同，这对于hash相关的类来说，可以减少hash冲突，获得更好的性能。
- 当重写了`equals`方法时，请记得重写hashCode方法，否则上条规则得不到保证。

更多可参考文章 [equals和hashCode源码解析](basic_equals_hashcode)

### clone
- clone操作以后新对象的内存地址与被克隆对象不一样，内容不变。
- Object类的默认实现为浅拷贝，即如果被拷贝对象中的属性为引用对象，则拷贝后引用对象的内存地址不会发生改变。
- 要实现深拷贝，就要求被拷贝对象内部所有引用对象的属性都要实现Clonable接口, 被拷贝对象在实现clone方法时，要显示调用其内部引用对象的clone方法。如果引用对象内部也包含引用对象，则也要做同样的处理。总的来说，就是要保证整个引用对象链中的所有对象必须都要实现Clonable接口，且实现clone方法时要显示调用其内部引用对象的clone方法。
- 对任何对象要彻底实现深克隆，是有困难的，因为不敢保证该对象引用的第三方库也会实现Clonable接口，而且如果深拷贝链太长，性能也是大问题。
- 一般而言，对任何非空引用x, 如果 x.clone() != x 为 true, 则 x.clone().getClass() == x.getClass() 也为true，但这不是绝对的。
- 一般而言，对任何非空引用x, x.clone().equals(x) 为 true，但这不是绝对的。

更多可参考 [详解Java中的clone方法](basic_clone)

### wait & notify
- wait 和 notify 都必须在 synchronized 修饰的同步方法或同步块(两者都称为"临界区")中调用，因此在执行前必须先获得对象锁
- wait 使当前线程进入等待队列，且立即释放锁，当等待超时或被唤醒或被中断才出等待队列
- wait 应该根据某个条件循环检查, 只有不满足条件才执行wait, 防止伪唤醒或其他线程误唤醒(其他线程可能用该锁保护的是其他变量(或条件)，它就可能会执行唤醒操作)导致当前线程执行了不满足条件的操作
- wait 方法执行完后，必须再次获得锁之后才能继续执行
- notify 使等待队列中的一个线程被唤醒取出，然后和其他非等待线程一起竞争尝试获取锁
- notifyAll 使等待队列的全部线程被唤醒，出队列，然后和其他非等待线程一起竞争尝试获取锁，会增加上下文切换和锁竞争,从而导致CPU占用
- 在 synchronized 修饰的同步方法或同步块中调用notify或notifyAll，其他等待线程(一个或全部)被唤醒，但只有整个同步方法或同步块执行完成后该线程才会释放锁，之后其他线程才能去竞争获取锁
- 等待队列的线程是得不到CPU调度的
- 在没有被notify、中断、超时的情况下，等待线程也可能自动苏醒，这被称为"虚假唤醒"或"伪唤醒"。虽然很少发生，但一定要加循环的条件判断，不满足继续wait，防止执行不该执行的后续操作。

### finalize


---
id: centos_env_setup
title: centos环境搭建
sidebar_label: centos环境搭建
---

## 准备(prepare)

本次搭建遵循以下规则：
- 安装包从官网下载，尽量选择稳定版本
- 安装包都放在/usr/local/src目录中
- 对需要编译的软件，尽量选择安装在`/usr/local`目录，如`/usr/local/nginx`, `/usr/local/redis`。 因为这类软件安装后可执行文件一般都是在`/usr/local/bin`或`/usr/local/sbin`, 因此就近原则便于管理
- 对解压后就可以使用的软件，一般就放在`/opt`目录下，如jdk, zookeeper

nginx及需要用到模块的源码，如下
- [nginx](https://nginx.org/en/download.html), 目前用的1.12.x版本。
- [openssl](https://www.openssl.org/source/), 让ngnix支持ssl(https)功能。一般linux有自带(版本很老)，但nginx在编译时可能找不到，所以最好还是下载一份，目前用的1.1.x并带有小写字母的稳定版本。
- [pcre](https://www.pcre.org/), 让ngnix支持rewrite功能。目前用的8.x版本，最新版本编译不过。
- [zlib](https://zlib.net/)，让ngnix支持gzip功能. 目前用的1.2.x版本。
- [echo](https://github.com/openresty/echo-nginx-module/releases), 让ngnix支持echo输出字符的功能, 对于调试很方便. 目前用的版本是0.61。
- [naxsi](https://github.com/nbs-system/naxsi/releases), 让ngnix支持WAF防火墙,主要是防御XSS和SQL注入的功能. 目前用的0.55.x版本。

java，目前选择的是Oracle的jdk8(8是长期维护版LTS)，新版本还有9和10
- [jdk8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- [jce8](http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html), 这个用于AES加解密长度限制问题。

redis，目前选择的是 3.2.x，最新版是4.x.x
- [redis](https://redis.io/download)

zookeeper, 目前用的3.4.x
- [zookeeper](https://zookeeper.apache.org/releases.html)

## 更新系统(system_update)
  
```shell
yum update
```

如果发现更新源地址不可用，去 /etc/yum.repo.d目下修改源的配置(或自己新建一个xxx.repo文件)，再执行。

```
[base]
name=CentOS-$releasever - Base
baseurl=http://10.10.10.1/centos/$releasever/os/$basearch/
enable=1
gpgcheck=0
gpgkey=http://10.10.10.1/centos/RPM-GPG-KEY-CentOS-6

[updates]
name=CentOS-$releasever - Updates
baseurl=http://10.10.10.1/centos/$releasever/updates/$basearch/
enable=1
gpgcheck=0
gpgkey=http://10.10.10.1/centos/RPM-GPG-KEY-CentOS-6

[extras]
name=CentOS-$releasever - Extras
baseurl=http://10.10.10.1/centos/$releasever/extras/$basearch/
enable=1
gpgcheck=0
gpgkey=http://10.10.10.1/centos/RPM-GPG-KEY-CentOS-6

```

更新完成后，查看下系统及内核版本

```sh
lab_release -a

LSB Version:	:base-4.0-amd64:base-4.0-noarch:core-4.0-amd64:core-4.0-noarch:graphics-4.0-amd64:graphics-4.0-noarch:printing-4.0-amd64:printing-4.0-noarch
Distributor ID:	CentOS
Description:	CentOS release 6.9 (Final)
Release:	6.9
Codename:	Final

uname -a

Linux localhost 2.6.32-642.el6.x86_64 #1 SMP Tue May 10 17:27:01 UTC 2016 x86_64 x86_64 x86_64 GNU/Linux

```

## 安装nginx

### 安装gcc(nginx_gcc)

```sh
yum install gcc gcc-c++
```

### 解压nginx及其依赖模块(nginx_unzip)

```sh
cd /usr/local/src
tar zxvf nginx-1.12.2.tar.gz
tar zxvf pcre-8.40.tar.gz
tar zxvf zlib-1.2.11.tar.gz
tar zxvf echo-nginx-module-0.61.tar.gz
tar zxvf naxsi-0.55.3.tar.gz

```

### 编译与安装(nginx_configure)

```sh
cd nginx-1.12.2
./configure \
--add-module=../naxsi-0.55.3/naxsi_src \
--add-module=../echo-nginx-module-0.61 \
--with-openssl=../openssl-1.1.0g \
--with-pcre=../pcre-8.40 \
--with-pcre-jit \
--with-zlib=../zlib-1.2.11 \
--with-http_realip_module \
--with-http_stub_status_module \
--with-http_ssl_module \
--with-http_sub_module \
--with-http_gzip_static_module \
--with-http_gunzip_module \
--with-stream \

```

执行configure后的输出结果
```
Configuration summary
  + using PCRE library: ../pcre-8.40
  + using OpenSSL library: ../openssl-1.1.0g
  + using zlib library: ../zlib-1.2.11

  nginx path prefix: "/usr/local/nginx"
  nginx binary file: "/usr/local/nginx/sbin/nginx"
  nginx modules path: "/usr/local/nginx/modules"
  nginx configuration prefix: "/usr/local/nginx/conf"
  nginx configuration file: "/usr/local/nginx/conf/nginx.conf"
  nginx pid file: "/usr/local/nginx/logs/nginx.pid"
  nginx error log file: "/usr/local/nginx/logs/error.log"
  nginx http access log file: "/usr/local/nginx/logs/access.log"
  nginx http client request body temporary files: "client_body_temp"
  nginx http proxy temporary files: "proxy_temp"
  nginx http fastcgi temporary files: "fastcgi_temp"
  nginx http uwsgi temporary files: "uwsgi_temp"
  nginx http scgi temporary files: “scgi_temp"
```

确认没什么问题后开始make, 如果看到“Error”, 说明安装失败

```sh
make && make install
```

查看下/usr/local/nginx目录，`sslkey`目录是我自己创建的，用于存放ssl证书
```
ll /usr/local/nginx

总用量 40
drwx------ 2 nobody root 4096 3月  27 10:39 client_body_temp
drwxr-xr-x 2 root   root 4096 3月  28 17:50 conf
drwx------ 2 nobody root 4096 3月  23 14:46 fastcgi_temp
drwxr-xr-x 2 root   root 4096 3月  23 14:43 html
drwxr-xr-x 2 root   root 4096 3月  26 18:58 logs
drwx------ 2 nobody root 4096 3月  23 14:46 proxy_temp
drwxr-xr-x 2 root   root 4096 3月  23 14:43 sbin
drwx------ 2 nobody root 4096 3月  23 14:46 scgi_temp
drwxr-xr-x 2 root   root 4096 3月  26 14:45 sslkey
drwx------ 2 nobody root 4096 3月  23 14:46 uwsgi_temp

```

### 添加软连接(link_nginx_sbin)

如果你指定了`--sbin-path`，这步可选。

由于configure时没有指定`--sbin-path`, 因此nginx可执行文件默认路径为`prefix/sbin/nginx`，即`/usr/local/nginx/sbin/nginx`。因此为了便于使用，给nginx可执行文件加个软连接，这样就不必用全路径来使用nginx命令。
```
ln -s /usr/local/nginx/sbin/nginx /usr/local/sbin/nginx
```

## 安装redis

### 安装gcc(redis_gcc)
```sh
yum install gcc
```

### 解压(redis_unzip)
```sh
cd /usr/local/src
tar zxvf redis-3.2.11.tar.gz
```

### 编译(redis_make)
```sh
cd redis-3.2.11
make MALLOC=libc # 如果已安装jemalloc，直接执行make
make install
```
这里注意`make`时指定了`MALLOC`参数，因为redis默认的内存管理策略是`jemalloc`, 如果没有装这个，请改成`libc`.

### 安装及初始化配置(redis_init)
```sh
cd utils # 进入redis源码中的utils目录
./install_server.sh #执行后会有交互性提示，让你选择路径配置文件路径及端口等，如下

This script will help you easily set up a running redis server

Please select the redis port for this instance: [6379]
Selecting default: 6379
Please select the redis config file name [/etc/redis/6379.conf] /usr/local/redis/6379.conf
Please select the redis log file name [/var/log/redis_6379.log] /usr/local/redis/log/6379.log
Please select the data directory for this instance [/var/lib/redis/6379] /usr/local/redis/db/6379
Please select the redis executable path [/usr/local/bin/redis-server]
Selected config:
Port           : 6379
Config file    : /usr/local/redis/6379.conf
Log file       : /usr/local/redis/log/6379.log
Data dir       : /usr/local/redis/db/6379
Executable     : /usr/local/bin/redis-server
Cli Executable : /usr/local/bin/redis-cli

```
查看下redis的安装目录
```sh
ll /usr/local/redis/
总用量 12
drwxr-xr-x 2 root root 4096 3月  26 14:37 conf
drwxr-xr-x 3 root root 4096 3月  23 16:19 db
drwxr-xr-x 2 root root 4096 3月  23 16:19 log
```

### 修改绑定IP(redis_bind)

`注：这步可以与下面的‘设置密码’一起操作，都是同一个配置文件`

redis默认只会绑定本机127.0.0.1, 这样的话，访问redis服务只能通过本机的客户端连接，而无法通过远程连接，这样可以避免将redis服务暴露于危险的网络环境中，防止一些不安全的人随随便便通过远程连接到redis服务.

为了远程连接，把服务器的真实IP追加到bind中，假设ip为192.168.20.200, 操作如下

```sh
# 编辑配置文件
vi /usr/local/redis/conf/6379.conf 

# 查找bind的配置，如下

################################## NETWORK #####################################

# By default, if no "bind" configuration directive is specified, Redis listens
# for connections from all the network interfaces available on the server.
# It is possible to listen to just one or multiple selected interfaces using
# the "bind" configuration directive, followed by one or more IP addresses.
#
# Examples:
#
# bind 192.168.1.100 10.0.0.1
# bind 127.0.0.1 ::1
#
# ~~~ WARNING ~~~ If the computer running Redis is directly exposed to the
# internet, binding to all the interfaces is dangerous and will expose the
# instance to everybody on the internet. So by default we uncomment the
# following bind directive, that will force Redis to listen only into
# the IPv4 lookback interface address (this means Redis will be able to
# accept connections only from clients running into the same computer it
# is running).
#
# IF YOU ARE SURE YOU WANT YOUR INSTANCE TO LISTEN TO ALL THE INTERFACES
# JUST COMMENT THE FOLLOWING LINE.
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
bind 127.0.0.1 192.168.20.200

```

## 设置密码(redis_requirepass)

redis默认情况下，客户端连接是不需要密码的，只要ip和端口正确就可以连接。安全考虑，需设置一个密码，假设为123456，如下
```sh
# 编辑配置文件
vi /usr/local/redis/conf/6379.conf 

# 查找requirepass的配置，


################################## SECURITY ###################################

# Require clients to issue AUTH <PASSWORD> before processing any other
# commands.  This might be useful in environments in which you do not trust
# others with access to the host running redis-server.
#
# This should stay commented out for backward compatibility and because most
# people do not need auth (e.g. they run their own servers).
#
# Warning: since Redis is pretty fast an outside user can try up to
# 150k passwords per second against a good box. This means that you should
# use a very strong password otherwise it will be very easy to break.
#
requirepass 123456

# Command renaming.

```

### 启动与停止(redis_commands)

redis的可执行文件默认是在`/usr/local/bin`中，因此可以直接使用

```sh
# 启动
redis-server /usr/local/redis/conf/6379.conf

# 停止
redis-cli shutdown 
# 或直接kill
kill -9 redis的pid
```

## 安装java

### 卸载系统自带的openjdk
```sh
# 看下系统自带的java版本
java -version
# 输出如下
openjdk version "1.8.0_161"
OpenJDK Runtime Environment (build 1.8.0_161-b14)
OpenJDK 64-Bit Server VM (build 25.161-b14, mixed mode)
# 查看系统自带的java路径
rpm -qa | grep java
# 输出如下
java-1.6.0-openjdk-1.6.0.41-1.13.13.1.el6_8.x86_64
tzdata-java-2018c-1.el6.noarch
java-1.7.0-openjdk-1.7.0.171-2.6.13.0.el6_9.x86_64
# java开头的openjdk都卸载
yum -y remove java-1.6.0-openjdk-1.6.0.41-1.13.13.1.el6_8.x86_64
yum -y remove java-1.7.0-openjdk-1.7.0.171-2.6.13.0.el6_9.x86_64
```

### 解压(unzip_jdk)
```sh
# 解压到/opt目录
tar zxvf jdk-8u131-linux-x64.tar.gz -C /opt
```

### 设置环境变量(set_java_env_vars)
```sh
#编辑当前用户主目录下的`.bash_profile`文件
vi ~/.bash_profile
```
修改后如下, 没加`CLASS_PATH`,有需要自己添加下
```sh
# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/bin

export JAVA_HOME=/opt/jdk1.8.0_131

export PATH="$PATH:$JAVA_HOME/bin/"

```

重新加载`.bash_profile`

```sh
source ~/.bash_profile
```

查看当前java版本及路径
```sh
java -version
# 输出如下
java version "1.8.0_131"
Java(TM) SE Runtime Environment (build 1.8.0_131-b11)
Java HotSpot(TM) 64-Bit Server VM (build 25.131-b11, mixed mode)

which java
# 输出如下
/opt/jdk1.8.0_131/bin/java

```

### 修改JCE

因为某些国家的进口管制限制，Java发布的运行环境包中的加解密有一定的限制。比如默认不允许256位密钥的AES加解密，解决方法就是修改策略文件。

解压,可以看到local_policy.jar和US_export_policy.jar以及readme.txt。 

- 如果安装了JRE，将两个jar文件放到%JRE_HOME%\lib\security下覆盖原来文件，记得先备份。 

- 如果安装了JDK，将两个jar文件也放到%JAVA_HOME%\jre\lib\security下

## 安装zookeeper

`安装之前，先先确保java命令可用，因为zookeeper依赖java.`

如果zookeeper单独安装在一台服务器上，为了方便，我直接用系统自带的openjdk，没用oracle jdk。

### 解压(unzip_zk)
```sh
# 解压到/opt
tar zxvf zookeeper-3.4.10.tar.gz -C /opt
```

### 添加配置文件zoo.cfg
```sh
cd /opt/zookeeper-3.4.10/conf
# 从示例文件复制
cp zoo_sample.cfg zoo.cfg
# 修改配置
vi zoo.cfg
```

### 修改数据存储路径(zk_dataDir)
查找`dataDir`,修改如下
```sh
# the directory where the snapshot is stored.
# do not use /tmp for storage, /tmp here is just
# example sakes.
dataDir=/opt/zookeeper-3.4.10/snapshot

```

### 启动/停止/重启(zk_commands)
```sh
zkServer.sh start
zkServer.sh stop
zkServer.sh restart
```

### 客户端连接(zk_client)
```sh
# 连接zk服务端，如果是远程连接，请换成远程服务器ip
zkCli.sh -server 127.0.0.1:2181
# 输出如下
Connecting to 127.0.0.1:2181
2018-03-29 15:45:11,977 [myid:] - INFO  [main:Environment@100] - Client environment:zookeeper.version=3.4.10-39d3a4f269333c922ed3db283be479f9deacaa0f, built on 03/23/2017 10:13 GMT
2018-03-29 15:45:11,980 [myid:] - INFO  [main:Environment@100] - Client environment:host.name=localhost
...
...
[zk: 127.0.0.1:2181(CONNECTED) 0]

# 查看根节点
[zk: 127.0.0.1:2181(CONNECTED) 1] ls /
[dealer, dubbo, zookeeper]

# 查看根节点信息
[zk: 127.0.0.1:2181(CONNECTED) 4] ls2 /
[dealer, dubbo, zookeeper]
cZxid = 0x0
ctime = Thu Jan 01 08:00:00 CST 1970
mZxid = 0x0
mtime = Thu Jan 01 08:00:00 CST 1970
pZxid = 0x2d
cversion = 1
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 0
numChildren = 3

# 退出
[zk: 127.0.0.1:2181(CONNECTED) 5] quit
```

## 防火墙iptables修改

开启防火墙后，有些软件的端口是无法访问，需要自己手动添加端口控制

### 配置文件路径(iptables_conf)

`/etc/sysconfig/iptables`

### 添加常用端口控制(iptables_ports)
```sh
vi /etc/sysconfig/iptables
```

比如要开放6379,2181端口, 修改如下
```sh
# Firewall configuration written by system-config-firewall
# Manual customization of this file is not recommended.
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]
-A INPUT -p tcp -m tcp --dport 6379 -j ACCEPT # 这是我添加的
-A INPUT -p tcp -m tcp --dport 2181 -j ACCEPT # 这是我添加的
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
-A INPUT -p icmp -j ACCEPT
-A INPUT -i lo -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp -s 10.0.0.0/8 --dport 22 -j ACCEPT
-A INPUT -s 10.10.32.0/24 -j ACCEPT
-A INPUT -s 10.10.21.0/24 -j ACCEPT
-A INPUT -j REJECT --reject-with icmp-host-prohibited
-A FORWARD -j REJECT --reject-with icmp-host-prohibited
COMMIT
```

重启防火墙就可以生效
```sh
service iptables restart
```

### 常用命令(iptables_commands)
```sh
#启用
service iptables start
#停止
service iptables stop
#重启
service iptables restart
```

查看状态

```sh
service iptables status
# 输出如下
Table: filter
Chain INPUT (policy ACCEPT)
num  target     prot opt source               destination
1    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0           tcp dpt:6379
2    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0           tcp dpt:2181
3    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           state RELATED,ESTABLISHED
4    ACCEPT     icmp --  0.0.0.0/0            0.0.0.0/0
5    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0
6    ACCEPT     tcp  --  10.0.0.0/8           0.0.0.0/0           state NEW tcp dpt:22
7    ACCEPT     all  --  10.10.32.0/24        0.0.0.0/0
8    ACCEPT     all  --  10.10.21.0/24        0.0.0.0/0
9    REJECT     all  --  0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited
```


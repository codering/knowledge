---
id: nginx_basic_auth
title: nginx用户认证配置（ Basic HTTP authentication）
sidebar_label: nginx用户认证配置
---

ngx_http_auth_basic_module模块实现让访问者只有输入正确的用户密码才允许访问web内容。web上的一些内容不想被其他人知道，但是又想让部分人看到。nginx的http auth模块以及Apache http auth都是很好的解决方案。

默认情况下nginx已经安装了ngx_http_auth_basic_module模块，如果不需要这个模块，可以加上 –without-http_auth_basic_module

## nginx basic auth指令

语法:     auth_basic string | off;
默认值:     auth_basic off;
配置段:     http, server, location, limit_except

默认表示不开启认证，后面如果跟上字符，这些字符会在弹窗中显示。

语法:     auth_basic_user_file file;
默认值:     —
配置段:     http, server, location, limit_except

用户密码文件，文件内容类似如下：

```
testuser1:password1
testuser2:password2:comment

```

## nginx认证配置实例

```
server{
       server_name  www.xiaoten.com xiaoten.com;
 
        index index.html index.php;
        root /data/site/www.xiaoten.com;       
 
        location /
        {
                auth_basic "nginx basic http test for xiaoten.com";
                auth_basic_user_file conf/htpasswd; 
                autoindex on;
        }
}
```

备注：一定要注意auth_basic_user_file路径，否则会不厌其烦的出现403。

生成密码

可以使用htpasswd，或者使用openssl

```
# printf "test:$(openssl passwd -crypt 123456)\n" >>conf/htpasswd
# cat conf/htpasswd 
test:xyJkVhXGAZ8tM

```

账号：test
密码：123456

重启 nginx

```
# /usr/local/nginx-1.5.2/sbin/nginx -s reload
```

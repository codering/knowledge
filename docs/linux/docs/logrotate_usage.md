---
id: logrotate_usage
title: logrotate日志轮转配置文档
sidebar_label: logrotate配置
---

from http://blog.163.com/bull_linux/blog/static/2138811422013101334544349/

## 基本用法

- 使用：
    logrotate CONF_FILE+

- 描述：
    可自动轮转，压缩，删除，邮寄日志文件。可每天，每周，每月或日志文件达到一定大小时进行操作。

    通常logrotate是一个每天的cron计划，一般不会在一天内多次修改日志，除非轮转是基于日志大小的，
    或者logrotate被多次运行，使用了-f(--force)项。

    命令行上可指定任何多个配置文件。
    后面的配置会覆盖前面的配置，所以配置文件的加载顺序很重要。
    通常需要在一个配置文件中include其他配置文件，具体参见include指令用法。
    如果在命令行上给出了一个目录，那么该目录下所有文件都将被用作配置文件。

    如果没有参数，logrotate就打印版本等信息。如果在轮转日志时发生错误，会以非0状态退出。

- 选项：

 ```
    -d    debug模式，隐含-v，不会对日志文件做实际操作
    -f, --force
        强制轮转日志
    -m, --mail <command>
        邮寄日志时使用的命令
    -s, --state <statefile>
        指定另一个state文件
    --usage
        打印帮助
    -v, --verbose
        详细信息
```

配置文件
    logrotate会读取每一个配置文件，配置文件中可对global和具体log文件配置。
    本地配置(log文件配置)覆盖global配置，后来的配置覆盖先前的配置。

## 示例

```sh
       # sample logrotate configuration file            注释行
       compress                            轮转后进行压缩

       /var/log/messages {                 指定日志文件路径
           rotate 5                        保留5个轮转文件
           weekly                          每周轮转
           postrotate                      轮转之后执行的命令(在压缩旧日志之前)
               /usr/bin/killall -HUP syslogd
           endscript
       }

       /usr/local/nginx/logs/*.log {       nginx日志文件
            daily
            rotate 5
            missingok
            dateext
            compress
            delaycompress
            notifempty
            sharedscripts
            postrotate
                if [ -f /usr/local/nginx/logs/nginx.pid ]; then
                    kill -USR1 `cat /usr/local/nginx/logs/nginx.pid`
                fi
            endscript
        }

       "/var/log/httpd/access.log" /var/log/httpd/error.log {  指定了两个日志文件
                                                               文件名中有空格
                                                               要用"支持' " \的shell引用规则字符
           rotate 5                        保留5个轮转文件
           mail www@my.org                 解压后邮寄超过5次轮转的老日志文件，而不是删除
           size 100k                       日志文件达到100K时就进行轮转
           sharedscripts                   表示postrotate脚本在压缩了日志之后只执行一次
           postrotate
               /usr/bin/killall -HUP httpd
           endscript
       }

       /var/log/news/* {            所有/var/log/news/下的文件
                                    通配符*，会轮转包括之前轮转的文件，需要olddir指令
                                    或者*.log来指定只有.log后缀的文件
           monthly                  每月轮转
           rotate 2                
           olddir /var/log/news/old 配合指定文件时的*通配符使用
           missingok                如果指定的目录不存在，logrotate会报错，此项用来关闭报错
           postrotate
               kill -HUP `cat /var/run/inn.pid`
           endscript
           nocompress               不压缩
       }
```
=====================================================

## 详细选项解释

- rotate COUNT

    轮转COUNT次，也就是最多保留COUNT个轮转备份。
    超出的被删除或邮寄。
    设置为0，则不保存轮转的老日志。

- start COUNT

    轮转文件名基于这个数字。
    例如，指定0时，原日志文件轮转的备份文件以.0为扩展名，如果指定9，就直接从.9开始跳过0-8
    然后再继续向后轮转rotate指定的次数。

- compress

    默认使用gzip压缩老日志

- nocompress

    不压缩老日志

- compresscmd

    指定压缩命令，默认gzip

- uncompresscmd

    指定解压命令，默认gunzip

- compressext

    如果启用了压缩，指定在压缩了的日志文件上使用哪个扩展。默认随配置的压缩命令

- compressoptions

    可以传送命令行选项给压缩程序，默认的gzip使用-9选项(最大压缩率)

- delaycompress

    延迟到下次轮转时压缩之前的日志文件。

    需要与compress项连用，当程序有时不能关闭写日志文件时可使用此项。

- nodelaycompress

    不延迟压缩

- copy

    拷贝日志文件，不修改原有文件。

    给当前日志文件做快照，或其他工具需要截断或解析文件时，可使用此项

    使用此项时，create项就没用了，因为老日志文件占着位置

- nocopy

    留下原日志文件而不复制

- copytruncate

    在创建了拷贝后截断原日志文件到0大小，而不是用移动就日志文件再创建新文件的方法。

    可用于日志一些程序不关闭日志文件一直写的情况。

    注意，在拷贝文件和截断文件时有一个非常小的时间片，所以可能会丢失日志信息。

    使用此项时，create无效

- nocopytruncate

    创建拷贝后不截断原日志文件

- create MODE OWNER GROUP

    在轮转动作之后，postrotate脚本执行之前，立即使用刚轮转的日志文件名创建日志文件。

    MODE 指定日志文件的权限(0660之类)

    OWNER 指定日志文件的属主

    GROUP 指定日志文件的属组

    可省略任何上述属性，省略的属性从原文件继承，可使用nocreate项来关闭

- nocreate

    不创建新的日志文件

- daily

    每天轮转日志文件

- weekly

    如果当前的星期几比上次轮转的星期几少，或者过了一个多星期，就会发生轮转

    通常是在每周的第一天轮转，如果logrotate不是每天运行的，会在第一次有机会时进行轮转。

- monthly

    一月中logrotate第一次运行时进行轮转(通常是一月的第一天)

- yearly

    如果当前年份不同于上次轮转的年份，则进行日志轮转

- dateext

    归档旧日志文件时，文件名添加YYYYMMDD形式日期，可用dateformat选项扩展配置。

- nodateext

    不使用dateext扩展名

- dateformat FORMAT_STRING

    使用strftime(3)类似的格式指定dateext的格式，只允许%Y %m %d和%s指定符。

    默认为 -%Y%m%d

    注意：扩展中分割日志的字符也是日期格式的一部分，系统时钟需要设置到2001-09-09之后，%s才能正确工作

- extension EXT

    日志文件可在轮转后使用指定的EXT扩展名。

    如果使用压缩，通常EXT后还会加上压缩文件的扩展名，通常是.gz。

    例如想把mylog.foo轮转为mylog.1.foo.gz而不是mylog.foo.1.gz

- ifempty

    默认项，即使日志是空的也进行轮转，覆盖notifempty项

- notifempty

    如果日志为空，则不进行轮转

- include FILE_OR_DIRECTORY

    读取include指令下的文件。

    如果是目录，在继续处理包含的文件之前，按字母顺序读取目录下大部分文件(只读取普通文件)

    目录或管道文件等，还有使用指定扩展名的文件不读取

    用tabooext指令定义禁忌扩展名。

    include指令不能出现在日志文件定义中。

- tabooext [+] LIST

    修改当前禁忌扩展名列表。

    如果列表前使用了+，表示将LIST加到当前列表中，否则就替换当前列表。

    默认包含：.rpmorig, .rpmsave, .v, .swp, .dpkg-dist, .dpkg-old, .dpkg-new, .disabled

- mail ADDRESS

    当日志轮转超过保留数时，多出的会mail到ADDRESS。

    可在log定义中使用nomail指令来不邮寄该log

- nomail

    不邮寄日志

- mailfirst

    与mail指令连用，邮寄刚轮转的日志，而不是期满的日志(超出数量要被删除的)

- maillast

    默认项，与mail连用，邮寄超出rotate数量要被删除的日志。

- maxage COUNT

    删除COUNT天前的轮转备份。

    只在轮转动作时检查日志文件的时间戳。

    如果配置了maillast和mail指令，删除的轮转备份会被邮寄。

- minsize SIZE

    日志文件增长到超过SIZE bytes时进行轮转，但不会在额外指定的时间间隔之前(daily，weekly等)。

    相关的size指令与其类似，但size与间隔指令互斥，不考虑时间而直接进行轮转。

    而minsize指令要考虑大小和时间戳。

- size SIZE

    超过SIZE时轮转，SIZE默认单位是KB，可使用M，G来指定MB和GB。

- shred

    默认关闭

    删除文件使用shred -u(销毁)而不是unlink()系统调用。

    可确保删除日志后，文件不可读(对磁盘伤害大)。

- shredcycles COUNT

    调用shred在删除日志文件前覆写COUNT次，不使用此项时，就按shred默认次数覆写。

- noshred

    删除就文件时不使用shred

- missingok

    如果日志文件不存在，继续处理下一个文件而不产生报错信息。

- nomissingok

    默认项，如果日志文件不存在，就产生错误。

- olddir DIRECTORY

    轮转的日志放到DIRECTORY目录中，目录必须与日志文件在同一物理设备上，
    如果没指定绝对路径，则假定该目录在与日志目录下。

- noolddir

    日志只在它们的当前目录中轮转。

- sharedsctipts

    通常prerotate和postrotate脚本为每一个轮转的日志运行，也就是说一个单独的脚本可能因为日志轮转定义
    中匹配了多个文件时(例如/var/log/news/*)，该脚本会运行多次。

    指定此项，脚本只对所有匹配的日志文件统一执行一次。

    如果匹配的日志都不需要轮转，脚本也不会执行。

    如果脚本错误退出，剩下的动作也不会为任何日志执行。

    隐含create项，可被nosharedscripts覆盖。

- nosharedscripts

    默认项

    为每一个轮转的日志执行prerotate和postrotate

    如果脚本错误退出，剩下的动作只不对影响到的日志执行。

- prerotate/endscript

    在prerotate和endscript之间的行(他俩自己各占一行)，在日志文件被轮转之前并且有需要轮转时，才会执行。

    该指令只能用于log文件定义中。

- postrotate/endscript

    在prerotate和endscript之间的行，在日志文件被轮转之后执行。

    该指令只能用于log文件定义中。

- firstaction/endscript

    在firstaction和endscript之间的行，在轮转所有匹配了通配符的日志被轮转之前，
    在prerotate执行之前，并且至少要有一个日志需要被轮转时，才会执行。

    只能用于log文件定义中，如果脚本错误退出，就不再继续往下进行。

- lastaction/endscript

    在lastaction和endscript之间的行，在轮转了所有匹配的日志后，在postrotate执行之后，
    并且至少要有一个日志被轮转了的情况下，才会执行。

    只能用于log文件定义中，如果脚本错误退出，只显示一个错误信息作为最后的动作。

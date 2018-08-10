---
id: linux_sed_usage
title: linux命令sed
sidebar_label: linux命令sed
---

from https://blog.csdn.net/tp7309/article/details/51418412
## 使用grep正则提取字符串
```sh
echo office365 | grep -P '\d+' -o
```

```sh
find . -name "*.txt" | xargs grep -P 'regex' -o
```

xargs会将find结果作为grep的输入，防止find结果过多无法处理 

-P参数表明要应用正则表达式 

-o表示只输出匹配的字符串，这样我们就可以把正则匹配到的结果拿到了。

## 使用sed正则提取字符串

Mac OS上用正则的话要用e参数取代P参数，也可以用sed命令： 
- sed命令格式：
```sh
sed 's/oldValue/newValue/g'
```
- 提取字符串
```sh
echo here365test | sed 's/.*ere\([0-9]*\).*/\1/g'
```
输出：
365

s表示替换，\1表示用第一个括号里面的内容替换整个字符串，sed支持*，不支持?、+，不能用\d之类，正则支持有限。

- 替换字符串
```sh
echo here365test | sed 's/365/789/g'
```
输出：
here789test
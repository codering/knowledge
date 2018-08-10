---
id: sparse-checkout
title: git获取子目录
sidebar_label: git获取子目录
---

## 场景
假设有一个大仓库，地址为 `https://github.com/codering/bigrepo.git`

目录结构如下，app1, app2都是目录，现在我只想取app2目录，路径为`src/app2`

```sh
.
├── src
│   ├── app1
│   ├── app2
│   ├── ...
│   ├── ...
│   └── ...

```

## 步骤

### 本地创建一个空仓库 
```sh
mkdir myapp
cd myapp
git init
```

### 修改Git配置
```sh
# 设置支持按目录取
git config core.sparsecheckout true 
# 设置要取的目录路径
echo 'src/app2' >> .git/info/sparse-checkout 
```

如果你取`app1`以外的所有内容,可以这样

```sh
echo '/*' >> .git/info/sparse-checkout # * 表示取所有
echo '!src/app1' >> .git/info/sparse-checkout # ! 表示排除
```

也可以直接编辑当前项目中`.git/info/sparse-checkout`文件即可，注意`.git`是隐藏目录

### 添加远程仓库地址

```sh
git remote add origin https://github.com/codering/bigrepo.git
```

### 取出子目录

```sh
git pull remote master
```

最终结果如下：

```sh
.
├── src
│   ├── app2

```

## 小结
无论如何，你都要把远程仓库的所有版本控制信息拉到本地才行。

如果遇到一个非常大的仓库，你拉取版本库的信息也要很久....



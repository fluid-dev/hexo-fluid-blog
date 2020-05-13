---
title: 搭配 Fluid 如何优雅的写一篇文章
date: 2020-05-13 17:39:30
index_img: https://cdn.vince.pub/blog-file/photo/fluid-write.jpg
tags: 
categories: 
excerpt: Fluid 是一款很优雅的主题，主要介绍从使用主题拓展和配图来写作。
---

{% note success %}
本文由 Fluid 用户授权转载，版权归原作者所有。

本文作者：Vince
原文地址：https://i.vince.pub/posts/14677127/
{% endnote %}

## 前言

Fluid 是一款很十分优雅的主题，那么写一篇优雅的文章搭配它呢？以下会从几个方面来简述，主要还是做几个推荐。

## 文章内容

### 熟悉 Markdown 语法

对于使用 Hexo 的大多数人来说，相信对 Markdown 的语法不会陌生。熟练掌握 Markdown 语法对我们的写作拥有极大的帮助，这里用少用的表格和脚注来举个例子。至于为什么有些公式、流程图无法渲染，是因为 **Markdown 追求简洁式写作，默认渲染器不支持复杂渲染。**

#### 表格

站点|地址|介绍
--|:--:|--:
Fliud Docs|https://hexo.fluid-dev.com/docs/|Fliud 官方文档
Hexo-theme-fluid|https://github.com/fluid-dev/hexo-theme-fluid|Fliud Github Repo
Fluid Blog|https://hexo.fluid-dev.com/|Fliud 官方博客

```
站点|地址|介绍
--|:--:|--:
Fliud Docs|https://hexo.fluid-dev.com/docs/|Fliud 官方文档
Hexo-theme-fluid|https://github.com/fluid-dev/hexo-theme-fluid|Fliud Github Repo
Fluid Blog|https://hexo.fluid-dev.com/|Fliud 官方博客
```

#### 脚注
脚注演示[^footnote]
 [^footnote]: 脚注内容演示

```
脚注演示[^footnote]
 [^footnote]: 脚注内容演示
```


### 善用 HTML

我们可以在 Markdown 中插入一些简单的 HTML 代码或 CSS 片段来获得更多扩展，使得文章内容更具有多样性。以下演示几个简单功能。

<a id="demo">跳转位置演示（跳转位置设置点）</a>

#### 文字颜色

<span  style="color: #519D9E; ">#519D9E颜色演示</span>

```
<span  style="color: #519D9E; ">#519D9E颜色演示</span>
```

***

#### 文字大小

<span  style="font-size:0.7em;">0.7em 文字大小演示</span>

```
<span  style="font-size:0.7em;">0.7em 文字大小演示</span>
```

***

#### 文字位置

<p style="text-align:center">内容居中演示</p>

```
<p style="text-align:center">内容居中演示</p> # 可以修改 text-align 参数来设置文字位置。
```

***

#### 页内跳转

<a href="#demo">点击到达跳转位置演示</a>

```
<a href="#demo">点击到达跳转位置演示</a> # 在需要跳转的地方添加此代码。
<a id="demo">跳转位置演示（跳转位置设置点）</a> # 在跳转位置添加次代码。
```

***

#### 综合演示

<p style="text-align:center;color:#8EC0E4;font-size:1.5em;font-weight: bold;">
综合演示
<br>
优雅使用 Fliud 写文章
</p>

```
<p style="text-align:center;color:#8EC0E4;font-size:1.5em;font-weight: bold;">
综合演示
<br>
优雅使用 Fliud 写文章
</p>

```

### 善用 Tag 组件

Fluid 内置了许多 Tag 组件，包含便签、行内标签、勾选框、按钮和组图，可以使用这些组件来丰富文章内容，具体点击查看官方文档查看，**[点击跳转到 Fliud Doc](https://hexo.fluid-dev.com/docs/guide/#tag-%E6%8F%92%E4%BB%B6)**。

## 配图

众所周知，**博客好不好看，配图占一半**。这里给大家推荐几个我常用找配图的地方。**另外，请遵循对于网站的版权协议。**

### Wallpaper Hub
![Wallpaper Hub](https://cdn.vince.pub/blog-file/photo/2020-04-17_175244.png)

**[点击跳转到 Wallpaper Hub](https://wallpaperhub.app/)**

### Wallhaven
![Wallhaven](https://cdn.vince.pub/blog-file/photo/2020-04-17_174841.png)

**[点击跳转到 Wallhaven](https://wallhaven.cc/)**

### Unsplash
![Unsplash](https://cdn.vince.pub/blog-file/photo/2020-05-14_000557.png)

**[点击跳转到 Wallhaven](https://unsplash.com/)**
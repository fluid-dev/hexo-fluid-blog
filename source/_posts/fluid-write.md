---
title: 搭配 Fluid 如何优雅的写一篇文章
author: Vince
date: 2020-05-13 17:39:30
index_img: https://rmt.dogedoge.com/fetch/fluid/storage/fluid-write/cover.jpg?w=480&fmt=webp
category: 主题示例
tags: 
  - 用户经验
  - 示例
  - Fluid
excerpt: Fluid 是一款很优雅的主题，主要介绍从使用主题拓展和配图来写作。
---

{% note success %}
本文由 Fluid 用户授权转载，版权归原作者所有。

本文作者：Vince
原文地址：<https://i.vince.pub/p/fluid-write/>
{% endnote %}

## 前言

Fluid 是一款很十分优雅的主题，那么写一篇优雅的文章搭配它呢？以下会从几个方面来简述，主要还是做几个推荐。

## 文章内容

### 熟悉 Markdown 语法

对于使用 Hexo 的大多数人来说，相信对 Markdown 的语法不会陌生。熟练掌握 Markdown 语法对我们的写作拥有极大的帮助，这里用少用的表格和脚注来举个例子。至于为什么有些公式、流程图无法渲染，是因为 **Markdown 追求简洁式写作，默认渲染器不支持复杂渲染。**

#### 表格

站点|地址|介绍
--|:--:|--:
Fluid Docs|https://hexo.fluid-dev.com/docs/|Fluid 官方文档
Hexo-theme-fluid|https://github.com/fluid-dev/hexo-theme-fluid|Fluid Github Repo
Fluid Blog|https://hexo.fluid-dev.com/|Fluid 官方博客

```
站点|地址|介绍
--|:--:|--:
Fluid Docs|https://hexo.fluid-dev.com/docs/|Fluid 官方文档
Hexo-theme-fluid|https://github.com/fluid-dev/hexo-theme-fluid|Fluid Github Repo
Fluid Blog|https://hexo.fluid-dev.com/|Fluid 官方博客
```

#### 脚注

默认渲染器下正常显示，不同渲染器显示效果不同，写法如下：

```
脚注演示[^1]
[^1]: 脚注内容演示
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
优雅使用 Fluid 写文章
</p>

```
<p style="text-align:center;color:#8EC0E4;font-size:1.5em;font-weight: bold;">
综合演示
<br>
优雅使用 Fluid 写文章
</p>

```

#### iframe 页面镶套

iframe 页面镶套可以帮助我们更好的展示一个页面。比如以下演示页面。

<iframe src="https://hexo.fluid-dev.com/" width="100%" height="650" name="topFrame" scrolling="yes"  noresize="noresize" frameborder="0" id="topFrame"></iframe>


```
<iframe src="https://hexo.fluid-dev.com/" width="100%" height="500" name="topFrame" scrolling="yes"  noresize="noresize" frameborder="0" id="topFrame"></iframe>
```

一些参数说明，`width="100%"` 为宽度自适应，高度请根据实际需求跳转，**注意移动端页面是否匹配。** `scrolling` 为滚动条参数。`frameborder` 为边框参数。`noresize` 属性规定用户无法调整框架的大小。

#### details 标签

用于展示代码较多需要折叠或折叠相关内容，以下为演示。`summary` 填写显示名称。

<details>
<summary>Demo</summary>
```
<p><b>好友申请备注：fluid</b></p>
<p><b>提问之前请先仔细查阅用户文档</b></p>
<img width="200" src="https://cdn.jsdelivr.net/gh/fluid-dev/static@master/hexo-theme-fluid/wechat.png" alt="wechat">
```
</details>

```
<details>
<summary>Demo</summary>
<p><b>好友申请备注：fluid</b></p>
<p><b>提问之前请先仔细查阅用户文档</b></p>
<img width="200" src="https://cdn.jsdelivr.net/gh/fluid-dev/static@master/hexo-theme-fluid/wechat.png" alt="wechat">
</details>
```

### 善用 Tag 组件

Fluid 内置了许多 Tag 组件，包含便签、行内标签（已知不会出现间隔，谨慎使用）、勾选框、按钮和组图，可以使用这些组件来丰富文章内容，具体点击查看官方文档查看，**[点击跳转到 Fluid Doc](https://hexo.fluid-dev.com/docs/guide/#tag-%E6%8F%92%E4%BB%B6)**。

## 配图

众所周知，**博客好不好看，配图占一半**。这里给大家推荐几个我常用找配图的地方。**另外，请遵循相关网站的版权协议。**

### Wallpaper Hub
![Wallpaper Hub](https://cdn.jsdelivr.net/gh/vinceying/static@main/images/blog_fluid/2020-04-17_175244.png)

**[点击跳转到 Wallpaper Hub](https://wallpaperhub.app/)**

### Wallhaven
![Wallhaven](https://cdn.jsdelivr.net/gh/vinceying/static@main/images/blog_fluid/2020-04-17_174841.png)

**[点击跳转到 Wallhaven](https://wallhaven.cc/)**

### Unsplash
![Unsplash](https://cdn.jsdelivr.net/gh/vinceying/static@main/images/blog_fluid/2020-05-14_000557.png)

**[点击跳转到 Unsplash](https://unsplash.com/)**

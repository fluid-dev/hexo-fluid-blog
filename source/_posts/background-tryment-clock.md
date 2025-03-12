---
title: 仿 TrymenT 游戏风格的Hexo时钟组件
author: Tokisaki Galaxy
date: 2025-03-10 22:24:58
excerpt: 一个模仿游戏 TrymenT 中时钟界面的 Web 时钟实现，带有独特双环设计
tags:
- Hexo
- JavaScript
- 时钟
- 游戏风格
categories:
- 前端
- Web组件
keywords:
  - TrymenT
  - 时钟组件
  - 双环时钟
  - 特效
comments: true
---

{% note success %}
本文由 Fluid 用户授权转载，版权归原作者所有。

本文作者：Tokisaki_Galaxy
原文地址：<https://tokisaki.top/background-tryment-clock>
{% endnote %}


{% note warning %}
该项目特别针对Hexo-Fluid主题进行了优化，其他主题可能需要手动修改主题代码以获得最佳体验。
Hexo-Theme-Fluid项目地址：<https://github.com/fluid-dev/hexo-theme-fluid>
{% endnote %}

## 效果预览

[Github上的项目](https://github.com/Tokisaki-Galaxy/TrymenT-ClocK/)
[在Hexo的在线预览](https://tokisaki.top/)

时钟效果展现了游戏中那种略带神秘感的界面设计，转动的双环加上特殊符号标记，营造出一种独特的视觉体验。无论是作为博客装饰还是个人页面点缀，都能增添不少科幻氛围。

## 介绍

一个仿 `TrymenT ―今を変えたいと願うあなたへ―` 游戏中时钟界面设计的 Web 时钟实现。提供了一个特殊视觉风格的数字时钟。 很喜欢这个游戏，RASK公司什么时候出OmegaA啊？说好分割商法，也别烂尾啊！ 以最左边的指针为指示，指针不动，取而代之的是内外盘不停地动。内盘代表小时，外盘代表分钟。

## 特性
 - 独特的双环时钟设计
 - 特殊的字体和符号标记
 - 自定义日期显示格式
 - 响应式设计，自适应不同屏幕尺寸
 - 半透明背景图片效果

## 使用方法

### 需要的文件

 - [TrymenT-ClocK.min.css](https://cdn.jsdelivr.net/gh/Tokisaki-Galaxy/TrymenT-ClocK/TrymenT-ClocK.min.css)
 - [TrymenT-ClocK.min.js](https://cdn.jsdelivr.net/gh/Tokisaki-Galaxy/TrymenT-ClocK/TrymenT-ClocK.min.js)
 - [TrymenT-ClocK-PNG](https://cdn.jsdelivr.net/gh/Tokisaki-Galaxy/TrymenT-ClocK/img.png)

### 在Hexo中使用

#### （推荐！）Hexo注入

[Hexo注入器](https://hexo.fluid-dev.com/posts/hexo-injector/)是一项Hexo5之后提出的功能.
编写注入代码，需要在博客的根目录下创建 scripts 文件夹，然后在里面任意命名创建一个 js 文件即可。

例如创建一个 /blog/scripts/Tryment-Clock.js，内容为

```javascript
hexo.extend.injector.register('body_begin', '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Tokisaki-Galaxy/TrymenT-ClocK/TrymenT-ClocK.min.css"><script type="text/javascript" src="https://cdn.jsdelivr.net/gh/Tokisaki-Galaxy/TrymenT-ClocK/TrymenT-ClocK.min.js"></script>', 'default');
```

#### （比较麻烦）修改主题代码

把下面的代码放到主题的 `layout/layout.ejs` 文件中，然后把相应的文件复制到css，js，img文件夹里面。
```html
<% if (theme.background_trymentclock.enable) { %>
  <!--下面两行是核心内容-->
  <%- css_ex(theme.static_prefix.internal_css, 'TrymenT-ClocK.min.css') %>
  <%- js_ex(theme.static_prefix.internal_js, 'TrymenT-ClocK.min.js') %>
  <% } %>
```

```yml
# 背景的TrymenT时钟特效，如果需要切换背景图片请在主题目录下替换 /source/img/img.png
# See: https://github.com/Tokisaki-Galaxy/TrymenT-ClocK
background_trymentclock:
  enable: false
```

### 作为独立页面使用

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TrymenT ClocK</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Tokisaki-Galaxy/TrymenT-ClocK/TrymenT-ClocK.min.css">
    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/Tokisaki-Galaxy/TrymenT-ClocK/TrymenT-ClocK.min.js"></script>
</head>
</html>
```

## 注意事项

 - 时钟效果可能会占用一定的系统资源，在低配置设备上可能会有轻微卡顿
 - 背景图片默认为半透明效果，可能会与某些深色主题产生冲突
 - 在移动设备上浏览时，时钟会自动调整大小以适应屏幕
 - 如需更换背景图片，图片尺寸建议保持在1920×1080以上
 - 不建议在页面中添加多个时钟实例，可能会导致性能问题

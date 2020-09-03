---
title: 给博客文章嵌入 PPT 演示
author: pxxyyz
index_img: https://rmt.dogedoge.com/fetch/fluid/storage/hexo-nodeppt/cover.png?w=480&fmt=webp
categories: 功能增强
tags:
  - 用户经验
  - 花里胡哨
  - Hexo
date: 2020-06-09 12:30:00
excerpt: 在 Hexo 博客使用 NodePPT 插件实现演示功能
---

{% note success %}
本文由 Fluid 用户授权转载，版权归原作者所有。

本文作者：pxxyyz

原文地址：<https://pxxyyz.com/posts/44941/>
{% endnote %}

## 效果

<iframe src="https://pxxyyz.com/nodeppt/%E5%A4%9A%E5%A4%8D%E5%8F%98%E8%BF%91%E6%9C%9F%E8%BF%9B%E5%B1%95/demo.html" width="100%" height="600" name="topFrame" scrolling="yes" noresize="noresize" frameborder="0" id="topFrame"></iframe>

{% note light %}
**可以通过鼠标和键盘控制**

- 页面: ↑/↓/←/→ Space Home End（空格,home键,end键）
- 全屏: F
- Overview: -/+
- 演讲者笔记: N
- 网格背景: Enter
{% endnote %}

## nodeppt

首先可以看看官网给的[demo](https://nodeppt.js.org/)，非常的炫酷。

<iframe src="https://nodeppt.js.org/" width="100%" height="600" name="topFrame" scrolling="yes" noresize="noresize" frameborder="0" id="topFrame"></iframe>


### 安装nodeppt

```bash
$ npm install -g nodeppt
```

### 使用nodeppt

```bash
# new：使用线上模板创建一个新的 md 文件
# create a new slide with an official template
$ nodeppt new slide.md
# 使用模板
$ nodeppt new username/repo xxx.md

# create a new slide straight from a github template
$ nodeppt new slide.md -t username/repo

# serve：启动一个 md 文件的 webpack dev server
# start local sever show slide
$ nodeppt serve slide.md
# start local sever show slide with port
$ nodeppt serve slide.md -p port

# build：编译产出一个 md 文件
# to build a slide
$ nodeppt build slide.md
```

- 生成的网页可以使用键盘操作(类似PPT操作)

  - Page: ↑/↓/←/→ Space Home End
  - Fullscreen: F
  - Overview: -/+
  - Speaker Note: N
  - Grid Background: Enter
  - nodeppt 有演讲者模式，在页面 url 后面增加`?mode=speaker` 既可以打开演讲者模式，双屏同步

- 端口port的好处是可以照着官网的demo文件学习和修改，保证多个slide.md在浏览器查看时不会冲突，默认的链接是http://192.168.0.105:8080/。

- 官网的demo文件在[Github](https://github.com/ksky521/nodeppt/tree/master/site)其中的[index.md](https://github.com/ksky521/nodeppt/blob/master/site/index.md)。

- 产生pdf：直接在浏览器上`command+P/ctrl+P` 

- 产生html：

  - 之前版本通过`nodeppt generate ./ppts/demo.md -a`，见[Github nodePPT v1.2.0](https://github.com/zhangry868/nodePPT#html%E7%89%88)

  - 当前版本产生html利用**built**指令 ，例如`nodeppt build slide.md`，产生的html在默认文件夹`dist`中，包含CSS、IMG、JS三个文件夹和demo.html。

  - 在nodeppt仓库的Issue[^1]上找到一个小哥做的爬虫程序，亲测有效。会生成一个html文件，虽然文件会大一点。不过用[index.md](https://github.com/ksky521/nodeppt/blob/master/site/index.md)文件实验，发现(某些)图片响应时间过长导致失败，不过自己写的markdown基本无压力转html，给小哥点大大的赞👍而且小哥表示：

    > 之前试过直接用build，效果没问题，但build出来会有几个文件，如果通过手机或email分享出去直接播放的话稍显麻烦。


### nodeppt入门

- 配置与hexo的post文件头一样，用 yaml 语法设定基本配置

```yaml
title: nodeppt markdown 演示
speaker: 三水清
url: https://github.com/ksky521/nodeppt
js:
    - https://www.echartsjs.com/asset/theme/shine.js
prismTheme: solarizedlight
plugins:
    - echarts
    - mermaid
    - katex
```

- 正文使用`<slide>`对整个 markdown 文件进行拆分，拆成单页的幻灯片内容。
- 图片、样式、布局、icon、动画等设置可以看看仓库的文档和demo文件学习。
- 演讲者模式的批注通过来`:::`语法添加，然后再页面的链接添加`?mode=speaker`，按`N`开启演讲中模式。

```markdown
:::note
## Note here
:::
```

## 踩坑

### CSS样式导入失败

生成的html数学公式的格式全部错误，即使在nodeppt的配置部分引入katex的JS和CSS，导出的文档仍然会出错。

- 通过nodeppt build的html页面

打开生成的html文件可以看到[^2]

```html
<link rel="stylesheet" href="//cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.min.css" />
<link rel="stylesheet" href="//cdn.staticfile.org/prism/1.15.0/themes/prism.min.css" />
<link rel="stylesheet" href="//cdn.staticfile.org/KaTeX/0.10.0-rc.1/katex.min.css" />
<link rel="stylesheet" href="//cdn.staticfile.org/KaTeX/0.5.1/katex.min.css" />
```

只要把文件中所有`//`开头的都替换成`https://`，如

```html
<link rel=stylesheet href=https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.min.css>
<link rel=stylesheet href=https://cdn.staticfile.org/prism/1.15.0/themes/prism.min.css>
<link rel=stylesheet href=https://cdn.staticfile.org/KaTeX/0.10.0-rc.1/katex.min.css>
<link rel=stylesheet href=https://cdn.staticfile.org/KaTeX/0.5.1/katex.min.css>
```

这样控制台就不会报错了，数学公式和fa-icon能正常显示了。

- 通过py程序爬的html页面

配合KaTeX官网的[使用文档](https://katex.org/docs/browser.html#starter-template)，在生成的html文件`<head>`引用katex的JS和CSS。

```html
<!DOCTYPE html>
<!-- KaTeX requires the use of the HTML5 doctype. Without it, KaTeX may not render properly -->
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css" integrity="sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq" crossorigin="anonymous">

    <!-- The loading of KaTeX is deferred to speed up page rendering -->
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js" integrity="sha384-y23I5Q6l+B6vatafAwxRu/0oK/79VlbSz7Q9aiSZUvyWYIYsd+qj+o24G5ZU2zJz" crossorigin="anonymous"></script>

    <!-- To automatically render math in text elements, include the auto-render extension: -->
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js" integrity="sha384-kWPLUVMOks5AQFrykwIup5lo0m3iMkkHrD0uJ4H5cjeGihAutqP0yW0J6dpFiVkI" crossorigin="anonymous"
        onload="renderMathInElement(document.body);"></script>
  </head>
  ...
</html>
```

添加后公式都能正确显示了。

### 在博客添加nodeppt

- 通过py程序爬的html页面

在Hexo博客里想调用或者链接nodeppt生成的html，需要hexo设置`skip_render`, 指定不进行渲染的文件或文件夹，例如在`source`目录下新建`nodeppt`来存放nodeppt生成的html，则需要在根目录下的`_config.yml`文件添加

```yaml
skip_render: 
  - nodeppt/*.html
```

- 通过nodeppt build的html页面

```yaml
skip_render: 
  - nodeppt/**
```

文件匹配是基于正则匹配的，如果需要忽略全部文件(`/*`)、指定类型type文件(`/*.type`)、全部文件以及子目录(`/**`)以及多个文件需要用(`- file/**`)。

对应的文件访问格式是`../../nodeppt/file.html`或`../../nodeppt/file/demo.html`，本页演示的加载是通过`iframe`实现的。

```html
<iframe src="../../nodeppt/file.html" width="100%" height="500" name="topFrame" scrolling="yes" noresize="noresize" frameborder="0" id="topFrame"></iframe>
```

注意：如果这一步不执行的话，debug会发现nodeppt生成的html会被hexo处理，产生错误

```bash
FATAL Something's wrong. Maybe you can find the solution here: https://hexo.io/docs/troubleshooting.html
Nunjucks Error:  [Line 9418, Column 3465] expected variable end
```

至于使用cdn来使用html似乎不行，出来的是html的源码，而不是网页。如果使用cdn的方式能成功就不用这么麻烦的`skip_render`。

有一种简单的方法就是用github或者coding等部署nodeppt的html，再iframe的src填对应的网址。如果hexo的`skip_render`设置正确，也可通过网址主页下的nodeppt下找到。

- <https://pxxyyz.com/nodeppt/%E5%A4%9A%E5%A4%8D%E5%8F%98%E8%BF%91%E6%9C%9F%E8%BF%9B%E5%B1%95/demo.html>
- <http://uwrfy5.coding-pages.com/>


## 参考

[^1]: [分享个脚本，导出单个离线HTML文件，不是用build #289](https://github.com/ksky521/nodeppt/issues/289#issue-613221513)

[^2]: [当在浏览器里直接打开index.html时，打开速度会非常慢 #286](https://github.com/ksky521/nodeppt/issues/286#issue-575436572)

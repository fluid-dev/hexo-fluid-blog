---
title: Hexo 暗黑模式
date: 2020-04-23 18:04:57
index_img: https://rmt.dogedoge.com/fetch/royce/storage/darkmode/cover.png?w=480&fmt=webp
category: 功能增强
tags:
  - 用户经验
  - 花里胡哨
  - Hexo
excerpt: 大概花了一个晚上给 Fluid 搞了暗黑模式，之后陆续优化了下，目前博客已经基本上适配完成了，目前有三种方案。
---

{% note success %}
本文由 Fluid 用户授权转载，版权归原作者所有。

本文作者：Royce
原文地址：https://royce2003.top/posts/41212.html
{% endnote %}

大概花了一个晚上搞暗黑模式，之后陆续优化了下
目前博客已经基本上适配完成了
目前是三种方案（优先级递减）
1. 媒体查询
2. 定时开启
3. localStorage/sessionStorage 查询

`媒体查询`，判断系统是否处于暗黑模式，支持大部分系统
Win10 需要浏览器开启软件深色模式
Android 同理，需要浏览器支持手机开启夜间模式的时候将自身切换到神色模式，目前 Chrome 支持，Edge 不支持，其他没测
iOS、MacOS 上的 Safari 也支持

`定时开启`，在规定时间自动开启，如果在该时间段内取消了暗黑模式，能一直保持

`localStorage/sessionStorage 查询`，能一直保持某一个模式的依赖

### HTML

在 `\themes\fluid\layout\layout.ejs` 中找到 `<body>`，在其之后加入如下代码

```html
<div id="dark" onclick="switchDarkMode()"></div>
<script>
  var isNight = new Date().getHours() >= 22 || new Date().getHours() < 7; // 指定时间
  // 依次判断 系统暗黑模式 指定时间 缓存 dark
  if( matchMedia('(prefers-color-scheme: dark)').matches || isNight || localStorage.getItem('dark') === '1') {
    if(!(isNight&&localStorage.getItem('noDark') === '1')) {
      document.body.classList.add('dark');
    }
  }
  document.getElementById('dark').innerHTML = document.querySelector("body").classList.contains("dark")?"🌙":"🌞";
</script>
```

{% note danger %}
注意！一定紧跟在 `body` 标签之后，否则会出现闪烁
{% endnote %}

### JS

在自定义 JS 中把下面代码加进去，直接加到 `</body>` 之前也行

```js
//点击事件
function switchDarkMode() {
	if ($('body').hasClass('dark')) {
		$("#dark").html("🌞");
		document.body.classList.remove('dark');
		localStorage.setItem('noDark', '1');
		localStorage.setItem('dark', '0');
	} else {
		$("#dark").html("🌙"); 
		document.body.classList.add('dark');
		localStorage.setItem('dark', '1');
		localStorage.setItem('noDark', '0');
	}
}
```

### CSS

在自定义 CSS 中加入代码

{% note primary %}
可以用 `stylus`，能少些写
但是引入时记得后缀还是 `.css` 不要变
{% endnote %}

下面是我的样式代码，基本覆盖所有内容
有配上些注释，根据自身情况修改，注意缩进

```stylus
/* 切换按钮 */
#dark
  cursor pointer
  position fixed
  right 40px
  bottom 98px
  width 16px
  height 14px
  z-index 100
  font-size 20px

/*暗黑模式*/
.dark

  /* 主体 */
  #board 
    background-color #282c34
    color #a09c9c
  
  img  
    filter brightness(50%) // 图片亮度

  p
  .index-info a  
    color #a09c9c !important

  .markdown-body
    h1,h2,h3,h4,h5,h6,s,li  
      color:#a09c9c !important
    

  /* 顶栏 */
  .navbar-col-show
  .top-nav-collapse  
    background-color #282c34
    
  .navbar a  
    color #a09c9c !important
    
  .animated-icon span   /* 手机端 */
    background-color #a09c9c


  /* page-number */
  .pagination a:hover
  .pagination .current  
    background-color #6b6b6b73;


  /* 打字机 */
  #subtitle
  .dark.typed-cursor--blink
  .scroll-down-arrow
    color #dfdfdf


  /* back to top */
  #scroll-top-button
    background-color #282c34

    i
      color #a09c9c
    

  /* Toc */
  .tocbot-list a
    color #a09c9c

  .tocbot-active-link
  footer a:hover
    color #1abc9c !important


  /* footer */
  footer
  footer a
    color #a09c9c
    

  /* 归档页 */
  .list-group-item
    color #a09c9c
    background-color #282c34
    
  .list-group-item:hover
  .tagcloud a:hover
    background-color #46484d


  /* 友链页 */
  .links
    .card  
      background-color #282c34
        
    .card-body:hover  
      background-color #46484d
        
    .link-title
    .link-intro  
      color #a09c9c
    

  /* note标签 配色有点丑 */
  .note-info
    background-color #3b5359
    border-color #006d80

  .note-danger
    background-color #783f42
    border-color #670009

  .note-success
    background-color #2a3e2e
    border-color #005915

  .note-warning
    background-color #5b543e
    border-color #846500

  .note-primary
    background-color #455a6f
    border-color #004188
```

### localStorage

仔细观察刚刚的 js 代码，在其中用到了 localStorage
相当于一个标记，除非被手动清除，否则将会永久保存。

下面是支持该特性的最低版本

![](https://rmt.dogedoge.com/fetch/royce/storage/darkmode/01.png?w=1280&fmt=webp)

可以在浏览器控制台中查看他们的值

![](https://rmt.dogedoge.com/fetch/royce/storage/darkmode/02.png?w=1280&fmt=webp)

---

参考 [https://crosschannel.cc/daily/hexo添加暗色模式.html](https://crosschannel.cc/daily/hexo%E6%B7%BB%E5%8A%A0%E6%9A%97%E8%89%B2%E6%A8%A1%E5%BC%8F.html)

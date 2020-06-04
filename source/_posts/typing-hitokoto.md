---
title: Typing+hitokoto
index_img: img
categories: 实用技巧
tags:
  - 用户经验
  - 花里胡哨
  - Slogen
  - Hitokoto
date: 2020-06-03 23:30:00
excerpt: Fluid主题首页Slogen上显示一言(hitokoto)。
---

{% note success %}
本文由 Fluid 用户授权转载，版权归原作者所有。

本文作者：pxxyyz

原文地址：https://pxxyyz.com/posts/30454/
{% endnote %}

群里有个小哥想在首页slogen上显示一言，在Github上搜了搜，还真有Fluid主题的改造，我按照思路写下改造的步骤。

## typed.ejs

修改`layout\_partial\plugins`目录下的`typed.ejs`

```ejs
<% if(theme.fun_features.typing.enable && page.subtitle !== false){ %>
  <%- js_ex(theme.static_prefix.typed, "/typed.min.js") %>
  <script>
    function typing(id, title){
        var typed = new Typed('#' + id, {
            strings: [
              '  ',
              title + "&nbsp;",
            ],
            cursorChar: "<%- theme.fun_features.typing.cursorChar %>",
            typeSpeed: <%- theme.fun_features.typing.typeSpeed %>,
            loop: <%- theme.fun_features.typing.loop %>,
        });
        typed.stop();
        $(document).ready(function () {
            $(".typed-cursor").addClass("h2");
            typed.start();
        });
    }
    <% if(is_post()) { %>
        typing("subtitle", "<%- data.subtitle %>")
    <% } else if(theme.index.hitokoto.enable){ %>
        fetch('https://v1.hitokoto.cn')
        .then(response => response.json())
        .then(data => {
           typing("hitokoto", data.hitokoto)
        })
        .catch(console.error)
    <% } else { %>
        typing("subtitle", "<%- data.subtitle %>")
    <% } %>
  </script>
<% } %>
```

- 将原来的功能放在typing函数里面，再判断打字机显示subtitle还是hitokoto
  - 所有的post都显示subtitle，即markdown的title，page的title是网站的标题
  - 除了post以外，判断`theme.index.hitokoto.enable`
    - 设置显示一言，则通过fetch调用hitokoto的API，这个部分官方说明[^1]和DIY教程[^2]都说的很详细了
    - 如果设置不显示一言，则显示subtitle
  - hitokoto比subtitle优先级高，这会导致归档、分类、标签等页面的打字机显示hitokoto
  - 如果只需要在首页显示hitokoto，但在非post的页面显示原subtitle，这需要判断页面的属性，据我观察，所有的非post的页面布局(layout)都会设置`page.layout=”XXX“`，但是index和page没有设置，因此，可以通过`!page.layout`判断来判断是否为首页，当然，post页面设定显示subtitle，就不在考虑范围内，这样只需将上面的`else if`条件修改如下

```ejs
<% } else if(theme.index.hitokoto.enable && !page.layout) { %>
```

## layout.ejs

修改`layout`目录下的` layout.ejs`，在`<span class="h2" id="subtitle">`和`<% if(is_post()) { %>`之间插入如下代码

```ejs
<span class="h2" id="subtitle">
    <% if(theme.fun_features.typing.enable == false) { %>
    <%- subtitle %>
    <% } %>
</span>

<% if(!is_post()) { %>
<br>
<span class="h2" id="hitokoto">
    <% if(theme.fun_features.typing.enable == false) { %>
    <%- hitokoto %>
    <% } %>
</span>
<% } %>

<% if(is_post()) { %>
<%- partial('_partial/post-meta') %>
<% } %>
</div>
```
这个部分设置显示hitokoto的样式和位置，不设置这个会报关于`typing("hitokoto", data.hitokoto)`的错误

```
TypeError: Cannot read property 'tagName' of null
```

## fluid_config.yml

在`source\_data`目录下修改**主题配置**文件`fluid_config.yml`，在`index`下设置hitokoto的开关

```yaml
#---------------------------
# 首页
# Index Page
#---------------------------
index:
# 添加hitokoto
  slogan:  # 首页副标题的独立设置
    enable: true  # 为 false 则不显示任何内容
    text: 'More haste, less speed.'  # 为空则按 hexo config.subtitle 显示
  hitokoto:  # 非post页面显示一言
    enable: true  # slogan 和 hitokoto 不能同时启用，优先显示hitokoto
```

- 当`theme.index.hitokoto.enable == true`时，slogan里的text不在显示，因此只有关闭hitokoto才能在首页显示slogan的text或页面的subtitle

## 出处

1. 如果想加入出处，可在打印`data.hitokoto`后加入`data.from`，以及相应的格式

```ejs
typing("hitokoto", '『' + data.hitokoto + '』' + '<br /> <h5>'+ '——' + '「' + data.from + '」' + '</h5>')
```

2. 另一种显示出处的方法是另起一行打印`data.from`，

```
fetch('https://v1.hitokoto.cn')
.then(response => response.json())
.then(data => {
    typing("hitokoto", data.hitokoto)
    typing("hitofrom ", data.from)
})
.catch(console.error)
```

- 并在`layout.ejs`添加`<%- hitofrom %>`

```ejs
<% if(!is_post()) { %>
<br>
<span class="h2" id="hitokoto">
    <% if(theme.fun_features.typing.enable == false) { %>
    <%- hitokoto %>
    <% } %>
</span>
<br>
<span class="h2" id="hitofrom">
    <% if(theme.fun_features.typing.enable == false) { %>
    <%- hitofrom %>
    <% } %>
</span>
<% } %>
```

- 第一种是打印一段话，从头到尾只有一个cursorChar，但样式不太好改
- 第二种是打印两段话，会出现视觉混乱(个人觉得)，样式方便调整

## 总结

当然这个还可以继续改下去，例如添加出处(hitofrom)、设置循环(loop)、修改样式等。

最后也是最重要的，感谢tanxinzheng[^3] (虽然不认识，但是新知识get！😁)。

## 参考

[^1]: [一言开发者中心](https://developer.hitokoto.cn/)
[^2]: [为您的Hexo博客添加Hitokoto一言功能](https://blog.bill.moe/add-hitokoto/)
[^3]: [Code World](http://tanxinzheng.github.io/)


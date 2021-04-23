{% note success %}
本文由 Fluid 用户授权转载，版权归原作者所有。

本文作者：千泷
原文地址：https://www.myql.xyz/post/8f487fbb/
{% endnote %}

# Netlify cms

## ✨前言

我们都知道，`hexo`是一个静态部署博客的框架，优点在于速度快，成本低（无需服务器），缺点在于繁琐，你每次更新文章都需要去改代码，再部署推送，修改配置也是如此，你不能像`WordPress`一样直接在后台修改配置并使它生效。

不过有很多教程可以让你无需繁琐的部署，只管推送代码，通过`GitHub Actions`，`travis-ci`，[vercel](https://vercel.com/)，[Netlify](Netlifyhttps://www.netlify.com/)等都可以便捷的进行博客的部署，只管写代码然后推送就好，类似的教程有非常多，在此就不再重复介绍。那么，我们是否可以在此基础上，更加便捷的进行静态博客的写作和管理？答案是可以的。

我们可以通过将博客部署到[Netlify](https://www.netlify.com/)，并使用[Netlify cms](https://www.netlifycms.org/)来做到这一点。

首先，我们来了解一下配置完之后可以做到哪些事情？

- 在线新建，编辑，预览，删除博客文章
- 支持文章草稿，工作流
- 支持对博客图片的管理
- 支持在线修改博客配置，例如对首页顶部图的修改，友链的修改

---

### 🎈图片预览

配置完的界面

![image-20210420211303684](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210420211303684.png)

在线对文章进行编辑，修改

![image-20210418222435713](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210418222435713.png)

![image-20210418222455291](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210418222455291.png)

工作流

![image-20210420212403763](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210420212403763.png)

对媒体资源的管理

![image-20210420212801157](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210420212801157.png)

对其他页面的修改

![image-20210420213123997](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210420213123997.png)

![image-20210420213142628](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210420213142628.png)

在线修改博客首页、文章页、归档页等页面的顶部图

![image-20210420214308165](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210420214308165.png)

在线添加、编辑友链页面

![image-20210418223337304](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210418223337304.png)

![image-20210418223354013](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210418223354013.png)

## 📃简单说明

下面我将会以[hexo](https://hexo.io/zh-cn/)+[fluid主题](https://github.com/fluid-dev/hexo-theme-fluid)做演示，并配置[fluid主题](https://github.com/fluid-dev/hexo-theme-fluid)的友链功能，达到在线编辑预览友链的目的，但此方法不仅仅只适用于[fluid主题](https://github.com/fluid-dev/hexo-theme-fluid)的友链功能，其他各类主题也可以通过此方法达到在线修改配置的目的，只要你配置完成，几乎可以修改所有配置项。包括但不限于以下类型的文件`yml`、`yaml`、`toml`、`json`、`md`、`markdown`、`html`具体请查看👉[Netlify cms](https://www.netlifycms.org/)文档。

## 🔧具体配置

[Netlify cms](https://www.netlifycms.org/)使用的前提条件是你必须将博客部署到[Netlify](https://www.netlify.com/)上。因为网上有很多部署教程，这里不再重复。

具体可以查看：

- [博客通过 Netlify 实现持续集成](https://guanqr.com/tech/website/deploy-blog-to-netlify/)
- [将 Hexo 静态博客部署到 Netlify](https://io-oi.me/tech/deploy-static-site-to-netlify/)

### 👟准备工作

在部署完成后，你需要开启`Identity`

![image-20210418225044656](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210418225044656.png)

进入设置中

![image-20210418225125358](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210418225125358.png)

将`Registration preferences`修改为`Invite only`此项为是否开启注册，默认是开启注册。修改为`Invite only`后表示仅受邀请的用户可以注册，当然此项你可以在自己注册完毕之后再行修改。

![image-20210418225239607](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210418225239607.png)

下滑找到`Git Gateway`并开启。

![image-20210418225726557](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210418225726557.png)

至此准备工作完成

### 🎨修改博客配置

在博客`source`文件夹中，创建`admin`文件夹，并新建两个文件`index.html`和`config.yml` 

![image-20210418230338242](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210418230338242.png)

在`index.html`中添加以下内容

```html
<!doctype html>
<html>
    
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="x-UA-Compatible" content="IE=Edge">
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <link rel="icon" type="Natsume.ico" href="/admin/image/Natsume.ico" />
        <script src="https://cdn.jsdelivr.net/npm/netlify-identity-widget@1/build/netlify-identity-widget.min.js"></script>
        <title>魔王の领地</title>
    </head>
    
    <body>
        <script defer="true" src="https://cdn.jsdelivr.net/npm/netlify-cms@2/dist/netlify-cms.js"></script>
    </body>

</html>
```

在`config.yml` 中添加

```yaml
backend:
  name: git-gateway # https://github.com/netlify/netlify-cms
  branch: main # 要更新的分支(可选；默认为主分支)

# This line should *not* be indented
publish_mode: editorial_workflow

# This line should *not* be indented
media_folder: "source/images/uploads" # 媒体文件将存储在图片/上载下的Repo中。
public_folder: "/images/uploads" # 上传的媒体的src属性将以/images/uploads开头。

site_url: https://www.myql.xyz # 网站网址
display_url: https://www.myql.xyz # 显示网址

locale: "zh_Hans" # 语言环境 https://github.com/netlify/netlify-cms/tree/master/packages/netlify-cms-locales/src

collections:      # https://www.netlifycms.org/docs/configuration-options/#collections
  - name: "posts" # 在路由中使用，例如：/admin/collections/blog。
    label: "Post" # 在用户界面中使用
    folder: "source/_posts" # 存储文件的文件夹的路径。
    create: true # 允许用户在这个集合中创建新的文件。
    fields: # 每份文件的字段，通常是前面的内容。
      - {label: "顶部图", name: "banner_img", widget: "image", required: false} 
      - {label: "文章封面", name: "index_img", widget: "image", required: false} 
      - {label: "文章排序", name: "sticky", widget: "number", required: false}
      - {label: "标题", name: "title", widget: "string"}
      - {label: "发布日期", name: "date", widget: "datetime", format: "YYYY-MM-DD HH:mm:ss", dateFormat: "YYYY-MM-DD", timeFormat: "HH:mm:ss", required: false}
      - {label: "更新日期", name: "updated", widget: "datetime", format: "YYYY-MM-DD HH:mm:ss", dateFormat: "YYYY-MM-DD", timeFormat: "HH:mm:ss", required: false}
      - {label: "标签", name: "tags", widget: "list", required: false}
      - {label: "分类", name: "categories", widget: "list", required: false}
      - {label: "关键词", name: "keywords", widget: "list", required: false}
      - {label: "摘要", name: "excerpt", widget: "list", required: false}
      - {label: "内容", name: "body", widget: "markdown", required: false}
      - {label: "永久链接", name: "permalink", widget: "string", required: false}
      - {label: "评论", name: "comments", widget: "boolean", default: true, required: false}

  - name: "pages"
    label: "Pages"
    files:
      - file: "source/about/index.md"
        name: "about"
        label: "关于"
        fields:
          - {label: "标题", name: "title", widget: "string"}
          - {label: "内容", name: "body", widget: "markdown", required: false}
          - {label: "评论", name: "comments", widget: "boolean", default: true, required: false}

# 如果你不是fluid主题，请删除以下配置，或者对文件路径及字段进行修改
  - name: "settings"
    label: "settings"
    files:      
      - file: "source/_data/fluid_config.yml"
        name: "fluid"
        label: "fluid主题配置"
        editor:
          preview: true      # 是否开启编辑预览
        fields:
          - label: "首页"
            name: "index"
            widget: "object"
            collapsed: true   # 是否折叠显示
            fields:
              - label: "顶部图"
                name: "banner_img"
                widget: "image"
              - label: "高度"
                name: "banner_img_height"
                widget: "number"
          - label: "文章页"
            name: "post"
            widget: "object"
            collapsed: true
            fields:
              - label: "顶部图(默认)"
                name: "banner_img"
                widget: "image"
              - label: "高度"
                name: "banner_img_height"
                widget: "number" 
              - label: "文章封面图(默认)"
                name: "default_index_img"
                widget: "image"
          - label: "归档页"
            name: "archive"
            widget: "object"
            collapsed: true
            fields:
              - label: "顶部图"
                name: "banner_img"
                widget: "image"
              - label: "高度"
                name: "banner_img_height"
                widget: "number"
          - label: "分类页"
            name: "category"
            widget: "object"
            collapsed: true
            fields:
              - label: "顶部图"
                name: "banner_img"
                widget: "image"
              - label: "高度"
                name: "banner_img_height"
                widget: "number"
          - label: "标签页"
            name: "tag"
            widget: "object"
            collapsed: true
            fields:
              - label: "顶部图"
                name: "banner_img"
                widget: "image"
              - label: "高度"
                name: "banner_img_height"
                widget: "number"
          - label: "关于页"
            name: "about"
            widget: "object"
            collapsed: true
            fields:
              - label: "顶部图"
                name: "banner_img"
                widget: "image"
              - label: "高度"
                name: "banner_img_height"
                widget: "number"
          - label: "友链页面"
            name: "links"
            widget: "object"
            collapsed: true
            fields:
              - label: "顶部图"
                name: "banner_img"
                widget: "image"
              - label: "高度"
                name: "banner_img_height"
                widget: "number"
              - label: "项目"
                name: "items"
                widget: "list"
                fields:
                  - {label: "网站名称", name: "title", widget: "string", required: false}
                  - {label: "网址描述", name: "intro", widget: "string", required: false}
                  - {label: "网站地址", name: "link", widget: "string", required: false}
                  - {label: "网站图片", name: "avatar", widget: "image", required: false}
```

请注意，这里我对[fluid主题](https://github.com/fluid-dev/hexo-theme-fluid)进行了配置，例如`banner_img`、`index_img`等项目，不能正常使用请删除，如果你不是[fluid主题](https://github.com/fluid-dev/hexo-theme-fluid)请根据实际情况对`source\admin\config.yml`配置进行修改，如果你和我一样是`fluid`主题，还需要将主题配置文件（`/_config.fluid.yml`）中的相对应的字段及其内容一并注释掉才能使其生效，类似于这样

![image-20210420221125705](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210420221125705.png)

![image-20210419015951835](https://gitee.com/leicancun/cdn/raw/master/Netlify-cms/image-20210419015951835.png)

并且创建`source\_data\fluid_config.yml`，将相关配置复制粘贴到里面（请根据此配置去主题配置文件中注释掉相对应的字段）

```yaml
index:
  banner_img: https://cdn.jsdelivr.net/gh/leicancun/JSCDN@master/images/background.webp
  banner_img_height: 100
post:
  banner_img: https://cdn.jsdelivr.net/gh/leicancun/JSCDN@master/images/mmexport1602581319886.webp
  banner_img_height: 70
  default_index_img: https://cdn.jsdelivr.net/gh/leicancun/JSCDN@main/images/wallhaven-g8wvm7.webp
archive:
  banner_img: https://cdn.jsdelivr.net/gh/leicancun/JSCDN@main/images/1616421595370-wallhaven-q6ov7d.jpg
  banner_img_height: 80
category:
  banner_img: https://cdn.jsdelivr.net/gh/leicancun/JSCDN@main/images/1616421818281-wallhaven-zm93dj.jpg
  banner_img_height: 80
tag:
  banner_img: https://cdn.jsdelivr.net/gh/leicancun/JSCDN@main/images/1616421669417-wallhaven-1kkm2g.jpg
  banner_img_height: 80
about:
  banner_img: https://cdn.jsdelivr.net/gh/leicancun/JSCDN@main/images/wallhaven-pkkr2.webp
  banner_img_height: 80
links:
  banner_img: https://cdn.jsdelivr.net/gh/leicancun/JSCDN@main/images/1616421416500-wallhaven-rddv31.jpg
  banner_img_height: 80
  items:
    - title: 小丁的个人博客
      intro: 世间所有的相遇，都是久别重逢
      link: https://tding.top
      avatar: https://tding.top/images/avatar.webp
    - title: 米奇妙妙屋
      intro: 逐风揽月登九天 踏浪擒龙游四海
      link: https://ifibe.com/
      avatar: https://cdn.jsdelivr.net/gh/useblue/ucdn/imgs/avatar.webp
    - title: 荷戟独彷徨
      intro: 爱光学，爱生活，爱创造
      link: https://guanqr.com/
      avatar: https://cdn.jsdelivr.net/gh/guanqr/blog/static/icons/android-chrome-512x512.png
    - title: iMaeGoo’s Blog
      intro: 虹墨空间站
      link: https://www.imaegoo.com
      avatar: https://www.imaegoo.com/images/avatar.jpg
    - title: 琉仙の后花园
      intro: 一起来种花家呀
      link: https://blog.lx101.cn/
      avatar: https://z3.ax1x.com/2021/03/28/cS2LNV.jpg
    - title: LOGI
      intro: 会点代码的强迫症
      link: https://logi.im
      avatar: https://code.bdstatic.com/npm/logicdn@1.0.0/logi.im/usr/images/global/logo.webp
```

请保持这样的格式，当然如果你对`yml`语法非常了解也可以自行修改🤣

```yaml
links:
  items:
    - title: 			# 博客名称
      intro: 			# 博客描述
      link: 			# 博客链接
      avatar: 			# 博客logo
```

### 🤣完成

说一下为什么不推荐直接修改根目录下的`_config.fluid.yml`因为通过[Netlify cms](https://www.netlifycms.org/)在线修改配置文件后，仅会保留你已经在`source\admin\config.yml`中配置的选项，没有配置的选项会默认清空，按主题默认配置进行，你当然可以将所有选项进行配置，但是没必要，所以推荐通过`source\_data\fluid_config.yml`仅复制粘贴需要的选项进行修改配置。



---

至此[Netlify cms](https://www.netlifycms.org/)配置就算完成了，只要推送代码，等待片刻，通过你部署在[Netlify](https://www.netlify.com/)上的域名，加`/admin/`即可访问你的博客后台。



## 😕改进计划

因为对css不太熟悉，并没有设置页面自适应，导致现在编辑页面的预览体验很差，在手机上显示也不甚理想，等我多熟悉熟悉css然后弄一下自适应。



## 😁感谢

十分感谢[zkqiang](https://github.com/zkqiang)大佬对我的耐心帮助🎉🎉🎉



---
title: Vercel 部署高级用法教程
author: 夜法之书
date: 2022-10-10 18:55:57
index_img: https://fluid.s3.bitiful.net/hexo-vercel/cover.png
category: 实用技巧
tags:
  - 用户经验
  - 花里胡哨
  - Hexo
excerpt: Vercel 使用有不少需要仔细配置的地方，可惜的是，自定义 Vercel 缓存时间，Vercel 重定向等使用方法略复杂，不是开箱即用，有一定使用门槛，故这里单独列一篇文章详细说明Vercel的一些高级使用方法。
---

{% note success %}
本文由 Fluid 用户授权转载，版权归原作者所有。

本文作者：[夜法之书](https://blog.17lia.site)
原文地址：<https://blog.17lai.site/posts/e922fac8/>
{% endnote %}

> Vercel使用有不少需要仔细配置的地方，可惜的是，自定义Vercel缓存时间，Vercel重定向等使用方法略复杂，不是开箱即用，有一定使用门槛，故这里单独列一篇文章详细说明Vercel的一些高级使用方法！

<!-- more -->

## 为什么使用 vercel

- 国内 `Github Pages` 速度较慢。
- `vercel` 速度快且能够自定义域名，能实现和 `Github Pages` 一样的效果

> vercel 官方地址：[vercel.com/](https://vercel.com/)

## 开始使用

- 首先注册一个账号 <https://vercel.com/>
- 注册成功后进入页面，点击 `News Project`

![img](https://fluid.s3.bitiful.net/hexo-vercel/20220904114329.png)

- 然后通过绑定的 `github` 或者 `gitlab` 导入需要部署的项目

![img](https://fluid.s3.bitiful.net/hexo-vercel/20220904114329-1.png)

- 如果导入的项目是打包好的静态页，`FRAMEWORK PRESET` 选择 `Other` 。

![img](https://fluid.s3.bitiful.net/hexo-vercel/20220904114329-2.png)

- 点击 `deployed` 进行部署，如果部署失败可以查看报错信息是不是上一步的某些选项没有覆盖。部署成功后会进入如图所示的界面


![img](https://fluid.s3.bitiful.net/hexo-vercel/re_214145.png)

## 如何自定义域名

- 腾讯云域名地址：[console.cloud.tencent.com/domain](https://console.cloud.tencent.com/domain)
- `vercel` 静态页挂载地址：
- 进入到 setting 中可对项目进行一些设置，如项目名称

![vercel 自定义域名](https://fluid.s3.bitiful.net/hexo-vercel/20220904114329-4.png)

- 下面演示如何自定义域名，默认情况下部署成功后 `vercel` 会给你生成一个默认的域名，如果想要修改成自己的域名可将域名名称修改成自己的。
- 当选择修改成自己的域名名称后，`vercel` 会检查域名指向的 `DNS` 对不对，如果不对的话会提示你域名的 DNS 应该如何配置，按照 `vercel` 提示的 `DNS` 信息

在自己的域名的 `DNS` 配置中进行配置，如图

![img](https://fluid.s3.bitiful.net/hexo-vercel/20220904114329-5.png)

## 配置多个域名

对其他新增的域名选择重定向到自己的主域名即可

![vercel 多域名配置](https://fluid.s3.bitiful.net/hexo-vercel/20220904114329-6.png)

## 自定义Vercel服务器位置

> Vercel线路已经很快了，但是可以通过选择Vercel部署服务器位置，更进一步加快中国大陆，亚洲区域的访问速度！

![Vercel服务器选择](https://fluid.s3.bitiful.net/hexo-vercel/20220904120615.png)

香港服务器虽然没有严格测试，但是中国大陆速度应该是最快的！

## 自定义Header缓存时间

> [vercel.com/docs](https://vercel.com/docs/project-configuration#project-configuration/headers)
>
> **使用Vercel必备配置，本地缓存加速访问！**

`vercel.json`

```json
{
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, s-maxage=86400, max-age=86400"
        }
      ]
    }
  ]
}
```

## Vercel自定义404

> [learn how to customize the 404 page](https://vercel.com/guides/custom-404-page).

## Vercel流量超标怎么办？

> 最近查看了一下Vercel流量使用情况，发现RSS订阅流量太大了，占了30GB流量！
>
> 免费Vercel账户每月只有100G免费流量，怎么办？

有两种解决方法：

1. 使用 DNS 多线路分流，例如[DNSPOD 多线路负载均衡](https://blog.17lai.site/posts/5311b619/#DNSPOD-%E5%A4%9A%E7%BA%BF%E8%B7%AF%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1)
2. 使用 Vercel 提供的 [redirects](https://vercel.com/docs/project-configuration#project-configuration/redirects) 或者 [rewrites](https://vercel.com/docs/project-configuration#project-configuration/rewrites)功能，把rss访问重定向到其它部署方式，例如Cloudflare

![Vercel 流量](https://fluid.s3.bitiful.net/hexo-vercel/20220927103610.png)

查看方法：[dashboard](https://vercel.com/dashboard) -> [usage](https://vercel.com/dashboard/usage)

由于个人blog也部署到Cloudflare上面了，<https://cfblog.17lai.site>，Cloudflare的流量目前看着没限制，如是，可以使用如下重定向方法

```json
"redirects": [
		{ "source": "/atom.xml", "destination": "https://cfblog.17lai.site/atom.xml" },
		{ "source": "/rss.xml", "destination": "https://cfblog.17lai.site/rss.xml" }
  	]
```

详细 Cloudflare 部署方法，戳 [cloudflare Pages 部署](https://blog.17lai.site/posts/5311b619/#cloudflare-Pages-%E9%83%A8%E7%BD%B2)

## 乒乓部署

> 也可以叫旋转门部署。
>
> 解决调试博客插件，修改半成品文章时部署到云端会影响正在查阅博客的用户的问题！
>
> 使用Docker版本本地预览是很不错，但是 jsdelivr 版本发布需要在 Github 生成新 release 这时本地就不行了。乒乓部署可以解决这个问题！

具体方法就是同时部署到两个地方A和B，博客域名在两个服务器之间切换。这里以 Vercel 为例

### 准备工作：

- 创建2个Github仓库，对应服务器A和B的部署
- 建立两个服务器A和B，分别关联两个 Github 仓库
- 把调试完毕的代码上传到两个仓库
- 这时通过服务器A和B都是可以正常浏览的

### 要调试的时候：

- 发布到A之前，把博客域名转移到服务器B
- 在服务A做一些调试，在线 debug 工作
- 特别是在线 [pageseed](https://pagespeed.web.dev/) 测试调优，这种事必备方法。简单不需要新的 jsdelivr 版本调试本地 [docker-hexo](https://github.com/appotry/docker-hexo) 调试即可！

![输入想转移的域名](https://fluid.s3.bitiful.net/hexo-vercel/20220820181601.png)

![点击确认转移域名](https://fluid.s3.bitiful.net/hexo-vercel/20220820181557.png)

### 调试完毕后：

- 把域名切换到服务器A
- 同时部署到服务器B，服务器B同步A的部署内容，以便下次备用

> 总结就是服务器A现行，服务器B做后备，调试发布使用A，调试A的时候B就顶上前台！
>
> 这样，调试和正常部署网络服务两不误。是不是感觉自己是个大聪明！

## 参考&致谢

- <https://vercel.com/docs/project-configuration#project-configuration/redirects>

## 系列教程

- [Hexo Docker环境与Hexo基础配置篇](https://blog.17lai.site/posts/40300608/)
- [hexo博客自定义修改篇](https://blog.17lai.site/posts/4d8a0b22/)
- [hexo博客网络优化篇](https://blog.17lai.site/posts/9b056c86/)
- [hexo博客增强部署篇](https://blog.17lai.site/posts/5311b619/)
- [hexo博客个性定制篇](https://blog.17lai.site/posts/4a2050e2/)
- [hexo博客常见问题篇](https://blog.17lai.site/posts/84b4059a/)
- [hexo博客博文撰写篇之完美笔记大攻略终极完全版](https://blog.17lai.site/posts/253706ff/)
- [Hexo Markdown以及各种插件功能测试](https://blog.17lai.site/posts/cf0f47fd/)

> - markdown 各种其它语法插件，latex公式支持，mermaid图表，plant uml图表，URL卡片，bilibili卡片，github卡片，豆瓣卡片，插入音乐和视频，插入脑图，插入PDF，嵌入iframe

- [在 Hexo 博客中插入 ECharts 动态图表](https://blog.17lai.site/posts/217ccdc1/)
- [使用nodeppt给hexo博客嵌入PPT演示](https://blog.17lai.site/posts/546887ac/)
- [Vercel部署高级用法教程](https://blog.17lai.site/posts/e922fac8/)

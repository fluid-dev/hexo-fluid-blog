---
title: 常见静态网站托管平台使用及多节点部署方案
date: 2020-05-27 15:00:00
index_img: https://cdn.vince.pub/blog-file/photo/ot5kWZkH97s.jpg
category: 实用技巧
tags:
  - 部署
  - Hexo
  - 用户经验
excerpt: 择一个合适的托管平台对于博客来说十分重要，可以免费使用且稳定高速的平台是不存在的，我们总是需要做出妥协。
---

{% note success %}
本文由 Fluid 用户授权转载，版权归原作者所有。

本文作者：Vince
原文地址：https://i.vince.pub/posts/2fc062cb/
{% endnote %}

## 前言

对于 Hexo 来说，我们使用它来部署博客是因为无后端运维和高速渲染页面等优点。选择一个合适的托管平台对于博客来说十分重要，可以免费使用且稳定高速的平台是不存在的，我们总是需要做出妥协。我使用了 Github Pages、Coding Pages、Gitee Pages、Netlify 和 Vercel 来部署博客，以下为我的使用报告。

## 常见托管平台

![节点](https://cdn.vince.pub/blog-file/photo/2fc062cb2.svg)

### Github Pages

<span class="label label-primary">免费</span><span class="label label-success">扩展性强</span><span class="label label-danger">无限制性</span>

使用体验：可以与仓库无缝对接，高效部署，但是没用设置国内节点，在国内访问速度较慢，作为一个海外节点还是非常不错的。相对而言，使用 jsdelivr 来加速网站相关文件可以满足基本使用。查看 Github Status，Pages 服务会出现偶尔挂掉的情况，但多数仓库文档、演示等都选择了 Github Pages 服务。

使用及扩展：提供二级域名，支持域名绑定及免费 SSL 证书。网站内容与仓库保存一致，自动推送。通过使用 Github Actions 具有较强扩展性。

### Netlify

<span class="label label-primary">免费</span><span class="label label-success">扩展性强</span><span class="label label-danger">无限制性</span>

使用体验：Netlify 的节点设置在海外，但 Netlify 的服务速度尚可，国内部分地区可以到达高速服务。在使用 CDN 的情况下，把网站部署在 Netlify 是可以比较好的选择。Vuejs 和 Hexo 的官网都部署在 Netlify 上，其稳定性可想而知。Netlify 虽然拥有付费功能，但是基本上我们需要使用到的服务都免费。

使用及扩展：提供二级域名，支持域名绑定及免费 SSL 证书。Netlify 支持 Github 或者 Gitlab 等账号登录，如果仓库已经是静态网站文件，每次 Push 到仓库 Netlify 都会自动部署。支持 Build Command，源文件也可以通过提供的环境自动编译或渲染，类似于一款 CI，与 Github Pages 功能相近。

### Vercel

<span class="label label-primary">免费</span><span class="label label-success">扩展性强</span><span class="label label-danger">无限制性</span>

使用体验：Vercel 的体验情况总体和 Netlify 相近，节点设置在海外，访问速度尚可。前身是 now.sh，作为一个高质量的静态托管平台，Vercel的使用体验非常好，是一个可选的优秀平台。

使用及扩展：提供二级域名，支持域名绑定及免费 SSL 证书。支持 Github 或者 Gitlab 等账号登录，如果仓库已经是静态网站文件，每次 Push 到仓库都会自动部署。Vercel 打出了 free forever 的口号，也就是说在非商用的情况下，个人可以永久免费使用。支持设置环境并执行相关命令，自动部署不在话下。

### Coding

<span class="label label-primary">免费</span><span class="label label-success">一般扩展性</span><span class="label label-danger">限制性</span>

使用体验：Coding 是腾讯系的一个国内托管平台，对于人数较少的团体实行免费制度。服务器节点部署在国内，在国内使用访问速度较快。也是国内开放程度比较高的一个代码托管平台了，静态网站功能 Coding 最近改版了一下，相对于之前来说更稳定了一些。

使用及扩展：提供二级域名，支持域名绑定及免费 SSL 证书。基于 Kubernetes 的持续部署，可以人我们体验到与 DevOps 体系紧密结合的持续部署能力。持续中提供静态网站托管，但是静态网站托管需要实名和绑定手机号。

### Gitee

<span class="label label-primary">免费（国内限制）</span><span class="label label-success">扩展性较低</span><span class="label label-danger">限制性强</span>

使用体验：Gitee 是一个国内托管平台，对比 coding 来说较为封闭。静态托管功能上拥有较大限制，且无法自动部署，功能残缺。

使用及扩展：提供二级域名，非付费版不支持自动部署、域名绑定及免费 SSL 证书。如果强制使用 https，可能会造成样式文件失效等问题。

### TCB

<span class="label label-primary">付费</span><span class="label label-success">扩展性高</span><span class="label label-danger">一般限制性</span>

使用体验：TCB(Tencent CloudBase）采用 serverless 架构，提供静态托管服务。我的主站就是使用 TCB，相对而言因为付费了，所以效果较好，在全国各地有 CDN 节点，目前使用是因为腾讯的赞助计划，如果赞助计划失效了，价格过高可能会考虑切换平台。空间较大，流量较多，已经充当 CDN 使用了。

使用及扩展：提供二级域名，支持自动部署及 免费SSL 证书，但是 SSL 证书申请可能需要备案。扩展性较强，可以使用 CLI 工具或者 Tencent CloudBase Github Action 来部署。

## 多节点部署方案

![](https://cdn.vince.pub/blog-file/photo/2fc062cb1.png)

### 几个仓库

#### Hexo 源码仓库

从图中可以看到使用了 `Blog-Source` 这个仓库为 Hexo 源码仓库，这个仓库有一个使用了两个 Github Actions，一个用来渲染博客文件并推送到 TCB 静态托管平台，一个用来渲染博客文件推送到各个 Git 仓库，理论上一个 Action 也可以完成这些任务，但是便于管理我选择了两个 Action。

推送至各个 Git 仓库

```
name: Deploy to Repo(Github, Coding, Gitee)
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    env: 
      hTZ: Asia/Shanghai
    steps:
    - name: Checkout
      uses: actions/checkout@v2
      with:
        ref: master
    - name: Update Submodule
      run: |
        git submodule init
        git submodule update --remote
    - name: Setup Node
      uses: actions/setup-node@v1
      with:
        node-version: "10.x"
    - name: Hexo Generate
      run: |
        rm -f .yarnclean
        yarn --frozen-lockfile --ignore-engines --ignore-optional --non-interactive --silent --ignore-scripts --production=false
        rm -rf ./public
        yarn run hexo clean
        yarn run hexo generate
    - name: Hexo Deploy
      env:
        SSH_PRIVATE: ${{ secrets.SSH_PRIVATE }}
        GIT_NAME: vinceying
        GIT_EMAIL: admin@vicne.pub
      run: |
        mkdir -p ~/.ssh/
        echo "$SSH_PRIVATE" | tr -d '\r' > ~/.ssh/id_rsa
        chmod 600 ~/.ssh/id_rsa
        ssh-keyscan e.coding.net >> ~/.ssh/known_hosts
        ssh-keyscan github.com >> ~/.ssh/known_hosts
        ssh-keyscan gitee.com >> ~/.ssh/known_hosts
        git config --global user.name "$GIT_NAME"
        git config --global user.email "$GIT_EMAIL"
        yarn run hexo deploy
```

推送至 TCB

```
name: Deploy to Tencent CloudBase
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      TZ: Asia/Shanghai
    name: Deploy Hexo Souce Repo to Tencent CloudBase
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v1
        with:
          node-version: '10.x'
      # NPM 环境及 Hexo 部署
      - name: NPM
        run: npm install
      - name: Clean
        run: ./node_modules/.bin/hexo clean
      - name: Generate
        run: ./node_modules/.bin/hexo generate
      # Deploy static to Tencent CloudBase
      - name: Deploy static to Tencent CloudBase
        id: deployStatic
        uses: TencentCloudBase/cloudbase-action@v1.1.1
        with:
          secretId: ${{ secrets.SECRET_ID }}
          secretKey: ${{ secrets.SECRET_KEY }}
          envId: ${{ secrets.ENV_ID }}
          staticSrcPath: public
```

#### Github 博客页面仓库

这个作为使用 Github Pages 服务的仓库，同时在 Netlify 和 Vercel 的选择为源仓库，在每次推送至本仓库时，Netlify 和 Vercel 都会自动部署新文件。

#### CDN 文件仓库

这个仓库作为管理和存放一些需要推送到 CDN 的文件，比如 css 文件、图片和视频等，首先是为了便于管理及通过 Github Actions推送 到 TCB，其次是为了使用 Jsdelivr CDN 服务作为备用 CDN。

### 方案优点

- 高效自动化，利用 Github Actions,每次只要 Push 到 `Blog-Souce`和`Blog-file`仓库就可以全仓库和全节点同步。
- 便于管理文件，当主 CDN 失效后，直接替换 CDN 地址链接即可完成启用备用 CDN，且备份了文件。
- 多设备管理，当切换设备后，直接在不安装环境的情况下直接 Clone 即可管理博客，但调试方面还是需要安装环境。特别是在 Github 的云端 IDE-Codespace 正式发布后，可以完全通过仓库管理博客。

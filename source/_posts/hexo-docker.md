---
title: Hexo 使用 Docker 来写文章和调试博客 
author: 夜法之书
date: 2022-10-10 18:04:57
index_img: https://fluid.s3.bitiful.net/hexo-docker/cover.png
category: 实用技巧
tags:
  - 用户经验
  - 花里胡哨
  - Hexo
excerpt: Docker 是一种轻量级的虚拟机环境，可以隔离主机的运行环境，内核公用主机的，运行库和环境是 Docker 私有的。运行 Docker 程序只比主机直接运行程序性能损失微乎其微。使用 Docker 你可以同时运行各种各样运行库环境而不用担心搞乱你的主机运行库环境！
---

{% note success %}
本文由 Fluid 用户授权转载，版权归原作者所有。

本文作者：[夜法之书](https://blog.17lia.site)
原文地址：<https://blog.17lai.site/posts/40300608/>
{% endnote %}

## Hexo Docker环境使用篇

### Docker 简介：

> Docker 是一种轻量级的虚拟机环境，可以隔离主机的运行环境，内核公用主机的，运行库和环境是 Docker 私有的。运行 Docker 程序只比主机直接运行程序性能损失微乎其微。使用 Docker 你可以同时运行各种各样运行库环境而不用担心搞乱你的主机运行库环境！
>
> Docker 运行负载远小于 Vmware 这类虚拟机， Vmware 需要模拟对应的CPU指令，再虚机运行一个虚拟机自己的内核，再这个虚拟机内核之上，再运行虚拟机的运行库和程序。比 Docker 多了一个内核模拟和运行，Cpu 和内存开销大增！

### Docker 版 hexo 环境一键部署

> 博主开源定制，推荐使用！省去您大量环境配置时间。
>
> 使用 Hexo Docker 之前需要 Docker 环境，请参阅后文 Docker 安装方法
>
> - [docker-hub](https://hub.docker.com/r/bloodstar/hexo)
> - [Github-hexo](https://github.com/appotry/docker-hexo)

Docker一键安装

```bash
docker create --name=hexo \
-e HEXO_SERVER_PORT=4000 \
-e GIT_USER="17lai" \
-e GIT_EMAIL="17lai@domain.tld" \
-v /mnt/blog.17lai.site:/app \
-p 4000:4000 \
bloodstar/hexo
```

`Docker`镜像直接提供最新版本`node` ，`hexo`

### hexo web 后台写作

> 基于 **[hexo-admin](https://github.com/jaredly/hexo-admin)** 实现，具体配置实现方法见[后文](https://blog.17lai.site/posts/40300608/)。
>
> 最终效果如下图所示。` blog.17lai.fun` 访问`blog`， 添加后缀 `admin` 访问 `hexo` 后台。
>
> 使用前面提到的 hexo docker ，启动运行 hexo docker 后，非自动安装 hexo-admin 以及常用插件，你也可以自定义安装你虚幻的插件， `vi /app/useRun.sh`。

![hexo-admin 主界面](https://fluid.s3.bitiful.net/hexo-docker/2620220326133730.png)

![hexo-admin 编辑写作界面](https://fluid.s3.bitiful.net/hexo-docker/2620220326133825.png)

配置 hexo-admin 根目录下`_config.yml`:

```yaml
admin:
  username: myfavoritename #用户名
  password_hash: be121740bf988b2225a313fa1f107ca1 #密码
  secret: a secret something # secret is used to make the cookies secure
  deployCommand: '/app/tools/cide.sh'  # 自定义的部署脚本，在 hexo admin 的 deploy 标签页 deploy 按钮点击调用
```

配置 post metadata 根目录下`_config.yml`:

```yaml
# add and edit your own post metadata with the admin interface
metadata:
  author_id: defaultAuthorId
  language:
```

#### hexon

> Github: [hexon](https://github.com/gethexon/hexon)
>
> 另一个hexo web 编辑界面，界面比hexo-admin更现代化。安装配置方法见[Github](https://github.com/gethexon/hexon)

![hexon](https://fluid.s3.bitiful.net/hexo-docker/20220529214918.png)

#### hexo-editor

> [hexo-editor](https://github.com/tajpure/hexo-editor)
>
> 又一个hexo web 编辑器

![hexo editor 登录](https://fluid.s3.bitiful.net/hexo-docker/20220818101457.png)

![hexo editor 预览](https://fluid.s3.bitiful.net/hexo-docker/20220818101457-1.png)

![hexo editor 编辑](https://fluid.s3.bitiful.net/hexo-docker/20220818101457-2.png)

**支持手机**

![](https://fluid.s3.bitiful.net/hexo-docker/20220818101457-3.png)

### ssh key 部署

**Docker会自动随机生成ssh key** 在 /app/.ssh 目录下面。自动部署请把ssh key添加到github 等平台。

[Github详细教程](https://docs.github.com/cn/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

> 1. 将**SSH** 公钥复制到剪贴板。 ...
> 2. 在任何页面的右上角，单击您的个人资料照片，然后单击Settings（设置）。
> 3. 在用户设置侧边栏中，单击**SSH** and GPG keys（**SSH** 和GPG 密钥）。
> 4. 单击New **SSH** key（新**SSH** 密钥）或Add **SSH** key（添加**SSH** 密钥）。

### SSH 进入docker

```bash
docker exec -it hexo /bin/bash
```

然后就可以正常运行hexo的各种命令了，是不是非常简单？ 快来试试吧。

### 远程 SSH 访问Docker

> 推荐使用`SecurtCRT` 来远程访问你的`Docker`。

![SecurtCRT](https://fluid.s3.bitiful.net/hexo-docker/2620220326140201.png)

### 自定义用户自动运行脚本

> 用户可以在这里添加自动配置，自动安装插件，等各种启动docker运行的命令。
>
> 它将在Docker启动完成后自动调用运行！

```bash
vi /app/useRun.sh
```

### 反向代理 Hexo Docker

> *Nginx* (engine x) 是一个高性能的HTTP和反向代理web服务器，同时也提供了IMAP/POP3/SMTP服务。
>
> - 一些测试可能需要ssl支持，那么用nginx来反向代理一下，就可以在本地愉快的测试ssl加密功能了。
>
> - 访问docker，需要 `192.168.0.100:4000`这样数字`ip + 端口号`的方式不觉得很丑陋，而且需要开大量的端口，使用nginx反向代理，可以直接使用域名访问。
> - 如果你想使用`blog.17lai.fun`这样的域名访问你的 docker 里面运行的博客，请参考下文。

Nginx也使用docker来运行，`blog.17lai.fun`为本地域名，修改本地hosts dns信息来访问。

#### docker compose 配置

```yaml
  nginxweb:
    image: bloodstar/nginx-purge
    container_name: "nginxweb"
    hostname: nginxweb
    ports:
      - "80:80"
      - "443:443"
    restart: always
    volumes:
      # ${USERDIR}为你docker运行目录
      - ${USERDIR}/nginx/conf.d:/etc/nginx/conf.d:ro
      - ${USERDIR}/nginxproxy/certs:/etc/nginx/certs:ro
      - ${USERDIR}/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
```

- [bloodstar/nginx-purge](https://hub.docker.com/r/bloodstar/nginx-purge)

#### nginx配置

文件 `blog.conf` ，配置文件放到`${USERDIR}/nginx/conf.d`目录中

```nginx
upstream blog {
    server hexo:4000;
}

server {
    listen 80;
    listen 443 ssl http2;
    server_name  blog.17lai.fun;

    ssl_certificate /etc/nginx/certs/17lai.pem;
    ssl_certificate_key /etc/nginx/certs/17lai.key;

    ssl_session_cache shared:aria2SSL:10m;
    ssl_session_timeout  30m;
    #ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    
    access_log /var/log/nginx/blog.17lai.fun_access.log combined;
    error_log  /var/log/nginx/blog.17lai.fun_error.log;
    
    keepalive_requests 10000;
    
    location / {
        #proxy_redirect off;
        proxy_pass http://blog;

        proxy_buffering off;
        
        add_header X-Cache-Status $upstream_cache_status;
        proxy_set_header Host $http_host;

        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header  X-Forwarded-Ssl     on;
        proxy_set_header  X-Forwarded-For     $proxy_add_x_forwarded_for;      
        proxy_set_header  X-Frame-Options     SAMEORIGIN;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    } 
}

```

#### Windows DNS修改

windows hosts文件路径为： `C:\Windows\System32\drivers\etc\HOSTS`

管理员权限用文本编辑器打开这个文件并添加 `192.168.0.100 blog.17lai.fun`，然后，你就可以在本地浏览器中使用域名访问你的blog了！

#### Linux DNS 修改

Linux hosts 文件路径为： `/etc/hosts`

用文本编辑器或者命令行工具`vim`打开这个文件并添加 `192.168.0.100 blog.17lai.fun`，然后，你就可以在本地浏览器中使用域名访问你的blog了！

```bash
# root用户一条指令搞定
echo "192.168.0.100 blog.17lai.fun" >> /etc/hosts

#或者使用 vi 或者 vim
vi /etc/hosts
```



#### 获取 SSL 证书

> - 如果你购买了域名，可以在域名服务商获得免费的ssl证书。
> - 自己生成<u>*私有证书*</u>，使用时需要给本地计算机，浏览器添加==你自己的根证书==，才能使你的ssl 证书在==你自己的浏览器==中生效。

> 使用Hexo Docker之前需要Docker 环境，下面是Docker 环境安装方法。

### **Centos 安装Docker**

**X86**（一键安装脚本）：

```bash
curl -sSL https://get.docker.com/ | sh
```

**Arm**：

步骤1

```bash
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

步骤2

添加仓库

```bash
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

步骤3

安装Docker

```bash
sudo yum install docker-ce docker-ce-cli containerd.io
```

![centos docker](https://fluid.s3.bitiful.net/hexo-docker/2420220324173951.png)

![centos docker](https://fluid.s3.bitiful.net/hexo-docker/2420220324173951-1.png)完成安装

步骤4

启动Docker

```bash
sudo systemctl start docker
```

### QNAP 安装Docker

> 在系统应用的AppCenter中找到 Container  Station，可以直接点击安装即可。

![qnap docker](https://fluid.s3.bitiful.net/hexo-docker/2620220326110013.png)

### 群晖 安装 Docker

首先要说的是，x86 平台的群晖才能用的上 `Docker` 套件，因此，ARM 架构平台的群晖只能说非常遗憾了。
　　打开套件中心，在 “所有套件” 中找到 `Docker` 并安装：

![群晖 Docker](https://fluid.s3.bitiful.net/hexo-docker/2620220326111828.png)

## 系列教程

本文是系列教程**基于Hexo的matery主题搭建博客并深度优化完全一站式教程**第一篇的Docker部分

- [Hexo Docker环境与Hexo基础配置篇](https://blog.17lai.site/posts/40300608/)
- [hexo博客自定义修改篇](https://blog.17lai.site/posts/4d8a0b22/)
- [hexo博客网络优化篇](https://blog.17lai.site/posts/9b056c86/)
- [hexo博客增强部署篇](https://blog.17lai.site/posts/5311b619/)
- [hexo博客个性定制篇](https://blog.17lai.site/posts/4a2050e2/)
- [hexo博客常见问题篇](https://blog.17lai.site/posts/84b4059a/)
- [hexo博客博文撰写篇之完美笔记大攻略终极完全版](https://blog.17lai.site/posts/253706ff/)
- [Hexo Markdown以及各种插件功能测试](https://blog.17lai.site/posts/cf0f47fd/)

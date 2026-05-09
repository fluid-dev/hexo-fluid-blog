---
title: Hexo 云服务备份与使用 Jupyter 
author: pxxyyz
index_img: https://fluid.s3.bitiful.net/hexo-server/hexo-server.png?w=480&fmt=webp
category: 实用技巧
tags:
  - 用户经验
  - 花里胡哨
  - 部署
  - Hexo
excerpt: 尝试用服务器来丰富博客内容，主要包括服务器端的备份(hexo b)和Jupyter的设定
date: 2020-05-28 14:30:00
mathjax: true
---

{% note success %}
本文由 Fluid 用户授权转载，版权归原作者所有。

本文作者：pxxyyz

原文地址：<https://pxxyyz.com/posts/32990/>、<https://pxxyyz.com/posts/60533/>
{% endnote %}

## 前言

记录hexo博客遇到的问题：

- 免密git
- 自动备份
- 云服务器开启`Jupyter Notebook`
- 在博客的菜单访问`Jupyter`（使用`Nginx`重定向实现url访问端口）
- 公式渲染引擎

## 云服务器备份

参考「Hexo博客部署到腾讯云服务器」[^1]后遇到了两个问题：


1. 每次在本地部署博客时都要重复输入密码

   ```yml
   deploy:
       type: git
       repo: root@***(服务器ip,内网外网都行):/home/git/blog.git    #仓库地址
       branch: master    #分支
   ```

2. 备份时hexo自带的backup无效

   ```yml
   backup:
       type: git
       repo: root@***(服务器ip,内网外网都行):/home/git/backup.git    #仓库地址
       branch: master    #分支
   ```

### 免密git

在这一部分参照了「使用Git+Hooks实现Hexo站点自动部署到CentOS服务器上」[^2]的配置SSH免密登陆步骤。

```bash
$ ssh-copy-id -i ~/.ssh/id_rsa.pub your_user_name@HostIP  //添加公钥
$ ssh your_user_name@HostIP //验证是否添加成功
```

因为部署时用的root上传，因此这里的`your_user_name`设置`git`和`root`两个。添加成功后`ssh -v git@HostIP`和`ssh -v root@HostIP`显示`Welcome to XXX !`

### 自动备份

这里我按照「deploy的流程在服务器设置了自动化备份」[^1]，主要思路是在服务器设置一个独立的文件夹`backup`，再用类似**deploy**的钩子`blog.git`，构造一个备份的钩子`deploy.git`将博客的备份文件上传。

- 获取`root`权限

  ```bash
  $ su root
  ```

- 建立`git`仓库

  ```bash
  $ cd /home/backup
  $ git init --bare backup.git
  ```

- 修改`backup.git`权限

  ```bash
  $ chown git:git -R backup.git
  ```

- 在 `/home/hexo/backup.git` 下，有一个自动生成的 `hooks` 文件夹，我们创建一个新的 `git` 钩子 `post-receive`，用于自动部署。

  ```bash
  $ vim backup.git/hooks/post-receive
  ```

- 按 `i` 键进入文件的编辑模式，在该文件中添加两行代码（将下边的代码粘贴进去)，指定 Git 的工作树（源代码）和 Git 目录

  ```bash
  #!/bin/bash 
  git --work-tree=/home/backup --git-dir=/home/git/backup.git remote add origin
  git --work-tree=/home/backup --git-dir=/home/git/backup.git checkout -f
  # git --work-tree=/home/backup --git-dir=/home/git/backup.git checkout -b master # 创建切换分支
  git --work-tree=/home/backup --git-dir=/home/git/backup.git push origin master # 提交代码至分支
  ```

- 按 `Esc` 键退出编辑模式，输入`:wq` 保存退出。（先输入`：`，然后输入`wq`回车）

- 修改文件权限，使得其可执行。

  ```bash
  $ chmod +x /home/git/backup.git/hooks/post-receive
  ```

- 博客根目录`_config`下增加(因为服务器没有分支，默认是`master`，使用`backup`钩子)

  ```yml
  deploy:
      type: git
      repo: root@***(服务器ip,内网外网都行):/home/git/backup.git    #仓库地址
      branch: master    #分支
  ```

- 备份`hexo backup`(使用 `Hexo-Git-Backup` 插件)

  ```bash
  $ hexo clean
  $ hexo g
  $ hexo b
  ```

<p class="note note-primary">这个地方走了不少弯路，因为backup阶段每次都提示错误：</p>

```
fatal: 'xxx' does not appear to be a git repository
fatal: Could not read from remote repository.
```

我通过搜索`fatal-does-not-appear-to-be-a-git-repository`找到解决思路，用`Git命令`自动备份。详细参见「HEXO博客实现自动备份」[^3]。

- 安装 `shelljs` 模块

  ```bash
  $ npm install --save shelljs
  ```

- 编写自动备份脚本：主题目录下`scripts`文件夹下新建一个`js`文件，文件名随意取，例如`update.js`。

```js
require('shelljs/global');
try {
    // hexo.on('deployAfter', function() {         //当deploy完成后执行备份
    hexo.on('backupAfter', function() {            //当backup完成后执行备份
        run();
    });
} catch (e) {
    console.log("产生了一个错误<(￣3￣)> !，错误详情为：" + e.toString());
}
function run() {
    if (!which('git')) {
        echo('Sorry, this script requires git');
        exit(1);
    } else {
        echo("======================Auto Backup Begin===========================");
        cd('XXXXXXX');    //此处修改为Hexo根目录路径
        if (exec('git add .').code !== 0) {
            echo('Error: Git add failed');
            exit(1);
        }
        if (exec('git commit -m "Form auto backup script\'s commit"').code !== 0) {
            if (exec('git remote add origin your_user_name@HostIP:/home/git/backup.git').code !== 0){       //修改访问服务器方式
                if (exec('git push origin master').code !== 0) {
                    echo('Error: Git push failed');
                    exit(1);
                }
            } else {
                echo('Error: Git commit failed');
                exit(1);
            }
        }
        if (exec('git push origin master').code !== 0) {
            echo('Error: Git push failed');
            exit(1);
        }
        echo("==================Auto Backup Complete============================")
    }
}
```

注意：

- 在`Hexo根目录`或在主题目录下的`scripts`文件夹`js`在启动时就会自动载入，因此建议放在主题目录下，避免不必要的问题，例如`Blog/themes/fluid/scripts/update.js`。
- 此`backup.js`是在`hexo backup`运行后`backupAfter`自动触发的，因此可以在其他仓库备份(如`github`和`coding`)后实现服务器的自动备份。
- `git`远程仓库在服务器，所以push在服务器端的`home/git/backup.git`里`post-receive`钩子中。
- 由于设定了`git`免密设置，因此使用`backup.git`操作不需要重复的输入密码。

在`_config.yml`下设置备份配置。**注意：`backup`下不要有服务器的`repo`**，因为在`scripts`下`backup.js`已实现`git push`。

```yml
backup:
    type: git
    message: 'backup updata: {{now("YYYY-MM-DD HH/mm/ss")}}'
    ## theme: fluid #主题
    repo: #XXX为用户地址或IP地址
        github: git@github.com:XXX.github.io.git,backup
        coding: git@e.coding.net:XXX.git,backup
        ## hexo: root@XXX:/home/git/backup.git,master
```

再来一波四连😄

```bash
$ hexo clean 
$ hexo g 
$ hexo d 
$ hexo b
```

得到

```bash
$ hexo b
INFO  Start backup: git
The file will have its original line endings in your working directory
[master 79b18cc] backup updata: XXXX
 2 files changed, 143 insertions(+), 4 deletions(-)
Branch 'master' set up to track remote branch 'backup' from 'github'.
To github.com:XXXXXX
   89e022d..79b18cc  master -> backup
Branch 'master' set up to track remote branch 'backup' from 'coding'.
To e.coding.net:XXXXXX
   89e022d..79b18cc  master -> backup
INFO  Backup done: git
======================Auto Backup Begin===========================
On branch master
Your branch is up to date with 'coding/backup'.

nothing to commit, working tree clean
fatal: remote origin already exists.
remote: usage: git remote add [<options>] <name> <url>
remote:
remote:     -f, --fetch           fetch the remote branches
remote:     --tags                import all tags and associated objects when fetching
remote:                           or do not fetch any tag at all (--no-tags)    
remote:     -t, --track <branch>  branch(es) to track
remote:     -m, --master <branch>
remote:                           master branch
remote:     --mirror[=(push|fetch)]
remote:                           set up remote as a mirror to push to or fetch from
remote:
remote: fatal: 'origin' does not appear to be a git repository
remote: fatal: Could not read from remote repository.
remote:
remote: Please make sure you have the correct access rights
remote: and the repository exists.
remote: fatal: not a git repository (or any of the parent directories): .git    
To XXXXXX:/home/git/backup.git
   89e022d..79b18cc  master -> master
Everything up-to-date
==================Auto Backup Complete============================
```

服务器的文件夹`/home/backup`下可看到`Hexo backup`的备份文件，服务器端备份的文件与`github`或`coding`备份文件一致。同时，文件夹`/home/hexo`是`hexo deploy`的部署文件，通过`Nginx`提供 `Web 服务`。这就实现了服务器部署和备份的自动化操作。

{% note primary %}
**Tips**:如果遇到程序没有报错但文件夹上传失败时，可以手动删除`Hexo`根目录下的`.deploy_git` 文件夹，再重新部署和备份。
{% endnote %}

## 访问Jupyter

下面以域名`pxxyyz.com`为例，首先需要在服务器开启`Jupyter`[^4]

### 安装Jupyter

- 安装`Anaconda`

```bash
$ mkdir anaconda //创建目录
$ cd anaconda    //进入目录
// 在镜像站找到安装包并下载
$ wget https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/Anaconda3-2020.02-Linux-x86_64.sh
$ bash Anaconda3-2020.02-Linux-x86_64.sh  //安装anaconda3
```

- 生成`Jupyter Notebook`配置文件

```bash
$ jupyter notebook --generate-config
```

- 打开`ipython`并设置登入密码

```python
ipython 
In [1]: from IPython.lib import passwd
In [2]: passwd()                         #设置Jupyter Notebook密码
Enter password: 
Verify password: 
Out[2]: ''                               #生成的密钥在配置文件有用
```

- 修改服务器配置文件

```bash
$ vim ~/.jupyter/jupyter_notebook_config.py
```

- 按 `i` 键进入文件的编辑模式，在该文件中添加代码，按 `Esc` 键退出编辑模式，输入`:wq` 保存退出。（先输入`:`，然后输入`wq`回车）

```bash
# 设置所有ip地址皆可访问
c.NotebookApp.ip='*' 
# 输入密码的哈希值，见Out[2]
c.NotebookApp.password = u'sha1:XXX'
# 禁止自动打开浏览器
c.NotebookApp.open_browser = False  
# 指定端口，需要在服务器安全组开发该端口
c.NotebookApp.port =8888 
# 远程访问
c.NotebookApp.allow_remote_access = True 
# 使用mathjax，可输入公式
c.NotebookApp.enable_mathjax = True
```

- 启动`Jupyter`

```bash
$ nohup jupyter notebook --allow-root & 
# nohup避免关闭终端则终止了Jupyter 程序的运行，--allow-root允许root权限，& 将程序放入后台运行
```

- 打开端口步骤： 本实例安全组->配置规则->入方向->手动添加

<center>
| 授权策略 | 优先级 |  协议类型  |    端口范围    |   授权对象   |
| :------: | :----: | :--------: | :------------: | :----------: |
|   允许   |  100   | 自定义 TCP | 目的:8888/8888 | 源:0.0.0.0/0 |
</center>


- 浏览器访问`Jupyter notebook`(移动端或桌面端)，并输入刚才配置的密码即可使用

```html
http://HostIP:8888
http://域名:8888
```

**注意**：

1. 第二种方式需要域名解析到服务器公网IP，域名等价于公网IP
2. `https://HostIP:8888`访问出错，`https://域名:8888`同理

- anaconda换源，分别测试一下下载速度和稳定性，自行选择最优的

```bash
# 添加清华源
$ conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
$ conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
$ conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge 
$ conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/
$ conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/

# 添加上交源
$ conda config --add channels https://mirrors.sjtug.sjtu.edu.cn/anaconda/pkgs/main/ 
$ conda config --add channels https://mirrors.sjtug.sjtu.edu.cn/anaconda/pkgs/free/
$ conda config --add channels https://mirrors.sjtug.sjtu.edu.cn/anaconda/cloud/conda-forge/ 

# 添加中科大源
$ conda config --add channels https://mirrors.ustc.edu.cn/anaconda/pkgs/main/
$ conda config --add channels https://mirrors.ustc.edu.cn/anaconda/pkgs/free/
$ conda config --add channels https://mirrors.ustc.edu.cn/anaconda/cloud/conda-forge/
$ conda config --add channels https://mirrors.ustc.edu.cn/anaconda/cloud/msys2/
$ conda config --add channels https://mirrors.ustc.edu.cn/anaconda/cloud/bioconda/
$ conda config --add channels https://mirrors.ustc.edu.cn/anaconda/cloud/menpo/

# 设置搜索时显示通道地址 有资源显示源地址
$ conda config --set show_channel_urls yes

# 换回默认源(重置用)
$ conda config --remove-key channels
```

- 可以在`Jupyter notebook`的工作目录中上传或下载`.ipynb`文件，当然别的文件也可以。

### Nginx 重定向

希望在我的博客中添加一个菜单按钮直接访问我的`Jupyter notebook`。然而菜单链接是通过`url_for`自动生成的，如添加`link: ':8888'`，生成的是`pxxyyz.com/:8888/`，而不是`pxxyyz.com:8888`。当然，可以设置链接为`link: 'pxxyyz.com:8888'`，直接且简单，但这不能学到一些有趣的东西！

{% note primary %}

下面通过特点子页面来访问域名的指定端口，即通过`pxxyyz.com/jupyter`访问`pxxyyz.com:8888`

{% endnote %}

- 在此之前上传了`SSL证书`并配置`HTTPS`[^5]
- 修改服务器配置文件

```bash
$ vim /etc/nginx/nginx.conf
```

- 按 `i` 键进入文件的编辑模式，在该文件找到`server`，修改代码，按 `Esc` 键退出编辑模式，输入`:wq` 保存退出。（先输入`:`，然后输入`wq`回车）


```bash
    server {
        listen       443 ssl;# 80 default_server;
        # listen       [::]:80 default_server;
        server_name  pxxyyz.com;
        root         /home/hexo;
        # ssl on; # 老版本指令
        ssl_certificate /etc/nginx/conf/XXXXbundle.crt;
        ssl_certificate_key /etc/nginx/conf/XXXX.key;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4!DHE;
        ssl_prefer_server_ciphers on;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
        }

		# http://pxxyyz.com/jupyter/ to http://pxxyyz.com:8888
        location ~ /jupyter/?$ {
          return 302 http://pxxyyz.com:8888;
        }
        
        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
    server { #把http的域名请求转成https
        listen 80;
        server_name pxxyyz.com;
        return 301 https://$host$request_uri;
    }
```

- 重启`nginx` 并检查配置

```bash
$ service nginx restart
# systemctl restart nginx.service
$ nginx -t

# 得到结果是
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

- 当然，一开始不是这么做的，错误的方法也贴出来，避免入坑

```bash
  server {
      listen 80;
      server_name pxxyyz.com;
      location /jupyter {
            proxy_pass http://pxxyyz.com:8888/tree?
       }
    }
```

- 分析

  - 用`proxy_pass`得到的重定向是`https://pxxyyz.com/jupyter`

  - 对应的服务器访问的是`https://HostIP:8888`

  - 正确的`Jupyter notebook`访问地址却是`http://HostIP:8888`

  - 因此问题出在**http的域名强制转成https**

  - 解决方法：遇到指定链接用`return 302`返回**http**从而得到正确的结果[^6]

  - 结果：

    - `https://pxxyyz.com/jupyter`、`http://pxxyyz.com/jupyter`、`http://pxxyyz.com:8888`和`http://HostIP:8888`均能打开`Jupyter notebook`
    -  但**IP的SSL证书不免费**！`https+port`的组合访问会出错。

## 补充

### 数学公式

在此补充一下之前公式不显示的问题。虽然[Fluid](https://fluid.ist/docs/)主题支持**LaTeX 数学公式**，但是需要手动操作，而且我按照[教程](https://fluid.ist/docs/guide/#latex-%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8F)开启本功能`mathjax`没有成功，即公式在网页里并没有被渲染和转换。通过网上查找，发现解决这类问题的思路主要是换渲染引擎[^7]，例如`pandoc`、`mathjax`、`katex`。我目前使用`mathjax`，操作如下：

- **卸载**默认引擎，并**安装**这个新的渲染引擎

  ```bash
  $ npm uninstall hexo-renderer-marked --save 
  $ npm install hexo-renderer-kramed --save
  ```

- 修改`/node_modules/hexo-renderer-kramed/lib/renderer.js`

  ```js
  // Change inline math rule
  function formatText(text) {
  // Fit kramed's rule: $$ + \1 + $$
  // 直接返回text
  // return text.replace(/`\$(.*?)\$`/g, '$$$$$1$$$$');
  return text;
  }
  ```

- 修改hexo的渲染源码`/node_modules/kramed/lib/rules/inline.js`

  ```js
  // 去掉`\\`的额外转义，第11行，将其修改为
  // escape: /^\\([\\`*{}\[\]()# +\-.!_>])/, 
  escape: /^\\([`*{}\[\]()# +\-.!_>])/,
  // 将em标签对应的符号中，去掉`_`，第20行，将其修改为
  // em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,    
  em: /^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  ```

- 停止使用 `hexo-math`，安装 `hexo-renderer-mathjax`

  ```bash
  $ npm uninstall hexo-math --save
  // 不知道是不是必要的
  $ npm install hexo-renderer-mathjax --save
  ```

- 更新 `Mathjax` 的 `CDN` 链接，打开`/node_modules/hexo-renderer-mathjax/mathjax.html`，把`script`更改为：

  ```html
  // <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML"></script> 
  // 网上推荐的上面这个，但我使用失败了，推荐下面这个，亲测可行
  <script src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
  ```

- 按照[Fluid](https://fluid.ist/docs/)的[快速开始](https://fluid.ist/docs/guide/#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)，需要修改**主题配置**，打开`/source/_data/fluid_config.yml` 文件

  ```yml
  post:
    math:  
      enable: true  
      specific: false   
      engine: mathjax
  ```

- 在根目录下修改`_config.yml`，添加

  ```yml
  mathjax: true
  ```

- 在`Front-matter`中打开`MathJax`

  ```yml
  ---
    mathjax: true
  ---
  ```
  
- 显示数学公式

  ```latex
  # 不空行会出bug
  $$\Sigma({n} ; {p})=\left\{\left(\zeta_{1}, \ldots, \zeta_{r}\right) \in \mathbb{C}^{n_{1}} \times \cdots \times \mathbb{C}^{n_{r}}: \sum_{k=1}^{r}\left\|{\zeta}_{k}\right\|^{2 p_{k}} < 1\right\}$$
  ```

$$\Sigma({n} ; {p})=\left\{\left(\zeta_{1}, \ldots, \zeta_{r}\right) \in \mathbb{C}^{n_{1}} \times \cdots \times \mathbb{C}^{n_{r}}: \sum_{k=1}^{r}\left\|{\zeta}_{k}\right\|^{2 p_{k}} < 1\right\}$$


{% note primary %}

因为`hexo-renderer-kramed` 和`hexo-renderer-marked`均不支持`emoji` 功能，使用:smile: :blush: :smiley: :smirk:在Typora可以正常显示表情，在网页上显示的是`:smile: :blush: :smiley: :smirk:`，因此，可以直接复制`emoji`表情😄😊😃😏。

{% endnote %}

经过**[强哥](https://zkqiang.cn/)**提醒，需要额外使用插件`hexo-filter-github-emojis`来支持`hexo` 的 `emoji` 。

  ```bash
$ npm install hexo-filter-github-emojis --save
  ```

在根目录下`_config.yml`添加配置

  ```yml
githubEmojis:
  enable: true
  className: github-emoji
  inject: true
  styles:
  customEmojis:
  ```

正文`markdown`用如下格式使用 `emoji`

 ```
# 不空行会出bug
{% raw %}{% github_emoji emoji %}{% endraw %}
 ```

正如上面所说，Hexo 默认情况下 `:emoji:` 不能正确显示表情，如`:tada:`，而该插件通过 `{% raw %}{%github_emoji tada%}(github_emoji tada){% endraw %}` 即可显示这个 emoji ，其他调用格式可以看 `hexo-filter-github-emojis` 的[官方文档](https://github.com/crimx/hexo-filter-github-emojis)。

### 一键三连

前面提到的在根目录下使用`Git Bash Here`输入下面指令有些繁琐。

  ```
$ hexo clean && hexo g && hexo d && hexo b
  ```

现在用`.bat`文件简化，可以分别保存。其中**第四行的地址为根目录**。

```
:: 一键预览
@echo on
D:
cd D:\github\Hexo-Blog
hexo clean && hexo g && hexo s
```

```
:: 一键部署
@echo on
D:
cd D:\github\Hexo-Blog
hexo clean && hexo g && hexo d
```

```
:: 一键部署+备份
@echo on
D:
cd D:\github\Hexo-Blog
hexo clean && hexo g && hexo d && hexo b
```

**一键预览**的窗口支持实时修改实时显示，即文档修改保存后，刷新可得修改后的预览页面。如果做到ssh免密登入，部署与备份也能一键完成。


<div class="note note-danger" style="text-align:center;color:#0000FF;">免密会带来安全隐患，部署和备份文件最好设置为<div class="label label-default" style="color:#FF0000;font-size:1.2em;font-weight: bold;">私密</div></div>

## 参考

[^1]: [Hexo博客部署到腾讯云服务器](https://www.muyiio.com/2020/03/28/hexo-bo-ke-bu-shu-dao-teng-xun-yun-fu-wu-qi/)

[^2]: [使用Git+Hooks实现Hexo站点自动部署到CentOS服务器上](https://liujunzhou.top/deployer/)

[^3]: [HEXO博客实现自动备份](https://cwyaml.github.io/2017/03/07/backup/)

[^4]: [搭建 ipython/jupyter notebook 服务器](https://bitmingw.com/2017/07/09/run-jupyter-notebook-server/)

[^5]: [hexo部署服务器之配置HTTPS](https://www.kylin.show/25251.html)

[^6]: [NGINX rewrite location to another port](https://stackoverflow.com/questions/50734724/nginx-rewrite-location-to-another-port)

[^7]: [如何在 hexo 中支持 Mathjax？](https://blog.csdn.net/u014630987/article/details/78670258)

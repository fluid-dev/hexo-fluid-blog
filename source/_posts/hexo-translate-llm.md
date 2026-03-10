---
title: 基于大语言模型的 Hexo 博客自动化翻译方案
date: 2026-01-05 18:47:13
author: Tokisaki Galaxy
index_img: https://fluid.s3.bitiful.net/hexo-translate-llm/cover.png?w=480&fmt=webp
categories: 功能增强
tags:
  - 用户经验
  - 花里胡哨
  - Hexo
---

{% note success %}
本文由 Fluid 用户授权转载，版权归原作者所有。

本文作者：Tokisaki Galaxy
原文地址：https://tokisaki.top/blog/hexo-translate-llm/
{% endnote %}

{% note success %}
该项目已在 GitHub 开源。您可以访问 [Tokisaki-Galaxy/hexo-translate-llm](https://github.com/Tokisaki-Galaxy/hexo-translate-llm) 获取更多信息。
{% endnote %}

跨语言的信息传播在数字化时代愈发重要。手动翻译文章不仅耗时，也难以保证更新频率。**Hexo LLM Translate** 插件为此提供了自动化解决方案。它利用大语言模型（LLM）实现博客内容的高质量翻译。

## 核心特性

智能双语切换提升了读者的阅读体验。插件会识别浏览器的语言偏好。读者无需手动点击即可阅读对应版本。

缓存机制保障了翻译效率。插件通过内容哈希识别变更。只有在正文或标题变动时才会触发接口调用。这有效降低了 API 的使用成本。

多端同步支持远程数据库。通过 **Neon PostgreSQL**，不同设备间的构建缓存可以实时共享。（可选）

稳定性是插件设计的核心。内置限流器防止并发过高导致接口熔断。自动重试机制能有效应对网络波动。

SEO 优化确保了搜索权重的留存。翻译后的内容直接注入 HTML 结构。搜索引擎可以完整抓取双语信息。Hexo 特有的标签也得到了妥善保护，避免了页面结构的破坏。

对于不想被翻译的文章，可以通过 Front-matter 设置 `no_translate: true` 来排除在外。

## 快速上手

### 安装插件

在 Hexo 根目录下执行安装指令：

```bash
npm install hexo-translate-llm
```

### 配置参数

在 `_config.yml` 中加入以下配置。建议选用性价比更高的模型：

```yaml
llm_translation:
  enable: true
  model: deepseek-ai/DeepSeek-V3.2
  endpoint: https://api.siliconflow.cn/v1/chat/completions
  max_concurrency: 4
  single_timeout: 120
```

{% note info %}
如果不想使用远程数据库，可以跳过 Neon PostgreSQL 的配置步骤。插件会自动使用本地缓存。
{% endnote %}

### 安全设置

本项目通过环境变量管理敏感信息。

#### Vercel 部署
在 Vercel 仪表盘的项目设置中，添加 `LLM_API_KEY` 环境变量。
设置 Storage 连接，连接到 Neon PostgreSQL 数据库。Vercel 会自动注入 `DATABASE_URL` 环境变量。

#### 本地构建

在根目录创建 `.env` 文件：
```env
LLM_API_KEY=您的密钥
DATABASE_URL=数据库连接地址
```

## 使用技巧

特定文章可以排除在翻译范围之外。只需在 Front-matter 中设置 `no_translate: true`。插件会自动同步页面的 `title` 标签，确保浏览器标签页的语言一致性。

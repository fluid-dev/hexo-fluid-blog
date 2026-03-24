---
title: Github Total Github数据统计工具
author: Qiufeng
date: 2026-03-24 18:00:00
category: 编程工具
tags:
  - github
  - 统计
  - 报告
  - excel
  - 命令行
  - 分析
  - github-api
  - 仓库
  - 洞察
  - 开发者工具
  - 生产力
excerpt: 生成包含多维分析的个人 GitHub 统计报告。
---

[GitHub](https://github.com/qiufengcute/GithubTotal)

[PyPI](https://pypi.org/project/GithubTotal/)

## Features

- 📊 Generate Excel report with 3 sheets:
  - **Repository Data**: All repos with metadata (creation date, update date, language, stars, etc.)
  - **Statistics**: Summary stats (active repos by period, top language, star leaders, etc.)
  - **User Info**: Basic profile info
- 🚀 One command, no config needed
- 📈 Auto-categorize repos by creation/update time (New(This month)/Mid(This year)/Old(Before this year))
- ⭐ Track your stars (including self-stars)

## Installation

```bash
pip install GithubTotal
```

## Usage

```bash
ght <username> -o <output.xlsx>
```

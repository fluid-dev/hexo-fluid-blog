---
title: AppDataManager 应用数据管理库
author: Qiufeng
date: 2026-03-24 18:00:00
category: 编程工具
tags:
  - 应用程序
  - 数据
  - 存储
  - 配置
  - 本地数据
  - 应用数据
  - 持久性
  - 设置
excerpt: 零配置用户数据管理器 - 像管理字典一样管理应用程序数据，自动保存到系统用户目录。
---

[GitHub](https://github.com/qiufengcute/AppDataManager)

[PyPI](https://pypi.org/project/AppDataManager/)

## Features

- 🚀 **Zero dependencies** - Only Python standard library
- 📁 **Automatic paths** - Auto-saved to system user directory
- 🐍 **Pythonic** - Dict-like and attribute-like access
- 🔒 **Namespace isolation** - Multiple apps don't interfere
- ✨ **Simple & intuitive** - No configuration needed

## Installation

```bash
pip install AppDataManager
```

## Quick Start

```python
from AppDataManager import AppDataManager

# Create manager
dm = AppDataManager("myapp")

# Dict-style access
dm["config.json"] = '{"theme": "dark"}'
print(dm["config.json"])

# Attribute-style access
dm.setting = "enabled"
print(dm.setting)

# Iterate all data
for key in dm:
    print(f"{key}: {dm[key]}")

# Check existence
if "config.json" in dm:
    print("Config exists")

# Delete
del dm.setting

# Count
print(f"Total: {len(dm)} files")
```

## Storage Locations

- **Windows**: `%LOCALAPPDATA%\<namespace>`
- **macOS**: `~/Library/Application Support/<namespace>`
- **Linux**: `~/.local/share/<namespace>`

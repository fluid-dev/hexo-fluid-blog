---
title: Fluid VSCode Extension 插件/擴展
author: Simon Lai
date: 2024-07-30 14:00:57
index_img: https://shih-che-lai-simon.gallerycdn.vsassets.io/extensions/shih-che-lai-simon/hexo-snippet-paste-tool-for-fluid/2.0.0/1710780355692/Microsoft.VisualStudio.Services.Icons.Default
category: 功能增强
tags:
  - 插件
  - 擴展
  - Hexo
  - Fluid
excerpt: 專為Fluid開發的VSCode的插件/擴展，裡面集合了所有常用的語句，讓寫文章的過程更加流暢
---

{% note success %}
本文由 Fluid 用户授權轉載，版權歸原作者所有。

本文作者：[Simon Lai](https://f88083.github.io/)
原文地址：<https://f88083.github.io/2024/07/30/Fluid-VSCode-Extension-%E4%B8%80%E6%AC%BE%E7%82%BAHexo%E6%A1%86%E6%9E%B6Fluid%E4%B8%BB%E9%A1%8C%E6%89%93%E9%80%A0%E7%9A%84%E6%93%B4%E5%B1%95/>
{% endnote %}

## 介紹

這個擴展是為使用`Fluid`主題的`Hexo`用戶量身定製的，提供自動語句片段貼上功能

## 功能

透過輸入和選擇命令來貼上語句

## 使用方法

1. 從[market](https://marketplace.visualstudio.com/items?itemName=Shih-Che-Lai-Simon.hexo-snippet-paste-tool-for-fluid)安裝，或是`vscode`裡面直接搜尋`Hexo Snippet Paste Tool for Fluid`安裝
![Market](https://i.imgur.com/PEzdmlE.png)
1. `F1`打開命令面板
![Command palette](https://github.com/f88083/hexo-snippet-paste-tool-for-fluid/raw/HEAD/img/f1.png)
1. 輸入`Fluid Paste Tool`，基本上不需要全部輸入就會顯示這個擴展的命令，輸入幾個字符後應該會看到如下所示的命令列表
![Commands](https://github.com/f88083/hexo-snippet-paste-tool-for-fluid/raw/HEAD/img/commands.png)
1. 所有可用命令如下所列（大多數片段可以在[Fluid文件](https://hexo.fluid-dev.com/docs/en/guide/)中找到），詳細命令信息可以在我的[筆記](https://hackmd.io/@simonlai23/HJGxJqQCp)中找到
    * Paste Youtube Embed Code
    * Paste Fold Block
    * Paste Note
    * Paste Label
    * Paste CheckBox
    * Paste Button
    * Paste GroupImages
    * Paste Mermaid
1. 選擇其中之一自動貼到編輯器（某些命令可能需要輸入標題或類型等來自定義片段），下圖為執行了`Paste Note`的畫面
![Customize command](https://github.com/f88083/hexo-snippet-paste-tool-for-fluid/raw/HEAD/img/paste-note.png)
1. 按 Enter 鍵貼上`note`
![Snippet pasted](https://github.com/f88083/hexo-snippet-paste-tool-for-fluid/raw/HEAD/img/pasted-note.png)

## 已知問題

其實也不知道這個算不算問題，不過沒有那麼直覺就是了，所以放在這邊

* 某些語句例如`button`可以輸入文字，而`button`命令會用空格來區分`url`, `text`, 以及`title`。這時如果輸入的文字是一句話，其中有空格，擴展就會把文字當作是`title`。同樣的情況也適用於其他用空格區分的命令

## 相關連結

* [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=Shih-Che-Lai-Simon.hexo-snippet-paste-tool-for-fluid)
* [GitHub Repo](https://github.com/f88083/hexo-snippet-paste-tool-for-fluid)
* [本擴展命令詳細使用方式](https://hackmd.io/@simonlai23/HJGxJqQCp)

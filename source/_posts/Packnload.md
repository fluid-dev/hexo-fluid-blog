Github:

[GitHub - qiufengcute/Packnload: 一款轻量级、高效的 Minecraft Mod 批量下载工具](https://github.com/qiufengcute/Packnload/)

```json
{
    "name":"模组包名",
    "author":"作者名",
    "version":"版本号",
    "mod_list":[
        "mod列表"
    ]
}
```

mod列表(mod_list)注:  
一行一个(开头和结尾要双引号且如果下行还有结尾需要逗号)

是modrinth的模组slug

比如Sodium的URL是[https://modrinth.com/mod/sodium](https://modrinth.com/mod/sodium)

就是跟在"/mod/"后面的那串(sodium)

但是如果结尾有/要去掉

比如URL为[https://modrinth.com/mod/sodium/](https://modrinth.com/mod/sodium/),那么结果不是sodium/

要把结尾的/去掉,所以结果应该是sodium


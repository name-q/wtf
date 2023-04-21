# WTF

生成React Taro basecode(页面/组件)  
您只需要根据指引输入名称即可生成基于你定制的页面或组件
同时将生成对应页面的路由

## 定制basecode -运行前配置一
WTF会将下列文件夹作为页面basecode  
./config/wtfdata/index 
```sh
WTF会将文件中的PAGENAME替换成你输入的页面名称 + 路由后缀 

如需定制包含PAGENAME的路径请补丁修改dist/cjs/index.js中的fileTarget值  
```

WTF会将下列两个文件作为组件 basecode 
./config/wtfdata/index/components/Test.tsx  
./config/wtfdata/index/components/Test.less  
```sh
WTF会将文件中的Test替换成你输入的组件名称
```
  
## 配置路由 -运行前配置二
WTF会在 app.config中  
// ###buoy pages###  
// ###buoy pages/package-A###  
// ###buoy pages/package-B###  
...  
// ###buoy pages/package-Z###    
这些标定的上方增加对应的路由  
```sh
WTF会将文件中的Test替换成你输入的组件名称
```

## 参考配置
[点击这里](https://github.com/name-q/wtf-config)

## 运行wtf

```bash
#你可以将此命令融合到package.json的scripts中
$ npx wtf-basecode
```

## LICENSE

MIT

# nativejs API

## 当前版本 v0.0.1

nativejs 用于快速构建 移动端webapp。借助路由切换以及数据绑定，高效完成项目构建和开发

## Demo 地址
[http://demo.nativejs.webzeal.cn/](http://demo.nativejs.webzeal.cn/)

## 文档地址
[https://shuangren1.gitbooks.io/nativejs-doc/content/](https://shuangren1.gitbooks.io/nativejs-doc/content/)

## 需要改进的地方
1. setter 的时候 需要区分 是否是需要 dom diff 的 data 属性 ，非 dom diff 的属性不需要 notfiy
2. dom diff 做成定时开启队列 而非每次 setter 触发 都开始 diff 并更新视图
3. 增加多级路由的配置以及更加丰富的路由功能
4. 增加多级字模板的嵌套
5. 优化dom diff
6. 重写 模板引擎
7. 重写 native-loader 使其更加强大

## 会加入的功能
1. 一个常用的函数库，其实以及在源码中，但是并没有注入给模块使用
2. 一个常用的包含loading  以及 alert 的 ui库和对应的调用方法
3. 一套组件库，比如 <code>native-radio</code> 则会自动生成 一组 radio 按钮
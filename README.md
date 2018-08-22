## SSR demo
* 使用vue实现的服务端渲染的demo，对vue官方尤大写的一个例子的简化，取材于[HackerNews](https://cn.vuejs.org/v2/examples/hackernews.html)
* 如果你想看vuesrr的文档可以点击下面这个链接 [官方文档](https://ssr.vuejs.org/zh/#%E4%BB%80%E4%B9%88%E6%98%AF%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E6%B8%B2%E6%9F%93-ssr-%EF%BC%9F)
* 该demo只用于理解 
 
## 为什么Vue可以SSR？
* 虚拟 DOM 的存在 通俗地讲就是映射dom节点的 对象   
* Vue2实现了虚拟 DOM，不在如Vue1一样直接处理html的dom构建响应式绑定
* Vue2分离了dom 不依赖dom 不再耦合，所以Vue1是不能SSR的😄
这就意味着在任何地方任何语言只要可以构造出虚拟 DOM结构的对象，那就能够渲染出html字符串，这期间是不依赖dom的
* 这使得服务端去通过虚拟 DOM树渲染出html字符串成为可能，
很显然nodejs有着近乎相似的语法能够直接执行js的对象，
所以在服务器端语言使用nodejs是比较好的选择了
(当然其他语言只要实现虚拟 DOM树转化也是可以的)

## 文件目录
首先先了解一下项目结构吧

```

├── README.md
├── build
│   ├── setup-dev-server.js /**用于热更新的配置项**/
│   ├── utils.js /**wepback配置的工具箱**/
│   ├── vue-loader.conf.js /**vue-loader的配置**/
│   ├── webpack.base.config.js /**基础webpack配置**/
│   ├── webpack.client.config.js /**打包客户端代码的配置**/
│   └── webpack.server.config.js /**打包服务端代码的配置**?
├── package-lock.json
├── package.json
├── server
│   ├── app.js /**服务端启动入口文件**/
│   └── routers.js /**api文件，用于mock数据使用**/
└── src
    ├── App.vue 
    ├── api
    │   └── index.js /**请求接口**/
    ├── app
    │   └── index.js /**产生vue实例的入口**/
    ├── components /**vue组件库**/
    ├── entry-client.js /**前端使用的入口文件**/
    ├── entry-server.js /**服务端使用的入口文件**/
    ├── index.template.html /**html模版**/
    ├── plugins 
    ├── router
    │   └── index.js /**路由**/
    ├── store
    │   ├── actions.js 
    │   ├── index.js
    │   ├── mutations.js
    │   └── state.js
    ├── util
    └── views /**页面**/
        ├── about.vue
        ├── home.vue
        └── subAbout.vue
```      
  
## 实现一个SSR
* VUESSR的实现，将一套代码分别打包给服务端、客户端使用，服务端的入口文件来自于entry-server.js
客户端的入口文件来自于entry-client.js。
* 服务端运行服务端的代码将通过对vue组件的解析，数据注入从而渲染出html字符串(服务端目的只要html字符串，方便理解不用去管其他花里胡哨的东西，只要记住**服务端最终只是要html字符串**，具体细节可见下面的Vue的SSR的大致流程)；
* 而客户端运行打包的客户端代码
(方便理解客户端**对服务端返回html字符串和通过自己组件上template或者render构建虚拟dom进行匹配比较再融合让页面从静态的html变成了由vue接管的可响应html**，然后就正常做vue做的事情吧，具体细节可见下面的Vue的SSR的大致流程)；

## 快速开始
```
npm run dev 启动wepack服务器，用于本地测试
npm run build 打包代码
npm start 开发环境下启动项目 *在启动该命令前，需要先npm run build打包代码
```

## Vue的SSR和传统SSR(以下把传统服务端渲染统称为传统SSR)的区别在哪？

相似的都是在服务端就完成了数据填入模板最后返回html

### 传统SSR
每次切换页面都会像服务器获取对应路由的渲染模板

### VueSSR
只在第一次(这里的第一次指的是直接手动输入url到浏览器来访问页面)
去向服务器请求模版页面
后续由于history模式的存在，就不再向服务端请求模板了，不完全正确的讲后续
的通过内部路由( vue-router )切换页面已经和普通的前后端分离无异了(小蜘蛛不管你什么history，对他来说每一次都是第一次😁，所以虽然后续不再请求模板渲染，但还是seo友好的)

## Vue的SSR的大致流程

### 服务端
  这里用到了服务端渲染器插件  vue-server-render

1. 通过url匹配出对应的路由组件 
2. 调用挂在该组件的自定义函数(自己实现一个函数函数名就叫做asyncData, 以下统称为asyncData函数用于获取数据，之后注入到vuex的state) 
3. 通过 vue-server-render渲染该组件返回html字符串
4. 构建html( Js / css这些资源文件,将state的数据序列化后暴露给window.__INITIAL_STATE__,以上使用 vue-server-render可配置自动实现)
5. 返回html给客户端

### 客户端
1. 替换 store 的根状态为 window.__INITIAL_STATE__的反序列化数据(客户端的state来自于此) 
2. 在路由完成初始导航时( router.onReady ) 挂载元素(app.$mount(el)) 
3. 客户端激活(已存在的html dom结构和组件生成的虚拟 DOM 树做比较，生成最终可响应Html表现给客户端(流程 —> vue生命周期 ) )
4. 完成渲染

## 有关客户端的细节
1. 客户端在后续切换路由的数据都可以用asyncData去获取，并修改state状态
2. 事实上如’ Vue的SSR和传统SSR的区别在哪？’所述，服务端只在第一次向服务器请求模板页面, 后续都是纯客户端了，但还是seo友好的
3. 在onReady后面注册beforeResolve守卫(该守卫大致就是会在异步组件完全请求完，但路由还没有被确定，组件还没有变成实例的时候调用) 首次向服务器请求模板页面的时候就不必再次获取服务器提取的数据
4. beforeResolve守卫之后只对非预渲染的组件进行asyncData调用，可以通过对比(form，to)匹配的组件列表 找出两个匹配列表的差异组件

## 代码编写规范

1. 对于每个客户端来说它是单独的个体，而对于服务器来说它要处理每一个客户端所以当编写服务器的bundlejs代码的时候，应该避免编写单例的代码，不然会发生状态混乱的情况，尽量使用工厂函数向外暴露实例，比如你不该直接import一个vue的实例，而是引入工厂函数来重新产生一个vue实例[具体] (https://ssr.vuejs.org/zh/guide/structure.html#%E9%81%BF%E5%85%8D%E7%8A%B6%E6%80%81%E5%8D%95%E4%BE%8B))
2. [编写通用代码] (https://ssr.vuejs.org/zh/guide/universal.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84%E6%95%B0%E6%8D%AE%E5%93%8D%E5%BA%94)

## 不足点
1. 由于代码中有使用工厂模式产生的实例，所以这意味着可能没有办法在任何地方直接import vue/router等实例
2. 由于是通过匹配获取当前路由的组件，所以这意味着不在该路由的组件没办法调用到asyncData函数导致有些地方如果要使用asyncData获取数据会失效，(当然可以自己处理下)
3. 动态注册store模块的问题，根据上面所述，第一次进入页面的时候客户端不回去执行asyncData(asyncData只在服务端执行)，所以如果把动态注册模块写在asyncData并不触发注册，，所以会导致本地报错，找不到这个动态模块

## 好用的VUE SSR脚手架
### [nuxt](https://nuxtjs.org/)











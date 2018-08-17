// 客户端入口文件
import createApp from './app';
const { app, router, store } = createApp()

// 如果存在__INITIAL_STATE__状态，替换 store 的根状态
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
// 初次路由加载完毕后
router.onReady(() => {
  // 在异步组件resolve之后完成
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    // 比如跳转发生在 同一个路由a下的两个不同的子路由这种情况，，那我们就没有必要再去对路由a进行数据获取了
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    // 获取数据
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
      .then(() => {
        next()
      })
      .catch(next)
  })
  app.$mount('#app')
})

<template lang="pug">
  div#app.app 
    ul.tabs
      li.tab( :class="{'tab--active': $route.name === 'home'}") 
        router-link( :to="{ name: 'home' }" ) 首页
      li.tab( :class="{'tab--active': $route.name === 'about' || $route.name === 'sub_about'}")  
        router-link( :to="{ name: 'about' }" ) 关于
    router-view   
</template>
<script>
export default {
  
}
</script>
<style lang="stylus" scoped>
.app 
  text-align center
.tabs, .tab 
  list-style none 
  padding 0
  margin: 0  
.tabs 
  margin: 10px auto
  .tab 
    padding 12px 22px 
    border-radius 4px 4px 0 0
    display inline-block
    &.tab--active
      background-color: #eceef1
      color: #fff


</style>

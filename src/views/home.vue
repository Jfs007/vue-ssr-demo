<template lang="pug">
  div.about 
    div.about__title {{home.title}}
    div.about__content
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'home',
  asyncData({store}) {
    return store.dispatch('getHome')
  },
  computed: {
    ...mapState(['home'])
  }
}
</script>
<style lang="stylus" scoped>

</style>
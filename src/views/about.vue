<template lang="pug">
  div.about 
    div.about__title {{about.title}}
    div.about__content
    router-view
</template>
<script>
import { mapState } from 'vuex'
import about from '@/store/about/index'
export default {
  name: 'about',
  asyncData({store}) {
    store.registerModule(about.moduleName, about)
    return store.dispatch('about/getAbout')
  },
  computed: {
    ...mapState(['about'])
  },
  mounted() {
    this.$store.dispatch('about/testApi')
  }
}
</script>
<style lang="stylus" scoped>

</style>



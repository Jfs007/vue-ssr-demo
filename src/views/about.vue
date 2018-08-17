<template lang="pug">
  div.about 
    div.about__title {{about.title}}
    div.about__content
    router-view
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'about',
  asyncData({store}) {
    return store.dispatch('getAbout')
  },
  computed: {
    ...mapState(['about'])
  }
}
</script>
<style lang="stylus" scoped>

</style>



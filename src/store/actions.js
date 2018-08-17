import { getHomeData, getAboutData } from '@/api'

export default {
  getHome({commit}) {
    return getHomeData().then(res => {
      commit('setHome', res.data)
    })
  },
  getAbout({commit}) {
    return getAboutData().then(res => {
      commit('setAbout', res.data)
    })
  }
}
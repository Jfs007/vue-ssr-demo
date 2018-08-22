import { getAboutData } from '@/api'
export default {
  getAbout({ commit }) {
    return getAboutData().then(res => {
      commit('setAbout', res.data)
    })
  },
  testApi({commit}) {
    console.log('test success')
  }
}
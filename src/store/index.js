import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import actions from './actions'
import mutations from './mutations';
import state from './state'
export default function createStore() {
  const store = new Vuex.Store({
    state,
    actions,
    mutations
  });
  return store;
}
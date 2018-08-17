import axios from 'axios';

const API = 'http://localhost:8083/api';
export function getHomeData() {
  return axios.get( API+'/home')
}

export function getAboutData() {
  return axios.get(API + '/about')
}
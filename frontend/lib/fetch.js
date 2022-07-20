import axios from 'axios';
import config from '../config/default.json';

axios.defaults.baseURL=config['api_basepath'];

console.log(config['api_basepath']);

const get = (url, config)=>{
  return axios.get(url, config);
}

const post = (url, data, config)=>{
  return axios.post(url, data, config);
}

export { get, post };
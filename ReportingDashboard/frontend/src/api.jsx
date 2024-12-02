import axios from 'axios';

const api = axios.create({
  baseURL: 'http://staging.optimaldevelopments.com', 
});

export default api;

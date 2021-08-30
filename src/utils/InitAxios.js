import axios from 'axios';
import axiosRetry from 'axios-retry';
import config from 'config';

export default function initAxios() {
  axios.defaults.baseURL = config.SUBSCAN_URL;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = true;
  axios.defaults.headers.post['X-API-Key'] = config.SUBSCAN_API_KEY;
  axiosRetry(axios, { retries: 10, retryDelay: () => 600, retryCondition: error => error.response.status === 429 });
}

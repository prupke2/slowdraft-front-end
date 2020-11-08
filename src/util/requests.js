import axios from 'axios';
import config from './config';

export const getToken = async (token) => axios({
  method: 'GET',
  baseURL: config.yahooTokenUrl,
  url: '',
  headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': 'Basic ' + token,
	}	
})

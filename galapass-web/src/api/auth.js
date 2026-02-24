import axios from 'axios';
import {BASE_URL} from '../config.js';


export const login = async (credentials) => {
  return axios.post(`${BASE_URL}/login`, credentials);
};

export const register = async (data) => {
  return axios.post(`${BASE_URL}/register`, data);
};

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const login = async (credentials) => {
  return axios.post(`${API_URL}/login`, credentials);
};

export const register = async (data) => {
  return axios.post(`${API_URL}/register`, data);
};

import axios from 'axios';
import { BACKEND_URL } from './environment';

const clientAxios = axios.create({
  baseURL: BACKEND_URL,
});

export default clientAxios;

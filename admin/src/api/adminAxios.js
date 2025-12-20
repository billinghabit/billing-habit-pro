import axios from 'axios';

const adminAxios = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true, // Crucial for cookies
});

export default adminAxios;
import axios from 'axios';

const baseURL = import.meta.env.PROD 
    ? 'https://chatapp-ktcw.onrender.com' 
    : 'http://localhost:5002';

const api = axios.create({
    baseURL,
    withCredentials: true
});

export default api; 
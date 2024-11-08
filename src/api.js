import axios from 'axios';

const API_URL = 'http://localhost:9000';

// Tạo instance của axios với URL cơ bản
export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Để axios gửi cookie của session
});

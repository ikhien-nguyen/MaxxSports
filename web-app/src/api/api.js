import axios from 'axios';

// 1. Cấu hình đường dẫn gốc (Tự động lấy từ file .env nếu có, nếu không sẽ dùng localhost làm dự phòng)
const API_BASE_URL = import.meta.env.BASE_URL || 'http://localhost:8080/xsports/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 giây không phản hồi sẽ tự ngắt tránh treo app
});

// 2. Tự động đính kèm JWT Token vào Header trước khi request bay đi
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Xử lý lỗi tập trung từ Backend trả về
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Trường hợp token hết hạn hoặc không hợp lệ -> đá về trang đăng nhập
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            // Kiểm tra tránh việc lặp vô hạn nếu đang ở chính trang login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        // Tối ưu hóa việc bóc tách thông điệp lỗi từ Spring Boot trả về
        let errorMessage = 'Có lỗi hệ thống xảy ra';
        if (error.response && error.response.data) {
            // Nếu Backend trả về dạng Object chứa trường message, hoặc trả về chuỗi String thuần
            errorMessage = error.response.data.message || (typeof error.response.data === 'string' ? error.response.data : errorMessage);
        }

        return Promise.reject(errorMessage);
    }
);

export default api;
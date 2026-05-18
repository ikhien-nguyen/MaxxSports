import axios from 'axios';

// 1. Cấu hình đường dẫn gốc (Bốc chuẩn từ file .env hoặc dùng dự phòng mặc định)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/xsports/api';

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
        // Trường hợp token hết hạn hoặc không hợp lệ (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Lấy ra URL của API vừa gọi bị dính lỗi
            const requestUrl = error.config?.url || '';

            // Đăng nhập lại nếu lỗi 401 này KHÔNG PHẢI xuất phát từ API đăng nhập
            if (!requestUrl.includes('/auth/login')) {
                localStorage.removeItem('token');
                localStorage.removeItem('xsport_user'); // Xóa  session user cũ

                if (!window.location.pathname.includes('/auth')) {
                    window.location.href = '/auth';
                }
            }
        }

        // Tối ưu hóa việc bóc tách thông điệp lỗi từ Spring Boot trả về
        let errorMessage = 'Có lỗi hệ thống xảy ra';
        if (error.response && error.response.data) {
            // Nếu Backend trả về dạng Object chứa trường message (ApiResponse), hoặc chuỗi String thuần
            errorMessage = error.response.data.message || (typeof error.response.data === 'string' ? error.response.data : errorMessage);
        }

        return Promise.reject(errorMessage);
    }
);

export default api;
import api from '../api/api';

export const authService = {

    /**
     * 1. API Đăng ký tài khoản mới
     * @param {Object} registerRequest - Chứa { email, password, name, phone, address... }
     */
    register: async (registerRequest) => {
        // Vì Backend trả về cấu trúc ApiResponse.<RegisterResponse> có .result
        const response = await api.post('/auth/register', registerRequest);
        return response.data; // Trả về ApiResponse chứa code, message và result
    },

    /**
     * 2. API Đăng nhập hệ thống
     * @param {Object} loginRequest - Chứa { email, password }
     */
    login: async (loginRequest) => {
        const response = await api.post('/auth/login', loginRequest);

        // Nếu đăng nhập thành công và Backend trả về token trong mục .result
        if (response.data && response.data.result?.token) {
            // Lưu token vào localStorage để file api.js tự động bốc ra dùng cho các request sau
            localStorage.setItem('token', response.data.result.token);
        }

        return response.data; // Trả về để giao diện React xử lý tiếp (chuyển trang, thông báo...)
    },

    /**
     * 3. API Đổi mật khẩu
     * @param {Object} changePasswordRequest - Chứa { oldPassword, newPassword }
     */
    changePassword: async (changePasswordRequest) => {
        // Request này sẽ tự động được api.js đính kèm Token vào Header Authorization
        const response = await api.post('/auth/changePassword', changePasswordRequest);
        return response.data;
    },

    /**
     * 4. API Đăng xuất hệ thống
     */
    logout: async () => {
        try {
            // Gọi API logout ở Backend để đưa Token này vào danh sách đen (Blacklist)
            // Request này bắt buộc phải truyền Header Authorization lên, api.js đã lo việc đó
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Lỗi khi gọi API logout ở Backend:', error);
        } finally {
            // Bất kể Backend có lỗi hay không, Frontend vẫn phải xóa sạch dấu vết Token ở Local
            localStorage.removeItem('token');
            // Đá người dùng về trang đăng nhập
            window.location.href = '/login';
        }
    }
};
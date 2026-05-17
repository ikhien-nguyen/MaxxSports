import api from '../api/api';

export const userService = {

    // =====================================================================
    // LUỒNG USER/CLIENT (Khách hàng tự quản lý thông tin cá nhân)
    // =====================================================================

    /**
     * Cập nhật thông tin cá nhân của người dùng hiện tại (Họ tên, SĐT, Địa chỉ)
     * API này sử dụng SecurityContextHolder ở Backend để tự nhận diện Email qua Token nên không cần truyền ID.
     * @param {Object} updateUserRequest - Chứa { name, phone, address }
     */
    updateProfile: async (updateUserRequest) => {
        // Vì Backend bọc qua lớp vỏ ApiResponse nên trả về response.data (chứa .result bên trong)
        const response = await api.post('/user/update', updateUserRequest);
        return response.data;
    },

    /**
     * Lấy thông tin chi tiết của một tài khoản cụ thể dựa trên mã ID cá nhân
     * @param {string} id - Mã UUID của người dùng (Ví dụ lấy từ thông tin profile hoặc đơn hàng)
     */
    getUserById: async (id) => {
        const response = await api.get(`/user/getUser/${id}`);
        return response.data; // Trả về ApiResponse chứa thông tin UserResponse cụ thể ở mục .result
    },

    // =====================================================================
    // LUỒNG ADMIN (Quản trị viên quản lý danh sách thành viên MaxxSports)
    // =====================================================================

    /**
     * [Admin] Lấy toàn bộ danh sách tài khoản thành viên trong hệ thống
     * Yêu cầu tài khoản Token phải có quyền ADMIN nếu không api.js sẽ bắt lỗi 403 Forbidden
     */
    getAllUsersForAdmin: async () => {
        const response = await api.get('/user/getAllUsers');
        return response.data; // Trả về ApiResponse chứa List<UserResponse> trong mục .result
    },

    /**
     * [Admin] Thực hiện xóa một tài khoản thành viên dựa trên mã ID
     * @param {string} id - Mã UUID của tài khoản cần xóa
     */
    deleteUserByAdmin: async (id) => {
        // Vì endpoint ở Backend trả về kiểu void (không bọc ApiResponse)
        const response = await api.delete(`/user/deleteUser/${id}`);
        return response.data; // Trả về rỗng hoặc trạng thái HTTP 200 OK
    }
};
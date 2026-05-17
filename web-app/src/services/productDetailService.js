import api from '../api/api';

export const productDetailService = {

    // =====================================================================
    // LUỒNG ADMIN (Quản lý các biến thể chi tiết)
    // =====================================================================

    /**
     * Admin thêm một biến thể chi tiết sản phẩm mới (Mồi Size, Màu, Kho)
     * @param {Object} request - Chứa { productId, sizeId, mauId, soLuong, image }
     */
    createDetail: async (request) => {
        // Vì Backend bọc qua lớp vỏ ApiResponse nên bóc tách lấy .result
        const response = await api.post('/product-details', request);
        return response.data; // Trả về ApiResponse chứa .result nằm bên trong
    },

    /**
     * Admin cập nhật thông tin biến thể sản phẩm (Cập nhật số lượng kho hoặc ảnh)
     */
    updateDetail: async (id, request) => {
        const response = await api.put(`/product-details/${id}`, request);
        return response.data;
    },

    /**
     * Admin thực hiện xóa một chi tiết biến thể cụ thể
     */
    deleteDetail: async (id) => {
        const response = await api.delete(`/product-details/${id}`);
        return response.data; // Trả về ApiResponse chứa chuỗi "Xóa chi tiết sản phẩm thành công"
    },

    // =====================================================================
    // LUỒNG PUBLIC (Lấy thông tin độc lập của một cấu hình biến thể nếu cần)
    // =====================================================================

    /**
     * Xem thông tin độc lập của một mã cấu hình chi tiết sản phẩm cụ thể
     */
    getDetailById: async (id) => {
        const response = await api.get(`/product-details/${id}`);
        return response.data;
    }
};
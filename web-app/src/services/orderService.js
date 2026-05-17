import api from '../api/api';

export const orderService = {

    // =====================================================================
    // LUỒNG USER/CLIENT (Khách mua hàng thực hiện Đặt đơn & Xem lịch sử)
    // =====================================================================

    /**
     * 1. Tiến hành đặt hàng (Checkout) và tạo hóa đơn mới
     * @param {Object} checkoutRequest - Chứa cấu trúc:
     * {
     * detailAddress: "Số nhà, tên đường, Hà Nội...",
     * shippingMethod: "FAST" hoặc "STANDARD",
     * paymentMethod: "COD" hoặc "VNPAY",
     * items: [ { productDetailId: "uuid-chuỗi", quantity: 2 }, ... ]
     * }
     * @returns {Promise<Object>} Trả về ApiResponse chứa dữ liệu OrderResponse ở mục .result
     */
    checkout: async (checkoutRequest) => {
        // Vì Backend trả về dạng ApiResponse<OrderResponse>
        const response = await api.post('/order/checkout', checkoutRequest);
        return response.data;
    },

    /**
     * 2. Khách hàng xem lịch sử toàn bộ đơn hàng cá nhân đã đặt tại MaxxSports
     * @returns {Promise<Object>} Trả về ApiResponse chứa danh sách List<OrderResponse> ở mục .result
     */
    getMyOrders: async () => {
        const response = await api.get('/order/myOrders');
        return response.data;
    },

    // =====================================================================
    // LUỒNG ADMIN (Quản trị viên quản lý, duyệt đơn và thay đổi trạng thái)
    // =====================================================================

    /**
     * 3. [Admin] Lấy toàn bộ danh sách đơn đặt hàng của toàn bộ hệ thống MaxxSports
     * @returns {Promise<Object>} Trả về ApiResponse chứa List<OrderResponse> ở mục .result
     */
    getAllOrdersForAdmin: async () => {
        const response = await api.get('/order/getAllOrders');
        return response.data;
    },

    /**
     * 4. [Admin] Cập nhật trạng thái xử lý của đơn hàng (Ví dụ: Chuyển từ PENDING -> SHIPPING -> DELIVERED)
     * @param {Object} updateOrderRequest - Chứa cấu trúc { id: "mã-đơn-hàng", status: "SHIPPING" }
     * @returns {Promise<Object>} Trả về ApiResponse chứa chuỗi "Cập nhập đơn hàng thành công" ở mục .result
     */
    updateOrderStatusByAdmin: async (updateOrderRequest) => {
        const response = await api.put('/order/status', updateOrderRequest);
        return response.data;
    }
};
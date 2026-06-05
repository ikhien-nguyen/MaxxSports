import api from '../api/api';

export const cartService = {

    /**
     * 1. Thêm một sản phẩm (Biến thể Size/Màu) vào giỏ hàng
     * @param {Object} cartRequest - Cấu trúc đóng gói { maCtsp, soLuong }
     * @returns {Promise<string>} Chuỗi thông báo "Thêm sản phẩm vào giỏ hàng thành công!"
     */
    addToCart: async (cartRequest) => {
        // Backend trả về chuỗi String thuần túy từ ResponseEntity.ok()
        const response = await api.post('/cart/add', cartRequest);
        return response.data;
    },

    /**
     * 2. Lấy thông tin chi tiết toàn bộ giỏ hàng của người dùng hiện tại
     * @returns {Promise<Object>} Trả về đối tượng CartResponse gồm { maGioHang, soLuongTongGH, tongTien, items: [...] }
     */
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data;
    },

    /**
     * 3. Cập nhật số lượng của một dòng sản phẩm cụ thể trong giỏ hàng
     * @param {number|Long} cartItemId - ID của dòng chi tiết giỏ hàng (CartItem) cần sửa
     * @param {number} quantity - Số lượng mới muốn thay đổi
     * @returns {Promise<string>} Chuỗi thông báo "Cập nhật số lượng thành công!"
     */
    updateQuantity: async (cartItemId, quantity) => {
        // Backend nhận tham số qua @RequestParam nên truyền vào mục params của Axios
        const response = await api.put(`/cart/update/${cartItemId}`, null, {
            params: { quantity }
        });
        return response.data;
    },

    /**
     * 4. Xóa một dòng sản phẩm ra khỏi giỏ hàng
     * @param {number|Long} cartItemId - ID của dòng chi tiết giỏ hàng cần xóa
     * @returns {Promise<string>} Chuỗi thông báo "Đã xóa sản phẩm khỏi giỏ hàng!"
     */
    deleteItem: async (cartItemId) => {
        const response = await api.delete(`/cart/delete/${cartItemId}`);
        return response.data;
    }
};
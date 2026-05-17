import api from '../api/api';

export const imageService = {

    // =====================================================================
    // LUỒNG ADMIN (Thêm/Xóa ảnh biến thể sản phẩm trên Cloudinary)
    // =====================================================================

    /**
     * [Admin] Tải ảnh mới lên Cloudinary và liên kết với chi tiết sản phẩm cụ thể
     * @param {number|string} maCtsp - Mã chi tiết sản phẩm cần gắn ảnh
     * @param {File} file - Đối tượng File nhị phân lấy từ thẻ <input type="file" />
     */
    uploadImage: async (maCtsp, file) => {
        // 💡 BẮT BUỘC: Sử dụng FormData để đóng gói file nhị phân đẩy lên Backend
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`/images/upload/${maCtsp}`, formData, {
            headers: {
                // Ép kiểu trình duyệt tự động tính định dạng ranh giới file (boundary)
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Trả về đối tượng Images (chứa id, url, publicId) từ ResponseEntity.ok
    },

    /**
     * [Admin] Xóa ảnh ra khỏi database và đồng thời xóa file vật lý trên Cloudinary
     * @param {string} id - Mã UUID của bức ảnh cần xóa
     */
    deleteImage: async (id) => {
        const response = await api.delete(`/images/${id}`);
        return response.data; // Trả về chuỗi văn bản thuần "Xóa ảnh thành công"
    },

    // =====================================================================
    // LUỒNG PUBLIC / CLIENT (Hiển thị ảnh sản phẩm ra giao diện khách mua hàng)
    // =====================================================================

    /**
     * Lấy thông tin độc lập của một bức ảnh theo ID
     * @param {string} id - Mã UUID của bức ảnh
     */
    getImageById: async (id) => {
        const response = await api.get(`/images/${id}`);
        return response.data; // Trả về đối tượng Images
    },

    /**
     * Lấy toàn bộ danh sách hình ảnh đã tải lên của một biến thể chi tiết sản phẩm cụ thể
     * Phục vụ đắc lực cho khung hiển thị Slide/Gallery ảnh khi người dùng bấm xem chi tiết mẫu giày/áo
     * @param {number|string} maCtsp - Mã chi tiết sản phẩm
     */
    getImagesByProductDetail: async (maCtsp) => {
        const response = await api.get(`/images/product-detail/${maCtsp}`);
        return response.data; // Trả về danh sách List<Images>
    }
};
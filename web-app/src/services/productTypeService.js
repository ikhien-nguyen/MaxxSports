import api from '../api/api';

export const productTypeService = {
    // 1. Lấy toàn bộ danh sách loại sản phẩm (GET)
    getAllProductTypes: async () => {
        try {
            const response = await api.get('/api/v1/product-types');
            return response.data?.result || response.data || [];
        } catch (error) {
            console.error("Lỗi khi tải danh sách loại sản phẩm:", error);
            return [];
        }
    },

    // 2. Lấy loại sản phẩm theo ID (GET)
    getProductTypeById: async (id) => {
        try {
            const response = await api.get(`/api/v1/product-types/${id}`);
            return response.data?.result || response.data;
        } catch (error) {
            console.error(`Lỗi khi tải thông tin loại sản phẩm ${id}:`, error);
            throw error;
        }
    },

    // 3. Thêm mới loại sản phẩm (POST)
    createProductType: async (productTypeData) => {
        try {
            const response = await api.post('/api/v1/product-types/create', productTypeData);
            return response.data?.result || response.data;
        } catch (error) {
            console.error("Lỗi khi tạo loại sản phẩm mới:", error);
            throw error;
        }
    },

    // 4. Cập nhật loại sản phẩm (PUT)
    updateProductType: async (id, productTypeData) => {
        try {
            const response = await api.put(`/api/v1/product-types/update/${id}`, productTypeData);
            return response.data?.result || response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật loại sản phẩm ${id}:`, error);
            throw error;
        }
    },

    // 5. Xóa loại sản phẩm
    deleteProductType: async (id) => {
        try {
            const response = await api.delete(`/api/v1/product-types/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi xóa loại sản phẩm ${id}:`, error);
            throw error;
        }
    }
};
import api from '../api/api';

export const categoryService = {
    // 1. Lấy toàn bộ danh mục từ Backend (GET)
    getAllCategories: async () => {
        try {
            const response = await api.get('/api/v1/categories');
            return response.data?.result || response.data || [];
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
            return [];
        }
    },

    // 2. Lấy danh mục theo ID (GET)
    getCategoryById: async (id) => {
        try {
            const response = await api.get(`/api/v1/categories/${id}`);
            return response.data?.result || response.data;
        } catch (error) {
            console.error(`Lỗi khi tải danh mục ${id}:`, error);
            throw error;
        }
    },

    // 3. Tạo danh mục mới (POST)
    createCategory: async (categoryData) => {
        try {
            const response = await api.post('/api/v1/categories/create', categoryData);
            return response.data?.result || response.data;
        } catch (error) {
            console.error("Lỗi khi tạo danh mục:", error);
            throw error;
        }
    },

    // 4. Cập nhật danh mục (PUT)
    updateCategory: async (id, categoryData) => {
        try {
            const response = await api.put(`/api/v1/categories/update/${id}`, categoryData);
            return response.data?.result || response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật danh mục ${id}:`, error);
            throw error;
        }
    },

    // 5. Xóa danh mục (POST - Theo đúng thiết kế bảo mật của backend)
    deleteCategory: async (id) => {
        try {
            const response = await api.post(`/api/v1/categories/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi xóa danh mục ${id}:`, error);
            throw error;
        }
    }
};
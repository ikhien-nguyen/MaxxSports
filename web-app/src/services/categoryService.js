import api from '../api/api';

export const categoryService = {
    // Lấy toàn bộ danh mục từ Backend
    getAllCategories: async () => {
        try {
            const response = await api.get('/api/v1/categories');

            return response.data?.result || response.data || [];
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
            return [];
        }
    }
};
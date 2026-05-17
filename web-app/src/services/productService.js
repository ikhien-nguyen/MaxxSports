import api from '../api/api';

export const productService = {

  // =====================================================================
  // LUỒNG PUBLIC / CLIENT (Khách hàng xem và mua sắm)
  // =====================================================================

  /**
   * Lấy toàn bộ danh sách sản phẩm trong hệ thống
   */
  getAllProducts: async () => {
    const response = await api.get('/products/getAllProducts');
    return response.data; // Trả về trực tiếp List<ProductResponse>
  },

  /**
   * Tìm kiếm sản phẩm theo từ khóa (Keyword)
   */
  searchProducts: async (keyword) => {
    const response = await api.get('/products/search', {
      params: { keyword }
    });
    return response.data;
  },

  /**
   * Lọc sản phẩm theo Loại sản phẩm (Category / Danh mục)
   */
  filterByCategory: async (loaiSanPham) => {
    const response = await api.get('/products/category', {
      params: { loaiSanPham }
    });
    return response.data;
  },

  /**
   * Lọc sản phẩm theo Thương hiệu (Brand)
   */
  filterByBrand: async (thuongHieu) => {
    const response = await api.get('/products/brand', {
      params: { thuongHieu }
    });
    return response.data;
  },

  /**
   * Sắp xếp sản phẩm theo Giá cả trong một Danh mục nhất định
   * @param {string} loaiSanPham - Tên danh mục cần lọc để xếp giá
   * @param {string} direction - Hướng sắp xếp: 'asc' (thấp đến cao) hoặc 'desc' (cao đến thấp)
   */
  sortByPrice: async (loaiSanPham, direction = 'asc') => {
    const response = await api.get('/products/sort', {
      params: { loaiSanPham, direction }
    });
    return response.data;
  },

  /**
   * Lấy thông tin chi tiết của một sản phẩm cha kèm mảng chi tiết (Size, Màu, Kho) bên trong
   */
  getProductById: async (id) => {
    const response = await api.get(`/products/getProduct/${id}`);
    return response.data; // Trả về đối tượng ProductResponse
  },

  // =====================================================================
  // LUỒNG ADMIN (Yêu cầu tài khoản có quyền ADMIN)
  // =====================================================================

  /**
   * Admin tạo sản phẩm mới
   * @param {Object} productRequest - Chứa { tenSanPham, moTa, thuongHieu, chatLieu, loaiSanPham, gia }
   */
  createProduct: async (productRequest) => {
    const response = await api.post('/products/create', productRequest);
    return response.data;
  },

  /**
   * Admin cập nhật thông tin sản phẩm cha dựa trên mã ID
   */
  updateProduct: async (id, productRequest) => {
    const response = await api.put(`/products/updateProduct/${id}`, productRequest);
    return response.data;
  },

  /**
   * Admin thực hiện xóa sản phẩm khỏi hệ thống
   */
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/deleteProduct/${id}`);
    return response.data;
  }
};
import React, { useState, useEffect } from 'react';
import './AdminProducts.css';

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const defaultProducts = [
  {
    id: 'p1',
    name: 'Giày Chạy Bộ Nam',
    category: 'giay-nam',
    price: '1500000',
    stock: 24,
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 'p2',
    name: 'Áo Thể Thao Cao Cấp',
    category: 'ao-the-thao',
    price: '500000',
    stock: 15,
    image: 'https://via.placeholder.com/150'
  }
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: ''
  });
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadData = () => {
    // Load products
    const storedProducts = localStorage.getItem('xsport_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(defaultProducts);
      localStorage.setItem('xsport_products', JSON.stringify(defaultProducts));
    }

    // Load categories for dropdown
    const storedCats = localStorage.getItem('xsport_categories');
    if (storedCats) {
      setCategories(JSON.parse(storedCats));
    } else {
      setCategories([
        { id: '1', name: 'Giày Nam', slug: 'giay-nam' },
        { id: '2', name: 'Áo Thể Thao', slug: 'ao-the-thao' }
      ]);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('xsportDataUpdated', loadData);
    return () => window.removeEventListener('xsportDataUpdated', loadData);
  }, []);

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('vi-VN') + 'đ';
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        image: product.image || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: categories.length > 0 ? categories[0].slug : '',
        price: '',
        stock: '',
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Vui lòng nhập tên và giá sản phẩm.');
      return;
    }

    let updatedProducts;

    if (editingProduct) {
      updatedProducts = products.map(p => {
        if (p.id === editingProduct.id) {
          return { ...p, ...formData };
        }
        return p;
      });
    } else {
      const newProduct = {
        id: 'prod_' + Date.now(),
        ...formData
      };
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    localStorage.setItem('xsport_products', JSON.stringify(updatedProducts));
    window.dispatchEvent(new Event('xsportDataUpdated'));
    showToast(editingProduct ? '✅ Cập nhật sản phẩm thành công!' : '✅ Thêm sản phẩm mới thành công!');
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem('xsport_products', JSON.stringify(updatedProducts));
      window.dispatchEvent(new Event('xsportDataUpdated'));
      showToast('✅ Đã xóa sản phẩm thành công!');
    }
  };

  const getCategoryName = (slug) => {
    const cat = categories.find(c => c.slug === slug);
    return cat ? cat.name : slug;
  };

  return (
    <div className="admin-products-container">
      {/* Toast */}
      {toast && <div className="admin-toast">{toast}</div>}
      <div className="products-header-actions">
        <button className="add-product-btn" onClick={() => handleOpenModal()}>
          <PlusIcon />
          Thêm Sản phẩm
        </button>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên Sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.image || 'https://via.placeholder.com/50'} 
                      alt={product.name} 
                      className="product-image-thumb" 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                    />
                  </td>
                  <td><span className="product-name">{product.name}</span></td>
                  <td>
                    <span className="product-category-badge">{getCategoryName(product.category)}</span>
                  </td>
                  <td className="product-price">{formatCurrency(product.price)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit-btn" onClick={() => handleOpenModal(product)} title="Sửa">
                        <EditIcon />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(product.id)} title="Xóa">
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  Chưa có sản phẩm nào trong kho.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="product-modal-overlay">
          <div className="product-modal">
            <div className="modal-header">
              <h2>{editingProduct ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form className="modal-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Tên Sản phẩm</label>
                <input 
                  type="text" 
                  required
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="VD: Giày chạy bộ XSPORT"
                />
              </div>

              <div className="form-group">
                <label>Danh mục</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="" disabled>-- Chọn danh mục --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Giá (VNĐ)</label>
                <input 
                  type="number" 
                  required
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="VD: 1500000"
                />
              </div>

              <div className="form-group">
                <label>Số lượng Tồn kho</label>
                <input 
                  type="number" 
                  required
                  value={formData.stock} 
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  placeholder="VD: 50"
                />
              </div>

              <div className="form-group">
                <label>URL Hình ảnh</label>
                <input 
                  type="text" 
                  value={formData.image} 
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Hủy</button>
                <button type="submit" className="save-btn">Lưu Sản phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

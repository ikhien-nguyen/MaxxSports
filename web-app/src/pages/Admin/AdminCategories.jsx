import React, { useState, useEffect } from 'react';
import './AdminCategories.css';
import { categoryService } from '../../services/categoryService';

// Icons
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

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [isLoading, setIsLoading] = useState(false);

  /* ── 1. GỌI API LẤY DANH SÁCH DANH MỤC ── */
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setFormData({ name: cat.name, slug: cat.slug || '' });
    } else {
      setEditingCat(null);
      setFormData({ name: '', slug: '' });
    }
    setIsModalOpen(true);
  };

  /* ── 2. GỌI API THÊM/SỬA DANH MỤC ── */
  const handleSave = async () => {
    if (!formData.name) return;

    try {
      if (editingCat) {
        // Cập nhật danh mục
        await categoryService.updateCategory(editingCat.id, formData);
      } else {
        // Thêm danh mục mới
        await categoryService.createCategory({
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-')
        });
      }

      await loadData(); // Load lại data từ DB sau khi lưu
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
      alert("Có lỗi xảy ra khi lưu dữ liệu!");
    }
  };

  /* ── 3. GỌI API XÓA ── */
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        // Dùng luôn hàm từ service cho đồng bộ và gọn code
        await categoryService.deleteCategory(id);

        await loadData(); // Tải lại danh sách sau khi xóa thành công
        alert("Xóa danh mục thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        alert("Có lỗi xảy ra khi xóa dữ liệu!");
      }
    }
  };

  return (
      <div className="admin-categories-container">
        <div className="categories-header-actions">
          <h2>Bảo trì Danh mục</h2>
          <button className="add-category-btn" onClick={() => handleOpenModal()}>
            <PlusIcon />
            Thêm Danh mục
          </button>
        </div>

        <div className="categories-table-wrapper">
          <table className="categories-table">
            <thead>
            <tr>
              <th>ID</th>
              <th>Tên Danh mục</th>
              <th>Đường dẫn (Slug)</th>
              <th>Hành động</th>
            </tr>
            </thead>
            <tbody>
            {isLoading ? (
                <tr>
                  <td colSpan="4" className="empty-state">Đang tải dữ liệu...</td>
                </tr>
            ) : categories.length > 0 ? (
                categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>{String(cat.id).substring(0, 6)}</td>
                      <td><span className="category-name">{cat.name}</span></td>
                      <td><span className="category-slug">{cat.slug || cat.name.toLowerCase().replace(/ /g, '-')}</span></td>
                      <td>
                        <div className="action-btns">
                          <button className="action-btn edit-btn" onClick={() => handleOpenModal(cat)} title="Sửa">
                            <EditIcon />
                          </button>
                          <button className="action-btn delete-btn" onClick={() => handleDelete(cat.id)} title="Xóa">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="4" className="empty-state">Chưa có danh mục nào.</td>
                </tr>
            )}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
            <div className="modal-overlay">
              <div className="category-modal">
                <h2>{editingCat ? 'Sửa Danh mục' : 'Thêm Danh mục Mới'}</h2>
                <div className="form-group">
                  <label>Tên Danh mục</label>
                  <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="VD: Giày Nam"
                  />
                </div>
                <div className="form-group">
                  <label>Đường dẫn (Slug)</label>
                  <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      placeholder="VD: giay-nam"
                  />
                </div>
                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Hủy</button>
                  <button className="save-btn" onClick={handleSave}>Lưu Danh mục</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default AdminCategories;
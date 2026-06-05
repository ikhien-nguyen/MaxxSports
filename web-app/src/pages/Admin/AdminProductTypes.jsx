import React, { useState, useEffect, useMemo } from 'react';
import './AdminCategories.css';
import { productTypeService } from '../../services/productTypeService';

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

const AdminProductTypes = ({ searchTerm = "" }) => {
    const [productTypes, setProductTypes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [isLoading, setIsLoading] = useState(false);

    const filteredProductTypes = useMemo(() => {
        if (!searchTerm) return productTypes;
        const lowerSearch = searchTerm.toLowerCase();

        return productTypes.filter(type =>
            type.name?.toLowerCase().includes(lowerSearch) ||
            String(type.id).toLowerCase().includes(lowerSearch)
        );
    }, [productTypes, searchTerm]);

    /* ── GỌI API LẤY DANH SÁCH ── */
    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await productTypeService.getAllProductTypes();
            setProductTypes(data || []);
        } catch (error) {
            console.error("Lỗi khi tải loại sản phẩm:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenModal = (type = null) => {
        if (type) {
            setEditingType(type);
            setFormData({ name: type.name });
        } else {
            setEditingType(null);
            setFormData({ name: '' });
        }
        setIsModalOpen(true);
    };

    /* ── GỌI API THÊM/SỬA ── */
    const handleSave = async () => {
        if (!formData.name.trim()) {
            alert("Vui lòng nhập tên loại sản phẩm!");
            return;
        }

        try {
            if (editingType) {
                await productTypeService.updateProductType(editingType.id, { name: formData.name });
            } else {
                await productTypeService.createProductType({ name: formData.name });
            }

            await loadData();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Lỗi khi lưu loại sản phẩm:", error);
            alert("Có lỗi xảy ra khi lưu dữ liệu!");
        }
    };

    /* ── GỌI API XÓA ── */
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa loại sản phẩm này? Các sản phẩm thuộc loại này có thể bị ảnh hưởng.')) {
            try {
                await productTypeService.deleteProductType(id);
                await loadData();
            } catch (error) {
                console.error("Lỗi khi xóa loại sản phẩm:", error);
                alert("Có lỗi xảy ra khi xóa dữ liệu!");
            }
        }
    };

    return (
        <div className="admin-categories-container">
            <div className="categories-header-actions">
                <h2>Bảo trì Loại Sản Phẩm</h2>
                <button className="add-category-btn" onClick={() => handleOpenModal()}>
                    <PlusIcon />
                    Thêm Loại SP
                </button>
            </div>

            <div className="categories-table-wrapper">
                <table className="categories-table">
                    <thead>
                    <tr>
                        <th style={{ width: '20%' }}>ID</th>
                        <th style={{ width: '60%' }}>Tên Loại Sản Phẩm</th>
                        <th style={{ width: '20%' }}>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="3" className="empty-state">Đang tải dữ liệu...</td>
                        </tr>
                    ) : filteredProductTypes.length > 0 ? (
                        [...filteredProductTypes].reverse().map((type) => (
                            <tr key={type.id}>
                                <td>{type.id}</td>
                                <td><span className="category-name">{type.name}</span></td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn edit-btn" onClick={() => handleOpenModal(type)} title="Sửa">
                                            <EditIcon />
                                        </button>
                                        <button className="action-btn delete-btn" onClick={() => handleDelete(type.id)} title="Xóa">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="empty-state">Chưa có loại sản phẩm nào hoặc không tìm thấy kết quả.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="category-modal">
                        <h2>{editingType ? 'Sửa Loại Sản Phẩm' : 'Thêm Loại SP Mới'}</h2>
                        <div className="form-group">
                            <label>Tên Loại Sản Phẩm</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="VD: Quần áo chạy bộ"
                                autoFocus
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Hủy</button>
                            <button className="save-btn" onClick={handleSave}>Lưu thông tin</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductTypes;
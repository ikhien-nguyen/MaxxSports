import React, { useState, useEffect } from 'react';
import './AdminOrders.css';

// --- Icons ---
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
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

const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cell-icon">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cell-icon">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cell-icon">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadOrders = () => {
    const storedOrders = localStorage.getItem('xsport_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener('xsportDataUpdated', loadOrders);
    window.addEventListener('storage', loadOrders);
    return () => {
      window.removeEventListener('xsportDataUpdated', loadOrders);
      window.removeEventListener('storage', loadOrders);
    };
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    // 1. Fetch current orders
    let ordersData = JSON.parse(localStorage.getItem('xsport_orders')) || [];
    
    // 2. Map and mutate the exact order
    let updatedOrders = ordersData.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
    );
    
    // 3. Save to LocalStorage
    localStorage.setItem('xsport_orders', JSON.stringify(updatedOrders));
    
    // 4. Update the local React state to force a re-render immediately
    setOrders(updatedOrders); 
    
    // 5. Fire global event for other tabs (Customer Account Page)
    window.dispatchEvent(new Event('xsportDataUpdated'));
  };

  const handleDelete = (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('xsport_orders', JSON.stringify(updatedOrders));
      window.dispatchEvent(new Event('xsportDataUpdated'));
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toLocaleString('vi-VN') + 'đ';
  };

  const getStatusClass = (status) => {
    // Clean string comparison
    const s = (status || '').replace(/[\u23F3\uD83D\uDE9A\u2714\uFE0F\u274C]/g, '').trim();
    switch (s) {
      case 'Đang giao hàng': return 'status-shipped';
      case 'Hoàn thành': return 'status-completed';
      case 'Đã xác nhận': return 'status-confirmed';
      case 'Hủy': return 'status-cancelled';
      case 'Chờ xác nhận':
      default: return 'status-pending';
    }
  };

  // Safe items extraction
  const getOrderItems = (order) => {
    if (!order) return [];
    if (Array.isArray(order.items)) return order.items;
    if (Array.isArray(order.cart)) return order.cart;
    return [];
  };

  return (
    <div className="admin-orders-container">
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã Đơn Hàng</th>
              <th>Khách Hàng</th>
              <th>Ngày Đặt</th>
              <th>Tổng Tiền</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const name = order.customerName || order.shippingAddress?.fullName || 'Khách vãng lai';
                const contact = order.email || order.shippingAddress?.phone || order.phone || 'Không có thông tin liên hệ';
                
                return (
                  <tr key={order.id}>
                    <td>
                      <div className="cell-with-icon">
                        <BoxIcon />
                        <div className="order-id-link" onClick={() => handleView(order)}>
                          {order.id.toString().startsWith('#MS') ? order.id : '#MS' + order.id.toString().substring(0, 6).toUpperCase()}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="cell-with-icon">
                        <UserIcon />
                        <div className="customer-info">
                          <span className="customer-name">{name}</span>
                          <span className="customer-contact">{contact}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="cell-with-icon">
                        <CalendarIcon />
                        <span className="order-date">
                          {order.date ? new Date(order.date).toLocaleString('vi-VN') : new Date().toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </td>
                    <td className="order-total">{formatCurrency(order.totalAmount || order.total || 0)}</td>
                    <td>
                      <div className={`status-select-container ${getStatusClass(order.status || 'Chờ xác nhận')}`}>
                        <select 
                          className={`status-select ${getStatusClass(order.status || 'Chờ xác nhận')}`}
                          value={order.status || '⏳ Chờ xác nhận'}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="⏳ Chờ xác nhận">⏳ Chờ xác nhận</option>
                          <option value="📦 Đã xác nhận">📦 Đã xác nhận</option>
                          <option value="🚚 Đang giao hàng">🚚 Đang giao hàng</option>
                          <option value="✔️ Hoàn thành">✔️ Hoàn thành</option>
                          <option value="❌ Hủy">❌ Hủy</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn view-btn" onClick={() => handleView(order)} title="Xem chi tiết">
                          <EyeIcon />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(order.id)} title="Xóa">
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="empty-orders">
                  Không tìm thấy đơn hàng nào trong hệ thống.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="order-modal-overlay">
          <div className="order-modal">
            <div className="order-modal-header">
              <h2><BoxIcon /> Chi tiết Đơn hàng {selectedOrder.id.toString().startsWith('#MS') ? selectedOrder.id : '#MS' + selectedOrder.id.toString().substring(0, 6).toUpperCase()}</h2>
              <button className="close-modal-btn" onClick={closeModal}>&times;</button>
            </div>
            
            <div className="order-modal-body">
              {/* Info Cards */}
              <div className="order-info-grid">
                <div className="order-info-card">
                  <h3>Thông tin Khách hàng</h3>
                  <div className="info-row">
                    <span className="info-label">Họ tên:</span>
                    <span className="info-value">{selectedOrder.customerName || selectedOrder.fullName || 'Khách vãng lai'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">SĐT:</span>
                    <span className="info-value">{selectedOrder.phone || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{selectedOrder.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="order-info-card">
                  <h3>Thông tin Giao hàng</h3>
                  <div className="info-row">
                    <span className="info-label">Địa chỉ:</span>
                    <span className="info-value">{selectedOrder.address || selectedOrder.shippingAddress || 'Chưa cung cấp'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Ghi chú:</span>
                    <span className="info-value">{selectedOrder.note || 'Không có'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">PT Thanh toán:</span>
                    <span className="info-value">{selectedOrder.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : (selectedOrder.paymentMethod || 'COD')}</span>
                  </div>
                </div>
              </div>

              {/* Items Mini-table */}
              <div className="order-items-section">
                <h3>Sản phẩm Đã Đặt</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getOrderItems(selectedOrder).length > 0 ? (
                      getOrderItems(selectedOrder).map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="item-product-col">
                              <img 
                                src={item.image || 'https://via.placeholder.com/50'} 
                                alt={item.name} 
                                className="item-thumbnail" 
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                              />
                              <span className="item-name">{item.name}</span>
                            </div>
                          </td>
                          <td className="item-price">{formatCurrency(item.price)}</td>
                          <td className="item-qty">x{item.quantity || 1}</td>
                          <td className="item-subtotal">{formatCurrency((item.price || 0) * (item.quantity || 1))}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                          Không có chi tiết sản phẩm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="order-modal-footer">
              <div className="order-modal-total">
                Tổng cộng: <span>{formatCurrency(selectedOrder.totalAmount || selectedOrder.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

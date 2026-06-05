import React, { useState, useEffect, useMemo } from 'react';
import './AdminOrders.css';
import { orderService } from "../../services/orderService";

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

const AdminOrders = ({ searchTerm = "" }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState('');

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const loadOrders = async () => {
        try{
            const data = await orderService.getAllOrdersForAdmin();
            console.log("API DATA:", data);
            setOrders(data.result || []);
        }catch(err){
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        if (!searchTerm) return orders;
        const lowerSearch = searchTerm.toLowerCase();

        return orders.filter((order) => {
            const name = (order.customerName || order.shippingAddress?.fullName || order.fullName || '').toLowerCase();
            const contact = (order.email || order.shippingAddress?.phone || order.phone || '').toLowerCase();
            const orderIdStr = String(order.orderId).toLowerCase();

            return (
                name.includes(lowerSearch) ||
                contact.includes(lowerSearch) ||
                orderIdStr.includes(lowerSearch)
            );
        });
    }, [orders, searchTerm]);

    const handleStatusChange = async (orderId,newStatus)=>{
        try{
            await orderService.updateOrderStatusByAdmin({
                id: orderId,
                status: newStatus
            });
            await loadOrders();
            showToast("Cập nhật thành công");
        }catch(err){
            console.log(err);
        }
    }

    const handleDelete = async(id)=>{
        if(window.confirm("Bạn có chắc chắn xóa ?")){
            try{
                await orderService.deleteOrder(id);
                await loadOrders();
                showToast("Xóa thành công");
            }catch(err){
                console.log(err);
            }
        }
    }

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
        switch (status) {
            case 'CHO_THANH_TOAN': return 'status-pending';
            case 'PENDING': return 'status-pending';
            case 'CONFIRMED': return 'status-confirmed';
            case 'SHIPPING': return 'status-shipped';
            case 'COMPLETED': return 'status-completed';
            case 'CANCELLED': return 'status-cancelled';
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
            {/* Toast */}
            {toast && <div className="admin-toast">{toast}</div>}
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
                    {isLoading ? (
                        <tr>
                            <td colSpan="6" className="empty-orders">Đang tải dữ liệu...</td>
                        </tr>
                    ) : filteredOrders.length > 0 ? (
                        [...filteredOrders].reverse().map((order) => {
                            const name = order.customerName || order.shippingAddress?.fullName || 'Khách vãng lai';
                            const contact = order.email || order.shippingAddress?.phone || order.phone || 'Không có thông tin liên hệ';

                            return (
                                <tr key={order.orderId}>
                                    <td>
                                        <div className="cell-with-icon">
                                            <BoxIcon />
                                            <div className="order-id-link" onClick={() => handleView(order)}>
                                                {order.orderId
                                                    ? '#MS' + String(order.orderId).substring(0, 6).toUpperCase()
                                                    : 'N/A'
                                                }
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
                          {order.orderDate ? new Date(order.orderDate).toLocaleString('vi-VN') : new Date().toLocaleDateString('vi-VN')}
                        </span>
                                        </div>
                                    </td>
                                    <td className="order-total">
                                        {formatCurrency(order.totalPrice)}
                                    </td>
                                    <td>
                                        <div className={`status-select-container ${getStatusClass(order.orderStatus || 'Chờ xác nhận')}`}>
                                            <select
                                                className={`status-select ${getStatusClass(order.orderStatus || 'Chờ xác nhận')}`}
                                                value={order.orderStatus || 'Chờ xác nhận'}
                                                onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                            >
                                                <option value="CHO_THANH_TOAN">⏳ Chờ thanh toán</option>
                                                <option value="PENDING">⌛ Chờ xác nhận</option>
                                                <option value="CONFIRMED">✅ Đã xác nhận</option>
                                                <option value="SHIPPING">🚚 Đang giao hàng</option>
                                                <option value="COMPLETED">✔️ Hoàn thành</option>
                                                <option value="CANCELLED">❌ Đã hủy</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn view-btn" onClick={() => handleView(order)} title="Xem chi tiết">
                                                <EyeIcon />
                                            </button>
                                            <button className="action-btn delete-btn" onClick={() => handleDelete(order.orderId)} title="Xóa">
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
                                Không tìm thấy đơn hàng nào phù hợp với tìm kiếm.
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
                            <h2>
                                <BoxIcon />
                                Chi tiết Đơn hàng {
                                selectedOrder.orderId
                                    ? (
                                        String(selectedOrder.orderId).startsWith('#MS')
                                            ? selectedOrder.orderId
                                            : '#MS' + String(selectedOrder.orderId).substring(0, 6).toUpperCase()
                                    )
                                    : 'N/A'
                            }
                            </h2>
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
                                        <span className="info-value">
                        {selectedOrder.detailAddress || 'Chưa cung cấp'}
                        </span>
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
                                                            src={item.imageUrl || 'https://via.placeholder.com/50'}
                                                            alt={item.productName}
                                                            className="item-thumbnail"
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/50';
                                                            }}
                                                        />
                                                        <span className="item-name">{item.productName}</span>
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
                                Tổng cộng: <span>{formatCurrency(
                                selectedOrder.totalPrice || 0
                            )}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
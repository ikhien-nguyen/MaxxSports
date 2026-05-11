import React, { useState, useEffect } from 'react';
import './AdminCustomers.css';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);

  const loadCustomers = () => {
    const storedOrders = localStorage.getItem('xsport_orders');
    const orders = storedOrders ? JSON.parse(storedOrders) : [];

    // Aggregation Algorithm
    const customerMap = new Map();

    orders.forEach(order => {
      // Normalize email or phone as unique identifier
      const identifier = (order.email || order.phone || order.fullName || 'Khách vãng lai').toLowerCase().trim();
      const name = order.customerName || order.fullName || 'Khách vãng lai';
      const orderTotal = parseFloat(order.totalAmount || order.total || 0);

      if (customerMap.has(identifier)) {
        const existing = customerMap.get(identifier);
        existing.totalSpent += orderTotal;
        existing.orderCount += 1;
        existing.lastOrderDate = new Date(Math.max(new Date(existing.lastOrderDate), new Date(order.date || Date.now())));
      } else {
        customerMap.set(identifier, {
          identifier,
          name,
          email: order.email || 'N/A',
          phone: order.phone || 'N/A',
          totalSpent: orderTotal,
          orderCount: 1,
          lastOrderDate: new Date(order.date || Date.now())
        });
      }
    });

    // Convert map to array and sort by total spent (Highest to Lowest)
    const sortedCustomers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
    setCustomers(sortedCustomers);
  };

  useEffect(() => {
    loadCustomers();
    window.addEventListener('xsportDataUpdated', loadCustomers);
    window.addEventListener('storage', loadCustomers);
    return () => {
      window.removeEventListener('xsportDataUpdated', loadCustomers);
      window.removeEventListener('storage', loadCustomers);
    };
  }, []);

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('vi-VN') + 'đ';
  };

  const getInitials = (name) => {
    if (!name || name === 'Khách vãng lai') return 'K';
    const parts = name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="admin-customers-container">
      <div className="customers-header-actions">
        <button className="export-btn" onClick={() => alert('Đang xuất danh sách khách hàng...')}>
          Xuất dữ liệu (CSV)
        </button>
      </div>

      <div className="customers-table-wrapper">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Số điện thoại / Email</th>
              <th>Số đơn hàng</th>
              <th>Tổng chi tiêu</th>
              <th>Lần đặt cuối</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="customer-name-col">
                      <div className="customer-avatar">
                        {getInitials(customer.name)}
                      </div>
                      <span className="customer-name">{customer.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="customer-email">
                      {customer.phone !== 'N/A' ? customer.phone : customer.email}
                    </span>
                  </td>
                  <td>{customer.orderCount}</td>
                  <td className="customer-total-spent">{formatCurrency(customer.totalSpent)}</td>
                  <td>{customer.lastOrderDate.toLocaleDateString('vi-VN')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-customers">
                  Hệ thống chưa ghi nhận khách hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;

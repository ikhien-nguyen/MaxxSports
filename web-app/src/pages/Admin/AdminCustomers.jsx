import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import './AdminCustomers.css';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('xsport_user')) || {};
    } catch {
      return {};
    }
  });

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await userService.getAllUsersForAdmin();
      if (res && res.result) {
        setCustomers(res.result);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách khách hàng:", error);
      setMessage("Không thể tải dữ liệu. Vui lòng kiểm tra quyền Admin.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`CẢNH BÁO: Bạn có chắc chắn muốn xóa tài khoản "${name}" khỏi hệ thống không? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      await userService.deleteUserByAdmin(id);
      setMessage(`Đã xóa tài khoản ${name} thành công!`);
      loadCustomers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      alert(error || "Xóa thất bại!");
    }
  };

  const getInitials = (name, email) => {
    const displayName = name || email || 'K';
    const parts = displayName.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
      <div className="admin-customers-container">
        <div className="customers-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Quản lý Thành viên</h2>
          <button className="export-btn" onClick={() => alert('Chức năng xuất CSV sẽ được tích hợp sau.')}>
            Xuất dữ liệu (CSV)
          </button>
        </div>

        {message && (
            <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '5px' }}>
              {message}
            </div>
        )}

        <div className="customers-table-wrapper">
          {isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Đang tải dữ liệu từ máy chủ...</div>
          ) : (
              <table className="customers-table">
                <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Quyền (Role)</th>
                  <th style={{ textAlign: 'center' }}>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {customers.length > 0 ? (
                    customers.map((customer) => {
                      const isMe = customer.email === currentUser.email;

                      return (
                          <tr key={customer.id} style={isMe ? { backgroundColor: '#f9fafb' } : {}}>
                            <td>
                              <div className="customer-name-col">
                                <div className="customer-avatar">
                                  {getInitials(customer.name, customer.email)}
                                </div>
                                <span className="customer-name">{customer.name || 'Chưa cập nhật'}</span>
                              </div>
                            </td>
                            <td>
                              <span className="customer-email">{customer.email}</span>
                            </td>
                            <td>{customer.phone || '—'}</td>
                            <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: customer.role === 'ADMIN' ? '#fee2e2' : '#e0f2fe',
                          color: customer.role === 'ADMIN' ? '#991b1b' : '#0369a1'
                        }}>
                          {customer.role}
                        </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {isMe ? (
                                  <span style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic', fontWeight: '500' }}>
                            (Tài khoản của bạn)
                          </span>
                              ) : (
                                  <button
                                      onClick={() => handleDeleteUser(customer.id, customer.name || customer.email)}
                                      style={{
                                        background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '5px'
                                      }}
                                      title="Xóa tài khoản"
                                  >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                    </svg>
                                  </button>
                              )}
                            </td>
                          </tr>
                      );
                    })
                ) : (
                    <tr>
                      <td colSpan="5" className="empty-customers" style={{ textAlign: 'center', padding: '20px' }}>
                        Hệ thống chưa ghi nhận tài khoản thành viên nào.
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
          )}
        </div>
      </div>
  );
};

export default AdminCustomers;
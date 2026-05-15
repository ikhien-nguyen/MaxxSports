import React, { useState } from 'react';
import './AdminLayout.css';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminCustomers from './AdminCustomers';

// --- Icons ---
const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const TagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ExitIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const menuItems = [
  { id: 'Dashboard', label: 'Tổng quan', icon: <GridIcon /> },
  { id: 'Orders', label: 'Quản lý Đơn hàng', icon: <BoxIcon /> },
  { id: 'Products', label: 'Quản lý Sản phẩm', icon: <TagIcon /> },
  { id: 'Categories', label: 'Bảo trì Danh mục', icon: <GridIcon /> },
  { id: 'Customers', label: 'Quản lý Khách hàng', icon: <UsersIcon /> },
  { id: 'Settings', label: 'Cài đặt', icon: <SettingsIcon /> },
];

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const currentUser = JSON.parse(localStorage.getItem('xsport_user') || '{}');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <AdminDashboard />;
      case 'Orders':
        return <AdminOrders />;
      case 'Products':
        return <AdminProducts />;
      case 'Categories':
        return <AdminCategories />;
      case 'Customers':
        return <AdminCustomers />;
      default:
        return (
          <div className="admin-dashboard-placeholder">
            <h2>{menuItems.find(m => m.id === activeTab)?.label}</h2>
            <p>Module đang được phát triển</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-layout-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo-container">
          <div style={{color: '#ffb800', fontSize: '24px', fontWeight: '900', letterSpacing: '2px', fontStyle: 'italic'}}><span style={{background:'linear-gradient(135deg,#FFE066,#FFB800,#E68A00)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>X</span><span style={{color:'#fff'}}>SPORT</span></div>
          <span style={{color:'#64748b',fontSize:'11px',marginTop:'2px'}}>Admin Panel</span>
        </div>
        
        <div className="admin-profile">
          <div className="admin-avatar">{(currentUser.name || 'A').charAt(0).toUpperCase()}</div>
          <div className="admin-info">
            <span className="admin-name">{currentUser.name || 'Admin'}</span>
            <span className="admin-role">{currentUser.role || 'ADMIN'}</span>
          </div>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </nav>

        <button 
          className="admin-logout-btn" 
          onClick={() => { 
            localStorage.removeItem('xsport_user'); 
            window.dispatchEvent(new Event('xsportDataUpdated')); 
            window.location.href = '/auth'; 
          }}
        >
          <ExitIcon />
          Đăng xuất
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-title">
            <h1>{menuItems.find(m => m.id === activeTab)?.label}</h1>
            <p>Hệ thống quản lý nội dung</p>
          </div>
          
          <div className="admin-header-actions">
            <div className="admin-search-wrapper">
              <SearchIcon />
              <input 
                type="text" 
                className="admin-search-bar" 
                placeholder={`Tìm kiếm...`} 
              />
            </div>

            <button className="admin-bell-btn">
              <BellIcon />
              <span className="admin-bell-badge"></span>
            </button>

            <select className="admin-date-filter" defaultValue="today">
              <option value="today">Hôm nay</option>
              <option value="yesterday">Hôm qua</option>
              <option value="last7days">7 ngày qua</option>
              <option value="thismonth">Tháng này</option>
            </select>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="admin-content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

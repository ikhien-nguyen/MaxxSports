import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

// SVG Background Icons for Cards
const MoneyBgIcon = () => (
  <svg className="kpi-bg-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h2.73c.12.98.98 1.46 2.26 1.46 1.25 0 2.05-.58 2.05-1.44 0-.96-.86-1.31-2.45-1.78-2.22-.65-3.8-1.57-3.8-3.64 0-1.8 1.41-2.92 3.15-3.27V4h2.67v1.96c1.44.3 2.65 1.2 2.82 2.82h-2.67c-.12-.8-.74-1.32-1.95-1.32-1.12 0-1.83.53-1.83 1.34 0 .91.81 1.22 2.45 1.7 2.26.68 3.8 1.63 3.8 3.73 0 1.94-1.47 2.97-3.29 3.3z" />
  </svg>
);

const CartBgIcon = () => (
  <svg className="kpi-bg-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const UsersBgIcon = () => (
  <svg className="kpi-bg-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const GrowthBgIcon = () => (
  <svg className="kpi-bg-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
  </svg>
);

const AdminDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('week');
  
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('xsport_orders')) || []; }
    catch { return []; }
  });

  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    newOrders: 0,
    activeCustomers: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartBars, setChartBars] = useState({ bars: [], ceiling: 0 });

  const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toLocaleString('vi-VN') + 'đ';
  };

  const calculateMetrics = () => {
    // 1. DATA AGGREGATION ALGORITHMS (IMPERATIVE)
    const allOrders = JSON.parse(localStorage.getItem('xsport_orders') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('xsport_users_db') || '[]');
    setOrders(allOrders);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const filteredOrders = allOrders.filter(order => {
      const dateStr = order.createdAt || order.date || new Date().toISOString();
      const orderDate = new Date(dateStr);
      const cleanOrderDate = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
      
      if (timeFilter === 'today') {
        return cleanOrderDate.getTime() === today.getTime();
      }
      if (timeFilter === 'week') {
        return cleanOrderDate >= weekStart;
      }
      if (timeFilter === 'month') {
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      }
      return true;
    });

    const revenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount || order.total || 0), 0);

    setMetrics({
      totalRevenue: revenue,
      newOrders: filteredOrders.length,
      activeCustomers: allUsers.length
    });

    // RECENT ACTIVITY FEED
    const sortedOrders = [...allOrders]
      .sort((a, b) => new Date(b.createdAt || b.date || Date.now()) - new Date(a.createdAt || a.date || Date.now()))
      .slice(0, 5);
    setRecentOrders(sortedOrders);

    // 2. DYNAMIC PURE CSS BAR CHART (LAST 7 DAYS)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      last7Days.push({
        dateObj: d,
        label: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}`,
        revenue: 0
      });
    }

    allOrders.forEach(o => {
      const oDate = new Date(o.createdAt || o.date || new Date().toISOString());
      const cleanOrderDate = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate());
      
      const dayIndex = last7Days.findIndex(day => day.dateObj.getTime() === cleanOrderDate.getTime());
      if (dayIndex !== -1) {
        last7Days[dayIndex].revenue += parseFloat(o.totalAmount || o.total || 0);
      }
    });

    const maxRevenue = Math.max(...last7Days.map(d => d.revenue));
    const ceiling = maxRevenue > 0 ? maxRevenue * 1.2 : 1000000;

    const bars = last7Days.map(day => ({
      label: day.label,
      value: day.revenue,
      heightPercentage: Math.min((day.revenue / ceiling) * 100, 100),
      formattedValue: formatCurrency(day.revenue)
    }));

    setChartBars({ bars, ceiling });
  };

  useEffect(() => {
    calculateMetrics();
    window.addEventListener('xsportDataUpdated', calculateMetrics);
    window.addEventListener('storage', calculateMetrics);
    return () => {
      window.removeEventListener('xsportDataUpdated', calculateMetrics);
      window.removeEventListener('storage', calculateMetrics);
    };
  }, [timeFilter]);

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Vừa xong";
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff/60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff/3600)} giờ trước`;
    return `${Math.floor(diff/86400)} ngày trước`;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const gridLines = [];
  if (chartBars.ceiling) {
    for (let i = 4; i >= 0; i--) {
      const val = (chartBars.ceiling / 4) * i;
      let label = '';
      if (val >= 1000000) label = (val / 1000000).toFixed(1).replace('.0','') + 'tr';
      else if (val >= 1000) label = (val / 1000).toFixed(0) + 'k';
      else label = '0';
      
      gridLines.push(
        <div key={i} className="chart-grid-line" style={{ borderBottom: '1px dashed #e2e8f0' }}>
          <span className="grid-label">{label}</span>
        </div>
      );
    }
  }

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    borderRadius: '12px'
  };

  return (
    <div className="admin-dashboard-container">
      {/* TIME FILTER HEADER & SLEEK TOGGLE */}
      <div className="dashboard-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: '700' }}>Tổng quan hệ thống</h2>
        <div className="sleek-toggle-group" style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
          {['today', 'week', 'month'].map(mode => (
            <button
              key={mode}
              onClick={() => setTimeFilter(mode)}
              style={{
                background: timeFilter === mode ? '#ffffff' : 'transparent',
                color: timeFilter === mode ? '#0f172a' : '#64748b',
                boxShadow: timeFilter === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {mode === 'today' ? 'Hôm nay' : mode === 'week' ? 'Tuần này' : 'Tháng này'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-cards-grid">
        <div className="kpi-card" style={cardStyle}>
          <MoneyBgIcon />
          <div className="kpi-header">
            <span className="kpi-title">Tổng doanh thu</span>
            <div className="kpi-icon">💰</div>
          </div>
          <h2 className="kpi-value">{formatCurrency(metrics.totalRevenue)}</h2>
        </div>

        <div className="kpi-card" style={cardStyle}>
          <CartBgIcon />
          <div className="kpi-header">
            <span className="kpi-title">Đơn hàng mới</span>
            <div className="kpi-icon">📦</div>
          </div>
          <h2 className="kpi-value">{metrics.newOrders}</h2>
        </div>

        <div className="kpi-card" style={cardStyle}>
          <UsersBgIcon />
          <div className="kpi-header">
            <span className="kpi-title">Khách hàng ĐK</span>
            <div className="kpi-icon">👥</div>
          </div>
          <h2 className="kpi-value">{metrics.activeCustomers.toLocaleString()}</h2>
        </div>
        
        <div className="kpi-card" style={cardStyle}>
          <GrowthBgIcon />
          <div className="kpi-header">
            <span className="kpi-title">Tỷ lệ chuyển đổi</span>
            <div className="kpi-icon">📈</div>
          </div>
          <h2 className="kpi-value">4.6%</h2>
        </div>
      </div>

      <div className="dashboard-lower-section">
        {/* DYNAMIC 7-DAY BAR CHART */}
        <div className="dashboard-chart-section" style={cardStyle}>
          <div className="chart-header">
            <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: '700', margin: 0 }}>Doanh thu 7 ngày gần nhất</h3>
          </div>
          
          <div className="chart-container" style={{ display: 'flex', alignItems: 'flex-end', height: '250px', paddingTop: '20px', paddingBottom: '30px', paddingLeft: '50px', paddingRight: '10px', gap: '4%', position: 'relative' }}>
            <div className="chart-grid-lines">
              {gridLines}
            </div>

            {chartBars.bars && chartBars.bars.map((bar, index) => (
              <div key={index} className="chart-bar-wrapper" style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                <div 
                  className="bar-fill" 
                  style={{ 
                    height: `${bar.heightPercentage}%`,
                    width: '32px',
                    backgroundColor: '#ffb800',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <div className="bar-tooltip" style={{
                    position: 'absolute', top: '-38px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: '#0f172a', color: 'white', padding: '6px 10px', borderRadius: '6px',
                    fontSize: '12px', fontWeight: '600', opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 10
                  }}>{bar.formattedValue}</div>
                </div>
                <span className="bar-label" style={{ position: 'absolute', bottom: '-25px', color: '#64748b', fontSize: '12px', fontWeight: '500' }}>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY FEED */}
        <div className="recent-activity-section" style={cardStyle}>
          <div className="recent-activity-header">
            <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: '700', margin: 0 }}>Hoạt động gần đây</h3>
          </div>
          <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recentOrders.length > 0 ? (
              recentOrders.map((order, idx) => {
                const name = order.customerName || order.fullName || 'Khách vãng lai';
                const idStr = order.id.toString().startsWith('#MS') ? order.id : '#MS' + order.id.toString().substring(0,6).toUpperCase();
                return (
                  <div className="activity-item" key={idx} style={{ display: 'flex', gap: '15px', paddingBottom: '15px', borderBottom: idx === recentOrders.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                    <div className="activity-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fffbeb', color: '#ffb800', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>
                      {getInitials(name)}
                    </div>
                    <div className="activity-content" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="activity-text" style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                        Khách hàng <strong style={{ fontWeight: '600', color: '#0f172a' }}>{name}</strong> vừa đặt đơn hàng <strong style={{ fontWeight: '600', color: '#0f172a' }}>{idStr}</strong>
                      </span>
                      <span className="activity-time" style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                        {getTimeAgo(order.createdAt || order.date)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="activity-empty" style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                Chưa có hoạt động nào.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

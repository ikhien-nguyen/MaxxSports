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
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    newOrders: 0,
    activeCustomers: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartBars, setChartBars] = useState([]);

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('vi-VN') + 'đ';
  };

  const calculateMetrics = () => {
    const storedOrders = localStorage.getItem('xsport_orders');
    const orders = storedOrders ? JSON.parse(storedOrders) : [];

    // Calculate total revenue
    const revenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || order.total || 0), 0);

    // Calculate unique customers
    const uniqueCustomers = new Set();
    orders.forEach(order => {
      const contact = order.email || order.phone || order.fullName || 'Guest';
      uniqueCustomers.add(contact.toLowerCase());
    });

    setMetrics({
      totalRevenue: revenue,
      newOrders: orders.length,
      activeCustomers: uniqueCustomers.size
    });

    // Recent 3 orders
    const sorted = [...orders].sort((a, b) => new Date(b.date || Date.now()) - new Date(a.date || Date.now()));
    setRecentOrders(sorted.slice(0, 3));

    // Dynamic Chart Data mapping - inject real revenue into latest month
    const baseChart = [
      { month: 'Jan', value: 4500000 },
      { month: 'Feb', value: 6000000 },
      { month: 'Mar', value: 3500000 },
      { month: 'Apr', value: 8000000 },
      { month: 'May', value: 5500000 },
      { month: 'Jun', value: revenue > 0 ? revenue : 9000000 },
    ];
    
    const maxVal = Math.max(...baseChart.map(d => d.value));
    const ceiling = maxVal > 10000000 ? maxVal * 1.2 : 10000000;

    const computedBars = baseChart.map(d => ({
      ...d,
      heightPercentage: Math.min((d.value / ceiling) * 100, 100),
      formattedLabel: formatCurrency(d.value)
    }));

    setChartBars({ bars: computedBars, ceiling });
  };

  useEffect(() => {
    calculateMetrics();
    window.addEventListener('xsportDataUpdated', calculateMetrics);
    window.addEventListener('storage', calculateMetrics);
    return () => {
      window.removeEventListener('xsportDataUpdated', calculateMetrics);
      window.removeEventListener('storage', calculateMetrics);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return 'G';
    const parts = name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Generate grid lines
  const gridLines = [];
  if (chartBars.ceiling) {
    for (let i = 4; i >= 0; i--) {
      const val = (chartBars.ceiling / 4) * i;
      let label = '';
      if (val >= 1000000) label = (val / 1000000).toFixed(0) + 'M';
      else if (val >= 1000) label = (val / 1000).toFixed(0) + 'K';
      else label = '0';
      
      gridLines.push(
        <div key={i} className="chart-grid-line">
          <span className="grid-label">{label}</span>
        </div>
      );
    }
  }

  return (
    <div className="admin-dashboard-container">
      {/* 4 Professional Card UI blocks */}
      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <MoneyBgIcon />
          <div className="kpi-header">
            <span className="kpi-title">Tổng doanh thu</span>
            <div className="kpi-icon">💰</div>
          </div>
          <h2 className="kpi-value">{formatCurrency(metrics.totalRevenue)}</h2>
          <div className="kpi-trend positive">
            <span>↑ +12.5%</span>
            <span className="trend-text">so với tháng trước</span>
          </div>
        </div>

        <div className="kpi-card">
          <CartBgIcon />
          <div className="kpi-header">
            <span className="kpi-title">Đơn hàng mới</span>
            <div className="kpi-icon">📦</div>
          </div>
          <h2 className="kpi-value">{metrics.newOrders}</h2>
          <div className="kpi-trend positive">
            <span>↑ +8.2%</span>
            <span className="trend-text">so với tháng trước</span>
          </div>
        </div>

        <div className="kpi-card">
          <UsersBgIcon />
          <div className="kpi-header">
            <span className="kpi-title">Khách hàng HĐ</span>
            <div className="kpi-icon">👥</div>
          </div>
          <h2 className="kpi-value">{metrics.activeCustomers.toLocaleString()}</h2>
          <div className="kpi-trend positive">
            <span>↑ +3.1%</span>
            <span className="trend-text">so với tháng trước</span>
          </div>
        </div>

        <div className="kpi-card">
          <GrowthBgIcon />
          <div className="kpi-header">
            <span className="kpi-title">Tỷ lệ chuyển đổi</span>
            <div className="kpi-icon">📈</div>
          </div>
          <h2 className="kpi-value">4.6%</h2>
          <div className="kpi-trend negative">
            <span>↓ -1.2%</span>
            <span className="trend-text">so với tháng trước</span>
          </div>
        </div>
      </div>

      <div className="dashboard-lower-section">
        {/* CSS BAR CHART */}
        <div className="dashboard-chart-section">
          <div className="chart-header">
            <h3>Tổng quan Doanh thu</h3>
          </div>
          
          <div className="chart-container">
            {/* Grid lines (5 background lines) */}
            <div className="chart-grid-lines">
              {gridLines}
            </div>

            {/* 6 vertical bars */}
            {chartBars.bars && chartBars.bars.map((data, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div 
                  className="bar-fill" 
                  style={{ height: `${data.heightPercentage}%` }}
                >
                  <div className="bar-tooltip">{data.formattedLabel}</div>
                </div>
                <span className="bar-label">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY PANEL */}
        <div className="recent-activity-section">
          <div className="recent-activity-header">
            <h3>Hoạt động gần đây</h3>
          </div>
          <div className="activity-list">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, idx) => {
                const name = order.customerName || order.fullName || 'Khách vãng lai';
                const total = formatCurrency(order.totalAmount || order.total || 0);
                const timeStr = order.date ? new Date(order.date).toLocaleString('vi-VN') : 'Vừa xong';
                return (
                  <div className="activity-item" key={idx}>
                    <div className="activity-avatar">{getInitials(name)}</div>
                    <div className="activity-content">
                      <span className="activity-text">
                        <strong>{name}</strong> vừa đặt đơn hàng trị giá <strong>{total}</strong>
                      </span>
                      <span className="activity-time">{timeStr}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="activity-empty">
                Chưa có hoạt động nào gần đây.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

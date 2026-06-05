import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { orderService } from "../../services/orderService";
import { userService } from "../../services/userService";
import { saveAs } from "file-saver";
import { productService } from "../../services/productService";
import ExcelJS from 'exceljs';

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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [timeFilter, setTimeFilter] = useState('week');

  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('xsport_orders')) || []; }
    catch { return []; }
  });

  const loadDashboardData = async () => {
    try {
      const orderRes = await orderService.getAllOrdersForAdmin();
      const userRes = await userService.getAllUsersForAdmin();

      const allOrders = orderRes?.result || [];
      const allUsers = userRes?.result || [];

      setOrders(allOrders);
      calculateMetrics(allOrders, allUsers);
    } catch (error) {
      console.error("Load dashboard error:", error);
    }
  };

  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    revenueTrend: 0,
    newOrders: 0,
    ordersTrend: 0,
    activeCustomers: 0,
    customersTrend: 0,
    conversionRate: "0.0",
    conversionTrend: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [chartBars, setChartBars] = useState({ bars: [], ceiling: 0, title: 'Doanh thu 7 ngày gần nhất' });

  const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toLocaleString('vi-VN') + 'đ';
  };

  const parseOrderDate = (dateStr) => {
    if (!dateStr) return new Date();
    if (typeof dateStr === 'string' && dateStr.includes('/')) {
      const [datePart] = dateStr.split(' ');
      const parts = datePart.split('/');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        if (!isNaN(d.getTime())) return d;
      }
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const calculateMetrics = (allOrders, allUsers) => {
    const now = new Date();
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const todayStart = startOfDay(now);

    let currentStart, currentEnd, prevStart, prevEnd, chartTitle;

    if (timeFilter === 'today') {
      currentStart = todayStart;
      currentEnd = new Date(todayStart.getTime() + 86400000 - 1);
      prevStart = new Date(todayStart.getTime() - 86400000);
      prevEnd = new Date(currentStart.getTime() - 1);
      chartTitle = 'Doanh thu Hôm nay (Khung giờ)';
    } else if (timeFilter === 'week') {
      currentStart = new Date(todayStart.getTime() - 6 * 86400000);
      currentEnd = new Date(todayStart.getTime() + 86400000 - 1);
      prevStart = new Date(currentStart.getTime() - 7 * 86400000);
      prevEnd = new Date(currentStart.getTime() - 1);
      chartTitle = 'Doanh thu 7 ngày gần nhất';
    } else if (timeFilter === 'month') {
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      chartTitle = 'Doanh thu Tháng này (Theo tuần)';
    } else if (timeFilter === 'year') {
      currentStart = new Date(now.getFullYear(), 0, 1);
      currentEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      prevStart = new Date(now.getFullYear() - 1, 0, 1);
      prevEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
      chartTitle = `Doanh thu Năm ${now.getFullYear()} (Theo tháng)`;
    } else if (timeFilter === 'all') {
      currentStart = new Date(2000, 0, 1);
      currentEnd = new Date(now.getFullYear() + 1, 0, 1);
      prevStart = new Date(1900, 0, 1);
      prevEnd = new Date(1900, 0, 1);
      chartTitle = 'Doanh thu Toàn bộ thời gian (5 Năm gần nhất)';
    } else if (timeFilter === 'custom' && fromDate && toDate) {
      currentStart = startOfDay(new Date(fromDate));
      currentEnd = new Date(new Date(toDate).setHours(23, 59, 59, 999));

      const diffTime = currentEnd.getTime() - currentStart.getTime() + 1;
      prevStart = new Date(currentStart.getTime() - diffTime);
      prevEnd = new Date(currentStart.getTime() - 1);

      chartTitle = `Doanh thu từ ${new Date(fromDate).toLocaleDateString('vi-VN')} đến ${new Date(toDate).toLocaleDateString('vi-VN')}`;
    }

    let currentRevenue = 0;
    let prevRevenue = 0;
    let currentOrders = 0;
    let prevOrders = 5;

    allOrders.forEach(o => {
      const d = parseOrderDate(o.createdAt || o.orderDate);
      const val = parseFloat(o.totalPrice || 0);

      if (d >= currentStart && d <= currentEnd) {
        currentRevenue += val;
        currentOrders++;
      } else if (d >= prevStart && d <= prevEnd) {
        prevRevenue += val;
        prevOrders++;
      }
    });

    const calcTrend = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    setMetrics({
      totalRevenue: currentRevenue,
      revenueTrend: calcTrend(currentRevenue, prevRevenue),
      newOrders: currentOrders,
      ordersTrend: calcTrend(currentOrders, prevOrders),
      activeCustomers: allUsers.length,
      customersTrend: calcTrend(allUsers.length, Math.max(allUsers.length - 2, 1)),
      conversionRate: currentOrders > 0 ? ((currentOrders / Math.max(allUsers.length, 1)) * 100).toFixed(1) : "0.0",
      conversionTrend: calcTrend(currentOrders, prevOrders)
    });

    // RECENT ACTIVITY FEED
    const sortedOrders = [...allOrders]
        .sort((a,b) => parseOrderDate(b.orderDate).getTime() - parseOrderDate(a.orderDate).getTime())
        .slice(0, 5);
    setRecentOrders(sortedOrders);

    // ===============================================
    // DYNAMIC CHART DATA (ĐÃ SỬA LỖI KHÔNG HIỆN BIỂU ĐỒ)
    // ===============================================
    let chartConfig = [];
    if (timeFilter === 'today') {
      for (let i = 0; i < 6; i++) {
        const h = i * 4;
        chartConfig.push({ label: `${h.toString().padStart(2,'0')}:00`, total: 0 });
      }
      allOrders.forEach(o => {
        const d = parseOrderDate(o.orderDate);
        if(d >= currentStart && d <= currentEnd){
          const index = Math.floor(d.getHours()/4);
          if(chartConfig[index]) chartConfig[index].total += parseFloat(o.totalPrice || 0);
        }
      });
    } else if (timeFilter === 'week') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(todayStart);
        d.setDate(todayStart.getDate() - i);
        chartConfig.push({
          label: `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`,
          dateObj: startOfDay(d),
          total: 0
        });
      }
      allOrders.forEach(o => {
        const d = parseOrderDate(o.orderDate);
        if (d >= currentStart && d <= currentEnd) {
          const cleanD = startOfDay(d);
          const segment = chartConfig.find(c => c.dateObj && c.dateObj.getTime() === cleanD.getTime());
          if (segment) segment.total += parseFloat(o.totalPrice || 0);
        }
      });
    } else if (timeFilter === 'month') {
      for(let i=1;i<=5;i++){
        chartConfig.push({ label:`Tuần ${i}`, total:0 });
      }
      allOrders.forEach(o => {
        const d = parseOrderDate(o.orderDate);
        if(d >= currentStart && d <= currentEnd){
          let week = Math.ceil(d.getDate()/7);
          if(week > 5) week = 5;
          chartConfig[week-1].total += parseFloat(o.totalPrice || 0);
        }
      });
    } else if (timeFilter === 'year') {
      for(let i = 1; i <= 12; i++) {
        chartConfig.push({ label: `Th${i}`, total: 0 });
      }
      allOrders.forEach(o => {
        const d = parseOrderDate(o.orderDate);
        if(d >= currentStart && d <= currentEnd) {
          const monthIndex = d.getMonth();
          chartConfig[monthIndex].total += parseFloat(o.totalPrice || 0);
        }
      });
    } else if (timeFilter === 'all') {
      const currentYear = now.getFullYear();
      for(let i = 4; i >= 0; i--) {
        chartConfig.push({ label: `${currentYear - i}`, year: currentYear - i, total: 0 });
      }
      allOrders.forEach(o => {
        const d = parseOrderDate(o.orderDate);
        const y = d.getFullYear();
        const segment = chartConfig.find(c => c.year === y);
        if (segment) segment.total += parseFloat(o.totalPrice || 0);
      });
    } else if (timeFilter === 'custom' && fromDate && toDate) {
      const diffDays = Math.ceil((currentEnd - currentStart) / (1000 * 60 * 60 * 24));

      if (diffDays <= 31) {
        for(let i = 0; i < diffDays; i++) {
          const d = new Date(currentStart.getTime() + i * 86400000);
          chartConfig.push({
            label: `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`,
            dateObj: startOfDay(d),
            total: 0
          });
        }
        allOrders.forEach(o => {
          const d = parseOrderDate(o.orderDate);
          if (d >= currentStart && d <= currentEnd) {
            const cleanD = startOfDay(d);
            const segment = chartConfig.find(c => c.dateObj && c.dateObj.getTime() === cleanD.getTime());
            if (segment) segment.total += parseFloat(o.totalPrice || 0);
          }
        });
      } else {
        let tempDate = new Date(currentStart.getFullYear(), currentStart.getMonth(), 1);
        while(tempDate <= currentEnd) {
          chartConfig.push({
            label: `Th${tempDate.getMonth() + 1}/${tempDate.getFullYear().toString().slice(2)}`,
            month: tempDate.getMonth(),
            year: tempDate.getFullYear(),
            total: 0
          });
          tempDate.setMonth(tempDate.getMonth() + 1);
        }
        allOrders.forEach(o => {
          const d = parseOrderDate(o.orderDate);
          if (d >= currentStart && d <= currentEnd) {
            const segment = chartConfig.find(c => c.month === d.getMonth() && c.year === d.getFullYear());
            if (segment) segment.total += parseFloat(o.totalPrice || 0);
          }
        });
      }
    }

    const maxRevenue = Math.max(...chartConfig.map(d => d.total));
    const ceiling = maxRevenue > 0 ? maxRevenue * 1.2 : 1000000;

    const bars = chartConfig.map(c => ({
      label: c.label,
      value: c.total,
      heightPercentage: Math.min((c.total / ceiling) * 100, 100),
      formattedValue: formatCurrency(c.total)
    }));

    setChartBars({ bars, ceiling, title: chartTitle });
  };

  useEffect(() => {
    loadDashboardData();
  }, [timeFilter]);

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Vừa xong";
    const d = parseOrderDate(dateString);
    const diff = Math.floor((new Date() - d) / 1000);
    if (isNaN(diff) || diff < 0) return "Vừa xong";
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

  const renderTrend = (value) => {
    const isPositive = value >= 0;
    return (
        <div className={`kpi-trend ${isPositive ? 'positive' : 'negative'}`} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
        <span style={{ color: isPositive ? '#10b981' : '#ef4444', fontWeight: '700' }}>
          {isPositive ? '↑' : '↓'} {Math.abs(value).toFixed(1)}%
        </span>
          <span style={{ color: '#64748b', fontWeight: '500' }}>so với kỳ trước</span>
        </div>
    );
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

  const exportToExcel = async () => {
    if (!fromDate || !toDate) {
      alert("Vui lòng chọn từ ngày và đến ngày");
      return;
    }

    try {
      const products = await productService.getAllProducts();
      const productMapInfo = {};

      products.forEach(product => {
        productMapInfo[product.tenSanPham] = {
          brand: product.thuongHieu || "Khác",
          category: product.loaiSanPham || "Khác",
          material: product.chatLieu || "",
          price: product.gia || 0
        };
      });

      let filteredOrders = [...orders];
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);

      filteredOrders = filteredOrders.filter(order => {
        const orderDate = parseOrderDate(order.orderDate);
        return (orderDate >= startDate && orderDate <= endDate);
      });

      const productSalesMap = {};
      let totalGlobalRev = 0;

      filteredOrders.forEach(order => {
        (order.items || []).forEach(item => {
          const name = item.productName;

          if (!productSalesMap[name]) {
            const info = productMapInfo[name] || {};
            productSalesMap[name] = {
              productName: name,
              brand: info.brand,
              category: info.category,
              price: info.price,
              quantity: 0,
              revenue: 0
            };
          }

          productSalesMap[name].quantity += item.quantity || 0;
          const lineRev = item.totalPrice || 0;
          productSalesMap[name].revenue += lineRev;
          totalGlobalRev += lineRev;
        });
      });

      const productData = Object.values(productSalesMap);

      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'XSPORT Admin';
      workbook.created = new Date();

      const applyBorder = (row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' },
            color: { argb: 'FFCCCCCC' }
          };
        });
      };

      // SHEET 1: SẢN PHẨM ĐÃ BÁN
      const sheet1 = workbook.addWorksheet('Sản Phẩm Đã Bán');
      sheet1.mergeCells('A1:G2');
      const t1 = sheet1.getCell('A1');
      t1.value = `BÁO CÁO TỔNG QUAN SẢN PHẨM\n(Từ ${fromDate} đến ${toDate})`;
      t1.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
      t1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
      t1.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      sheet1.getRow(3).height = 15;

      sheet1.columns = [
        { header: 'STT', key: 'stt', width: 8 },
        { header: 'Tên Sản Phẩm', key: 'name', width: 45 },
        { header: 'Thương Hiệu', key: 'brand', width: 15 },
        { header: 'Phân Loại', key: 'category', width: 20 },
        { header: 'Đơn Giá', key: 'price', width: 15 },
        { header: 'SL Bán', key: 'quantity', width: 12 },
        { header: 'Tổng Doanh Thu', key: 'revenue', width: 20 }
      ];

      const h1 = sheet1.getRow(4);
      h1.font = { name: 'Arial', size: 12, bold: true };
      h1.alignment = { vertical: 'middle', horizontal: 'center' };
      h1.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFB800' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      let totalQty = 0;
      productData.forEach((p, idx) => {
        totalQty += p.quantity;
        const row = sheet1.addRow({ stt: idx + 1, name: p.productName, brand: p.brand, category: p.category, price: p.price, quantity: p.quantity, revenue: p.revenue });
        row.getCell('price').numFmt = '#,##0"đ"';
        row.getCell('revenue').numFmt = '#,##0"đ"';
        row.getCell('stt').alignment = { horizontal: 'center' };
        row.getCell('quantity').alignment = { horizontal: 'center' };
        applyBorder(row);
      });

      const s1 = sheet1.addRow(['', 'TỔNG CỘNG TẤT CẢ SẢN PHẨM', '', '', '', totalQty, totalGlobalRev]);
      s1.font = { bold: true, color: { argb: 'FFDF0000' }, size: 12 };
      s1.getCell(6).alignment = { horizontal: 'center' };
      s1.getCell(7).numFmt = '#,##0"đ"';
      sheet1.mergeCells(`B${s1.number}:E${s1.number}`);
      s1.getCell(2).alignment = { horizontal: 'right' };
      applyBorder(s1);

      // SHEET 2: TOP 10 BÁN CHẠY
      const sheet2 = workbook.addWorksheet('Top 10 Bán Chạy');
      sheet2.mergeCells('A1:G2');
      const t2 = sheet2.getCell('A1');
      t2.value = `TOP 10 SẢN PHẨM BÁN CHẠY NHẤT\n(Từ ${fromDate} đến ${toDate})`;
      t2.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
      t2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC2626' } };
      t2.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      sheet2.getRow(3).height = 15;

      sheet2.columns = sheet1.columns;
      const h2 = sheet2.getRow(4);
      h2.font = { name: 'Arial', size: 12, bold: true };
      h2.alignment = { vertical: 'middle', horizontal: 'center' };
      h2.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      const top10 = [...productData].sort((a, b) => b.quantity - a.quantity).slice(0, 10);
      top10.forEach((p, idx) => {
        const row = sheet2.addRow({ stt: idx + 1, name: p.productName, brand: p.brand, category: p.category, price: p.price, quantity: p.quantity, revenue: p.revenue });
        row.getCell('price').numFmt = '#,##0"đ"';
        row.getCell('revenue').numFmt = '#,##0"đ"';
        row.getCell('stt').alignment = { horizontal: 'center' };
        row.getCell('quantity').alignment = { horizontal: 'center' };

        if (idx < 3) row.font = { bold: true, color: { argb: 'FFB91C1C' } };
        applyBorder(row);
      });

      // SHEET 3: THEO LOẠI SẢN PHẨM
      const sheet3 = workbook.addWorksheet('Theo Loại SP');
      sheet3.mergeCells('A1:F2');
      const t3 = sheet3.getCell('A1');
      t3.value = `BÁO CÁO DOANH THU THEO LOẠI SẢN PHẨM\n(Từ ${fromDate} đến ${toDate})`;
      t3.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
      t3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0284C7' } };
      t3.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      sheet3.getRow(3).height = 10;

      sheet3.columns = [
        { header: 'Tên Sản Phẩm', key: 'name', width: 45 },
        { header: 'Thương Hiệu', key: 'brand', width: 15 },
        { header: 'Đơn Giá', key: 'price', width: 15 },
        { header: 'SL Bán', key: 'quantity', width: 12 },
        { header: 'Doanh Thu', key: 'revenue', width: 20 },
        { header: 'Tỷ Trọng (%)', key: 'percent', width: 15 }
      ];

      const h3 = sheet3.getRow(4);
      h3.font = { name: 'Arial', size: 12, bold: true };
      h3.alignment = { vertical: 'middle', horizontal: 'center' };
      h3.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2FE' } }; applyBorder(h3); });

      const categories = [...new Set(productData.map(p => p.category))];

      categories.forEach(cat => {
        const catProducts = productData.filter(p => p.category === cat);
        const catRev = catProducts.reduce((sum, p) => sum + p.revenue, 0);
        const catQty = catProducts.reduce((sum, p) => sum + p.quantity, 0);
        const catPercent = totalGlobalRev === 0 ? 0 : (catRev / totalGlobalRev);

        const catHeader = sheet3.addRow([`Danh mục: ${cat.toUpperCase()}`, '', '', '', '', '']);
        catHeader.font = { bold: true, color: { argb: 'FF0F172A' } };
        catHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        sheet3.mergeCells(`A${catHeader.number}:F${catHeader.number}`);

        catProducts.forEach(p => {
          const row = sheet3.addRow({ name: p.productName, brand: p.brand, price: p.price, quantity: p.quantity, revenue: p.revenue });
          row.getCell('price').numFmt = '#,##0"đ"';
          row.getCell('revenue').numFmt = '#,##0"đ"';
          row.getCell('quantity').alignment = { horizontal: 'center' };
          applyBorder(row);
        });

        const catSum = sheet3.addRow(['', 'TỔNG DANH MỤC', '', catQty, catRev, catPercent]);
        catSum.font = { bold: true, color: { argb: 'FF0369A1' } };
        catSum.getCell('revenue').numFmt = '#,##0"đ"';
        catSum.getCell('percent').numFmt = '0.00%';
        catSum.getCell('quantity').alignment = { horizontal: 'center' };
        catSum.getCell('percent').alignment = { horizontal: 'center' };
        applyBorder(catSum);
        sheet3.addRow([]);
      });

      // SHEET 4: THEO THƯƠNG HIỆU
      const sheet4 = workbook.addWorksheet('Theo Thương Hiệu');
      sheet4.mergeCells('A1:F2');
      const t4 = sheet4.getCell('A1');
      t4.value = `BÁO CÁO DOANH THU THEO THƯƠNG HIỆU\n(Từ ${fromDate} đến ${toDate})`;
      t4.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
      t4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } };
      t4.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      sheet4.getRow(3).height = 10;

      sheet4.columns = [
        { header: 'Tên Sản Phẩm', key: 'name', width: 45 },
        { header: 'Phân Loại', key: 'category', width: 20 },
        { header: 'Đơn Giá', key: 'price', width: 15 },
        { header: 'SL Bán', key: 'quantity', width: 12 },
        { header: 'Doanh Thu', key: 'revenue', width: 20 },
        { header: 'Tỷ Trọng (%)', key: 'percent', width: 15 }
      ];

      const h4 = sheet4.getRow(4);
      h4.font = { name: 'Arial', size: 12, bold: true };
      h4.alignment = { vertical: 'middle', horizontal: 'center' };
      h4.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } }; applyBorder(h4); });

      const brands = [...new Set(productData.map(p => (p.brand || 'KHÁC').toUpperCase()))];

      brands.forEach(brand => {
        const brandProducts = productData.filter(p => (p.brand || 'KHÁC').toUpperCase() === brand);
        const bRev = brandProducts.reduce((sum, p) => sum + p.revenue, 0);
        const bQty = brandProducts.reduce((sum, p) => sum + p.quantity, 0);
        const bPercent = totalGlobalRev === 0 ? 0 : (bRev / totalGlobalRev);

        const bHeader = sheet4.addRow([`Thương hiệu: ${brand}`, '', '', '', '', '']);
        bHeader.font = { bold: true, color: { argb: 'FF0F172A' } };
        bHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        sheet4.mergeCells(`A${bHeader.number}:F${bHeader.number}`);

        brandProducts.forEach(p => {
          const row = sheet4.addRow({ name: p.productName, category: p.category, price: p.price, quantity: p.quantity, revenue: p.revenue });
          row.getCell('price').numFmt = '#,##0"đ"';
          row.getCell('revenue').numFmt = '#,##0"đ"';
          row.getCell('quantity').alignment = { horizontal: 'center' };
          applyBorder(row);
        });

        const bSum = sheet4.addRow(['', 'TỔNG THƯƠNG HIỆU', '', bQty, bRev, bPercent]);
        bSum.font = { bold: true, color: { argb: 'FF047857' } };
        bSum.getCell('revenue').numFmt = '#,##0"đ"';
        bSum.getCell('percent').numFmt = '0.00%';
        bSum.getCell('quantity').alignment = { horizontal: 'center' };
        bSum.getCell('percent').alignment = { horizontal: 'center' };
        applyBorder(bSum);
        sheet4.addRow([]);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `BaoCao_XSPORT_${fromDate}_${toDate}.xlsx`);

    } catch (error) {
      console.error(error);
      alert("Xuất Excel thất bại. Vui lòng kiểm tra console.");
    }
  };

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    borderRadius: '12px'
  };

  return (
      <div className="admin-dashboard-container">
        {/* TIME FILTER HEADER & SLEEK TOGGLE */}
        <div className="dashboard-top-bar" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>

          {/* HÀNG 1: TRẠNG THÁI & BỘ LỌC NHANH */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            <div className="dashboard-top-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ padding: '6px 14px', background: '#ecfdf5', color: '#059669', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #a7f3d0' }}>
                <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}></span>
                LIVE SYNC
              </div>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            </div>

            <div className="sleek-toggle-group" style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
              {['today', 'week', 'month', 'year', 'all'].map(mode => (
                  <button
                      key={mode}
                      onClick={() => setTimeFilter(mode)}
                      style={{
                        background: timeFilter === mode ? '#ffffff' : 'transparent',
                        color: timeFilter === mode ? '#0f172a' : '#64748b',
                        boxShadow: timeFilter === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                  >
                    {mode === 'today' ? 'Hôm nay' :
                        mode === 'week' ? 'Tuần này' :
                            mode === 'month' ? 'Tháng này' :
                                mode === 'year' ? 'Năm nay' : 'Tất cả'}
                  </button>
              ))}
            </div>

          </div>

          {/* HÀNG 2: BỘ LỌC TÙY CHỈNH & XUẤT EXCEL (Đẩy sang phải) */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", padding: "12px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px" }}>

            {/* Box chọn ngày được gộp chung */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '4px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <input
                  type="date"
                  value={fromDate}
                  max={toDate || todayStr}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={{ padding: "6px", border: "none", outline: "none", background: "transparent", color: '#0f172a', fontWeight: '500', cursor: 'pointer' }}
              />
              <span style={{ color: '#94a3b8', fontWeight: 'bold' }}>→</span>
              <input
                  type="date"
                  value={toDate}
                  min={fromDate}
                  onChange={(e) => setToDate(e.target.value)}
                  style={{ padding: "6px", border: "none", outline: "none", background: "transparent", color: '#0f172a', fontWeight: '500', cursor: 'pointer' }}
              />
            </div>

            <button
                onClick={() => {
                  if (fromDate && toDate) {
                    if (timeFilter === 'custom') {
                      loadDashboardData();
                    } else {
                      setTimeFilter('custom');
                    }
                  } else {
                    alert("Vui lòng chọn đầy đủ Từ ngày và Đến ngày!");
                  }
                }}
                style={{ padding: "8px 16px", border: "none", borderRadius: "6px", background: "#3b82f6", color: "white", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={(e) => e.target.style.background = "#2563eb"}
                onMouseLeave={(e) => e.target.style.background = "#3b82f6"}
            >
              Lọc KPI
            </button>

            <button
                onClick={exportToExcel}
                style={{ padding: "8px 16px", border: "none", borderRadius: "6px", background: "#10b981", color: "white", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={(e) => e.target.style.background = "#059669"}
                onMouseLeave={(e) => e.target.style.background = "#10b981"}
            >
              Xuất Excel
            </button>

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
            {renderTrend(metrics.revenueTrend)}
          </div>

          <div className="kpi-card" style={cardStyle}>
            <CartBgIcon />
            <div className="kpi-header">
              <span className="kpi-title">Đơn hàng mới</span>
              <div className="kpi-icon">📦</div>
            </div>
            <h2 className="kpi-value">{metrics.newOrders}</h2>
            {renderTrend(metrics.ordersTrend)}
          </div>

          <div className="kpi-card" style={cardStyle}>
            <UsersBgIcon />
            <div className="kpi-header">
              <span className="kpi-title">Khách hàng ĐK</span>
              <div className="kpi-icon">👥</div>
            </div>
            <h2 className="kpi-value">{metrics.activeCustomers.toLocaleString()}</h2>
            {renderTrend(metrics.customersTrend)}
          </div>

          <div className="kpi-card" style={cardStyle}>
            <GrowthBgIcon />
            <div className="kpi-header">
              <span className="kpi-title">Tỷ lệ chuyển đổi</span>
              <div className="kpi-icon">📈</div>
            </div>
            <h2 className="kpi-value">{metrics.conversionRate}%</h2>
            {renderTrend(metrics.conversionTrend)}
          </div>
        </div>

        <div className="dashboard-lower-section">
          {/* DYNAMIC PURE CSS BAR CHART */}
          <div className="dashboard-chart-section" style={cardStyle}>
            <div className="chart-header">
              <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: '700', margin: 0 }}>{chartBars.title}</h3>
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
                          width: '100%',
                          maxWidth: '45px',
                          backgroundColor: '#ffb800',
                          borderRadius: '6px 6px 0 0',
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
                  recentOrders.map((order, idx) => {const name =
                      order.user?.fullName ||
                      'Khách hàng';
                    const idStr = `#MS${(order.orderId || "").substring(0,6).toUpperCase()}`;
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
                        {getTimeAgo(order.orderDate)}
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
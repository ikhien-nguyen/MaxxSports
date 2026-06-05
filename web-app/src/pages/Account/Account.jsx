import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../data/productDetailData';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { orderService } from '../../services/orderService';
import './Account.css';

/* ── SVG Icons ─────────────────────────────────────────────── */
const CameraIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>);
const UserIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const OrderIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>);
const MapPinIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>);
const LogoutIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>);
const EditIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>);
const SaveIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>);
const CheckIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>);
const ShoppingBagIcon = () => (<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>);
const PlusIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
const TrashIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>);
const StarIcon = ({ filled }) => (<svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#ffb800' : 'none'} stroke={filled ? '#ffb800' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const PhoneSmIcon = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>);
const HomeSmIcon = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>);
const CloseModalIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const LockIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>);
const EyeIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>);
const EyeOffIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>);
const GiftIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M3 12h18v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 010-5C9 3 12 8 12 8" /><path d="M16.5 8a2.5 2.5 0 000-5C15 3 12 8 12 8" /></svg>);
const HandshakeIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>);
const TruckMiniIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 4v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>);
const TrophyIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9H3V5a1 1 0 011-1h2" /><path d="M18 9h3V5a1 1 0 00-1-1h-2" /><path d="M4 22h16" /><path d="M10 22V16" /><path d="M14 22V16" /><path d="M18 4v5a6 6 0 01-12 0V4" /></svg>);

const TIMELINE_ICONS = [GiftIcon, HandshakeIcon, TruckMiniIcon, TrophyIcon];
const TIMELINE_STEPS = ['Chờ xác nhận', 'Đã xác nhận', 'Đang giao hàng', 'Hoàn thành'];
const STATUS_CONFIG = {
  'Chờ xác nhận': { color: '#888888', bg: '#f5f5f5', step: 0 },
  'Đã xác nhận': { color: '#2563eb', bg: '#eff6ff', step: 1 },
  'Đang giao hàng': { color: '#d97706', bg: '#fffbeb', step: 2 },
  'Hoàn thành': { color: '#16a34a', bg: '#f0fdf4', step: 3 },
  'Đã hủy': { color: '#dc2626', bg: '#fef2f2', step: -1 },
};

/* Hàm map trạng thái từ Backend sang Tiếng Việt */
const mapBackendStatusToVN = (statusStr) => {
  if (!statusStr) return 'Chờ xác nhận';
  const s = statusStr.toUpperCase();
  if (s === 'CHO_THANH_TOAN' || s === 'PENDING') return 'Chờ xác nhận';
  if (s === 'CONFIRMED') return 'Đã xác nhận';
  if (s === 'SHIPPING') return 'Đang giao hàng';
  if (s === 'COMPLETED') return 'Hoàn thành';
  if (s === 'CANCELLED') return 'Đã hủy';
  return 'Chờ xác nhận';
};

const NAV_ITEMS = [
  { key: 'profile', label: 'Thông tin tài khoản', icon: UserIcon },
  { key: 'orders', label: 'Đơn hàng của tôi', icon: OrderIcon },
  { key: 'addresses', label: 'Sổ địa chỉ', icon: MapPinIcon },
  { key: 'password', label: 'Đổi mật khẩu', icon: LockIcon },
];

/* ─────────────────────────────────────────────
   HÀM CHẶN CLICK MODULE FAKE
───────────────────────────────────────────── */
const handleFakeClick = (e) => {
  e.preventDefault();
  alert('Module này đang được cập nhật. Vui lòng quay lại sau!');
};

/* ══════════════════════════════════════════════════════════════
   ACCOUNT PAGE COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function Account() {
  /* ── Auth guard ── */
  useEffect(() => {
    if (!localStorage.getItem('xsport_user')) {
      window.location.href = '/auth';
    }
  }, []);

  /* ── State Tổng ── */
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('xsport_user')) || {}; }
    catch { return {}; }
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);

  /* ── State Profile ── */
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', email: '' });
  const [saveMsg, setSaveMsg] = useState('');

  /* ── State Đổi mật khẩu ── */
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });

  /* ── State Đơn hàng (REAL API) ── */
  const [orders, setOrders] = useState([]);

  /* 🚀 LẤY DỮ LIỆU ĐƠN HÀNG TỪ BACKEND */
  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchMyOrders = async () => {
        setIsFetchingOrders(true);
        try {
          // Gọi API thật của User
          const response = await orderService.getMyOrders();
          const myOrders = response?.result || [];

          // Map dữ liệu để render lên UI
          const formattedOrders = myOrders.map(o => ({
            id: o.orderId,
            date: o.orderDate || o.createdAt,
            status: mapBackendStatusToVN(o.orderStatus),
            total: o.totalPrice,
            items: (o.items || o.cart || []).map(item => ({
              name: item.productName,
              qty: item.quantity || item.qty || 1, // Fix lỗi trường quantity
              price: item.price
            }))
          }));

          // Sắp xếp đơn mới nhất lên đầu
          setOrders(formattedOrders.reverse());
        } catch (error) {
          console.error("Lỗi khi tải đơn hàng:", error);
        } finally {
          setIsFetchingOrders(false);
        }
      };
      fetchMyOrders();
    }
  }, [activeTab]);

  /* ── Các State Địa chỉ (Giữ nguyên cấu trúc nhưng bị ẩn bởi FakeClick) ── */
  const ADDR_KEY = `xsport_addresses_${user.email || 'guest'}`;
  const [addresses, setAddresses] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ADDR_KEY)) || []; } catch { return []; }
  });
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const emptyAddr = { label: '', name: '', phone: '', city: '', district: '', ward: '', street: '', isDefault: false };
  const [addrForm, setAddrForm] = useState({ ...emptyAddr });
  const [addrErrors, setAddrErrors] = useState({});
  const [addrMsg, setAddrMsg] = useState('');

  const PROVINCES = ['TP. Hồ Chí Minh','Hà Nội','Đà Nẵng','Hải Phòng','Cần Thơ','Bình Dương','Đồng Nai','Khánh Hòa','Lâm Đồng','Thừa Thiên Huế','Quảng Ninh','Bà Rịa - Vũng Tàu','Long An','An Giang','Nghệ An'];

  useEffect(() => {
    setEditForm({ name: user.name || '', phone: user.phone || '', email: user.email || '' });
  }, [user.name, user.phone, user.email]);

  /* 🚀 LUỒNG GỌI API: Lưu hồ sơ cá nhân */
  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) return;
    setIsLoading(true);

    try {
      await userService.updateProfile({
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        address: ''
      });

      const updated = { ...user, name: editForm.name.trim(), phone: editForm.phone.trim() };
      setUser(updated);
      localStorage.setItem('xsport_user', JSON.stringify(updated));

      setIsEditing(false);
      setSaveMsg('Cập nhật thông tin thành công!');
      window.dispatchEvent(new Event('xsportDataUpdated'));
    } catch (error) {
      alert(error || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  /* 🚀 LUỒNG GỌI API: Đổi mật khẩu */
  const handleChangePassword = async () => {
    setPwMsg({ type: '', text: '' });
    if (!pwForm.current) return setPwMsg({ type: 'error', text: 'Vui lòng nhập mật khẩu hiện tại.' });
    if (pwForm.newPw.length < 6) return setPwMsg({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    if (pwForm.newPw !== pwForm.confirm) return setPwMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
    if (pwForm.current === pwForm.newPw) return setPwMsg({ type: 'error', text: 'Mật khẩu mới không được trùng mật khẩu cũ.' });

    setIsLoading(true);
    try {
      const res = await authService.changePassword({
        oldPassword: pwForm.current,
        newPassword: pwForm.newPw
      });

      if (res.result && res.result.message === "Đổi mật khẩu thành công") {
        setPwMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
        setPwForm({ current: '', newPw: '', confirm: '' });
      } else {
        setPwMsg({ type: 'error', text: res.result?.message || 'Đổi mật khẩu thất bại.' });
      }
    } catch (error) {
      setPwMsg({ type: 'error', text: error || 'Đã có lỗi xảy ra.' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setPwMsg({ type: '', text: '' }), 4000);
    }
  };

  /* 🚀 LUỒNG GỌI API: Đăng xuất tập trung */
  const handleLogout = async () => {
    if (user.email) {
      try { localStorage.setItem(`saved_cart_${user.email}`, localStorage.getItem('xsport_cart') || '[]'); } catch {}
    }
    await authService.logout();
  };

  const avatarInitial = (user.name || 'U').charAt(0).toUpperCase();

  return (
      <div className="acc-page">
        <div className="acc-breadcrumb">
          <div className="acc-breadcrumb__inner">
            <Link to="/" className="acc-breadcrumb__link">Trang chủ</Link>
            <span className="acc-breadcrumb__sep">/</span>
            <span className="acc-breadcrumb__current">Tài khoản</span>
          </div>
        </div>

        <div className="acc-container">
          <div className="acc-layout">
            <aside className="acc-sidebar">
              <div className="acc-profile-card">
                {/* 🔒 Chặn thay đổi ảnh đại diện */}
                <div className="acc-avatar-wrap" onClick={handleFakeClick}>
                  {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="acc-avatar-img" />
                  ) : (
                      <span className="acc-avatar-initial">{avatarInitial}</span>
                  )}
                  <div className="acc-avatar-overlay" aria-label="Đổi ảnh đại diện">
                    <CameraIcon />
                  </div>
                </div>
                <h3 className="acc-profile-name">{user.name || 'Khách hàng'}</h3>
                <span className="acc-profile-email">{user.email || ''}</span>
                {user.role && <span className="acc-profile-badge">{user.role}</span>}
              </div>

              <nav className="acc-nav" aria-label="Menu tài khoản">
                {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        type="button"
                        className={`acc-nav__item${activeTab === key ? ' acc-nav__item--active' : ''}`}
                        onClick={(e) => {
                          // 🔒 Chặn click vào tab Sổ địa chỉ
                          if (key === 'addresses') {
                            handleFakeClick(e);
                          } else {
                            setActiveTab(key);
                          }
                        }}
                    >
                      <Icon /><span>{label}</span>
                    </button>
                ))}
                <button type="button" className="acc-nav__item acc-nav__item--logout" onClick={handleLogout}>
                  <LogoutIcon /><span>Đăng xuất</span>
                </button>
              </nav>
            </aside>

            <main className="acc-content">
              {activeTab === 'profile' && (
                  <section className="acc-section">
                    <div className="acc-section__header">
                      <h2 className="acc-section__title">Thông tin tài khoản</h2>
                      {!isEditing && (
                          <button type="button" className="acc-edit-btn" onClick={() => setIsEditing(true)}>
                            <EditIcon /> Chỉnh sửa
                          </button>
                      )}
                    </div>

                    {saveMsg && <div className="acc-save-msg"><CheckIcon /> {saveMsg}</div>}

                    {isEditing ? (
                        <div className="acc-form">
                          <div className="acc-form__field">
                            <label className="acc-form__label">Họ tên <span className="acc-req">*</span></label>
                            <input type="text" className="acc-form__input" value={editForm.name}
                                   onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} />
                          </div>
                          <div className="acc-form__field">
                            <label className="acc-form__label">Email (Không thể thay đổi)</label>
                            <input type="email" className="acc-form__input" style={{ backgroundColor: '#f5f5f5', color: '#888' }} value={editForm.email} readOnly />
                          </div>
                          <div className="acc-form__field">
                            <label className="acc-form__label">Số điện thoại</label>
                            <input type="tel" className="acc-form__input" value={editForm.phone}
                                   onChange={(e) => setEditForm(p => ({ ...p, phone: e.target.value }))} />
                          </div>
                          <div className="acc-form__actions">
                            <button type="button" className="acc-btn acc-btn--primary" onClick={handleSaveProfile} disabled={isLoading}>
                              {isLoading ? 'Đang lưu...' : <><SaveIcon /> Lưu thay đổi</>}
                            </button>
                            <button type="button" className="acc-btn acc-btn--ghost" disabled={isLoading} onClick={() => { setIsEditing(false); setEditForm({ name: user.name || '', phone: user.phone || '', email: user.email || '' }); }}>
                              Hủy
                            </button>
                          </div>
                        </div>
                    ) : (
                        <div className="acc-info-grid">
                          <div className="acc-info-item"><span className="acc-info-label">Họ tên</span><span className="acc-info-value">{user.name || '—'}</span></div>
                          <div className="acc-info-item"><span className="acc-info-label">Email</span><span className="acc-info-value">{user.email || '—'}</span></div>
                          <div className="acc-info-item"><span className="acc-info-label">Số điện thoại</span><span className="acc-info-value">{user.phone || 'Chưa cập nhật'}</span></div>
                          <div className="acc-info-item"><span className="acc-info-label">Vai trò</span><span className="acc-info-value acc-info-value--badge">{user.role || 'CUSTOMER'}</span></div>
                        </div>
                    )}
                  </section>
              )}

              {/* PHẦN ĐƠN HÀNG LẤY TỪ REAL DATA (API) */}
              {activeTab === 'orders' && (
                  <section className="acc-section">
                    <div className="acc-section__header">
                      <h2 className="acc-section__title">Đơn hàng của tôi</h2>
                      <span className="acc-section__count">{orders.length} đơn hàng</span>
                    </div>

                    {isFetchingOrders ? (
                        <div className="acc-empty">
                          <h3>Đang tải dữ liệu đơn hàng...</h3>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="acc-empty">
                          <ShoppingBagIcon />
                          <h3>Bạn chưa có đơn hàng nào</h3>
                          <p>Hãy khám phá các sản phẩm mới nhất!</p>
                          <Link to="/tat-ca-san-pham" className="acc-btn acc-btn--primary">Mua sắm ngay</Link>
                        </div>
                    ) : (
                        <div className="acc-orders-list">
                          {orders.map((order) => {
                            let currentStep = TIMELINE_STEPS.indexOf(order.status);
                            if (currentStep === -1) currentStep = 0;
                            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Chờ xác nhận'];

                            return (
                                <div className="acc-order-card" key={order.id}>
                                  <div className="acc-order-card__head">
                                    <div className="acc-order-card__id-group">
                                      <span className="acc-order-card__id">
                                        #MS{order.id ? order.id.toString().substring(0,6).toUpperCase() : 'N/A'}
                                      </span>
                                      <span className="acc-order-card__date">
                                        {order.date ? new Date(order.date).toLocaleString('vi-VN') : ''}
                                      </span>
                                    </div>
                                    <span className="acc-order-card__status" style={{ color: cfg.color, background: cfg.bg }}>
                                      {order.status}
                                    </span>
                                  </div>
                                  <div className="acc-order-card__items">
                                    {order.items && order.items.map((item, i) => (
                                        <div className="acc-order-card__item" key={i}>
                                          <span className="acc-order-card__item-name">{item.name}</span>
                                          <span className="acc-order-card__item-meta">x{item.qty || 1} — {formatPrice(item.price)}</span>
                                        </div>
                                    ))}
                                  </div>

                                  {order.status !== 'Đã hủy' && (
                                      <div className="acc-timeline">
                                        {TIMELINE_STEPS.map((step, idx) => {
                                          const done = idx <= currentStep;
                                          const isActive = idx === currentStep;
                                          const StepIcon = TIMELINE_ICONS[idx];
                                          return (
                                              <div className={`acc-timeline__step${done ? ' acc-timeline__step--done' : ''}${isActive ? ' acc-timeline__step--active' : ''}`} key={step}>
                                                <div className="acc-timeline__dot"><StepIcon /></div>
                                                {idx < TIMELINE_STEPS.length - 1 && <div className={`acc-timeline__line${done && idx < currentStep ? ' acc-timeline__line--done' : ''}`} />}
                                                <span className="acc-timeline__label">{step}</span>
                                              </div>
                                          );
                                        })}
                                      </div>
                                  )}

                                  <div className="acc-order-card__footer">
                                    <span>Tổng cộng</span>
                                    <strong className="acc-order-card__total">{formatPrice(order.total)}</strong>
                                  </div>
                                </div>
                            );
                          })}
                        </div>
                    )}
                  </section>
              )}

              {/* Phần Sổ địa chỉ */}
              {activeTab === 'addresses' && (
                  <section className="acc-section">
                    <div className="acc-section__header">
                      <h2 className="acc-section__title">Sổ địa chỉ</h2>
                    </div>
                  </section>
              )}

              {activeTab === 'password' && (
                  <section className="acc-section">
                    <div className="acc-section__header">
                      <h2 className="acc-section__title">Đổi mật khẩu</h2>
                    </div>
                    <p className="acc-pw-subtitle">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.</p>

                    {pwMsg.text && (
                        <div className={`acc-pw-msg acc-pw-msg--${pwMsg.type}`}>
                          {pwMsg.type === 'success' ? <CheckIcon /> : <span className="acc-pw-msg__icon">⚠</span>}
                          {pwMsg.text}
                        </div>
                    )}

                    <div className="acc-form acc-form--pw">
                      <div className="acc-form__field">
                        <label className="acc-form__label">Mật khẩu hiện tại <span className="acc-req">*</span></label>
                        <div className="acc-pw-input-wrap">
                          <input type={showPw.current ? 'text' : 'password'} className="acc-form__input acc-form__input--pw"
                                 value={pwForm.current} onChange={(e) => setPwForm(p => ({ ...p, current: e.target.value }))} placeholder="Nhập mật khẩu hiện tại" />
                          <button type="button" className="acc-pw-toggle" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))}>
                            {showPw.current ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                      </div>
                      <div className="acc-form__field">
                        <label className="acc-form__label">Mật khẩu mới <span className="acc-req">*</span></label>
                        <div className="acc-pw-input-wrap">
                          <input type={showPw.newPw ? 'text' : 'password'} className="acc-form__input acc-form__input--pw"
                                 value={pwForm.newPw} onChange={(e) => setPwForm(p => ({ ...p, newPw: e.target.value }))} placeholder="Ít nhất 6 ký tự" />
                          <button type="button" className="acc-pw-toggle" onClick={() => setShowPw(p => ({ ...p, newPw: !p.newPw }))}>
                            {showPw.newPw ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                      </div>
                      <div className="acc-form__field">
                        <label className="acc-form__label">Xác nhận mật khẩu mới <span className="acc-req">*</span></label>
                        <div className="acc-pw-input-wrap">
                          <input type={showPw.confirm ? 'text' : 'password'} className="acc-form__input acc-form__input--pw"
                                 value={pwForm.confirm} onChange={(e) => setPwForm(p => ({ ...p, confirm: e.target.value }))} placeholder="Nhập lại mật khẩu mới" />
                          <button type="button" className="acc-pw-toggle" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}>
                            {showPw.confirm ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                      </div>
                      <button type="button" className="acc-btn acc-btn--pw-submit" onClick={handleChangePassword} disabled={isLoading}>
                        {isLoading ? 'Đang cập nhật...' : <><LockIcon /> Cập nhật mật khẩu</>}
                      </button>
                    </div>
                  </section>
              )}
            </main>
          </div>
        </div>
      </div>
  );
}
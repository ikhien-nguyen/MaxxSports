import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../data/productDetailData';
import './Account.css';

/* ── SVG Icons ─────────────────────────────────────────────── */
const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const OrderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ShoppingBagIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#ffb800' : 'none'} stroke={filled ? '#ffb800' : 'currentColor'}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const PhoneSmIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const HomeSmIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const CloseModalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
/* ── Timeline Micro-Icons (per status step) ───────────────── */
const GiftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" />
    <path d="M3 12h18v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 010-5C9 3 12 8 12 8" /><path d="M16.5 8a2.5 2.5 0 000-5C15 3 12 8 12 8" />
  </svg>
);
const HandshakeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const TruckMiniIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 4v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const TrophyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9H3V5a1 1 0 011-1h2" /><path d="M18 9h3V5a1 1 0 00-1-1h-2" />
    <path d="M4 22h16" /><path d="M10 22V16" /><path d="M14 22V16" />
    <path d="M18 4v5a6 6 0 01-12 0V4" />
  </svg>
);
const TIMELINE_ICONS = [GiftIcon, HandshakeIcon, TruckMiniIcon, TrophyIcon];

/* ── Seed Orders (shown on first visit, merged with real orders) ── */
const SEED_ORDERS = [
  {
    id: '#MS20260501',
    date: '01/05/2026',
    items: [
      { name: 'Giày Nike Air Zoom Pegasus 41', qty: 1, price: 3290000 },
      { name: 'Áo Tank Top adidas D4T Primelft', qty: 2, price: 900000 },
    ],
    total: 5090000,
    status: 'Hoàn thành',
  },
  {
    id: '#MS20260505',
    date: '05/05/2026',
    items: [
      { name: 'Vợt cầu lông Yonex Astrox 88D', qty: 1, price: 4500000 },
    ],
    total: 4500000,
    status: 'Đang giao hàng',
  },
  {
    id: '#MS20260507',
    date: '07/05/2026',
    items: [
      { name: 'Quần short chạy bộ adidas Own The Run', qty: 1, price: 1050000 },
      { name: 'Dép quai ngang Nike Air Max Cirro', qty: 1, price: 1599000 },
    ],
    total: 2649000,
    status: 'Đã xác nhận',
  },
  {
    id: '#MS20260507B',
    date: '07/05/2026',
    items: [
      { name: 'Balo thể thao Nike Brasilia 9.5', qty: 1, price: 1250000 },
    ],
    total: 1250000,
    status: 'Chờ xác nhận',
  },
];

/* ── Helper: merge seed + localStorage orders, deduplicate by id ── */
function loadOrders() {
  try {
    const stored = JSON.parse(localStorage.getItem('maxxsport_orders') || '[]');
    const merged = [...stored];
    const ids = new Set(stored.map(o => o.id));
    for (const seed of SEED_ORDERS) {
      if (!ids.has(seed.id)) merged.push(seed);
    }
    return merged;
  } catch {
    return [...SEED_ORDERS];
  }
}

const STATUS_CONFIG = {
  'Chờ xác nhận': { color: '#888888', bg: '#f5f5f5', step: 0 },
  'Đã xác nhận': { color: '#2563eb', bg: '#eff6ff', step: 1 },
  'Đang giao hàng': { color: '#d97706', bg: '#fffbeb', step: 2 },
  'Hoàn thành': { color: '#16a34a', bg: '#f0fdf4', step: 3 },
};

const TIMELINE_STEPS = ['Chờ xác nhận', 'Đã xác nhận', 'Đang giao hàng', 'Hoàn thành'];

/* ── Sidebar nav items ─────────────────────────────────────── */
const NAV_ITEMS = [
  { key: 'profile', label: 'Thông tin tài khoản', icon: UserIcon },
  { key: 'orders', label: 'Đơn hàng của tôi', icon: OrderIcon },
  { key: 'addresses', label: 'Sổ địa chỉ', icon: MapPinIcon },
  { key: 'password', label: 'Đổi mật khẩu', icon: LockIcon },
];

/* ══════════════════════════════════════════════════════════════
   ACCOUNT PAGE COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function Account() {
  /* ── Auth guard ── */
  useEffect(() => {
    if (!localStorage.getItem('maxxsport_user')) {
      window.location.href = '/auth';
    }
  }, []);

  /* ── User state ── */
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('maxxsport_user')) || {}; }
    catch { return {}; }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', email: '' });
  const [saveMsg, setSaveMsg] = useState('');
  const fileInputRef = useRef(null);
  /* ── Change Password state ── */
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });

  /* ── Orders state (dynamic from localStorage) ── */
  const [orders, setOrders] = useState(loadOrders);

  /* ── Listen for systemDataUpdated to refresh orders in real-time ── */
  useEffect(() => {
    const refresh = () => setOrders(loadOrders());
    window.addEventListener('systemDataUpdated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('systemDataUpdated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  /* ── Address Book state ── */
  const ADDR_KEY = `maxxsport_addresses_${user.email || 'guest'}`;
  const [addresses, setAddresses] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ADDR_KEY)) || []; } catch { return []; }
  });
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const emptyAddr = { label: '', name: '', phone: '', city: '', district: '', ward: '', street: '', isDefault: false };
  const [addrForm, setAddrForm] = useState({ ...emptyAddr });
  const [addrErrors, setAddrErrors] = useState({});
  const [addrMsg, setAddrMsg] = useState('');

  const saveAddresses = (list) => { setAddresses(list); localStorage.setItem(ADDR_KEY, JSON.stringify(list)); };

  const openAddrAdd = () => { setEditingAddr(null); setAddrForm({ ...emptyAddr, isDefault: addresses.length === 0 }); setAddrErrors({}); setShowAddrForm(true); };
  const openAddrEdit = (addr) => { setEditingAddr(addr.id); setAddrForm({ ...addr }); setAddrErrors({}); setShowAddrForm(true); };
  const closeAddrForm = () => { setShowAddrForm(false); setEditingAddr(null); setAddrErrors({}); };

  const validateAddr = () => {
    const e = {};
    if (!addrForm.name.trim()) e.name = 'Bắt buộc';
    if (!addrForm.phone.trim()) e.phone = 'Bắt buộc';
    else if (!/^[0-9]{9,11}$/.test(addrForm.phone.replace(/\s/g, ''))) e.phone = 'Không hợp lệ';
    if (!addrForm.city.trim()) e.city = 'Bắt buộc';
    if (!addrForm.street.trim()) e.street = 'Bắt buộc';
    setAddrErrors(e); return Object.keys(e).length === 0;
  };

  const handleSaveAddr = () => {
    if (!validateAddr()) return;
    let list;
    if (editingAddr) {
      list = addresses.map(a => a.id === editingAddr ? { ...addrForm, id: editingAddr } : a);
    } else {
      list = [...addresses, { ...addrForm, id: Date.now().toString() }];
    }
    if (addrForm.isDefault) list = list.map(a => ({ ...a, isDefault: a.id === (editingAddr || list[list.length - 1].id) }));
    saveAddresses(list); closeAddrForm();
    setAddrMsg(editingAddr ? 'Cập nhật địa chỉ thành công!' : 'Thêm địa chỉ thành công!');
    setTimeout(() => setAddrMsg(''), 3000);
  };

  const handleDeleteAddr = (id) => {
    const list = addresses.filter(a => a.id !== id);
    if (list.length > 0 && !list.some(a => a.isDefault)) list[0].isDefault = true;
    saveAddresses(list);
    setAddrMsg('Đã xóa địa chỉ.'); setTimeout(() => setAddrMsg(''), 3000);
  };

  const handleSetDefault = (id) => {
    const list = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    saveAddresses(list);
  };

  const PROVINCES = ['TP. Hồ Chí Minh','Hà Nội','Đà Nẵng','Hải Phòng','Cần Thơ','Bình Dương','Đồng Nai','Khánh Hòa','Lâm Đồng','Thừa Thiên Huế','Quảng Ninh','Bà Rịa - Vũng Tàu','Long An','An Giang','Nghệ An'];

  /* ── Init edit form when user changes ── */
  useEffect(() => {
    setEditForm({ name: user.name || '', phone: user.phone || '', email: user.email || '' });
  }, [user.name, user.phone, user.email]);

  /* ── Avatar upload via FileReader ── */
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Vui lòng chọn file ảnh.'); return; }
    if (file.size > 2 * 1024 * 1024) { alert('Ảnh tối đa 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const updated = { ...user, avatar: reader.result };
      setUser(updated);
      localStorage.setItem('maxxsport_user', JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  /* ── Save profile edits ── */
  const handleSaveProfile = () => {
    if (!editForm.name.trim()) return;
    const updated = { ...user, name: editForm.name.trim(), phone: editForm.phone.trim(), email: editForm.email.trim() };
    setUser(updated);
    localStorage.setItem('maxxsport_user', JSON.stringify(updated));
    setIsEditing(false);
    setSaveMsg('Cập nhật thành công!');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  /* ── Logout: backup cart, clear, redirect ── */
  const handleLogout = () => {
    if (user.email) {
      try { localStorage.setItem(`saved_cart_${user.email}`, localStorage.getItem('maxxsport_cart') || '[]'); } catch {}
    }
    localStorage.setItem('maxxsport_cart', '[]');
    localStorage.removeItem('maxxsport_user');
    window.dispatchEvent(new Event('cartUpdated'));
    window.location.href = '/';
  };

  /* ── Change Password handler ── */
  const handleChangePassword = () => {
    setPwMsg({ type: '', text: '' });
    if (!pwForm.current) { setPwMsg({ type: 'error', text: 'Vui lòng nhập mật khẩu hiện tại.' }); return; }
    if (pwForm.newPw.length < 6) { setPwMsg({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' }); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' }); return; }
    if (pwForm.current === pwForm.newPw) { setPwMsg({ type: 'error', text: 'Mật khẩu mới không được trùng mật khẩu cũ.' }); return; }
    setPwMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
    setPwForm({ current: '', newPw: '', confirm: '' });
    setTimeout(() => setPwMsg({ type: '', text: '' }), 4000);
  };

  /* ── Render helpers ── */
  const avatarInitial = (user.name || 'U').charAt(0).toUpperCase();

  /* ══════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════ */
  return (
    <div className="acc-page">
      {/* ── Breadcrumb ── */}
      <div className="acc-breadcrumb">
        <div className="acc-breadcrumb__inner">
          <Link to="/" className="acc-breadcrumb__link">Trang chủ</Link>
          <span className="acc-breadcrumb__sep">/</span>
          <span className="acc-breadcrumb__current">Tài khoản</span>
        </div>
      </div>

      <div className="acc-container">
        <div className="acc-layout">

          {/* ════════════ SIDEBAR (25%) ════════════ */}
          <aside className="acc-sidebar">
            {/* Profile card */}
            <div className="acc-profile-card">
              <div className="acc-avatar-wrap" onClick={() => fileInputRef.current?.click()}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="acc-avatar-img" />
                ) : (
                  <span className="acc-avatar-initial">{avatarInitial}</span>
                )}
                <div className="acc-avatar-overlay" aria-label="Đổi ảnh đại diện">
                  <CameraIcon />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                  id="avatar-upload"
                />
              </div>
              <h3 className="acc-profile-name">{user.name || 'Khách hàng'}</h3>
              <span className="acc-profile-email">{user.email || ''}</span>
              {user.role && (
                <span className="acc-profile-badge">{user.role}</span>
              )}
            </div>

            {/* Nav menu */}
            <nav className="acc-nav" aria-label="Menu tài khoản">
              {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  className={`acc-nav__item${activeTab === key ? ' acc-nav__item--active' : ''}`}
                  onClick={() => setActiveTab(key)}
                  id={`acc-tab-${key}`}
                >
                  <Icon />
                  <span>{label}</span>
                </button>
              ))}
              <button
                type="button"
                className="acc-nav__item acc-nav__item--logout"
                onClick={handleLogout}
                id="acc-logout-btn"
              >
                <LogoutIcon />
                <span>Đăng xuất</span>
              </button>
            </nav>
          </aside>

          {/* ════════════ MAIN CONTENT (75%) ════════════ */}
          <main className="acc-content">
            {/* ── TAB: Profile ── */}
            {activeTab === 'profile' && (
              <section className="acc-section" id="acc-profile-section">
                <div className="acc-section__header">
                  <h2 className="acc-section__title">Thông tin tài khoản</h2>
                  {!isEditing && (
                    <button type="button" className="acc-edit-btn" onClick={() => setIsEditing(true)}>
                      <EditIcon /> Chỉnh sửa
                    </button>
                  )}
                </div>

                {saveMsg && (
                  <div className="acc-save-msg"><CheckIcon /> {saveMsg}</div>
                )}

                {isEditing ? (
                  <div className="acc-form">
                    <div className="acc-form__field">
                      <label className="acc-form__label" htmlFor="acc-edit-name">Họ tên <span className="acc-req">*</span></label>
                      <input id="acc-edit-name" type="text" className="acc-form__input" value={editForm.name}
                        onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} autoComplete="name" />
                    </div>
                    <div className="acc-form__field">
                      <label className="acc-form__label" htmlFor="acc-edit-email">Email</label>
                      <input id="acc-edit-email" type="email" className="acc-form__input" value={editForm.email}
                        onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))} autoComplete="email" />
                    </div>
                    <div className="acc-form__field">
                      <label className="acc-form__label" htmlFor="acc-edit-phone">Số điện thoại</label>
                      <input id="acc-edit-phone" type="tel" className="acc-form__input" value={editForm.phone}
                        onChange={(e) => setEditForm(p => ({ ...p, phone: e.target.value }))} autoComplete="tel" />
                    </div>
                    <div className="acc-form__actions">
                      <button type="button" className="acc-btn acc-btn--primary" onClick={handleSaveProfile}>
                        <SaveIcon /> Lưu thay đổi
                      </button>
                      <button type="button" className="acc-btn acc-btn--ghost" onClick={() => { setIsEditing(false); setEditForm({ name: user.name || '', phone: user.phone || '', email: user.email || '' }); }}>
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="acc-info-grid">
                    <div className="acc-info-item">
                      <span className="acc-info-label">Họ tên</span>
                      <span className="acc-info-value">{user.name || '—'}</span>
                    </div>
                    <div className="acc-info-item">
                      <span className="acc-info-label">Email</span>
                      <span className="acc-info-value">{user.email || '—'}</span>
                    </div>
                    <div className="acc-info-item">
                      <span className="acc-info-label">Số điện thoại</span>
                      <span className="acc-info-value">{user.phone || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="acc-info-item">
                      <span className="acc-info-label">Vai trò</span>
                      <span className="acc-info-value acc-info-value--badge">{user.role || 'CUSTOMER'}</span>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ── TAB: Orders ── */}
            {activeTab === 'orders' && (
              <section className="acc-section" id="acc-orders-section">
                <div className="acc-section__header">
                  <h2 className="acc-section__title">Đơn hàng của tôi</h2>
                  <span className="acc-section__count">{orders.length} đơn hàng</span>
                </div>

                {orders.length === 0 ? (
                  <div className="acc-empty">
                    <ShoppingBagIcon />
                    <h3>Bạn chưa có đơn hàng nào</h3>
                    <p>Hãy khám phá các sản phẩm mới nhất!</p>
                    <Link to="/new-arrivals" className="acc-btn acc-btn--primary">Mua sắm ngay</Link>
                  </div>
                ) : (
                  <div className="acc-orders-list">
                    {orders.map((order) => {
                      const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Chờ xác nhận'];
                      const currentStep = cfg.step;
                      return (
                        <div className="acc-order-card" key={order.id}>
                          {/* Header row */}
                          <div className="acc-order-card__head">
                            <div className="acc-order-card__id-group">
                              <span className="acc-order-card__id">{order.id}</span>
                              <span className="acc-order-card__date">{order.date}</span>
                            </div>
                            <span className="acc-order-card__status" style={{ color: cfg.color, background: cfg.bg }}>
                              {order.status}
                            </span>
                          </div>

                          {/* Items */}
                          <div className="acc-order-card__items">
                            {order.items.map((item, i) => (
                              <div className="acc-order-card__item" key={i}>
                                <span className="acc-order-card__item-name">{item.name}</span>
                                <span className="acc-order-card__item-meta">x{item.qty} — {formatPrice(item.price)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Timeline progress with micro-icons */}
                          <div className="acc-timeline">
                            {TIMELINE_STEPS.map((step, idx) => {
                              const done = idx <= currentStep;
                              const isActive = idx === currentStep;
                              const StepIcon = TIMELINE_ICONS[idx];
                              return (
                                <div className={`acc-timeline__step${done ? ' acc-timeline__step--done' : ''}${isActive ? ' acc-timeline__step--active' : ''}`} key={step}>
                                  <div className={`acc-timeline__dot acc-timeline__dot--s${idx}`}>
                                    <StepIcon />
                                  </div>
                                  {idx < TIMELINE_STEPS.length - 1 && (
                                    <div className={`acc-timeline__line${done && idx < currentStep ? ' acc-timeline__line--done' : ''}`} />
                                  )}
                                  <span className="acc-timeline__label">{step}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Total */}
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

            {/* ── TAB: Addresses ── */}
            {activeTab === 'addresses' && (
              <section className="acc-section" id="acc-addresses-section">
                <div className="acc-section__header">
                  <h2 className="acc-section__title">Sổ địa chỉ</h2>
                  <div className="acc-addr-header-right">
                    <span className="acc-section__count">{addresses.length} địa chỉ</span>
                    <button type="button" className="acc-btn acc-btn--primary acc-btn--sm" onClick={openAddrAdd} id="add-addr-btn">
                      <PlusIcon /> Thêm địa chỉ
                    </button>
                  </div>
                </div>

                {addrMsg && <div className="acc-save-msg"><CheckIcon /> {addrMsg}</div>}

                {/* ── Address Form Modal ── */}
                {showAddrForm && (
                  <div className="acc-addr-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeAddrForm(); }}>
                    <div className="acc-addr-modal">
                      <div className="acc-addr-modal__head">
                        <h3>{editingAddr ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                        <button type="button" className="acc-addr-modal__close" onClick={closeAddrForm}><CloseModalIcon /></button>
                      </div>
                      <div className="acc-addr-modal__body">
                        <div className="acc-form__field">
                          <label className="acc-form__label">Tên gợi nhớ</label>
                          <input className="acc-form__input" placeholder='VD: Nhà riêng, Văn phòng…' value={addrForm.label} onChange={e => setAddrForm(p => ({ ...p, label: e.target.value }))} />
                        </div>
                        <div className="acc-addr-row">
                          <div className="acc-form__field">
                            <label className="acc-form__label">Họ tên <span className="acc-req">*</span></label>
                            <input className={`acc-form__input${addrErrors.name ? ' acc-form__input--err' : ''}`} value={addrForm.name} onChange={e => setAddrForm(p => ({ ...p, name: e.target.value }))} />
                            {addrErrors.name && <span className="acc-addr-err">{addrErrors.name}</span>}
                          </div>
                          <div className="acc-form__field">
                            <label className="acc-form__label">Số điện thoại <span className="acc-req">*</span></label>
                            <input className={`acc-form__input${addrErrors.phone ? ' acc-form__input--err' : ''}`} value={addrForm.phone} onChange={e => setAddrForm(p => ({ ...p, phone: e.target.value }))} />
                            {addrErrors.phone && <span className="acc-addr-err">{addrErrors.phone}</span>}
                          </div>
                        </div>
                        <div className="acc-addr-row">
                          <div className="acc-form__field">
                            <label className="acc-form__label">Tỉnh/Thành phố <span className="acc-req">*</span></label>
                            <select className={`acc-form__input${addrErrors.city ? ' acc-form__input--err' : ''}`} value={addrForm.city} onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))}>
                              <option value="">Chọn tỉnh/thành phố</option>
                              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            {addrErrors.city && <span className="acc-addr-err">{addrErrors.city}</span>}
                          </div>
                          <div className="acc-form__field">
                            <label className="acc-form__label">Quận/Huyện</label>
                            <input className="acc-form__input" value={addrForm.district} onChange={e => setAddrForm(p => ({ ...p, district: e.target.value }))} />
                          </div>
                        </div>
                        <div className="acc-form__field">
                          <label className="acc-form__label">Phường/Xã</label>
                          <input className="acc-form__input" value={addrForm.ward} onChange={e => setAddrForm(p => ({ ...p, ward: e.target.value }))} />
                        </div>
                        <div className="acc-form__field">
                          <label className="acc-form__label">Địa chỉ cụ thể <span className="acc-req">*</span></label>
                          <input className={`acc-form__input${addrErrors.street ? ' acc-form__input--err' : ''}`} placeholder="Số nhà, tên đường…" value={addrForm.street} onChange={e => setAddrForm(p => ({ ...p, street: e.target.value }))} />
                          {addrErrors.street && <span className="acc-addr-err">{addrErrors.street}</span>}
                        </div>
                        <label className="acc-addr-default-check">
                          <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm(p => ({ ...p, isDefault: e.target.checked }))} />
                          <span>Đặt làm địa chỉ mặc định</span>
                        </label>
                      </div>
                      <div className="acc-addr-modal__foot">
                        <button type="button" className="acc-btn acc-btn--ghost" onClick={closeAddrForm}>Hủy</button>
                        <button type="button" className="acc-btn acc-btn--primary" onClick={handleSaveAddr}><SaveIcon /> {editingAddr ? 'Cập nhật' : 'Lưu địa chỉ'}</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Address Cards ── */}
                {addresses.length === 0 ? (
                  <div className="acc-empty">
                    <MapPinIcon />
                    <h3>Chưa có địa chỉ nào</h3>
                    <p>Thêm địa chỉ giao hàng để đặt hàng nhanh hơn.</p>
                    <button type="button" className="acc-btn acc-btn--primary" onClick={openAddrAdd}>Thêm địa chỉ mới</button>
                  </div>
                ) : (
                  <div className="acc-addr-list">
                    {addresses.map(addr => (
                      <div className={`acc-addr-card${addr.isDefault ? ' acc-addr-card--default' : ''}`} key={addr.id}>
                        <div className="acc-addr-card__top">
                          <div className="acc-addr-card__label-row">
                            <span className="acc-addr-card__label">{addr.label || 'Địa chỉ'}</span>
                            {addr.isDefault && <span className="acc-addr-badge">Mặc định</span>}
                          </div>
                          <div className="acc-addr-card__actions">
                            <button type="button" className="acc-addr-action" title="Chỉnh sửa" onClick={() => openAddrEdit(addr)}><EditIcon /></button>
                            <button type="button" className="acc-addr-action acc-addr-action--del" title="Xóa" onClick={() => handleDeleteAddr(addr.id)}><TrashIcon /></button>
                          </div>
                        </div>
                        <div className="acc-addr-card__body">
                          <div className="acc-addr-card__row"><strong>{addr.name}</strong></div>
                          <div className="acc-addr-card__row acc-addr-card__row--meta"><PhoneSmIcon /> {addr.phone}</div>
                          <div className="acc-addr-card__row acc-addr-card__row--meta"><HomeSmIcon /> {[addr.street, addr.ward, addr.district, addr.city].filter(Boolean).join(', ')}</div>
                        </div>
                        {!addr.isDefault && (
                          <button type="button" className="acc-addr-card__set-default" onClick={() => handleSetDefault(addr.id)}>
                            <StarIcon filled={false} /> Đặt làm mặc định
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── TAB: Change Password ── */}
            {activeTab === 'password' && (
              <section className="acc-section" id="acc-password-section">
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
                  {/* Current Password */}
                  <div className="acc-form__field">
                    <label className="acc-form__label" htmlFor="acc-pw-current">Mật khẩu hiện tại <span className="acc-req">*</span></label>
                    <div className="acc-pw-input-wrap">
                      <input id="acc-pw-current" type={showPw.current ? 'text' : 'password'} className="acc-form__input acc-form__input--pw"
                        value={pwForm.current} onChange={(e) => setPwForm(p => ({ ...p, current: e.target.value }))} placeholder="Nhập mật khẩu hiện tại" autoComplete="current-password" />
                      <button type="button" className="acc-pw-toggle" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))} aria-label="Toggle">
                        {showPw.current ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>
                  {/* New Password */}
                  <div className="acc-form__field">
                    <label className="acc-form__label" htmlFor="acc-pw-new">Mật khẩu mới <span className="acc-req">*</span></label>
                    <div className="acc-pw-input-wrap">
                      <input id="acc-pw-new" type={showPw.newPw ? 'text' : 'password'} className="acc-form__input acc-form__input--pw"
                        value={pwForm.newPw} onChange={(e) => setPwForm(p => ({ ...p, newPw: e.target.value }))} placeholder="Ít nhất 6 ký tự" autoComplete="new-password" />
                      <button type="button" className="acc-pw-toggle" onClick={() => setShowPw(p => ({ ...p, newPw: !p.newPw }))} aria-label="Toggle">
                        {showPw.newPw ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>
                  {/* Confirm */}
                  <div className="acc-form__field">
                    <label className="acc-form__label" htmlFor="acc-pw-confirm">Xác nhận mật khẩu mới <span className="acc-req">*</span></label>
                    <div className="acc-pw-input-wrap">
                      <input id="acc-pw-confirm" type={showPw.confirm ? 'text' : 'password'} className="acc-form__input acc-form__input--pw"
                        value={pwForm.confirm} onChange={(e) => setPwForm(p => ({ ...p, confirm: e.target.value }))} placeholder="Nhập lại mật khẩu mới" autoComplete="new-password" />
                      <button type="button" className="acc-pw-toggle" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))} aria-label="Toggle">
                        {showPw.confirm ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>
                  <button type="button" className="acc-btn acc-btn--pw-submit" onClick={handleChangePassword} id="change-password-btn">
                    <LockIcon /> Cập nhật mật khẩu
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

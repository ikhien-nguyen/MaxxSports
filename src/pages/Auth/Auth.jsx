import { useState, useEffect } from 'react';
import './Auth.css';

/* ─────────────────────────────────────────────
   MOCK DATABASE — Role-based users
───────────────────────────────────────────── */
const mockUsers = [
  { email: 'user@gmail.com', password: 'user123', role: 'CUSTOMER', name: 'Khách hàng' },
  { email: 'admin@maxxsport.com', password: 'admin123', role: 'ADMIN', name: 'Quản trị viên' },
];

/* ─────────────────────────────────────────────
   INLINE SVG ICONS
───────────────────────────────────────────── */
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const PersonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

/* ─────────────────────────────────────────────
   AUTH PAGE COMPONENT
   Renders inside MainLayout (<Header /> + <main> + <Footer />)
───────────────────────────────────────────── */
export default function Auth() {
  /* ── Persisted user state (localStorage) ── */
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('maxxsport_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  /* Sync user → localStorage */
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('maxxsport_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('maxxsport_user');
    }
  }, [currentUser]);

  /* If already logged in, redirect to home */
  useEffect(() => {
    if (currentUser) {
      window.location.href = '/';
    }
  }, []);

  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* ── Handlers ── */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const toggleView = () => {
    setIsLoginView((prev) => !prev);
    setFormData({ email: '', password: '', name: '', phone: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLoginView) {
      /* ── LOGIN ── */
      const user = mockUsers.find(
        (u) => u.email === formData.email && u.password === formData.password
      );
      if (user) {
        /* Persist user (without password) to localStorage */
        const persistedUser = { email: user.email, name: user.name, role: user.role };
        localStorage.setItem('maxxsport_user', JSON.stringify(persistedUser));
        setCurrentUser(persistedUser);
        alert('Đăng nhập thành công! Quyền: ' + user.role + ' — Xin chào, ' + user.name);
        window.location.href = '/';
      } else {
        setError('Email hoặc mật khẩu không đúng.');
      }
    } else {
      /* ── REGISTER ── */
      if (!formData.name.trim()) {
        setError('Vui lòng nhập họ tên.');
        return;
      }
      if (!formData.email.trim()) {
        setError('Vui lòng nhập email.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Mật khẩu xác nhận không khớp.');
        return;
      }
      const exists = mockUsers.find((u) => u.email === formData.email);
      if (exists) {
        setError('Email này đã được sử dụng.');
        return;
      }
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setIsLoginView(true);
      setFormData({ email: formData.email, password: '', name: '', phone: '', confirmPassword: '' });
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`Đăng nhập bằng ${provider} — Tính năng sẽ được tích hợp sớm.`);
  };

  /* ─────────────────────────────────────────────
     RENDER — This outputs into <main> of MainLayout
     Header and Footer are provided by MainLayout
  ───────────────────────────────────────────── */
  return (
    <div className="auth-page">

      {/* ── Breadcrumb (full-width bar) ── */}
      <div className="auth-breadcrumb">
        <div className="auth-breadcrumb__inner">
          <a href="/" className="auth-breadcrumb__link">Trang chủ</a>
          <span className="auth-breadcrumb__sep">/</span>
          <span className="auth-breadcrumb__current">
            {isLoginView ? 'Đăng nhập tài khoản' : 'Đăng ký tài khoản'}
          </span>
        </div>
      </div>

      {/* ── Centered form container ── */}
      <div className="auth-container">
        <div className="auth-card">

          {/* Title */}
          <h1 className="auth-title" id="auth-page-title">
            {isLoginView ? 'ĐĂNG NHẬP TÀI KHOẢN' : 'ĐĂNG KÝ TÀI KHOẢN'}
          </h1>

          {/* Toggle hint */}
          <p className="auth-subtitle">
            {isLoginView ? (
              <>
                Bạn chưa có tài khoản?{' '}
                <button
                  type="button"
                  className="auth-toggle-link"
                  onClick={toggleView}
                  id="toggle-to-register"
                >
                  Đăng ký tại đây
                </button>
              </>
            ) : (
              <>
                Bạn đã có tài khoản?{' '}
                <button
                  type="button"
                  className="auth-toggle-link"
                  onClick={toggleView}
                  id="toggle-to-login"
                >
                  Đăng nhập tại đây
                </button>
              </>
            )}
          </p>

          {/* Error / Success */}
          {error && (
            <div className="auth-message auth-message--error" role="alert" id="auth-error">
              <span className="auth-message__icon">⚠</span>
              <span className="error-text">{error}</span>
            </div>
          )}
          {success && (
            <div className="auth-message auth-message--success" role="status" id="auth-success">
              <span className="auth-message__icon">✓</span>
              <span>{success}</span>
            </div>
          )}

          {/* ── Form ── */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {/* Họ tên — register only */}
            {!isLoginView && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-name">
                  Họ tên <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon"><PersonIcon /></span>
                  <input
                    id="auth-name"
                    type="text"
                    name="name"
                    className="auth-input"
                    placeholder="Nhập họ tên"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Số điện thoại — register only */}
            {!isLoginView && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-phone">
                  Số điện thoại
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon"><PhoneIcon /></span>
                  <input
                    id="auth-phone"
                    type="tel"
                    name="phone"
                    className="auth-input"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-email">
                Email <span className="auth-required">*</span>
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><MailIcon /></span>
                <input
                  id="auth-email"
                  type="email"
                  name="email"
                  className="auth-input"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-password">
                Mật khẩu <span className="auth-required">*</span>
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><LockIcon /></span>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="auth-input"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={isLoginView ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu — register only */}
            {!isLoginView && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-confirm-password">
                  Xác nhận mật khẩu <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon"><LockIcon /></span>
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="auth-input"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            )}

            {/* Quên mật khẩu — login only */}
            {isLoginView && (
              <div className="auth-forgot-row">
                <a href="#forgot" className="auth-forgot-link" id="forgot-password-link">
                  Quên mật khẩu? Nhấn vào đây
                </a>
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="auth-submit-btn" id="auth-submit-btn">
              {isLoginView ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </form>

          {/* Social login divider */}
          <div className="auth-divider">
            <span className="auth-divider__line" />
            <span className="auth-divider__text">Hoặc đăng nhập bằng</span>
            <span className="auth-divider__line" />
          </div>

          {/* Social buttons */}
          <div className="auth-social-row">
            <button
              type="button"
              className="auth-social-btn auth-social-btn--fb"
              onClick={() => handleSocialLogin('Facebook')}
              id="social-facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
            <button
              type="button"
              className="auth-social-btn auth-social-btn--gg"
              onClick={() => handleSocialLogin('Google')}
              id="social-google"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

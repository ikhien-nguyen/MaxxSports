import React from 'react';
import './Footer.css';

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribed');
  };

  return (
    <footer className="footer-outer">
      <div className="inner-container footer-grid">
        {/* Column 1 — About & contact */}
        <div className="footer-col">
          <h4 className="footer-col-title">VỀ MAXX SPORT</h4>
          <p className="footer-body">
            Thương hiệu thể thao hàng đầu Việt Nam, cung cấp các sản phẩm và dịch vụ thể thao cao cấp.
          </p>
          <ul className="footer-contact-list">
            <li className="footer-contact-item">
              <span>
                <strong>Địa chỉ:</strong> CH2.2, Tầng 2, Tòa Handiresco, Số 31 Lê Văn Lương, TP. Hà Nội
              </span>
            </li>
            <li className="footer-contact-item">
              <span>
                <strong>Điện thoại:</strong>{' '}
                <a className="footer-inline-link" href="tel:1900633083">
                  1900633083
                </a>
              </span>
            </li>
            <li className="footer-contact-item">
              <span>
                <strong>Email:</strong>{' '}
                <a className="footer-inline-link" href="mailto:support@maxxsport.vn">
                  support@maxxsport.vn
                </a>
              </span>
            </li>
          </ul>
        </div>

        {/* Column 2 — Policies */}
        <div className="footer-col">
          <h4 className="footer-col-title">CHÍNH SÁCH</h4>
          <ul className="footer-links">
            <li>
              <a href="#">Hướng dẫn mua hàng</a>
            </li>
            <li>
              <a href="#">Hướng dẫn chọn size</a>
            </li>
            <li>
              <a href="#">Chính sách thanh toán</a>
            </li>
            <li>
              <a href="#">Chính sách vận chuyển</a>
            </li>
            <li>
              <a href="#">Chính sách đổi trả</a>
            </li>
            <li>
              <a href="#">Chính sách bảo mật</a>
            </li>
          </ul>
        </div>

        {/* Column 3 — Company */}
        <div className="footer-col">
          <h4 className="footer-col-title">CÔNG TY</h4>
          <ul className="footer-links">
            <li>
              <a href="#">Giới thiệu</a>
            </li>
            <li>
              <a href="#">Liên hệ</a>
            </li>
            <li>
              <a href="#">Hệ thống cửa hàng</a>
            </li>
            <li>
              <a href="#">Tuyển dụng</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
          </ul>
        </div>

        {/* Column 4 — Newsletter & socials */}
        <div className="footer-col newsletter-col">
          <h4 className="footer-col-title">ĐĂNG KÝ NHẬN TIN</h4>
          <p className="footer-body newsletter-lead">
            Nhận ưu đãi độc quyền trực tiếp vào email của bạn
          </p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input type="email" name="email" placeholder="Nhập email của bạn" required />
            <button type="submit">ĐĂNG KÝ</button>
          </form>
          <div className="social-row">
            <a className="social-link" href="#" aria-label="Facebook">
              <img src="https://img.icons8.com/color/48/facebook-new.png" width="36" height="36" alt="" />
            </a>
            <a className="social-link" href="#" aria-label="Zalo">
              <img src="https://img.icons8.com/color/48/zalo.png" width="36" height="36" alt="" />
            </a>
            <a className="social-link" href="#" aria-label="YouTube">
              <img src="https://img.icons8.com/color/48/youtube-play.png" width="36" height="36" alt="" />
            </a>
            <a className="social-link" href="#" aria-label="Instagram">
              <img src="https://img.icons8.com/fluency/48/instagram-new.png" width="36" height="36" alt="" />
            </a>
          </div>
        </div>

        {/* Badges — grid spans cols 2–4 on desktop */}
        <div className="footer-badges-row">
          <img
            className="footer-badges-img"
            src="https://placehold.co/120x40/00529c/ffffff?text=Bo+Cong+Thuong"
            alt="Bộ Công Thương"
          />
          <img
            className="footer-badges-img"
            src="https://placehold.co/80x40/00529c/ffffff?text=VNPay"
            alt="VNPay"
          />
          <img
            className="footer-badges-img"
            src="https://placehold.co/80x40/ffcc00/000000?text=COD"
            alt="COD"
          />
        </div>
      </div>

      <div className="inner-container footer-bottom">
        <p className="footer-copyright">
          © 2015-2026 MaxxSport. All rights reserved. | MST: 0107139974
        </p>
      </div>
    </footer>
  );
}

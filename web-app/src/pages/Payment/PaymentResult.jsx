import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import './PaymentResult.css';

/* ── Inline SVG Icons ── */
const CheckIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const XIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default function PaymentResult() {
    const location = useLocation();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Hệ thống đang xác nhận giao dịch của bạn...');
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!location.search) {
                setStatus('error');
                setMessage('Không tìm thấy dữ liệu giao dịch từ VNPAY.');
                return;
            }

            try {
                const searchParams = new URLSearchParams(location.search);
                const responseCode = searchParams.get('vnp_ResponseCode');
                const vnpAmount = searchParams.get('vnp_Amount');

                if (vnpAmount) {
                    setAmount(parseInt(vnpAmount) / 100);
                }

                await paymentService.verifyPaymentReturn(location.search);

                if (responseCode === '00') {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Cảm ơn bạn đã mua sắm tại MaxxSports.');
                } else {
                    setStatus('error');
                    setMessage('Giao dịch không thành công hoặc đã bị hủy bởi người dùng.');
                }
            } catch (error) {
                console.error("Lỗi xác thực giao dịch:", error);
                // Nếu Backend báo lỗi (ví dụ không tìm thấy transactionNo)
                setStatus('error');
                setMessage('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng trên hệ thống.');
            }
        };

        const timer = setTimeout(() => {
            verifyPayment();
        }, 500);

        return () => clearTimeout(timer);
    }, [location.search]);

    // Format tiền tệ VNĐ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="payment-result-page">
            <div className="payment-result-card">

                {status === 'processing' && (
                    <>
                        <div className="payment-result-icon processing">
                            <div className="spinner"></div>
                        </div>
                        <h2 className="payment-result-title">Đang xử lý...</h2>
                        <p className="payment-result-message">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="payment-result-icon success">
                            <CheckIcon />
                        </div>
                        <h2 className="payment-result-title">Thanh toán thành công!</h2>
                        <p className="payment-result-message">
                            {message}<br/>
                            {amount > 0 && <strong>Số tiền: {formatCurrency(amount)}</strong>}
                        </p>
                        <div className="payment-result-actions">
                            <Link to="/account" className="btn-primary-result">Xem đơn hàng của tôi</Link>
                            <Link to="/" className="btn-secondary-result">Về trang chủ</Link>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="payment-result-icon error">
                            <XIcon />
                        </div>
                        <h2 className="payment-result-title">Thanh toán thất bại</h2>
                        <p className="payment-result-message">{message}</p>
                        <div className="payment-result-actions">
                            <Link to="/checkout" className="btn-primary-result">Thử thanh toán lại</Link>
                            <Link to="/" className="btn-secondary-result">Về trang chủ</Link>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
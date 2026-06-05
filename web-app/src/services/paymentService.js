import api from '../api/api';

export const paymentService = {

    // =====================================================================
    // 1. TẠO LINK THANH TOÁN (Dùng ở trang Checkout)
    // =====================================================================

    createVNPayUrl: async (orderId) => {
        // Vì Backend dùng @RequestParam, ta phải truyền data vào mục 'params'
        const response = await api.post('/payment/vnpay', null, {
            params: { orderId: orderId }
        });

        return response.data;
    },


    // =====================================================================
    // 2. KIỂM TRA KẾT QUẢ THANH TOÁN
    // =====================================================================
    verifyPaymentReturn: async (queryString) => {
        // Nối thẳng chuỗi queryString vào đuôi API
        const response = await api.get(`/payment/vnpay-return${queryString}`);
        return response.data;
    }

};
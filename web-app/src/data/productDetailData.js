/**
 * productDetailData.js
 * Mock database for the ProductDetailPage component.
 * Each product has full detail info: images, colors, sizes, descriptions.
 */

export const productDetailDatabase = [
  {
    id: 1,
    name: 'Dép quai ngang adidas Adilette Comfort 2.0 Mexico Unisex',
    sku: 'JS4975',
    brand: 'adidas',
    price: 1200000,
    oldPrice: 1500000,
    images: [
      '/assets/products/detail/adidas-adilette-mexico-1.png',
      '/assets/products/detail/adidas-adilette-mexico-2.png',
      '/assets/products/detail/adidas-adilette-mexico-3.png',
      '/assets/products/detail/adidas-adilette-mexico-4.png',
    ],
    availableColors: [
      { name: 'Đen/Đỏ/Xanh', hex: '#1a1a1a' },
      { name: 'Trắng/Đỏ/Xanh', hex: '#f5f5f5' },
    ],
    availableSizes: ['38', '39', '40', '41', '42', '43'],
    category: 'SPORTSWEAR NEW ARRIVALS',
    productType: 'Dép',
    gender: 'Unisex',
    description: `
      <h3>Dép quai ngang adidas Adilette Comfort 2.0 Mexico Unisex - JS4975</h3>
      <p>Đôi dép adidas Adilette Comfort 2.0 phiên bản Mexico mang đậm cảm hứng từ đội tuyển bóng đá Mexico. Với thiết kế quai ngang cổ điển kết hợp gam màu đỏ, trắng và xanh lá đặc trưng, đây là sản phẩm không thể thiếu cho những ai yêu thích phong cách thể thao.</p>
      <h4>Đặc điểm nổi bật:</h4>
      <ul>
        <li><strong>Công nghệ CLOUDFOAM:</strong> Lớp đệm Cloudfoam siêu mềm mại, mang lại cảm giác thoải mái tuyệt đối cho đôi chân suốt cả ngày dài.</li>
        <li><strong>Quai ngang Bandage:</strong> Quai ngang một mảnh ôm sát chân, dễ dàng xỏ vào và tháo ra.</li>
        <li><strong>Đế ngoài bền bỉ:</strong> Đế cao su tổng hợp EVA nhẹ, chống trượt trên nhiều bề mặt khác nhau.</li>
        <li><strong>Thiết kế Mexico:</strong> Phối màu lấy cảm hứng từ quốc kỳ Mexico, phù hợp cho cả nam và nữ.</li>
      </ul>
      <h4>Thông tin sản phẩm:</h4>
      <ul>
        <li>Chất liệu: Quai tổng hợp, đế EVA + cao su</li>
        <li>Trọng lượng: ~220g (size 42)</li>
        <li>Xuất xứ: Trung Quốc</li>
        <li>Giới tính: Unisex</li>
        <li>Bảo hành: 6 tháng chính hãng</li>
      </ul>
      <h4>Hướng dẫn chọn size:</h4>
      <p>Nên chọn size đúng hoặc tăng thêm 1 size so với giày thể thao thông thường để có cảm giác thoải mái nhất khi mang dép.</p>
    `,
    isNew: true,
  },
  {
    id: 2,
    name: 'Dép quai ngang Nike Air Max Cirro Nam',
    sku: 'DC1460-305',
    brand: 'Nike',
    price: 1599000,
    oldPrice: 1899000,
    images: [
      '/assets/products/detail/nike-cirro-1.png',
      '/assets/products/detail/nike-cirro-2.png',
    ],
    availableColors: [
      { name: 'Olive', hex: '#556B2F' },
      { name: 'Đen', hex: '#1a1a1a' },
      { name: 'Trắng', hex: '#f5f5f5' },
    ],
    availableSizes: ['40', '41', '42', '43', '44'],
    category: 'SPORTSWEAR',
    productType: 'Dép',
    gender: 'Nam',
    description: `
      <h3>Dép quai ngang Nike Air Max Cirro Nam - DC1460-305</h3>
      <p>Nike Air Max Cirro mang đến trải nghiệm thoải mái vượt trội với đơn vị Air Max 90 nổi tiếng được tích hợp ngay dưới lòng bàn chân. Đây là đôi dép slide hoàn hảo cho phong cách thường ngày lẫn recovery sau tập luyện.</p>
      <h4>Đặc điểm nổi bật:</h4>
      <ul>
        <li><strong>Đệm Air Max:</strong> Túi khí Air Max 90 kinh điển mang lại cảm giác đệm êm ái, thoải mái khi di chuyển.</li>
        <li><strong>Quai ngang Synthetic:</strong> Quai ngang tổng hợp cao cấp với logo Nike Swoosh nổi bật.</li>
        <li><strong>Đế Foam:</strong> Lớp foam dày dặn giảm chấn hiệu quả, hỗ trợ phục hồi sau tập luyện.</li>
        <li><strong>Đế ngoài chống trượt:</strong> Rãnh đế được thiết kế tối ưu cho khả năng bám trên nhiều bề mặt.</li>
      </ul>
      <h4>Thông tin sản phẩm:</h4>
      <ul>
        <li>Chất liệu: Quai tổng hợp, đế phylon + cao su</li>
        <li>Trọng lượng: ~280g (size 42)</li>
        <li>Xuất xứ: Việt Nam</li>
        <li>Giới tính: Nam</li>
        <li>Bảo hành: 6 tháng chính hãng</li>
      </ul>
      <h4>Hướng dẫn chọn size:</h4>
      <p>Nike Air Max Cirro có form vừa. Chọn size thường mang hàng ngày. Nếu bàn chân rộng, nên tăng thêm 0.5 size.</p>
    `,
    isNew: false,
  },
];

/**
 * Format a number as Vietnamese Đồng currency string.
 * @param {number} n
 * @returns {string}
 */
export const formatPrice = (n) =>
  n.toLocaleString('vi-VN') + '₫';

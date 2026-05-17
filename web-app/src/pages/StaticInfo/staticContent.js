/**
 * staticContent.js — Professional Vietnamese content for all static pages.
 * Each key maps to a route slug. Value = { title, content (HTML string) }.
 */

export const staticPages = {
  'chinh-sach-doi-tra': {
    title: 'Chính Sách Đổi Trả',
    content: `
      <h2>1. Thời gian đổi trả</h2>
      <p>XSPORT chấp nhận đổi trả sản phẩm trong vòng <strong>7 ngày</strong> kể từ ngày khách hàng nhận được hàng. Sau thời gian này, yêu cầu đổi trả sẽ không được giải quyết trừ trường hợp sản phẩm bị lỗi do nhà sản xuất.</p>

      <h2>2. Điều kiện đổi trả</h2>
      <ul>
        <li>Sản phẩm còn <strong>nguyên tem, mác, hộp</strong> và chưa qua sử dụng.</li>
        <li>Sản phẩm không bị hư hỏng, bẩn, biến dạng do lỗi từ phía khách hàng.</li>
        <li>Có kèm hóa đơn mua hàng hoặc mã đơn hàng hợp lệ.</li>
        <li>Sản phẩm thuộc chương trình OUTLET hoặc giảm giá trên 50% sẽ <strong>không được đổi trả</strong>.</li>
      </ul>

      <h2>3. Quy trình đổi trả</h2>
      <ol>
        <li>Liên hệ XSPORT qua Hotline <strong>1900 633 083</strong> hoặc email <strong>support@xsport.vn</strong>.</li>
        <li>Cung cấp mã đơn hàng, hình ảnh sản phẩm và lý do đổi trả.</li>
        <li>Sau khi được xác nhận, gửi sản phẩm về địa chỉ kho XSPORT.</li>
        <li>XSPORT kiểm tra và xử lý trong vòng <strong>3-5 ngày làm việc</strong>.</li>
      </ol>

      <h2>4. Phương thức hoàn tiền</h2>
      <p>Trong trường hợp hoàn tiền, XSPORT sẽ chuyển khoản về tài khoản ngân hàng của khách hàng trong vòng <strong>5-7 ngày làm việc</strong> sau khi xác nhận đổi trả thành công.</p>

      <div class="info-box">
        <p>📌 <strong>Lưu ý:</strong> Chi phí vận chuyển đổi trả do lỗi của XSPORT sẽ được miễn phí hoàn toàn. Trường hợp đổi do nhu cầu cá nhân, khách hàng chịu phí ship.</p>
      </div>
    `,
  },

  'chinh-sach-bao-hanh': {
    title: 'Chính Sách Bảo Hành',
    content: `
      <h2>1. Phạm vi bảo hành</h2>
      <p>XSPORT cam kết bảo hành tất cả sản phẩm <strong>chính hãng</strong> được mua tại hệ thống cửa hàng và website xsport.vn theo chính sách của từng thương hiệu.</p>

      <h2>2. Thời gian bảo hành</h2>
      <table>
        <thead><tr><th>Loại sản phẩm</th><th>Thời gian bảo hành</th></tr></thead>
        <tbody>
          <tr><td>Giày thể thao</td><td>6 tháng (lỗi keo, đế, đường may)</td></tr>
          <tr><td>Quần áo thể thao</td><td>3 tháng (lỗi đường may, phai màu bất thường)</td></tr>
          <tr><td>Phụ kiện (balo, tất, mũ)</td><td>1 tháng</td></tr>
          <tr><td>Dép / Sandal</td><td>3 tháng</td></tr>
        </tbody>
      </table>

      <h2>3. Trường hợp KHÔNG được bảo hành</h2>
      <ul>
        <li>Sản phẩm bị hư hỏng do sử dụng sai mục đích hoặc tác động ngoại lực.</li>
        <li>Sản phẩm đã tự ý sửa chữa tại cơ sở khác.</li>
        <li>Hao mòn tự nhiên do quá trình sử dụng (mòn đế, phai màu nhẹ).</li>
      </ul>

      <div class="info-box">
        <p>📌 <strong>Hướng dẫn:</strong> Mang sản phẩm và hóa đơn đến bất kỳ cửa hàng XSPORT nào để được kiểm tra và bảo hành miễn phí.</p>
      </div>
    `,
  },

  'chinh-sach-bao-mat': {
    title: 'Chính Sách Bảo Mật',
    content: `
      <h2>1. Thu thập thông tin</h2>
      <p>XSPORT thu thập thông tin cá nhân khi quý khách đăng ký tài khoản, đặt hàng hoặc liên hệ hỗ trợ, bao gồm: họ tên, số điện thoại, email, địa chỉ giao hàng.</p>

      <h2>2. Mục đích sử dụng</h2>
      <ul>
        <li>Xử lý đơn hàng và giao hàng đúng địa chỉ.</li>
        <li>Thông báo chương trình khuyến mãi (nếu khách hàng đồng ý).</li>
        <li>Hỗ trợ giải quyết khiếu nại và bảo hành.</li>
        <li>Cải thiện trải nghiệm mua sắm trên website.</li>
      </ul>

      <h2>3. Cam kết bảo mật</h2>
      <p>XSPORT cam kết <strong>không chia sẻ, bán hoặc trao đổi</strong> thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào, trừ trường hợp có yêu cầu từ cơ quan pháp luật.</p>

      <h2>4. Bảo mật thanh toán</h2>
      <p>Tất cả giao dịch thanh toán trực tuyến đều được mã hóa SSL 256-bit và xử lý qua cổng thanh toán <strong>VNPAY</strong> đạt chuẩn PCI DSS.</p>

      <div class="info-box">
        <p>📌 Nếu phát hiện thông tin cá nhân bị rò rỉ, vui lòng liên hệ ngay <strong>support@xsport.vn</strong> để được hỗ trợ xử lý.</p>
      </div>
    `,
  },

  'chinh-sach-van-chuyen': {
    title: 'Chính Sách Vận Chuyển',
    content: `
      <h2>1. Phạm vi giao hàng</h2>
      <p>XSPORT giao hàng <strong>toàn quốc</strong> thông qua các đối tác vận chuyển uy tín: GHN, GHTK, J&T Express.</p>

      <h2>2. Thời gian giao hàng</h2>
      <table>
        <thead><tr><th>Khu vực</th><th>Thời gian dự kiến</th></tr></thead>
        <tbody>
          <tr><td>Nội thành Hà Nội & TP.HCM</td><td>1-2 ngày làm việc</td></tr>
          <tr><td>Các tỉnh lân cận</td><td>2-3 ngày làm việc</td></tr>
          <tr><td>Khu vực xa (miền núi, hải đảo)</td><td>4-7 ngày làm việc</td></tr>
        </tbody>
      </table>

      <h2>3. Phí vận chuyển</h2>
      <ul>
        <li><strong>Miễn phí ship</strong> cho đơn hàng từ 500.000₫ trở lên.</li>
        <li>Đơn hàng dưới 500.000₫: phí ship 30.000₫ (nội thành) — 45.000₫ (ngoại thành).</li>
      </ul>

      <div class="info-box">
        <p>📌 Theo dõi đơn hàng của bạn tại mục <strong>"Tài khoản → Đơn hàng của tôi"</strong> trên website.</p>
      </div>
    `,
  },

  'chinh-sach-thanh-toan': {
    title: 'Chính Sách Thanh Toán',
    content: `
      <h2>1. Phương thức thanh toán</h2>
      <ul>
        <li><strong>COD (Thanh toán khi nhận hàng):</strong> Áp dụng toàn quốc, thanh toán trực tiếp cho nhân viên giao hàng.</li>
        <li><strong>VNPAY QR:</strong> Quét mã QR thanh toán qua ứng dụng ngân hàng hoặc ví điện tử.</li>
        <li><strong>Chuyển khoản ngân hàng:</strong> Chuyển khoản trước, đơn hàng được xác nhận sau khi nhận tiền.</li>
      </ul>

      <h2>2. Lưu ý thanh toán</h2>
      <p>Tất cả giá sản phẩm trên website đã bao gồm VAT. Khách hàng có nhu cầu xuất hóa đơn GTGT vui lòng yêu cầu trong vòng <strong>24 giờ</strong> sau khi đặt hàng.</p>

      <div class="info-box">
        <p>📌 <strong>Bảo mật:</strong> Mọi giao dịch đều được mã hóa SSL và xử lý qua cổng VNPAY đạt chuẩn quốc tế.</p>
      </div>
    `,
  },

  'huong-dan-mua-hang': {
    title: 'Hướng Dẫn Mua Hàng',
    content: `
      <h2>Bước 1: Tìm sản phẩm</h2>
      <p>Sử dụng thanh <strong>Tìm kiếm</strong> ở đầu trang hoặc duyệt theo danh mục: Thương hiệu, Môn thể thao, Giới tính.</p>

      <h2>Bước 2: Chọn sản phẩm</h2>
      <p>Nhấn vào sản phẩm để xem chi tiết. Chọn <strong>Size</strong>, <strong>Màu sắc</strong> và <strong>Số lượng</strong> phù hợp.</p>

      <h2>Bước 3: Thêm vào giỏ hàng</h2>
      <p>Nhấn nút <strong>"Thêm vào giỏ"</strong>. Tiếp tục mua sắm hoặc vào giỏ hàng để thanh toán.</p>

      <h2>Bước 4: Đặt hàng</h2>
      <ol>
        <li>Kiểm tra giỏ hàng và nhấn <strong>"Tiến hành đặt hàng"</strong>.</li>
        <li>Điền đầy đủ thông tin giao hàng: Họ tên, SĐT, Địa chỉ.</li>
        <li>Chọn phương thức thanh toán (COD hoặc VNPAY QR).</li>
        <li>Nhấn <strong>"Đặt hàng"</strong> để hoàn tất.</li>
      </ol>

      <h2>Bước 5: Xác nhận</h2>
      <p>Bạn sẽ nhận được thông báo xác nhận đơn hàng. Theo dõi trạng thái tại <strong>"Tài khoản → Đơn hàng"</strong>.</p>
    `,
  },

  'huong-dan-chon-size': {
    title: 'Hướng Dẫn Chọn Size',
    content: `
      <h2>Bảng size Giày</h2>
      <table>
        <thead><tr><th>EU</th><th>US Nam</th><th>US Nữ</th><th>Chiều dài chân (cm)</th></tr></thead>
        <tbody>
          <tr><td>38</td><td>6</td><td>7</td><td>24.0</td></tr>
          <tr><td>39</td><td>6.5</td><td>7.5</td><td>24.5</td></tr>
          <tr><td>40</td><td>7</td><td>8</td><td>25.0</td></tr>
          <tr><td>41</td><td>8</td><td>9</td><td>26.0</td></tr>
          <tr><td>42</td><td>8.5</td><td>9.5</td><td>26.5</td></tr>
          <tr><td>43</td><td>9.5</td><td>10.5</td><td>27.5</td></tr>
          <tr><td>44</td><td>10</td><td>11</td><td>28.0</td></tr>
        </tbody>
      </table>

      <h2>Bảng size Quần Áo</h2>
      <table>
        <thead><tr><th>Size</th><th>Chiều cao (cm)</th><th>Cân nặng (kg)</th><th>Ngực (cm)</th></tr></thead>
        <tbody>
          <tr><td>S</td><td>160-165</td><td>50-58</td><td>86-90</td></tr>
          <tr><td>M</td><td>165-170</td><td>58-65</td><td>90-96</td></tr>
          <tr><td>L</td><td>170-176</td><td>65-73</td><td>96-102</td></tr>
          <tr><td>XL</td><td>176-182</td><td>73-82</td><td>102-108</td></tr>
          <tr><td>XXL</td><td>182+</td><td>82+</td><td>108+</td></tr>
        </tbody>
      </table>

      <div class="info-box">
        <p>📌 <strong>Mẹo:</strong> Đo chân vào buổi chiều (khi chân hơi nở). Nếu phân vân giữa 2 size, hãy chọn size lớn hơn.</p>
      </div>
    `,
  },

  'faq': {
    title: 'Câu Hỏi Thường Gặp (FAQ)',
    content: `
      <h2>🛒 Mua hàng</h2>
      <h3>Tôi có thể đặt hàng qua điện thoại không?</h3>
      <p>Có, bạn có thể gọi Hotline <strong>1900 633 083</strong> (8h–21h hàng ngày) để được tư vấn và đặt hàng trực tiếp.</p>

      <h3>Sản phẩm trên web có giống sản phẩm thật không?</h3>
      <p>XSPORT cam kết 100% hình ảnh là chụp thực tế. Màu sắc có thể chênh lệch nhẹ tùy theo cài đặt màn hình.</p>

      <h2>📦 Giao hàng</h2>
      <h3>Tôi có thể theo dõi đơn hàng ở đâu?</h3>
      <p>Đăng nhập tài khoản → vào mục <strong>"Đơn hàng của tôi"</strong> để xem trạng thái đơn hàng theo thời gian thực.</p>

      <h2>🔄 Đổi trả</h2>
      <h3>Tôi muốn đổi size khác có được không?</h3>
      <p>Hoàn toàn được! Bạn có thể đổi size trong vòng 7 ngày, sản phẩm còn nguyên tem mác. Chi tiết tại trang <strong>Chính sách đổi trả</strong>.</p>

      <h2>💳 Thanh toán</h2>
      <h3>Thanh toán online có an toàn không?</h3>
      <p>Tuyệt đối an toàn. XSPORT sử dụng cổng thanh toán VNPAY đạt chuẩn bảo mật PCI DSS quốc tế.</p>
    `,
  },

  'he-thong-cua-hang': {
    title: 'Hệ Thống Cửa Hàng XSPORT',
    content: `
      <h2>📍 Hà Nội</h2>
      <h3>XSPORT Lê Văn Lương (Trụ sở chính)</h3>
      <p>CH2.2, Tầng 2, Tòa Handiresco, Số 31 Lê Văn Lương, Thanh Xuân, Hà Nội<br/>
      <strong>Giờ mở cửa:</strong> 9h00 – 21h30 hàng ngày<br/>
      <strong>Hotline:</strong> 1900 633 083</p>

      <h2>📍 TP. Hồ Chí Minh</h2>
      <h3>XSPORT Võ Văn Ngân</h3>
      <p>332-334 Võ Văn Ngân, P. Bình Thọ, TP. Thủ Đức, TP. HCM<br/>
      <strong>Giờ mở cửa:</strong> 9h00 – 21h30 hàng ngày<br/>
      <strong>Hotline:</strong> 1900 633 083</p>

      <h3>XSPORT Nguyễn Trãi</h3>
      <p>685 Nguyễn Trãi, P.11, Q.5, TP. HCM<br/>
      <strong>Giờ mở cửa:</strong> 9h00 – 21h30 hàng ngày</p>

      <div class="info-box">
        <p>📌 Mang theo CCCD/CMND khi mua hàng trả góp tại cửa hàng. Liên hệ trước để kiểm tra tồn kho sản phẩm.</p>
      </div>
    `,
  },

  'lien-he': {
    title: 'Liên Hệ XSPORT',
    content: `
      <h2>Thông tin liên hệ</h2>
      <p><strong>Công ty TNHH XSPORT Việt Nam</strong></p>
      <ul>
        <li><strong>Trụ sở:</strong> CH2.2, Tầng 2, Tòa Handiresco, 31 Lê Văn Lương, Thanh Xuân, Hà Nội</li>
        <li><strong>Hotline:</strong> 1900 633 083 (8h – 21h hàng ngày)</li>
        <li><strong>Email:</strong> support@xsport.vn</li>
        <li><strong>MST:</strong> 0107139974</li>
      </ul>

      <h2>Mạng xã hội</h2>
      <p>Theo dõi XSPORT trên các nền tảng: Facebook, Instagram, YouTube, TikTok để cập nhật xu hướng thể thao và nhận deal độc quyền.</p>

      <div class="info-box">
        <p>📌 Phản hồi, góp ý hoặc khiếu nại: gửi email tới <strong>support@xsport.vn</strong> kèm mã đơn hàng. Chúng tôi phản hồi trong vòng 24 giờ.</p>
      </div>
    `,
  },
};

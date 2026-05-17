package com.nhom2.MaxxSports;

import com.nhom2.MaxxSports.dto.request.CartRequest;
import com.nhom2.MaxxSports.dto.response.CartResponse;
import com.nhom2.MaxxSports.entity.Cart;
import com.nhom2.MaxxSports.entity.Product;
import com.nhom2.MaxxSports.entity.ProductDetail;
import com.nhom2.MaxxSports.entity.User;
import com.nhom2.MaxxSports.repository.CartRepository;
import com.nhom2.MaxxSports.repository.ProductDetailRepository;
import com.nhom2.MaxxSports.repository.ProductRepository;
import com.nhom2.MaxxSports.repository.UserRepository;
import com.nhom2.MaxxSports.service.CartService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // Tự động xóa sạch dữ liệu mồi trong DB sau khi chạy xong mỗi test case
public class MaxxSportsIntegrationTest {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private ProductRepository productRepository; // Tiêm Repo này vào để mồi dữ liệu bảng SAN_PHAM

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private com.nhom2.MaxxSports.repository.SizeRepository sizeRepository;

    @Autowired
    private com.nhom2.MaxxSports.repository.MauRepository mauRepository;

    private User testUser;
    private ProductDetail testProduct;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    @BeforeEach
    void setUp() {
        // 1. Tạo và lưu người dùng mẫu
        testUser = new User();
        testUser.setEmail("sinhvien_test@gmail.com");
        testUser.setPassword("123456");
        userRepository.save(testUser);

        // 2. Tạo và lưu sản phẩm cha mẫu
        Product product = new Product();
        product.setTenSanPham("Giày Thể Thao MaxxSports");
        product.setGia(500000.0);
        productRepository.save(product);

        // 3. Tạo và lưu dữ liệu mồi cho Size và Màu
        var size = new com.nhom2.MaxxSports.entity.Size();
        size.setSize("42");
        sizeRepository.save(size);

        var mau = new com.nhom2.MaxxSports.entity.Mau();
        mau.setMau("Đen");
        mauRepository.save(mau);

        // 4. Tạo chi tiết sản phẩm mẫu và gắn các liên kết đối tượng
        testProduct = new ProductDetail();
        testProduct.setSoLuong(100);
        testProduct.setProduct(product);
        testProduct.setSize(size);
        testProduct.setMau(mau);
        productDetailRepository.save(testProduct);

        entityManager.flush(); // Đẩy toàn bộ dữ liệu xuống DB thật ngay lập tức
        entityManager.clear(); // Xóa sạch bộ nhớ đệm trong Java để ép nạp lại chuẩn

        // Nạp lại đối tượng testProduct hoàn chỉnh từ DB sau khi đã clear cache
        testProduct = productDetailRepository.findById(testProduct.getMaCtsp()).orElseThrow();
    }

    // Kịch bản 1: Thêm một sản phẩm hoàn toàn mới vào giỏ hàng thành công
    @Test
    void TC01_Integration_AddToCart_NewProduct_Success() {
        CartRequest request = new CartRequest();
        request.setMaCtsp(testProduct.getMaCtsp());
        request.setSoLuong(2); // 2 < 100 tồn kho -> Hợp lệ

        String result = cartService.addToCart(testUser.getEmail(), request);

        assertEquals("Thêm sản phẩm vào giỏ hàng thành công!", result);

        Cart savedCart = cartRepository.findByUser(testUser).orElse(null);
        assertNotNull(savedCart);
        assertEquals(2, savedCart.getSoLuongTongGH());
    }

    // Kịch bản 2: Thêm sản phẩm đã có sẵn vào giỏ hàng (Kỳ vọng: Cộng dồn số lượng)
    @Test
    void TC02_Integration_AddToCart_ExistingProduct_ShouldIncreaseQuantity() {
        // Lần 1: Thêm 2 cái
        CartRequest req1 = new CartRequest();
        req1.setMaCtsp(testProduct.getMaCtsp());
        req1.setSoLuong(2);
        cartService.addToCart(testUser.getEmail(), req1);

        // Lần 2: Thêm tiếp 3 cái cùng loại
        CartRequest req2 = new CartRequest();
        req2.setMaCtsp(testProduct.getMaCtsp());
        req2.setSoLuong(3);
        cartService.addToCart(testUser.getEmail(), req2);

        Cart savedCart = cartRepository.findByUser(testUser).orElse(null);
        assertNotNull(savedCart);
        // Tổng số lượng giỏ hàng sau 2 lần cộng dồn phải bằng 5
        assertEquals(5, savedCart.getSoLuongTongGH());
    }

    // Kịch bản 3: Xóa sản phẩm ra khỏi giỏ hàng thành công
    @Test
    void TC03_Integration_RemoveItemFromCart_Success() {
        // Setup ban đầu: Thêm 1 sản phẩm vào giỏ hàng
        CartRequest req = new CartRequest();
        req.setMaCtsp(testProduct.getMaCtsp());
        req.setSoLuong(1);
        cartService.addToCart(testUser.getEmail(), req);

        // Gọi hàm getCart của bạn để lấy dữ liệu có thật từ database
        CartResponse cartResponse = cartService.getCart(testUser.getEmail());
        assertFalse(cartResponse.getItems().isEmpty(), "Giỏ hàng không được rỗng sau khi đã thêm sản phẩm");

        // Lấy đúng ID của CartItem (chi tiết giỏ hàng) cần xóa
        Long cartItemId = cartResponse.getItems().get(0).getId();

        // Hành động: Thực hiện xóa món đồ thông qua hàm service
        String result = cartService.deleteItem(testUser.getEmail(), cartItemId);
        assertEquals("Đã xóa sản phẩm khỏi giỏ hàng!", result);

        // Kiểm tra: Số lượng tổng của cả giỏ hàng sau khi xóa hết phải quay về bằng 0
        Cart afterDeleteCart = cartRepository.findByUser(testUser).orElse(null);
        assertNotNull(afterDeleteCart);
        assertEquals(0, afterDeleteCart.getSoLuongTongGH());
    }

    // Kịch bản 4: Thêm sản phẩm vào giỏ hàng vượt quá số lượng tồn kho (Kỳ vọng: Phải báo lỗi chặn lại)
    @Test
    void TC04_Integration_UpdateCartQuantity_ExceedStock_ShouldFail() {
        CartRequest request = new CartRequest();
        request.setMaCtsp(testProduct.getMaCtsp());
        request.setSoLuong(150); // Kho chỉ mồi 100 cái, đòi đặt 150 cái -> Hệ thống bắt buộc phải chặn lại

        // Sử dụng assertThrows để bắt lỗi RuntimeException được ném ra từ logic check kho trong CartService
        Exception exception = assertThrows(RuntimeException.class, () -> {
            cartService.addToCart(testUser.getEmail(), request);
        });

        // Kiểm tra câu chữ báo lỗi trả về
        assertTrue(exception.getMessage().contains("Số lượng vượt quá tồn kho"));
    }

    // Kịch bản 5: Thêm sản phẩm vào giỏ hàng cho một Tài khoản không tồn tại (Kỳ vọng: Báo lỗi tài khoản)
    @Test
    void TC05_Integration_AddToCart_UserNotFound_ShouldThrowException() {
        CartRequest request = new CartRequest();
        request.setMaCtsp(testProduct.getMaCtsp());
        request.setSoLuong(1);

        // Thử truyền một Email không có thật
        Exception exception = assertThrows(RuntimeException.class, () -> {
            cartService.addToCart("email_khong_ton_tai@gmail.com", request);
        });

        assertTrue(exception.getMessage().contains("Không tìm thấy người dùng"));
    }
}
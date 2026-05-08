package com.nhom2.MaxxSports;

import com.nhom2.MaxxSports.dto.request.CartRequest;
import com.nhom2.MaxxSports.entity.Cart;
import com.nhom2.MaxxSports.entity.CartItem;
import com.nhom2.MaxxSports.entity.ProductDetail;
import com.nhom2.MaxxSports.entity.User;
import com.nhom2.MaxxSports.repository.*;
import com.nhom2.MaxxSports.service.CartService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MaxxSportsApplicationTests {

    // 1. Mock các dependencies có trong CartService
    @Mock private CartRepository cartRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private ProductDetailRepository productDetailRepository;
    @Mock private UserRepository userRepository;
    @Mock private AnhRepository anhRepository;

    // 2. Inject các mock trên vào Service cần test
    @InjectMocks
    private CartService cartService;

    // Các biến dùng chung cho nhiều test case
    private User mockUser;
    private Cart mockCart;
    private final String TEST_EMAIL = "khachhang@gmail.com";

    @BeforeEach
    void setUp() {
        // Chuẩn bị sẵn 1 User và 1 Cart cơ bản trước mỗi lần chạy Test
        mockUser = new User();
        mockUser.setEmail(TEST_EMAIL);

        mockCart = new Cart();
        mockCart.setMaGioHang(1L);
        mockCart.setUser(mockUser);
        mockCart.setSoLuongTongGH(0);
    }

    // TEST CASE 1: Thêm sản phẩm vào giỏ (Trường hợp món đồ chưa có trong giỏ)
    @Test
    void addToCart_Success_WhenItemIsNew() {
        CartRequest request = new CartRequest();
        request.setMaCtsp(100L);
        request.setSoLuong(2);

        ProductDetail mockProductDetail = new ProductDetail();
        mockProductDetail.setMaCtsp(100L);

        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(mockUser));
        when(cartRepository.findByUser(mockUser)).thenReturn(Optional.of(mockCart));
        when(productDetailRepository.findById(100L)).thenReturn(Optional.of(mockProductDetail));
        // Sản phẩm chưa có trong giỏ -> trả về empty
        when(cartItemRepository.findByCartAndProductDetail(mockCart, mockProductDetail)).thenReturn(Optional.empty());

        String resultMessage = cartService.addToCart(TEST_EMAIL, request);

        assertEquals("Thêm sản phẩm vào giỏ hàng thành công!", resultMessage);
        assertEquals(2, mockCart.getSoLuongTongGH()); // Số lượng tổng giỏ hàng phải tăng lên 2
        
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
        verify(cartRepository, times(1)).save(mockCart);
    }

    // TEST CASE 2: Xóa sản phẩm khỏi giỏ hàng
    @Test
    void deleteItem_Success() {
        Long cartItemId = 50L;
        mockCart.setSoLuongTongGH(5); // Giả sử trong giỏ đang có 5 món đồ

        CartItem itemToDelete = new CartItem();
        itemToDelete.setId(cartItemId);
        itemToDelete.setSoLuong(2); // Món đồ chuẩn bị xóa có số lượng là 2
        itemToDelete.setCart(mockCart); // Gán đúng giỏ hàng để vượt qua bước check bảo mật

        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(mockUser));
        when(cartRepository.findByUser(mockUser)).thenReturn(Optional.of(mockCart));
        when(cartItemRepository.findById(cartItemId)).thenReturn(Optional.of(itemToDelete));

        String resultMessage = cartService.deleteItem(TEST_EMAIL, cartItemId);

        assertEquals("Đã xóa sản phẩm khỏi giỏ hàng!", resultMessage);
        assertEquals(3, mockCart.getSoLuongTongGH()); // 5 món ban đầu trừ đi 2 món vừa xóa = 3
        
        verify(cartItemRepository, times(1)).delete(itemToDelete);
        verify(cartRepository, times(1)).save(mockCart);
    }
}
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
public class CartServiceTest {

    @Mock private CartRepository cartRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private ProductDetailRepository productDetailRepository;
    @Mock private UserRepository userRepository;
    @Mock private ImageRepository imageRepository; 

    @InjectMocks
    private CartService cartService;

    private User mockUser;
    private Cart mockCart;
    private final String TEST_EMAIL = "khachhang@gmail.com";

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setEmail(TEST_EMAIL);

        mockCart = new Cart();
        mockCart.setMaGioHang(1L);
        mockCart.setUser(mockUser);
        mockCart.setSoLuongTongGH(0);
    }

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
        when(cartItemRepository.findByCartAndProductDetail(mockCart, mockProductDetail)).thenReturn(Optional.empty());

        String resultMessage = cartService.addToCart(TEST_EMAIL, request);

        assertEquals("Thêm sản phẩm vào giỏ hàng thành công!", resultMessage);
        assertEquals(2, mockCart.getSoLuongTongGH()); 
        
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
        verify(cartRepository, times(1)).save(mockCart);
    }
}
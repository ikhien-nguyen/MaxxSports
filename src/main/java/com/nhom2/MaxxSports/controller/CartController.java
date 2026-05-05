package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.dto.request.CartRequest;
import com.nhom2.MaxxSports.dto.response.CartResponse;
import com.nhom2.MaxxSports.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestBody @Valid CartRequest request, Principal principal) {
        
        // Principal là một object của Spring Security, nó sẽ tự động lấy thông tin 
        // người dùng đang đăng nhập (thông qua token JWT bạn gửi lên từ Postman).
        // Hàm getName() sẽ trả về Email của người đăng nhập.
        String email = principal.getName(); 

        // Gọi Service xử lý logic và nhận lại câu thông báo
        String response = cartService.addToCart(email, request);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<CartResponse> getCart(Principal principal) {
        String email = principal.getName();
        return ResponseEntity.ok(cartService.getCart(email));
    }
    
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<String> updateQuantity(
            @PathVariable Long cartItemId, 
            @RequestParam Integer quantity, 
            Principal principal) {
        
        String email = principal.getName();
        return ResponseEntity.ok(cartService.updateQuantity(email, cartItemId, quantity));
    }

    @DeleteMapping("/delete/{cartItemId}")
    public ResponseEntity<String> deleteItem(
            @PathVariable Long cartItemId, 
            Principal principal) {
        
        String email = principal.getName();
        return ResponseEntity.ok(cartService.deleteItem(email, cartItemId));
    }
}
package com.nhom2.MaxxSports.service;

import com.nhom2.MaxxSports.dto.request.CartRequest;
import com.nhom2.MaxxSports.dto.response.CartItemResponse;
import com.nhom2.MaxxSports.dto.response.CartResponse;
import com.nhom2.MaxxSports.entity.*;
import com.nhom2.MaxxSports.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final ProductDetailRepository productDetailRepository;
	private final UserRepository userRepository;
	private final AnhRepository anhRepository;

	@Transactional
	public String addToCart(String email, CartRequest request) {
		// 1. Tìm User đang đăng nhập
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

		// 2. Tìm giỏ hàng của User này. Nếu họ chưa từng có giỏ hàng -> Tạo mới 1 cái
		// cho họ
		Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
			Cart newCart = Cart.builder().user(user).soLuongTongGH(0).build();
			return cartRepository.save(newCart);
		});

		// 3. Kiểm tra xem mã sản phẩm (size/màu) khách chọn có tồn tại trong DB không
		ProductDetail productDetail = productDetailRepository.findById(request.getMaCtsp())
				.orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

		// 4. Kiểm tra xem món đồ này ĐÃ CÓ trong giỏ hàng chưa
		CartItem cartItem = cartItemRepository.findByCartAndProductDetail(cart, productDetail).orElse(null);

		if (cartItem != null) {
			// Nếu có rồi -> Cộng dồn số lượng thêm
			cartItem.setSoLuong(cartItem.getSoLuong() + request.getSoLuong());
		} else {
			// Nếu chưa có -> Tạo một dòng mới tinh trong chi tiết giỏ hàng
			cartItem = CartItem.builder().cart(cart).productDetail(productDetail).soLuong(request.getSoLuong()).build();
		}

		// Lưu món đồ vào DB
		cartItemRepository.save(cartItem);

		// 5. Cập nhật tổng số lượng đồ trong giỏ (Cộng thêm số lượng vừa thêm)
		cart.setSoLuongTongGH(cart.getSoLuongTongGH() + request.getSoLuong());
		cartRepository.save(cart);

		return "Thêm sản phẩm vào giỏ hàng thành công!";
	}

	public CartResponse getCart(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

		Cart cart = cartRepository.findByUser(user).orElse(null);

		// Nếu chưa có giỏ hàng, trả về giỏ hàng rỗng
		if (cart == null) {
			return CartResponse.builder().soLuongTongGH(0).tongTien(0.0).items(List.of()).build();
		}

		List<CartItem> cartItems = cartItemRepository.findByCart(cart);
		double tongTien = 0.0;

		// Chuyển đổi từ CartItem (Entity) sang CartItemResponse (DTO)
		List<CartItemResponse> itemResponses = cartItems.stream().map(item -> {
			ProductDetail pd = item.getProductDetail();
			Product p = pd.getProduct();

			// Lấy ảnh đầu tiên của sản phẩm (nếu có)
			List<Anh> anhs = anhRepository.findByProductDetail_MaCtsp(pd.getMaCtsp());
			String urlAnh = anhs.isEmpty() ? null : anhs.get(0).getAnh();

			double thanhTien = p.getGia() * item.getSoLuong();

			return CartItemResponse.builder().id(item.getId()).maCtsp(pd.getMaCtsp()).tenSanPham(p.getTenSanPham())
					.size(pd.getSize().getSize()).mau(pd.getMau().getMau()).gia(p.getGia()).soLuong(item.getSoLuong())
					.thanhTien(thanhTien).urlAnh(urlAnh).build();
		}).toList();

		// Tính tổng tiền toàn giỏ
		for (CartItemResponse item : itemResponses) {
			tongTien += item.getThanhTien();
		}

		return CartResponse.builder().maGioHang(cart.getMaGioHang()).soLuongTongGH(cart.getSoLuongTongGH())
				.tongTien(tongTien).items(itemResponses).build();
	}

	// 3. Hàm cập nhật số lượng món đồ trong giỏ
	@Transactional
	public String updateQuantity(String email, Long cartItemId, Integer newQuantity) {
		// Tìm User và Cart giống như trên
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
		Cart cart = cartRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Giỏ hàng trống"));

		// Tìm món đồ cần cập nhật
		CartItem cartItem = cartItemRepository.findById(cartItemId)
				.orElseThrow(() -> new RuntimeException("Món đồ không tồn tại trong giỏ"));

		// Bảo mật: Kiểm tra xem món đồ này có đúng là nằm trong giỏ của người này không
		if (!cartItem.getCart().getMaGioHang().equals(cart.getMaGioHang())) {
			throw new RuntimeException("Bạn không có quyền sửa món đồ này");
		}

		// Cập nhật lại tổng số lượng của cả giỏ hàng (Trừ đi số cũ, cộng thêm số mới)
		int oldQuantity = cartItem.getSoLuong();
		cart.setSoLuongTongGH(cart.getSoLuongTongGH() - oldQuantity + newQuantity);

		// Lưu số lượng mới của món đồ
		cartItem.setSoLuong(newQuantity);
		cartItemRepository.save(cartItem);
		cartRepository.save(cart);

		return "Cập nhật số lượng thành công!";
	}

	// 4. Hàm xóa một món đồ khỏi giỏ
	@Transactional
	public String deleteItem(String email, Long cartItemId) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
		Cart cart = cartRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Giỏ hàng trống"));

		CartItem cartItem = cartItemRepository.findById(cartItemId)
				.orElseThrow(() -> new RuntimeException("Món đồ không tồn tại trong giỏ"));

		if (!cartItem.getCart().getMaGioHang().equals(cart.getMaGioHang())) {
			throw new RuntimeException("Bạn không có quyền xóa món đồ này");
		}

		// Cập nhật lại tổng số lượng của cả giỏ hàng
		cart.setSoLuongTongGH(cart.getSoLuongTongGH() - cartItem.getSoLuong());

		// Xóa món đồ khỏi DB
		cartItemRepository.delete(cartItem);
		cartRepository.save(cart);

		return "Đã xóa sản phẩm khỏi giỏ hàng!";
	}
}
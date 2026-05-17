package com.nhom2.MaxxSports.service;

import com.nhom2.MaxxSports.dto.request.FeedbackRequest;
import com.nhom2.MaxxSports.entity.Feedback;
import com.nhom2.MaxxSports.entity.ProductDetail;
import com.nhom2.MaxxSports.entity.User;
import com.nhom2.MaxxSports.repository.FeedbackRepository;
import com.nhom2.MaxxSports.repository.ProductDetailRepository;
import com.nhom2.MaxxSports.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final ProductDetailRepository productDetailRepository;

    // LUỒNG USER: Tạo đánh giá mới
    @Transactional
    public String createFeedback(String email, FeedbackRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        ProductDetail productDetail = productDetailRepository.findById(request.getMaCtsp())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        if (request.getSoSao() < 1 || request.getSoSao() > 5) {
            throw new RuntimeException("Số sao đánh giá phải nằm trong khoảng từ 1 đến 5");
        }

        Feedback feedback = Feedback.builder()
                .user(user)
                .productDetail(productDetail)
                .soSao(request.getSoSao())
                .tieuDe(request.getTieuDe())
                .noiDung(request.getNoiDung())
                .build();

        feedbackRepository.save(feedback);
        return "Gửi đánh giá sản phẩm thành công!";
    }

    // LUỒNG PUBLIC: Xem đánh giá theo từng sản phẩm cụ thể
    public List<Feedback> getFeedbacksByProduct(Long maCtsp) {
        ProductDetail productDetail = productDetailRepository.findById(maCtsp)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        return feedbackRepository.findByProductDetailOrderByNgayDangDesc(productDetail);
    }

    // LUỒNG ADMIN: Xem toàn bộ đánh giá của cả hệ thống để kiểm duyệt
    public List<Feedback> getAllFeedbacksForAdmin() {
        return feedbackRepository.findAllByOrderByNgayDangDesc();
    }

    // LUỒNG ADMIN: Xóa một đánh giá vi phạm chuẩn mực
    @Transactional
    public String deleteFeedback(Long maDanhGia) {
        Feedback feedback = feedbackRepository.findById(maDanhGia)
                .orElseThrow(() -> new RuntimeException("Đánh giá không tồn tại hoặc đã bị xóa trước đó"));

        feedbackRepository.delete(feedback);
        return "Đã xóa đánh giá vi phạm thành công!";
    }
}
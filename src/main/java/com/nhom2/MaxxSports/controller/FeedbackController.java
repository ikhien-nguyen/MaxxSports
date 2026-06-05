package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.dto.request.FeedbackRequest;
import com.nhom2.MaxxSports.entity.Feedback;
import com.nhom2.MaxxSports.service.FeedbackService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
@CrossOrigin("*") // Chặn triệt để lỗi CORS khi React gọi API từ cổng 5173
public class FeedbackController {

    private final FeedbackService feedbackService;

    // API 1: [User] Khách hàng gửi đánh giá (Yêu cầu Token Đăng nhập)
    @PostMapping("/add")
    public ResponseEntity<String> addFeedback(Principal principal, @RequestBody FeedbackRequest request) {
        String email = principal.getName();
        String message = feedbackService.createFeedback(email, request);
        return ResponseEntity.ok(message);
    }

    // API 2: [Public] Lấy danh sách đánh giá của sản phẩm (Hiển thị chi tiết sản phẩm)
    @GetMapping("/product/{maCtsp}")
    public ResponseEntity<List<FeedbackResponseDTO>> getProductFeedbacks(@PathVariable Long maCtsp) {
        List<Feedback> feedbacks = feedbackService.getFeedbacksByProduct(maCtsp);
        return ResponseEntity.ok(mapToDTOList(feedbacks));
    }

    // API 3: [Admin] Lấy TOÀN BỘ đánh giá của cả hệ thống MaxxSports
    @GetMapping("/admin/all")
    public ResponseEntity<List<FeedbackResponseDTO>> getAllFeedbacksForAdmin() {
        List<Feedback> feedbacks = feedbackService.getAllFeedbacksForAdmin();
        return ResponseEntity.ok(mapToDTOList(feedbacks));
    }

    // API 4: [Admin] Xóa một đánh giá vi phạm (Sử dụng POST thay vì GET để bảo mật và toàn vẹn dữ liệu)
    @PostMapping("/admin/delete/{maDanhGia}")
    public ResponseEntity<String> deleteFeedbackByAdmin(@PathVariable Long maDanhGia) {
        String message = feedbackService.deleteFeedback(maDanhGia);
        return ResponseEntity.ok(message);
    }

    // Hàm bổ trợ thực hiện Map dữ liệu sạch từ Entity -> DTO tránh lỗi Lazy Loading
    private List<FeedbackResponseDTO> mapToDTOList(List<Feedback> feedbacks) {
        return feedbacks.stream().map(fb -> new FeedbackResponseDTO(
                fb.getMaDanhGia(),
                fb.getSoSao(),
                fb.getTieuDe(),
                fb.getNoiDung(),
                fb.getNgayDang().toString(),
                fb.getUser() != null ? fb.getUser().getEmail() : "Khách hàng ẩn danh"
        )).toList();
    }

    // --- DTO RESPONSE SẠCH CHO FRONTEND ---
    @Data
    @AllArgsConstructor
    public static class FeedbackResponseDTO {
        private Long maDanhGia;
        private int soSao;
        private String tieuDe;
        private String noiDung;
        private String ngayDang;
        private String emailNguoiDung;
    }
}
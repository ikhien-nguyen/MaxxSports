package com.nhom2.MaxxSports.dto.request;

import lombok.Data;

@Data
public class FeedbackRequest {
    private Long maCtsp;
    private int soSao;
    private String tieuDe;
    private String noiDung;
}
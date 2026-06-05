package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.repository.SizeRepository;
import com.nhom2.MaxxSports.entity.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sizes")
@RequiredArgsConstructor
public class SizeController {

    private final SizeRepository sizeRepository;

    @GetMapping
    public List<Size> getAll() {
        return sizeRepository.findAll();
    }
}

package com.nhom2.MaxxSports.controller;

import com.nhom2.MaxxSports.entity.Mau;
import com.nhom2.MaxxSports.repository.MauRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/colors")
@RequiredArgsConstructor
public class MauController {

    private final MauRepository mauRepository;

    @GetMapping
    public List<Mau> getAll() {
        return mauRepository.findAll();
    }
}

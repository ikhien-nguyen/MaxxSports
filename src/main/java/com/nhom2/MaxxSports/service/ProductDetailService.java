package com.nhom2.MaxxSports.service;

import com.nhom2.MaxxSports.dto.request.ProductDetailRequest;
import com.nhom2.MaxxSports.dto.response.ProductDetailResponse;
import com.nhom2.MaxxSports.entity.Images;
import com.nhom2.MaxxSports.entity.Mau;
import com.nhom2.MaxxSports.entity.Product;
import com.nhom2.MaxxSports.entity.ProductDetail;
import com.nhom2.MaxxSports.entity.Size;
import com.nhom2.MaxxSports.mapper.ProductDetailMapper;
import com.nhom2.MaxxSports.repository.ImageRepository;
import com.nhom2.MaxxSports.repository.MauRepository;
import com.nhom2.MaxxSports.repository.ProductDetailRepository;
import com.nhom2.MaxxSports.repository.ProductRepository;
import com.nhom2.MaxxSports.repository.SizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductDetailService {

    private final ProductRepository productRepository;

    private final ProductDetailRepository productDetailRepository;

    private final SizeRepository sizeRepository;

    private final MauRepository mauRepository;

    private final ImageRepository imageRepository;

    private final ProductDetailMapper productDetailMapper;

    public ProductDetailResponse create(
            ProductDetailRequest request
    ) {

        Product product =
                productRepository.findById(
                        request.getProductId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy sản phẩm"
                        ));

        Size size =
                sizeRepository.findById(
                        request.getSizeId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy size"
                        ));

        Mau mau =
                mauRepository.findById(
                        request.getMauId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy màu"
                        ));

        ProductDetail productDetail =
                productDetailMapper.toEntity(request);

        productDetail.setProduct(product);

        productDetail.setSize(size);

        productDetail.setMau(mau);

        productDetail =
                productDetailRepository.save(
                        productDetail
                );

        if (request.getImage() != null
                && !request.getImage().isBlank()) {

            Images image = Images.builder()
                    .url(request.getImage())
                    .productDetail(productDetail)
                    .build();

            productDetail.getImages().add(image);

            productDetail =
                    productDetailRepository.save(productDetail);
        }

        productDetail =
                productDetailRepository.findById(
                        productDetail.getMaCtsp()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy chi tiết sản phẩm"
                        ));

        ProductDetailResponse response =
                productDetailMapper.toResponse(
                        productDetail
                );

        if (productDetail.getImages() != null
                && !productDetail.getImages().isEmpty()) {

            response.setImage(
                    productDetail.getImages()
                            .get(0)
                            .getUrl()
            );
        }
        System.out.println(productDetail.getImages());
        return response;
    }

    public ProductDetailResponse update(
            Long id,
            ProductDetailRequest request
    ) {

        ProductDetail productDetail =
                productDetailRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Không tìm thấy chi tiết sản phẩm"
                                ));

        Product product =
                productRepository.findById(
                        request.getProductId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy sản phẩm"
                        ));

        Size size =
                sizeRepository.findById(
                        request.getSizeId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy size"
                        ));

        Mau mau =
                mauRepository.findById(
                        request.getMauId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy màu"
                        ));

        productDetail.setProduct(product);

        productDetail.setSize(size);

        productDetail.setMau(mau);

        productDetail.setSoLuong(
                request.getSoLuong()
        );

        productDetail =
                productDetailRepository.save(
                        productDetail
                );

        if (request.getImage() != null
                && !request.getImage().isBlank()) {

            Images image;

            if (productDetail.getImages() != null
                    && !productDetail.getImages().isEmpty()) {

                image =
                        productDetail.getImages().get(0);

                image.setUrl(
                        request.getImage()
                );

            } else {

                image = Images.builder()
                        .url(request.getImage())
                        .productDetail(productDetail)
                        .build();
            }

            imageRepository.save(image);
        }

        productDetail =
                productDetailRepository.findById(
                        productDetail.getMaCtsp()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy chi tiết sản phẩm"
                        ));

        ProductDetailResponse response =
                productDetailMapper.toResponse(
                        productDetail
                );

        if (productDetail.getImages() != null
                && !productDetail.getImages().isEmpty()) {

            response.setImage(
                    productDetail.getImages()
                            .get(0)
                            .getUrl()
            );
        }

        return response;
    }

    public ProductDetailResponse getById(
            Long id
    ) {

        ProductDetail productDetail =
                productDetailRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Không tìm thấy chi tiết sản phẩm"
                                ));

        ProductDetailResponse response =
                productDetailMapper.toResponse(
                        productDetail
                );

        if (productDetail.getImages() != null
                && !productDetail.getImages().isEmpty()) {

            response.setImage(
                    productDetail.getImages()
                            .get(0)
                            .getUrl()
            );
        }

        return response;
    }

    public void delete(
            Long id
    ) {

        ProductDetail productDetail =
                productDetailRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Không tìm thấy chi tiết sản phẩm"
                                ));

        productDetailRepository.delete(
                productDetail
        );
    }
}
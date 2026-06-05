package com.nhom2.MaxxSports.configuration;

import com.nhom2.MaxxSports.entity.*;
import com.nhom2.MaxxSports.repository.*;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DeepSapoCrawlerService implements CommandLineRunner {

    private final ProductTypeRepository productTypeRepo;
    private final CategoryRepository categoryRepo;
    private final ProductRepository productRepo;
    private final SizeRepository sizeRepo;
    private final MauRepository mauRepo;
    private final ProductDetailRepository productDetailRepo;
    private final ImageRepository imageRepo;

    // Cache dữ liệu trên RAM để truy xuất siêu tốc và tránh lỗi Khóa ngoại
    private List<ProductType> cachedProductTypes = new ArrayList<>();
    private List<Category> cachedCategories = new ArrayList<>();
    private List<Mau> cachedMaus = new ArrayList<>();
    private List<Size> cachedSizes = new ArrayList<>();

    @Override
    public void run(String... args) throws Exception {
        // Tránh cào lại nếu database đã có sẵn sản phẩm
        if (productRepo.count() > 0) return;

        System.out.println("⏳ Đang khởi động Deep Crawler (Tích hợp Loại Sản Phẩm & Danh Mục)...");

        // Tải sẵn danh sách các bảng phụ lên RAM
        cachedProductTypes = productTypeRepo.findAll();
        cachedCategories = categoryRepo.findAll();
        cachedMaus = mauRepo.findAll();
        cachedSizes = sizeRepo.findAll();

        String baseDomain = "https://xsports.vn";
        String listUrl = baseDomain + "/tat-ca-san-pham";

        try {
            // ========================================================
            // CHẶNG 1: LẤY DANH SÁCH LINK TỪ TRANG TỔNG
            // ========================================================
            Document listPage = Jsoup.connect(listUrl).userAgent("Mozilla/5.0").get();
            Elements productLinks = listPage.select(".item_product_main .product-name a");

            System.out.println("Tìm thấy " + productLinks.size() + " link sản phẩm. Chuẩn bị cào sâu...");

            // ========================================================
            // CHẶNG 2: VÀO TỪNG TRANG CHI TIẾT ĐỂ BÓC DỮ LIỆU THẬT
            // ========================================================
            for (Element linkEl : productLinks) {
                String detailUrl = baseDomain + linkEl.attr("href");
                System.out.println("Đang cào: " + detailUrl);

                try {
                    Document doc = Jsoup.connect(detailUrl).userAgent("Mozilla/5.0").timeout(15000).get();

                    // 1. BÓC THÔNG TIN CƠ BẢN SẢN PHẨM
                    String tenSP = doc.select("h1.title-product").text();
                    if (tenSP.isEmpty()) continue;

                    Element priceElement = doc.select(".special-price .product-price").first();
                    String giaStr = (priceElement != null) ? priceElement.text() : "0";
                    Double gia = parsePrice(giaStr);

                    Element brandEl = doc.select(".first_status .status_name").first();
                    String thuongHieu = (brandEl != null && !brandEl.text().contains("Đang cập nhật"))
                            ? brandEl.text() : "XSPORTS";

                    String moTa = doc.select("#content.js-content").html();

                    // 2. BÓC LOẠI SẢN PHẨM & DANH MỤC THẬT TỪ THẺ META
                    String tenPhanLoai = doc.select("meta[itemprop=category]").attr("content");
                    if (tenPhanLoai.isEmpty()) {
                        tenPhanLoai = "Sản phẩm khác";
                    }

                    // TẠO LOẠI SẢN PHẨM TRƯỚC
                    ProductType realProductType = getOrCreateProductType(tenPhanLoai);

                    // SAU ĐÓ TẠO DANH MỤC VÀ GẮN VÀO LOẠI SẢN PHẨM
                    Category realCategory = getOrCreateCategory(tenPhanLoai, realProductType);

                    // 3. LƯU VÀO BẢNG PRODUCT
                    Product product = new Product();
                    product.setTenSanPham(tenSP);
                    product.setThuongHieu(thuongHieu);
                    product.setGia(gia);
                    product.setMoTa(moTa);
                    product.setLoaiSanPham(tenPhanLoai);
                    product.setChatLieu("Poly Spandex Cao Cấp");

                    // Nối Sản phẩm với Danh mục
                    product.setCategory(realCategory);

                    product = productRepo.save(product);

                    // 4. BÓC MÀU SẮC & KÍCH THƯỚC
                    Elements colorElements = doc.select(".swatch-color .swatch-element");
                    Elements sizeElements = doc.select(".swatch[data-option-index=1] .swatch-element");

                    List<Mau> savedColors = new ArrayList<>();
                    for (Element colorEl : colorElements) {
                        String tenMau = colorEl.attr("data-value");
                        savedColors.add(getOrCreateMau(tenMau));
                    }

                    List<Size> savedSizes = new ArrayList<>();
                    for (Element sizeEl : sizeElements) {
                        String tenSize = sizeEl.attr("data-value");
                        savedSizes.add(getOrCreateSize(tenSize));
                    }

                    // Đề phòng sản phẩm không phân loại
                    if (savedColors.isEmpty()) savedColors.add(getOrCreateMau("Mặc định"));
                    if (savedSizes.isEmpty()) savedSizes.add(getOrCreateSize("Freesize"));

                    // 5. TẠO PRODUCT DETAIL (Tổ hợp chéo Màu x Size)
                    List<ProductDetail> listProductDetails = new ArrayList<>();
                    for (Mau m : savedColors) {
                        for (Size s : savedSizes) {
                            ProductDetail pd = new ProductDetail();
                            pd.setProduct(product);
                            pd.setMau(m);
                            pd.setSize(s);
                            pd.setSoLuong((int) (Math.random() * 50) + 10); // Random số lượng từ 10 - 60

                            pd = productDetailRepo.save(pd);
                            listProductDetails.add(pd);
                        }
                    }

                    // 6. BÓC LINK ẢNH VÀ LƯU VÀO BẢNG IMAGES
                    Elements imgElements = doc.select("#gallery_02 img");
                    List<String> imageUrls = new ArrayList<>();
                    for (Element imgEl : imgElements) {
                        String src = imgEl.hasAttr("data-img") ? imgEl.attr("data-img") : imgEl.attr("src");
                        if (src.startsWith("//")) src = "https:" + src;
                        if (!imageUrls.contains(src) && !src.isEmpty()) imageUrls.add(src);
                    }

                    for (ProductDetail pd : listProductDetails) {
                        for (String imgUrl : imageUrls) {
                            Images image = new Images();
                            image.setUrl(imgUrl);
                            image.setProductDetail(pd);
                            imageRepo.save(image);
                        }
                    }

                    Thread.sleep(1000); // Tránh bị khóa IP

                } catch (Exception e) {
                    System.out.println("Lỗi ở trang chi tiết: " + detailUrl + " -> " + e.getMessage());
                }
            }
            System.out.println("HOÀN TẤT CÀO DỮ LIỆU! CẤU TRÚC PHÂN CẤP ĐÃ ĐƯỢC ĐỒNG BỘ.");

        } catch (Exception e) {
            System.out.println("Lỗi mạng khi quét trang tổng: " + e.getMessage());
        }
    }

    // ==========================================
    // CÁC HÀM PHỤ TRỢ XỬ LÝ DỮ LIỆU
    // ==========================================

    private ProductType getOrCreateProductType(String tenLoai) {
        return cachedProductTypes.stream()
                .filter(pt -> pt.getName().equalsIgnoreCase(tenLoai))
                .findFirst()
                .orElseGet(() -> {
                    ProductType newProductType = new ProductType();
                    newProductType.setName(tenLoai);
                    ProductType saved = productTypeRepo.save(newProductType);
                    cachedProductTypes.add(saved);
                    return saved;
                });
    }

    private Category getOrCreateCategory(String tenDanhMuc, ProductType productType) {
        return cachedCategories.stream()
                .filter(c -> c.getName().equalsIgnoreCase(tenDanhMuc))
                .findFirst()
                .orElseGet(() -> {
                    Category newCategory = new Category();
                    newCategory.setName(tenDanhMuc);
                    newCategory.setDescription("Dữ liệu tự động bóc tách từ Web");
                    // Liên kết Danh mục này với Loại Sản Phẩm tương ứng
                    newCategory.setProductType(productType);
                    Category saved = categoryRepo.save(newCategory);
                    cachedCategories.add(saved);
                    return saved;
                });
    }

    private Mau getOrCreateMau(String tenMau) {
        return cachedMaus.stream()
                .filter(m -> m.getMau().equalsIgnoreCase(tenMau))
                .findFirst()
                .orElseGet(() -> {
                    Mau newMau = new Mau();
                    newMau.setMau(tenMau);
                    Mau saved = mauRepo.save(newMau);
                    cachedMaus.add(saved);
                    return saved;
                });
    }

    private Size getOrCreateSize(String tenSize) {
        return cachedSizes.stream()
                .filter(s -> s.getSize().equalsIgnoreCase(tenSize))
                .findFirst()
                .orElseGet(() -> {
                    Size newSize = new Size();
                    newSize.setSize(tenSize);
                    newSize.setMoTa("Size " + tenSize);
                    Size saved = sizeRepo.save(newSize);
                    cachedSizes.add(saved);
                    return saved;
                });
    }

    private Double parsePrice(String priceStr) {
        try {
            String firstPrice = priceStr.split("\\s+")[0];
            return Double.parseDouble(firstPrice.replaceAll("\\D", ""));
        } catch (Exception e) {
            return 0.0;
        }
    }
}
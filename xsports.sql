CREATE DATABASE IF NOT EXISTS xsports;
USE xsports;

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20)
);

CREATE TABLE product (
    ma_san_pham BIGINT PRIMARY KEY AUTO_INCREMENT,
    ten_san_pham VARCHAR(255),
    gia DOUBLE
);

CREATE TABLE product_detail (
    ma_ctsp BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_san_pham BIGINT,
    so_luong INT,
    FOREIGN KEY (ma_san_pham) REFERENCES product(ma_san_pham)
);

CREATE TABLE images (
    id VARCHAR(36) PRIMARY KEY,
    url TEXT,
    public_id VARCHAR(255),
    ma_ctsp BIGINT,
    FOREIGN KEY (ma_ctsp) REFERENCES product_detail(ma_ctsp)
);

CREATE TABLE cart (
    ma_gio_hang BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(36)
);

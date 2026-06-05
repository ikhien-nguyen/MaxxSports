import React, { useState, useEffect } from 'react';
import './AdminProducts.css';
import { productService }
  from "../../services/productService";
import { optionService } from "../../services/optionService";
import { productDetailService } from "../../services/productDetailService";
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const AdminProducts = () => {
  const [product,setProduct] = useState({
    name:"",
    brand:"",
    material:"",
    category:"",
    price:"",
    description:"",
    productDetails:[]
  });
  const [isDetailModalOpen,setIsDetailModalOpen] = useState(false);
  const [detail,setDetail] = useState({
    size:"",
    color:"",
    quantity:"",
    image:""
  });
  const [categories, setCategories] = useState([]);
  const [products,setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState('');
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const loadOptions = async () => {

    try {

      const colorData =
          await optionService.getColors();

      const sizeData =
          await optionService.getSizes();

      setColors(colorData);

      setSizes(sizeData);

    } catch(err){

      console.log(err);

    }
  };
  const handleSave = async (e) => {

    e.preventDefault();

    try {

      const productRequest = {

        tenSanPham: product.name || "",

        thuongHieu: product.brand || "",

        chatLieu: product.material || "",

        loaiSanPham: product.category || "",

        gia: Number(product.price || 0),

        moTa: product.description || "",

        thumbnail:
            product.productDetails[0]?.image || ""

      };

      let productResponse;

      if(editingProduct){

        productResponse =
            await productService.updateProduct(
                editingProduct.maSanPham,
                productRequest
            );

      } else {
        console.log(
            "REQUEST GUI:",
            productRequest
        );
        productResponse =
            await productService.createProduct(
                productRequest
            );

      }

      console.log(
          "PRODUCT RESPONSE:",
          productResponse
      );

      const productId =
          editingProduct
              ? editingProduct.maSanPham
              : productResponse.maSanPham;
      console.log("PRODUCT RESPONSE:", productResponse);
      console.log("PRODUCT ID:", productId);
      if(!productId){

        alert("Không lấy được productId");

        return;
      }

      for (const item of product.productDetails) {

        const detailRequest = {

          productId: productId,

          sizeId: item.sizeId,

          mauId: item.colorId,

          soLuong: Number(item.quantity),

          image: item.image
        };

        console.log(detailRequest);

        if(item.maCtsp){

          if(!item.sizeId || !item.colorId){

            console.log("Detail cũ chưa có ID size/màu");

            continue;
          }

          await productDetailService.updateDetail(
              item.maCtsp,
              detailRequest
          );

        }else{

          await productDetailService.createDetail(
              detailRequest
          );

        }
      }

      await loadData();

      handleCloseModal();

      showToast(
          editingProduct
              ? "Cập nhật thành công"
              : "Thêm sản phẩm thành công"
      );

    } catch(err){

      console.log(err);

      console.log(
          err.response?.data
      );

      alert(
          JSON.stringify(
              err.response?.data
          )
      );
    }
  };
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };
  const addProductDetail = () => {

    if (
        !detail.size ||
        !detail.color ||
        !detail.quantity ||
        !detail.image
    ) {
      alert("Nhập đầy đủ thông tin");
      return;
    }

    setProduct(prev => ({

      ...prev,

      productDetails:[

        ...prev.productDetails,

        {

          size: sizes.find(
              x => x.maSize == detail.size
          )?.size,

          sizeId: detail.size,

          color: colors.find(
              x => x.maMau == detail.color
          )?.mau,

          colorId: detail.color,

          quantity:Number(detail.quantity),

          image:detail.image

        }

      ]

    }));
    console.log(product.productDetails);
    setDetail({
      size: "",
      color: "",
      quantity: "",
      image: ""
    });

    setIsDetailModalOpen(false);
  };
  const removeDetail = (index)=>{

    setProduct({

      ...product,

      productDetails:

          product.productDetails.filter(
              (_,i)=>i!==index
          )

    });

  };
  const loadData = async () => {

    try{

      const data =
          await productService
              .getAllProducts();
      console.log(data);
      setProducts(data);

    }catch(err){

      console.log(err);
    }
  };

  useEffect(() => {

    loadData();
    loadOptions();
  }, []);

  const formatCurrency = (amount) => {

    return Number(
        amount || 0
    ).toLocaleString(
        "vi-VN"
    ) + "đ";
  };

  const handleOpenModal = (product = null) => {
    setDetail({
      size:"",
      color:"",
      quantity:"",
      image:""
    });
    if (product) {
      setEditingProduct(product);
      setProduct({

        name:product.tenSanPham,

        brand:product.thuongHieu,

        material:product.chatLieu,

        category:product.loaiSanPham,

        price:product.gia,

        description:product.moTa,

        productDetails:
            product.productDetails?.map(item => ({

              maCtsp: item.maCtsp,

              size: item.size,

              color: item.mau,

              quantity: item.soLuong,

              image: item.image,

              sizeId: null,

              colorId: null

            })) || []

      });

    } else {
      setEditingProduct(null);
      setProduct({

        name:"",
        brand:"",
        material:"",
        category:"",
        price:"",
        description:"",
        productDetails:[]

      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

const handleDelete = async (id) => {

  if(
      window.confirm(
          "Bạn có chắc?"
      )
  ){
    try{

      await productService
          .deleteProduct(id);

      await loadData();


      showToast(
          "Xóa thành công"
      );

    }catch(err){

      console.log(err);

      alert(
          "Xóa thất bại"
      );
    }
  }
};

  const getCategoryName = (slug) => {
    const cat = categories.find(c => c.slug === slug);
    return cat ? cat.name : slug;
  };

  return (
    <div className="admin-products-container">
      {/* Toast */}
      {toast && <div className="admin-toast">{toast}</div>}
      <div className="products-header-actions">
        <button className="add-product-btn" onClick={() => handleOpenModal()}>
          <PlusIcon />
          Thêm Sản phẩm
        </button>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên Sản phẩm</th>
              <th>Loại sản phẩm</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                  <tr key={product.maSanPham}>
                  <td>
                    <img
                        src={product.thumbnail || 'https://via.placeholder.com/50'}
                        alt={product.tenSanPham}
                      className="product-image-thumb" 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                    />
                  </td>
                  <td><span className="product-name">{product.tenSanPham}</span></td>
                  <td>
                    <span className="product-category-badge">{getCategoryName(product.loaiSanPham)}</span>
                  </td>
                  <td className="product-price">{formatCurrency(product.gia)}</td>
                    <td>

                      {
                          product.productDetails?.reduce(

                              (total, detail)=>

                                  total +
                                  (detail.soLuong || 0),

                              0

                          ) || 0
                      }

                    </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit-btn" onClick={() => handleOpenModal(product)} title="Sửa">
                        <EditIcon />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(product.maSanPham)} title="Xóa">
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  Chưa có sản phẩm nào trong kho.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="product-modal-overlay">
          <div className="product-modal">
            <div className="modal-header">
              <h2>{editingProduct ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form className="modal-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Tên Sản phẩm</label>
                <input 
                  type="text" 
                  required
                  value={product.name}

                  onChange={(e)=>

                      setProduct({

                        ...product,

                        name:e.target.value

                      })

                  }
                  placeholder="VD: Giày chạy bộ XSPORT"
                />
              </div>

              <div className="form-group">

                <label>Thương hiệu</label>

                <select
                    required
                    value={product.brand}
                    onChange={(e)=>
                        setProduct({
                          ...product,
                          brand: e.target.value
                        })
                    }
                >

                  <option value="">Chọn thương hiệu</option>

                  <option value="ADIDAS">ADIDAS</option>

                  <option value="NIKE">NIKE</option>

                  <option value="361">361</option>

                  <option value="ATINO">ATINO</option>

                  <option value="XSPORT">XSPORT</option>

                </select>

              </div>
              <div className="form-group">

                <label>Chất liệu</label>

                <input

                    value={product.material}

                    onChange={(e)=>

                        setProduct({

                          ...product,

                          material:e.target.value

                        })

                    }

                />

              </div>
              <div className="form-group">

                <label>Loại sản phẩm</label>

                <select
                    required
                    value={product.category}
                    onChange={(e)=>
                        setProduct({
                          ...product,
                          category: e.target.value
                        })
                    }
                >

                  <option value="">Chọn loại sản phẩm</option>

                  <option value="Quần áo chạy bộ">
                    Quần áo chạy bộ
                  </option>

                  <option value="Đồng hồ">
                    Đồng hồ
                  </option>

                  <option value="Giày/Dép">
                    Giày/Dép
                  </option>

                  <option value="Tất">
                    Tất
                  </option>

                </select>

              </div>
              <div className="form-group">
                <label>Giá (VNĐ)</label>
                <input 
                  type="number" 
                  required
                  value={product.price}

                  onChange={(e)=>

                      setProduct({

                        ...product,

                        price:e.target.value

                      })

                  }
                  placeholder="VD: 1500000"
                />
              </div>
              <div className="form-group full-width">

                <label>Mô tả</label>

                <textarea

                    value={product.description}

                    onChange={(e)=>

                        setProduct({

                          ...product,

                          description:e.target.value

                        })

                    }

                />

              </div>
              <div className="detail-header">

                <h3>Chi tiết sản phẩm</h3>

                <button
                    type="button"
                    className="add-detail-btn"
                    onClick={()=>setIsDetailModalOpen(true)}
                >

                  + Thêm chi tiết sản phẩm

                </button>

              </div>

              <table className="detail-table">

                <thead>

                <tr>

                  <th>Ảnh</th>

                  <th>Size</th>

                  <th>Màu</th>

                  <th>SL</th>

                  <th>Thao tác</th>

                </tr>

                </thead>

                <tbody>
                {
                  product.productDetails.length > 0 ? (

                      product.productDetails.map((item,index)=>(

                          <tr key={index}>
                            <td>
                              <img src={item.image} width="60" alt="" />
                            </td>
                            <td>{item.size}</td>
                            <td>{item.color}</td>
                            <td>{item.quantity}</td>
                            <td>
                              <button
                                  type="button"
                                  onClick={() => removeDetail(index)}
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>

                      ))

                  ) : (

                      <tr>
                        <td colSpan="5">
                          Chưa có chi tiết sản phẩm
                        </td>
                      </tr>

                  )
                }
                </tbody>

              </table>


              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Hủy</button>
                <button type="submit" className="save-btn">Lưu Sản phẩm</button>
              </div>
            </form>
            {

                isDetailModalOpen && (

                    <div className="detail-modal-overlay">

                      <div className="detail-modal">

                        <h3>Thêm chi tiết sản phẩm</h3>

                        <select
                            value={detail.size}
                            onChange={(e)=>

                                setDetail({

                                  ...detail,

                                  size:Number(
                                      e.target.value
                                  )

                                })

                            }
                        >

                          <option value="">

                            Size

                          </option>

                          {

                            sizes.map(item=>(

                                <option
                                    key={item.maSize}
                                    value={item.maSize}
                                >
                                  {item.size}
                                </option>

                            ))

                          }

                        </select>


                        <select
                            value={detail.color}
                            onChange={(e)=>

                                setDetail({

                                  ...detail,

                                  color:Number(
                                      e.target.value
                                  )

                                })

                            }
                        >

                          <option value="">

                            Màu

                          </option>

                          {

                            colors.map(item=>(

                                <option
                                    key={item.maMau}
                                    value={item.maMau}
                                >
                                  {item.mau}
                                </option>

                            ))

                          }
                        </select>


                        <input
                            type="number"
                            placeholder="Số lượng"
                            value={detail.quantity}
                            onChange={(e)=>

                                setDetail({

                                  ...detail,
                                  quantity:e.target.value

                                })

                            }
                        />


                        <input
                            type="file"

                            onChange={(e)=>{

                              const file=e.target.files[0];

                              if(file){

                                const reader =
                                    new FileReader();

                                reader.onload=()=>{

                                  setDetail({

                                    ...detail,
                                    image:reader.result

                                  })

                                };

                                reader.readAsDataURL(file);

                              }

                            }}

                        />

                        {

                            detail.image &&

                            <img
                                src={detail.image}
                                className="preview-img"
                            />

                        }

                        <div className="detail-actions">

                          <button
                              type="button"
                              onClick={()=>setIsDetailModalOpen(false)}
                          >

                            Hủy

                          </button>

                          <button
                              type="button"
                              onClick={addProductDetail}
                          >

                            Thêm

                          </button>

                        </div>

                      </div>

                    </div>

                )

            }
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

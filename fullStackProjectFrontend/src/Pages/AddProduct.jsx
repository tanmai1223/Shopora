import { useEffect, useState } from "react";
import axios from "axios";
import style from "../Styles/AddProduct.module.css";
import Header from "../Components/Header";
import Category from "../Components/Category";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState({
    productName: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    available: true,
    stock: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/products/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append(
        "product",
        JSON.stringify({
          ...product,
          price: Number(product.price),
          stock: Number(product.stock),
          available: Boolean(product.available),
        }),
      );

      formData.append("image", image);

      const response = await axios.post(
        `${API_URL}/api/product`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

     

      toast.success("Product added successfully!");

      setProduct({
        productName: "",
        description: "",
        price: "",
        brand: "",
        category: "",
        available: true,
        stock: "",
      });

      setImage(null);

      e.target.reset();

     
    } catch (error) {
      console.log(error);
      toast.error("Failed to add product");
    }
  };

  return (
    <>
      <Header />
      <Category />
      <div className={style.page}>
        <div className={style.formContainer}>
          <div className={style.header}>
            <h1>Add Product</h1>
            <p>Add a new product to your store</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={style.formGrid}>
              {/* Product Name */}
              <div className={style.formGroup}>
                <label>Product Name</label>

                <input
                  type="text"
                  name="productName"
                  placeholder="Enter product name"
                  value={product.productName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Brand */}
              <div className={style.formGroup}>
                <label>Brand</label>

                <input
                  type="text"
                  name="brand"
                  placeholder="Enter brand"
                  value={product.brand}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Category */}
              <div className={style.formGroup}>
                <label>Category</label>

                <div className={style.categoryInputWrapper}>
                  <input
                    type="text"
                    name="category"
                    placeholder="Search or enter category"
                    value={categorySearch}
                    onChange={(e) => {
                      setCategorySearch(e.target.value);

                      setProduct((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }));

                      setShowCategories(true);
                    }}
                    onFocus={() => setShowCategories(true)}
                    required
                  />

                  <span
                    className={style.dropdownArrow}
                    onClick={() => setShowCategories((prev) => !prev)}
                  >
                    ▼
                  </span>

                  {showCategories && (
                    <div className={style.categoryDropdown}>
                      {categories
                        .filter((category) =>
                          category
                            .toLowerCase()
                            .includes(categorySearch.toLowerCase()),
                        )
                        .map((category) => (
                          <div
                            key={category}
                            className={style.categoryOption}
                            onClick={() => {
                              setCategorySearch(category);

                              setProduct((prev) => ({
                                ...prev,
                                category: category,
                              }));

                              setShowCategories(false);
                            }}
                          >
                            {category}
                          </div>
                        ))}

                      {/* New category */}
                      {categorySearch &&
                        !categories.some(
                          (category) =>
                            category.toLowerCase() ===
                            categorySearch.toLowerCase(),
                        ) && (
                          <div
                            className={style.newCategory}
                            onClick={() => {
                              setProduct((prev) => ({
                                ...prev,
                                category: categorySearch,
                              }));

                              setShowCategories(false);
                            }}
                          >
                            Use "{categorySearch}"
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className={style.formGroup}>
                <label>Price</label>

                <div className={style.inputWithSymbol}>
                  <span>₹</span>

                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    value={product.price}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Stock */}
              <div className={style.formGroup}>
                <label>Stock</label>

                <input
                  type="number"
                  name="stock"
                  placeholder="Enter stock quantity"
                  value={product.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              {/* Availability */}
              <div className={style.formGroup}>
                <label>Availability</label>

                <select
                  name="available"
                  value={product.available}
                  onChange={(e) =>
                    setProduct((prev) => ({
                      ...prev,
                      available: e.target.value === "true",
                    }))
                  }
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>

              {/* Description */}
              <div className={`${style.formGroup} ${style.fullWidth}`}>
                <label>Description</label>

                <textarea
                  name="description"
                  placeholder="Enter product description"
                  value={product.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>

              {/* Image */}
              <div className={`${style.formGroup} ${style.fullWidth}`}>
                <label>Product Image</label>

                <div className={style.fileBox}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />

                  <p>{image ? image.name : "Choose a product image"}</p>
                </div>
              </div>
            </div>

            <div className={style.actions}>
              <button type="button" className={style.cancelButton}>
                Cancel
              </button>

              <button type="submit" className={style.submitButton}>
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddProduct;

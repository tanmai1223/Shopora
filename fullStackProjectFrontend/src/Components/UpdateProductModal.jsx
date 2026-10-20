import { useEffect, useState } from "react";
import axios from "axios";
import style from "../Styles/UpdateProductModal.module.css";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;


function UpdateProductModal({ product, onClose, onUpdated }) {

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    available: true,
    stock: ""
  });

  const [image, setImage] = useState(null);
  const token = localStorage.getItem("token");
  

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName,
        description: product.description,
        price: product.price,
        brand: product.brand,
        category: product.category,
        available: product.available,
        stock: product.stock
      });

      setImage(null);
    }
  }, [product]);


  if (!product) return null;


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const updatedProduct = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        available:
          formData.available === true ||
          formData.available === "true"
      };


      // Create multipart/form-data
      const data = new FormData();


      // Product JSON
      data.append(
        "product",
        JSON.stringify(updatedProduct)
      );


      // Image only if user selected a new one
      if (image) {
        data.append("image", image);
      }


      const response = await axios.put(
        `${API_URL}/api/products/${product.id}`,
        data,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
      );


      toast.success("Product updated successfully!");


      // Send updated product back to Cards
      onUpdated(response.data);


      onClose();


    } catch (error) {

      console.log(error);

      toast.error("Failed to update product");
    }
  };


  return (
    <div
      className={style.overlay}
      onClick={onClose}
    >

      <div
        className={style.modal}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close button */}

        <button
          className={style.closeButton}
          onClick={onClose}
        >
          ×
        </button>


        <h2>Update Product</h2>


        <form onSubmit={handleSubmit}>

          <div className={style.formGrid}>

            {/* Product Name */}

            <div className={style.formGroup}>

              <label>Product Name</label>

              <input
                type="text"
                name="productName"
                value={formData.productName}
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
                value={formData.brand}
                onChange={handleChange}
                required
              />

            </div>


            {/* Price */}

            <div className={style.formGroup}>

              <label>Price</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
              />

            </div>


            {/* Stock */}

            <div className={style.formGroup}>

              <label>Stock</label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />

            </div>


            {/* Category */}

            <div className={style.formGroup}>

              <label>Category</label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />

            </div>


            {/* Availability */}

            <div className={style.formGroup}>

              <label>Availability</label>

              <select
                name="available"
                value={formData.available}
                onChange={handleChange}
              >
                <option value={true}>
                  Available
                </option>

                <option value={false}>
                  Not Available
                </option>

              </select>

            </div>


            {/* Description */}

            <div
              className={`${style.formGroup} ${style.fullWidth}`}
            >

              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />

            </div>


            {/* Image */}

            <div
              className={`${style.formGroup} ${style.fullWidth}`}
            >

              <label>
                Change Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {image && (
                <small>
                  Selected: {image.name}
                </small>
              )}

            </div>

          </div>


          {/* Actions */}

          <div className={style.actions}>

            <button
              type="button"
              className={style.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>


            <button
              type="submit"
              className={style.saveButton}
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default UpdateProductModal;
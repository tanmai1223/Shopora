import { useEffect, useState } from "react";
import style from "../Styles/Cards.module.css";
import axios from "axios";
import ProductModal from "./ProductModal";
import UpdateProductModal from "./UpdateProductModal";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;


function Cards({ category, searchResults }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId=localStorage.getItem("userId")
  useEffect(() => {
    // If search was performed, don't fetch category products
    if (searchResults !== null) {
      setProducts(searchResults);
      return;
    }

    const fetchProducts = async () => {
      try {
        let res;

        if (category === "All") {
          res = await axios.get(
            `${API_URL}/api/products`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          res = await axios.get(
            `${API_URL}/api/products/categories/${encodeURIComponent(
              category
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [category, searchResults]);

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `${API_URL}/api/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove deleted product from UI
      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product.id !== productId
        )
      );

      // Close modal if it is open
      setSelectedProduct(null);

      toast.success("Product deleted successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    }
  };

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = async (product) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/cart`,
        {
          productId:product.id,
          quantity: 1,
          userId:userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     
      toast.success("Added to cart");

      setSelectedProduct(null);
    } catch (error) {
      console.log("Error adding to cart:", error);
      toast.error("Couldn't add to cart");
    }
  };

  return (
    <div className={style.cardGrid}>

      {products.map((product) => (
        <div
          className={style.card}
          key={product.id}
          onClick={() => setSelectedProduct(product)}
        >

          {/* Product Image */}
          <div className={style.imageContainer}>
            <img
              src={product.imageUrl}
              alt={product.productName}
            />
          </div>

          {/* Product Name */}
          <h3>{product.productName}</h3>

          {/* Brand */}
          <p className={style.brand}>
            {product.brand}
          </p>

          {/* Price */}
          <p className={style.price}>
            ₹{product.price}
          </p>


          {/* =========================
              USER → ADD TO CART
             ========================= */}

          {role === "USER" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              Add to Cart
            </button>
          )}


          {/* =========================
              ADMIN → UPDATE + DELETE
             ========================= */}

          {role === "ADMIN" && (
            <div className={style.adminActions}>

              <button
                className={style.updateButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingProduct(product);
                }}
              >
                Update
              </button>

              <button
                className={style.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(product.id);
                }}
              >
                Delete
              </button>

            </div>
          )}

        </div>
      ))}


      {/* =========================
          PRODUCT DETAILS MODAL
         ========================= */}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}


      {/* =========================
          UPDATE PRODUCT MODAL
         ========================= */}

      {editingProduct && (
        <UpdateProductModal
          product={editingProduct}

          onClose={() =>
            setEditingProduct(null)
          }

          onUpdated={(updatedProduct) => {

            setProducts((prevProducts) =>
              prevProducts.map((product) =>
                product.id === updatedProduct.id
                  ? updatedProduct
                  : product
              )
            );

            setEditingProduct(null);
          }}
        />
      )}

    </div>
  );
}

export default Cards;
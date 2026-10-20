import { useEffect, useState } from "react";
import axios from "axios";
import style from "../Styles/CartItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import UpdateProductModal from "./UpdateProductModal";
import ProductModal from "./ProductModal";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

function CartItem() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const userId=localStorage.getItem("userId");
  
  // Get all cart items
  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cart`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },);

      setCartItems(response.data);
    } catch (error) {
      console.log("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };
   useEffect(() => {
    fetchCartItems();
  }, []);


  // Increase quantity
  const addQuantity = async (itemId) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/cart/add/${itemId}`,{},{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.itemId === itemId ? response.data : item,
        ),
      );
    } catch (error) {
      console.log("Error increasing quantity:", error);
    }
  };

  // Decrease quantity
  const subQuantity = async (itemId) => {
    try {
      const item = cartItems.find((item) => item.itemId === itemId);

      if (!item) return;

      // If quantity is 1, delete the item
      if (item.quantity === 1) {
        await deleteCart(itemId);
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/cart/sub/${itemId}`,{},{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.itemId === itemId ? response.data : item,
        ),
      );
    } catch (error) {
      console.log("Error decreasing quantity:", error);
    }
  };

  // Delete item
  const deleteCart = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/api/cart/${itemId}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },);

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.itemId !== itemId),
      );
    } catch (error) {
      console.log("Error deleting item:", error);
    }
  };
  
 const addToCart = async (product) => {
      try {
        const response = await axios.post(`${API_URL}/api/cart`, {
          product: {
            id: product.id,
          },
          quantity: 1,
          userId:userId,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          
        });
  
       toast.success("Added to cart");
         setSelectedProduct(null);
         fetchCartItems();
      } catch (error) {
        console.log("Error adding to cart:", error);
        toast.error("Couldnt add to cart")
      }
    };
    
  if (loading) {
    return <div className={style.message}>Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className={style.emptyCart}>
        <h2>Your Cart is empty</h2>
        <p>Add some products to your cart.</p>
      </div>
    );
  }

  return (
    <div className={style.cartContainer}>
      <div className={style.cartHeader}>
        <h1>Shopping Cart</h1>

        <span>
          {cartItems.length} item
          {cartItems.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className={style.cartItems}>
        {cartItems.map((item) => (
          <div className={style.cartItem} key={item.itemId}>
            {/* Checkbox */}
            <input type="checkbox" className={style.checkbox} />

            {/* Product Image */}
            <div className={style.imageContainer}>
              <img src={item.product.imageUrl} alt={item.product.productName} />
            </div>

            {/* Product Details */}
            <div className={style.productDetails}>
              <h2
                className={style.productTitle}
                onClick={() => setSelectedProduct(item.product)}
              >
                {item.product.productName}
              </h2>
              <p className={style.stock}>
                {item.product.available ? "In stock" : "Out of stock"}
              </p>

              <p>
                <strong>Brand:</strong> {item.product.brand}
              </p>

              <p>
                <strong>Category:</strong> {item.product.category}
              </p>

             
              {/* Quantity + Delete */}
              <div className={style.actions}>
                <div className={style.quantityControl}>
                  {item.quantity === 1 ? (
                    <button
                      className={style.quantityButton}
                      onClick={() => deleteCart(item.itemId)}
                      title="Remove item"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ fontSize: "16px" }}
                      />
                    </button>
                  ) : (
                    <button
                      className={style.quantityButton}
                      onClick={() => subQuantity(item.itemId)}
                    >
                      −
                    </button>
                  )}

                  <span className={style.quantity}>{item.quantity}</span>

                  <button
                    className={style.quantityButton}
                    onClick={() => addQuantity(item.itemId)}
                  >
                    +
                  </button>
                </div>

                <span className={style.divider}></span>

                <button
                  className={style.delete}
                  onClick={() => deleteCart(item.itemId)}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className={style.itemTotal}>
              <span>₹{item.product.price}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Product details modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={(product) => {
            setSelectedProduct(null);
            setEditingProduct(product);
          }}
           onAddToCart={addToCart}
    
        />
      )}

      {/* Update product modal */}
      {editingProduct && (
        <UpdateProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdated={(updatedProduct) => {
            setCartItems((prevItems) =>
              prevItems.map((item) =>
                item.product.id === updatedProduct.id
                  ? {
                      ...item,
                      product: updatedProduct,
                    }
                  : item,
              ),
            );

            setSelectedProduct(updatedProduct);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

export default CartItem;

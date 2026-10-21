import style from "../Styles/ProductModal.module.css";

function ProductModal({
  product,
  onClose,
  onAddToCart,
  addingToCart
}) {
  if (!product) return null;
 const role=localStorage.getItem("role");
 //console.log(role);
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


        {/* =========================
            LEFT - IMAGE
           ========================= */}

        <div className={style.imageSection}>
          <img
            src={product.imageUrl}
            alt={product.productName}
          />
        </div>


        {/* =========================
            RIGHT - DETAILS
           ========================= */}

        <div className={style.detailsSection}>

          {/* Category */}
          <span className={style.category}>
            {product.category}
          </span>


          {/* Product Name */}
          <h2>
            {product.productName}
          </h2>


          {/* Description */}
          <p className={style.description}>
            {product.description}
          </p>


          {/* Brand */}
          <p className={style.brand}>
            <strong>Brand:</strong>{" "}
            {product.brand}
          </p>


          {/* Price */}
          <p className={style.price}>
            ₹{product.price}
          </p>


          {/* =========================
              STOCK STATUS
             ========================= */}

          <span
            className={
              !product.available
                ? style.outOfStock
                : product.stock < 10
                ? style.lowStock
                : style.inStock
            }
          >
            {product.available
              ? product.stock < 10
                ? "Low Stock"
                : "In Stock"
              : "Out of Stock"}
          </span>


          {/* =========================
              PRODUCT BENEFITS
             ========================= */}

          <div className={style.benefits}>

            {/* Return */}
            <div className={style.benefit}>

              <div className={style.benefitIcon}>
                <img
                  src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-returns._CB562506492_.png"
                  alt=""
                />
              </div>

              <span>10 days</span>
              <span>Returnable</span>

            </div>


            {/* Delivery */}
            <div className={style.benefit}>

              <div className={style.benefitIcon}>
                <img
                  src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-amazon-delivered._CB562550117_.png"
                  alt=""
                />
              </div>

              <span>Amazon</span>
              <span>Delivered</span>

            </div>


            {/* Free Delivery */}
            <div className={style.benefit}>

              <div className={style.benefitIcon}>
                <img
                  src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/trust_icon_free_shipping_81px._CB562549966_.png"
                  alt=""
                />
              </div>

              <span>Free Delivery</span>

            </div>

          </div>


          {/* =========================
              USER ACTION
             ========================= */}

          <div className={style.actions}>

            {role === "USER" && (
              <button
                className={style.cartButton}
                onClick={() =>
                  onAddToCart(product)
                }
                disabled={addingToCart || !product.available}
              >
                Add to Cart
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductModal;
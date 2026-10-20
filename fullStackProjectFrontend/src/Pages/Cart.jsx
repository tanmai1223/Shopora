import CartItem from "../Components/CartItem";
import Category from "../Components/Category";
import Header from "../Components/Header";
import style from "../Styles/Cart.module.css";

function Cart() {
  return (
    <div className={style.cartPage}>
      <Header />
      <Category />

      <main className={style.cartContent}>
        <CartItem />
      </main>
    </div>
  );
}

export default Cart;
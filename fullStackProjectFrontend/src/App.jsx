import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import AddProduct from "./Pages/AddProduct";
import { Toaster } from "react-hot-toast";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import AdminProfiles from "./Pages/AdminProfiles";

function App() {
  return (
    <div>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
        }}
      />
      <Routes>
        <Route path="/" element={<LoginSignup/>}/>
        <Route path="/home" element={<Home />} />
        <Route path="/category/:category" element={<Home />} />
        <Route path="/product" element={<AddProduct />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/admin/profiles" element={<AdminProfiles />} />
      </Routes>
    </div>
  );
}

export default App;

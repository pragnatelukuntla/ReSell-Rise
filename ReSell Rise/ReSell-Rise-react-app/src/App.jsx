import "./App.css";
import CardAdding from "./CardAddingComponent/CardAdding";
import ProductContent from "./ProductContent/ProductContent";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import Sell from "./Sell/Sell";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./store/FirebaseContext";
import SellerAdding from "./SellerAdding/SellerAdding";
import AuctionInput from "./AuctionInput/AuctionInput";
import VerifyProductsAdding from "./VerifyProductsAdding/VerifyProductsAdding";
function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<CardAdding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/product_details" element={<ProductContent />} />
            <Route path="/display_items" element={<SellerAdding />} />
            <Route path="/auction" element={<AuctionInput  />} />
            <Route path="/verify" element={< VerifyProductsAdding />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;

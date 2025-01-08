import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import Login from "./components/user/Login"
import CreateAccount from "./components//user/CreateAccount"
import UserHome from "./components/user/UserHome"
import PostProduct from "./components/product/PostPoduct"
import ProductList from "./components/product/ProductList"
import ProductDetail from "./components/product/ProductDetail"

export default function Router() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/userhome" element={<UserHome />} />
        <Route path="/board/post" element={<PostProduct />} />
        <Route path="/board/list" element={<ProductList />} />
        <Route path="/board/productdetail/:postnum" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
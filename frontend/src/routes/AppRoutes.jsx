import React from "react";
import {Routes, Route} from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import ProtectedRoute from "./ProtectedRoute";

//  Authentication
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import SellerRegister from "../pages/auth/SellerRegister";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Customer Routes
import Home from "../pages/customer/Home";
import Shop from "../pages/customer/Shop";
import Cart from "../pages/customer/Cart";
import StorePage from "../pages/customer/StorePage";
import Checkout from "../pages/customer/Checkout";
import OrderConfirmation from "../pages/customer/OrderConfirmation";

// Company & Help Pages
import InfoPage from "../pages/info/InfoPage";

// Errors
import NotFound from "../pages/errors/NotFound";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route index element={<Home/>}/>
                <Route path={"shop"} element={<Shop/>}/>
                <Route path={"cart"} element={<Cart/>}/>
                <Route path={"store/:storeId"} element={<StorePage/>}/>
                <Route path={"checkout"} element={<Checkout/>}/>
                <Route path={"order-confirmation/:orderId"} element={<OrderConfirmation/>}/>

                {/* Company & Help Pages */}
                <Route path={"our-story"} element={<InfoPage slug="our-story"/>} />
                <Route path={"careers"} element={<InfoPage slug="careers"/>} />
                <Route path={"press"} element={<InfoPage slug="press"/>} />
                <Route path={"blog"} element={<InfoPage slug="blog"/>} />

                <Route path={"customer-service"} element={<InfoPage slug="customer-service"/>} />
                <Route path={"returns"} element={<InfoPage slug="returns"/>} />
                <Route path={"shipping-info"} element={<InfoPage slug="shipping-info"/>} />
                <Route path={"privacy-policy"} element={<InfoPage slug="privacy-policy"/>} />
            </Route>

            {/* Authentication */}
            <Route path={"login"} element={<Login/>}/>
            <Route path={"register"} element={<Register/>}/>
            <Route path={"become-seller"} element={<SellerRegister/>}/>
            <Route path={"forgot-password"} element={<ForgotPassword/>}/>
            <Route path={"reset-password"} element={<ResetPassword/>}/>

            Customer Account Routes
            <Route path={"/account"} element={<ProtectedRoute roles={["Customer"]}/>}>
                <Route element={<CustomerLayout/>}>
                    <Route index element={<Home/>}/>
                </Route>
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound/>} />
        </Routes>
    )
}
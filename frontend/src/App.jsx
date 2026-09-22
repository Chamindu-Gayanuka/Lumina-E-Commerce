import React from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import {ToastProvider} from "./context/ToastContext";
import {AuthProvider} from "./context/AuthContext";
import {CartProvider} from "./context/CartContext";

export default function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <ToastProvider>
                    <Navbar/>

                    {/* Page content */}

                    <Footer/>
                </ToastProvider>
            </CartProvider>
        </AuthProvider>
    );
}
import React from "react";

import {ToastProvider} from "./context/ToastContext";
import {AuthProvider} from "./context/AuthContext";
import {CartProvider} from "./context/CartContext";

import AppRoutes from "./routes/AppRoutes";

export default function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <CartProvider>
                        <AppRoutes/>
                </CartProvider>
            </AuthProvider>
        </ToastProvider>
    );
}
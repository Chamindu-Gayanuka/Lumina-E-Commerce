import React from 'react';
import Footer from './components/layout/Footer';
import {ToastProvider} from "./context/ToastContext";

export default function App() {
    return (
        <ToastProvider>
            <div>
                <Footer />
            </div>
        </ToastProvider>
    );
}
import React from "react";
import NotFound from "../pages/errors/NotFound";
import Footer from "../components/layout/Footer";

export default function NotFoundLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <NotFound/>
            </main>
            <Footer/>
        </div>
    );
}
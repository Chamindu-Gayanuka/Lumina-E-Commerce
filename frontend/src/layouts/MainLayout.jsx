import React, {useEffect} from "react";
import {Outlet, useLocation} from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const AUTH_PAGES = /^\/(login|register|forgot-password|reset-password|become-seller)(\?|$)/;

function ScrollToTop() {
    const {pathname, search} = useLocation();
    useEffect(() => {
        window.scrollTo({top: 0, behavior: "instant" in window ? "instant" : "auto"});
        // Remember where the shopper was so /login can bring them back after signing in.
        if (!AUTH_PAGES.test(pathname)) {
            try {
                sessionStorage.setItem("lumina.lastPath", pathname + search);
            } catch {
                /* storage disabled - flow still works without the memory */
            }
        }
    }, [pathname, search]);
    return null;
}

/** Storefront shell: sticky navbar + footer for all public shopping pages. */
export default function MainLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <ScrollToTop/>
            <Navbar/>
            <main className="flex-1">
                <Outlet/>
            </main>
            <Footer/>
        </div>
    );
}
import React, {useEffect} from "react";
import {Outlet, useLocation} from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function ScrollToTop() {
    const {pathname} = useLocation();
    useEffect(() => {
        window.scrollTo({top: 0, behavior: "instant" in window ? "instant" : "auto"});
    }, [pathname]);
    return null;
}

/** sticky navbar + footer for all public shopping pages. */
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
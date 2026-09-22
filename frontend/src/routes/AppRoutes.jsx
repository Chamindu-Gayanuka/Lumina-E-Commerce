import React from "react";
import {Routes, Route} from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Customer Public Routes
import Home from "../pages/customer/Home";

// Company & Help Pages
import InfoPage from "../pages/info/InfoPage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route index element={<Home/>}/>

                {/* Company & Help Pages */}
                <Route path={"our-story"} element={<InfoPage page="our-story"/>} />
                <Route path={"careers"} element={<InfoPage page="careers"/>} />
                <Route path={"press"} element={<InfoPage page="press"/>} />
                <Route path={"blog"} element={<InfoPage page="blog"/>} />

                <Route path={"customer-service"} element={<InfoPage page="customer-service"/>} />
                <Route path={"returns"} element={<InfoPage page="returns"/>} />
                <Route path={"shipping-info"} element={<InfoPage page="shipping-info"/>} />
                <Route path={"privacy-policy"} element={<InfoPage page="privacy-policy"/>} />
            </Route>
        </Routes>
    )
}
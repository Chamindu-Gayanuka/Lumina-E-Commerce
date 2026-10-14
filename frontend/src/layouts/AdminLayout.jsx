import React from "react";
import {
    FaBan,
    FaBoxesStacked,
    FaBoxOpen,
    FaChartLine,
    FaGaugeHigh,
    FaGear,
    FaStore,
    FaTags,
    FaTriangleExclamation,
    FaTruckFast,
    FaUsers,
} from "react-icons/fa6";
import DashboardShell from "./DashboardShell";
import Footer from "../components/layout/Footer";

export function buildAdminNav() {
    const pending = 0;
    return [
        {section: "Overview"},
        {to: "/admin", end: true, label: "Dashboard", icon: <FaGaugeHigh size={14}/>},
        {section: "Users"},
        {to: "/admin/users", label: "User Management", icon: <FaUsers size={14}/>},
        {
            to: "/admin/sellers",
            label: "Seller Management",
            icon: <FaStore size={14}/>,
            count: pending,
            countTone: "amber",
        },
        {section: "Catalog"},
        {to: "/admin/products", label: "Products", icon: <FaBoxOpen size={14}/>},
        {to: "/admin/categories", label: "Categories", icon: <FaTags size={14}/>},
        {section: "Sales"},
        {to: "/admin/orders", label: "Orders", icon: <FaTruckFast size={14}/>},
        {section: "Inventory"},
        {to: "/admin/inventory", label: "Overall Inventory", icon: <FaBoxesStacked size={14}/>},
        {to: "/admin/inventory/low", label: "Low Stock", icon: <FaTriangleExclamation size={14}/>},
        {to: "/admin/inventory/out", label: "Out of Stock", icon: <FaBan size={14}/>},
        {section: "Reports"},
        {to: "/admin/reports/sales", label: "Sales Report", icon: <FaChartLine size={14}/>},
        {to: "/admin/settings", label: "Settings", icon: <FaGear size={14}/>},
    ];
}

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1">
                <DashboardShell
                    role="admin"
                    navItems={buildAdminNav()}
                    globalSearch
                />
            </div>
            <Footer/>
        </div>
    );
}
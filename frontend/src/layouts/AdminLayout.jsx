import React from "react";
import {
    FaGaugeHigh,
    FaUsers,
    FaStore,
    FaBoxOpen,
    FaTags,
    FaTruckFast,
    FaBoxesStacked,
    FaServer,
    FaGear,
    FaUser,
} from "react-icons/fa6";
import DashboardShell from "./DashboardShell";

export const adminNav = [
    {to: "/admin", end: true, label: "System Dashboard", icon: <FaGaugeHigh size={14}/>},
    {to: "/admin/users", label: "User Management", icon: <FaUsers size={14}/>},
    {to: "/admin/sellers", label: "Seller Management", icon: <FaStore size={14}/>},
    {to: "/admin/products", label: "Product Management", icon: <FaBoxOpen size={14}/>},
    {to: "/admin/categories", label: "Categories", icon: <FaTags size={14}/>},
    {to: "/admin/orders", label: "Order Management", icon: <FaTruckFast size={14}/>},
    {to: "/admin/inventory", label: "Inventory Monitor", icon: <FaBoxesStacked size={14}/>},
    {to: "/admin/system", label: "System Overview", icon: <FaServer size={14}/>},
    {to: "/admin/settings", label: "Settings", icon: <FaGear size={14}/>},
    {to: "/admin/profile", label: "My Profile", icon: <FaUser size={14}/>},
];

export default function AdminLayout() {
    return <DashboardShell role="admin" navItems={adminNav}/>;
}
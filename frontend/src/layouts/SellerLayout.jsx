import React from "react";
import {FaChartLine, FaGear, FaGaugeHigh, FaBoxOpen, FaBoxesStacked, FaStore, FaTruckFast} from "react-icons/fa6";
import DashboardShell from "./DashboardShell";

export const sellerNav = [
    {to: "/seller", end: true, label: "Dashboard", icon: <FaGaugeHigh size={14}/>},
    {to: "/seller/products", label: "My Products", icon: <FaBoxOpen size={14}/>},
    {to: "/seller/inventory", label: "Inventory", icon: <FaBoxesStacked size={14}/>},
    {to: "/seller/orders", label: "Orders", icon: <FaTruckFast size={14}/>},
    {to: "/seller/sales", label: "Sales Overview", icon: <FaChartLine size={14}/>},
    {to: "/seller/profile", label: "Store Profile", icon: <FaStore size={14}/>},
    {to: "/seller/settings", label: "Settings", icon: <FaGear size={14}/>},
];

export default function SellerLayout() {
    return <DashboardShell role="seller" navItems={sellerNav}/>;
}
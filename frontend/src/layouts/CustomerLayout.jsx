import React from "react";
import {FaLocationDot, FaLock, FaReceipt, FaUser, FaCartShopping} from "react-icons/fa6";
import DashboardShell from "./DashboardShell";

const nav = [
    {to: "/account", end: true, label: "My Profile", icon: <FaUser size={14}/>},
    {to: "/account/orders", label: "My Orders", icon: <FaReceipt size={14}/>},
    {to: "/cart", label: "Shopping Cart", icon: <FaCartShopping size={14}/>},
    {to: "/account/addresses", label: "Addresses", icon: <FaLocationDot size={14}/>},
    {to: "/account/change-password", label: "Change Password", icon: <FaLock size={14}/>},
];

export default function CustomerLayout() {
    return <DashboardShell role="customer" navItems={nav}/>;
}
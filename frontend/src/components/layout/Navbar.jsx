import React from 'react'
import { useEffect, useState } from "react";
import { Link, useNavigation } from "react-router-dom";
import { FaBars, FaCartShopping, FaChevronDown, FaGripLines, FaHeart, FaStore, FaUser, FaUserShield, FaXmark } from "react-icons/fa6";

const NAV_CATEGORIES = [
    { name: "Electronics", iconKey: "laptop" },
    { name: "Fashion", iconKey: "shirt" },
    { name: "Home", iconKey: "couch" },
    { name: "Beauty", iconKey: "beauty" },
    { name: "Toys", iconKey: "toys" },
    { name: "Groceries", iconKey: "grocery" },
];

export default function Navbar() {
    return (
        <div>Navbar</div>
    )
}
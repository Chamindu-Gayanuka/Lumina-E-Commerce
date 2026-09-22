import React from "react";
import {
    FaBatteryHalf,
    FaBluetoothB,
    FaBolt,
    FaCouch,
    FaGem,
    FaGift,
    FaHeart,
    FaLaptop,
    FaLeaf,
    FaPuzzlePiece,
    FaShieldAlt,
    FaShoppingBasket,
    FaSprayCan,
    FaTshirt,
} from "react-icons/fa";

const CATEGORY_ICONS = {
    laptop: FaLaptop,
    shirt: FaTshirt,
    couch: FaCouch,
    beauty: FaSprayCan,
    toys: FaPuzzlePiece,
    grocery: FaShoppingBasket,
};

const HIGHLIGHT_ICONS = {
    battery: FaBatteryHalf,
    bluetooth: FaBluetoothB,
    heart: FaHeart,
    bolt: FaBolt,
    gift: FaGift,
    gem: FaGem,
    shield: FaShieldAlt,
    leaf: FaLeaf,
};

export default function CategoryIcon({iconKey, kind = "category", ...rest}) {
    const Map = kind === "highlight" ? HIGHLIGHT_ICONS : CATEGORY_ICONS;
    const Icon = Map[iconKey] || Map.laptop || FaLaptop;
    return <Icon {...rest} />;
}
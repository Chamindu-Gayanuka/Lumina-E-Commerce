import React, {useState} from "react";
import CategoryIcon from "../ui/CategoryIcon";

const GRADIENTS = {
    Electronics: "from-teal-50 via-slate-100 to-cyan-100",
    Fashion: "from-amber-50 via-orange-50 to-rose-100",
    Home: "from-stone-100 via-amber-50 to-yellow-50",
    Beauty: "from-pink-50 via-rose-50 to-fuchsia-100",
    Toys: "from-indigo-50 via-sky-50 to-cyan-50",
    Groceries: "from-lime-50 via-emerald-50 to-teal-50",
};

const ICON_KEYS = {
    Electronics: "laptop",
    Fashion: "shirt",
    Home: "couch",
    Beauty: "beauty",
    Toys: "toys",
    Groceries: "grocery",
};

export default function ProductImage({product, className = "", imgClassName = "", iconSize = 44}) {
    const [failed, setFailed] = useState(false);
    const gradient = GRADIENTS[product?.category] || "from-slate-100 to-slate-200";
    return (
        <div
            className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
            {product?.image && !failed ? (
                <img
                    src={product.image}
                    alt={product?.name || "Product"}
                    loading="lazy"
                    onError={() => setFailed(true)}
                    className={`h-full w-full object-cover ${imgClassName}`}
                />
            ) : (
                <span className="text-ink-900/25">
          <CategoryIcon iconKey={ICON_KEYS[product?.category] || "laptop"} size={iconSize}/>
        </span>
            )}
        </div>
    );
}

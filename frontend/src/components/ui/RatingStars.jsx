import React from "react";
import {FaRegStar, FaStar, FaStarHalfAlt} from "react-icons/fa";

export default function RatingStars({rating = 0, size = 13, count, className = "", showValue = false}) {
    const stars = [1, 2, 3, 4, 5].map((i) => {
        if (rating >= i - 0.25) return <FaStar key={i} size={size} className="text-amber-400"/>;
        if (rating >= i - 0.75) return <FaStarHalfAlt key={i} size={size} className="text-amber-400"/>;
        return <FaRegStar key={i} size={size} className="text-amber-400/60"/>;
    });
    return (
        <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="flex items-center gap-0.5">{stars}</span>
            {showValue && <span className="text-xs font-semibold text-ink-800">{Number(rating).toFixed(1)}</span>}
            {count !== undefined && <span className="text-xs text-slate-400">({count})</span>}
    </span>
    );
}

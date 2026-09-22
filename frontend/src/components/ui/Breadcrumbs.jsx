import React from "react";
import {Link} from "react-router-dom";
import {FaChevronRight} from "react-icons/fa";

export default function Breadcrumbs({items = [], className = ""}) {
    return (
        <nav aria-label="Breadcrumb"
             className={`flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500 ${className}`}>
            {items.map((item, idx) => {
                const isLast = idx === items.length - 1;
                return (
                    <React.Fragment key={`${item.label}-${idx}`}>
                        {item.to && !isLast ? (
                            <Link to={item.to} className="hover:text-primary-700">
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? "font-semibold text-ink-800" : ""}>{item.label}</span>
                        )}
                        {!isLast && <FaChevronRight size={8} className="text-slate-300"/>}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}

import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {FaHouse, FaMagnifyingGlass} from "react-icons/fa6";
import "./NotFound.css";

export default function Page404() {
    const navigate = useNavigate();

    return (
        <section className="page_404">
            <div className="page_404_container">
                <div className="four_zero_four_bg">
                    <h1>404</h1>
                </div>

                <div className="contant_box_404">
                    <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                        This page wandered off the map
                    </h1>

                    <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
                        The link may be broken or the page moved. Let's get you
                        back to something shoppable.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-700"
                        >
                            <FaHouse size={13}/>
                            Back home
                        </Link>

                        <button
                            type="button"
                            onClick={() => navigate("/shop")}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-ink-800 transition-colors hover:bg-slate-50"
                        >
                            <FaMagnifyingGlass size={13}/>
                            Browse products
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
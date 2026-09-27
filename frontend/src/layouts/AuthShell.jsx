import React from "react";
import {Link} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa";

export function AuthShell({children, wide = false}) {
    return (
        <div className="min-h-screen]">
            <div className="lum-container flex flex-col items-center px-4 py-8">
                <Link to="/" className="text-3xl font-extrabold tracking-tight text-primary-700 sm:text-4xl">
                    Lumina
                </Link>
                <div className={`w-full ${wide ? "max-w-4xl" : "max-w-xl"} py-8 sm:py-12`}>{children}</div>
            </div>
        </div>
    );
}

export function AuthSplit({image, badge = "shop", title, subtitle, children}) {
    return (
        <div className="flex min-h-screen items-stretch] lg:py-10">
            <div
                className="relative hidden w-[46%] flex-col items-center justify-center overflow-hidden bg-primary-700 px-10 py-16 text-center text-white ml-5 lg:flex">
                <div className="relative w-full max-w-md">
                    <div className="overflow-hidden rounded-2xl bg-white/10 shadow-2xl">
                        <img src={image} alt="" className="h-72 w-full object-cover"/>
                    </div>
                    <h2 className="mt-10 text-4xl font-extrabold tracking-tight">{title}</h2>
                    <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-primary-100/90">{subtitle}</p>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
                <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-card sm:p-10">
                    <Link to="/"
                          className="mb-6 block text-center text-3xl font-extrabold tracking-tight text-primary-700 lg:hidden">
                        Lumina
                    </Link>
                    {children}
                </div>
            </div>
        </div>
    );
}

export function BackToLogin({to = "/login", label = "Back to Login"}) {
    return (
        <Link to={to}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800">
            <FaArrowLeft size={12}/> {label}
        </Link>
    );
}
import React, {useState} from "react";
import {Link, NavLink, Outlet, useLocation} from "react-router-dom";
import {FaBell, FaBars, FaStore, FaXmark} from "react-icons/fa6";
import {useAuth} from "../context/AuthContext";
import {useToast} from "../context/ToastContext";

const TITLES = {
    admin: {label: "Admin Console", tint: "bg-ink-900 text-white"},
    seller: {label: "Seller Hub", tint: "bg-primary-600 text-white"},
    customer: {label: "My Account", tint: "bg-primary-100 text-primary-800"},
};

export default function DashboardShell({role, navItems, footerExtra, children}) {
    const {user, logout} = useAuth();
    const {notify} = useToast();
    const location = useLocation();
    const [drawer, setDrawer] = useState(false);
    const meta = TITLES[role];

    const SidebarBody = (
        <>
            <div className="flex items-center justify-between px-5 pb-5 pt-6">
                <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary-700">
                    Lumina
                </Link>
                <button
                    type="button"
                    onClick={() => setDrawer(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
                    aria-label="Close sidebar"
                >
                    <FaXmark size={16}/>
                </button>
            </div>
            <span
                className={`mx-5 mb-5 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${meta.tint}`}>
        {meta.label}
      </span>

            {role === "customer" && user && (
                <div className="mx-3 mb-5 rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-card">
                    <div
                        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-extrabold text-primary-700 ring-4 ring-primary-50">
                        {user.avatarLetter || user.name?.charAt(0)}
                    </div>
                    <p className="mt-3 truncate text-sm font-bold text-ink-900">{user.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{user.memberTier || "Member"}</p>
                </div>
            )}

            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setDrawer(false)}
                        className={({isActive}) =>
                            `relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                                isActive
                                    ? "bg-primary-50 text-primary-700"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-ink-800"
                            }`
                        }
                    >
                        {({isActive}) => (
                            <>
                                {isActive && <span className="absolute inset-y-2 left-0 w-1 rounded-r bg-primary-600"
                                                   aria-hidden="true"/>}
                                <span className={isActive ? "text-primary-600" : "text-slate-400"}>{item.icon}</span>
                                {item.label}
                                {item.count !== undefined && item.count > 0 && (
                                    <span
                                        className="ml-auto rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                    {item.count}
                  </span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-slate-100 px-5 py-4">
                {user?.role !== "Customer" ? (
                    <Link to="/"
                          className="mb-3 flex items-center gap-2.5 text-sm font-semibold text-slate-500 hover:text-primary-700"
                          onClick={() => setDrawer(false)}>
                        <FaStore size={13}/> View storefront
                    </Link>
                ) : null}
                <button
                    type="button"
                    onClick={() => {
                        logout();
                        notify("Signed out.", "info");
                        window.location.href = "/";
                    }}
                    className="flex items-center gap-2.5 text-sm font-semibold text-red-500 hover:text-red-600"
                >
                    <FaXmark size={13}/> Log out
                </button>
                {footerExtra}
            </div>
        </>
    );

    return (
        <div className="min-h-screen lg:flex">
            {/* Desktop sidebar */}
            <aside
                className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
                {SidebarBody}
            </aside>

            {/* Mobile drawer */}
            {drawer && (
                <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-ink-900/50" onClick={() => setDrawer(false)}
                         aria-hidden="true"/>
                    <aside
                        className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-2xl">{SidebarBody}</aside>
                </div>
            )}

            <div className="min-w-0 flex-1">
                <header
                    className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
                    <button type="button" className="rounded-lg p-2 text-ink-800 hover:bg-slate-100 lg:hidden"
                            onClick={() => setDrawer(true)} aria-label="Open sidebar">
                        <FaBars size={16}/>
                    </button>
                    <Link to="/" className="text-lg font-extrabold tracking-tight text-primary-700 lg:hidden">
                        Lumina
                    </Link>
                    <div className="ml-auto flex items-center gap-2">
                        <button type="button" className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                aria-label="Notifications">
                            <FaBell size={15}/>
                            <span
                                className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white"/>
                        </button>
                        {user && (
                            <div
                                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-3.5">
                <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-xs font-bold text-primary-700">
                  {user.avatarLetter || user.name?.charAt(0)}
                </span>
                                <span className="hidden text-sm font-semibold text-ink-900 sm:block">{user.name}</span>
                            </div>
                        )}
                    </div>
                </header>

                <main className="mx-auto w-full max-w-[1400px] px-4 py-7 sm:px-6 lg:px-8" key={location.pathname}>
                    {children !== undefined ? children : <Outlet/>}
                </main>
            </div>
        </div>
    );
}
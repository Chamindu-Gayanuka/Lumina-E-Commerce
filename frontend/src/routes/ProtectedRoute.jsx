import React from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {PageSpinner} from "../components/ui/Spinner";

export default function ProtectedRoute({roles = [], children}) {
    const {isAuthenticated, ready, user} = useAuth();
    const location = useLocation();

    if (!ready) return <PageSpinner label="Checking session…"/>;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{from: location.pathname + location.search}}/>;
    }
    if (roles.length && !roles.includes(user?.role)) {
        const fallback =
            user?.role === "Seller" ? "/seller" : user?.role === "Administrator" ? "/admin" : "/account";
        return <Navigate to={fallback} replace/>;
    }
    return children ? <>{children}</> : <Outlet/>;
}
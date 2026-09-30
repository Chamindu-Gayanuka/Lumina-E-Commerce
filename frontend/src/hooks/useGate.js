import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function useGate() {
    const { isAuthenticated, ready } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { notify } = useToast();

    return (then, message) => {
        if (isAuthenticated || !ready) {
            if (then) then();
            return true;
        }
        notify(message || "Please sign in to continue - we'll bring you right back.", "info");
        navigate("/login", { state: { from: location.pathname + location.search } });
        return false;
    };
}

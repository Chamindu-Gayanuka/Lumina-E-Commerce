import {useSearchParams} from "react-router-dom";

export default function useUrlPage(param = "page") {
    const [params, setParams] = useSearchParams();
    const raw = Number.parseInt(params.get(param) || "1", 10);
    const page = Number.isFinite(raw) && raw > 0 ? raw : 1;

    const setPage = (n) => {
        if (!Number.isFinite(n) || n < 1) return;
        if (n === page) return;
        const next = new URLSearchParams(params);
        if (n === 1) next.delete(param);
        else next.set(param, String(n));
        setParams(next, {preventScroll: true});
    };

    return [page, setPage];
}
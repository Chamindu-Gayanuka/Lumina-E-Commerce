import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {useAuth} from './AuthContext';

const KEY = 'lumina.cart.v6', DATA = 'lumina.cart.products.v6', CartContext = createContext(null);

function read(k, f) {
    try {
        return JSON.parse(localStorage.getItem(k)) ?? f
    } catch {
        return f
    }
}

export function CartProvider({children}) {
    const {isAuthenticated, user} = useAuth();
    const cartKey = `${KEY}.${user?._id || user?.id || 'guest'}`;
    const [items, setItems] = useState(() => isAuthenticated ? read(cartKey, []) : []);
    const [products, setProducts] = useState(() => isAuthenticated ? read(`${DATA}.${user?._id || user?.id || 'guest'}`, {}) : {});
    useEffect(() => {
        if (!isAuthenticated) {
            setItems([]);
            setProducts({});
            localStorage.removeItem(KEY);
            localStorage.removeItem(DATA);
            return
        }
        setItems(read(cartKey, []));
        setProducts(read(`${DATA}.${user?._id || user?.id || 'guest'}`, {}))
    }, [isAuthenticated, user?._id, user?.id]);
    useEffect(() => {
        if (isAuthenticated) {
            localStorage.setItem(cartKey, JSON.stringify(items));
            localStorage.setItem(`${DATA}.${user?._id || user?.id || 'guest'}`, JSON.stringify(products))
        }
    }, [items, products, isAuthenticated, cartKey, user]);
    const add = useCallback((id, qty = 1, p) => {
        if (!isAuthenticated) return {added: 0, requiresLogin: true};
        if (p) setProducts(x => ({...x, [id]: p}));
        const stock = Number(p?.stock ?? 0);
        const previous = items.find(x => x.productId === id)?.qty || 0;
        const applied = Math.max(0, Math.min(qty, stock - previous));
        if (applied > 0) {
            setItems(prev => {
                const found = prev.some(x => x.productId === id);
                return found ? prev.map(x => x.productId === id ? {
                    ...x,
                    qty: x.qty + applied
                } : x) : [...prev, {productId: id, qty: applied}]
            })
        }
        return {
            added: applied,
            requested: qty,
            inCart: previous + applied,
            stock,
            soldOut: stock === 0,
            capped: applied < qty,
            atLimit: applied === 0
        }
    }, [isAuthenticated, items]);
    const stockInfo = useCallback(id => {
        const p = products[id], inCart = items.find(x => x.productId === id)?.qty || 0, stock = Number(p?.stock ?? 0);
        return {stock, inCart, remaining: Math.max(0, stock - inCart), available: !!p && p.status === 'Active'}
    }, [products, items]);
    const setQty = useCallback((id, q) => setItems(a => a.map(x => x.productId === id ? {
        ...x,
        qty: Math.max(1, Number(q) || 1)
    } : x)), []);
    const remove = useCallback(id => setItems(a => a.filter(x => x.productId !== id)), []);
    const clear = useCallback(() => setItems([]), []);
    const lines = useMemo(() => items.map(x => {
        const p = products[x.productId];
        return p ? {
            product: p,
            qty: x.qty,
            lineTotal: p.price * x.qty,
            stock: p.stock,
            exceedsStock: x.qty > p.stock
        } : null
    }).filter(Boolean), [items, products]);
    const subtotal = lines.reduce((s, x) => s + x.lineTotal, 0),
        deliveryFee = subtotal === 0 || subtotal >= 5000 ? 0 : 450;
    return <CartContext.Provider value={{
        items: lines,
        count: lines.reduce((s, x) => s + x.qty, 0),
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        add,
        remove,
        setQty,
        clear,
        stockInfo,
        requiresLogin: !isAuthenticated
    }}>{children}</CartContext.Provider>
}

export function useCart() {
    const x = useContext(CartContext);
    if (!x) throw new Error('useCart must be used within CartProvider');
    return x
}
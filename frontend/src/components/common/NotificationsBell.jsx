import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaBell} from 'react-icons/fa6';
import api from '../../services/api';
import {useAuth} from '../../context/AuthContext';

export default function NotificationsBell() {
    const {user} = useAuth();
    const nav = useNavigate();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [read, setRead] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('lumina.readNotifications') || '[]')
        } catch {
            return []
        }
    });
    useEffect(() => {
        let live = true;

        async function load() {
            try {
                let data = [];
                if (user?.role === 'Customer') data = await api.get('/orders/mine').then(r => r.data); else if (user?.role === 'Seller') data = await api.get('/seller/orders').then(r => r.data); else if (user?.role === 'Administrator') data = await api.get('/admin/orders').then(r => r.data);
                if (live) setItems(data.slice(0, 10).map(o => ({
                    id: `${String(o._id)}-${o.status}`,
                    title: `Order ${o.status}`,
                    body: `Order ${String(o._id).slice(-6)} · Rs ${o.totalAmount}`,
                    to: user.role === 'Customer' ? `/account/orders/${o._id}` : user.role === 'Seller' ? `/seller/orders/${o._id}` : '/admin/orders'
                })))
            } catch {
            }
        }

        if (user) load();
        return () => {
            live = false
        }
    }, [user]);
    const unread = items.filter(x => !read.includes(x.id));
    const visit = i => {
        const next = [...new Set([...read, i.id])];
        setRead(next);
        localStorage.setItem('lumina.readNotifications', JSON.stringify(next));
        setItems(x => x.filter(n => n.id !== i.id));
        setOpen(false);
        nav(i.to)
    };
    return <div className="relative">
        <button type="button" onClick={() => setOpen(x => !x)}
                className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"><FaBell
            size={15}/>{unread.length > 0 && <span
            className="absolute -right-0.5 -top-0.5 rounded-full bg-amber-500 px-1 text-[9px] text-white">{unread.length}</span>}
        </button>
        {open &&
            <div className="absolute right-0 top-10 z-50 w-80 overflow-hidden rounded-2xl border bg-white shadow-lg">
                <div className="flex justify-between border-b p-4 font-bold">Notifications{unread.length > 0 &&
                    <button className="text-xs text-primary-600" onClick={() => {
                        const next = [...new Set([...read, ...items.map(x => x.id)])];
                        setRead(next);
                        localStorage.setItem('lumina.readNotifications', JSON.stringify(next));
                        setItems([])
                    }}>Clear all</button>}</div>
                {unread.length ? unread.map(i => <button key={i.id} onClick={() => visit(i)}
                                                         className="block w-full border-b p-4 text-left hover:bg-slate-50">
                    <b className="block text-sm">{i.title}</b><span className="text-xs text-slate-500">{i.body}</span>
                </button>) : <p className="p-5 text-sm text-slate-500">No new notifications</p>}</div>}</div>
}
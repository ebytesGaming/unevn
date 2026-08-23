"use client";

import { useState } from "react";
import { AuthUI } from "@/components/ui/auth-ui";
import { Button } from "@/components/ui/button";

type Order = { _id: string; name: string; email: string; plan?: string; consultationDate?: string; status: string; createdAt: string; budget?: string; timeline?: string };
type User = { _id: string; name: string; email: string; createdAt: string };
const statuses = ["processed", "started", "finalized", "canceled"];

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [view, setView] = useState<"orders" | "users">("orders");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [showAccounts, setShowAccounts] = useState(false);
  const load = async (nextPassword = password) => {
    const result = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: nextPassword, action: "list" }) });
    const data = await result.json();
    if (!result.ok) return setError(data.error || "Access denied");
    setOrders(data.orders || []); setUsers(data.users || []); setAuthenticated(true); setError("");
  };
  const updateStatus = async (orderId: string, status: string) => {
    const result = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, action: "update", orderId, status }) });
    if (!result.ok) { const data = await result.json(); setError(data.error || "Could not update order."); return; }
    load();
  };
  const deleteUser = async (accountId: string) => {
    if (!window.confirm("Delete this client account?")) return;
    await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, action: "delete-account", accountId }) });
    load();
  };
  if (!authenticated) return <main className="min-h-screen bg-background px-6 py-24 text-foreground"><div className="mx-auto max-w-sm rounded-2xl border border-border bg-surface p-8"><h1 className="font-[var(--font-display)] text-3xl font-semibold">Unevn admin</h1><p className="mt-2 text-sm text-muted-foreground">Private studio dashboard.</p><form onSubmit={(event) => { event.preventDefault(); load(); }} className="mt-8 space-y-4"><input autoFocus required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none" /><Button type="submit" className="w-full">Unlock dashboard</Button>{error && <p className="text-sm text-red-400">{error}</p>}</form></div></main>;
  const visibleOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter);
  return <main className="min-h-screen bg-background px-6 py-20 text-foreground"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Unevn Studios / private</p><h1 className="mt-3 font-[var(--font-display)] text-4xl font-semibold">Studio dashboard</h1></div><Button variant="outline" onClick={() => setShowAccounts(!showAccounts)}>{showAccounts ? "Hide account creator" : "Create client account"}</Button></div><div className="mt-10 grid gap-3 sm:grid-cols-4">{[["Total orders", orders.length], ["Processed", orders.filter((order) => order.status === "processed").length], ["In progress", orders.filter((order) => order.status === "started").length], ["Registered users", users.length]].map(([label, value]) => <div key={label} className="rounded-2xl border border-border bg-surface/60 p-5"><p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-3 font-[var(--font-display)] text-3xl font-semibold">{value}</p></div>)}</div>{showAccounts && <div className="mt-8 max-w-md rounded-2xl border border-border bg-surface p-6"><AuthUI adminPassword={password} onCreated={() => setShowAccounts(false)} /></div>}<div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4"><div className="flex gap-2"><button className={`rounded-full px-4 py-2 text-sm ${view === "orders" ? "bg-foreground text-background" : "text-muted-foreground"}`} onClick={() => setView("orders")}>Orders</button><button className={`rounded-full px-4 py-2 text-sm ${view === "users" ? "bg-foreground text-background" : "text-muted-foreground"}`} onClick={() => setView("users")}>Users</button></div>{view === "orders" && <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-full border border-border bg-surface px-4 py-2 text-sm capitalize outline-none"><option value="all">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>}</div>{view === "orders" ? <div className="mt-6 grid gap-4">{visibleOrders.length === 0 ? <p className="text-muted-foreground">No matching orders.</p> : visibleOrders.map((order) => <article key={order._id} className="rounded-2xl border border-border bg-surface/70 p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-[var(--font-display)] text-xl font-semibold">{order.name}</h2><p className="mt-1 text-sm text-muted-foreground">{order.email} · {order.plan || "Plan not selected"}</p><p className="mt-2 text-sm text-muted-foreground">Consultation: {order.consultationDate || "Not provided"} · Budget: {order.budget || "Not provided"}</p></div><select disabled={order.status === "canceled"} value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)} className="rounded-full border border-border bg-background px-4 py-2 text-sm capitalize outline-none disabled:cursor-not-allowed disabled:opacity-50">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></div></article>)}</div> : <div className="mt-6 grid gap-3">{users.length === 0 ? <p className="text-muted-foreground">No registered users.</p> : users.map((user) => <article key={user._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface/70 p-5"><div><h2 className="font-[var(--font-display)] text-lg font-semibold">{user.name}</h2><p className="text-sm text-muted-foreground">{user.email}</p></div><Button variant="outline" onClick={() => deleteUser(user._id)}>Delete account</Button></article>)}</div>}{error && <p role="alert" className="mt-5 text-sm text-red-400">{error}</p>}</div></main>;
}

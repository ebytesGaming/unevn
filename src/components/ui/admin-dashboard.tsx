"use client";

import { useState } from "react";
import { AuthUI } from "@/components/ui/auth-ui";
import { Button } from "@/components/ui/button";

type Order = { _id: string; name: string; email: string; plan?: string; consultationDate?: string; status: string; createdAt: string };
const statuses = ["processed", "started", "finalized", "canceled"];

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [showAccounts, setShowAccounts] = useState(false);
  const load = async (nextPassword = password) => {
    const result = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: nextPassword, action: "list" }) });
    const data = await result.json();
    if (!result.ok) return setError(data.error || "Access denied");
    setOrders(data); setAuthenticated(true); setError("");
  };
  const updateStatus = async (orderId: string, status: string) => {
    await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, action: "update", orderId, status }) });
    load();
  };
  if (!authenticated) return <main className="min-h-screen bg-background px-6 py-24 text-foreground"><div className="mx-auto max-w-sm rounded-2xl border border-border bg-surface p-8"><h1 className="font-[var(--font-display)] text-3xl font-semibold">Unevn admin</h1><p className="mt-2 text-sm text-muted-foreground">Private studio dashboard.</p><form onSubmit={(event) => { event.preventDefault(); load(); }} className="mt-8 space-y-4"><input autoFocus required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none" /><Button type="submit" className="w-full">Unlock dashboard</Button>{error && <p className="text-sm text-red-400">{error}</p>}</form></div></main>;
  return <main className="min-h-screen bg-background px-6 py-20 text-foreground"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Unevn Studios</p><h1 className="mt-3 font-[var(--font-display)] text-4xl font-semibold">Orders</h1></div><Button variant="outline" onClick={() => setShowAccounts(!showAccounts)}>{showAccounts ? "Hide account creator" : "Create client account"}</Button></div>{showAccounts && <div className="mt-8 max-w-md rounded-2xl border border-border bg-surface p-6"><AuthUI onCreated={() => setShowAccounts(false)} /></div>}<div className="mt-10 grid gap-4">{orders.length === 0 ? <p className="text-muted-foreground">No orders yet.</p> : orders.map((order) => <article key={order._id} className="rounded-2xl border border-border bg-surface/70 p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-[var(--font-display)] text-xl font-semibold">{order.name}</h2><p className="mt-1 text-sm text-muted-foreground">{order.email} · {order.plan || "Plan not selected"}</p><p className="mt-2 text-sm text-muted-foreground">Consultation: {order.consultationDate || "Skipped"}</p></div><select value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)} className="rounded-full border border-border bg-background px-4 py-2 text-sm capitalize outline-none">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></div></article>)}</div></div></main>;
}

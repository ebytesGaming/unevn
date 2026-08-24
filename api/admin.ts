/// <reference types="node" />
import crypto from "node:crypto";
import { ObjectId } from "mongodb";
import { accountsCollection, ordersCollection } from "./_db.js";
import { Resend } from "resend";

type Response = { status: (code: number) => Response; json: (body: unknown) => void; setHeader: (name: string, value: string) => void };
type Request = { method?: string; body?: { password?: string; action?: string; orderId?: string; accountId?: string; status?: string } };

function token() {
  return crypto.createHmac("sha256", process.env.ADMIN_PASSWORD || "").update("unevn-admin").digest("hex");
}
function authorized(request: Request) {
  return request.body?.password === process.env.ADMIN_PASSWORD || request.body?.password === token();
}

export default async function handler(request: Request, response: Response) {
  if (request.method !== "POST" || !process.env.ADMIN_PASSWORD) return response.status(404).json({ error: "Not found" });
  if (!authorized(request)) return response.status(401).json({ error: "Invalid password" });
  const action = request.body?.action || "list";
  const orders = await ordersCollection();
  const accounts = await accountsCollection();

  if (action === "login") {
    response.setHeader("Set-Cookie", `unevn_admin=${token()}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`);
    return response.status(200).json({ ok: true });
  }
  if (action === "update" && request.body?.orderId && request.body.status) {
    const allowed = ["processed", "started", "finalized", "canceled"];
    if (!allowed.includes(request.body.status)) return response.status(400).json({ error: "Invalid status" });
    const order = await orders.findOne({ _id: new ObjectId(request.body.orderId) });
    if (!order) return response.status(404).json({ error: "Order not found" });
    if (order.status === "canceled") return response.status(409).json({ error: "Canceled orders cannot be changed." });
    await orders.updateOne({ _id: new ObjectId(request.body.orderId) }, { $set: { status: request.body.status, updatedAt: new Date() } });
    if (process.env.RESEND_API_KEY) {
      if (order?.email) await new Resend(process.env.RESEND_API_KEY).emails.send({ from: "Unevn Studios <noreply@unevnstudios.ca>", to: [order.email], subject: `Your Unevn order was ${request.body.status}`, text: `Hi ${order.name},\n\nYour Unevn order is now ${request.body.status}.\n\nUnevn Studios`, html: `<div style="background:#090909;color:#f5f5f2;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"><div style="max-width:560px;margin:auto;border:1px solid #292929;background:#121212;padding:36px;border-radius:16px"><div style="font-size:12px;letter-spacing:3px;color:#999;text-transform:uppercase">Unevn Studios</div><h1 style="font-size:28px;margin:28px 0 10px">Order updated</h1><p style="color:#aaa;line-height:1.6">Hi ${order.name}, your order is now <strong style="color:#f5f5f2;text-transform:capitalize">${request.body.status}</strong>.</p><p style="color:#aaa;line-height:1.6">We&apos;ll keep you posted as your project moves forward.</p><div style="margin-top:32px;padding-top:20px;border-top:1px solid #292929;color:#777;font-size:12px">Websites, built plainly, priced fairly.</div></div></div>` });
    }
    return response.status(200).json({ ok: true });
  }
  if (action === "delete-account" && request.body?.accountId) {
    await accounts.deleteOne({ _id: new ObjectId(request.body.accountId) });
    return response.status(200).json({ ok: true });
  }
  if (action === "delete-order" && request.body?.orderId) {
    const order = await orders.findOne({ _id: new ObjectId(request.body.orderId) });
    if (!order) return response.status(404).json({ error: "Order not found" });
    if (order.status !== "canceled") return response.status(409).json({ error: "Only canceled orders can be removed from logs." });
    await orders.deleteOne({ _id: new ObjectId(request.body.orderId) });
    return response.status(200).json({ ok: true });
  }
  const results = await orders.find({}).sort({ createdAt: -1 }).limit(200).toArray();
  const users = await accounts.find({}, { projection: { passwordHash: 0 } }).sort({ createdAt: -1 }).limit(500).toArray();
  return response.status(200).json({ orders: results.map((order) => ({ ...order, _id: order._id.toString() })), users: users.map((user) => ({ ...user, _id: user._id.toString() })) });
}

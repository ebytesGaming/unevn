/// <reference types="node" />
import crypto from "node:crypto";
import { ObjectId } from "mongodb";
import { ordersCollection } from "./_db.js";
import { Resend } from "resend";

type Response = { status: (code: number) => Response; json: (body: unknown) => void; setHeader: (name: string, value: string) => void };
type Request = { method?: string; body?: { password?: string; action?: string; orderId?: string; status?: string } };

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

  if (action === "login") {
    response.setHeader("Set-Cookie", `unevn_admin=${token()}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`);
    return response.status(200).json({ ok: true });
  }
  if (action === "update" && request.body?.orderId && request.body.status) {
    const allowed = ["processed", "started", "finalized", "canceled"];
    if (!allowed.includes(request.body.status)) return response.status(400).json({ error: "Invalid status" });
    await orders.updateOne({ _id: new ObjectId(request.body.orderId) }, { $set: { status: request.body.status, updatedAt: new Date() } });
    if (process.env.RESEND_API_KEY) {
      const order = await orders.findOne({ _id: new ObjectId(request.body.orderId) });
      if (order?.email) await new Resend(process.env.RESEND_API_KEY).emails.send({ from: "Unevn Studios <noreply@unevnstudios.ca>", to: [order.email], subject: `Your Unevn order was ${request.body.status}`, text: `Hi ${order.name},\n\nYour Unevn order is now ${request.body.status}.\n\nUnevn Studios` });
    }
    return response.status(200).json({ ok: true });
  }
  const results = await orders.find({}).sort({ createdAt: -1 }).limit(200).toArray();
  return response.status(200).json(results.map((order) => ({ ...order, _id: order._id.toString() })));
}

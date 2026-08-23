/// <reference types="node" />
import { Resend } from "resend";
import { ordersCollection } from "./_db.js";

type Order = {
  name: string;
  email: string;
  company?: string;
  profession: string;
  industry: string;
  goal: string;
  audience?: string;
  style: string;
  inspirations?: string;
  budget: string;
  timeline: string;
  features: string[];
  additionalInfo?: string;
  consultationDate?: string;
  plan?: string;
};

type Response = {
  status: (code: number) => Response;
  json: (body: unknown) => void;
};

export default async function handler(
  request: { method?: string; body?: Order },
  response: Response,
) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const order = request.body;
  if (!order?.name || !order.email || !order.profession || !order.industry || !order.goal || !order.style || !order.budget || !order.timeline || !order.consultationDate) {
    return response.status(400).json({ error: "Please complete the required fields." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: "Email service is not configured yet." });
  }

  const resend = new Resend(apiKey);
  const orders = await ordersCollection();
  const createdAt = new Date();
  const savedOrder = { ...order, status: "processed", createdAt };
  const inserted = await orders.insertOne(savedOrder);
  const details = [
    ["Plan", order.plan || "Not specified"],
    ["Name", order.name],
    ["Email", order.email],
    ["Company", order.company || "Not provided"],
    ["Profession", order.profession],
    ["Industry", order.industry],
    ["Goal", order.goal],
    ["Audience", order.audience || "Not provided"],
    ["Style", order.style],
    ["Inspiration", order.inspirations || "Not provided"],
    ["Budget", order.budget],
    ["Timeline", order.timeline],
    ["Features", order.features?.join(", ") || "None selected"],
    ["Additional info", order.additionalInfo || "Not provided"],
    ["Consultation date", order.consultationDate || "Skipped"],
  ] as const;
  const summary = details.map(([label, value]) => `${label}: ${value}`).join("\n");
  const htmlSummary = details.map(([label, value]) => `<tr><td style="padding:8px 0;color:#8f8f8a;width:150px">${label}</td><td style="padding:8px 0;color:#f5f5f2">${value}</td></tr>`).join("");
  const emailShell = (content: string) => `<div style="background:#090909;color:#f5f5f2;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"><div style="max-width:560px;margin:auto;border:1px solid #292929;background:#121212;padding:36px;border-radius:16px"><div style="font-size:12px;letter-spacing:3px;color:#999;text-transform:uppercase">Unevn Studios</div>${content}<div style="margin-top:32px;padding-top:20px;border-top:1px solid #292929;color:#777;font-size:12px">Websites, built plainly, priced fairly.</div></div></div>`;

  const result = await resend.batch.send([
    {
      from: "Unevn Studios <noreply@unevnstudios.ca>",
      to: [order.email],
      subject: "Your Unevn project request is confirmed",
      text: `Hi ${order.name},\n\nYour project request has been received and confirmed. Here are the details we have:\n\n${summary}\n\nWe will follow up with the next steps.\n\nUnevn Studios`,
      html: emailShell(`<h1 style="font-size:28px;margin:28px 0 10px">Request confirmed</h1><p style="color:#aaa;line-height:1.6">Hi ${order.name}, your Unevn project request has been received and confirmed.</p><table style="width:100%;border-collapse:collapse;margin-top:24px">${htmlSummary}</table>`),
    },
    {
      from: "Unevn Studios <noreply@unevnstudios.ca>",
      to: ["alie@mulgrave.com"],
      replyTo: order.email,
      subject: `New ${order.plan || "project"} request from ${order.name}`,
      text: `A new Unevn project request was submitted.\n\n${summary}`,
      html: emailShell(`<h1 style="font-size:28px;margin:28px 0 10px">New project request</h1><p style="color:#aaa;line-height:1.6">A new Unevn project request was submitted.</p><table style="width:100%;border-collapse:collapse;margin-top:24px">${htmlSummary}</table>`),
    },
  ]);

  if (result.error) {
    await orders.deleteOne({ _id: inserted.insertedId });
    return response.status(502).json({ error: "Email delivery failed. Please try again." });
  }

  return response.status(200).json({ ok: true, orderId: inserted.insertedId.toString() });
}

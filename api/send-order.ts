import { Resend } from "resend";
import { ordersCollection } from "./_db";

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
  if (!order?.name || !order.email || !order.profession || !order.industry || !order.goal || !order.style || !order.budget || !order.timeline) {
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

  const result = await resend.batch.send([
    {
      from: "Unevn Studios <noreply@unevnstudios.ca>",
      to: [order.email],
      subject: "Your Unevn project request is confirmed",
      text: `Hi ${order.name},\n\nYour project request has been received and confirmed. Here are the details we have:\n\n${summary}\n\nWe will follow up with the next steps.\n\nUnevn Studios`,
    },
    {
      from: "Unevn Studios <noreply@unevnstudios.ca>",
      to: ["alie@mulgrave.com"],
      replyTo: order.email,
      subject: `New ${order.plan || "project"} request from ${order.name}`,
      text: `A new Unevn project request was submitted.\n\n${summary}`,
    },
  ]);

  if (result.error) {
    await orders.deleteOne({ _id: inserted.insertedId });
    return response.status(502).json({ error: "Email delivery failed. Please try again." });
  }

  return response.status(200).json({ ok: true, orderId: inserted.insertedId.toString() });
}

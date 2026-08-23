/// <reference types="node" />
import crypto from "node:crypto";
import { accountsCollection } from "./_db.js";
import { Resend } from "resend";

type Response = { status: (code: number) => Response; json: (body: unknown) => void };
export default async function handler(request: { method?: string; body?: { name?: string; email?: string; password?: string; adminPassword?: string } }, response: Response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });
  const { name, email, password, adminPassword } = request.body || {};
  if (!process.env.ADMIN_PASSWORD || adminPassword !== process.env.ADMIN_PASSWORD) return response.status(401).json({ error: "Admin authorization required." });
  if (!name || !email || !password || password.length < 12) return response.status(400).json({ error: "Name, email, and a 12-character password are required." });
  const accounts = await accountsCollection();
  const exists = await accounts.findOne({ email: email.toLowerCase() });
  if (exists) return response.status(409).json({ error: "An account already exists for this email." });
  const passwordHash = crypto.scryptSync(password, crypto.randomBytes(16), 64).toString("hex");
  await accounts.insertOne({ name, email: email.toLowerCase(), passwordHash, createdAt: new Date() });
  if (process.env.RESEND_API_KEY) await new Resend(process.env.RESEND_API_KEY).emails.send({ from: "Unevn Studios <noreply@unevnstudios.ca>", to: [email], subject: "Your Unevn account has been created", text: `Hi ${name},\n\nYour Unevn Studios account has been created.\n\nEmail: ${email}\n\nYou can now sign in to your Unevn account.\n\nUnevn Studios`, html: `<div style="background:#090909;color:#f5f5f2;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"><div style="max-width:560px;margin:auto;border:1px solid #292929;background:#121212;padding:36px;border-radius:16px"><div style="font-size:12px;letter-spacing:3px;color:#999;text-transform:uppercase">Unevn Studios</div><h1 style="font-size:28px;margin:28px 0 10px">Account created</h1><p style="color:#aaa;line-height:1.6">Hi ${name}, your Unevn Studios account is ready.</p><p style="color:#aaa;line-height:1.6">Account email: <strong style="color:#f5f5f2">${email}</strong></p><div style="margin-top:32px;padding-top:20px;border-top:1px solid #292929;color:#777;font-size:12px">Websites, built plainly, priced fairly.</div></div></div>` });
  return response.status(201).json({ ok: true });
}

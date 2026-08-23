import crypto from "node:crypto";
import { accountsCollection } from "./_db";
import { Resend } from "resend";

type Response = { status: (code: number) => Response; json: (body: unknown) => void };
export default async function handler(request: { method?: string; body?: { name?: string; email?: string; password?: string } }, response: Response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });
  const { name, email, password } = request.body || {};
  if (!name || !email || !password || password.length < 12) return response.status(400).json({ error: "Name, email, and a 12-character password are required." });
  const accounts = await accountsCollection();
  const exists = await accounts.findOne({ email: email.toLowerCase() });
  if (exists) return response.status(409).json({ error: "An account already exists for this email." });
  const passwordHash = crypto.scryptSync(password, crypto.randomBytes(16), 64).toString("hex");
  await accounts.insertOne({ name, email: email.toLowerCase(), passwordHash, createdAt: new Date() });
  if (process.env.RESEND_API_KEY) await new Resend(process.env.RESEND_API_KEY).emails.send({ from: "Unevn Studios <noreply@unevnstudios.ca>", to: [email], subject: "Your Unevn account has been created", text: `Hi ${name},\n\nYour Unevn Studios account has been created.\n\nEmail: ${email}\n\nYour temporary password was provided by the Unevn team.\n\nUnevn Studios` });
  return response.status(201).json({ ok: true });
}

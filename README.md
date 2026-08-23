# unevn

## Email setup

The consultation form sends through the Vercel function at `/api/send-order` using Resend.

1. Create a Resend account and add `unevnstudios.ca` as a sending domain.
2. Add the DNS records Resend provides to the `unevnstudios.ca` domain.
3. Create a Resend API key.
4. In Vercel, add `RESEND_API_KEY` to the Production environment and redeploy.

The form sends a confirmation to the customer and a notification to `alie@mulgrave.com` from `noreply@unevnstudios.ca`.

## Admin dashboard

Open `/admin` after deployment. Configure these Vercel Production variables:

- `MONGODB_URI`: a newly rotated MongoDB Atlas connection string
- `MONGODB_DATABASE`: `unevn`
- `ADMIN_PASSWORD`: a long, unique admin password
- `RESEND_API_KEY`: the Resend key documented above

The dashboard lists submitted orders, consultation dates, client contact details, and supports `processed`, `started`, `finalized`, and `canceled` updates. Status updates send an email to the client.

Never commit database credentials or admin passwords. The credentials previously pasted into chat should be rotated in MongoDB Atlas immediately.

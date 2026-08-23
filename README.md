# unevn

## Email setup

The consultation form sends through the Vercel function at `/api/send-order` using Resend.

1. Create a Resend account and add `unevnstudios.ca` as a sending domain.
2. Add the DNS records Resend provides to the `unevnstudios.ca` domain.
3. Create a Resend API key.
4. In Vercel, add `RESEND_API_KEY` to the Production environment and redeploy.

The form sends a confirmation to the customer and a notification to `alie@mulgrave.com` from `noreply@unevnstudios.ca`.

# Production Setup

Add these variables to `.env.local` locally and to your hosting provider in production:

- `DATABASE_URL`: Postgres connection string.
- `DATABASE_SSL`: use `true` for hosted databases unless your provider says otherwise.
- `AUTH_SECRET`: long random value for signed admin cookies.
- `ADMIN_EMAIL`: first admin login email.
- `ADMIN_PASSWORD`: first admin login password.
- `ADMIN_PASSWORD_SALT`: random value used when hashing the admin password.
- `ADMIN_PASSWORD_PEPPER`: optional extra server-side password secret.
- `PAYSTACK_SECRET_KEY`: Paystack secret key.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary API credentials.
- `CLOUDINARY_FOLDER`: optional upload folder.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp number in international format without `+`.
- `NEXT_PUBLIC_SITE_URL`: public website URL for SEO, sitemap, and robots.
- `CORS_ORIGIN`: public frontend origin allowed for API requests.
- `MAX_UPLOAD_BYTES`: max product image upload size, defaults to 5MB.
- `SECURITY_ALERT_WEBHOOK_URL`: optional webhook for suspicious activity alerts.

Paystack webhook URL:

```txt
https://your-domain.com/api/paystack/webhook
```

Initialize the Postgres schema before running the app:

```txt
npm run db:init
```

This command creates the tables and seeds the starter products only when the `products` table is empty. Runtime requests do not create tables or seed data.

After deployment, submit `https://your-domain.com/sitemap.xml` in Google Search Console. Google indexing is not instant or controlled by code; the site must be deployed publicly, crawlable, and verified in Search Console.

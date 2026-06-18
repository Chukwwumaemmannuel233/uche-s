# Production Setup

Add these variables to `.env.local` locally and to your hosting provider in production:

- `DATABASE_URL`: Postgres connection string.
- `DATABASE_SSL`: use `true` for hosted databases unless your provider says otherwise.
- `AUTH_SECRET`: long random value for signed admin cookies.
- `ADMIN_EMAIL`: first admin login email.
- `ADMIN_PASSWORD`: first admin login password.
- `ADMIN_PASSWORD_SALT`: random value used when hashing the admin password.
- `PAYSTACK_SECRET_KEY`: Paystack secret key.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary API credentials.
- `CLOUDINARY_FOLDER`: optional upload folder.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp number in international format without `+`.

Paystack webhook URL:

```txt
https://your-domain.com/api/paystack/webhook
```

The app auto-creates its Postgres tables on first backend request when `DATABASE_URL` is present.

# Her Serene Highness Apartments

A production-ready luxury apartment booking platform.

## Stack
- **Frontend**: React + Vite + Tailwind CSS  
- **Backend**: Node.js + Express + MongoDB (Mongoose)  
- **Media**: Cloudinary  
- **Payments**: Paystack (10% non-refundable deposit)  
- **Auth**: JWT (admin only)

## Quick Start

### 1. Server setup
```bash
cd server
npm install
cp .env.example .env   # Fill in your secrets
npm run dev
```

### 2. Client setup
```bash
cd client
npm install
cp .env.example .env   # Fill in your Paystack public key
npm run dev
```

## Environment Variables

### server/.env
| Key | Description |
|-----|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random secret string |
| `CLOUDINARY_*` | Cloudinary credentials |
| `PAYSTACK_SECRET_KEY` | Paystack secret key |
| `CLIENT_URL` | Frontend URL (for CORS) |

### client/.env
| Key | Description |
|-----|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack public key |

## First Admin Setup
`POST /api/admin/register` — only works when no admin exists.

## Booking Flow
1. User selects apartment → views details  
2. Clicks **Book** → selects dates on availability calendar  
3. Fills contact form → proceeds to payment  
4. Pays **10% non-refundable deposit** via Paystack  
5. Backend verifies payment → booking confirmed  
6. Confirmation page shown with booking details

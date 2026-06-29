# HotelFlow 🏨💸
> **Daily Cash Management MVP for Hotels, Restaurants, Tea Shops, and Cafes.**

HotelFlow is a production-ready Progressive Web Application (PWA) built to solve daily cash register tracking for small hospitality businesses without the burden of full POS or inventory systems.

---

## 🚀 Features & Core Capabilities

- **💰 Opening Balance**: Track start-of-day register cash with admin lock support.
- **💵 Today's Sales**: Quick collection entry (Cash, UPI, Card, Bank Transfer) with instant trend calculations.
- **💸 Today's Expenses**: Categorized supplier and operational expense tracking (Vegetables, Milk, Gas, Chicken, Salary, Electricity, Misc).
- **🏦 Cash in Hand**: Real-time expected physical cash math (`Opening Balance + Cash Sales - Cash Expenses`).
- **💼 Closing Balance**: End-of-day cash counting & shortage/overage variance audit.
- **📈 Profit & ROI %**: Automated real-time net profit and Return on Investment percentage math (`(Profit / Expenses) * 100`).
- **📊 Interactive Reports**: Filter by Today, Yesterday, Last 7 Days, Last 30 Days, or Custom Ranges with Recharts visual graphs.
- **📱 Native Mobile Experience**: Mobile-first responsive layout with glassmorphism, sticky bottom tab navigation, desktop sidebar, and dark mode support.
- **⚡ PWA Ready**: Installable on iOS & Android with custom manifest & offline service worker caching.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions)
- **Language**: TypeScript
- **Styling**: TailwindCSS, CSS Glassmorphism
- **Icons**: Lucide React
- **Database**: PostgreSQL / SQLite (`dev.db`)
- **ORM**: Prisma ORM
- **Authentication**: JWT Auth (`jose`) with secure HTTP-only cookies
- **Password Hashing**: `bcryptjs`
- **Charts & Notifications**: Recharts & Sonner

---

## 🔑 Demo Admin Credentials

After running database seeding (`npm run prisma:seed`), log in with:
- **Email**: `admin@hotelflow.com`
- **Password**: `123456`

---

## 💻 Getting Started Locally

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   npx ts-node prisma/seed.ts
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

Open `http://localhost:3000` in your browser.

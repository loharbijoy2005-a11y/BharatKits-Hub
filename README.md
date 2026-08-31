# 🏛️ BharatKits Hub

**BharatKits Hub** is a client-first, high-performance web utility platform designed for Indian citizens and local cyber cafes. All processing is executed 100% client-side (in-browser) using the Canvas API, standard browser APIs, and libraries like `pdf-lib` and `qrcode.react`, guaranteeing complete data privacy.

---

## 🚀 How to Deploy on Vercel (Live URL)

Deploying a Next.js App on Vercel is completely **free** and takes less than 2 minutes. There are two simple methods:

### Method 1: Connecting your GitHub (Recommended & Easiest)
1. Go to [vercel.com](https://vercel.com) and sign up/login using your **GitHub account**.
2. Click the **Add New...** button in the dashboard, then select **Project**.
3. You will see a list of your repositories. Search for `BharatKits-Hub` and click **Import**.
4. In the configuration settings, leave everything as default (Vercel automatically detects Next.js configurations).
5. Click **Deploy**.
6. Once completed, Vercel will give you a live production domain (e.g. `bharatkits-hub.vercel.app`).
> 💡 Every time you run `git push`, Vercel will automatically re-build and update your live site!

### Method 2: Deploying via Vercel CLI (Directly from Terminal)
If you want to deploy directly from your local system terminal:
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Log in to your Vercel account:
   ```bash
   vercel login
   ```
3. Run the initial deployment setup:
   ```bash
   vercel
   ```
   *(Choose defaults and select "Yes" to link the project).*
4. Deploy the project to live production:
   ```bash
   vercel --prod
   ```

---

## 🛠️ Features Included

1. **Govt Directory**: Interactive bookmarks for UIDAI (Aadhaar), ECI (Voter ID), DigiLocker, Parivahan (DL, RC), Income Tax, GST, and state Bhulekh land lookups.
2. **Form Photo Resizer**: Presets for passport photos (3.5x4.5cm) and signatures (4.5x1.5cm) with canvas scanner enhancement filters (Grayscale, Black & White, High Contrast).
3. **ID PDF Combiner**: Auto-align front and back cards onto a printable A4 sheet.
4. **Marriage Biodata & Resume Builder**: Custom profile PDF compilation.
5. **UPI QR Code Studio**: Custom VPA pay codes with scan deep links.
6. **Financial Calculators**: Loan EMI amortization tables and GST split logs.

---

## ⚙️ Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` to preview.

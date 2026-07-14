# 🥁 Automated Booking & Logistics Portal for Drummers

An enterprise-grade, full-stack booking automation engine built specifically for a touring professional drummer. When performance posts go viral, managing a flood of event requests, soundcheck times, flights, and accommodations in Instagram DMs or emails becomes chaotic. This portal serves as a digital gatekeeper, streamlining client onboarding and routing logistics directly into a secure dashboard.

---

## ✨ Core Product Features

### 📅 Public Reservation Gate (Client-Facing)
* **Single-Artist Focus:** Tailored exclusively for a solo drummer's performance availability.
* **Logistics-First Inputs:** The booking form requires organizers to specify the event type (Wedding, Nightclub, Corporate, Festival) and physical logistics setup upfront.
* **Strict Format Enforcement:** Seamlessly ensures phone numbers, email standards, and exact event times (HH:MM format) are clean before submission.

### 🛡️ Ironclad Backend System
* **Two-Layer Validation:** Combines structural compile-time **TypeScript interfaces** with run-time **Zod schemas** to intercept malformed data.
* **No Double-Bookings:** A normalization engine strips times and checks MongoDB records atomically to block duplicate date allocations (returns a strict `409 Conflict` network response).
* **Robust Error Interceptors:** Operates with clean, RESTful HTTP response codes (`400`, `409`, `500`) instead of hiding server-side crashes behind false `200 OK` statuses.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, Next.js (App Router), Tailwind CSS
* **Backend:** Next.js Route Handlers (API Routes)
* **Database:** MongoDB Atlas
* **Data Modeling:** Mongoose (Object Document Mapper)
* **Runtime Validation:** Zod
* **Type Safety:** TypeScript

---

## 🚀 Getting Started

Follow these steps to run this booking engine locally on your machine.

### 1. Prerequisites
Ensure you have **Node.js (v18.x or higher)** and **npm** installed.

### 2. Clone & Install Dependencies
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME
npm install
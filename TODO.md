🏎️ JK Motors: Advanced Quotation Engine & Workshop ERP

A professional-grade automotive workshop management system built with React, Vite, and Supabase. Designed for high-speed estimation and secure document lifecycle management.

🏗️ Architecture Overview

Frontend: React 19 + TypeScript + SWC (Vite)

Styling: Tailwind CSS (Modern SaaS / Industrial Aesthetic)

Backend: Supabase (PostgreSQL + GoTrue Auth)


✅ Completed Milestones

Phase 0: Core UI & Foundation

[x] High-Fidelity UI/UX: Implemented a responsive, glassmorphic design system with industrial precision.

[x] Dynamic Input Engine: Configured regex-based validation for Odometer, Vehicle No, and Currency fields.

[x] Auth Gateway:

Integrated Supabase Auth with persistence layers.

Implemented secure state-guarded routing.

[x] State Management: Initialized complex form state with dynamic row injection.

🚧 Phase 1: Business Logic & Document Engine

Focus: Stabilizing core workflows and high-fidelity document generation.

📄 Document Transformation

[ ] Multi-Mode Support: Implement state-switching logic for Quotation, Tax Invoice, Cash Bill, and Estimation.

[ ] Advancement of PDF Engine:

Change the approach if needed for PDF rendering.

Add professional branding, terms & conditions footer, and dynamic signature blocks.

🔐 Security & Authorization (RLS)

[ ] Multi-Tenant Isolation: Implement PostgreSQL Row Level Security (RLS) policies to ensure data encapsulation.

[ ] RBAC (Role-Based Access Control): Define roles (Admin, Advisor, Technician) within Supabase auth.users metadata.

🧪 Quality Assurance (QA)

[ ] Automated Testing:

Setup Cypress for end-to-end (E2E) testing of the calculation engine.

Write Unit Tests for every part of the flow of code and business logic.

[ ] Performance Audit: Optimize render cycles for the dynamic 50+ field form along with test and trackthe app's performance.

🚧 Phase 2: Cloud Persistence & Data Analytics

Focus: Transforming the tool from a generator into a data-driven ERP.

☁️ Database Implementation

[ ] Schema Migration: Deploy SQL migration for quotations/invocie and it's details.

[ ] Auto-Save Logic: Implement "Draft" persistence to prevent data loss on session timeout.

[ ] History & Search: Build a centralized board/page to filter, search, and edit past documents and have build a tracking system for changes.

🛠️ Modular Expansion

[ ] JKM Modules:

Finance: Track, calculate and manage financial transactions and display it in the dashboard and enable report generation.

Inventory: Real-time parts tracking and stock depletion alerts.

HRM: Employment forms and technician performance (includes attendance, salary, etc.) tracking.

🚀 Future Plans (Phase 3): Hardware Integration & Digital Assets

Focus: Media management.

[ ] Media Vault: Cloud storage (Supabase Storage) for vehicle damage photos and "Before/After" proof.

[ ] POC: 

        - Enable view access to workshop camera.

        - POC to integrate publicly available APIs for/about the vehicle (like OCR Implementation: Researching license plate recognition to auto-fill vehicle profiles).

[ ] Gallery: Moments of the workshop.

🛠️ Tech Stack & Deployment

Repository: GitHub

Hosting: Vercel (jkmotors.vercel.app)

Database: Supabase PostgreSQL
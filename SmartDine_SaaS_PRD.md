# 📄 SmartDine SaaS --- Product Requirements Document (PRD)

## 🧭 1. Product Vision

SmartDine is a SaaS platform designed to digitize restaurant operations
using: - Smart QR menu ordering - AI ordering assistant - AR 3D menu
visualization - Kitchen & delivery dashboards - Customer subscriptions
and loyalty - Advanced analytics and feedback surveys

Goal: - Improve customer experience - Increase restaurant revenue -
Automate operational workflows

------------------------------------------------------------------------

## 🎨 2. Design System

### 🌙 Dark Mode (Primary)

-   Navy: #0B1E3A
-   Navy Soft: #101F3F
-   White Text: #FFFFFF
-   Borders: #1F2E4D
-   Hover: #162A52

### ☀️ Light Mode

-   Background: #FFFFFF
-   Primary Navy Text: #0B1E3A
-   Soft Background: #F6F8FC
-   Borders: #E5E7EB

Dark mode is the default for restaurant environments.

------------------------------------------------------------------------

## 🖼️ 3. Placeholder Images, Icons & Motion

### Placeholder Images

-   Consistent HD food stock images
-   Dashboard mockups
-   Restaurant technology visuals
-   AR food preview mockups

### Icons

Recommended: - Lucide Icons - Heroicons

Usage: - Menu → plate icon - Orders → receipt - Analytics → chart -
Delivery → truck - AI → sparkles/brain

### Animated Floating Shapes

Using Framer Motion: - Floating circles - Subtle waves - Minimal 3D dish
shapes - Soft glowing icons

Purpose: - Modern SaaS feel - Visual indication of AI and automation

------------------------------------------------------------------------

## 🧭 4. Header Specification

### Left Section

-   Logo
-   Platform name

### Navigation

Public: - Home - Features - Pricing - Demo - Contact

Authenticated: - Dashboard - Orders - Menu - Analytics - Settings

### Right Actions

-   Dark/Light toggle
-   Language switch
-   Notifications bell
-   Profile dropdown

Sticky header with blur and smooth animation.

------------------------------------------------------------------------

## 🧰 5. Frontend Technology Stack

Core: - Next.js 14 - React 18 - TypeScript

UI: - TailwindCSS - shadcn/ui - Framer Motion

Visualization: - Three.js (AR menu) - Recharts

Assets: - Icon library - Placeholder image system

------------------------------------------------------------------------

## 📱 6. Frontend Pages

### Public Pages

-   Landing page
-   Pricing page
-   Demo page
-   Contact page

### Authentication

-   Login
-   Register restaurant
-   Password reset
-   2FA verification

### Customer Experience

-   QR menu page
-   AR menu viewer
-   Ordering cart
-   AI assistant chat
-   Feedback survey
-   Subscription plans

------------------------------------------------------------------------

## 🧑‍🍳 7. Dashboards

### Restaurant Owner Dashboard

-   Sales overview
-   Live orders
-   Alerts
-   Menu management
-   Analytics
-   Staff roles
-   Subscription management

### Kitchen Dashboard

-   Incoming orders
-   Status updates
-   Prep timers

### Delivery Dashboard

-   Assigned deliveries
-   Status tracking
-   Driver ratings

### Platform Admin Dashboard

-   Tenant management
-   Billing
-   Usage analytics
-   Support tickets

------------------------------------------------------------------------

## ⚙️ 8. Backend Architecture

Recommended: - NestJS backend framework - PostgreSQL database
(Supabase) - Redis caching

APIs: - REST + GraphQL - WebSocket realtime updates

Storage: - Cloudflare R2 / AWS S3

AI: - OpenAI API integration

------------------------------------------------------------------------

## 🗄️ 9. Database Structure

Core tables:

Users: - Customer - Restaurant owner - Staff - Driver - Platform admin

Restaurants: - Multi-tenant SaaS isolation - Subscription tiers

Orders: - Items - Table numbers - Status tracking

Menu: - Categories - Dishes - Media assets

Analytics: - Sales data - Customer feedback - Behavioral insights

------------------------------------------------------------------------

## 🤖 10. AI Modules

### AI Waiter

-   Dish recommendations
-   Conversational ordering

### AI Analytics

-   Sales predictions
-   Customer segmentation

------------------------------------------------------------------------

## 🧊 11. AR Module

Technology: - Three.js - WebAR / WebXR

Features: - 3D dish preview - Interactive rotation - Ingredient overlays

------------------------------------------------------------------------

## 🔐 12. Security Requirements

-   SSL/TLS encryption
-   OAuth2 authentication
-   Role-based access control
-   Daily backups
-   SQL injection protection

------------------------------------------------------------------------

## 💰 13. SaaS Monetization Model

Basic Plan: - QR menu - Ordering system

Pro Plan: - Analytics - AI assistant

Enterprise Plan: - AR menu - Advanced integrations

------------------------------------------------------------------------

## 🚀 14. Development Roadmap

Phase 1 (MVP): - QR ordering - Basic dashboard

Phase 2: - AI assistant - Analytics - Subscriptions

Phase 3: - AR menu - Full SaaS scaling

------------------------------------------------------------------------

## ⭐ Final Technical Summary

Frontend: - Next.js - Tailwind + shadcn/ui - Framer Motion - Three.js -
Placeholder images - Icon system - Animated floating UI elements

Backend: - NestJS - PostgreSQL (Supabase) - Redis

Infrastructure: - Docker containers - Cloud hosting (AWS/Vercel) - CDN
acceleration

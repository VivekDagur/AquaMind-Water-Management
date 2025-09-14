# AquaMind - Smart Water Management System 🚀

**Latest Update**: Fixed network errors and implemented complete backend integration

## Project Overview

**Live Demo**: https://aquamind-hydrology.netlify.app
**Backend API**: https://aquamind-water-management-production.up.railway.app

AquaMind is a comprehensive smart water management platform that provides real-time monitoring, AI-powered insights, and intelligent alerts for water systems. The system helps optimize water usage, prevent wastage, and ensure efficient resource management.

## Features

- **Real-time Tank Monitoring** - Live water level tracking with IoT sensors
- **AI-Powered Insights** - Machine learning predictions and optimization recommendations  
- **Smart Alerts** - Automated notifications for low levels, maintenance, and anomalies
- **Analytics Dashboard** - Comprehensive data visualization and reporting
- **User Onboarding** - Guided setup wizard for new users
- **Demo Mode** - Interactive demonstration for showcasing capabilities

## Development Setup

**Use your preferred IDE**

Clone this repository and install dependencies. Requires Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

The application is deployed using:
- **Frontend**: Netlify (auto-deploys from main branch)
- **Backend**: Railway (auto-deploys from main branch)
- **Database**: MongoDB Atlas (cloud database)

## Custom Domain Setup

To use a custom domain like AquaMind.com:

1. **Purchase domain** from a registrar (GoDaddy, Namecheap, etc.)
2. **Configure DNS** in your domain registrar:
   - Add CNAME record: `www` → `https://aquamind-hydrology.netlify.app`
   - Add A record: `@` → `75.2.60.5` (Netlify's load balancer)
3. **Add domain in Netlify**:
   - Go to Site settings → Domain management
   - Add custom domain: `aquamind.com`
   - Enable HTTPS certificate

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **AI**: OpenAI GPT-4o-mini integration
- **Analytics**: Google Analytics 4 + custom tracking

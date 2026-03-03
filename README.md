# SAVI Approval System --- Frontend (React Application)

The **SAVI Approval System Frontend** is a modern web application built
with **React** that provides an intuitive interface for managing
approval workflows, requests, notifications, and dashboards within the
SAVI ecosystem.

------------------------------------------------------------------------

## 📌 Overview

This React application serves as the **client-side interface** for the
SAVI Approval System backend (Laravel API).\
It enables users to create requests, approve workflows, track statuses,
and receive notifications in real time.

------------------------------------------------------------------------

## 🚀 Features

-   Modern Responsive UI
-   Request Creation & Management
-   Multi-Level Approval Interface
-   Real-time Status Updates
-   Notification Dropdown System
-   Dashboard Analytics
-   Role-Based UI Rendering
-   Dark Mode Support
-   API Integration with Laravel Backend

------------------------------------------------------------------------

## 🏗️ Tech Stack

  Technology                Description
  ------------------------- ----------------------
  React                     Frontend Framework
  TypeScript / JavaScript   Application Language
  Vite / CRA                Build Tool
  Tailwind CSS              Styling
  Axios                     API Communication
  React Router              Routing
  Context API / Hooks       State Management
  Laravel API               Backend Service

------------------------------------------------------------------------

## 📂 Project Structure

    savi-approval-frontend/
    │
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── context/
    │   ├── assets/
    │   └── App.jsx / App.tsx
    │
    ├── public/
    ├── package.json
    └── vite.config.js

------------------------------------------------------------------------

## ⚙️ Installation

### 1. Clone Repository

``` bash
git clone https://github.com/your-repository/savi-approval-frontend.git
cd savi-approval-frontend
```

### 2. Install Dependencies

``` bash
npm install
```

or

``` bash
yarn install
```

------------------------------------------------------------------------

### 3. Environment Configuration

Create `.env` file:

    VITE_API_URL=http://127.0.0.1:8000/api

------------------------------------------------------------------------

### 4. Start Development Server

``` bash
npm run dev
```

Application runs at:

    http://localhost:5173

------------------------------------------------------------------------

## 🔐 Authentication Flow

1.  User logs in
2.  JWT / Session token stored securely
3.  API requests authenticated via headers
4.  Protected routes enforced via middleware

------------------------------------------------------------------------

## 🔄 Application Workflow

    Login
       ↓
    Dashboard
       ↓
    Create Request
       ↓
    Approval Monitoring
       ↓
    Notifications & Updates

------------------------------------------------------------------------

## 🔔 Notifications

-   Approval alerts
-   Status changes
-   Request updates
-   Dropdown notification panel

------------------------------------------------------------------------

## 🌐 API Integration

Example Axios setup:

``` javascript
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

------------------------------------------------------------------------

## 🧪 Running Tests

``` bash
npm run test
```

------------------------------------------------------------------------

## 🧹 Useful Scripts

``` bash
npm run dev        # Start development
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run linter
```

------------------------------------------------------------------------

## 📦 Build for Production

``` bash
npm run build
```

Output directory:

    /dist

Deploy using:

-   Nginx
-   Apache
-   Vercel
-   Netlify
-   Docker

------------------------------------------------------------------------

## 🔒 Security Practices

-   Environment-based API configuration
-   Protected Routes
-   Token-based authentication
-   Input validation
-   Secure API communication

------------------------------------------------------------------------

## 📜 Version History

  Version   Date         Description
  --------- ------------ ----------------------------------------
  1.0.0     03/03/2026   Initial React frontend release

------------------------------------------------------------------------

## 🤝 Contributing

1.  Create a feature branch
2.  Commit changes
3.  Push branch
4.  Open Pull Request

------------------------------------------------------------------------

## 📄 License

Proprietary software owned by SAVI.

------------------------------------------------------------------------

## 📞 Support

**SAVI Development Team**\
Email: support@savi-system.com

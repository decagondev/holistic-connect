# HolisticConnect

A modern, thoughtfully designed booking platform for holistic psychologists. Focus on healing while HolisticConnect handles scheduling, reminders, and client management.

## 🌟 Overview

HolisticConnect is a comprehensive web application that connects holistic psychology practitioners with their clients. The platform streamlines appointment booking, client management, and practice administration, allowing practitioners to focus on what matters most—their clients' wellness journey.

## ✨ Features

### For Practitioners
- **Seamless Scheduling** - Clients book directly from your personalized calendar with real-time availability syncing
- **Automated Reminders** - Reduce no-shows with intelligent email and SMS reminders
- **Client Management** - Keep detailed notes, track session history, and manage client relationships securely
- **Secure Payments** - Accept payments online with integrated billing and automatic invoicing
- **Video Consultations** - Built-in video conferencing for remote sessions
- **Custom Intake Forms** - Create personalized intake forms to gather essential information

### For Clients
- **Easy Booking** - Simple, intuitive booking process
- **Flexible Pricing Plans** - Choose from Basic, Professional, or Premium plans
- **Secure Sessions** - HIPAA-compliant platform with bank-level encryption
- **Mobile Access** - Access your account and sessions from any device

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **UI Primitives:** Radix UI
- **Icons:** Lucide React
- **Forms:** React Hook Form with Zod validation
- **Theming:** next-themes (dark mode support)
- **Analytics:** Vercel Analytics
- **Fonts:** Geist Sans & Crimson Text (Google Fonts)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm, yarn, or pnpm package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/decagondev/holistic-connect.git
   cd holistic-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
holistic-connect/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Homepage
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── practitioners/     # Practitioners page
│   ├── pricing/           # Pricing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Site header/navigation
│   ├── footer.tsx        # Site footer
│   ├── hero.tsx          # Hero section
│   ├── features.tsx      # Features section
│   ├── how-it-works.tsx  # How it works section
│   ├── cta.tsx           # Call-to-action component
│   ├── theme-provider.tsx # Theme context provider
│   └── theme-toggle.tsx  # Dark mode toggle
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   └── utils.ts         # Helper utilities
├── public/               # Static assets
└── styles/              # Additional styles
```

## 🎨 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🌐 Pages

- **Homepage (`/`)** - Landing page with hero, features, and how it works sections
- **Login (`/login`)** - User authentication page
- **Signup (`/signup`)** - New user registration page
- **Practitioners (`/practitioners`)** - Information page for practitioners
- **Pricing (`/pricing`)** - Pricing plans and FAQ section

## 🎯 Key Features Implementation

### Dark Mode
The application includes full dark mode support using `next-themes`. Users can toggle between light and dark themes via the theme toggle in the header.

### Responsive Design
All pages are fully responsive and optimized for mobile, tablet, and desktop views.

### Component Library
The project uses shadcn/ui components built on Radix UI primitives, ensuring accessibility and customization.

## 🔒 Security & Compliance

- HIPAA-compliant architecture (ready for implementation)
- Secure authentication (ready for implementation)
- Bank-level encryption (ready for implementation)
- Secure payment processing (ready for implementation)

## 🚧 Development Status

This is an active development project. Current implementation includes:
- ✅ Frontend UI/UX complete
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Component library setup
- ⏳ Backend API integration (in progress)
- ⏳ Authentication system (in progress)
- ⏳ Database integration (in progress)
- ⏳ Payment processing (in progress)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Team

Developed by [DecagonDev](https://github.com/decagondev)

## 📞 Support

For support, email support@holisticconnect.com or open an issue in the repository.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

**Note:** This application is currently in development. Some features may not be fully implemented yet.


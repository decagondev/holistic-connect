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
- **Backend:** Firebase (Authentication + Firestore)
- **Testing:** Jest + React Testing Library

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

3. **Set up Firebase**
   
   Create a Firebase project and configure it:
   
   a. Go to [Firebase Console](https://console.firebase.google.com/)
   
   b. Create a new project (or use an existing one)
   
   c. Enable Authentication:
      - Go to Authentication → Sign-in method
      - Enable **Email/Password** provider
      - Enable **Google** provider
   
   d. Enable Firestore Database:
      - Go to Firestore Database
      - Click "Create database"
      - Start in **production mode** (we'll add security rules)
      - Choose a location for your database
   
   e. Get your Firebase configuration:
      - Go to Project Settings → General
      - Scroll down to "Your apps" section
      - Click the web icon (`</>`) to add a web app
      - Copy the Firebase configuration object
   
   f. Create `.env.local` file in the root directory:
      ```bash
      cp .env.local.example .env.local
      ```
   
   g. Add your Firebase configuration to `.env.local`:
      ```env
      NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
      NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
      ```
   
   h. Deploy Firestore Security Rules:
      - Go to Firestore Database → Rules
      - Copy the contents of `/firebase/rules/firestore.rules`
      - Paste into the Firebase Console rules editor
      - Click "Publish"

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
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
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

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

## 🔐 Authentication Flow

HolisticConnect uses Firebase Authentication with the following flow:

### Sign Up Flow
1. User fills out signup form with email, password, display name, and role (Client/Practitioner)
2. Firebase creates the user account
3. User profile is created in Firestore `users` collection
4. If role is "practitioner", a practitioner profile is created in `practitioners` collection
5. Email verification is sent automatically
6. User is redirected to home page

### Sign In Flow
1. User enters email and password (or clicks "Sign in with Google")
2. Firebase authenticates the user
3. Auth state is synced across the app via `AuthContext`
4. User is redirected to the page they were trying to access (if applicable)

### Protected Routes
- Routes under `/dashboard`, `/practitioner`, `/client` require authentication
- Unauthenticated users are redirected to `/login` with a redirect parameter
- Client-side protection is handled by `RequireAuth` component
- Server-side protection is handled by `middleware.ts`

### Password Reset
- Users can request password reset from `/forgot-password` page
- Firebase sends password reset email
- User clicks link in email to reset password

## 📊 Data Model

HolisticConnect uses Firestore (NoSQL document database) with the following collections:

### Collections Overview

#### `users/{userId}`
User profiles with authentication metadata:
- `uid`: Firebase Auth UID
- `email`: User's email address
- `role`: 'client' | 'practitioner'
- `displayName`: User's display name
- `photoURL`: Profile photo URL
- `emailVerified`: Whether email is verified
- `createdAt`, `updatedAt`: Timestamps

#### `practitioners/{practitionerId}`
Practitioner business data:
- `uid`: Practitioner's Firebase Auth UID
- `email`, `displayName`, `photoURL`: Denormalized from users collection
- `bio`: Professional bio
- `specialties`: Array of specialty areas
- `pricing`: Pricing structure (initial consultation, follow-up sessions)
- `availabilityRules`: Working hours, timezone, blocked dates
- `sessionDuration`: Default session duration in minutes
- `isActive`: Whether accepting new clients

#### `appointments/{appointmentId}`
Appointment bookings:
- `id`: Auto-generated appointment ID
- `clientId`: Client's Firebase Auth UID
- `practitionerId`: Practitioner's Firebase Auth UID
- `startTime`, `endTime`: Appointment times (Firestore Timestamp)
- `status`: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
- `notes`: Client-provided notes
- `practitionerNotes`: Private practitioner notes
- `createdAt`, `updatedAt`: Timestamps

#### `sessions/{sessionId}`
Session notes and recordings (future feature):
- `appointmentId`: Reference to appointment
- `clientId`, `practitionerId`: User references
- `sessionDate`: Date/time of session
- `notes`: Practitioner's session notes
- `clientNotes`: Client's notes/reflections
- `recordingUrl`: URL to session recording (future)
- `isDraft`: Whether notes are finalized

#### `intakeForms/{formId}`
Intake form templates and submitted forms:
- `practitionerId`: Practitioner who created the form
- `appointmentId`: Optional reference to appointment
- `type`: 'template' | 'submitted'
- `title`, `description`: Form metadata
- `fields`: Array of form field definitions
- `responses`: Submitted form responses (if type === 'submitted')
- `submittedBy`: Client UID (if submitted)
- `isActive`: Whether template is active

### Data Relationships
- **User → Practitioner**: One-to-one (same UID)
- **User → Appointments**: One-to-many (via `clientId` or `practitionerId`)
- **Appointment → Session**: One-to-one (optional)
- **Appointment → Intake Forms**: One-to-many (optional)
- **Practitioner → Intake Forms**: One-to-many (templates)

### Security Rules
All Firestore operations require authentication. Access is controlled by:
- **Users**: Can only read/write their own user document
- **Clients**: Can browse practitioners, create appointments, view own appointments
- **Practitioners**: Can manage their profile, appointments, sessions, and intake forms

See `/firebase/rules/firestore.rules` for complete security rules.

## 🚧 Development Status

This is an active development project. Current implementation includes:
- ✅ Frontend UI/UX complete
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Component library setup
- ✅ Firebase Authentication (Email/Password + Google)
- ✅ Firestore database integration
- ✅ User profiles and role management
- ✅ Practitioner profiles
- ✅ Appointment booking system
- ✅ Protected routes and authentication guards
- ✅ Realtime data updates
- ✅ Testing infrastructure (Jest + React Testing Library)
- ⏳ Payment processing (in progress)
- ⏳ Video consultations (planned)
- ⏳ Session notes and recordings (planned)

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


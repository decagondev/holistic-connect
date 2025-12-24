# Product Requirements Document (PRD): Integrate Firebase Authentication and Firestore into HolisticConnect

## Project Overview
**Application Summary**  
HolisticConnect is a modern, responsive booking platform built for holistic psychologists and their clients. It allows practitioners to manage schedules, client relationships, sessions, and administrative tasks, while clients can discover practitioners, book appointments, view pricing, and participate in secure sessions. Key features include real-time scheduling, automated reminders, secure note-taking, custom intake forms, video consultations, and payment processing (some in progress).

**Current Tech Stack**  
- **Framework**: Next.js 16 (App Router) with React 19  
- **Language**: TypeScript  
- **Styling**: Tailwind CSS 4  
- **UI**: shadcn/ui (built on Radix UI)  
- **Forms**: React Hook Form + Zod  
- **Theming**: next-themes  
- **Icons**: Lucide React  
- **Other**: Vercel Analytics, Google Fonts (Geist Sans & Crimson Text)

**Current State**  
- Fully featured frontend with pages for home, login, signup, practitioners, pricing, etc.  
- No backend, authentication, or persistent data storage implemented.  
- Login/Signup pages exist but are non-functional placeholders.

**Goal of This Integration**  
Replace placeholder auth with **Firebase Authentication** (Email/Password + Google provider for simplicity) and migrate all data storage to **Firebase Firestore**. This provides:  
- Secure, scalable user authentication  
- Real-time, NoSQL document-based storage for users, practitioners, clients, appointments, sessions, notes, intake forms, etc.  
- Serverless backend (no custom server needed initially)  
- Easy integration with Next.js via Firebase SDK  

**Design Principles**  
- **SOLID Compliance**: Single Responsibility (separate auth, data services), Open/Closed (extensible providers), Liskov Substitution (interchangeable repo implementations), Interface Segregation (small, focused interfaces), Dependency Inversion (inject services via contexts/providers).  
- **Modular & Granular Design**:  
  - Separate Firebase config, auth module, Firestore module  
  - Feature-specific repositories/services (e.g., appointments service, users service)  
  - Context providers for auth and data access  
  - Reusable hooks for common operations  
  - Protected routes via Higher-Order Components or middleware  

**User Roles** (for Firestore Security Rules & Future Features)  
- **Client**: Books appointments, views own history, fills intake forms  
- **Practitioner**: Manages calendar, clients, notes, intake forms, pricing  
- **Admin** (future): Platform oversight (not implemented in this phase)

## Epic Breakdown

### Epic 0: Setup Cursor AI Development Environment
**Goal**: Prepare the project for AI-assisted development using Cursor (VS Code fork with AI features). This ensures consistent, high-quality code generation aligned with project architecture.

**Pull Requests**  
- PR #0: Initialize Cursor Rules and Memory Bank

**Commits & Sub-tasks**  
1. Create directory `.cursor/rules`  
2. Add file `.cursor/rules/project.md` with rules:  
   - Always use TypeScript with strict mode  
   - Follow Next.js App Router conventions  
   - Use shadcn/ui components and Tailwind styling  
   - Enforce SOLID principles: separate concerns, use interfaces for services  
   - Modular design: one feature per folder under `/features` or `/services`  
   - Use React Hook Form + Zod for forms  
   - Prefer functional components and hooks  
   - Write clean, documented code with JSDoc  
   - Protect sensitive data; never hardcode secrets  
3. Add file `.cursor/rules/architecture.md` with:  
   - Firebase integration must be modular (config, auth, firestore separate)  
   - Use context providers for global state (AuthContext, Firestore services)  
   - Implement protected routes via middleware or HOC  
   - Firestore data modeling: collections for users, practitioners, appointments, sessions, notes, intakeForms  
   - Security: Emphasize Firestore rules for role-based access  
4. Create directory `.cursor/memory-bank`  
5. Add initial file `.cursor/memory-bank/overview.md` containing:  
   - Full project summary (tech stack, features, roles)  
   - Current status: Frontend complete, auth/data in progress  
   - Integration goals: Firebase Auth + Firestore  
   - Key decisions: Email/Password + Google auth; document-based Firestore structure  

### Epic 1: Firebase Project Setup and SDK Integration
**Goal**: Initialize Firebase and add the SDK securely to the project.

**Pull Requests**  
- PR #1: Add Firebase Configuration and SDK

**Commits & Sub-tasks**  
1. Create a new Firebase project (manual step: provide console link).  
2. Enable Authentication (Email/Password + Google Sign-In).  
3. Enable Firestore Database (in production mode, start with test rules).  
4. Install Firebase SDK: `npm install firebase`  
5. Create `/lib/firebase/config.ts` with `firebaseConfig` (use environment variables).  
6. Add environment variables to `.env.local` (placeholders):  
   - `NEXT_PUBLIC_FIREBASE_API_KEY`  
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`  
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`  
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`  
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`  
   - `NEXT_PUBLIC_FIREBASE_APP_ID`  
7. Create `/lib/firebase/client.ts`: Initialize Firebase app, export auth and firestore instances.  
8. Add `.gitignore` entries for env files if missing.

### Epic 2: Implement Firebase Authentication
**Goal**: Fully functional auth with Email/Password and Google, integrated into existing login/signup pages.

**Pull Requests**  
- PR #2: Core Auth Context and Hooks  
- PR #3: Update Login and Signup Pages  
- PR #4: Protected Routes and Auth Guard

**Commits & Sub-tasks**  
1. Create `/contexts/AuthContext.tsx`: Provider with user state, signIn, signUp, signOut, signInWithGoogle.  
2. Create custom hooks: `useAuth`, `useSignIn`, `useSignUp`, etc. (granular).  
3. Implement role assignment on signup (e.g., query param or separate flows for client/practitioner).  
4. Update `/app/login/page.tsx` and `/app/signup/page.tsx` to use Firebase auth (forms with React Hook Form).  
5. Add password reset and email verification flows (basic UI).  
6. Create middleware.ts for route protection (redirect unauth to login).  
7. Create HOC or component `RequireAuth` for client-side protection.  
8. Add loading states and error handling (toast notifications via shadcn).

### Epic 3: Design Firestore Data Model and Security Rules
**Goal**: Define scalable data structure and secure it with rules.

**Pull Requests**  
- PR #5: Firestore Data Model and Security Rules

**Commits & Sub-tasks**  
1. Document data model in `.cursor/memory-bank/firestore-model.md`:  
   - `users/{userId}`: uid, email, role ('client' | 'practitioner'), profile data  
   - `practitioners/{practitionerId}`: bio, pricing, availability, etc.  
   - `appointments/{appointmentId}`: clientId, practitionerId, time, status  
   - `sessions/{sessionId}`: notes, recording links (future)  
   - `intakeForms/{formId}`: template or submitted data  
2. Write initial Firestore security rules in Firebase console or `/firebase/rules/firestore.rules`:  
   - Auth required for all operations  
   - Users can read/write own document  
   - Practitioners can manage their appointments/clients  
   - Clients can only access own data  
3. Add rules file locally for version control.

### Epic 4: Firestore Services and Integration
**Goal**: Build modular data access layer and connect to existing/planned features.

**Pull Requests**  
- PR #6: Core Firestore Services  
- PR #7: Integrate with Appointments and Practitioner Profiles  
- PR #8: Client Dashboard and Session Management

**Commits & Sub-tasks**  
1. Create `/services/firestore/` directory with interfaces (e.g., UserRepository, AppointmentRepository).  
2. Implement concrete services using Firebase SDK (injected via context if needed).  
3. Create `/contexts/FirestoreContext.tsx` or feature-specific providers.  
4. Build granular hooks: useUser, usePractitioner, useAppointments, etc. (react-query or custom with realtime listeners).  
5. Migrate placeholder data to Firestore queries (e.g., practitioner list, booking calendar).  
6. Implement realtime updates where beneficial (e.g., availability).  
7. Add error handling, offline support notes.  
8. Update relevant pages (practitioners, pricing, dashboard if exists) to use real data.

### Epic 5: Testing, Polish, and Documentation
**Goal**: Ensure stability and maintainability.

**Pull Requests**  
- PR #9: Tests and Documentation

**Commits & Sub-tasks**  
1. Add basic tests (Jest/React Testing Library) for auth hooks and services.  
2. Write documentation in README: Firebase setup, auth flow, data model.  
3. Update `.cursor/memory-bank/integration-complete.md` with summary of changes.  
4. Performance checks: Optimize Firestore queries (indexes if needed).  
5. Security review: Confirm no sensitive data exposure.

# Detailed Task List for Integrating Firebase Auth & Firestore into HolisticConnect

This task list expands the previous PRD into a highly granular, executable checklist. Every task respects:
- **SOLID Principles** (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion)
- **Modular & Granular Design** (small files, focused responsibilities, reusable hooks/services)
- **TypeScript strictness**, shadcn/ui + Tailwind consistency
- **Cursor AI-assisted development** (rules and memory bank guide code generation)

Tasks are grouped by the same Epics, with even finer sub-tasks for clarity and ease of implementation.

### Epic 0: Setup Cursor AI Development Environment

**Task 0.1: Create Cursor rules directory and core project rules**  
- [ ] Create folder `.cursor/rules`  
- [ ] Create file `.cursor/rules/project.md` with content:  
  - Enforce TypeScript strict mode  
  - Use functional components + hooks only  
  - All new components must use shadcn/ui primitives  
  - Tailwind classes must be consistent with existing codebase  
  - Follow Next.js App Router conventions (server/client boundaries)  
  - Every service/hook must have a clear single responsibility  
  - Use interfaces for all services/repositories  
  - Prefer composition over inheritance  
- [ ] Create file `.cursor/rules/architecture.md` with content:  
  - Firebase config must live in `/lib/firebase`  
  - Auth logic only in `/contexts/auth` and `/hooks/auth`  
  - Firestore services only in `/services/firestore`  
  - All data-fetching hooks must be reusable and accept parameters  
  - Protected routes: use middleware.ts + client-side guards  
  - Role-based logic must be derived from Firestore user document  

**Task 0.2: Initialize Memory Bank**  
- [ ] Create folder `.cursor/memory-bank`  
- [ ] Create file `.cursor/memory-bank/overview.md` with:  
  - Full app description (HolisticConnect: booking platform for holistic psychologists)  
  - Current stack summary  
  - User roles: Client, Practitioner (Admin future)  
  - Goal: Replace mock auth/data with Firebase Auth + Firestore  
- [ ] Create file `.cursor/memory-bank/progress.md` (initially empty — will update after each epic)

### Epic 1: Firebase Project Setup and SDK Integration

**Task 1.1: Manual Firebase Project Creation**  
- [ ] Go to https://console.firebase.google.com  
- [ ] Create new project named "holistic-connect-prod" (or similar)  
- [ ] Enable Authentication → Sign-in methods: Email/Password + Google  
- [ ] Enable Firestore Database (start in production mode, locked)  
- [ ] Note Project ID and generate Web App config  

**Task 1.2: Add Firebase SDK and Config**  
- [ ] Run `npm install firebase`  
- [ ] Create `/lib/firebase/config.ts`  
  - Export const firebaseConfig using process.env.NEXT_PUBLIC_* variables  
- [ ] Create `/lib/firebase/client.ts`  
  - Initialize Firebase app (getApp/getApps pattern)  
  - Export: auth, db (getFirestore()), and app instance  
- [ ] Add required environment variables to `.env.local.example` and `.env.local`:  
  - NEXT_PUBLIC_FIREBASE_API_KEY  
  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  
  - NEXT_PUBLIC_FIREBASE_PROJECT_ID  
  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET  
  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID  
  - NEXT_PUBLIC_FIREBASE_APP_ID  
- [ ] Update `.gitignore` to ensure no env files are committed  

### Epic 2: Implement Firebase Authentication

**Task 2.1: Define Auth Types and Interfaces**  
- [ ] Create `/types/auth.ts`  
  - Define UserRole = 'client' | 'practitioner'  
  - Define AppUser extending FirebaseUser with role, displayName, etc.  

**Task 2.2: Build Auth Context (SOLID: Dependency Inversion)**  
- [ ] Create `/contexts/AuthContext.tsx`  
  - Create AuthContext with user, loading, role  
  - Implement AuthProvider using onAuthStateChanged  
  - Provide methods: signInEmail, signUpEmail, signInGoogle, signOut, sendPasswordReset  
- [ ] Create `/hooks/useAuth.ts` → simple hook returning context values  

**Task 2.3: Granular Auth Action Hooks**  
- [ ] Create `/hooks/auth/useSignIn.ts`  
- [ ] Create `/hooks/auth/useSignUp.ts`  
- [ ] Create `/hooks/auth/useSignInWithGoogle.ts`  
- [ ] Create `/hooks/auth/useSignOut.ts`  
- [ ] Each hook handles loading/error states and uses toast notifications  

**Task 2.4: Update Login Page**  
- [ ] Refactor `/app/(auth)/login/page.tsx`  
  - Use React Hook Form + Zod schema  
  - Integrate useSignIn and useSignInWithGoogle hooks  
  - Add loading states, error messages, Google button (shadcn style)  

**Task 2.5: Update Signup Page**  
- [ ] Refactor `/app/(auth)/signup/page.tsx`  
  - Add role selection (Client / Practitioner) radio group  
  - On successful signup → create Firestore user document with selected role (prep for later)  
  - Use useSignUp hook  

**Task 2.6: Protected Routes**  
- [ ] Create `middleware.ts`  
  - Protect all routes under `/dashboard`, `/practitioner`, `/client`  
  - Redirect unauthenticated to /login  
- [ ] Create `/components/auth/RequireAuth.tsx` (client-side guard)  
  - Redirect or show loader if !user  

**Task 2.7: Auth Polish**  
- [ ] Add email verification flow (send on signup, check on login)  
- [ ] Add password reset page/link  
- [ ] Update navbar to show user avatar/menu when logged in  

### Epic 3: Design Firestore Data Model and Security Rules

**Task 3.1: Document Data Model**  
- [ ] Create `.cursor/memory-bank/firestore-model.md` with detailed schema:  
  - Collection: users → doc {uid} → fields: email, role, displayName, photoURL, createdAt  
  - Collection: practitioners → doc {uid} → fields: bio, specialties, pricing, availabilityRules, etc.  
  - Collection: appointments → doc {id} → fields: clientId, practitionerId, startTime, endTime, status, notes  
  - Collection: intakeForms → subcollection under practitioners or per appointment  
  - Collection: sessions → doc {id} → secure notes, recordings (future)  

**Task 3.2: Write Security Rules**  
- [ ] Create `/firebase/rules/firestore.rules` (local copy)  
  - Require auth for all read/write  
  - Users can read/write only their own /users/{uid}  
  - Practitioners can read/write their /practitioners/{uid} and related appointments  
  - Clients can only read/write appointments where clientId == request.auth.uid  
  - Add match blocks for each collection  
- [ ] Deploy rules to Firebase console (or use firebase-tools later)  

### Epic 4: Firestore Services and Integration

**Task 4.1: Define Repository Interfaces (SOLID: Interface Segregation)**  
- [ ] Create `/services/firestore/interfaces/`  
  - IUserRepository.ts  
  - IPractitionerRepository.ts  
  - IAppointmentRepository.ts  

**Task 4.2: Implement Concrete Firestore Repositories**  
- [ ] Create `/services/firestore/repositories/`  
  - UserRepository.ts → implements IUserRepository (createUserProfile, getUser, updateUser)  
  - PractitionerRepository.ts  
  - AppointmentRepository.ts (with realtime listeners)  

**Task 4.3: Create Granular Custom Hooks**  
- [ ] `/hooks/firestore/useUser.ts` → fetches current user profile  
- [ ] `/hooks/firestore/usePractitioner.ts(practitionerId)`  
- [ ] `/hooks/firestore/usePractitionersList.ts()` → paginated or filtered list  
- [ ] `/hooks/firestore/useAppointments.ts(practitionerId?, clientId?)` → realtime  
- [ ] `/hooks/firestore/useCreateAppointment.ts` mutation hook  

**Task .4: Integrate into Key Pages**  
- [ ] Update practitioner listing page → use usePractitionersList  
- [ ] Update practitioner profile page → use usePractitioner  
- [ ] Update booking calendar → use appointments realtime + create mutation  
- [ ] Update client dashboard → show upcoming appointments  
- [ ] Update practitioner dashboard → manage calendar, clients, intake forms  

**Task 4.5: Post-Signup User Profile Creation**  
- [ ] After signup, call UserRepository.createUserProfile with role from form  
- [ ] If practitioner selected → create empty practitioner document  

### Epic 5: Testing, Polish, and Documentation

**Task 5.1: Add Basic Tests**  
- [ ] Setup Jest + React Testing Library (if not present)  
- [ ] Write tests for:  
  - Auth hooks (mock firebase)  
  - Repository methods  
  - Protected route behavior  

**Task 5.2: Documentation**  
- [ ] Update README.md with:  
  - Firebase setup instructions  
  - Auth flow diagram (text)  
  - Data model overview  
  - How to run locally with env vars  
- [ ] Update `.cursor/memory-bank/integration-complete.md` summarizing all changes  

**Task 5.3: Final Review**  
- [ ] Verify no hardcoded secrets  
- [ ] Check Firestore indexes for complex queries  
- [ ] Test auth flows end-to-end (signup → login → protected page)  
- [ ] Confirm realtime updates work on appointments  

# On-Demand Salary - Mobile Client

This is the **React Native mobile app** for the On-Demand Salary platform.

Employees can:
- Sign in with phone number and OTP
- Set and verify a 6-digit PIN
- View available balance and transaction history
- Submit withdrawal requests (up to 50% of available earnings)
- Reset PIN or log out via settings

---

## Tech Stack

- React Native (CLI)
- TypeScript
- React Navigation
- Context API
- Keychain Storage
- Mock API for local dev

---

## Getting Started

### 1. Clone the project

```
git clone https://github.com/theerayakaow/OdsClient.git
cd OdsClient
```

### 2. Install dependencies

```
npm install
```

### 3. Run the project

#### iOS

```
npx pod-install
npx react-native run-ios
```

#### Android

```
npx react-native run-android
```

> 🔗 Backend must run on: `http://localhost:3000`

---

##  Folder Structure

```
src/
├── components/     # Reusable components (e.g. ProfileHeader)
├── context/        # Global state: AuthContext, PinContext
├── hooks/          # Custom hooks: useUser, usePin, useAuth
├── navigation/     # Stack & Tab navigators
├── screens/        # UI screens (SignIn, Otp, Main, Withdraw, Settings)
├── services/       # API service layer (axios config, API methods)
├── types/          # Shared TypeScript types
├── utils/          # Helpers (formatting, token utils)
```

---

##  Authentication Flow

1. Sign in with phone number → receive OTP (mocked)
2. Enter OTP → receive token and proceed to set PIN
3. Enter PIN to access app
4. Reset PIN and logout available in Settings

---

##  API & Dev Info

- Backend provided in `/OdsServer` repo
- Test APIs with VS Code `REST Client` extension using `request.http`
- Tokens stored securely with `react-native-keychain`

---

##  Features Done

- [x] Phone sign-in with mock OTP
- [x] OTP verification and auto-expiry
- [x] PIN setup and verification
- [x] Withdraw screen with amount restrictions
- [x] Tab navigation (Home, Withdraw, Settings)
- [x] Toast messages for success/failure
- [x] Persist token and user info

---

##  Unit Testing
```
__tests__/
├── hooks/                  # Tests for custom hooks
│   ├── useAuth.test.ts
│   └── useUser.test.ts

├── screens/                # Tests for individual screens (React Native screens)
│   ├── MainScreen.test.tsx
│   ├── WithdrawScreen.test.tsx
│   └── SettingScreen.test.tsx

└── App.test.tsx            # Root-level component test
```
---

## Run All Tests
```
npm test
# or
npx jest
```
---
## Run a Specific Test File
```
npm test -- __tests__/hooks/useUser.test.ts
npm test -- __tests__/hooks/useAuth.test.ts
npm test -- __tests__/screens/MainScreen.test.tsx
npm test -- __tests__/screens/WithdrawScreen.test.tsx
npm test -- __tests__/screens/SettingScreen.test.tsx
npm test -- __tests__/App.test.tsx
```
---
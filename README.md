# ⚽ Football Field Booking App

A mobile football field booking application built with React Native (Expo) and TypeScript.

## 🎯 Overview

This app allows users to browse and book football fields. It features two user roles:
- **Players**: Browse field complexes, view all fields, and manage their profile
- **Owners**: Manage their field complexes and bookings (dashboard)

## ✨ Features

### 👤 Player Features
- 🏢 Browse field complexes with ratings and details
- ⚽ View all available football fields
- 🔍 Search fields by name, address, or complex
- 🏷️ Filter by field type (5-a-side, 7-a-side, 11-a-side)
- 📊 View field availability status
- 👤 Manage personal profile
- 📜 View booking history and favorites

### 🏢 Owner Features
- 📊 Dashboard with statistics (total fields, bookings, revenue, customers)
- 🎯 Quick actions for management
- 🚧 Coming soon: Add fields, manage bookings, view reports

## 🎮 Demo Accounts

The app includes 2 demo accounts for testing:

**Player Account:**
```
Email: player@test.com
Password: 123456
```

**Owner Account:**
```
Email: owner@test.com
Password: 123456
```

## 📁 Project Structure

```
football-field-booking/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ClusterCard.tsx
│   │   ├── FieldCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── CustomInput.tsx
│   │   ├── PrimaryButton.tsx
│   │   ├── SocialLoginButtons.tsx
│   │   └── Typography.tsx
│   ├── context/             # React Context
│   │   └── AuthContext.tsx  # Authentication context
│   ├── navigation/          # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── PlayerNavigator.tsx (Bottom Tabs)
│   │   └── OwnerNavigator.tsx
│   ├── screens/            # Application screens
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── WelcomeScreen.tsx
│   │   ├── player/
│   │   │   ├── HomeScreen.tsx          # Field complexes
│   │   │   ├── FieldListScreen.tsx     # All fields
│   │   │   ├── FieldDetailScreen.tsx
│   │   │   ├── BookingScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   └── owner/
│   │       ├── DashboardScreen.tsx
│   │       ├── ManageFieldsScreen.tsx
│   │       └── ManageBookingsScreen.tsx
│   ├── services/           # API services (coming soon)
│   ├── store/             # State management (coming soon)
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   └── utils/             # Utility functions
├── assets/                # Images and static files
├── App.tsx               # App entry point
├── app.json              # Expo configuration
├── package.json
└── tsconfig.json
```

## 🛠 Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform (SDK 54)
- **TypeScript** - Type safety
- **React Navigation v6** - Navigation library
  - Stack Navigator
  - Bottom Tabs Navigator
- **Expo Vector Icons** - Icon library
- **React Context API** - State management (authentication)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- **Expo Go** app on your mobile device (from App Store or Google Play)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd FBF-FE
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npx expo start
```

### Running the App

#### Option 1: Expo Go (Recommended for testing)

1. Install **Expo Go** on your phone:
   - [Android - Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Start the dev server:
```bash
npm start
```

3. Scan the QR code:
   - **Android**: Open Expo Go app → Scan QR code
   - **iOS**: Open Camera app → Scan QR code → Tap notification

4. The app will load and you can login with demo accounts!

#### Option 2: Web Browser

```bash
npm run web
# or press 'w' in the terminal
```

#### Option 3: Android Emulator (requires Android Studio)

```bash
# Start emulator first, then:
npm run android
```

## 📱 Navigation Structure

### Auth Flow (Not Logged In)
```
AuthNavigator (Stack)
├── Welcome
├── Login
└── Register
```

### Player Flow (Logged In)
```
PlayerNavigator (Bottom Tabs)
├── Home (Complexes)        # Browse field complexes
├── FieldList (All Fields)  # Browse all fields
└── Profile                 # User profile & settings
```

### Owner Flow (Logged In)
```
OwnerNavigator (Stack)
└── Dashboard               # Owner dashboard
```

## 🎨 Components Library

### Reusable Components

- **`ClusterCard`** - Display field complex with image, rating, location
- **`FieldCard`** - Display individual field with details, price, availability
- **`SearchBar`** - Search input with filter button
- **`CategoryFilter`** - Horizontal scrollable category chips
- **`CustomInput`** - Styled input with icon support
- **`PrimaryButton`** - Primary action button
- **`Typography`** - Text component with variants (h1, h2, subtitle, body)

## 🔐 Authentication

The app uses **React Context API** for authentication management:

- `AuthContext` provides:
  - `user` - Current user object
  - `isAuthenticated` - Boolean auth status
  - `login(email, password)` - Login function
  - `logout()` - Logout function

Authentication state automatically switches between Auth and Main navigators.

## 📝 Mock Data

Currently, the app uses mock data for:
- Field complexes
- Football fields
- User profiles
- Statistics

In production, these will be replaced with actual API calls.

## 🎯 Current Status

### ✅ Completed
- [x] Project structure and navigation
- [x] Authentication flow with Context API
- [x] Login screen with demo accounts
- [x] Player screens (Home, FieldList, Profile)
- [x] Owner dashboard
- [x] Reusable components
- [x] Bottom tab navigation
- [x] Search and filter functionality
- [x] Mock data and UI

### 🚧 Coming Soon
- [ ] Backend API integration
- [ ] Real booking functionality
- [ ] Field detail screen
- [ ] Booking history
- [ ] Payment integration
- [ ] Owner field management
- [ ] Push notifications
- [ ] Map integration

## 🧪 Testing

1. Start the app with `npm start`
2. Login with demo accounts (see above)
3. Test player features:
   - Browse complexes
   - View all fields
   - Search and filter
   - View profile
   - Logout
4. Test owner dashboard:
   - View statistics
   - Check quick actions
   - Logout

## 📦 Available Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android (requires emulator/device)
npm run ios        # Run on iOS (macOS only)
npm run web        # Run on web browser
```

## 🌐 Environment

- **Development**: Using Expo Go
- **Build**: Can create standalone builds with EAS Build
- **No native build required** for development

## 📄 Additional Documentation

- See `ACCOUNTS.md` for detailed demo account information
- See `ASSET_INSTRUCTIONS.md` for asset management guidelines

## 🤝 Contributing

This is a private project. For collaboration:
1. Create a new branch for features
2. Follow TypeScript and ESLint rules
3. Test on both Android and iOS
4. Create pull requests for review

## 📝 Notes

- All UI text is in English
- Currency displayed as USD ($)
- Mock data uses HCMC (Ho Chi Minh City) locations
- App follows Material Design principles
- Color scheme: Emerald green (#10B981) as primary

## 🔮 Future Enhancements

1. **Backend Integration**
   - REST API or GraphQL
   - Real-time booking updates
   - User authentication with JWT

2. **Advanced Features**
   - Google Maps integration
   - Real-time availability
   - Online payment (Stripe/PayPal)
   - Review and rating system
   - Push notifications

3. **Owner Dashboard**
   - Full field management
   - Booking calendar
   - Revenue reports
   - Customer management

## 📧 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ using React Native & Expo**

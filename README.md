# 🌟 Star Seeker - Interstellar Journey Planning App

A React Native mobile application for planning and costing interstellar journeys through hyperspace gates.

## ✨ Features

### Core Features

- **Gate Explorer**: Browse all hyperspace gates with animated list views
- **Gate Details**: View detailed information about each gate including spatial coordinates
- **Cost Calculator**: Calculate journey costs based on distance, passengers, and parking days
- **Route Finder**: Find the cheapest route between two gates with detailed segment breakdown

### Enhanced Features

- **🎨 Dual Themes**: Switch between Purple Space and Teal Space themes
- **💾 Journey Memory**: Save favorite routes using AsyncStorage (via useFavorites hook)
- **✨ Smooth Animations**: Powered by React Native Reanimated
- **👆 Gesture Support**: Enhanced interactions with React Native Gesture Handler
- **📱 Responsive UI**: Beautiful, mobile-first design with NativeWind (Tailwind CSS)
- **🔄 Pull to Refresh**: Refresh gate data with intuitive pull gesture
- **⚡ Offline Awareness**: Graceful error handling for poor connectivity

## 🏗️ Architecture

### Folder Structure

```
star-seeker-app/
├── src/
│   ├── api/              # API client and endpoints
│   │   ├── client.ts
│   │   └── endpoints.ts
│   ├── components/       # Reusable components
│   │   └── ThemeToggle.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useFavorites.ts
│   ├── navigation/       # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── GateDetailsScreen.tsx
│   │   ├── CostCalculatorScreen.tsx
│   │   └── RouteFinderScreen.tsx
│   ├── theme/            # Theme context and configuration
│   │   └── ThemeContext.tsx
│   └── types/            # TypeScript type definitions
│       └── index.ts
├── assets/               # Images and static files
├── App.tsx              # Root component
├── babel.config.js      # Babel configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app on physical device)

### Installation

1. **Clone the repository**

   ```bash
   cd star-seeker-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```bash
   EXPO_PUBLIC_API_BASE_URL=https://hstc-api.testing.keyholding.com
   EXPO_PUBLIC_API_KEY=XXX
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Run on your platform**
   - iOS: Press `i` or run `npm run ios`
   - Android: Press `a` or run `npm run android`
   - Web: Press `w` or run `npm run web`

## 📚 Technologies Used

### Core Stack

- **React Native** (0.81.5) - Mobile framework
- **Expo** (~54.0.25) - Development platform
- **TypeScript** (~5.9.2) - Type safety

### Navigation

- **@react-navigation/native** - Navigation framework
- **@react-navigation/bottom-tabs** - Tab navigation
- **@react-navigation/stack** - Stack navigation

### Styling & Animations

- **NativeWind** - Tailwind CSS for React Native
- **react-native-reanimated** - Advanced animations
- **react-native-gesture-handler** - Gesture interactions

### State & Storage

- **@react-native-async-storage/async-storage** - Local storage
- **React Context API** - Theme state management

### Networking

- **Axios** - HTTP client for API requests

## 🎨 Themes

The app features two space-themed color schemes:

### Purple Space Theme (Default)

- Deep purple backgrounds (#0a0e27)
- Vibrant purple accents (#8b5cf6, #6366f1)
- Soft lavender text (#e9d5ff)

### Teal Space Theme

- Dark teal backgrounds (#0f1419)
- Bright teal accents (#14b8a6, #0d9488)
- Aqua text highlights (#ccfbf1)

Toggle between themes using the theme button in the Gates screen header.

## 🔌 API Integration

### Base URL

```
https://hstc-api.testing.keyholding.com/
```

### Endpoints Used

- `GET /gates` - Retrieve all hyperspace gates
- `GET /gates/{gateCode}` - Get specific gate details
- `GET /gates/{from}/to/{to}` - Calculate cheapest route
- `GET /transport/{distance}?passengers={n}&parking={days}` - Calculate transport cost

### Error Handling

- Network timeouts (10s)
- Retry mechanisms with user-friendly error messages
- Offline state awareness

## 🧪 Design Decisions

### State Management

- **Context API** for global theme state (simple, no external dependencies)
- **Component state** for screen-specific data (optimal performance)
- **AsyncStorage** for data persistence (favorites, theme preference)

### Animation Strategy

- **Reanimated 2** for smooth, native-thread animations
- Staggered list animations for visual polish
- Spring physics for natural-feeling interactions

### Navigation Pattern

- Bottom tab navigation for main sections (Gates, Calculator, Route Finder)
- Stack navigation for detail views (Gate Details)
- Type-safe navigation with TypeScript

### Code Organization

- Clear separation of concerns (API, UI, business logic)
- Custom hooks for reusable logic (useFavorites)
- TypeScript for type safety and better DX

## 🎯 Trade-offs

### Chosen Approach

- **NativeWind over Styled Components**: Better performance, familiar Tailwind syntax
- **Context API over Redux**: Simpler for small-scale state, no boilerplate
- **Tab Navigation over Drawer**: More mobile-friendly, better thumb reachability
- **AsyncStorage over SQLite**: Simpler for key-value storage, sufficient for favorites

### What I'd Add with More Time

- **Unit Tests**: Jest + React Native Testing Library
- **E2E Tests**: Detox for critical user flows
- **Advanced Caching**: React Query for server state management
- **Sentry Integration**: Production error tracking
- **Analytics**: Track user journeys and popular routes
- **Haptic Feedback**: Enhanced tactile responses
- **Share Routes**: Export/share route details
- **Gate Search**: Filter and search gates

## 📱 Performance Optimizations

- **FlatList** for efficient large list rendering
- **Animated components** run on native thread
- **Lazy loading** for route segments
- **Memoization** opportunities for expensive calculations
- **Image optimization** for assets

## 🔐 Security Notes

- API key is currently hardcoded (would use env variables in production)
- No sensitive user data stored
- AsyncStorage not encrypted (acceptable for non-sensitive favorites)

## 📖 Swagger Documentation

[Star Seeker API Docs](https://hstc-api.testing.keyholding.com/)

## 🤝 Contributing

This is an assessment project, but feedback and suggestions are welcome!

## 📄 License

This project is part of a technical assessment for Hyperspace Tunnelling Corp.

---

Built with ❤️ and ✨ by your future teammate

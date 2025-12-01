# Star Seeker - Interstellar Journey Planning App

A React Native mobile application for planning and costing interstellar journeys through hyperspace gates.

## Features

### Core Features

- **Gate Explorer**: Browse all hyperspace gates with optimized FlatList views
- **Gate Details**: View detailed information about each gate including spatial links
- **Cost Calculator**: Calculate journey costs based on distance, passengers, and parking days
- **Route Finder**: Find the cheapest route between two gates with detailed segment breakdown
- **Favourites**: Save and manage your favourite routes and gates for quick access

### Enhanced Features

- **Smart Caching**: TanStack React Query with AsyncStorage persistence for offline-first experience
- **Smooth Animations**: Powered by React Native Reanimated 4
- **Responsive UI**: Beautiful, mobile-first design with NativeWind (Tailwind CSS)
- **Pull to Refresh**: Refresh data with intuitive pull gesture
- **Offline Awareness**: Graceful error handling and offline-first query mode
- **Purple Space Theme**: Sleek dark theme with purple accents optimized for space aesthetics
- **Smart State Management**: Zustand stores for gates and routes state

## Architecture

### Feature-Based Modular Architecture with Atomic Design

The app follows a **feature-based modular architecture** where each feature is self-contained with its own API, components, screens, types, and state management. Components are organized using **Atomic Design principles** (atoms, molecules, organisms).

#### Architectural Benefits

- **Scalability**: Easy to add new features without affecting existing ones
- **Maintainability**: Clear boundaries and responsibilities for each module
- **Testability**: Features can be tested in isolation
- **Reusability**: Shared components are easily accessible and well-organized
- **Team Collaboration**: Multiple developers can work on different features simultaneously
- **Code Navigation**: Intuitive structure makes finding code straightforward

```
star-seeker-app/
├── src/
│   ├── app/                        # Application core
│   │   ├── App.tsx                # Root component
│   │   ├── navigation/            # Navigation configuration
│   │   │   └── AppNavigator.tsx   # Stack + Tab navigation
│   │   └── providers/             # App-level providers
│   │       └── AppProviders.tsx   # Query, Gesture, SafeArea providers
│   │
│   ├── features/                  # Feature modules
│   │   ├── cost/                  # Cost calculation feature
│   │   │   ├── api/               # Cost API endpoints
│   │   │   ├── components/        # Feature-specific components
│   │   │   ├── screens/           # CostCalculatorScreen
│   │   │   └── utils/             # Cost calculation utilities
│   │   │
│   │   ├── favourites/            # Favourites feature
│   │   │   ├── components/        # Favourite list items, cards
│   │   │   ├── screens/           # FavouritesScreen
│   │   │
│   │   ├── gates/                 # Gates feature
│   │   │   ├── api/               # Gates API endpoints
│   │   │   ├── components/        # Gate list, cards, details
│   │   │   ├── screens/           # GatesScreen, GateDetailsScreen
│   │   │   └── store/             # Zustand store for gates
│   │   │
│   │   └── routes/                # Route finder feature
│   │       ├── api/               # Routes API endpoints
│   │       ├── components/        # Route lists, segments, pickers
│   │       ├── screens/           # RouteFinderScreen
│   │       ├── store/             # Zustand store for routes
│   │
│   ├── shared/                    # Shared layer
│   │   ├── api/                   # API infrastructure
│   │   │   ├── apiClient.ts       # Axios client with interceptors
│   │   │   ├── queryClient.ts     # TanStack Query client
│   │   │   └── reactQueryNativeEvents.ts
│   │   ├── components/            # Atomic design components
│   │   │   ├── atoms/             # Button, IconBadge, LoadingSpinner
│   │   │   ├── molecules/         # ErrorState, FormInput, InfoRow
│   │   │   └── organisms/         # Complex composed components
│   │   └── utils/                 # Utility functions
│   │       └── asyncStorageUtils.ts
│   │
│   └── types/                     # Global TypeScript types
│       └── index.ts
│
├── assets/                        # Static assets
├── android/                       # Android native code
├── ios/                          # iOS native code
├── babel.config.js               # Babel configuration
├── tailwind.config.js            # NativeWind (Tailwind) config
└── tsconfig.json                 # TypeScript configuration
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** or **pnpm**
- **Expo CLI** (installed globally via `npm install -g expo-cli` or use npx)
- **iOS Simulator** (macOS only) or **Android Emulator** (Android Studio required)
- **Xcode** (macOS only, for iOS development)
- **Android Studio** (for Android development)
- Or **Expo Go app** on physical device for quick testing

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shumyla-farid/star-seeker-app.git
   cd star-seeker-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Set the required environment variables in `.env` file:

   ```bash
   EXPO_PUBLIC_API_BASE_URL=https://hstc-api.testing.keyholding.com
   EXPO_PUBLIC_API_KEY=your-api-key-here
   ```

   **Note**: The app will not start without these environment variables.

4. **Start the development server**

   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on your platform**
   - **iOS**: Press `i` in the terminal or run `npm run ios`
   - **Android**: Press `a` in the terminal or run `npm run android`
   - **Web**: Press `w` in the terminal or run `npm run web`
   - **Expo Go**: Scan the QR code with your phone

### Running Tests

The project includes Jest for unit testing:

```bash
npm test
```

Tests are located in `__tests__/` directory with the convention `*-test.tsx`.

### Building for Production

The project uses **EAS (Expo Application Services)** for building and deploying:

1. **Install EAS CLI**

   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**

   ```bash
   eas login
   ```

3. **Build for iOS**

   ```bash
   eas build --platform ios --profile production
   ```

4. **Build for Android**

   ```bash
   eas build --platform android --profile production
   ```

5. **Build Profiles**:
   - **development**: Development client with debugging tools
   - **preview**: Internal testing build
   - **production**: Production-ready build with auto-increment versioning

### Troubleshooting

- **Missing environment variables**: Ensure `EXPO_PUBLIC_API_BASE_URL` and `EXPO_PUBLIC_API_KEY` are set
- **iOS build fails**: Run `pod install` in the `ios/` directory
- **Android build fails**: Clean Gradle cache with `cd android && ./gradlew clean`
- **Metro bundler cache issues**: Run `npm start -- --reset-cache`
- **AsyncStorage errors**: Clear app data or reinstall the app

## Technologies Used

### Core Stack

- **React Native** - Mobile framework
- **React** - UI library
- **Expo** - Development platform
- **TypeScript** - Type safety

### Navigation

- **@react-navigation/native** - Navigation framework
- **@react-navigation/bottom-tabs** - Tab navigation
- **@react-navigation/stack** - Stack navigation
- **react-native-safe-area-context** - Safe area management

### Styling & Animations

- **NativeWind** - Tailwind CSS for React Native
- **TailwindCSS** - Utility-first CSS framework
- **react-native-reanimated** - Advanced animations (native thread)
- **react-native-gesture-handler** - Gesture interactions

### State Management

- **Zustand** - Lightweight state management
- **TanStack React Query** - Server state & data fetching
- **@tanstack/react-query-persist-client** - Query persistence
- **@react-native-async-storage/async-storage** - Local storage

### Networking & API

- **Axios** - HTTP client with interceptors
- **@react-native-community/netinfo** - Network status monitoring

### Performance

- **react-native-worklets** - JavaScript worklets for animations

### Development & Debugging

- **react-query-external-sync** - React Query DevTools sync
- **Jest** - Testing framework
- **@testing-library/react-native** - Component testing

## API Integration

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

## Design Decisions

### Architecture

- **Feature-based Modular Architecture**: Each feature (gates, cost, routes, favourites) is self-contained with its own API, components, screens, types, and stores
- **Atomic Design Principles**: Components organized as atoms, molecules, and organisms for maximum reusability
- **Shared Layer**: Common components and utilities accessible across all features

### State Management Strategy

- **TanStack React Query**: Server state management with automatic caching, background refetching, and persistence
- **Zustand**: Lightweight client state for favourite gates and routes powered by AsyncStorage
- **AsyncStorage Persistence**: Query cache persisted to AsyncStorage for offline-first experience

### Data Fetching & Caching

- **Offline-First Mode**: React Query configured with `networkMode: "offlineFirst"`
- **Smart Caching**: 30s stale time with automatic background revalidation
- **Retry Logic**: Automatic retry (2 attempts) for failed requests
- **Persisted Queries**: Cache survives app restarts for instant data availability

### Animation Strategy

- **Reanimated 4**: Latest version for smooth, native-thread animations
- **Worklets**: JavaScript worklets for performant animation logic

### Navigation Pattern

- **Bottom Tab Navigation**: Four main sections (Gates, Calculator, Route Finder, Favourites)
- **Stack Navigation**: Root Stack (Tabs and Gate Details)
- **Type-safe Navigation**: Full TypeScript support with typed param lists
- **Safe Area Handling**: Proper inset handling for notches and home indicators

### Performance Optimizations

- **FlatList**: Better optimization than ScrollView
- **Memoization**: Strategic use of React.memo, useCallback and useMemo for expensive components, methods and values
- **Native Thread Animations**: All animations run on native thread via Reanimated
- **Query Deduplication**: React Query prevents duplicate network requests
- **Worklets**: Animation logic runs in JavaScript worklets for 60fps
- **Smart Caching**: 30s stale time reduces unnecessary network requests
- **Persisted Cache**: Query results cached in AsyncStorage for instant app startup
- **Offline-First**: Network requests don't block UI, graceful degradation

### Code Organization

- **Feature Isolation**: Each feature is independently testable and maintainable
- **Typed Everything**: Strict TypeScript for type safety and superior DX
- **Custom Hooks**: Reusable logic extracted (useGateStore and useRouteStore for AsyncStorage operations)
- **API Layer Separation**: Axios client with interceptors, separate from business logic

### Chosen Approaches

- **TanStack Query over Redux Toolkit**: Built-in caching, automatic refetching, and persistence.
- **Zustand over Redux**: Minimal boilerplate, no provider hell, simpler API for client state
- **NativeWind over Styled Components**: Better performance, familiar Tailwind syntax, smaller bundle
- **Feature-based over Layer-based**: Better scalability, easier to understand domain boundaries
- **Atomic Design**: Enforces component reusability and consistency across features
- **Tab Navigation over Drawer**: More mobile-friendly, better thumb reachability for one-handed use
- **AsyncStorage Persistence**: Simple key-value storage sufficient for query cache and favorites

### What I'd Add with More Time

- **Performance Optimization**:

  - **FlashList over FlatList**: 10x performance improvement for large lists with minimal API changes
  - **MMKV**: MMKV is usually 10–100× faster than AsyncStorage
  - **Lazy Loading**: Loading resources when they are required

- **Comprehensive Testing**:
  - Unit tests with Jest + React Native Testing Library
  - Integration tests for critical flows
  - E2E tests with Detox or Maestro
  - Snapshot tests for UI consistency
- **Production Readiness**:
  - Sentry integration for error tracking and performance monitoring
  - Analytics (Customer.io or Amplitude) for user behavior insights
  - Feature flags for gradual rollouts
  - A/B testing framework
- **Enhanced Features**:
  - Gate search and filtering
  - Route comparison (side-by-side view)
  - Share routes via deep links
  - Offline mode with full functionality (Mutation)
- **UX Enhancements**:
  - Haptic feedback for interactions
  - Skeleton loaders for better perceived performance
  - Animated transitions between screens
  - Dark/light theme toggle
  - Accessibility audit and improvements (screen reader, font scaling)
- **Developer Experience**:
  - Storybook for component documentation
  - Husky pre-commit hooks for linting/formatting
  - CI/CD pipeline (GitHub Actions)
  - Automated release process with semantic versioning using Fastlane
  - Improved validation using libraries like Zod, Joi etc

## API Documentation

[Star Seeker API Docs](https://app.swaggerhub.com/apis-docs/TheKeyholdingCompany/HSTC/)

## Contributing

This is an assessment project, but feedback and suggestions are welcome!

## 📄 License

This project is part of a technical assessment for Hyperspace Tunnelling Corp.

---

**Built with ❤️ and ✨ for exploring the cosmos**

_Star Seeker - Your gateway to the galaxy_

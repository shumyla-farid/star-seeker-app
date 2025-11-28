# 🚀 Quick Setup Guide

## Prerequisites
- Node.js v14+ installed
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator or Expo Go app

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm start
```

### 3. Run the App

#### On iOS (Mac only)
```bash
npm run ios
```
Or press `i` in the terminal after `npm start`

#### On Android
```bash
npm run android
```
Or press `a` in the terminal after `npm start`

#### On Physical Device
1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in terminal after `npm start`

### 4. Try the Features

1. **Browse Gates**: See the list of all hyperspace gates with animations
2. **Theme Toggle**: Tap the theme button (top of Gates screen) to switch between Purple and Teal themes
3. **Gate Details**: Tap any gate to see detailed information
4. **Cost Calculator**: Navigate to Calculator tab, enter distance, passengers, and parking days
5. **Route Finder**: Navigate to Route Finder tab, select start and destination gates

## Troubleshooting

### Metro Bundler Cache Issues
```bash
npm start -- --clear
```

### iOS Simulator Not Opening
```bash
npx expo run:ios
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Missing Dependencies
```bash
rm -rf node_modules
npm install
```

### NativeWind Not Working
Make sure you clear cache and restart:
```bash
npm start -- --clear
```

## Project Structure Overview

```
src/
├── api/              # API layer (Axios client, endpoints)
├── components/       # Reusable components
├── hooks/            # Custom hooks (useFavorites)
├── navigation/       # Navigation setup
├── screens/          # Screen components
├── theme/            # Theme context
└── types/            # TypeScript types
```

## Key Libraries

- **React Native Reanimated**: Smooth animations
- **React Native Gesture Handler**: Touch interactions
- **NativeWind**: Tailwind CSS styling
- **React Navigation**: Navigation
- **AsyncStorage**: Data persistence
- **Axios**: API requests

## Next Steps

- Explore the code structure in `src/`
- Modify colors in `tailwind.config.js`
- Add new screens in `src/screens/`
- Try adding unit tests with Jest

Happy coding! 🌟


# FarmFlow Mobile App

A React Native mobile application built with Expo for farm management.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (comes with Node.js)
- Expo CLI (will be installed locally)
- iOS Simulator (for Mac users) or Android Studio (for Android development)
- Expo Go app on your mobile device (optional, for testing on real devices)

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd farmflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

## Running the App

After starting the development server, you have several options:

### On Mobile Device
1. Install the Expo Go app from your device's app store
2. Scan the QR code displayed in the terminal with:
   - Android: Expo Go app
   - iOS: Camera app

### On Simulator/Emulator
- Press 'i' to open in iOS simulator (Mac only)
- Press 'a' to open in Android emulator

### On Web
- Press 'w' to open in web browser

## Development Commands

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android emulator
- `npm run ios` - Start the app on iOS simulator
- `npm run web` - Start the app in web browser
- `npm test` - Run tests
- `npm run lint` - Run linter

## Project Structure

```
farmflow/
├── assets/           # Images, fonts, and other static assets
├── components/       # Reusable React components
├── screens/          # Screen components
├── navigation/       # Navigation configuration
├── services/         # API and other services
├── store/            # Redux store configuration
└── utils/            # Utility functions
```

## Dependencies

This project uses:
- Expo SDK 52
- React Native
- React Navigation
- Redux Toolkit
- Native Base UI
- And other essential React Native libraries

## Troubleshooting

If you encounter any issues:

1. **Clear npm cache**
   ```bash
   npm cache clean --force
   ```

2. **Reinstall dependencies**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Reset Metro bundler cache**
   ```bash
   npx expo start --clear
   ```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[Your License Here]

// The app uses the following test credentials:
// Email: patient@yahoo.com
// Password: password123

import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#aaaaaa" />
      <AppNavigator />
    </>
  );
} 
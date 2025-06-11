import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { TestAlarmsScreen } from '../screens/TestAlarmsScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="TestAlarms" 
          component={TestAlarmsScreen}
          options={{ title: 'Test Alarms' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 
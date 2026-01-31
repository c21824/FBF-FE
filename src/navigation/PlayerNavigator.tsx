import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/player/HomeScreen';
import { FieldListScreen } from '../screens/player/FieldListScreen';
import { FieldDetailScreen } from '../screens/player/FieldDetailScreen';
import { BookingScreen } from '../screens/player/BookingScreen';
import { ProfileScreen } from '../screens/player/ProfileScreen';

const Stack = createStackNavigator();

export const PlayerNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FieldList" component={FieldListScreen} />
      <Stack.Screen name="FieldDetail" component={FieldDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

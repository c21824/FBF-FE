import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DashboardScreen } from '../screens/owner/DashboardScreen';
import { ManageFieldsScreen } from '../screens/owner/ManageFieldsScreen';
import { ManageBookingsScreen } from '../screens/owner/ManageBookingsScreen';

const Stack = createStackNavigator();

export const OwnerNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ManageFields" component={ManageFieldsScreen} />
      <Stack.Screen name="ManageBookings" component={ManageBookingsScreen} />
    </Stack.Navigator>
  );
};

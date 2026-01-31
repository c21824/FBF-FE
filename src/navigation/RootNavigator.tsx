import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './AuthNavigator';
import { PlayerNavigator } from './PlayerNavigator';
import { OwnerNavigator } from './OwnerNavigator';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  // TODO: Add authentication logic to switch between Auth and Main stacks
  const isAuthenticated = false;
  const userRole: 'player' | 'owner' | null = null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : userRole === 'player' ? (
        <Stack.Screen name="Player" component={PlayerNavigator} />
      ) : (
        <Stack.Screen name="Owner" component={OwnerNavigator} />
      )}
    </Stack.Navigator>
  );
};

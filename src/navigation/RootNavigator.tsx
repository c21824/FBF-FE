import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './AuthNavigator';
import { PlayerNavigator } from './PlayerNavigator';
import { OwnerNavigator } from './OwnerNavigator';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : user?.role === 'player' ? (
        <Stack.Screen name="Player" component={PlayerNavigator} />
      ) : (
        <Stack.Screen name="Owner" component={OwnerNavigator} />
      )}
    </Stack.Navigator>
  );
};

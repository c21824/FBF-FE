import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DashboardScreen } from '../screens/owner/DashboardScreen';
import { ManageFieldsScreen } from '../screens/owner/ManageFieldsScreen';
import { ManageBookingsScreen } from '../screens/owner/ManageBookingsScreen';
import { AddClusterScreen } from '../screens/owner/AddClusterScreen';
import { AddFieldScreen } from '../screens/owner/AddFieldScreen';
import { ManageServicesScreen } from '../screens/owner/ManageServicesScreen';
import { OwnerClusterDetailScreen } from '../screens/owner/OwnerClusterDetailScreen';
import { StaffScheduleScreen } from '../screens/owner/StaffScheduleScreen';

const Stack = createStackNavigator();

export const OwnerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ManageFields" component={ManageFieldsScreen} />
      <Stack.Screen name="OwnerClusterDetail" component={OwnerClusterDetailScreen} />
      <Stack.Screen name="ManageBookings" component={ManageBookingsScreen} />
      <Stack.Screen name="AddCluster" component={AddClusterScreen} />
      <Stack.Screen name="AddField" component={AddFieldScreen} />
      <Stack.Screen name="ManageServices" component={ManageServicesScreen} />
      <Stack.Screen name="StaffSchedule" component={StaffScheduleScreen} />
    </Stack.Navigator>
  );
};

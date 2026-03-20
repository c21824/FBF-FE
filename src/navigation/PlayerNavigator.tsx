import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/player/HomeScreen';
import { FieldListScreen } from '../screens/player/FieldListScreen';
import { ProfileScreen } from '../screens/player/ProfileScreen';
import { PersonalInfoScreen } from '../screens/player/PersonalInfoScreen';
import { EditProfileScreen } from '../screens/player/EditProfileScreen';
import { ClusterDetailScreen } from '../screens/player/ClusterDetailScreen';
import { BookingScreen } from '../screens/player/BookingScreen';
import { PaymentScreen } from '../screens/player/PaymentScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const FieldListStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const RootStack = createStackNavigator();

// Stack riêng cho tab "Cụm sân" — giữ tab bar khi vào ClusterDetail
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="ClusterDetail" component={ClusterDetailScreen} />
      <HomeStack.Screen name="Booking" component={BookingScreen} />
      <HomeStack.Screen name="Payment" component={PaymentScreen} />
    </HomeStack.Navigator>
  );
};

// Stack riêng cho tab "Tất cả sân" — giữ tab bar khi vào Booking / Payment
const FieldListStackNavigator = () => {
  return (
    <FieldListStack.Navigator screenOptions={{ headerShown: false }}>
      <FieldListStack.Screen name="FieldListMain" component={FieldListScreen} />
      <FieldListStack.Screen name="BookingFromList" component={BookingScreen} />
      <FieldListStack.Screen name="Payment" component={PaymentScreen} />
    </FieldListStack.Navigator>
  );
};

// Stack riêng cho tab "Hồ sơ" — giữ tab bar khi vào PersonalInfo / EditProfile
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
};

const PlayerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Cụm sân',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FieldList"
        component={FieldListStackNavigator}
        options={{
          tabBarLabel: 'Tất cả sân',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="football" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Hồ sơ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const PlayerNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="PlayerTabs" component={PlayerTabs} />
    </RootStack.Navigator>
  );
};

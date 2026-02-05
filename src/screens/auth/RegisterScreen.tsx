import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Typography } from '../../components/Typography';
import { CustomInput } from '../../components/CustomInput';
import { SocialLoginButtons } from '../../components/SocialLoginButtons';

export const RegisterScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // TODO: Implement registration logic
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    console.log('Register with:', { username, email, contactNumber, password });
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>
            Sign-Up
          </Typography>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <CustomInput
            icon="person-outline"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <CustomInput
            icon="mail-outline"
            placeholder="Email Id"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            icon="call-outline"
            placeholder="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />

          <CustomInput
            icon="lock-closed-outline"
            placeholder="New Password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <CustomInput
            icon="lock-closed-outline"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
          />

          <PrimaryButton
            title="Sign-Up"
            onPress={handleRegister}
            style={styles.registerButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.loginPrompt}>
            <Text style={styles.footerText}>Didn't Have Account? </Text>
            <TouchableOpacity onPress={handleNavigateToLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Social Login */}
          <SocialLoginButtons containerMarginTop={16} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  form: {
    marginBottom: 24,
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    marginTop: 16,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
});

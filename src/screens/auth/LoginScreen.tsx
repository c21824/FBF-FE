import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Typography } from '../../components/Typography';
import { CustomInput } from '../../components/CustomInput';
import { SocialLoginButtons } from '../../components/SocialLoginButtons';

export const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log('Login with:', username, password);
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password
    console.log('Forgot password');
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
            Login
          </Typography>
          <Typography variant="subtitle" style={styles.subtitle}>
            Have Fun with Friends!
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
            icon="lock-closed-outline"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <PrimaryButton
            title="Login"
            onPress={handleLogin}
            style={styles.loginButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.signupPrompt}>
            <Text style={styles.footerText}>Didn't Have Account? </Text>
            <TouchableOpacity onPress={handleNavigateToRegister}>
              <Text style={styles.signupLink}>Sign Up</Text>
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
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 8,
    color: '#1F2937',
    fontWeight: '600',
  },
  form: {
    marginBottom: 32,
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 8,
  },
  footer: {
    marginTop: 16,
  },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signupLink: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
});

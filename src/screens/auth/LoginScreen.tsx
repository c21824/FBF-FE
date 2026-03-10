import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Typography } from '../../components/Typography';
import { CustomInput } from '../../components/CustomInput';
import { SocialLoginButtons } from '../../components/SocialLoginButtons';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (!success) {
      Alert.alert(
        'Login Failed', 
        'Email or password is incorrect.\n\nDemo accounts:\n• player@test.com / 123456\n• owner@test.com / 123456'
      );
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Feature coming soon');
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
            Welcome Back! ⚽
          </Typography>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <CustomInput
            icon="mail-outline"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
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
            title={loading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            style={styles.loginButton}
            disabled={loading}
          />

          {loading && (
            <ActivityIndicator 
              size="small" 
              color="#10B981" 
              style={styles.loader}
            />
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.signupPrompt}>
            <Text style={styles.footerText}>Don't have an account? </Text>
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
  loader: {
    marginTop: 12,
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

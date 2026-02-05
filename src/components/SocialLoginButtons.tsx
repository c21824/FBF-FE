import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

interface SocialLoginButtonsProps {
  style?: ViewStyle;
  containerMarginTop?: number;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ 
  style,
  containerMarginTop = 24 
}) => {
  const handleFacebookLogin = () => {
    // TODO: Implement Facebook login
    console.log('Facebook login');
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    console.log('Google login');
  };

  return (
    <View style={[styles.container, { marginTop: containerMarginTop }, style]}>
      <Text style={styles.title}>Others Ways to sing-in</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={handleFacebookLogin}
          activeOpacity={0.7}
        >
          <FontAwesome name="facebook" size={28} color="#1877F2" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.socialButton}
          onPress={handleGoogleLogin}
          activeOpacity={0.7}
        >
          <Ionicons name="logo-google" size={28} color="#DB4437" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});

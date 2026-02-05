import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'subtitle' | 'body';
  style?: TextStyle;
  color?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  style,
  color,
}) => {
  return (
    <Text style={[styles[variant], color && { color }, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10B981', // emerald-500
    textAlign: 'center',
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10B981', // emerald-500
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937', // gray-800
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    color: '#4B5563', // gray-600
  },
});

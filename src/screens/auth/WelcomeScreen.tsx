import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Typography } from '../../components/Typography';

export const WelcomeScreen = ({ navigation }: any) => {
  const handleGetStarted = () => {
    // TODO: Navigate to Login screen
    navigation.navigate('Login');
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Typography variant="h1" style={styles.title}>
            GEAR UP
          </Typography>
          <Typography variant="h2" style={styles.subtitle}>
            A BIG GAME
          </Typography>
          <Typography variant="subtitle" style={styles.tagline}>
            Have Fun with Friends!
          </Typography>
        </View>

        {/* Illustration Section */}
        <View style={styles.illustrationContainer}>
          {/* Hình ảnh cầu thủ bóng đá */}
          <Image
            source={require('../../../assets/football-player.jpg')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Button Section */}
        <View style={styles.buttonSection}>
          <PrimaryButton
            title="Get Started"
            onPress={handleGetStarted}
            style={styles.button}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  headerSection: {
    marginTop: 20,
  },
  title: {
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  tagline: {
    marginTop: 8,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  illustration: {
    width: '100%',
    height: 300,
    maxWidth: 280,
  },
  placeholderIllustration: {
    width: 280,
    height: 300,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
  },
  placeholderText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  buttonSection: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
});

import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/styles';

export default function WelcomeScreen({ onGetStarted }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollPad}>
      {/* HERO */}
      <View style={styles.welcomeHero}>
        <View style={styles.welcomeLogoLock}>
          <Text style={{ fontSize: 44 }}> 🔒 </Text>
        </View>
        <Text style={styles.welcomeTitle}>
          WELCOME TO LOCKED <Text style={{ color: '#ff3b30' }}> IN </Text>
        </Text>
        <Text style={styles.welcomeSlogan}>
          FOCUS.{' '}
          <Text style={{ color: '#ff3b30' }}> REST. </Text>{' '}
          DISCONNECT.
        </Text>
      </View>

      {/* SET YOUR TIMER */}
      <View style={styles.pillarsRow}>
        <TouchableOpacity
          style={styles.pillarBox}
          onPress={onGetStarted}
          activeOpacity={0.7}
        >
          <Text style={styles.pillarIcon}> ⏳ </Text>
          <Text style={styles.pillarText}> SET YOUR TIMER </Text>
        </TouchableOpacity>
      </View>

      {/* GET STARTED */}
      <View style={{ marginVertical: 20 }}>
        <TouchableOpacity
          style={styles.welcomePrimaryBtn}
          onPress={onGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.welcomePrimaryBtnText}> GET STARTED </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerTagline}> YOUR PHONE. YOUR RULES. </Text>
    </ScrollView>
  );
}
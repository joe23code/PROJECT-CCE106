import React from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/styles';

export default function Header({ onSettings }) {

  const handleStreak = () => {
    Alert.alert(
      '🔥 5 Day Streak',
      'You have maintained your focus streak for 5 consecutive days.',
      [
        {
          text: 'KEEP GOING',
        },
      ]
    );
  };

  return (
    <View style={styles.topHeader}>

      <View style={styles.brandRow}>

        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>
            🔒
          </Text>
        </View>

        <View>
          <Text style={styles.brandTitle}>
            LOCKED
            <Text style={styles.brandAccent}>
              IN
            </Text>
          </Text>

          <Text style={styles.brandSub}>
            FOCUS DISCIPLINE
          </Text>
        </View>

      </View>

      <View style={styles.headerRight}>

        {/* STREAK */}
        <TouchableOpacity
          style={styles.streakPill}
          onPress={handleStreak}
          activeOpacity={0.7}
        >
          <Text style={styles.streakText}>
            🔥 5D
          </Text>
        </TouchableOpacity>

        {/* SETTINGS */}
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={onSettings}
          activeOpacity={0.7}
        >
          <Text style={styles.headerIcon}>
            ⚙️
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}
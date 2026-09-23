import React from 'react';
import { ScrollView } from 'react-native';

import Timer from '../components/Timer';
import styles from '../styles/styles';

export default function FocusScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollPad}
      showsVerticalScrollIndicator={false}
    >
      <Timer />
    </ScrollView>
  );
}
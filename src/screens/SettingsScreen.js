import React from 'react';
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/styles';

function Setting({
  label,
  desc,
  value,
  onChange,
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingTextCol}>
        <Text style={styles.settingLabel}>
          {label}
        </Text>

        <Text style={styles.settingDesc}>
          {desc}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: '#3f3f46',
          true: '#22c55e',
        }}
        thumbColor="#ffffff"
      />
    </View>
  );
}

export default function SettingsScreen(props) {

  const saveChanges = () => {
    Alert.alert(
      'Settings Saved',
      'Your LOCKEDIN settings have been updated.'
    );
  };

  const editContact = () => {
    Alert.alert(
      'Emergency Contact',
      'Emergency contact editing will be available here.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Edit',
          onPress: () =>
            Alert.alert(
              'Edit Contact',
              'Contact editing will be available here.'
            ),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollPad}>

      <Text style={styles.settingsTitleHeader}>
        SETTINGS
      </Text>

      {/* THEME */}
      <View style={styles.settingsGroup}>
        <Text style={styles.groupHeading}>
          THEME
        </Text>

        <Setting
          label="Dark / Light Mode"
          desc={
            props.darkMode
              ? 'Dark Mode (Active)'
              : 'Light Mode'
          }
          value={props.darkMode}
          onChange={props.setDarkMode}
        />
      </View>

      {/* NOTIFICATIONS */}
      <View style={styles.settingsGroup}>
        <Text style={styles.groupHeading}>
          NOTIFICATIONS
        </Text>

        <Setting
          label="Session Reminders"
          desc="Notify 5 min before scheduled study"
          value={props.sessionReminders}
          onChange={props.setSessionReminders}
        />

        <Setting
          label="Streak Alerts"
          desc="Alert before streak resets at midnight"
          value={props.streakAlerts}
          onChange={props.setStreakAlerts}
        />
      </View>

      {/* CONTACT */}
      <View style={styles.settingsGroup}>
        <Text style={styles.groupHeading}>
          EMERGENCY CONTACTS
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>
              Marcus Lee (Primary Guardian)
            </Text>

            <Text style={styles.settingDesc}>
              Enclave Validated
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addContactBtn}
            onPress={editContact}
            activeOpacity={0.7}
          >
            <Text style={styles.addContactBtnText}>
              EDIT
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SAFE MODE */}
      <View style={styles.settingsGroup}>
        <Text style={styles.groupHeading}>
          SAFE MODE
        </Text>

        <Setting
          label="Enable Safe Mode"
          desc="Prevents app uninstallation while locked"
          value={props.safeMode}
          onChange={props.setSafeMode}
        />
      </View>

      {/* SAVE */}
      <TouchableOpacity
        style={styles.greenSaveBtn}
        onPress={saveChanges}
        activeOpacity={0.8}
      >
        <Text style={styles.greenSaveBtnText}>
          + SAVE CHANGES
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
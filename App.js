import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';

import Header from './src/components/Header';
import BottomNav from './src/components/BottomNav';

import WelcomeScreen from './src/screens/WelcomeScreen';
import FocusScreen from './src/screens/FocusScreen';
import FocusList from './src/screens/FocusList';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import FocusJournalScreen from './src/screens/FocusJournalScreen';

import styles from './src/styles/styles';

export default function App() {
  // ACTIVE NAVIGATION TAB
  const [activeTab, setActiveTab] = useState('settings');

  // SETTINGS STATE
  const [darkMode, setDarkMode] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [safeMode, setSafeMode] = useState(true);

  // NAVIGATION HANDLERS
  const goToWelcome = () => setActiveTab('welcome');
  const goToFocus = () => setActiveTab('focus');
  const goToList = () => setActiveTab('list');
  const goToJournal = () => setActiveTab('journal');
  const goToProfile = () => setActiveTab('profile');
  const goToSettings = () => setActiveTab('settings');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // LIGHT/DARK CONTAINER OVERRIDE
  const themeContainerStyle = {
    flex: 1,
    backgroundColor: darkMode ? '#0d0e12' : '#f4f4f6',
  };

  return (
    <SafeAreaView style={[styles.container, themeContainerStyle]}>

      {/* STATUS BAR */}
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={darkMode ? '#0d0e12' : '#f4f4f6'}
      />

      {/* HEADER */}
      <Header
        onSettings={goToSettings}
        darkMode={darkMode}
      />

      {/* MAIN SCREEN CONTAINER */}
      <View style={[styles.screenContainer, themeContainerStyle]}>

        {/* WELCOME */}
        {activeTab === 'welcome' && (
          <WelcomeScreen
            onGetStarted={goToFocus}
            onOpenJournal={goToJournal}
            darkMode={darkMode}
          />
        )}

        {/* FOCUS */}
        {activeTab === 'focus' && (
          <FocusScreen darkMode={darkMode} />
        )}

        {/* WHITELIST / FOCUS LIST */}
        {activeTab === 'list' && (
          <FocusList darkMode={darkMode} />
        )}

        {/* JOURNAL */}
        {activeTab === 'journal' && (
          <FocusJournalScreen
            onBack={goToWelcome}
            darkMode={darkMode}
          />
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <ProfileScreen
            onStartFocus={goToFocus}
            darkMode={darkMode}
          />
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsScreen
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            sessionReminders={sessionReminders}
            setSessionReminders={setSessionReminders}
            streakAlerts={streakAlerts}
            setStreakAlerts={setStreakAlerts}
            safeMode={safeMode}
            setSafeMode={setSafeMode}
          />
        )}

      </View>

      {/* BOTTOM NAVIGATION */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        darkMode={darkMode}
      />

    </SafeAreaView>
  );
}
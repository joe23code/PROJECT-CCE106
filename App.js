import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, StatusBar, View } from 'react-native';
import Header from './src/components/Header';
import BottomNav from './src/components/BottomNav';
import WelcomeScreen from './src/screens/WelcomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import FocusScreen from './src/screens/FocusScreen';
import EmergencyContactsScreen from './src/screens/EmergencyContactsScreen';
import FocusJournalScreen from './src/screens/FocusJournalScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { makeTheme } from './src/theme';
import { DEFAULT_TEMPLATES } from './src/utils/sessionStats';

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [account, setAccount] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [motivation, setMotivation] = useState('Small steps today create a stronger tomorrow.');
  const [journalEntries, setJournalEntries] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Marcus Lee', phone: '0917 555 0148', relationship: 'Primary contact' }
  ]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('lockedin-state')
      .then(value => {
        if (value) {
          const saved = JSON.parse(value);
          setAccount(saved.account || null);
          setDarkMode(saved.darkMode ?? true);
          setMotivation(saved.motivation || 'Small steps today create a stronger tomorrow.');
          setJournalEntries(saved.journalEntries || []);
          setContacts(saved.contacts || []);
          setSessions(saved.sessions || []);
          setTemplates(saved.templates?.length ? [...DEFAULT_TEMPLATES.filter(d => !saved.templates.some(s => s.id === d.id)), ...saved.templates] : DEFAULT_TEMPLATES);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(
      'lockedin-state',
      JSON.stringify({ account, darkMode, motivation, journalEntries, contacts, sessions, templates })
    );
  }, [loaded, account, darkMode, motivation, journalEntries, contacts, sessions, templates]);

  const enterApp = user => {
    setAccount(user);
    setScreen('home');
  };

  const logOut = () => {
    setAccount(null);
    setSessionActive(false);
    setScreen('auth');
  };

  const theme = makeTheme(darkMode);

  if (!loaded) return <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} />;

  if (screen === 'welcome') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <WelcomeScreen theme={theme} onStart={() => setScreen('auth')} />
      </SafeAreaView>
    );
  }

  if (screen === 'auth') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <AuthScreen theme={theme} onComplete={enterApp} onBack={() => setScreen('welcome')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      {!sessionActive && <Header theme={theme} onSettings={() => setScreen('settings')} />}
      <View style={{ flex: 1 }}>
        {screen === 'home' && (
          <HomeScreen theme={theme} name={account?.name || 'Member'} motivation={motivation} sessions={sessions} onNavigate={setScreen} />
        )}
        {screen === 'focus' && (
          <FocusScreen
            theme={theme}
            active={sessionActive}
            setActive={setSessionActive}
            contacts={contacts}
            sessions={sessions}
            setSessions={setSessions}
            templates={templates}
            setTemplates={setTemplates}
            journalEntries={journalEntries}
            setJournalEntries={setJournalEntries}
          />
        )}
        {screen === 'contacts' && (
          <EmergencyContactsScreen theme={theme} contacts={contacts} setContacts={setContacts} />
        )}
        {screen === 'journal' && (
          <FocusJournalScreen theme={theme} entries={journalEntries} setEntries={setJournalEntries} />
        )}
        {screen === 'profile' && (
          <ProfileScreen
            theme={theme}
            account={account}
            setAccount={setAccount}
            sessions={sessions}
            motivation={motivation}
            setMotivation={setMotivation}
            onStartFocus={() => setScreen('focus')}
            onLogOut={logOut}
          />
        )}
        {screen === 'settings' && (
          <SettingsScreen
            theme={theme}
            account={account}
            setAccount={setAccount}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onLogOut={logOut}
          />
        )}
      </View>
      {!sessionActive && <BottomNav activeTab={screen} setActiveTab={setScreen} theme={theme} />}
    </SafeAreaView>
  );
}

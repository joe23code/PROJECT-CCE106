import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Switch,
  TouchableOpacity,
  Modal,
} from 'react-native';
import styles from '../styles/styles';

const INITIAL_APPS = [
  // Essentials
  { id: '1', name: 'Phone', category: 'Essentials', icon: '📞', whitelisted: true },
  { id: '2', name: 'Messages', category: 'Essentials', icon: '💬', whitelisted: true },
  { id: '3', name: 'Clock & Alarm', category: 'Essentials', icon: '⏰', whitelisted: true },
  
  // Productivity & Utilities
  { id: '4', name: 'Notion', category: 'Productivity & Utilities', icon: '📝', whitelisted: false },
  { id: '5', name: 'Calculator', category: 'Productivity & Utilities', icon: '🔢', whitelisted: true },
  { id: '6', name: 'Calendar', category: 'Productivity & Utilities', icon: '📅', whitelisted: false },

  // Communication
  { id: '7', name: 'Slack', category: 'Communication', icon: '💼', whitelisted: false },
  { id: '8', name: 'Gmail', category: 'Communication', icon: '✉️', whitelisted: false },

  // Media & Audio
  { id: '9', name: 'Spotify', category: 'Media & Audio', icon: '🎵', whitelisted: false },
  { id: '10', name: 'Podcasts', category: 'Media & Audio', icon: '🎙️', whitelisted: false },
];

const INITIAL_DOMAINS = [
  { id: 'w1', url: 'github.com', enabled: true },
  { id: 'w2', url: 'wikipedia.org', enabled: true },
  { id: 'w3', url: 'stackoverflow.com', enabled: false },
];

export default function FocusList() {
  const [apps, setApps] = useState(INITIAL_APPS);
  const [domains, setDomains] = useState(INITIAL_DOMAINS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreset, setActivePreset] = useState('Custom');
  const [blockAllWeb, setBlockAllWeb] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppCategory, setNewAppCategory] = useState('Productivity & Utilities');

  // Toggle single app
  const toggleApp = (id) => {
    setActivePreset('Custom');
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, whitelisted: !app.whitelisted } : app
      )
    );
  };

  // Toggle web domain
  const toggleDomain = (id) => {
    setDomains((prev) =>
      prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d))
    );
  };

  // Preset Handlers
  const applyPreset = (presetName) => {
    setActivePreset(presetName);
    setApps((prev) =>
      prev.map((app) => {
        if (presetName === 'Strict') {
          return { ...app, whitelisted: app.category === 'Essentials' };
        }
        if (presetName === 'Work') {
          return {
            ...app,
            whitelisted: ['Essentials', 'Productivity & Utilities', 'Communication'].includes(app.category),
          };
        }
        if (presetName === 'Audio') {
          return {
            ...app,
            whitelisted: ['Essentials', 'Media & Audio'].includes(app.category),
          };
        }
        return app;
      })
    );
  };

  // Add custom app handler
  const handleAddApp = () => {
    if (!newAppName.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      name: newAppName.trim(),
      category: newAppCategory,
      icon: '📱',
      whitelisted: true,
    };
    setApps((prev) => [...prev, newEntry]);
    setNewAppName('');
    setModalVisible(false);
  };

  // Filter apps by search
  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = apps.filter((app) => app.whitelisted).length;
  const categories = ['Essentials', 'Productivity & Utilities', 'Communication', 'Media & Audio'];

  return (
    <ScrollView contentContainerStyle={styles.scrollPad}>
      {/* 1. HEADER TITLE & STATUS BANNER */}
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.welcomeTitle}>ALLOWED APPS</Text>
        <Text style={styles.welcomeSlogan}>WHITELIST & PERMISSIONS</Text>
      </View>

      <View
        style={{
          backgroundColor: '#1E1E1E',
          borderColor: '#FF3B30',
          borderLeftWidth: 4,
          padding: 14,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>
          🛡️ {activeCount} OF {apps.length} APPS PERMITTED
        </Text>
        <Text style={{ color: '#888888', fontSize: 12, marginTop: 4 }}>
          Emergency calls and system alarms remain accessible.
        </Text>
      </View>

      {/* 2. PRESET SELECTION */}
      <Text style={{ color: '#888888', fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
        PRESET PROFILES
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
        {['Strict', 'Work', 'Audio'].map((preset) => (
          <TouchableOpacity
            key={preset}
            style={{
              flex: 1,
              paddingVertical: 10,
              backgroundColor: activePreset === preset ? '#FF3B30' : '#2A2A2A',
              borderRadius: 6,
              alignItems: 'center',
            }}
            onPress={() => applyPreset(preset)}
          >
            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>
              {preset.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. SEARCH & ADD BAR */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: '#1E1E1E',
            color: '#FFFFFF',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#333333',
            fontSize: 14,
          }}
          placeholder="Search apps or categories..."
          placeholderTextColor="#888888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#2A2A2A',
            paddingHorizontal: 16,
            justifyContent: 'center',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#333333',
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 4. CATEGORIZED APP LIST */}
      {categories.map((cat) => {
        const catApps = filteredApps.filter((a) => a.category === cat);
        if (catApps.length === 0) return null;

        return (
          <View key={cat} style={{ marginBottom: 20 }}>
            <Text style={{ color: '#FF3B30', fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>
              {cat.toUpperCase()}
            </Text>
            <View style={{ gap: 8 }}>
              {catApps.map((app) => (
                <View
                  key={app.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#1A1A1A',
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#2C2C2C',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 22 }}>{app.icon}</Text>
                    <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 }}>
                      {app.name}
                    </Text>
                  </View>
                  <Switch
                    value={app.whitelisted}
                    onValueChange={() => toggleApp(app.id)}
                    trackColor={{ false: '#333333', true: '#FF3B30' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              ))}
            </View>
          </View>
        );
      })}

      {/* 5. ALLOWED WEB DOMAINS */}
      <View style={{ marginTop: 10, marginBottom: 20 }}>
        <Text style={{ color: '#FF3B30', fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>
          WEB SHIELD (ALLOWED DOMAINS)
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#1A1A1A',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: '#2C2C2C',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 }}>
            BLOCK ALL WEB BROWSING
          </Text>
          <Switch
            value={blockAllWeb}
            onValueChange={setBlockAllWeb}
            trackColor={{ false: '#333333', true: '#FF3B30' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {!blockAllWeb && (
          <View style={{ gap: 8 }}>
            {domains.map((dom) => (
              <View
                key={dom.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#141414',
                  padding: 10,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: '#CCCCCC', fontSize: 13 }}>🌐 {dom.url}</Text>
                <Switch
                  value={dom.enabled}
                  onValueChange={() => toggleDomain(dom.id)}
                  trackColor={{ false: '#333333', true: '#4CD964' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ADD APP MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: '#1E1E1E',
              padding: 20,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#333333',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 14 }}>
              ADD APPLICATION
            </Text>

            <TextInput
              style={{
                backgroundColor: '#121212',
                color: '#FFFFFF',
                padding: 12,
                borderRadius: 6,
                marginBottom: 12,
              }}
              placeholder="App Name (e.g. Zoom)"
              placeholderTextColor="#666"
              value={newAppName}
              onChangeText={setNewAppName}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#333333',
                  padding: 12,
                  borderRadius: 6,
                  alignItems: 'center',
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#FFFFFF' }}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#FF3B30',
                  padding: 12,
                  borderRadius: 6,
                  alignItems: 'center',
                }}
                onPress={handleAddApp}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>ADD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.footerTagline}>YOUR PHONE. YOUR RULES.</Text>
    </ScrollView>
  );
}
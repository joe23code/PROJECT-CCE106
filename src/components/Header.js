import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LockIcon, SettingsGearIcon } from './icon';

export default function Header({ onSettings, theme }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: theme?.border || '#342023', backgroundColor: theme?.background }}>
      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#f04421', alignItems: 'center', justifyContent: 'center', marginRight: 9 }}>
        <LockIcon size={19} />
      </View>
      <Text style={{ color: theme?.text || '#f8fafc', fontSize: 20, fontWeight: '900', fontStyle: 'italic', letterSpacing: 1 }}>
        LOCKED<Text style={{ color: '#f04421' }}>IN</Text>
      </Text>
      {onSettings && <TouchableOpacity onPress={onSettings} accessibilityLabel="Open settings" style={{ position: 'absolute', right: 18, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}><SettingsGearIcon size={21} color="#f47057" /></TouchableOpacity>}
    </View>
  );
}

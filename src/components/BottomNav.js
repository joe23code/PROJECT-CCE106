import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GridIcon, JournalIcon, ShieldIcon, TimerIcon, PersonIcon } from './icon';

const tabs = [
  { key: 'home', label: 'HOME', Icon: GridIcon },
  { key: 'focus', label: 'FOCUS', Icon: TimerIcon },
  { key: 'contacts', label: 'SAFETY', Icon: ShieldIcon },
  { key: 'journal', label: 'JOURNAL', Icon: JournalIcon },
  { key: 'profile', label: 'PROFILE', Icon: PersonIcon }
];

export default function BottomNav({ activeTab, setActiveTab, theme }) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: theme?.surface || '#121316', borderTopWidth: 1, borderTopColor: theme?.border || '#302126', paddingVertical: 9 }}>
      {tabs.map(({ key, label, Icon }) => {
        const active = activeTab === key;
        const color = active ? (theme?.accent || '#f04a28') : (theme?.muted || '#94969d');
        return (
          <TouchableOpacity key={key} style={{ flex: 1, alignItems: 'center', gap: 4 }} onPress={() => setActiveTab(key)} accessibilityRole="tab" accessibilityLabel={label}>
            <Icon size={20} color={color} />
            <Text style={{ color, fontWeight: '800', fontSize: 9 }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

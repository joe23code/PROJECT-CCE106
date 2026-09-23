import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  Svg,
  Path,
  Circle,
  Polyline,
  Rect,
  Line,
} from 'react-native-svg';

import styles from '../styles/styles';

const tabs = [
  ['welcome', 'WELCOME'],
  ['focus', 'FOCUS'],
  ['list', 'LIST'],
  ['journal', 'JOURNAL'],
  ['profile', 'PROFILE'],
  ['settings', 'SETTINGS'],
];

function NavIcon({ type, color }) {
  const commonProps = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (type) {
    case 'welcome':
      return (
        <Svg {...commonProps}>
          <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </Svg>
      );

    case 'focus':
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="12" r="9" />
          <Polyline points="12 7 12 12 15 14" />
        </Svg>
      );

    case 'list':
      return (
        <Svg {...commonProps}>
          <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <Polyline points="9 12 11 14 15 10" />
        </Svg>
      );

    case 'journal':
      return (
        <Svg {...commonProps}>
          <Rect x="5" y="3" width="14" height="18" rx="2" />
          <Line x1="9" y1="8" x2="15" y2="8" />
          <Line x1="9" y1="12" x2="15" y2="12" />
          <Line x1="9" y1="16" x2="13" y2="16" />
        </Svg>
      );

    case 'profile':
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="8" r="4" />
          <Path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
        </Svg>
      );

    case 'settings':
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="12" r="3" />
          <Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.4 1.4-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L9 17.1l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H7v-2h.9a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L9 9.1l1.4-1.4.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V6h2v.6a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.4 1.4-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.6v2h-.6a1.7 1.7 0 0 0-1.5.9z" />
        </Svg>
      );

    default:
      return null;
  }
}

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <View style={styles.bottomNav}>
      {tabs.map(([key, label]) => {
        const isActive = activeTab === key;
        const iconColor = isActive ? '#FFFFFF' : '#888888';

        return (
          <TouchableOpacity
            key={key}
            style={styles.navItem}
            onPress={() => setActiveTab(key)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <NavIcon type={key} color={iconColor} />
            <Text
              style={[
                styles.navLabel,
                isActive && styles.navActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
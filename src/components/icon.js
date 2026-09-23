import React from 'react';
import Svg, {
  Path,
  Circle,
  Rect,
  Line,
} from 'react-native-svg';

export const PersonIcon = ({ size = 24, color = '#fff' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Circle
      cx="12"
      cy="8"
      r="4"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const PhoneIcon = ({ size = 24, color = '#fff' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 4.9c0-.6.4-1 1-1h3.4c.6 0 1 0 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SlidersIcon = ({ size = 24, color = '#fff' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Line
      x1="4"
      y1="6"
      x2="20"
      y2="6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />

    <Line
      x1="4"
      y1="12"
      x2="20"
      y2="12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />

    <Line
      x1="4"
      y1="18"
      x2="20"
      y2="18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />

    <Circle
      cx="9"
      cy="6"
      r="2"
      fill="#0b0b0f"
      stroke={color}
      strokeWidth="2"
    />

    <Circle
      cx="16"
      cy="12"
      r="2"
      fill="#0b0b0f"
      stroke={color}
      strokeWidth="2"
    />

    <Circle
      cx="7"
      cy="18"
      r="2"
      fill="#0b0b0f"
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

export const BookIcon = ({ size = 24, color = '#fff' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5c-.8 0-1.5-.7-1.5-1.5v-13z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />

    <Path
      d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5c.8 0 1.5-.7 1.5-1.5v-13z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </Svg>
);

export const FireIcon = ({
  size = 24,
  color = '#FF6B35',
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M12 2c1 3-2 4-2 7a4 4 0 108 0c0-1-.3-2-1-3 1.5 1 2.5 3 2.5 5.2A6.5 6.5 0 1112 3.2c0-.4 0-.8 0-1.2z"
      fill={color}
      stroke={color}
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </Svg>
);

export const StopwatchIcon = ({
  size = 24,
  color = '#fff',
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Circle
      cx="12"
      cy="13"
      r="8"
      stroke={color}
      strokeWidth="2"
    />

    <Line
      x1="12"
      y1="13"
      x2="12"
      y2="9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />

    <Line
      x1="9"
      y1="2"
      x2="15"
      y2="2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />

    <Line
      x1="12"
      y1="2"
      x2="12"
      y2="4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const ShieldIcon = ({
  size = 24,
  color = '#4C8CFF',
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M12 3l7 3v5c0 5-3.4 8.4-7 10-3.6-1.6-7-5-7-10V6l7-3z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      fill="rgba(76,140,255,0.15)"
    />
  </Svg>
);

export const LockIcon = ({
  size = 24,
  color = '#fff',
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Rect
      x="5"
      y="10"
      width="14"
      height="10"
      rx="2"
      stroke={color}
      strokeWidth="2"
    />

    <Path
      d="M8 10V7a4 4 0 018 0v3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const SettingsGearIcon = ({
  size = 24,
  color = '#fff',
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Circle
      cx="12"
      cy="12"
      r="3"
      stroke={color}
      strokeWidth="2"
    />

    <Path
      d="M19.4 13.5a7.6 7.6 0 000-3l2-1.5-2-3.5-2.4 1a7.8 7.8 0 00-2.6-1.5L14 2h-4l-.4 2.5a7.8 7.8 0 00-2.6 1.5l-2.4-1-2 3.5 2 1.5a7.6 7.6 0 000 3l-2 1.5 2 3.5 2.4-1a7.8 7.8 0 002.6 1.5L10 22h4l.4-2.5a7.8 7.8 0 002.6-1.5l2.4 1 2-3.5-2-1.5z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </Svg>
);
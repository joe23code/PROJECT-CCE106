export const formatDuration = seconds => {
  const s = Math.max(0, Math.round(seconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${sec ? `${sec}s` : ''}`.trim();
  return `${sec}s`;
};

export const dateKey = value => {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getSessionStats = sessions => {
  const completed = sessions.filter(s => s.result === 'completed' || s.outcome === 'completed');
  const totalLocked = sessions.reduce((sum, s) => sum + Number(s.durationSeconds ?? s.seconds ?? 0), 0);
  const completedSeconds = completed.reduce((sum, s) => sum + Number(s.durationSeconds ?? s.seconds ?? 0), 0);
  const longestSeconds = completed.reduce((max, s) => Math.max(max, Number(s.durationSeconds ?? s.seconds ?? 0)), 0);

  const today = dateKey(new Date());
  const now = new Date();
  const weekStart = new Date(now);
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - day);
  weekStart.setHours(0, 0, 0, 0);

  const dailySeconds = completed
    .filter(s => dateKey(s.endedAt || s.endTime) === today)
    .reduce((sum, s) => sum + Number(s.durationSeconds ?? s.seconds ?? 0), 0);

  const weeklySeconds = completed
    .filter(s => new Date(s.endedAt || s.endTime) >= weekStart)
    .reduce((sum, s) => sum + Number(s.durationSeconds ?? s.seconds ?? 0), 0);

  const days = new Set(completed.map(s => dateKey(s.endedAt || s.endTime)));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (days.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // A streak also remains active when the user has not completed today's session yet.
  if (!days.has(today)) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    if (days.has(dateKey(yesterday))) {
      streak = 1;
      yesterday.setDate(yesterday.getDate() - 1);
      while (days.has(dateKey(yesterday))) {
        streak += 1;
        yesterday.setDate(yesterday.getDate() - 1);
      }
    }
  }

  const achievements = [
    { id: 'first', label: 'First session', unlocked: completed.length >= 1 },
    { id: 'hour', label: 'One focused hour', unlocked: completedSeconds >= 3600 },
    { id: 'ten', label: 'Ten sessions', unlocked: completed.length >= 10 },
    { id: 'five-day', label: 'Five-day streak', unlocked: streak >= 5 },
    { id: 'ten-hours', label: 'Ten focused hours', unlocked: completedSeconds >= 36000 },
  ];

  return {
    completed,
    completedCount: completed.length,
    totalLockedSeconds: totalLocked,
    completedSeconds,
    longestSeconds,
    dailySeconds,
    weeklySeconds,
    streak,
    achievements: achievements.filter(a => a.unlocked),
    allAchievements: achievements,
  };
};

export const hashPassword = value => {
  // Local-only deterministic hash used by this prototype so the raw password is
  // not persisted in AsyncStorage. A production backend should use a server-side
  // password hashing/KDF such as Argon2 or bcrypt.
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `v1-${(hash >>> 0).toString(16)}`;
};

export const DEFAULT_TEMPLATES = [
  { id: 'study', name: 'Study', seconds: 2700, purpose: 'Study and review', allowedContactIds: [], settings: { safeMode: true, emergencyAccess: true, notifications: false } },
  { id: 'work', name: 'Work', seconds: 3600, purpose: 'Deep work', allowedContactIds: [], settings: { safeMode: true, emergencyAccess: true, notifications: false } },
  { id: 'sleep', name: 'Sleep', seconds: 5400, purpose: 'Rest and sleep', allowedContactIds: [], settings: { safeMode: true, emergencyAccess: true, notifications: false } },
  { id: 'family', name: 'Family Time', seconds: 3600, purpose: 'Be present with family', allowedContactIds: [], settings: { safeMode: true, emergencyAccess: true, notifications: false } },
  { id: 'detox', name: 'Digital Detox', seconds: 1800, purpose: 'Disconnect from digital distractions', allowedContactIds: [], settings: { safeMode: true, emergencyAccess: true, notifications: false } },
];

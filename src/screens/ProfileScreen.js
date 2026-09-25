import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/styles';

import {
  PersonIcon,
  FireIcon,
  StopwatchIcon,
  ShieldIcon,
} from '../components/icon';

export default function ProfileScreen({ onStartFocus, onLogOut, motivation, setMotivation }) {
  // State for editable profile details
  const [userName, setUserName] = useState('Shen');
  const [userStatus, setUserStatus] = useState('FOCUSED & FREE');
  const [topGoal, setTopGoal] = useState('STUDY TIME');

  // Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editStatus, setEditStatus] = useState(userStatus);
  const [editGoal, setEditGoal] = useState(topGoal);
  const [motivationDraft, setMotivationDraft] = useState(motivation);
  const [motivationSaved, setMotivationSaved] = useState(false);

  const handleSaveProfile = () => {
    setUserName(editName.trim() || 'User');
    setUserStatus(editStatus.trim() || 'FOCUSED & FREE');
    setTopGoal(editGoal.trim() || 'STUDY TIME');
    setIsEditing(false);
  };

  const handleOpenEdit = () => {
    setEditName(userName);
    setEditStatus(userStatus);
    setEditGoal(topGoal);
    setIsEditing(true);
  };

  const handleReward = (title, description) => {
    Alert.alert(title, description);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollPad}>

      {/* PROFILE HEADER CARD */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <PersonIcon size={26} color="#fff" />
        </View>

        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.userName}>{userName}</Text>

          <Text style={styles.userStatus}>
            • {userStatus.toUpperCase()}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={styles.userMeta}>
              STREAK: 5 DAYS
            </Text>

            <FireIcon
              size={14}
              color="#FF6B35"
            />

            <Text style={styles.userMeta}>
              {' | LOCKED: 12H 45M'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={handleOpenEdit}
          activeOpacity={0.7}
        >
          <Text style={styles.editBtnText}>
            EDIT
          </Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsGrid}>
        {[
          ['SESSIONS COMPLETED', '28'],
          ['TOTAL HOURS LOCKED', '12:45 HRS'],
          ['LONGEST SESSION', '2 HOURS'],
          ['TOP FOCUS GOAL', topGoal.toUpperCase()],
        ].map(([label, value]) => (
          <View
            key={label}
            style={styles.statBox}
          >
            <Text style={styles.statLabel}>
              {label}
            </Text>

            <Text style={styles.statVal}>
              {value}
            </Text>
          </View>
        ))}
      </View>

      {/* REWARDS */}
      <Text style={styles.rewardsTitle}>
        MY REWARDS (3 UNLOCKED)
      </Text>

      <View style={styles.rewardsList}>

        <TouchableOpacity
          style={styles.rewardPillCard}
          onPress={() =>
            handleReward(
              'Streak Heat',
              'You have maintained a 5-day focus streak.'
            )
          }
          activeOpacity={0.7}
        >
          <FireIcon
            size={24}
            color="#FF6B35"
          />

          <Text style={styles.rewardPillBadge}>
            5 DAYS
          </Text>

          <Text style={styles.rewardPillSub}>
            Streak Heat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rewardPillCard}
          onPress={() =>
            handleReward(
              'Monastic Block',
              'Unlocked after completing a 1-hour focus session.'
            )
          }
          activeOpacity={0.7}
        >
          <StopwatchIcon
            size={24}
            color="#fff"
          />

          <Text style={styles.rewardPillBadge}>
            1 HR
          </Text>

          <Text style={styles.rewardPillSub}>
            Monastic Block
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rewardPillCard}
          onPress={() =>
            handleReward(
              'Obsidian Shield',
              'Unlocked after reaching 100 total focus hours.'
            )
          }
          activeOpacity={0.7}
        >
          <ShieldIcon
            size={24}
            color="#4C8CFF"
          />

          <Text style={styles.rewardPillBadge}>
            100 HOURS
          </Text>

          <Text style={styles.rewardPillSub}>
            Obsidian Shield
          </Text>
        </TouchableOpacity>

      </View>

      {/* START FOCUS */}
      <TouchableOpacity
        style={styles.primaryRedBtn}
        onPress={onStartFocus}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryRedBtnText}>
          + START FOCUS SESSION
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onLogOut} style={{ minHeight: 48, borderWidth: 1, borderColor: '#ff3b30', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
        <Text style={{ color: '#ff4d42', fontWeight: '900', fontSize: 12, letterSpacing: 1 }}>LOG OUT</Text>
      </TouchableOpacity>

      <View style={{ backgroundColor: '#16171d', borderWidth: 1, borderColor: '#2e2f38', borderRadius: 14, padding: 15, marginTop: 16 }}>
        <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 15 }}>DAILY MOTIVATION</Text>
        <Text style={{ color: '#a1a1aa', fontSize: 11, marginTop: 5 }}>This appears on your home dashboard.</Text>
        <TextInput value={motivationDraft} onChangeText={setMotivationDraft} multiline style={{ minHeight: 80, color: '#ffffff', borderWidth: 1, borderColor: '#3f3f46', borderRadius: 10, padding: 11, marginTop: 12, textAlignVertical: 'top' }} />
        <TouchableOpacity onPress={() => { setMotivation(motivationDraft.trim() || 'Small steps today create a stronger tomorrow.'); setMotivationSaved(true); }} style={{ backgroundColor: '#f04421', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 10 }}><Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 11 }}>SAVE MOTIVATION</Text></TouchableOpacity>
        {motivationSaved && <Text style={{ color: '#4fd47b', fontSize: 11, fontWeight: '800', marginTop: 9 }}>Motivation saved successfully.</Text>}
      </View>

      {/* EDIT PROFILE MODAL */}
      <Modal visible={isEditing} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.85)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: '#1E1E1E',
              padding: 22,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#333333',
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 16,
              }}
            >
              EDIT PROFILE
            </Text>

            <Text style={{ color: '#888888', fontSize: 12, marginBottom: 6 }}>
              NAME
            </Text>
            <TextInput
              style={{
                backgroundColor: '#121212',
                color: '#FFFFFF',
                padding: 12,
                borderRadius: 6,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: '#2C2C2C',
              }}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter name"
              placeholderTextColor="#666"
            />

            <Text style={{ color: '#888888', fontSize: 12, marginBottom: 6 }}>
              STATUS TAGLINE
            </Text>
            <TextInput
              style={{
                backgroundColor: '#121212',
                color: '#FFFFFF',
                padding: 12,
                borderRadius: 6,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: '#2C2C2C',
              }}
              value={editStatus}
              onChangeText={setEditStatus}
              placeholder="e.g. Focused & Free"
              placeholderTextColor="#666"
            />

            <Text style={{ color: '#888888', fontSize: 12, marginBottom: 6 }}>
              TOP FOCUS GOAL
            </Text>
            <TextInput
              style={{
                backgroundColor: '#121212',
                color: '#FFFFFF',
                padding: 12,
                borderRadius: 6,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: '#2C2C2C',
              }}
              value={editGoal}
              onChangeText={setEditGoal}
              placeholder="e.g. Study Time"
              placeholderTextColor="#666"
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#333333',
                  padding: 12,
                  borderRadius: 6,
                  alignItems: 'center',
                }}
                onPress={() => setIsEditing(false)}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#FF3B30',
                  padding: 12,
                  borderRadius: 6,
                  alignItems: 'center',
                }}
                onPress={handleSaveProfile}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

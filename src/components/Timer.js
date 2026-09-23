import React, { useEffect, useState } from 'react';
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/styles';

const DEFAULT_PRESETS = [25, 45, 60, 90];

const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');

  const sec = (seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${min}:${sec}`;
};

export default function Timer() {
  // =========================
  // TIMER STATE
  // =========================
  const [minutes, setMinutes] = useState(45);
  const [remaining, setRemaining] = useState(45 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  // =========================
  // PRESET STATE
  // =========================
  const [presets, setPresets] = useState(DEFAULT_PRESETS);

  // 45m is selected by default
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(1);

  // =========================
  // EDIT TIME MODAL
  // =========================
  const [showEditTime, setShowEditTime] = useState(false);
  const [customTime, setCustomTime] = useState('45');

  // =========================
  // EMERGENCY ACCESS MODAL
  // =========================
  const [showEmergency, setShowEmergency] = useState(false);

  // =========================
  // TIMER COUNTDOWN
  // =========================
  useEffect(() => {
    if (!running) {
      return;
    }

    const id = setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          clearInterval(id);

          setRunning(false);
          setCompleted(true);

          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  // =========================
  // SELECT PRESET
  // =========================
  const selectPreset = (value, index) => {
    setRunning(false);
    setCompleted(false);

    setMinutes(value);
    setRemaining(value * 60);

    setSelectedPresetIndex(index);
  };

  // =========================
  // OPEN EDIT TIME
  // =========================
  const openEditTime = () => {
    setCustomTime(minutes.toString());
    setShowEditTime(true);
  };

  // =========================
  // SAVE CUSTOM TIME
  // =========================
  const saveCustomTime = () => {
    const value = parseInt(customTime, 10);

    // Don't allow empty, zero, or negative values
    if (!value || value <= 0) {
      return;
    }

    // Replace the currently selected preset
    const updatedPresets = [...presets];

    updatedPresets[selectedPresetIndex] = value;

    setPresets(updatedPresets);

    // Update timer
    setMinutes(value);
    setRemaining(value * 60);

    setRunning(false);
    setCompleted(false);

    setShowEditTime(false);
  };

  // =========================
  // RESET
  // =========================
  const reset = () => {
    setRunning(false);
    setCompleted(false);
    setRemaining(minutes * 60);
  };

  // =========================
  // START FOCUS
  // =========================
  const startFocus = () => {
    if (remaining <= 0) {
      setRemaining(minutes * 60);
    }

    setCompleted(false);
    setRunning(true);
  };

  // =========================
  // EMERGENCY ACCESS
  // =========================
  const openEmergencyAccess = () => {
    setShowEmergency(true);
  };

  // =========================
  // DECLINE EMERGENCY
  // =========================
  const declineEmergency = () => {
    setShowEmergency(false);
  };

  // =========================
  // AGREE EMERGENCY
  // =========================
  const agreeEmergency = () => {
    setShowEmergency(false);
    setRunning(false);
  };

  return (
    <View style={styles.timerCenterWrap}>

      {/* ========================= */}
      {/* TIMER CIRCLE */}
      {/* ========================= */}

      <View
        style={[
          styles.timerRingOuter,
          running && styles.timerRingOuterLocked,
        ]}
      >
        <View style={styles.timerRingInner}>

          <Text style={styles.monkModeLabel}>
            {completed
              ? '• SESSION COMPLETE •'
              : running
                ? '• MONK MODE •'
                : 'STRICT FOCUS SESSION'}
          </Text>

          <Text style={styles.timeBig}>
            {formatTime(remaining)}
          </Text>

          <Text style={styles.timeTargetSub}>
            {running
              ? 'Focus session active'
              : completed
                ? 'Great work'
                : 'Study Time Preset'}
          </Text>

        </View>
      </View>

      {/* ========================= */}
      {/* PRESET TIMES */}
      {/* ========================= */}

      {!running && (
        <View style={styles.presetTimesRow}>

          {presets.map((value, index) => {
            const isSelected =
              selectedPresetIndex === index;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.presetChip,
                  isSelected &&
                    styles.presetChipActive,
                ]}
                onPress={() =>
                  selectPreset(value, index)
                }
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    isSelected &&
                      styles.presetChipTextActive,
                  ]}
                >
                  {value}m
                </Text>
              </TouchableOpacity>
            );
          })}

        </View>
      )}

      {/* ========================= */}
      {/* EDIT TIME */}
      {/* ========================= */}

      {!running && (
        <TouchableOpacity
          onPress={openEditTime}
          activeOpacity={0.8}
          style={{
            marginTop: 14,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderWidth: 1,
            borderColor: '#55565d',
            borderRadius: 10,
            alignSelf: 'center',
          }}
        >
          <Text
            style={{
              color: '#ffffff',
              fontSize: 13,
              fontWeight: '800',
              letterSpacing: 0.5,
            }}
          >
            ✏️ EDIT TIME
          </Text>
        </TouchableOpacity>
      )}

      {/* ========================= */}
      {/* STATUS */}
      {/* ========================= */}

      <View style={styles.focusStatusBox}>

        <Text style={styles.focusStatusTitle}>
          {running
            ? '🔒 Focus Lock Active'
            : completed
              ? '✅ Session Finished'
              : '🛡️ Ready to Focus'}
        </Text>

        <Text style={styles.focusStatusBody}>
          {running
            ? 'Stay focused until the countdown reaches zero.'
            : completed
              ? 'Your focus session is complete. Take a short break before the next session.'
              : 'Choose a duration and start your focus session.'}
        </Text>

      </View>

      {/* ========================= */}
      {/* START + RESET */}
      {/* ========================= */}

      <View style={styles.timerButtons}>

        <TouchableOpacity
          style={styles.lockActionBtn}
          onPress={startFocus}
          activeOpacity={0.8}
        >
          <Text style={styles.lockActionBtnText}>
            START FOCUS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={reset}
          activeOpacity={0.8}
        >
          <Text style={styles.resetBtnText}>
            RESET
          </Text>
        </TouchableOpacity>

      </View>

      {/* ========================= */}
      {/* EMERGENCY ACCESS */}
      {/* ========================= */}

      <TouchableOpacity
        style={{
          marginTop: 16,
          width: '100%',
          paddingVertical: 14,
          borderWidth: 1,
          borderColor: '#ff3b30',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        activeOpacity={0.8}
        onPress={openEmergencyAccess}
      >
        <Text
          style={{
            color: '#ff3b30',
            fontSize: 13,
            fontWeight: '800',
            letterSpacing: 1,
          }}
        >
          🚨 EMERGENCY ACCESS
        </Text>
      </TouchableOpacity>

      {/* ========================= */}
      {/* EDIT TIME MODAL */}
      {/* ========================= */}

      <Modal
        visible={showEditTime}
        transparent={true}
        animationType="fade"
        onRequestClose={() =>
          setShowEditTime(false)
        }
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >

          <View
            style={{
              width: '100%',
              maxWidth: 420,
              backgroundColor: '#17181d',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#33343b',
              padding: 24,
            }}
          >

            <Text
              style={{
                color: '#ffffff',
                fontSize: 20,
                fontWeight: '800',
                textAlign: 'center',
                marginBottom: 10,
              }}
            >
              Set Focus Time
            </Text>

            <Text
              style={{
                color: '#999999',
                fontSize: 14,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              Enter the number of minutes you want to focus.
            </Text>

            <TextInput
              value={customTime}
              onChangeText={setCustomTime}
              keyboardType="numeric"
              placeholder="Minutes"
              placeholderTextColor="#666666"
              selectTextOnFocus
              style={{
                height: 55,
                borderWidth: 1,
                borderColor: '#55565d',
                borderRadius: 10,
                color: '#ffffff',
                backgroundColor: '#0f1014',
                fontSize: 22,
                fontWeight: '700',
                textAlign: 'center',
                marginBottom: 20,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                gap: 12,
              }}
            >

              {/* CANCEL */}
              <TouchableOpacity
                onPress={() =>
                  setShowEditTime(false)
                }
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  minHeight: 48,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#55565d',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    fontWeight: '800',
                  }}
                >
                  CANCEL
                </Text>
              </TouchableOpacity>

              {/* SAVE */}
              <TouchableOpacity
                onPress={saveCustomTime}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  minHeight: 48,
                  borderRadius: 10,
                  backgroundColor: '#ff3b30',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    fontWeight: '800',
                  }}
                >
                  SAVE
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>
      </Modal>

      {/* ========================= */}
      {/* EMERGENCY ACCESS MODAL */}
      {/* ========================= */}

      <Modal
        visible={showEmergency}
        transparent={true}
        animationType="fade"
        onRequestClose={declineEmergency}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >

          <View
            style={{
              width: '100%',
              maxWidth: 420,
              backgroundColor: '#17181d',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#33343b',
              padding: 24,
            }}
          >

            <Text
              style={{
                color: '#ffffff',
                fontSize: 20,
                fontWeight: '800',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              Emergency Access
            </Text>

            <Text
              style={{
                color: '#cccccc',
                fontSize: 15,
                lineHeight: 22,
                textAlign: 'center',
                marginBottom: 28,
              }}
            >
              You are currently in a focus session. Do you want to activate Emergency Access?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                gap: 12,
              }}
            >

              {/* DECLINE */}
              <TouchableOpacity
                onPress={declineEmergency}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  minHeight: 48,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#55565d',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: 13,
                  }}
                >
                  DECLINE
                </Text>
              </TouchableOpacity>

              {/* AGREE */}
              <TouchableOpacity
                onPress={agreeEmergency}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  minHeight: 48,
                  borderRadius: 10,
                  backgroundColor: '#ff3b30',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: 13,
                  }}
                >
                  AGREE
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>
      </Modal>

    </View>
  );
}
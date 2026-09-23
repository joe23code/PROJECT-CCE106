import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/styles';

export default function FocusJournalScreen({ onBack }) {
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');

  const sessions = [
    {
      id: 1,
      time: '9:30 PM',
      duration: 60,
      status: 'Completed',
      emergency: false,
    },
    {
      id: 2,
      time: '7:00 PM',
      duration: 45,
      status: 'Completed',
      emergency: false,
    },
    {
      id: 3,
      time: '5:30 PM',
      duration: 45,
      status: 'Emergency Access Used',
      emergency: true,
    },
  ];

  const weeklyProgress = [
    { day: 'MON', minutes: 45 },
    { day: 'TUE', minutes: 60 },
    { day: 'WED', minutes: 25 },
    { day: 'THU', minutes: 90 },
    { day: 'FRI', minutes: 45 },
    { day: 'SAT', minutes: 60 },
    { day: 'SUN', minutes: 30 },
  ];

  const totalMinutes = sessions.reduce(
    (total, session) => total + session.duration,
    0
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const totalFocusTime =
    hours > 0
      ? `${hours}h ${minutes}m`
      : `${minutes}m`;

  const saveNote = () => {
    if (!note.trim()) {
      return;
    }

    setSavedNote(note.trim());
    setNote('');
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollPad,
        {
          paddingBottom: 40,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 28,
            fontWeight: '900',
            letterSpacing: 1,
          }}
        >
          FOCUS JOURNAL
        </Text>

        <Text
          style={{
            color: '#888888',
            fontSize: 14,
            marginTop: 6,
          }}
        >
          Your focus history and progress
        </Text>
      </View>

      {/* TODAY'S SUMMARY */}

      <View
        style={{
          backgroundColor: '#17181d',
          borderWidth: 1,
          borderColor: '#2f3037',
          borderRadius: 14,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: '#ff3b30',
            fontSize: 13,
            fontWeight: '900',
            letterSpacing: 1,
            marginBottom: 18,
          }}
        >
          TODAY
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22 }}>
              🔥
            </Text>

            <Text
              style={{
                color: '#ffffff',
                fontSize: 18,
                fontWeight: '800',
              }}
            >
              5 Day
            </Text>

            <Text
              style={{
                color: '#888888',
                fontSize: 12,
                marginTop: 3,
              }}
            >
              Current streak
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22 }}>
              ⏱️
            </Text>

            <Text
              style={{
                color: '#ffffff',
                fontSize: 18,
                fontWeight: '800',
              }}
            >
              {totalFocusTime}
            </Text>

            <Text
              style={{
                color: '#888888',
                fontSize: 12,
                marginTop: 3,
              }}
            >
              Focused
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22 }}>
              ✅
            </Text>

            <Text
              style={{
                color: '#ffffff',
                fontSize: 18,
                fontWeight: '800',
              }}
            >
              2
            </Text>

            <Text
              style={{
                color: '#888888',
                fontSize: 12,
                marginTop: 3,
              }}
            >
              Completed
            </Text>
          </View>
        </View>
      </View>

      {/* SESSION HISTORY */}

      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 17,
            fontWeight: '900',
            letterSpacing: 0.5,
            marginBottom: 12,
          }}
        >
          SESSION HISTORY
        </Text>

        {sessions.map((session) => (
          <View
            key={session.id}
            style={{
              backgroundColor: '#17181d',
              borderWidth: 1,
              borderColor: '#2f3037',
              borderRadius: 12,
              padding: 16,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: session.emergency
                  ? '#291719'
                  : '#19251d',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
              }}
            >
              <Text style={{ fontSize: 18 }}>
                {session.emergency ? '⚠️' : '✅'}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 15,
                  fontWeight: '800',
                }}
              >
                {session.duration} Minute Focus Session
              </Text>

              <Text
                style={{
                  color: '#888888',
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {session.time}
              </Text>
            </View>

            <Text
              style={{
                color: session.emergency
                  ? '#ff3b30'
                  : '#4caf50',
                fontSize: 11,
                fontWeight: '800',
                textAlign: 'right',
                maxWidth: 100,
              }}
            >
              {session.status}
            </Text>
          </View>
        ))}
      </View>

      {/* WEEKLY PROGRESS */}

      <View
        style={{
          backgroundColor: '#17181d',
          borderWidth: 1,
          borderColor: '#2f3037',
          borderRadius: 14,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: '#ffffff',
            fontSize: 17,
            fontWeight: '900',
            marginBottom: 20,
          }}
        >
          WEEKLY PROGRESS
        </Text>

        {weeklyProgress.map((item) => {
          const barWidth = Math.min(
            (item.minutes / 90) * 100,
            100
          );

          return (
            <View
              key={item.day}
              style={{ marginBottom: 14 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    color: '#aaaaaa',
                    fontSize: 11,
                    fontWeight: '800',
                  }}
                >
                  {item.day}
                </Text>

                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: '700',
                  }}
                >
                  {item.minutes}m
                </Text>
              </View>

              <View
                style={{
                  height: 8,
                  backgroundColor: '#292a30',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    backgroundColor: '#ff3b30',
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          );
        })}

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: '#2f3037',
            marginTop: 4,
            paddingTop: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              color: '#888888',
              fontSize: 12,
              fontWeight: '700',
            }}
          >
            TOTAL THIS WEEK
          </Text>

          <Text
            style={{
              color: '#ffffff',
              fontSize: 14,
              fontWeight: '900',
            }}
          >
            5h 55m
          </Text>
        </View>
      </View>

      {/* SESSION REFLECTION */}

      <View
        style={{
          backgroundColor: '#17181d',
          borderWidth: 1,
          borderColor: '#2f3037',
          borderRadius: 14,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: '#ffffff',
            fontSize: 17,
            fontWeight: '900',
            marginBottom: 6,
          }}
        >
          SESSION REFLECTION
        </Text>

        <Text
          style={{
            color: '#888888',
            fontSize: 13,
            marginBottom: 14,
          }}
        >
          Write something about your focus session.
        </Text>

        <TextInput
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={5}
          placeholder="How was your focus today?"
          placeholderTextColor="#666666"
          style={{
            minHeight: 110,
            backgroundColor: '#0f1014',
            borderWidth: 1,
            borderColor: '#33343b',
            borderRadius: 10,
            padding: 14,
            color: '#ffffff',
            fontSize: 14,
            textAlignVertical: 'top',
            marginBottom: 12,
          }}
        />

        <TouchableOpacity
          onPress={saveNote}
          activeOpacity={0.8}
          style={{
            backgroundColor: '#ff3b30',
            minHeight: 48,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: '#ffffff',
              fontSize: 13,
              fontWeight: '900',
              letterSpacing: 0.5,
            }}
          >
            SAVE NOTE
          </Text>
        </TouchableOpacity>

        {savedNote !== '' && (
          <View
            style={{
              marginTop: 16,
              padding: 14,
              backgroundColor: '#111216',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#2f3037',
            }}
          >
            <Text
              style={{
                color: '#ff3b30',
                fontSize: 11,
                fontWeight: '900',
                marginBottom: 6,
              }}
            >
              SAVED REFLECTION
            </Text>

            <Text
              style={{
                color: '#dddddd',
                fontSize: 14,
                lineHeight: 21,
              }}
            >
              {savedNote}
            </Text>
          </View>
        )}
      </View>

      {/* BACK */}

      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.8}
        style={{
          minHeight: 48,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#44454c',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: '#ffffff',
            fontSize: 13,
            fontWeight: '900',
          }}
        >
          ← BACK TO WELCOME
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
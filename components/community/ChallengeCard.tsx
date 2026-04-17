import React, {
  useState,
  useRef,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Challenge } from "../../types/community";

import BookIcon from "../../assets/icons/iconsax-book-open.svg";
import ParticipantIcon from "../../assets/icons/Vector (1).svg";

interface Props {
  item: Challenge;
}

export default function ChallengeCard({
  item,
}: Props) {
  const [joined, setJoined] =
    useState(false);

  const animatedWidth = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: item.progress,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, []);

  const animatedBarWidth =
    animatedWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    });

  const challengeStyles = {
    streak: {
      color: "#E6B43D",
      iconBg: "#FDF1D8",
    },
    task: {
      color: "#6C63FF",
      iconBg: "#EEF0FF",
    },
    category: {
      color: "#15C82F",
      iconBg: "#DDF8E3",
    },
  };

  const style =
    challengeStyles[item.type];

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View
          style={[
            styles.icon,
            {
              backgroundColor:
                style.iconBg,
            },
          ]}
        >
          <BookIcon
            width={18}
            height={18}
            stroke={style.color}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {item.title}
          </Text>
          <Text style={styles.subtitle}>
            {item.subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.progressBg}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: animatedBarWidth,
              backgroundColor:
                style.color,
            },
          ]}
        />
      </View>

      <View style={styles.bottom}>
        <View
          style={styles.participantWrapper}
        >
          <ParticipantIcon
            width={14}
            height={14}
          />
          <Text style={styles.participants}>
            {item.participants}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor: style.color,
              backgroundColor: joined
                ? style.color
                : "transparent",
            },
          ]}
          onPress={() =>
            setJoined((prev) => !prev)
          }
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: joined
                  ? "#FFFFFF"
                  : style.color,
              },
            ]}
          >
            {joined
              ? "Joined"
              : "Join"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 13,
    color: "#9AA3B2",
    marginTop: 2,
  },

  progressBg: {
    height: 6,
    backgroundColor: "#F1F3F7",
    borderRadius: 10,
    marginTop: 14,
  },

  progressFill: {
    height: 6,
    borderRadius: 10,
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    alignItems: "center",
  },

  participants: {
    color: "#9AA3B2",
  },

  button: {
    borderWidth: 1.5,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },

  buttonText: {
    fontWeight: "600",
  },
  participantWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
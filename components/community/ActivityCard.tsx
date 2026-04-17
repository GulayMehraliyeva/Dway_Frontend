import React, { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ActivityPost } from "../../types/community";

import LikeIcon from "../../assets/icons/Vector (2).svg";
import CommentIcon from "../../assets/icons/Vector (3).svg";

interface Props {
  item: ActivityPost;
}

export default function ActivityCard({ item }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);

  const badgeColors: Record<string, string> = {
    Sport: "#F5B942",
    Work: "#6C63FF",
    Health: "#22C55E",
    Learning: "#60A5FA",
    Personal: "#8B5CF6",
    Finance: "#14B8A6",
    Social: "#EC4899",
    Creative: "#F97316",
    Home: "#6B7280",
    Other: "#9CA3AF",
  };

  const badgeColor =
    badgeColors[item.badge] ?? "#9CA3AF";

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) =>
      liked ? prev - 1 : prev + 1
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: item.avatarColor,
            },
          ]}
        >
          <Text style={styles.avatarText}>
            {item.initial}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {item.name}
          </Text>
          <Text style={styles.time}>
            {item.time}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: `${badgeColor}20`,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: badgeColor,
              },
            ]}
          >
            {item.badge}
          </Text>
        </View>
      </View>

      <Text style={styles.content}>
        {item.content}
      </Text>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <LikeIcon
            width={14}
            height={14}
            color={liked ? "#EF4444" : "#9AA3B2"}
          />

          <Text
            style={[
              styles.footerText,
              liked && { color: "#EF4444" },
            ]}
          >
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() =>
            router.push({
              pathname: "/comments",
              params: {
                postId: item.id,
                postText: item.content,
                postName: item.name,
                badge: item.badge,
                avatarColor: item.avatarColor,
                initial: item.initial,
              },
            })
          }
          activeOpacity={0.7}
        >
          <CommentIcon
            width={14}
            height={14}
          />
          <Text style={styles.footerText}>
            {item.comments}
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

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },

  time: {
    fontSize: 12,
    color: "#9AA3B2",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },

  content: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
  },

  footerText: {
    marginLeft: 6,
    color: "#9AA3B2",
    fontSize: 13,
  },
  likeIconWrapper: {
    width: 18,
    height: 18,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  likedIconWrapper: {
    backgroundColor: "#EF4444",
  },
});
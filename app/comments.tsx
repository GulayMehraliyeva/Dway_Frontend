import React, {
  useEffect,
  useState,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  router,
  Stack,
  useLocalSearchParams,
} from "expo-router";

import { getCommentsData } from "../services/commentsService";
import {
  CommentsPageData,
  PostComment,
} from "../types/comment";

export default function CommentsScreen() {
  

  const {
  postId,
  postText,
  postName,
  badge,
  avatarColor,
  initial,
} = useLocalSearchParams();

const [comment, setComment] =
  useState("");

const [data, setData] =
  useState<CommentsPageData | null>(
    null
  );

const scrollRef =
  useRef<ScrollView>(null);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  const result =
    await getCommentsData(
      Number(postId)
    );

  if (result) {
    setData(result);
    return;
  }

  setData({
    originalPost: {
      id: Number(postId),
      initial:
        String(initial) || "Y",
      avatarColor:
        String(avatarColor) ||
        "#6366F1",
      name:
        String(postName) ||
        "You",
      badge:
        String(badge) ||
        "Work",
      text:
        String(postText) ||
        "Your post",
    },
    comments: [],
  });
};

const handleSend = () => {
  if (!comment.trim()) return;

  const newComment: PostComment = {
    id: Date.now(),
    initial: "Y",
    avatarColor: "#6366F1",
    name: "You",
    text: comment.trim(),
    time: "Just now",
  };

  setData((prev) => {
    if (!prev) return prev;

    return {
      ...prev,
      comments: [
        ...prev.comments,
        newComment,
      ],
    };
  });

  setComment("");

  setTimeout(() => {
    scrollRef.current?.scrollToEnd({
      animated: true,
    });
  }, 100);
};

if (!data) return null;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#111"
            />
          </TouchableOpacity>

          <Text
            style={styles.headerTitle}
          >
            Comments
          </Text>

          <Text style={styles.headerCount}>
            {data.comments.length}
          </Text>
        </View>

        <View
          style={styles.originalCard}
        >
          <View style={styles.row}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor:
                    data.originalPost
                      .avatarColor,
                },
              ]}
            >
              <Text
                style={
                  styles.avatarText
                }
              >
                {
                  data.originalPost
                    .initial
                }
              </Text>
            </View>

            <Text style={styles.name}>
              {
                data.originalPost
                  .name
              }
            </Text>

            <View
              style={styles.badge}
            >
              <Text
                style={
                  styles.badgeText
                }
              >
                {
                  data.originalPost
                    .badge
                }
              </Text>
            </View>
          </View>

          <Text
            style={styles.postText}
          >
            {data.originalPost.text}
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          style={
            styles.commentsArea
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          {data.comments.length ===
            0 ? (
            <Text
              style={
                styles.emptyText
              }
            >
              No comments yet. Be
              the first!
            </Text>
          ) : (
            data.comments.map(
              (item) => (
                <View
                  key={item.id}
                  style={
                    styles.commentRow
                  }
                >
                  <View
                    style={[
                      styles.avatar,
                      {
                        backgroundColor:
                          item.avatarColor,
                      },
                    ]}
                  >
                    <Text
                      style={
                        styles.avatarText
                      }
                    >
                      {
                        item.initial
                      }
                    </Text>
                  </View>

                  <View
                    style={
                      styles.commentBubble
                    }
                  >
                    <Text
                      style={
                        styles.commentName
                      }
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={
                        styles.commentText
                      }
                    >
                      {item.text}
                    </Text>

                    <Text
                      style={
                        styles.commentTime
                      }
                    >
                      {item.time}
                    </Text>
                  </View>
                </View>
              )
            )
          )}
        </ScrollView>

        <View
          style={styles.inputWrapper}
        >
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            placeholderTextColor="#9CA3AF"
            value={comment}
            onChangeText={setComment}
          />

          <TouchableOpacity
            style={[
              styles.sendBtn,
              comment.trim() &&
              styles.sendBtnActive,
            ]}
            onPress={handleSend}
            activeOpacity={0.8}
            disabled={
              !comment.trim()
            }
          >
            <Ionicons
              name="paper-plane-outline"
              size={18}
              color={
                comment.trim()
                  ? "#FFFFFF"
                  : "#E5E7EB"
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 14,
    flex: 1,
  },

  headerCount: {
    fontSize: 14,
    color: "#9AA3B2",
  },

  originalCard: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    marginRight: 8,
  },

  badge: {
    backgroundColor: "#EEF0FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  badgeText: {
    color: "#6366F1",
    fontSize: 11,
    fontWeight: "500",
  },

  postText: {
    marginTop: 10,
    fontSize: 13,
    color: "#9AA3B2",
    lineHeight: 20,
  },

  commentsArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  commentBubble: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    borderRadius: 16,
    padding: 14,
  },

  commentName: {
    fontSize: 14,
    fontWeight: "700",
  },

  commentText: {
    marginTop: 4,
    fontSize: 14,
    color: "#111",
    lineHeight: 20,
  },

  commentTime: {
    marginTop: 6,
    fontSize: 12,
    color: "#9AA3B2",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
  },

  input: {
    flex: 1,
    height: 44,
    backgroundColor: "#F5F6FA",
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
  },

  sendBtn: {
    marginLeft: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#D9DBF9",
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnActive: {
    backgroundColor: "#6366F1",
  },
  emptyText: {
    textAlign: "center",
    color: "#9AA3B2",
    marginTop: 40,
    fontSize: 15,
  },
});
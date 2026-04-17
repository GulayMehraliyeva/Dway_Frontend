import React, {
  useEffect,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";


import EditIcon from "../../assets/icons/iconsax-trash (1).svg";

import ActivityCard from "../../components/community/ActivityCard";
import ChallengeCard from "../../components/community/ChallengeCard";
import { getCommunityData } from "../../services/communityService";
import {
  ActivityPost,
  Challenge,
} from "../../types/community";

export default function CommunityScreen() {
  const [activeTab, setActiveTab] =
    useState("activity");

  const [posts, setPosts] =
    useState<ActivityPost[]>([]);

  const [challenges, setChallenges] =
    useState<Challenge[]>([]);

  const [showNewPost, setShowNewPost] =
    useState(false);

  const [newPostText, setNewPostText] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data =
      await getCommunityData();

    setPosts(data.posts);
    setChallenges(data.challenges);
  };

  const handleAddPost = () => {
    if (!newPostText.trim()) return;

    const newPost: ActivityPost = {
      id: Date.now(),
      name: "You",
      time: "Just now",
      content: newPostText,
      badge: "Work",
      avatarColor: "#6C63FF",
      initial: "Y",
      likes: 0,
      comments: 0,
    };

    setPosts((prev) => [
      newPost,
      ...prev,
    ]);

    setNewPostText("");
    setShowNewPost(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Community
          </Text>
          <Text style={styles.subtitle}>
            Share your wins, find your tribe
          </Text>
        </View>

        {activeTab === "activity" && (
          <TouchableOpacity
            style={styles.newPostButton}
            onPress={() =>
              setShowNewPost(true)
            }
          >
            <EditIcon
              width={14}
              height={14}
            />
            <Text
              style={styles.newPostText}
            >
              New Post
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.toggleWrapper}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === "activity" &&
              styles.activeToggle,
          ]}
          onPress={() =>
            setActiveTab("activity")
          }
        >
          <Text
            style={[
              styles.toggleText,
              activeTab ===
                "activity" &&
                styles.activeText,
            ]}
          >
            Activity Feed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab ===
              "challenges" &&
              styles.activeToggle,
          ]}
          onPress={() =>
            setActiveTab(
              "challenges"
            )
          }
        >
          <Text
            style={[
              styles.toggleText,
              activeTab ===
                "challenges" &&
                styles.activeText,
            ]}
          >
            Challenges
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {activeTab ===
        "activity" ? (
          posts.length === 0 ? (
            <Text
              style={
                styles.emptyText
              }
            >
              No posts yet. Be the
              first to share!
            </Text>
          ) : (
            posts.map((item) => (
              <ActivityCard
                key={item.id}
                item={item}
              />
            ))
          )
        ) : challenges.length ===
          0 ? (
          <Text
            style={styles.emptyText}
          >
            No challenges available
            right now.
          </Text>
        ) : (
          challenges.map((item) => (
            <ChallengeCard
              key={item.id}
              item={item}
            />
          ))
        )}
      </ScrollView>

      <Modal
  visible={showNewPost}
  transparent
  animationType="slide"
>
  <TouchableWithoutFeedback onPress={() => { setShowNewPost(false); Keyboard.dismiss(); }}>
    <View style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>New Post</Text>

        <TextInput
          style={styles.input}
          placeholder="Share something..."
          value={newPostText}
          onChangeText={setNewPostText}
          multiline
        />

        <TouchableOpacity style={styles.postBtn} onPress={handleAddPost}>
          <Text style={styles.postBtnText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingTop: 70,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
  },

  subtitle: {
  fontSize: 14,
  color: "#9AA3B2",
  marginTop: 6,
},

  toggleWrapper: {
    flexDirection: "row",
    backgroundColor: "#F1F3F7",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  activeToggle: {
    backgroundColor: "#FFFFFF",
  },

  toggleText: {
    color: "#9AA3B2",
    fontWeight: "600",
  },

  activeText: {
    color: "#6C63FF",
  },
  scrollContent: {
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  newPostButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C63FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },

  newPostText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  emptyText: {
  textAlign: "center",
  color: "#9AA3B2",
  marginTop: 40,
},

modal: {
  flex: 1,
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,0.3)",
},

modalContent: {
  backgroundColor: "#FFFFFF",
  margin: 20,
  padding: 20,
  borderRadius: 20,
},

modalTitle: {
  fontSize: 20,
  fontWeight: "700",
  marginBottom: 14,
},

input: {
  minHeight: 120,
  borderWidth: 1,
  borderColor: "#ECECEC",
  borderRadius: 12,
  padding: 14,
  textAlignVertical: "top",
},

postBtn: {
  marginTop: 16,
  backgroundColor: "#6C63FF",
  borderRadius: 14,
  paddingVertical: 14,
  alignItems: "center",
},

postBtnText: {
  color: "#FFFFFF",
  fontWeight: "600",
},
});
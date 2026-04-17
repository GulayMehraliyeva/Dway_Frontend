import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AiIcon from "../../assets/icons/iconsax-ai-commentary.svg";


interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}


const AI_ENDPOINT = "https://your-backend.com/api/ai/chat";

const SUGGESTION_CHIPS = [
  "💡 Improve my productivity",
  "🎯 Help me set better goals",
  "⏰ Beat procrastination",
  "😴 Build a sleep routine",
];


function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function uid(): string {
  return Math.random().toString(36).slice(2);
}


function TypingIndicator() {
  return (
    <View style={styles.aiBubble}>
      <View style={styles.typingRow}>
        <View style={[styles.typingDot, { opacity: 0.4 }]} />
        <View style={[styles.typingDot, { opacity: 0.65 }]} />
        <View style={[styles.typingDot, { opacity: 0.9 }]} />
      </View>
    </View>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAi]}>
      {!isUser && (
        <View style={styles.avatarSmall}>
          <AiIcon width={18} height={18} />
        </View>
      )}
      <View style={{ maxWidth: "75%" }}>
        <View style={isUser ? styles.userBubble : styles.aiBubble}>
          <Text style={isUser ? styles.userBubbleText : styles.aiBubbleText}>
            {message.content}
          </Text>
        </View>
        <Text style={[styles.timestamp, isUser ? styles.timestampRight : styles.timestampLeft]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
}


export default function AiAssistantModal({ visible, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm D-WAY AI. I'm here to help you stay focused, motivated, and on track with your goals. How can I support you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isLoading]);

  const sendMessage = async (text: string = input) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    setShowSuggestions(false);

    const userMessage: Message = {
      id: uid(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {

      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      const replyText: string =
        data.reply ?? "Sorry, I couldn't process that. Please try again.";

      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: replyText, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: "I'm having connection issues right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (chip: string) => {
    const cleaned = chip.replace(/^[\p{Emoji}\s]+/u, "").trim();
    sendMessage(cleaned);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <AiIcon width={40} height={40} color="#fff" />
              <View>
                <Text style={styles.title}>D-WAY AI</Text>
                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.status}>Online · here to help</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={styles.closeBtn}>
                <Ionicons name="close" size={18} color="#6B7280" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <ScrollView
            ref={scrollRef}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <View style={[styles.messageRow, styles.messageRowAi]}>
                <View style={styles.avatarSmall}>
                  <AiIcon width={20} height={20} color="#fff" />

                </View>
                <TypingIndicator />
              </View>
            )}

            {showSuggestions && !isLoading && (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsLabel}>QUICK START</Text>
                <View style={styles.suggestionsRow}>
                  {SUGGESTION_CHIPS.map((chip) => (
                    <TouchableOpacity
                      key={chip}
                      style={styles.chip}
                      onPress={() => handleSuggestion(chip)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.chipText}>{chip}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputArea}>
            <Text style={styles.disclaimer}>D-WAY AI Assistant</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Ask D-WAY AI..."
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => sendMessage()}
                returnKeyType="send"
                multiline={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={[styles.sendButton, input.trim() && styles.sendButtonActive]}
                onPress={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="paper-plane-outline" size={17} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    height: "88%",
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },

  header: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  aiIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  status: {
    fontSize: 12,
    color: "#22C55E",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  // Messages
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 4,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-end",
    gap: 8,
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageRowAi: {
    justifyContent: "flex-start",
  },
  avatarSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    marginBottom: 16,
  },
  aiBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 18,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: "#6366F1",
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  aiBubbleText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#111827",
  },
  userBubbleText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#FFFFFF",
  },
  timestamp: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 4,
  },
  timestampLeft: {
    textAlign: "left",
    marginLeft: 4,
  },
  timestampRight: {
    textAlign: "right",
    marginRight: 4,
  },

  // Typing indicator
  typingRow: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#9CA3AF",
  },

  // Suggestions
  suggestionsContainer: {
    marginTop: 10,
    marginBottom: 4,
  },
  suggestionsLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 13,
    color: "#6366F1",
    fontWeight: "500",
  },

  // Input
  inputArea: {
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    backgroundColor: "#F3F4F6",
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 10,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 38,
    fontSize: 15,
    color: "#111827",
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#A5B4FC",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: "#6366F1",
  },
});
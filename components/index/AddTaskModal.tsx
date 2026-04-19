import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  TaskCategory,
  TaskPriority,
  CreatedTask,
} from "../../types/taskModal.types";
import { submitNewTask } from "../../services/taskModalService";

import BriefcaseIcon   from "../../assets/icons/iconsax-briefcase.svg";
import LovelyIcon      from "../../assets/icons/iconsax-lovely.svg";
import WeightIcon      from "../../assets/icons/iconsax-ai-weight.svg";
import BookIcon        from "../../assets/icons/iconsax-book-open.svg";
import UserIcon        from "../../assets/icons/iconsax-user.svg";
import CoinIcon        from "../../assets/icons/iconsax-coin-1.svg";
import PeopleIcon      from "../../assets/icons/iconsax-people.svg";
import DesignToolsIcon from "../../assets/icons/iconsax-designtools.svg";
import HomeIcon        from "../../assets/icons/iconsax-home.svg";
import MoreIcon        from "../../assets/icons/iconsax-3-dots-more.svg";

export type TaskPeriod = "Daily" | "Weekly" | "Monthly" | "Yearly";

interface Props {
  visible: boolean;
  onClose: () => void;
  onTaskAdded: (task: CreatedTask) => void;
  styles: any;
  pushNotificationsEnabled: boolean;
}

// ─── TimeWheel ────────────────────────────────────────────────────────────────
function TimeWheel({
  data,
  selected,
  onEnd,
  styles,
}: {
  data: number[];
  selected: number;
  onEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  styles: any;
}) {
  const ITEM_HEIGHT = 36;
  const wheelRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      wheelRef.current?.scrollTo({ y: selected * ITEM_HEIGHT, animated: false });
    }, 0);
    return () => clearTimeout(timer);
  }, [selected]);

  return (
    <View style={styles.wheelContainer}>
      <View style={styles.wheelHighlightTop} />
      <View style={styles.wheelHighlightBottom} />
      <ScrollView
        ref={wheelRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
        onMomentumScrollEnd={onEnd}
      >
        {data.map((item) => {
          const active = item === selected;
          return (
            <View key={item} style={styles.wheelItem}>
              <Text style={[styles.wheelText, active && styles.wheelTextActive]}>
                {String(item).padStart(2, "0")}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORY_STYLES = {
  work:     { text: "#6366F1", background: "#EEF0FF", border: "#D9DEFF" },
  health:   { text: "#47C36D", background: "#EAFBF0", border: "#CDEFD7" },
  sport:    { text: "#F4B740", background: "#FFF8E8", border: "#FDE7B5" },
  learning: { text: "#4B7BEC", background: "#EDF4FF", border: "#D8E6FF" },
  personal: { text: "#8B5CF6", background: "#F3ECFF", border: "#E4D8FF" },
  finance:  { text: "#14B8A6", background: "#E8FBF8", border: "#C6F3EC" },
  social:   { text: "#EC4899", background: "#FDECF5", border: "#F9D3E8" },
  creative: { text: "#F97316", background: "#FFF1E8", border: "#FFD8BF" },
  home:     { text: "#6B7280", background: "#F3F4F6", border: "#E5E7EB" },
  other:    { text: "#9CA3AF", background: "#F8F9FA", border: "#E5E7EB" },
};

const PERIOD_OPTIONS: TaskPeriod[] = ["Daily", "Weekly", "Monthly", "Yearly"];

const PERIOD_DESCRIPTIONS: Record<TaskPeriod, string> = {
  Daily:   "Complete today · reminders sent daily",
  Weekly:  "Complete in 7 days · reminders sent daily",
  Monthly: "Complete in 30 days · reminders sent daily",
  Yearly:  "Complete in 365 days · reminders sent daily",
};

// ─── Category icon renderer ───────────────────────────────────────────────────
const renderCategoryIcon = (type: TaskCategory, size = 16, color?: string) => {
  const iconColor = color || CATEGORY_STYLES[type].text;
  switch (type) {
    case "work":     return <BriefcaseIcon   width={size} height={size} stroke={iconColor} color={iconColor} />;
    case "health":   return <LovelyIcon      width={size} height={size} stroke={iconColor} color={iconColor} />;
    case "sport":    return <WeightIcon      width={size} height={size} stroke={iconColor} color={iconColor} />;
    case "learning": return <BookIcon        width={size} height={size} stroke={iconColor} color={iconColor} />;
    case "personal": return <UserIcon        width={size} height={size} stroke={iconColor} color={iconColor} />;
    case "finance":  return <CoinIcon        width={size} height={size} stroke={iconColor} color={iconColor} />;
    case "social":   return <PeopleIcon      width={size} height={size} stroke={iconColor} color={iconColor} />;
    case "creative": return <DesignToolsIcon width={size} height={size} stroke={iconColor} color={iconColor} />;
    case "home":     return <HomeIcon        width={size} height={size} stroke={iconColor} color={iconColor} />;
    case "other":    return <MoreIcon        width={size} height={size} stroke={iconColor} color={iconColor} />;
    default:         return <BriefcaseIcon   width={size} height={size} stroke={iconColor} color={iconColor} />;
  }
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AddTaskModal({
  visible,
  onClose,
  onTaskAdded,
  styles,
  pushNotificationsEnabled,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const now = new Date();

  const [title,            setTitle]            = useState("");
  const [notes,            setNotes]            = useState("");
  const [loading,          setLoading]          = useState(false);
  // Alarm toggle — kept for future use. Does NOT control notification sending;
  // that is governed by the Push Notifications switch in Profile.
  const [alarmEnabled,     setAlarmEnabled]     = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>("work");
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>("Low");
  const [selectedPeriod,   setSelectedPeriod]   = useState<TaskPeriod>("Daily");
  const [selectedHour,     setSelectedHour]     = useState(now.getHours());
  const [selectedMinute,   setSelectedMinute]   = useState(now.getMinutes());
  const [selectedTime,     setSelectedTime]     = useState(now);

  const ITEM_HEIGHT = 36;
  const hours   = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    const updatedTime = new Date();
    updatedTime.setHours(selectedHour);
    updatedTime.setMinutes(selectedMinute);
    updatedTime.setSeconds(0);
    updatedTime.setMilliseconds(0);
    if (updatedTime <= new Date()) {
      updatedTime.setDate(updatedTime.getDate() + 1);
    }
    setSelectedTime(updatedTime);
  }, [selectedHour, selectedMinute]);

  const onWheelEnd =
    (setter: (value: number) => void, max: number) =>
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      setter(Math.max(0, Math.min(Math.round(y / ITEM_HEIGHT), max)));
    };

  const resetForm = () => {
    const freshNow = new Date();
    setTitle("");
    setNotes("");
    setAlarmEnabled(false);
    setSelectedCategory("work");
    setSelectedPriority("Low");
    setSelectedPeriod("Daily");
    setSelectedHour(freshNow.getHours());
    setSelectedMinute(freshNow.getMinutes());
    setSelectedTime(freshNow);
  };

  const handleClose = () => { resetForm(); onClose(); };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const result = await submitNewTask({
        title,
        notes,
        category: selectedCategory,
        priority: selectedPriority,
        period: selectedPeriod,
        reminderTime: selectedTime,
        pushNotificationsEnabled,
      });
      if (result.success) { onTaskAdded(result.task); handleClose(); }
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={{ flex: 1 }} onPress={handleClose} />

        <View style={styles.taskModal}>
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View style={styles.dragBar} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Task</Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={24} color="#111" />
              </TouchableOpacity>
            </View>

            {/* ── TASK TITLE ── */}
            <Text style={styles.label}>TASK TITLE</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="What do you need to do?"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
            />

            {/* ── ALARM REMINDER — kept for future use ── */}
            <View style={styles.alarmRow}>
              <View style={styles.alarmLeft}>
                <View style={styles.alarmIcon}>
                  <Ionicons name="notifications" size={16} color="#fff" />
                </View>
                <Text style={{ fontSize: 16 }}>Alarm Reminder</Text>
              </View>
              <TouchableOpacity
                onPress={() => setAlarmEnabled(!alarmEnabled)}
                style={[styles.switch, alarmEnabled && styles.switchActive]}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.switchThumb,
                    { transform: [{ translateX: alarmEnabled ? 20 : 0 }] },
                  ]}
                />
              </TouchableOpacity>
            </View>

            {/* ── PERIOD ── */}
            <Text style={styles.label}>PERIOD</Text>
            <View style={local.periodRow}>
              {PERIOD_OPTIONS.map((period) => {
                const active = selectedPeriod === period;
                return (
                  <TouchableOpacity
                    key={period}
                    style={[local.periodBtn, active && local.periodBtnActive]}
                    onPress={() => setSelectedPeriod(period)}
                  >
                    <Text style={[local.periodBtnText, active && local.periodBtnTextActive]}>
                      {period}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={local.periodDesc}>{PERIOD_DESCRIPTIONS[selectedPeriod]}</Text>

            {/* ── DAILY REMINDER TIME (always visible) ── */}
            <Text style={styles.label}>DAILY REMINDER TIME</Text>
            <View style={styles.durationBox}>
              <View style={styles.durationPickerRow}>
                <TimeWheel
                  data={hours}
                  selected={selectedHour}
                  onEnd={onWheelEnd(setSelectedHour, 23)}
                  styles={styles}
                />
                <Text style={styles.durationColon}>:</Text>
                <TimeWheel
                  data={minutes}
                  selected={selectedMinute}
                  onEnd={onWheelEnd(setSelectedMinute, 59)}
                  styles={styles}
                />
              </View>
              <View style={styles.durationLabels}>
                <Text style={styles.durationLabel}>Hours</Text>
                <Text style={styles.durationLabel}>Minutes</Text>
              </View>
            </View>

            {/* ── Notification status hint (reflects Profile toggle) ── */}
            <View style={local.notifHint}>
              <Ionicons
                name={pushNotificationsEnabled ? "notifications" : "notifications-off"}
                size={14}
                color={pushNotificationsEnabled ? "#6366F1" : "#9CA3AF"}
              />
              <Text style={[local.notifHintText, { color: pushNotificationsEnabled ? "#6366F1" : "#9CA3AF" }]}>
                {pushNotificationsEnabled
                  ? "Reminders will be sent at this time"
                  : "Enable push notifications in Profile to receive reminders"}
              </Text>
            </View>

            {/* ── CATEGORY ── */}
            <Text style={styles.label}>CATEGORY</Text>
            <View style={styles.categoryWrap}>
              {(["work","health","sport","learning","personal","finance","social","creative","home","other"] as TaskCategory[]).map((item) => {
                const active = selectedCategory === item;
                const iconColor = active ? "#6366F1" : "#9CA3AF";
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.categoryItem, active && styles.categoryActive]}
                    onPress={() => setSelectedCategory(item)}
                  >
                    <View style={styles.categoryContent}>
                      {renderCategoryIcon(item, 14, iconColor)}
                      <Text style={[styles.categoryText, { color: iconColor, fontWeight: active ? "600" : "400" }]}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ── PRIORITY ── */}
            <Text style={styles.label}>PRIORITY</Text>
            <View style={styles.priorityRow}>
              {(["Low","Medium","High"] as TaskPriority[]).map((p) => {
                const active = selectedPriority === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[styles.priorityBtn, active && styles.priorityActive]}
                    onPress={() => setSelectedPriority(p)}
                  >
                    <Text style={[styles.priorityText, active && styles.priorityTextActive]}>{p}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ── NOTES ── */}
            <Text style={styles.label}>NOTES (OPTIONAL)</Text>
            <TextInput
              style={styles.notesBox}
              placeholder="Add notes..."
              placeholderTextColor="#9CA3AF"
              value={notes}
              onChangeText={setNotes}
              multiline
              blurOnSubmit
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.addTaskBtn} onPress={handleSubmit} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.addTaskText}>Add Task</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Local styles (only for elements added in this file) ─────────────────────
const local = StyleSheet.create({
  periodRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  periodBtn: {
    flex: 1,
    minWidth: 70,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D7D7D7",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  periodBtnActive: {
    borderColor: "#6366F1",
    backgroundColor: "#EEF2FF",
  },
  periodBtnText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "400" as const,
  },
  periodBtnTextActive: {
    color: "#6366F1",
    fontWeight: "600" as const,
  },
  periodDesc: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 12,
    color: "#9CA3AF",
  },
  notifHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    marginBottom: 4,
  },
  notifHintText: {
    fontSize: 12,
    flexShrink: 1,
  },
});
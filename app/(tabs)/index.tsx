import React, { useState, useRef, useEffect } from "react";
import { router } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import { getHomeData } from "../../services/indexService";
import { notificationStore } from "../../services/notificationStore";
import { HomeData, Task } from "../../types/index";
import AddTaskModal from "../../components/index/AddTaskModal";
import { CreatedTask } from "../../types/taskModal.types";
import AiAssistantModal from "../../components/index/AiAssistantModal";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

import MenuIcon         from "../../assets/icons/iconsax-menu.svg";
import BriefcaseIcon    from "../../assets/icons/iconsax-briefcase.svg";
import LovelyIcon       from "../../assets/icons/iconsax-lovely.svg";
import WeightIcon       from "../../assets/icons/iconsax-ai-weight.svg";
import BookIcon         from "../../assets/icons/iconsax-book-open.svg";
import UserIcon         from "../../assets/icons/iconsax-user.svg";
import CoinIcon         from "../../assets/icons/iconsax-coin-1.svg";
import PeopleIcon       from "../../assets/icons/iconsax-people.svg";
import DesignToolsIcon  from "../../assets/icons/iconsax-designtools.svg";
import HomeIcon         from "../../assets/icons/iconsax-home.svg";
import MoreIcon         from "../../assets/icons/iconsax-3-dots-more.svg";
import AiIcon           from "../../assets/icons/iconsax-ai-commentary.svg";
import DownIcon         from "../../assets/icons/icon-park-outline_down.svg";
import DailyIcon        from "../../assets/icons/iconsax-sun.svg";
import WeeklyIcon       from "../../assets/icons/iconsax-calendar.svg";
import MonthlyIcon      from "../../assets/icons/iconsax-layer.svg";
import YearlyIcon       from "../../assets/icons/iconsax-calendar-circle.svg";
import SelectIcon       from "../../assets/icons/iconsax-lovely (1).svg";
import TrashIcon        from "../../assets/icons/iconsax-trash.svg";

const CATEGORY_STYLES = {
  all:      { text: "#6366F1", background: "#EEF0FF", border: "#6366F1"  },
  work:     { text: "#6366F1", background: "#EEF0FF", border: "#D9DEFF"  },
  health:   { text: "#47C36D", background: "#EAFBF0", border: "#CDEFD7"  },
  sport:    { text: "#F4B740", background: "#FFF8E8", border: "#FDE7B5"  },
  learning: { text: "#4B7BEC", background: "#EDF4FF", border: "#D8E6FF"  },
  personal: { text: "#8B5CF6", background: "#F3ECFF", border: "#E4D8FF"  },
  finance:  { text: "#14B8A6", background: "#E8FBF8", border: "#C6F3EC"  },
  social:   { text: "#EC4899", background: "#FDECF5", border: "#F9D3E8"  },
  creative: { text: "#F97316", background: "#FFF1E8", border: "#FFD8BF"  },
  home:     { text: "#6B7280", background: "#F3F4F6", border: "#E5E7EB"  },
  other:    { text: "#9CA3AF", background: "#F8F9FA", border: "#E5E7EB"  },
};

const PRIORITY_STYLES = {
  Low:    { background: "#EAFBF0", text: "#16A34A" },
  Medium: { background: "#FEF3C7", text: "#D97706" },
  High:   { background: "#FEE2E2", text: "#DC2626" },
};

type FilterCategory =
  | "all" | "work" | "health" | "sport" | "learning"
  | "personal" | "finance" | "social" | "creative" | "home" | "other";

type PeriodType = "Daily" | "Weekly" | "Monthly" | "Yearly";

function TaskCard({
  id, title, time, type = "work", priority, notes, period, onComplete, onDelete,
}: {
  id: number;
  title: string;
  time: string;
  type: "work"|"health"|"sport"|"learning"|"personal"|"finance"|"social"|"creative"|"home"|"other";
  priority: "Low"|"Medium"|"High";
  notes?: string;
  period?: string;
  onComplete: (id: number) => void;
  onDelete:   (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const renderBadgeIcon = () => {
    const c = CATEGORY_STYLES[type].text;
    if (type === "health")   return <LovelyIcon       width={12} height={12} color={c} stroke={c} />;
    if (type === "sport")    return <WeightIcon        width={12} height={12} color={c} stroke={c} />;
    if (type === "learning") return <BookIcon          width={12} height={12} color={c} stroke={c} />;
    if (type === "personal") return <UserIcon          width={12} height={12} color={c} stroke={c} />;
    if (type === "finance")  return <CoinIcon          width={12} height={12} color={c} stroke={c} />;
    if (type === "social")   return <PeopleIcon        width={12} height={12} color={c} stroke={c} />;
    if (type === "creative") return <DesignToolsIcon   width={12} height={12} color={c} stroke={c} />;
    if (type === "home")     return <HomeIcon          width={12} height={12} color={c} stroke={c} />;
    if (type === "other")    return <MoreIcon          width={12} height={12} color={c} stroke={c} />;
    return                          <BriefcaseIcon     width={12} height={12} color={c} stroke={c} />;
  };

  return (
    <View style={styles.taskCard}>
      <View style={styles.taskTop}>
        <TouchableOpacity style={styles.circle} onPress={() => onComplete(id)} activeOpacity={0.7} />
        <Text style={styles.taskTitle}>{title}</Text>
        <TouchableOpacity style={styles.trashWrapper} onPress={() => onDelete(id)} activeOpacity={0.7}>
          <TrashIcon width={20} height={20} />
        </TouchableOpacity>
      </View>

      {notes ? (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.taskNotes} numberOfLines={expanded ? undefined : 2}>{notes}</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.taskMeta}>
        <View style={[styles.taskBadge, { backgroundColor: CATEGORY_STYLES[type].background }]}>
          {renderBadgeIcon()}
          <Text style={[styles.badge, { color: CATEGORY_STYLES[type].text }]}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_STYLES[priority].background }]}>
          <Text style={[styles.priorityText, { color: PRIORITY_STYLES[priority].text }]}>{priority}</Text>
        </View>
        <Text style={[styles.dot, { color: CATEGORY_STYLES[type].text }]}>•</Text>
        <Text style={styles.time}>◷ {time}</Text>
        {/* Period badge */}
        {period && (
          <>
            <Text style={[styles.dot, { color: "#C4C4C4" }]}>•</Text>
            <View style={styles.periodBadge}>
              <Text style={styles.periodBadgeText}>{period}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

function TimeWheel({
  data, selected, onEnd,
}: {
  data: number[];
  selected: number;
  onEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  const ITEM_HEIGHT = 36;
  return (
    <View style={styles.wheelContainer}>
      <View style={styles.wheelHighlightTop} />
      <View style={styles.wheelHighlightBottom} />
      <ScrollView
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

function filterTasks<T extends { type: string; period?: string }>(
  tasks: T[],
  period: PeriodType,
  category: FilterCategory
): T[] {
  return tasks.filter((t) => {
    const periodMatch = !t.period || t.period === period;
    const categoryMatch = category === "all" || t.type === category;
    return periodMatch && categoryMatch;
  });
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [showDropdown,     setShowDropdown]     = useState(false);
  const [showTimer,        setShowTimer]        = useState(false);
  const [selectedHour,     setSelectedHour]     = useState(0);
  const [selectedSecond,   setSelectedSecond]   = useState(0);
  const [isRunning,        setIsRunning]        = useState(false);
  const [selectedMinute,   setSelectedMinute]   = useState(0);
  const [selectedPreset,   setSelectedPreset]   = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [totalDuration,    setTotalDuration]    = useState(0);
  const [showTaskModal,    setShowTaskModal]    = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");
  const [selectedPeriod,   setSelectedPeriod]   = useState<PeriodType>("Daily");
  const [showAiModal,      setShowAiModal]      = useState(false);

  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(
    () => notificationStore.get()
  );

  const animatedProgress = useRef(new Animated.Value(0)).current;

  const ITEM_HEIGHT = 36;
  const hours   = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const seconds = Array.from({ length: 60 }, (_, i) => i);

  const onWheelEnd =
    (setter: (v: number) => void, max: number) =>
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      setter(Math.max(0, Math.min(Math.round(y / ITEM_HEIGHT), max)));
    };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) { clearInterval(interval); setIsRunning(false); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const next = totalDuration > 0 ? remainingSeconds / totalDuration : 0;
    Animated.timing(animatedProgress, { toValue: next, duration: 1000, useNativeDriver: false }).start();
  }, [remainingSeconds, totalDuration, animatedProgress]);

  const formatTime = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };

  useEffect(() => {
    if (!isRunning) {
      const total = selectedHour * 3600 + selectedMinute * 60 + selectedSecond;
      setRemainingSeconds(total);
      setTotalDuration(total);
    }
  }, [selectedHour, selectedMinute, selectedSecond, isRunning]);

  const radius        = 80;
  const strokeWidth   = 6;
  const circumference = 2 * Math.PI * radius;
  const animatedStrokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1], outputRange: [circumference, 0],
  });

  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const result = await getHomeData();
    setData(result);
    setSelectedPeriod(result.title as PeriodType);
  };

  const handleOpenTaskModal = () => {
    setPushNotificationsEnabled(notificationStore.get());
    setShowTaskModal(true);
  };

  const handleCompleteTask = (taskId: number) => {
    if (!data) return;
    const task = data.inProgressTasks.find((t) => t.id === taskId);
    if (!task) return;
    setData({
      ...data,
      inProgressTasks:    data.inProgressTasks.filter((t) => t.id !== taskId),
      completedTasksList: [{ ...task, completed: true }, ...data.completedTasksList],
      stats: { ...data.stats, completedTasks: data.stats.completedTasks + 1 },
    });
  };

  const handleUncompleteTask = (taskId: number) => {
    if (!data) return;
    const task = data.completedTasksList.find((t) => t.id === taskId);
    if (!task) return;
    setData({
      ...data,
      completedTasksList: data.completedTasksList.filter((t) => t.id !== taskId),
      inProgressTasks:    [{ ...task, completed: false }, ...data.inProgressTasks],
      stats: { ...data.stats, completedTasks: Math.max(0, data.stats.completedTasks - 1) },
    });
  };

  const handleDeleteTask = (taskId: number) => {
    if (!data) return;
    const existsCompleted = data.completedTasksList.some((t) => t.id === taskId);
    setData({
      ...data,
      inProgressTasks:    data.inProgressTasks.filter((t) => t.id !== taskId),
      completedTasksList: data.completedTasksList.filter((t) => t.id !== taskId),
      stats: {
        ...data.stats,
        totalTasks:     Math.max(0, data.stats.totalTasks - 1),
        completedTasks: existsCompleted
          ? Math.max(0, data.stats.completedTasks - 1)
          : data.stats.completedTasks,
      },
    });
  };

  const handleTaskAdded = (newTask: CreatedTask) => {
    if (!data) return;
    setData({
      ...data,
      inProgressTasks: [newTask, ...data.inProgressTasks],
      stats: { ...data.stats, totalTasks: data.stats.totalTasks + 1 },
    });
  };

  const handleSelectPeriod = (period: PeriodType) => {
    if (!data) return;
    setSelectedPeriod(period);
    setShowDropdown(false);
    setData({ ...data, title: period });
  };

  const filteredInProgress = filterTasks(
    data?.inProgressTasks ?? [],
    selectedPeriod,
    selectedCategory
  );

  const filteredCompleted = filterTasks(
    data?.completedTasksList ?? [],
    selectedPeriod,
    selectedCategory
  );

  // Stats shown in subtitle reflect only the currently visible period
  const allPeriodTasks      = filterTasks(
    [...(data?.inProgressTasks ?? []), ...(data?.completedTasksList ?? [])],
    selectedPeriod,
    "all"
  );
  const completedPeriodCount = filterTasks(
    data?.completedTasksList ?? [],
    selectedPeriod,
    "all"
  ).length;
  const totalPeriodCount = allPeriodTasks.length;

  if (!data) return null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Header ── */}
        <View style={styles.headerWrapper}>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <TouchableOpacity style={styles.titleRow} onPress={() => setShowDropdown(!showDropdown)}>
                <Text style={styles.title}>{selectedPeriod}</Text>
                <View style={styles.downIconWrapper}><DownIcon width={24} height={24} /></View>
              </TouchableOpacity>

              <Text style={styles.subtitle}>
                <Text style={{ color: "#6366F1" }}>{completedPeriodCount}</Text>
                {" "}of{" "}
                <Text style={{ color: "#6366F1" }}>{totalPeriodCount}</Text>
                {" "}tasks completed
              </Text>

              {showDropdown && (
                <View style={styles.dropdownMenu}>
                  {(["Daily","Weekly","Monthly","Yearly"] as PeriodType[]).map((p) => {
                    const Icon =
                      p === "Daily"   ? DailyIcon   :
                      p === "Weekly"  ? WeeklyIcon  :
                      p === "Monthly" ? MonthlyIcon : YearlyIcon;
                    return (
                      <TouchableOpacity
                        key={p}
                        style={selectedPeriod === p ? styles.dropdownActiveRow : styles.dropdownRow}
                        onPress={() => handleSelectPeriod(p)}
                      >
                        <Icon width={16} height={16} />
                        <Text style={selectedPeriod === p ? styles.dropdownActive : styles.dropdownText}>{p}</Text>
                        {selectedPeriod === p && <SelectIcon width={16} height={16} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.notification} onPress={() => setShowAiModal(true)}>
              <AiIcon width={52} height={52} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Motivation card ── */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationLabel}>DAILY MOTIVATION</Text>
          <Text style={styles.quote}>{data.motivation.quote}</Text>
          <Text style={styles.author}>— {data.motivation.author}</Text>
        </View>

        {/* ── Category filter tabs ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {([
            { key: "all",      label: "All",      Icon: MenuIcon        },
            { key: "work",     label: "Work",     Icon: BriefcaseIcon   },
            { key: "health",   label: "Health",   Icon: LovelyIcon      },
            { key: "sport",    label: "Sport",    Icon: WeightIcon      },
            { key: "learning", label: "Learning", Icon: BookIcon        },
            { key: "personal", label: "Personal", Icon: UserIcon        },
            { key: "finance",  label: "Finance",  Icon: CoinIcon        },
            { key: "social",   label: "Social",   Icon: PeopleIcon      },
            { key: "creative", label: "Creative", Icon: DesignToolsIcon },
            { key: "home",     label: "Home",     Icon: HomeIcon        },
            { key: "other",    label: "Other",    Icon: MoreIcon        },
          ] as { key: FilterCategory; label: string; Icon: any }[]).map(({ key, label, Icon }) => {
            const active = selectedCategory === key;
            return (
              <TouchableOpacity
                key={key}
                style={active ? styles.activeTab : styles.tab}
                onPress={() => setSelectedCategory(key)}
              >
                <View style={styles.tabContent}>
                  <Icon width={16} height={16}
                    color={active ? "#6366F1" : "#9A9A9A"}
                    stroke={active ? "#6366F1" : "#9A9A9A"}
                    fill="none"
                  />
                  <Text style={active ? styles.activeTabText : styles.tabText}>{label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── In Progress ── */}
        <Text style={styles.section}>IN PROGRESS</Text>
        {filteredInProgress.length === 0 ? (
          <Text style={styles.emptyText}>No {selectedPeriod.toLowerCase()} tasks here</Text>
        ) : (
          filteredInProgress.map((task) => (
            <TaskCard
              key={task.id} id={task.id} title={task.title} time={task.time}
              type={task.type} priority={task.priority} notes={task.notes}
              // period={(task as any).period}
              onComplete={handleCompleteTask} onDelete={handleDeleteTask}
            />
          ))
        )}

        {/* ── Completed ── */}
        <Text style={styles.section}>COMPLETED</Text>
        {filteredCompleted.length === 0 ? (
          <Text style={styles.emptyText}>No {selectedPeriod.toLowerCase()} tasks here</Text>
        ) : (
          filteredCompleted.map((task) => (
            <View key={task.id} style={styles.completedCard}>
              <View style={styles.completedTop}>
                <TouchableOpacity style={styles.completedCircle} onPress={() => handleUncompleteTask(task.id)} activeOpacity={0.7}>
                  <Ionicons name="checkmark" size={14} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.completedText}>{task.title}</Text>
                <TouchableOpacity style={styles.trashWrapper} onPress={() => handleDeleteTask(task.id)} activeOpacity={0.7}>
                  <TrashIcon width={20} height={20} />
                </TouchableOpacity>
              </View>
              {task.notes ? <Text style={styles.taskNotes} numberOfLines={2}>{task.notes}</Text> : null}
              <View style={styles.taskMeta}>
                <View style={[styles.taskBadge, { backgroundColor: CATEGORY_STYLES[task.type].background }]}>
                  <Text style={[styles.badge, { color: CATEGORY_STYLES[task.type].text }]}>
                    {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                  </Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_STYLES[task.priority].background }]}>
                  <Text style={[styles.priorityText, { color: PRIORITY_STYLES[task.priority].text }]}>{task.priority}</Text>
                </View>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.time}>◷ {task.time}</Text>
                {/* {(task as any).period && (
                  <>
                    <Text style={[styles.dot, { color: "#C4C4C4" }]}>•</Text>
                    <View style={styles.periodBadge}>
                      <Text style={styles.periodBadgeText}>{(task as any).period}</Text>
                    </View>
                  </>
                )} */}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ── FAB buttons ── */}
      <TouchableOpacity style={styles.plusButton} onPress={handleOpenTaskModal}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.clockButton} onPress={() => setShowTimer(true)}>
        <Ionicons name="time-outline" size={22} color="#111" />
      </TouchableOpacity>

      {/* ── Timer modal ── */}
      <Modal visible={showTimer} transparent animationType="slide" onRequestClose={() => setShowTimer(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowTimer(false)} />
          <View style={styles.timerSheet}>
            <View style={styles.dragBar} />
            <View style={styles.timerHeader}>
              <Text style={styles.timerTitle}>Timer</Text>
              <Text style={styles.timerSub}>0 sessions today</Text>
            </View>

            <Text style={styles.timerSection}>QUICK PRESETS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
              {[5, 10, 15, 25, 45].map((preset) => {
                const active = selectedPreset === preset;
                return (
                  <TouchableOpacity
                    key={preset}
                    style={active ? styles.activePreset : styles.preset}
                    onPress={() => {
                      setSelectedPreset(preset);
                      setSelectedHour(0); setSelectedMinute(preset); setSelectedSecond(0);
                      setTotalDuration(preset * 60); setRemainingSeconds(preset * 60);
                    }}
                  >
                    <Text style={active ? styles.activePresetText : styles.presetText}>{preset} min</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.timerSection}>CUSTOM DURATION</Text>
            <View style={styles.durationBox}>
              <View style={styles.durationPickerRow}>
                <TimeWheel data={hours}   selected={selectedHour}   onEnd={onWheelEnd(setSelectedHour,   23)} />
                <Text style={styles.durationColon}>:</Text>
                <TimeWheel data={minutes} selected={selectedMinute} onEnd={onWheelEnd(setSelectedMinute, 59)} />
                <Text style={styles.durationColon}>:</Text>
                <TimeWheel data={seconds} selected={selectedSecond} onEnd={onWheelEnd(setSelectedSecond, 59)} />
              </View>
              <View style={styles.durationLabels}>
                <Text style={styles.durationLabel}>Hours</Text>
                <Text style={styles.durationLabel}>Minutes</Text>
                <Text style={styles.durationLabel}>Seconds</Text>
              </View>
            </View>

            <View style={styles.timerCircleWrapper}>
              <Svg width={170} height={170}>
                <Circle cx="85" cy="85" r={radius} stroke="#E5E7EB" strokeWidth={strokeWidth} fill="none" />
                <AnimatedCircle
                  cx="85" cy="85" r={radius} stroke="#6366F1" strokeWidth={strokeWidth} fill="none"
                  strokeDasharray={circumference} strokeDashoffset={animatedStrokeDashoffset}
                  strokeLinecap="round" rotation="-90" origin="85,85"
                />
              </Svg>
              <View style={styles.circleContent}>
                <Text style={styles.bigTime}>{formatTime(remainingSeconds)}</Text>
                <Text style={styles.readyText}>{isRunning ? "Running" : "Ready"}</Text>
              </View>
            </View>

            <View style={styles.timerControls}>
              <TouchableOpacity style={styles.sideBtn} onPress={() => { setIsRunning(false); setRemainingSeconds(selectedHour * 3600 + selectedMinute * 60 + selectedSecond); }}>
                <Ionicons name="refresh-outline" size={22} color="#111" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.playBtn} onPress={() => {
                if (!isRunning && remainingSeconds === 0) {
                  setRemainingSeconds(selectedHour * 3600 + selectedMinute * 60 + selectedSecond);
                }
                setIsRunning((prev) => !prev);
              }}>
                <Ionicons name={isRunning ? "pause" : "play"} size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideBtn} onPress={() => { setIsRunning(false); setShowTimer(false); }}>
                <Ionicons name="close" size={22} color="#111" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Add Task modal ── */}
      <AddTaskModal
        visible={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onTaskAdded={handleTaskAdded}
        styles={styles}
        pushNotificationsEnabled={pushNotificationsEnabled}
      />

      <AiAssistantModal visible={showAiModal} onClose={() => setShowAiModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:            { flex: 1, backgroundColor: "#FAFAFA", paddingHorizontal: 20, paddingTop: 50 },
  scrollContent:        { paddingBottom: 160 },
  headerWrapper:        { position: "relative", zIndex: 1000 },
  headerRow:            { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  titleContainer:       { position: "relative" },
  titleRow:             { flexDirection: "row", alignItems: "center" },
  title:                { fontSize: 38, fontWeight: "700" },
  downIconWrapper:      { marginLeft: 4, marginTop: 8 },
  subtitle:             { marginTop: 8, color: "#8A94A6", fontSize: 16 },
  notification:         { width: 54, height: 54, borderRadius: 27, backgroundColor: "#6366F1", justifyContent: "center", alignItems: "center" },
  dropdownMenu:         { position: "absolute", top: 95, left: 0, width: 180, backgroundColor: "#FFFFFF", borderRadius: 16, padding: 8, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, elevation: 6, zIndex: 1000 },
  dropdownActiveRow:    { flexDirection: "row", alignItems: "center", backgroundColor: "#ECEEFB", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 8, gap: 8, minHeight: 40 },
  dropdownRow:          { flexDirection: "row", alignItems: "center", paddingVertical: 16, paddingHorizontal: 12, gap: 8 },
  dropdownActive:       { fontSize: 18, color: "#6366F1", fontWeight: "500" },
  dropdownText:         { fontSize: 18, color: "#111111", fontWeight: "400" },
  motivationCard:       { marginTop: 24, backgroundColor: "#ECECFA", borderRadius: 24, padding: 22, borderLeftWidth: 3, borderLeftColor: "#6366F1" },
  motivationLabel:      { color: "#6366F1", fontWeight: "700", fontSize: 12, marginBottom: 10 },
  quote:                { fontSize: 16, lineHeight: 24, color: "#111" },
  author:               { marginTop: 10, color: "#999" },
  activeTab:            { marginTop: 24, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 24, borderWidth: 2, borderColor: "#6366F1", backgroundColor: "#EEF0FF", marginRight: 10 },
  activeTabText:        { color: "#6366F1", fontSize: 15, marginLeft: 6, fontWeight: "500" },
  tabContent:           { flexDirection: "row", alignItems: "center" },
  tab:                  { marginTop: 24, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 24, borderWidth: 1.5, borderColor: "#D7D7D7", backgroundColor: "#F8F8F8", marginRight: 10 },
  tabText:              { color: "#9A9A9A", fontSize: 15, marginLeft: 6, fontWeight: "400" },
  section:              { marginTop: 28, marginBottom: 16, color: "#8A94A6", fontWeight: "700", fontSize: 16 },
  taskCard:             { backgroundColor: "#fff", borderRadius: 22, padding: 18, marginBottom: 14, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 3 },
  taskTop:              { flexDirection: "row", alignItems: "center" },
  circle:               { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: "#BEBEBE", marginRight: 12 },
  taskTitle:            { flex: 1, fontSize: 18 },
  taskMeta:             { flexDirection: "row", marginTop: 14, marginLeft: 34, alignItems: "center", flexWrap: "wrap", gap: 2 },
  taskBadge:            { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 13, minHeight: 22 },
  badge:                { fontSize: 15, marginLeft: 4 },
  dot:                  { marginHorizontal: 6, color: "#C4C4C4" },
  time:                 { color: "#888", fontSize: 13 },
  periodBadge:          { backgroundColor: "#F3F4F6", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  periodBadgeText:      { fontSize: 11, color: "#6B7280", fontWeight: "600" },
  completedCard:        { backgroundColor: "#fff", borderRadius: 22, padding: 18, marginBottom: 14, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 3 },
  completedTop:         { flexDirection: "row", alignItems: "center" },
  completedCircle:      { width: 22, height: 22, borderRadius: 11, backgroundColor: "#6366F1", justifyContent: "center", alignItems: "center", marginRight: 12 },
  completedText:        { flex: 1, textDecorationLine: "line-through", color: "#A0A0A0", fontSize: 18 },
  plusButton:           { position: "absolute", right: 24, bottom: 95, width: 62, height: 62, borderRadius: 31, backgroundColor: "#6366F1", justifyContent: "center", alignItems: "center" },
  clockButton:          { position: "absolute", left: 24, bottom: 95, width: 44, height: 44, borderRadius: 22, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, elevation: 4 },
  trashWrapper:         { justifyContent: "center", alignItems: "center" },
  emptyText:            { fontSize: 15, color: "#98A2B3", marginBottom: 14 },
  modalRoot:            { flex: 1, justifyContent: "flex-end" },
  modalBackdrop:        { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.28)" },
  timerSheet:           { backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingTop: 10, paddingBottom: 34, minHeight: "88%" },
  dragBar:              { width: 60, height: 5, borderRadius: 999, backgroundColor: "#D9D9D9", alignSelf: "center", marginBottom: 18 },
  timerHeader:          { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  timerTitle:           { fontSize: 22, fontWeight: "700", color: "#111111" },
  timerSub:             { fontSize: 14, color: "#98A2B3", fontWeight: "400" },
  timerSection:         { marginTop: 20, marginBottom: 12, fontSize: 14, fontWeight: "700", color: "#8A94A6" },
  presetRow:            { gap: 10, paddingRight: 10 },
  activePreset:         { height: 44, borderWidth: 1.5, borderColor: "#6366F1", borderRadius: 22, paddingHorizontal: 16, justifyContent: "center", alignItems: "center" },
  activePresetText:     { color: "#6366F1", fontSize: 14, fontWeight: "500" },
  preset:               { height: 44, borderWidth: 1, borderColor: "#D7D7D7", borderRadius: 22, paddingHorizontal: 16, justifyContent: "center", alignItems: "center" },
  presetText:           { color: "#777777", fontSize: 14, fontWeight: "400" },
  durationBox:          { marginTop: 4, backgroundColor: "#F5F6FC", borderRadius: 20, paddingTop: 14, paddingBottom: 14, paddingHorizontal: 14 },
  durationPickerRow:    { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  wheelContainer:       { width: 78, height: 110, overflow: "hidden", alignItems: "center" },
  wheelHighlightTop:    { position: "absolute", top: 36, left: 8, right: 8, height: 1, backgroundColor: "#E4E7EC", zIndex: 2 },
  wheelHighlightBottom: { position: "absolute", top: 72, left: 8, right: 8, height: 1, backgroundColor: "#E4E7EC", zIndex: 2 },
  wheelItem:            { height: 36, justifyContent: "center", alignItems: "center" },
  wheelText:            { fontSize: 16, fontWeight: "600", color: "#A0A7B4" },
  wheelTextActive:      { fontSize: 18, color: "#6366F1", fontWeight: "700" },
  durationColon:        { fontSize: 28, color: "#98A2B3", fontWeight: "700", marginBottom: 6 },
  durationLabels:       { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  durationLabel:        { width: 78, textAlign: "center", fontSize: 12, color: "#98A2B3" },
  timerCircleWrapper:   { width: 170, height: 170, alignSelf: "center", marginTop: 28, justifyContent: "center", alignItems: "center" },
  circleContent:        { position: "absolute", justifyContent: "center", alignItems: "center" },
  bigTime:              { fontSize: 30, fontWeight: "700", color: "#111111" },
  readyText:            { marginTop: 4, fontSize: 14, color: "#98A2B3" },
  timerControls:        { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 42 },
  sideBtn:              { width: 46, height: 46, borderRadius: 23, backgroundColor: "#F2F4F7", justifyContent: "center", alignItems: "center" },
  playBtn:              { width: 58, height: 58, borderRadius: 29, backgroundColor: "#6366F1", justifyContent: "center", alignItems: "center" },
  modalOverlay:         { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-end" },
  taskModal:            { backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 12, height: "85%" },
  modalHeader:          { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  modalTitle:           { fontSize: 22, fontWeight: "700" },
  label:                { fontSize: 12, color: "#8A94A6", marginTop: 12, marginBottom: 8, fontWeight: "700", letterSpacing: 0.4 },
  inputBox:             { backgroundColor: "#F1F3F8", borderRadius: 14, paddingHorizontal: 14, height: 48, justifyContent: "center" },
  categoryWrap:         { flexDirection: "row", flexWrap: "wrap", rowGap: 10, columnGap: 8 },
  categoryItem:         { borderWidth: 1, borderColor: "#D7D7D7", borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8 },
  categoryActive:       { borderColor: "#6366F1", backgroundColor: "#EEF2FF" },
  categoryText:         { color: "#555" },
  priorityRow:          { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  priorityBtn:          { flex: 1, height: 42, borderWidth: 1, borderColor: "#D7D7D7", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  priorityActive:       { borderColor: "#6366F1", backgroundColor: "#EEF2FF" },
  priorityText:         { fontSize: 12, fontWeight: "600" },
  priorityTextActive:   { color: "#6366F1", fontWeight: "600" },
  addTaskBtn:           { marginTop: 20, backgroundColor: "#6366F1", borderRadius: 16, height: 52, justifyContent: "center", alignItems: "center" },
  addTaskText:          { color: "#fff", fontWeight: "600", fontSize: 16 },
  notesBox:             { backgroundColor: "#F1F3F8", borderRadius: 14, height: 80, padding: 14 },
  categoryContent:      { flexDirection: "row", alignItems: "center", gap: 6 },
  priorityBadge:        { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
  taskNotes:            { marginTop: 8, marginLeft: 34, fontSize: 14, color: "#6B7280", lineHeight: 20 },
  alarmRow:             { marginTop: 14, backgroundColor: "#F1F3F8", borderRadius: 14, paddingHorizontal: 14, height: 58, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  alarmLeft:            { flexDirection: "row", alignItems: "center" },
  alarmIcon:            { width: 26, height: 26, borderRadius: 6, backgroundColor: "#EF4444", justifyContent: "center", alignItems: "center", marginRight: 10 },
  switch:               { width: 46, height: 26, borderRadius: 13, backgroundColor: "#E5E7EB", justifyContent: "center", paddingHorizontal: 3 },
  switchActive:         { backgroundColor: "#6366F1" },
  switchThumb:          { width: 20, height: 20, borderRadius: 10, backgroundColor: "#FFFFFF", transform: [{ translateX: 0 }] },
});
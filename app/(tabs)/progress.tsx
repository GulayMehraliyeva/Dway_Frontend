import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import { getProgressData } from "../../services/progressService";
import {
  ProgressData,
} from "../../types/progress";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

import WeeklyIcon from "../../assets/icons/iconsax-calendar.svg";
import MonthlyIcon from "../../assets/icons/iconsax-layer.svg";
import YearlyIcon from "../../assets/icons/iconsax-calendar-circle.svg";
import SuccessIcon from "../../assets/icons/success.svg";
import IncreaseArrowIcon from "../../assets/icons/streamline_graph-arrow-increase.svg";
import StarIcon from "../../assets/icons/material-symbols-light_star-outline-rounded.svg";
import ExclamationIcon from "../../assets/icons/heroicons_exclamation-circle.svg";

type ProgressPeriod =
  | "Weekly"
  | "Monthly"
  | "Yearly";

const AnimatedCircle =
  Animated.createAnimatedComponent(Circle);

export default function ProgressScreen() {
  const [selectedTab, setSelectedTab] =
    useState<ProgressPeriod>("Weekly");

  const radius = 65;
  const strokeWidth = 14;
  const size = 160;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const [data, setData] =
    useState<ProgressData | null>(null);

  const animatedProgress = useRef(
    new Animated.Value(0)
  ).current;

  const loadData = async (period: ProgressPeriod) => {
    const result = await getProgressData(period);
    setData(result);
  };

  useEffect(() => {
    loadData(selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    if (!data) return;

    Animated.timing(animatedProgress, {
      toValue: data.progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [data, animatedProgress]);

  if (!data) return null;

  const animatedDashoffset =
    animatedProgress.interpolate({
      inputRange: [0, 100],
      outputRange: [circumference, 0],
    });

  const categories = data.categories;

  const topCategories = [...data.categories]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const categoryColors: Record<string, string> = {
    Sport: "#F59E0B",
    Personal: "#EC4899",
    Social: "#8B5CF6",
    Home: "#06B6D4",
    Health: "#22C55E",
    Learning: "#60A5FA",
    Work: "#6366F1",
    Finance: "#14B8A6",
    Creative: "#F97316",
    Other: "#9CA3AF",
  };

  const insightStyles = {
    increase: {
      backgroundColor: "#DDF3E6",
      icon: IncreaseArrowIcon,
    },
    star: {
      backgroundColor: "#E5E4F8",
      icon: StarIcon,
    },
    warning: {
      backgroundColor: "#F4EEDF",
      icon: ExclamationIcon,
    },
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Progress</Text>
      <Text style={styles.subtitle}>
        Track your productivity over time
      </Text>

      <View style={styles.toggleContainer}>
        {[
          { name: "Weekly", Icon: WeeklyIcon },
          { name: "Monthly", Icon: MonthlyIcon },
          { name: "Yearly", Icon: YearlyIcon },
        ].map((tab) => {
          const isActive =
            selectedTab === tab.name;
          const IconComponent = tab.Icon;

          return (
            <TouchableOpacity
              key={tab.name}
              style={[
                styles.tabButton,
                isActive &&
                  styles.activeTabButton,
              ]}
              onPress={() =>
                setSelectedTab(
                  tab.name as ProgressPeriod
                )
              }
            >
              <IconComponent width={16} height={16} />
              <Text
                style={[
                  styles.tabText,
                  isActive
                    ? styles.activeTabText
                    : styles.inactiveTabText,
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.card}>
        <View style={styles.circleWrapper}>
          <Svg width={size} height={size}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#EAEAEA"
              strokeWidth={strokeWidth}
              fill="none"
            />

            <AnimatedCircle
              cx={center}
              cy={center}
              r={radius}
              stroke="#6C63FF"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={
                animatedDashoffset
              }
              strokeLinecap="butt"
              rotation="-90"
              origin={`${center},${center}`}
            />
          </Svg>

          <View style={styles.centerText}>
            <View style={{ marginBottom: 4 }}>
              <SuccessIcon width={35} height={35} />
            </View>
            <Text style={styles.percentText}>
              {data.progress}%
            </Text>
          </View>
        </View>

        <Text style={styles.completionText}>
          Overall Completion
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {data.done}
            </Text>
            <Text style={styles.statLabel}>
              Done
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {data.remaining}
            </Text>
            <Text style={styles.statLabel}>
              Remaining
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {data.total}
            </Text>
            <Text style={styles.statLabel}>
              Total
            </Text>
          </View>
        </View>

        <View style={styles.smallCirclesRow}>
          {topCategories.map((item, index) => (
            <View
              key={index}
              style={styles.smallCircleItem}
            >
              <View
                style={[
                  styles.smallCircle,
                  {
                    borderColor:
                      categoryColors[item.name] ??
                      "#9CA3AF",
                  },
                ]}
              >
                <Text style={styles.smallPercent}>
                  {item.value}%
                </Text>
              </View>

              <Text style={styles.smallLabel}>
                {item.name}
              </Text>

              <Text style={styles.smallCount}>
                {item.completed}/{item.total}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        By Category
      </Text>

      {categories.length === 0 ? (
        <Text style={styles.emptyText}>
          No category data yet
        </Text>
      ) : (
        categories.map((item, index) => (
          <View
            key={index}
            style={styles.categoryCard}
          >
            <View style={styles.categoryHeader}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      categoryColors[item.name] ??
                      "#9CA3AF",
                  },
                ]}
              />

              <Text style={styles.categoryName}>
                {item.name}
              </Text>

              <Text
                style={[
                  styles.categoryPercent,
                  {
                    color:
                      categoryColors[item.name] ??
                      "#9CA3AF",
                  },
                ]}
              >
                {item.value}%
              </Text>
            </View>

            <View
              style={styles.progressBarBackground}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${item.value}%`,
                    backgroundColor:
                      categoryColors[item.name] ??
                      "#9CA3AF",
                  },
                ]}
              />
            </View>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>
        AI Insights
      </Text>

      {data.insights.map((item) => {
        const insight = insightStyles[item.type];
        const IconComponent = insight.icon;

        return (
          <View
            key={item.id}
            style={[
              styles.insightCard,
              {
                backgroundColor:
                  insight.backgroundColor,
              },
            ]}
          >
            <IconComponent width={52} height={52} />

            <Text style={styles.insightText}>
              {item.text}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginTop: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#444",
    marginTop: 8,
    marginBottom: 24,
  },

  activeToggle: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  activeToggleText: {
    color: "#6C63FF",
    fontWeight: "600",
  },

  inactiveToggle: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    color: "#8A8A8A",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 30,
    marginTop: 17,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  circleWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  centerText: {
    position: "absolute",
    top: 48,
    alignItems: "center",
  },

  centerIcon: {
    fontSize: 24,
  },

  percentText: {
    fontSize: 28,
    fontWeight: "700",
  },

  completionText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 18,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 23,
    marginVertical: 22,
    alignItems: "center",
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 32,
    fontWeight: "700",
  },

  statLabel: {
    color: "#555",
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#DDD",
  },

  smallCirclesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
  },

  smallCircleItem: {
    alignItems: "center",
  },

  smallCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  smallPercent: {
    fontWeight: "700",
  },

  smallLabel: {
    marginTop: 8,
  },

  smallCount: {
    color: "#666",
    fontSize: 12,
  },

  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  centerImage: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginBottom: 4,
  },

  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F4F4FA",
    borderRadius: 10,
    padding: 6,
    marginTop: 18,
    marginBottom: 22,
    justifyContent: "space-between",
  },

  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },

  activeTabButton: {
    backgroundColor: "#FFFFFF",
  },

  tabText: {
    fontSize: 15,
    fontWeight: "500",
  },

  activeTabText: {
    color: "#6C63FF",
    fontWeight: "600",
  },

  inactiveTabText: {
    color: "#8A8A8A",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 18,
    marginTop: 4,
  },

  emptyText: {
    color: "#8A94A6",
    fontSize: 15,
    marginBottom: 16,
  },

  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 14,
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 2,
  },

  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },

  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },

  categoryPercent: {
    fontSize: 16,
    fontWeight: "700",
  },

  progressBarBackground: {
    height: 2,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 42,
  },

  progressBarFill: {
    height: 2,
    borderRadius: 10,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  insightCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  insightText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: "#111111",
    marginLeft: 14,
  },
});
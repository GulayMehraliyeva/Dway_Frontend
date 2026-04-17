import { Tabs } from "expo-router";

import PlanIcon from "../../assets/icons/iconsax-task-square.svg";
import ProgressIcon from "../../assets/icons/iconsax-chart.svg";
import CommunityIcon from "../../assets/icons/iconsax-ai-users.svg";
import ProfileIcon from "../../assets/icons/Vector.svg";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#9CA3AF",

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 6,
        },

        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 16,
          right: 16,
          height: 70,
          borderRadius: 35,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          paddingBottom: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 5,
        },

        tabBarItemStyle: {
          marginVertical: 7,
          marginHorizontal: 5,
          borderRadius: 35,
          height: 56,
          overflow: "hidden",
        },

        tabBarActiveBackgroundColor: "#EEF0FF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Plan",
         tabBarIcon: ({ color }) => (
  <PlanIcon
    width={20}
    height={20}
    color={color}
    style={{ marginTop: 4 }}
  />
),
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color }) => (
  <ProgressIcon
    width={20}
    height={20}
    color={color}
    style={{ marginTop: 4 }}
  />
),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => (
  <CommunityIcon
    width={20}
    height={20}
    color={color}
    style={{ marginTop: 4 }}
  />
),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
  <ProfileIcon
    width={20}
    height={20}
    color={color}
    style={{ marginTop: 4 }}
  />
),
        }}
      />
    </Tabs>
  );
}
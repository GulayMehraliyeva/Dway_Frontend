import React, { useEffect, useState } from "react";
import {
  getProfileData,
  updateAlarmSound,
  updateTheme,
  updateLanguage,
  updatePushNotifications,
} from "../../services/profileService";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
  Linking,
  Appearance,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { ProfileData } from "../../types/profile";

import EditIcon from "../../assets/icons/iconsax-edit-2.svg";
import FlashIcon from "../../assets/icons/iconsax-flash.svg";
import DoneIcon from "../../assets/icons/iconsax-enhance-prize.svg";
import ClubIcon from "../../assets/icons/iconsax-star.svg";
import CommunityIcon from "../../assets/icons/iconsax-profile-2user.svg";
import NotificationIcon from "../../assets/icons/Notification.svg";
import AudioIcon from "../../assets/icons/Audio.svg";
import SunIcon from "../../assets/icons/Sun.svg";
import CourseraIcon from "../../assets/icons/iconsax-medal-star.svg";
import TrashIcon from "../../assets/icons/iconsax-trash.svg";
import LogoutIcon from "../../assets/icons/iconsax-logout.svg";

export default function ProfileScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [data, setData] = useState<ProfileData | null>(null);
  const [showAlarmSheet, setShowAlarmSheet] = useState(false);
  const [selectedAlarmSound, setSelectedAlarmSound] = useState("Standard alarm sound");
  const [showThemeSheet, setShowThemeSheet] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("System");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showEditName, setShowEditName] = useState(false);
  const [editedName, setEditedName] = useState("");

  const handleSoundChange = async (sound: string) => {
    setSelectedAlarmSound(sound);
    await updateAlarmSound(sound);
    setShowAlarmSheet(false);
  };

  const handleThemeChange = async (theme: string) => {
    setSelectedTheme(theme);
    await updateTheme(theme);
    if (theme === "Light") {
      Appearance.setColorScheme("light");
    } else if (theme === "Dark") {
      Appearance.setColorScheme("dark");
    } else {
      Appearance.setColorScheme(null);
    }
    setShowThemeSheet(false);
  };

  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    await updateLanguage(language);
    setShowLanguageSheet(false);
  };

  const handleSaveName = () => {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, user: { ...prev.user, name: editedName } };
    });
    setShowEditName(false);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure? This will remove all your progress.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setData((prev) => {
              if (!prev) return prev;
              return { ...prev, stats: { tasksDone: 0, dayStreak: 0, completion: 0 } };
            });
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            // TODO: clear your auth token here when backend is ready
            // e.g. await AsyncStorage.removeItem("user_token");
            router.replace("/(auth)/login" as any);
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await getProfileData();
    setData(result);
    setPushNotifications(result.notifications.pushNotifications);
    setSelectedAlarmSound(result.notifications.alarmSound);
    setSelectedTheme(result.appearance.theme);
    setSelectedLanguage(result.appearance.language);
  };

  if (!data) return null;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{data.user.avatarLetter}</Text>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.name}>{data.user.name}</Text>
            <TouchableOpacity
              onPress={() => {
                setEditedName(data.user.name);
                setShowEditName(true);
              }}
            >
              <EditIcon width={16} height={16} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          <Text style={styles.memberText}>Member since {data.user.memberSince}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#5E5CE6" }]}>{data.stats.tasksDone}</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#F59E0B" }]}>{data.stats.dayStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#22C55E" }]}>{data.stats.completion}%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>

        <View style={styles.achievementContainer}>
          <View style={styles.achievementCard}>
            <View style={styles.iconCircleOrange}>
              <FlashIcon width={18} height={18} />
            </View>
            <Text style={styles.achievementText}>{data.achievements.first}</Text>
          </View>
          <View style={styles.achievementCard}>
            <View style={styles.iconCircleGreen}>
              <DoneIcon width={18} height={18} />
            </View>
            <Text style={styles.achievementText}>{data.achievements.second}</Text>
          </View>
          <View style={styles.achievementCard}>
            <View style={styles.iconCirclePurple}>
              <ClubIcon width={18} height={18} />
            </View>
            <Text style={styles.achievementText}>{data.achievements.third}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>COMMUNITY CHALLENGES</Text>

        <View style={styles.communityCard}>
          <CommunityIcon width={28} height={28} />
          <Text style={styles.communityText}>No challenges joined yet.</Text>
          <Text style={styles.communityText}>Visit Community to joined one!</Text>
        </View>

        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>

        <View style={styles.notificationCard}>
          <View style={styles.notificationRow}>
            <View style={styles.leftContent}>
              <View style={styles.iconBoxPurple}>
                <NotificationIcon width={30} height={30} />
              </View>
              <Text style={styles.rowTitle}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={async (val) => {
                setPushNotifications(val);
                await updatePushNotifications(val);
              }}
              trackColor={{ false: "#D1D5DB", true: "#5E5CE6" }}
              thumbColor="#fff"
              ios_backgroundColor="#D1D5DB"
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.notificationRow}
            activeOpacity={0.8}
            onPress={() => setShowAlarmSheet(true)}
          >
            <View style={styles.leftContent}>
              <View style={styles.iconBoxOrange}>
                <AudioIcon width={20} height={20} />
              </View>
              <Text style={styles.rowTitle}>Alarm Sound</Text>
            </View>
            <Text style={styles.rowValue}>{selectedAlarmSound} ›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>APPEARANCE</Text>

        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.settingsRow}
            activeOpacity={0.8}
            onPress={() => setShowThemeSheet(true)}
          >
            <View style={styles.leftContent}>
              <View style={styles.iconBoxBlue}>
                <SunIcon width={23} height={23} />
              </View>
              <Text style={styles.rowTitle}>Theme</Text>
            </View>
            <Text style={styles.rowValue}>{selectedTheme} ›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingsRow}
            activeOpacity={0.8}
            onPress={() => setShowLanguageSheet(true)}
          >
            <View style={styles.leftContent}>
              <View style={styles.iconBoxLightPurple}>
                <Text style={{ fontSize: 16 }}>🌐</Text>
              </View>
              <Text style={styles.rowTitle}>Language</Text>
            </View>
            <Text style={styles.rowValue}>{selectedLanguage} ›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>PARTNERS</Text>

        <Text style={styles.partnerSubtitle}>
          Exclusive perks from our partners - just for using Notion Companion
        </Text>

        <View style={styles.partnerCard}>
          <View style={styles.partnerTop}>
            <View style={styles.partnerIconOrange}>
              <SunIcon width={25} height={25} />
            </View>
            <View style={styles.partnerContent}>
              <View style={styles.partnerTitleRow}>
                <Text style={styles.partnerTitle}>{data.partners.headspace.title}</Text>
                <View style={styles.offerBadgeOrange}>
                  <Text style={styles.offerBadgeTextOrange}>{data.partners.headspace.badge}</Text>
                </View>
              </View>
              <Text style={styles.partnerSubOrange}>{data.partners.headspace.subtitle}</Text>
              <Text style={styles.partnerDescription}>{data.partners.headspace.description}</Text>
            </View>
          </View>
          <View style={styles.partnerDivider} />
          <TouchableOpacity
            style={styles.partnerButton}
            onPress={() => Linking.openURL("https://www.headspace.com")}
          >
            <Text style={styles.partnerButtonTextOrange}>View Offer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.partnerCard}>
          <View style={styles.partnerTop}>
            <View style={styles.partnerIconBlue}>
              <CourseraIcon width={25} height={25} />
            </View>
            <View style={styles.partnerContent}>
              <View style={styles.partnerTitleRow}>
                <Text style={styles.partnerTitle}>{data.partners.coursera.title}</Text>
                <View style={styles.offerBadgeBlue}>
                  <Text style={styles.offerBadgeTextBlue}>{data.partners.coursera.badge}</Text>
                </View>
              </View>
              <Text style={styles.partnerSubBlue}>{data.partners.coursera.subtitle}</Text>
              <Text style={styles.partnerDescription}>{data.partners.coursera.description}</Text>
            </View>
          </View>
          <View style={styles.partnerDivider} />
          <TouchableOpacity
            style={styles.partnerButton}
            onPress={() => Linking.openURL("https://www.coursera.org")}
          >
            <Text style={styles.partnerButtonTextBlue}>View Offer</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>DATA</Text>

        <View style={styles.dataCard}>
          <TouchableOpacity style={styles.dataRow} onPress={handleClearData} activeOpacity={0.7}>
            <View style={styles.leftContent}>
              <View style={styles.deleteIconBox}>
                <TrashIcon width={18} height={18} />
              </View>
              <Text style={styles.deleteText}>Clear All Data</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.dataRow} onPress={handleLogout} activeOpacity={0.7}>
            <View style={styles.leftContent}>
              <View style={styles.logoutIconBox}>
                <LogoutIcon width={18} height={18} />
              </View>
              <Text style={styles.logoutText}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal
        visible={showEditName}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditName(false)}
      >
        <KeyboardAvoidingView
          style={styles.editModal}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity
            style={styles.editOverlay}
            activeOpacity={1}
            onPress={() => setShowEditName(false)}
          >
            <TouchableOpacity activeOpacity={1} style={styles.editModalContent}>
              <Text style={styles.editModalTitle}>Edit Name</Text>
              <TextInput
                style={styles.editInput}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3B2"
                value={editedName}
                onChangeText={setEditedName}
                autoFocus
              />
              <TouchableOpacity style={styles.editSaveBtn} onPress={handleSaveName}>
                <Text style={styles.editSaveBtnText}>Save</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={showAlarmSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAlarmSheet(false)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.overlayBackground}
            activeOpacity={1}
            onPress={() => setShowAlarmSheet(false)}
          />
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Alarm Sound</Text>
            {["Standard alarm sound", "Soft, gradual chime", "Classic beep tone", "Clear bell ring"].map((sound) => (
              <TouchableOpacity
                key={sound}
                style={[styles.soundOption, selectedAlarmSound === sound && styles.soundOptionActive]}
                onPress={() => handleSoundChange(sound)}
              >
                <Text style={[styles.soundText, selectedAlarmSound === sound && { color: "#5E5CE6" }]}>
                  {sound}
                </Text>
                {selectedAlarmSound === sound && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showThemeSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowThemeSheet(false)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.overlayBackground} onPress={() => setShowThemeSheet(false)} />
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Choose Theme</Text>
            <View style={styles.themeRow}>
              {["Light", "Dark", "System"].map((theme) => (
                <TouchableOpacity
                  key={theme}
                  style={[styles.themeCard, selectedTheme === theme && styles.themeCardActive]}
                  onPress={() => handleThemeChange(theme)}
                >
                  <Text style={[styles.themeText, selectedTheme === theme && styles.themeTextActive]}>
                    {theme}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showLanguageSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageSheet(false)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.overlayBackground} onPress={() => setShowLanguageSheet(false)} />
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Choose Language</Text>
            {["English", "Russian", "Turkish", "Azerbaijani", "Uzbek"].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.soundOption, selectedLanguage === lang && styles.soundOptionActive]}
                onPress={() => handleLanguageChange(lang)}
              >
                <Text style={styles.soundText}>{lang}</Text>
                {selectedLanguage === lang && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F4F6" },
  content: { marginTop: 20, padding: 20 },
  achievementIcon: { fontSize: 24 },
  emptyCard: { backgroundColor: "#fff", borderRadius: 16, padding: 24, alignItems: "center" },
  emptyIcon: { fontSize: 28 },
  emptyText: { color: "#888", textAlign: "center", marginTop: 10, lineHeight: 22 },
  card: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 18, paddingVertical: 8 },
  partnerButtonText: { color: "#F97316", fontWeight: "700", fontSize: 16 },
  deleteCard: { backgroundColor: "#fff", borderRadius: 16, padding: 22 },
  profileSection: { alignItems: "center", marginTop: 20 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: "#5E5CE6", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#fff", fontSize: 34, fontWeight: "700" },
  nameRow: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  name: { fontSize: 22, fontWeight: "700", color: "#111827" },
  memberText: { marginTop: 6, fontSize: 14, color: "#8E8E93" },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 28 },
  statCard: { width: "31%", backgroundColor: "#FFFFFF", borderRadius: 14, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "#EFEFEF" },
  statNumber: { fontSize: 22, fontWeight: "700" },
  statLabel: { marginTop: 4, fontSize: 13, color: "#8E8E93" },
  sectionTitle: { marginTop: 28, marginBottom: 12, fontSize: 14, fontWeight: "700", color: "#98A2B3" },
  achievementContainer: { flexDirection: "row", justifyContent: "space-between" },
  achievementCard: { width: "31%", backgroundColor: "#FFFFFF", borderRadius: 14, paddingVertical: 18, alignItems: "center", borderWidth: 1, borderColor: "#EFEFEF" },
  achievementText: { marginTop: 10, fontSize: 14, fontWeight: "600" },
  iconCircleOrange: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#FFF4E8", justifyContent: "center", alignItems: "center" },
  iconCircleGreen: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#EAFBF0", justifyContent: "center", alignItems: "center" },
  iconCirclePurple: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#F1EEFF", justifyContent: "center", alignItems: "center" },
  communityCard: { backgroundColor: "#FFFFFF", borderRadius: 16, paddingVertical: 22, alignItems: "center", borderWidth: 1, borderColor: "#EFEFEF" },
  communityText: { marginTop: 4, fontSize: 14, color: "#8E8E93" },
  notificationCard: { backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#EFEFEF" },
  notificationRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 18, paddingVertical: 18 },
  leftContent: { flexDirection: "row", alignItems: "center" },
  iconBoxPurple: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#F1EEFF", justifyContent: "center", alignItems: "center", marginRight: 12 },
  iconBoxOrange: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#FFF4E8", justifyContent: "center", alignItems: "center", marginRight: 12 },
  rowTitle: { fontSize: 16, fontWeight: "600" },
  rowValue: { fontSize: 15, color: "#A1A1AA" },
  divider: { height: 1, backgroundColor: "#EFEFEF" },
  settingsCard: { backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#EFEFEF" },
  settingsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 18, paddingVertical: 16 },
  iconBoxBlue: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#E8F7FB", justifyContent: "center", alignItems: "center", marginRight: 12 },
  iconBoxLightPurple: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#F1EEFF", justifyContent: "center", alignItems: "center", marginRight: 12 },
  partnerSubtitle: { fontSize: 14, color: "#98A2B3", lineHeight: 20, marginBottom: 16 },
  partnerCard: { backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#EFEFEF", marginBottom: 18 },
  partnerTop: { flexDirection: "row", padding: 18 },
  partnerIconOrange: { width: 48, height: 48, borderRadius: 12, backgroundColor: "#FFF4E8", justifyContent: "center", alignItems: "center", marginRight: 14 },
  partnerIconBlue: { width: 48, height: 48, borderRadius: 12, backgroundColor: "#E8F7FB", justifyContent: "center", alignItems: "center", marginRight: 14 },
  partnerContent: { flex: 1 },
  partnerTitleRow: { flexDirection: "row", alignItems: "center" },
  partnerTitle: { fontSize: 16, fontWeight: "700" },
  offerBadgeOrange: { backgroundColor: "#FFF4E8", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  offerBadgeBlue: { backgroundColor: "#E8F7FB", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  offerBadgeTextOrange: { color: "#F97316", fontSize: 11, fontWeight: "600" },
  offerBadgeTextBlue: { color: "#0EA5E9", fontSize: 11, fontWeight: "600" },
  partnerSubOrange: { marginTop: 4, fontSize: 12, color: "#F97316", fontWeight: "600" },
  partnerSubBlue: { marginTop: 4, fontSize: 12, color: "#0EA5E9", fontWeight: "600" },
  partnerDescription: { marginTop: 8, fontSize: 14, color: "#98A2B3", lineHeight: 20 },
  partnerDivider: { height: 1, backgroundColor: "#EFEFEF" },
  partnerButton: { paddingVertical: 14, alignItems: "center" },
  partnerButtonTextOrange: { fontSize: 16, fontWeight: "700", color: "#F97316" },
  partnerButtonTextBlue: { fontSize: 16, fontWeight: "700", color: "#0EA5E9" },
  dataCard: { backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#EFEFEF" },
  dataRow: { padding: 18 },
  deleteIconBox: { width: 46, height: 46, borderRadius: 12, backgroundColor: "#FDECEC", justifyContent: "center", alignItems: "center", marginRight: 14 },
  deleteText: { fontSize: 18, fontWeight: "700", color: "#DC2626" },
  logoutIconBox: { width: 46, height: 46, borderRadius: 12, backgroundColor: "#FFF4E8", justifyContent: "center", alignItems: "center", marginRight: 14 },
  logoutText: { fontSize: 18, fontWeight: "700", color: "#F97316" },
  sheetOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end" },
  overlayBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  bottomSheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 24 },
  sheetHandle: { width: 44, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB", alignSelf: "center", marginTop: 10, marginBottom: 18 },
  sheetTitle: { fontSize: 28, fontWeight: "700", paddingHorizontal: 20, marginBottom: 14 },
  soundOption: { height: 58, paddingHorizontal: 20, borderTopWidth: 1, borderColor: "#EFEFEF", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  soundOptionActive: { backgroundColor: "#F4F4F6" },
  soundText: { fontSize: 16, color: "#6B7280" },
  checkMark: { fontSize: 18, color: "#5E5CE6", fontWeight: "700" },
  themeRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 24 },
  themeCard: { width: "31%", height: 60, borderRadius: 14, borderWidth: 1, borderColor: "#D1D5DB", justifyContent: "center", alignItems: "center" },
  themeCardActive: { borderColor: "#5E5CE6", backgroundColor: "#EEF0FF" },
  themeText: { fontSize: 16, color: "#6B7280" },
  themeTextActive: { color: "#5E5CE6", fontWeight: "700" },
  editModal: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  editOverlay: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  editModalContent: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20 },
  editModalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 14 },
  editInput: { height: 52, borderWidth: 1, borderColor: "#ECECEC", borderRadius: 12, paddingHorizontal: 14, fontSize: 16 },
  editSaveBtn: { marginTop: 16, backgroundColor: "#5E5CE6", borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  editSaveBtnText: { color: "#FFFFFF", fontWeight: "600", fontSize: 15 },
});
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "At least 6 characters";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)" as any);
    }, 1000);
  };

  const clearError = (field: keyof typeof errors) =>
    setErrors((e) => ({ ...e, [field]: undefined }));

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>

        <View style={styles.logoWrapper}>
          <View style={styles.logoCircle}>
            <View style={styles.logoDot} />
          </View>
        </View>

        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Start your productivity journey</Text>

        <Text style={styles.label}>FULL NAME</Text>
        <View style={[styles.inputBox, errors.name ? styles.inputError : null]}>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={(v) => { setName(v); clearError("name"); }}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

        <Text style={[styles.label, { marginTop: 16 }]}>EMAIL</Text>
        <View style={[styles.inputBox, errors.email ? styles.inputError : null]}>
          <TextInput
            style={styles.input}
            placeholder="hello@example.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={(v) => { setEmail(v); clearError("email"); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Text style={[styles.label, { marginTop: 16 }]}>PASSWORD</Text>
        <View style={[styles.inputBox, errors.password ? styles.inputError : null]}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Min. 6 characters"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={(v) => { setPassword(v); clearError("password"); }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword((p) => !p)}
            activeOpacity={0.7}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <Text style={[styles.label, { marginTop: 16 }]}>CONFIRM PASSWORD</Text>
        <View style={[styles.inputBox, errors.confirmPassword ? styles.inputError : null]}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Repeat your password"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); clearError("confirmPassword"); }}
            secureTextEntry={!showConfirm}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowConfirm((p) => !p)}
            activeOpacity={0.7}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={showConfirm ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword ? (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
          onPress={handleRegister}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F3F8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  logoDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#8A94A6",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 36,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8A94A6",
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: "#F1F3F8",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111",
  },
  eyeBtn: {
    padding: 4,
  },
  errorText: {
    marginTop: 5,
    fontSize: 12,
    color: "#DC2626",
  },
  primaryBtn: {
    backgroundColor: "#6366F1",
    borderRadius: 16,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
    color: "#8A94A6",
  },
  footerLink: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
  },
});
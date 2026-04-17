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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)/" as any);
    }, 1000);
  };

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
        <View style={styles.logoWrapper}>
          <View style={styles.logoCircle}>
            <View style={styles.logoDot} />
          </View>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <Text style={styles.label}>EMAIL</Text>
        <View style={[styles.inputBox, errors.email ? styles.inputError : null]}>
          <TextInput
            style={styles.input}
            placeholder="hello@example.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
            }}
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
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
            }}
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

        <TouchableOpacity activeOpacity={0.7} style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/register" as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.footerLink}>Sign up</Text>
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
    paddingTop: 80,
    paddingBottom: 40,
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
  forgotRow: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 4,
  },
  forgotText: {
    fontSize: 13,
    color: "#6366F1",
    fontWeight: "500",
  },
  primaryBtn: {
    backgroundColor: "#6366F1",
    borderRadius: 16,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
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
import React, { useState } from "react";
import { View, ScrollView, Pressable, TextInput, Platform } from "react-native";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  ChevronRight,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  CircleHelp,
  LogOut,
  Crown,
  Mail,
  Phone,
  Pencil,
} from "lucide-react-native";
import { DEMO_USER } from "@/lib/demo-data";
import Animated, { FadeInDown } from "react-native-reanimated";

type SettingRowProps = {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  destructive?: boolean;
  trailing?: React.ReactNode;
};

function SettingRow({
  icon,
  label,
  subtitle,
  onPress,
  destructive,
  trailing,
}: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      testID={`setting-${label.toLowerCase().replace(/\s/g, "-")}`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 4,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: destructive
            ? "rgba(239,68,68,0.1)"
            : "rgba(245,158,11,0.08)",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Inter_500Medium",
            fontSize: 15,
            color: destructive ? "#EF4444" : "#F5F5F5",
          }}
        >
          {label}
        </Text>
        {subtitle ? (
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: "#6B7280",
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ?? <ChevronRight size={18} color="#4B5563" />}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [user] = useState(DEMO_USER);

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
      >
        {/* Avatar + Name header */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={{
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: user.avatar }}
              style={{ width: 88, height: 88, borderRadius: 44 }}
              contentFit="cover"
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#F59E0B",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: "#0A0A0A",
              }}
            >
              <Pencil size={12} color="#0A0A0A" />
            </View>
          </View>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 22,
              color: "#F5F5F5",
              marginTop: 14,
            }}
          >
            {user.name}
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: "#6B7280",
              marginTop: 4,
            }}
          >
            {user.email}
          </Text>
        </Animated.View>

        {/* Stats row */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={{
            flexDirection: "row",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {[
            { label: "Orders", value: "12" },
            { label: "Favorites", value: "5" },
            { label: "Points", value: "840" },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                backgroundColor: "#1E1E1E",
                borderRadius: 14,
                padding: 14,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 20,
                  color: "#F59E0B",
                }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  color: "#6B7280",
                  marginTop: 4,
                }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Premium CTA */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Pressable
            onPress={() => router.push("/paywall")}
            accessibilityLabel="Upgrade to Pro"
            testID="upgrade-cta"
            style={{
              backgroundColor: "rgba(245,158,11,0.1)",
              borderWidth: 1,
              borderColor: "rgba(245,158,11,0.25)",
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: "#F59E0B",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Crown size={22} color="#0A0A0A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 15,
                  color: "#F59E0B",
                }}
              >
                Upgrade to Pro
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  color: "#9CA3AF",
                  marginTop: 2,
                }}
              >
                Priority delivery, loyalty rewards & more
              </Text>
            </View>
            <ChevronRight size={18} color="#F59E0B" />
          </Pressable>
        </Animated.View>

        {/* Account Settings */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: "#6B7280",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Account
          </Text>
          <View
            style={{
              backgroundColor: "#141414",
              borderRadius: 16,
              paddingHorizontal: 14,
              marginBottom: 20,
            }}
          >
            <SettingRow
              icon={<Mail size={18} color="#F59E0B" />}
              label="Email"
              subtitle={user.email}
            />
            <View
              style={{
                height: 1,
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            />
            <SettingRow
              icon={<Phone size={18} color="#F59E0B" />}
              label="Phone"
              subtitle={user.phone}
            />
            <View
              style={{
                height: 1,
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            />
            <SettingRow
              icon={<MapPin size={18} color="#F59E0B" />}
              label="Address"
              subtitle={user.address}
            />
          </View>
        </Animated.View>

        {/* Preferences */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: "#6B7280",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Preferences
          </Text>
          <View
            style={{
              backgroundColor: "#141414",
              borderRadius: 16,
              paddingHorizontal: 14,
              marginBottom: 20,
            }}
          >
            <SettingRow
              icon={<CreditCard size={18} color="#F59E0B" />}
              label="Payment Methods"
              subtitle="Visa •••• 4821"
            />
            <View
              style={{
                height: 1,
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            />
            <SettingRow
              icon={<Bell size={18} color="#F59E0B" />}
              label="Notifications"
              subtitle="Push & email enabled"
            />
            <View
              style={{
                height: 1,
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            />
            <SettingRow
              icon={<Shield size={18} color="#F59E0B" />}
              label="Privacy & Security"
            />
            <View
              style={{
                height: 1,
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            />
            <SettingRow
              icon={<CircleHelp size={18} color="#F59E0B" />}
              label="Help & Support"
            />
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View
            style={{
              backgroundColor: "#141414",
              borderRadius: 16,
              paddingHorizontal: 14,
            }}
          >
            <SettingRow
              icon={<LogOut size={18} color="#EF4444" />}
              label="Sign Out"
              destructive
              trailing={null}
            />
          </View>
        </Animated.View>

        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 12,
            color: "#4B5563",
            textAlign: "center",
            marginTop: 24,
          }}
        >
          UI Burger App v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

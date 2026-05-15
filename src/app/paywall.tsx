import React, { useState } from "react";
import { View, ScrollView, Pressable, Platform } from "react-native";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  X,
  Crown,
  Zap,
  Truck,
  Gift,
  Star,
  Check,
} from "lucide-react-native";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
};

const PLANS: Plan[] = [
  {
    id: "annual",
    name: "Annual",
    price: "$39.99",
    period: "/year",
    savings: "Save 33%",
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "$4.99",
    period: "/month",
  },
];

const FEATURES = [
  { Icon: Truck, text: "Priority delivery on every order" },
  { Icon: Zap, text: "Exclusive limited-edition burgers" },
  { Icon: Gift, text: "Free birthday burger every year" },
  { Icon: Star, text: "2x loyalty points on all purchases" },
];

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("annual");

  const buttonScale = useSharedValue(1);
  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleSubscribe = () => {
    buttonScale.value = withSpring(0.93, { damping: 10 });
    setTimeout(() => {
      buttonScale.value = withSpring(1, { damping: 12 });
    }, 150);
    if (Platform.OS !== "web") {
      import("expo-haptics")
        .then((H) => H.impactAsync(H.ImpactFeedbackStyle.Medium))
        .catch(() => {});
    }
    // Mock for first build — wire real API in follow-up turn
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      {/* Close button */}
      <View
        style={{
          position: "absolute",
          top: insets.top + 8,
          right: 20,
          zIndex: 10,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Close"
          testID="paywall-close"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={18} color="#F5F5F5" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 56,
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Hero */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={{ alignItems: "center", marginBottom: 36 }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              backgroundColor: "rgba(245,158,11,0.15)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Crown size={40} color="#F59E0B" />
          </View>
          <Text
            style={{
              fontFamily: "Inter_800ExtraBold",
              fontSize: 30,
              color: "#F5F5F5",
              textAlign: "center",
              letterSpacing: -0.5,
            }}
          >
            Upgrade to Pro
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 15,
              color: "#9CA3AF",
              textAlign: "center",
              marginTop: 10,
              lineHeight: 22,
            }}
          >
            Unlock premium perks and make every{"\n"}order even better
          </Text>
        </Animated.View>

        {/* Features */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(400)}
          style={{ marginBottom: 32 }}
        >
          {FEATURES.map((feat, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: "rgba(245,158,11,0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <feat.Icon size={22} color="#F59E0B" />
              </View>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 15,
                  color: "#F5F5F5",
                  flex: 1,
                }}
              >
                {feat.text}
              </Text>
              <Check size={18} color="#22C55E" />
            </View>
          ))}
        </Animated.View>

        {/* Plan Selection */}
        <Animated.View
          entering={FadeInDown.delay(250).duration(400)}
          style={{ gap: 10, marginBottom: 28 }}
        >
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                accessibilityLabel={`Select ${plan.name} plan`}
                testID={`plan-${plan.id}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isSelected
                    ? "rgba(245,158,11,0.1)"
                    : "#1E1E1E",
                  borderRadius: 16,
                  padding: 18,
                  borderWidth: 2,
                  borderColor: isSelected
                    ? "#F59E0B"
                    : "rgba(255,255,255,0.06)",
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 2,
                    borderColor: isSelected ? "#F59E0B" : "#4B5563",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  {isSelected ? (
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "#F59E0B",
                      }}
                    />
                  ) : null}
                </View>
                <View style={{ flex: 1 }}>
                  <View
                    style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 16,
                        color: "#F5F5F5",
                      }}
                    >
                      {plan.name}
                    </Text>
                    {plan.savings ? (
                      <View
                        style={{
                          backgroundColor: "rgba(34,197,94,0.15)",
                          borderRadius: 6,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Inter_600SemiBold",
                            fontSize: 11,
                            color: "#22C55E",
                          }}
                        >
                          {plan.savings}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      fontSize: 18,
                      color: isSelected ? "#F59E0B" : "#F5F5F5",
                    }}
                  >
                    {plan.price}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 12,
                      color: "#6B7280",
                    }}
                  >
                    {plan.period}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </Animated.View>

        {/* Subscribe CTA */}
        <Animated.View entering={FadeInDown.delay(350).duration(400)}>
          <Animated.View style={buttonAnimStyle}>
            <Pressable
              onPress={handleSubscribe}
              accessibilityLabel="Subscribe"
              testID="subscribe-button"
              style={{
                backgroundColor: "#F59E0B",
                borderRadius: 20,
                paddingVertical: 18,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 17,
                  color: "#0A0A0A",
                }}
              >
                Start Free Trial
              </Text>
            </Pressable>
          </Animated.View>

          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Restore purchases"
            testID="restore-purchases"
            style={{
              marginTop: 14,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              Restore Purchases
            </Text>
          </Pressable>

          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 11,
              color: "#4B5563",
              textAlign: "center",
              marginTop: 16,
              lineHeight: 16,
            }}
          >
            Cancel anytime. Subscription auto-renews.{"\n"}
            By continuing, you agree to our Terms & Privacy Policy.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

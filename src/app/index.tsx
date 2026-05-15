import React, { useEffect } from "react";
import { View, Pressable, Platform } from "react-native";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "expo-router";
import { useAppStore } from "@/lib/store";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { ChevronRight } from "lucide-react-native";

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hasSeenOnboarding = useAppStore((s) => s.hasSeenOnboarding);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const titleY = useSharedValue(40);
  const titleOpacity = useSharedValue(0);
  const subtitleY = useSharedValue(40);
  const subtitleOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    if (hasSeenOnboarding) {
      router.replace("/(tabs)/home");
      return;
    }
    titleY.value = withDelay(300, withSpring(0, { damping: 14 }));
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    subtitleY.value = withDelay(500, withSpring(0, { damping: 14 }));
    subtitleOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    buttonScale.value = withDelay(700, withSpring(1, { damping: 12 }));
    buttonOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));
  }, [hasSeenOnboarding]);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleY.value }],
    opacity: titleOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: subtitleY.value }],
    opacity: subtitleOpacity.value,
  }));

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: buttonOpacity.value,
  }));

  if (hasSeenOnboarding) return null;

  const handleGetStarted = () => {
    if (Platform.OS !== "web") {
      import("expo-haptics").then((Haptics) =>
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      ).catch(() => {});
    }
    completeOnboarding();
    router.replace("/(tabs)/home");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800" }}
        style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.4 }}
        contentFit="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(10,10,10,0.7)", "#0A0A0A"]}
        locations={[0, 0.5, 0.85]}
        style={{ position: "absolute", width: "100%", height: "100%"  }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 40,
        }}
      >
        <Animated.View style={titleStyle}>
          <Text
            style={{
              fontFamily: "Inter_800ExtraBold",
              fontSize: 44,
              color: "#F5F5F5",
              letterSpacing: -1.5,
              lineHeight: 48,
            }}
          >
            Craft Your{"\n"}Perfect
          </Text>
          <Text
            style={{
              fontFamily: "Inter_800ExtraBold",
              fontSize: 44,
              color: "#F59E0B",
              letterSpacing: -1.5,
              lineHeight: 48,
            }}
          >
            Burger.
          </Text>
        </Animated.View>

        <Animated.View style={[subtitleStyle, { marginTop: 16 }]}>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              color: "#9CA3AF",
              lineHeight: 24,
            }}
          >
            Premium burgers made with passion. Browse, customize, and order in
            seconds.
          </Text>
        </Animated.View>

        <Animated.View style={[buttonAnimStyle, { marginTop: 32 }]}>
          <Pressable
            onPress={handleGetStarted}
            accessibilityLabel="Get started"
            testID="onboarding-get-started"
            style={{
              backgroundColor: "#F59E0B",
              borderRadius: 20,
              paddingVertical: 18,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 17,
                color: "#0A0A0A",
              }}
            >
              Get Started
            </Text>
            <ChevronRight size={20} color="#0A0A0A" style={{ marginLeft: 4 }} />
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(1000).duration(600)}
          style={{ marginTop: 16, alignItems: "center" }}
        >
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: "#6B7280",
            }}
          >
            Free delivery on your first order
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

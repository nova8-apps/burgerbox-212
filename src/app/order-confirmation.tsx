import React, { useEffect } from "react";
import { View, Pressable, Platform } from "react-native";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CheckCircle, Clock, MapPin } from "lucide-react-native";
import { DEMO_USER } from "@/lib/demo-data";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeInDown,
} from "react-native-reanimated";

export default function OrderConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);

  useEffect(() => {
    checkScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 120 }));
    checkOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    if (Platform.OS !== "web") {
      import("expo-haptics")
        .then((H) => H.notificationAsync(H.NotificationFeedbackType.Success))
        .catch(() => {});
    }
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0A0A0A",
        paddingHorizontal: 24,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Success check */}
      <Animated.View
        style={[
          checkStyle,
          {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "rgba(34,197,94,0.15)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
          },
        ]}
      >
        <CheckCircle size={52} color="#22C55E" />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(400).duration(400)}
        style={{ alignItems: "center" }}
      >
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 26,
            color: "#F5F5F5",
            textAlign: "center",
          }}
        >
          Order Placed!
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
          Your delicious burger is being prepared.{"\n"}Sit back and relax!
        </Text>
      </Animated.View>

      {/* Delivery info card */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(400)}
        style={{
          backgroundColor: "#1E1E1E",
          borderRadius: 16,
          padding: 20,
          width: "100%",
          marginTop: 32,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: "rgba(245,158,11,0.15)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Clock size={20} color="#F59E0B" />
          </View>
          <View>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 13,
                color: "#6B7280",
              }}
            >
              Estimated Delivery
            </Text>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 18,
                color: "#F5F5F5",
              }}
            >
              25–35 min
            </Text>
          </View>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: "rgba(255,255,255,0.06)",
            marginBottom: 16,
          }}
        />

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: "rgba(245,158,11,0.15)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <MapPin size={20} color="#F59E0B" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 13,
                color: "#6B7280",
              }}
            >
              Delivery Address
            </Text>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 14,
                color: "#F5F5F5",
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {DEMO_USER.address}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* CTA Buttons */}
      <Animated.View
        entering={FadeInDown.delay(800).duration(400)}
        style={{ width: "100%", marginTop: 32 }}
      >
        <Pressable
          onPress={() => router.replace("/(tabs)/orders")}
          accessibilityLabel="Track order"
          testID="track-order"
          style={{
            backgroundColor: "#F59E0B",
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 16,
              color: "#0A0A0A",
            }}
          >
            Track My Order
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/(tabs)/home")}
          accessibilityLabel="Back to home"
          testID="back-to-home"
          style={{
            marginTop: 12,
            paddingVertical: 14,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 14,
              color: "#9CA3AF",
            }}
          >
            Back to Menu
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

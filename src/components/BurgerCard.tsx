import React from "react";
import { View, Pressable, Platform } from "react-native";
import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import { Star, Plus, Heart } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "@/lib/store";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import type { Burger } from "@/lib/demo-data";

type BurgerCardProps = {
  burger: Burger;
  variant?: "grid" | "featured";
};

export function BurgerCard({ burger, variant = "grid" }: BurgerCardProps) {
  const router = useRouter();
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const favoriteIds = useAppStore((s) => s.favoriteIds);
  const addToCart = useAppStore((s) => s.addToCart);
  const isFav = favoriteIds.includes(burger.id);

  const cardScale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const plusScale = useSharedValue(1);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const heartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const plusAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: plusScale.value }],
  }));

  const handlePress = () => {
    cardScale.value = withSpring(0.97, { damping: 15 });
    setTimeout(() => {
      cardScale.value = withSpring(1, { damping: 14 });
    }, 100);
    router.push(`/burger/${burger.id}`);
  };

  const handleFavorite = () => {
    heartScale.value = withSpring(1.3, { damping: 8, stiffness: 200 });
    setTimeout(() => {
      heartScale.value = withSpring(1, { damping: 14 });
    }, 150);
    if (Platform.OS !== "web") {
      import("expo-haptics")
        .then((H) => H.impactAsync(H.ImpactFeedbackStyle.Light))
        .catch(() => {});
    }
    toggleFavorite(burger.id);
  };

  const handleQuickAdd = () => {
    plusScale.value = withSpring(1.3, { damping: 8 });
    setTimeout(() => {
      plusScale.value = withSpring(1, { damping: 14 });
    }, 150);
    if (Platform.OS !== "web") {
      import("expo-haptics")
        .then((H) => H.impactAsync(H.ImpactFeedbackStyle.Medium))
        .catch(() => {});
    }
    addToCart(burger, [], 1);
  };

  if (variant === "featured") {
    return (
      <Animated.View style={[cardAnimStyle, { width: 280, marginRight: 16 }]}>
        <Pressable
          onPress={handlePress}
          accessibilityLabel={`View ${burger.name}`}
          testID={`featured-burger-${burger.id}`}
          style={{
            backgroundColor: "#1E1E1E",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: burger.image }}
              style={{ width: "100%", height: 180 }}
              contentFit="cover"
              transition={300}
            />
            <Animated.View
              style={[
                heartAnimStyle,
                { position: "absolute", top: 12, right: 12 },
              ]}
            >
              <Pressable
                onPress={handleFavorite}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel={
                  isFav
                    ? `Remove ${burger.name} from favorites`
                    : `Add ${burger.name} to favorites`
                }
                testID={`fav-${burger.id}`}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Heart
                  size={18}
                  color={isFav ? "#F59E0B" : "#fff"}
                  fill={isFav ? "#F59E0B" : "none"}
                />
              </Pressable>
            </Animated.View>
          </View>
          <View style={{ padding: 14 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                color: "#F5F5F5",
              }}
            >
              {burger.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <Star size={13} color="#F59E0B" fill="#F59E0B" />
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 13,
                  color: "#F59E0B",
                  marginLeft: 4,
                }}
              >
                {burger.rating}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  color: "#6B7280",
                  marginLeft: 4,
                }}
              >
                ({burger.reviewCount})
              </Text>
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 18,
                  color: "#F59E0B",
                }}
              >
                ${burger.price.toFixed(2)}
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  // Grid variant
  return (
    <Animated.View style={[cardAnimStyle, { flex: 1, marginBottom: 12 }]}>
      <Pressable
        onPress={handlePress}
        accessibilityLabel={`View ${burger.name}`}
        testID={`burger-card-${burger.id}`}
        style={{
          backgroundColor: "#1E1E1E",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: burger.image }}
            style={{ width: "100%", height: 140 }}
            contentFit="cover"
            transition={200}
          />
          <Animated.View
            style={[
              heartAnimStyle,
              { position: "absolute", top: 8, right: 8 },
            ]}
          >
            <Pressable
              onPress={handleFavorite}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={
                isFav ? `Unfavorite ${burger.name}` : `Favorite ${burger.name}`
              }
              testID={`fav-grid-${burger.id}`}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "rgba(0,0,0,0.5)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Heart
                size={14}
                color={isFav ? "#F59E0B" : "#fff"}
                fill={isFav ? "#F59E0B" : "none"}
              />
            </Pressable>
          </Animated.View>
        </View>
        <View style={{ padding: 12 }}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: "#F5F5F5",
            }}
            numberOfLines={1}
          >
            {burger.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#F59E0B",
              }}
            >
              ${burger.price.toFixed(2)}
            </Text>
            <Animated.View style={plusAnimStyle}>
              <Pressable
                onPress={handleQuickAdd}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel={`Quick add ${burger.name} to cart`}
                testID={`quick-add-${burger.id}`}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: "#F59E0B",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={18} color="#0A0A0A" />
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

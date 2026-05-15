import React, { useState, useMemo } from "react";
import { View, ScrollView, Pressable, Platform } from "react-native";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  X,
  Star,
  Heart,
  Minus,
  Plus,
  Clock,
  Flame,
  Check,
} from "lucide-react-native";
import { BURGERS, type Topping } from "@/lib/demo-data";
import { useAppStore } from "@/lib/store";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInUp,
  FadeInDown,
} from "react-native-reanimated";

export default function BurgerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const favoriteIds = useAppStore((s) => s.favoriteIds);
  const addToCart = useAppStore((s) => s.addToCart);

  const burger = useMemo(() => BURGERS.find((b) => b.id === id), [id]);
  const isFav = burger ? favoriteIds.includes(burger.id) : false;

  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState(1);

  const buttonScale = useSharedValue(1);
  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  if (!burger) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0A0A0A",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_500Medium",
            fontSize: 16,
            color: "#9CA3AF",
          }}
        >
          Burger not found
        </Text>
      </View>
    );
  }

  const toggleTopping = (topping: Topping) => {
    if (Platform.OS !== "web") {
      import("expo-haptics")
        .then((H) => H.selectionAsync())
        .catch(() => {});
    }
    setSelectedToppings((prev) =>
      prev.some((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const toppingsTotal = selectedToppings.reduce((s, t) => s + t.price, 0);
  const itemTotal = (burger.price + toppingsTotal) * quantity;

  const handleAddToCart = () => {
    buttonScale.value = withSpring(0.92, { damping: 10 });
    setTimeout(() => {
      buttonScale.value = withSpring(1, { damping: 12 });
    }, 150);
    if (Platform.OS !== "web") {
      import("expo-haptics")
        .then((H) => H.impactAsync(H.ImpactFeedbackStyle.Medium))
        .catch(() => {});
    }
    addToCart(burger, selectedToppings, quantity);
    setTimeout(() => router.back(), 300);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        bounces={false}
      >
        {/* Hero Image */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: burger.image }}
            style={{ width: "100%", height: 340 }}
            contentFit="cover"
            transition={400}
          />
          {/* Gradient overlay */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              backgroundColor: "transparent",
            }}
          />

          {/* Top buttons */}
          <View
            style={{
              position: "absolute",
              top: insets.top + 8,
              left: 16,
              right: 16,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              onPress={() => router.back()}
              accessibilityLabel="Close"
              testID="detail-close"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                backgroundColor: "rgba(0,0,0,0.6)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={20} color="#F5F5F5" />
            </Pressable>
            <Pressable
              onPress={() => toggleFavorite(burger.id)}
              accessibilityLabel={
                isFav ? "Remove from favorites" : "Add to favorites"
              }
              testID="detail-fav"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                backgroundColor: "rgba(0,0,0,0.6)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Heart
                size={20}
                color={isFav ? "#F59E0B" : "#F5F5F5"}
                fill={isFav ? "#F59E0B" : "none"}
              />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 20, marginTop: -20 }}>
          <Animated.View entering={FadeInUp.duration(400).springify()}>
            <View
              style={{
                backgroundColor: "#141414",
                borderRadius: 20,
                padding: 20,
              }}
            >
              {/* Name & Price */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      fontSize: 24,
                      color: "#F5F5F5",
                      lineHeight: 30,
                    }}
                  >
                    {burger.name}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: "Inter_800ExtraBold",
                    fontSize: 26,
                    color: "#F59E0B",
                  }}
                >
                  ${burger.price.toFixed(2)}
                </Text>
              </View>

              {/* Rating & meta */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                  gap: 16,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 14,
                      color: "#F59E0B",
                    }}
                  >
                    {burger.rating}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 13,
                      color: "#6B7280",
                    }}
                  >
                    ({burger.reviewCount} reviews)
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Clock size={14} color="#6B7280" />
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 13,
                      color: "#6B7280",
                    }}
                  >
                    {burger.prepTime}
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Flame size={14} color="#6B7280" />
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 13,
                      color: "#6B7280",
                    }}
                  >
                    {burger.calories} cal
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 15,
                  color: "#9CA3AF",
                  lineHeight: 22,
                  marginTop: 16,
                }}
              >
                {burger.description}
              </Text>
            </View>
          </Animated.View>

          {/* Toppings */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400).springify()}
            style={{ marginTop: 16 }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: "#F5F5F5",
                marginBottom: 14,
              }}
            >
              Customize Toppings
            </Text>
            {burger.toppings.map((topping) => {
              const isSelected = selectedToppings.some(
                (t) => t.id === topping.id
              );
              return (
                <Pressable
                  key={topping.id}
                  onPress={() => toggleTopping(topping)}
                  accessibilityLabel={`Toggle ${topping.name}`}
                  testID={`topping-${topping.id}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: isSelected
                      ? "rgba(245,158,11,0.1)"
                      : "#1E1E1E",
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: isSelected
                      ? "rgba(245,158,11,0.3)"
                      : "rgba(255,255,255,0.04)",
                  }}
                >
                  <Text style={{ fontSize: 20, marginRight: 12 }}>
                    {topping.icon}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_500Medium",
                        fontSize: 15,
                        color: "#F5F5F5",
                      }}
                    >
                      {topping.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 13,
                        color: "#F59E0B",
                        marginTop: 2,
                      }}
                    >
                      +${topping.price.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      backgroundColor: isSelected
                        ? "#F59E0B"
                        : "rgba(255,255,255,0.08)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isSelected ? (
                      <Check size={14} color="#0A0A0A" />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </Animated.View>

          {/* Quantity Stepper */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400).springify()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              gap: 20,
            }}
          >
            <Pressable
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              accessibilityLabel="Decrease quantity"
              testID="qty-minus"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: "#1E1E1E",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <Minus size={20} color="#F5F5F5" />
            </Pressable>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 22,
                color: "#F5F5F5",
                minWidth: 32,
                textAlign: "center",
              }}
            >
              {quantity}
            </Text>
            <Pressable
              onPress={() => setQuantity((q) => Math.min(10, q + 1))}
              accessibilityLabel="Increase quantity"
              testID="qty-plus"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: "#F59E0B",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={20} color="#0A0A0A" />
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 12,
          paddingTop: 16,
          backgroundColor: "#0A0A0A",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.06)",
        }}
      >
        <Animated.View style={buttonAnimStyle}>
          <Pressable
            onPress={handleAddToCart}
            accessibilityLabel="Add to cart"
            testID="add-to-cart"
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
              Add to Cart
            </Text>
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.15)",
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 4,
                marginLeft: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 15,
                  color: "#0A0A0A",
                }}
              >
                ${itemTotal.toFixed(2)}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

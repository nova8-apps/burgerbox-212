import React, { useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Heart, ShoppingBag } from "lucide-react-native";
import { BURGERS } from "@/lib/demo-data";
import { BurgerCard } from "@/components/BurgerCard";
import { useAppStore } from "@/lib/store";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const favoriteIds = useAppStore((s) => s.favoriteIds);
  const cartItems = useAppStore((s) => s.cartItems);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const favBurgers = useMemo(
    () => BURGERS.filter((b) => favoriteIds.includes(b.id)),
    [favoriteIds]
  );

  // Build 2-col grid rows
  const gridRows = useMemo(() => {
    const rows: Array<[typeof favBurgers[0], typeof favBurgers[0] | null]> = [];
    for (let i = 0; i < favBurgers.length; i += 2) {
      rows.push([favBurgers[i], favBurgers[i + 1] ?? null]);
    }
    return rows;
  }, [favBurgers]);

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Heart size={22} color="#F59E0B" fill="#F59E0B" />
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 22,
              color: "#F5F5F5",
            }}
          >
            Favorites
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/cart")}
          accessibilityLabel="Open cart"
          testID="fav-cart"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: "#1E1E1E",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShoppingBag size={22} color="#F5F5F5" />
          {cartCount > 0 ? (
            <View
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                backgroundColor: "#F59E0B",
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 4,
                borderWidth: 2,
                borderColor: "#0A0A0A",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 11,
                  color: "#0A0A0A",
                }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {favBurgers.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 40,
          }}
        >
          <Heart size={56} color="#2A2A2A" />
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: "#F5F5F5",
              marginTop: 20,
              textAlign: "center",
            }}
          >
            No favorites yet
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: "#6B7280",
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Tap the heart icon on any burger to save it here
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        >
          {gridRows.map((row, idx) => (
            <Animated.View
              key={`fav-row-${idx}`}
              entering={FadeInDown.delay(idx * 100).duration(300)}
              style={{ flexDirection: "row", gap: 12 }}
            >
              <BurgerCard burger={row[0]} />
              {row[1] ? (
                <BurgerCard burger={row[1]} />
              ) : (
                <View style={{ flex: 1 }} />
              )}
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

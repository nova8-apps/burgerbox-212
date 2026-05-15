import React, { useState, useMemo } from "react";
import { View, ScrollView, Pressable, Platform } from "react-native";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ShoppingBag, Search } from "lucide-react-native";
import { BURGERS, CATEGORIES } from "@/lib/demo-data";
import { BurgerCard } from "@/components/BurgerCard";
import { useAppStore } from "@/lib/store";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const cartItems = useAppStore((s) => s.cartItems);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const badgeScale = useSharedValue(1);
  const badgeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const filteredBurgers = useMemo(() => {
    if (activeCategory === "all") return BURGERS;
    return BURGERS.filter((b) => b.category === activeCategory);
  }, [activeCategory]);

  const featuredBurgers = useMemo(
    () => BURGERS.filter((b) => b.featured),
    []
  );

  const handleCategoryPress = (catId: string) => {
    setActiveCategory(catId);
    if (Platform.OS !== "web") {
      import("expo-haptics")
        .then((H) => H.selectionAsync())
        .catch(() => {});
    }
  };

  const handleCartPress = () => {
    router.push("/cart");
  };

  // Build burger grid rows (2 columns)
  const gridRows = useMemo(() => {
    const rows: Array<[typeof filteredBurgers[0], typeof filteredBurgers[0] | null]> = [];
    for (let i = 0; i < filteredBurgers.length; i += 2) {
      rows.push([filteredBurgers[i], filteredBurgers[i + 1] ?? null]);
    }
    return rows;
  }, [filteredBurgers]);

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: "#9CA3AF",
            }}
          >
            Good evening 👋
          </Text>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 22,
              color: "#F5F5F5",
              marginTop: 2,
            }}
          >
            What's your craving?
          </Text>
        </View>

        <Pressable
          onPress={handleCartPress}
          accessibilityLabel="Open cart"
          testID="home-cart-button"
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
            <Animated.View
              style={[
                badgeAnimStyle,
                {
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
                },
              ]}
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
            </Animated.View>
          ) : null}
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Search bar (decorative) */}
        <Pressable
          accessibilityLabel="Search burgers"
          testID="search-bar"
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
            backgroundColor: "#1E1E1E",
            borderRadius: 14,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 14,
          }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Search size={18} color="#6B7280" />
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 15,
              color: "#6B7280",
              marginLeft: 10,
            }}
          >
            Search burgers, combos...
          </Text>
        </Pressable>

        {/* Featured Section */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: "#F5F5F5",
              paddingHorizontal: 20,
              marginBottom: 14,
            }}
          >
            🔥 Featured
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            style={{ flexGrow: 0 }}
          >
            {featuredBurgers.map((burger, index) => (
              <Animated.View
                key={burger.id}
                entering={FadeInDown.delay(index * 100)
                  .duration(400)
                  .springify()}
              >
                <BurgerCard burger={burger} variant="featured" />
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          style={{ marginBottom: 16, flexGrow: 0 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => handleCategoryPress(cat.id)}
                accessibilityLabel={`Filter by ${cat.label}`}
                testID={`category-${cat.id}`}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: isActive
                    ? "#F59E0B"
                    : "rgba(245,158,11,0.08)",
                  borderWidth: isActive ? 0 : 1,
                  borderColor: isActive
                    ? "transparent"
                    : "rgba(255,255,255,0.06)",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 14,
                    color: isActive ? "#0A0A0A" : "#9CA3AF",
                  }}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Burger Grid */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: "#F5F5F5",
              marginBottom: 14,
            }}
          >
            {activeCategory === "all"
              ? "All Burgers"
              : CATEGORIES.find((c) => c.id === activeCategory)?.label ??
                "Burgers"}
          </Text>

          {filteredBurgers.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                paddingVertical: 48,
                backgroundColor: "#141414",
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  marginBottom: 12,
                }}
              >
                🍔
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                  color: "#F5F5F5",
                  marginBottom: 6,
                }}
              >
                No burgers match this filter
              </Text>
              <Pressable
                onPress={() => setActiveCategory("all")}
                accessibilityLabel="Reset filter"
                testID="reset-filter"
                style={{
                  marginTop: 12,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 10,
                  backgroundColor: "rgba(245,158,11,0.15)",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 14,
                    color: "#F59E0B",
                  }}
                >
                  Show All
                </Text>
              </Pressable>
            </View>
          ) : (
            gridRows.map((row, idx) => (
              <View
                key={`row-${idx}`}
                style={{ flexDirection: "row", gap: 12 }}
              >
                <BurgerCard burger={row[0]} />
                {row[1] ? (
                  <BurgerCard burger={row[1]} />
                ) : (
                  <View style={{ flex: 1 }} />
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

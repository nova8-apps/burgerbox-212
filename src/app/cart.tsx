import React, { useState } from "react";
import { View, ScrollView, Pressable, TextInput, Platform } from "react-native";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  X,
  Minus,
  Plus,
  Trash2,
  Tag,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react-native";
import { useAppStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  Layout,
} from "react-native-reanimated";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const cartItems = useAppStore((s) => s.cartItems);
  const removeFromCart = useAppStore((s) => s.removeFromCart);
  const updateQuantity = useAppStore((s) => s.updateQuantity);
  const clearCart = useAppStore((s) => s.clearCart);
  const getCartTotal = useAppStore((s) => s.getCartTotal);
  const applyDiscount = useAppStore((s) => s.applyDiscount);
  const discountCode = useAppStore((s) => s.discountCode);
  const discountPercent = useAppStore((s) => s.discountPercent);
  const placeOrder = useAppStore((s) => s.placeOrder);

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState(false);

  const subtotal = cartItems.reduce((s, i) => s + i.totalPrice, 0);
  const total = getCartTotal();
  const deliveryFee = cartItems.length > 0 ? 2.99 : 0;
  const finalTotal = total + deliveryFee;

  const buttonScale = useSharedValue(1);
  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const ok = applyDiscount(promoInput);
    if (!ok) {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 2000);
    }
    setPromoInput("");
  };

  const handlePlaceOrder = () => {
    buttonScale.value = withSpring(0.92, { damping: 10 });
    setTimeout(() => {
      buttonScale.value = withSpring(1, { damping: 12 });
    }, 150);
    if (Platform.OS !== "web") {
      import("expo-haptics")
        .then((H) => H.notificationAsync(H.NotificationFeedbackType.Success))
        .catch(() => {});
    }
    placeOrder();
    router.replace("/order-confirmation");
  };

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
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.06)",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          testID="cart-back"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            backgroundColor: "#1E1E1E",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowLeft size={20} color="#F5F5F5" />
        </Pressable>
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 18,
            color: "#F5F5F5",
          }}
        >
          Your Cart
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {cartItems.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}
        >
          <ShoppingBag size={56} color="#2A2A2A" />
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: "#F5F5F5",
              marginTop: 20,
            }}
          >
            Your cart is empty
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
            Browse our menu and add something delicious
          </Text>
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Browse menu"
            testID="browse-menu"
            style={{
              marginTop: 24,
              paddingHorizontal: 24,
              paddingVertical: 14,
              backgroundColor: "#F59E0B",
              borderRadius: 14,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 15,
                color: "#0A0A0A",
              }}
            >
              Browse Menu
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, paddingBottom: 200 }}
          >
            {cartItems.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(index * 80).duration(300)}
                layout={Layout.springify()}
                style={{
                  backgroundColor: "#1E1E1E",
                  borderRadius: 16,
                  padding: 14,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: item.burger.image }}
                  style={{ width: 72, height: 72, borderRadius: 12 }}
                  contentFit="cover"
                />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 15,
                      color: "#F5F5F5",
                    }}
                    numberOfLines={1}
                  >
                    {item.burger.name}
                  </Text>
                  {item.selectedToppings.length > 0 ? (
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 12,
                        color: "#6B7280",
                        marginTop: 2,
                      }}
                      numberOfLines={1}
                    >
                      +{item.selectedToppings.map((t) => t.name).join(", ")}
                    </Text>
                  ) : null}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8,
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 16,
                        color: "#F59E0B",
                      }}
                    >
                      ${item.totalPrice.toFixed(2)}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          if (item.quantity <= 1) {
                            removeFromCart(item.id);
                          } else {
                            updateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        accessibilityLabel="Decrease quantity"
                        testID={`cart-minus-${item.id}`}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          backgroundColor:
                            item.quantity <= 1
                              ? "rgba(239,68,68,0.15)"
                              : "rgba(255,255,255,0.08)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.quantity <= 1 ? (
                          <Trash2 size={14} color="#EF4444" />
                        ) : (
                          <Minus size={14} color="#F5F5F5" />
                        )}
                      </Pressable>
                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 15,
                          color: "#F5F5F5",
                          minWidth: 20,
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </Text>
                      <Pressable
                        onPress={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        accessibilityLabel="Increase quantity"
                        testID={`cart-plus-${item.id}`}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          backgroundColor: "rgba(245,158,11,0.15)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Plus size={14} color="#F59E0B" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))}

            {/* Promo Code */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
                gap: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#1E1E1E",
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  borderWidth: 1,
                  borderColor: promoError
                    ? "#EF4444"
                    : discountCode
                    ? "#22C55E"
                    : "rgba(255,255,255,0.06)",
                }}
              >
                <Tag size={16} color="#6B7280" />
                <TextInput
                  placeholder={
                    discountCode
                      ? `${discountCode} applied (-${discountPercent}%)`
                      : "Promo code"
                  }
                  placeholderTextColor={
                    discountCode ? "#22C55E" : "#6B7280"
                  }
                  value={promoInput}
                  onChangeText={setPromoInput}
                  style={{
                    flex: 1,
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: "#F5F5F5",
                    paddingVertical: 14,
                    marginLeft: 10,
                  }}
                  editable={!discountCode}
                  autoCapitalize="characters"
                />
              </View>
              {!discountCode ? (
                <Pressable
                  onPress={handleApplyPromo}
                  accessibilityLabel="Apply promo code"
                  testID="apply-promo"
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    backgroundColor: "#F59E0B",
                    borderRadius: 14,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 14,
                      color: "#0A0A0A",
                    }}
                  >
                    Apply
                  </Text>
                </Pressable>
              ) : null}
            </View>
            {promoError ? (
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  color: "#EF4444",
                  marginTop: 6,
                  marginLeft: 4,
                }}
              >
                Invalid promo code. Try BURGER20 or FIRST10
              </Text>
            ) : null}

            {/* Order Summary */}
            <View
              style={{
                backgroundColor: "#141414",
                borderRadius: 16,
                padding: 18,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                  color: "#F5F5F5",
                  marginBottom: 14,
                }}
              >
                Order Summary
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: "#9CA3AF",
                  }}
                >
                  Subtotal
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 14,
                    color: "#F5F5F5",
                  }}
                >
                  ${subtotal.toFixed(2)}
                </Text>
              </View>
              {discountPercent > 0 ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                      color: "#22C55E",
                    }}
                  >
                    Discount ({discountPercent}%)
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 14,
                      color: "#22C55E",
                    }}
                  >
                    -${(subtotal - total).toFixed(2)}
                  </Text>
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: "#9CA3AF",
                  }}
                >
                  Delivery
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 14,
                    color: "#F5F5F5",
                  }}
                >
                  ${deliveryFee.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  marginBottom: 14,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 16,
                    color: "#F5F5F5",
                  }}
                >
                  Total
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_800ExtraBold",
                    fontSize: 22,
                    color: "#F59E0B",
                  }}
                >
                  ${finalTotal.toFixed(2)}
                </Text>
              </View>
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
                onPress={handlePlaceOrder}
                accessibilityLabel="Place order"
                testID="place-order"
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
                  Place Order · ${finalTotal.toFixed(2)}
                </Text>
              </Pressable>
            </Animated.View>
            <Pressable
              onPress={() => router.back()}
              accessibilityLabel="Continue shopping"
              testID="continue-shopping"
              style={{
                marginTop: 10,
                paddingVertical: 12,
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
                Continue Shopping
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

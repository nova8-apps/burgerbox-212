import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ClipboardList,
  ChevronRight,
  Package,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
} from "lucide-react-native";
import { useAppStore } from "@/lib/store";
import type { Order } from "@/lib/demo-data";
import Animated, { FadeInDown } from "react-native-reanimated";

function StatusBadge({ status }: { status: Order["status"] }) {
  const config = {
    Delivered: { bg: "rgba(34,197,94,0.15)", color: "#22C55E", Icon: CheckCircle },
    Preparing: { bg: "rgba(245,158,11,0.15)", color: "#F59E0B", Icon: Clock },
    "On the Way": { bg: "rgba(59,130,246,0.15)", color: "#3B82F6", Icon: Truck },
    Cancelled: { bg: "rgba(239,68,68,0.15)", color: "#EF4444", Icon: XCircle },
  };
  const c = config[status];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: c.bg,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 4,
      }}
    >
      <c.Icon size={13} color={c.color} />
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: 12,
          color: c.color,
        }}
      >
        {status}
      </Text>
    </View>
  );
}

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const orders = useAppStore((s) => s.orders);

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 28,
              color: "#F5F5F5",
              letterSpacing: -0.5,
            }}
          >
            My Orders
          </Text>
          <View
            style={{
              backgroundColor: "rgba(245,158,11,0.15)",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                color: "#F59E0B",
              }}
            >
              {orders.length} orders
            </Text>
          </View>
        </View>
      </View>

      {orders.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 40,
          }}
        >
          <Package size={56} color="#2A2A2A" />
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: "#F5F5F5",
              marginTop: 20,
              textAlign: "center",
            }}
          >
            No orders yet
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
            Your order history will appear here
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        >
          {orders.map((order, index) => (
            <Animated.View
              key={order.id}
              entering={FadeInDown.delay(index * 80).duration(300)}
            >
              <Pressable
                onPress={() =>
                  router.push(`/order-details?id=${order.id}`)
                }
                accessibilityLabel={`View order ${order.orderNumber}`}
                testID={`order-${order.id}`}
                style={{
                  backgroundColor: "#1E1E1E",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 16,
                        color: "#F5F5F5",
                      }}
                    >
                      {order.orderNumber}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 13,
                        color: "#6B7280",
                        marginTop: 4,
                      }}
                    >
                      {order.date}
                    </Text>
                  </View>
                  <StatusBadge status={order.status} />
                </View>

                <View
                  style={{
                    height: 1,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    marginVertical: 12,
                  }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 13,
                      color: "#9CA3AF",
                    }}
                  >
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 17,
                        color: "#F59E0B",
                      }}
                    >
                      ${order.total.toFixed(2)}
                    </Text>
                    <ChevronRight size={16} color="#6B7280" />
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

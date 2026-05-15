import React, { useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
} from "lucide-react-native";
import { useAppStore } from "@/lib/store";
import type { Order } from "@/lib/demo-data";

function StatusIcon({ status }: { status: Order["status"] }) {
  switch (status) {
    case "Delivered":
      return <CheckCircle size={18} color="#22C55E" />;
    case "Preparing":
      return <Clock size={18} color="#F59E0B" />;
    case "On the Way":
      return <Truck size={18} color="#3B82F6" />;
    case "Cancelled":
      return <XCircle size={18} color="#EF4444" />;
  }
}

const statusColor: Record<Order["status"], string> = {
  Delivered: "#22C55E",
  Preparing: "#F59E0B",
  "On the Way": "#3B82F6",
  Cancelled: "#EF4444",
};

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const orders = useAppStore((s) => s.orders);

  const order = useMemo(() => orders.find((o) => o.id === id), [id, orders]);

  if (!order) {
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
          Order not found
        </Text>
      </View>
    );
  }

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
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.06)",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          testID="order-detail-back"
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
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 17,
              color: "#F5F5F5",
            }}
          >
            {order.orderNumber}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Status card */}
        <View
          style={{
            backgroundColor: "#1E1E1E",
            borderRadius: 16,
            padding: 18,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: `${statusColor[order.status]}20`,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 14,
            }}
          >
            <StatusIcon status={order.status} />
          </View>
          <View>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                color: statusColor[order.status],
              }}
            >
              {order.status}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 13,
                color: "#6B7280",
                marginTop: 2,
              }}
            >
              {order.date}
            </Text>
          </View>
        </View>

        {/* Items */}
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 16,
            color: "#F5F5F5",
            marginBottom: 12,
          }}
        >
          Items
        </Text>
        {order.items.map((item) => (
          <View
            key={item.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#141414",
              borderRadius: 14,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <Image
              source={{ uri: item.burger.image }}
              style={{ width: 56, height: 56, borderRadius: 10 }}
              contentFit="cover"
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: "#F5F5F5",
                }}
              >
                {item.burger.name}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  color: "#6B7280",
                  marginTop: 2,
                }}
              >
                Qty: {item.quantity}
                {item.selectedToppings.length > 0
                  ? ` · +${item.selectedToppings.map((t) => t.name).join(", ")}`
                  : null}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 15,
                color: "#F59E0B",
              }}
            >
              ${item.totalPrice.toFixed(2)}
            </Text>
          </View>
        ))}

        {/* Total */}
        <View
          style={{
            backgroundColor: "#1E1E1E",
            borderRadius: 16,
            padding: 18,
            marginTop: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
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
              ${order.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Reorder */}
        <Pressable
          onPress={() => router.replace("/(tabs)/home")}
          accessibilityLabel="Order again"
          testID="reorder"
          style={{
            backgroundColor: "rgba(245,158,11,0.15)",
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 15,
              color: "#F59E0B",
            }}
          >
            Order Again
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

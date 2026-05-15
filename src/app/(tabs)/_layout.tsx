import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { Home, Heart, ClipboardList, User } from "lucide-react-native";
import { useAppStore } from "@/lib/store";
import { View, Text } from "react-native";

const isWeb = Platform.OS === "web";

function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View
      style={{
        position: "absolute",
        top: -4,
        right: -8,
        backgroundColor: "#F59E0B",
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 3,
      }}
    >
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: 10,
          color: "#0A0A0A",
          fontWeight: "600",
        }}
      >
        {count > 9 ? "9+" : count}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: "bottom",
        tabBarStyle: {
          backgroundColor: "#1A1A1A",
          borderTopColor: "rgba(255,255,255,0.06)",
          borderTopWidth: 1,
          height: isWeb ? 64 : 84,
          paddingBottom: isWeb ? 0 : 28,
          paddingTop: isWeb ? 0 : 8,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 11,
          lineHeight: 14,
          marginTop: 2,
        },
        tabBarActiveTintColor: "#F59E0B",
        tabBarInactiveTintColor: "#6B7280",
        sceneStyle: { flex: 1 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

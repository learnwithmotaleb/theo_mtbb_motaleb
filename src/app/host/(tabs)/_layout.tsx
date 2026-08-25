import { HousingIcon } from "@/assets/icons/cleaner_icon/HousingIcon";
import { HomeIcon } from "@/assets/icons/host_icon/HomeIcon";
import { MenuIcon } from "@/assets/icons/host_icon/MenuIcon";
import { MessageIcon } from "@/assets/icons/host_icon/MessageIcon";
import { PlanningIcon } from "@/assets/icons/host_icon/PlanningIcon";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { hp, wp } from "../../../../utils/responsiveDevice";

const TabIcon = ({ focused, children }: { focused: boolean; children: React.ReactNode }) => (
    <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? '#fff' : 'transparent',
        borderRadius: 22,
        width: 44,
        height: 44,
    }}>
        {children}
    </View>
);

export default function PatientTabsLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#0088FF",
                tabBarInactiveTintColor: "#8E8E93",
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 2,
                    // color:"#8E8E93"
                },
                tabBarStyle: {
                    backgroundColor: "#FFFFFF",
                    height: hp(60) + insets.bottom,
                    position: 'absolute',
                    bottom: 0,
                    left: wp(20),
                    right: wp(20),
                    borderTopWidth: 0.6,
                    elevation: 0,
                    shadowOpacity: 0,
                    paddingBottom: insets.bottom,
                    paddingTop: 8,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused}>
                            <HomeIcon color={color} size={24} />
                        </TabIcon>
                    ),
                }}
            />
            <Tabs.Screen
                name="planning"
                options={{
                    tabBarLabel: "Planning",
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused}>
                            <PlanningIcon color={color} size={24} />
                        </TabIcon>
                    ),
                }}
            />
            <Tabs.Screen
                name="housing"
                options={{
                    tabBarLabel: "Housing",
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused}>
                            <HousingIcon color={color} size={24} />
                        </TabIcon>
                    ),
                }}
            />
            <Tabs.Screen
                name="message"
                options={{
                    tabBarLabel: "Message",
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused}>
                            <MessageIcon color={color} size={24} />
                        </TabIcon>
                    ),
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    tabBarLabel: "Menu",
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused}>
                            <MenuIcon color={color} size={24} />
                        </TabIcon>
                    ),
                }}
            />
        </Tabs>
    );
}
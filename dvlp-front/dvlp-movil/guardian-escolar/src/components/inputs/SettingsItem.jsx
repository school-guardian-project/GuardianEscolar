import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function SettingsItem({
    icon,
    title,
    onPress,
    rightContent,
}) {
    const { theme } = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.container,
                {
                    backgroundColor: theme.cardSecondaryBg,
                    borderColor: theme.borderColor,
                },
            ]}
        >
            {/* Icono */}
            {icon}

            {/* Texto */}
            <Text
                style={[
                    styles.title,
                    { color: theme.textColor },
                ]}
            >
                {title}
            </Text>

            {/* Contenido derecho */}
            {rightContent ? (
                rightContent
            ) : (
                <Text
                    style={[
                        styles.arrow,
                        { color: theme.textSecondary },
                    ]}
                >
                    ›
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        borderRadius: 18,
        borderWidth: 1,
        paddingHorizontal: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    title: {
        flex: 1,
        marginLeft: 15,
        fontSize: 17,
    },

    arrow: {
        fontSize: 22,
        fontWeight: "bold",
    },
});
import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { themes } from "@core/constants/Colors"

export default function QRButtom({ config, onOpenModel }) {
    return (
        <View style={[style.container, !config.showQR && style.containerNoQR]}>
            {config.showQR && (

                <Pressable style={style.icon}
                    onPress={() => onOpenModel(config.qrMode === "activate" ? "activeQR" : "qrScanner")}   
                >
                    <Ionicons name="qr-code-outline" size={64} color="black" />
                </Pressable>
            )}
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        width: 76,
        height: 76,
        padding: 6,
        backgroundColor: themes.lightBlue.navbarColor,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center"
    },

    icon: {
        width: 67,
        height: 67,
        borderRadius: 8,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },

    containerNoQR: {
        display: "none"
    }
});
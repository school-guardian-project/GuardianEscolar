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
        width: "100",
        height: "auto",
        padding: 8,
        backgroundColor: themes.lightBlue.navbarColor,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        marginLeft: 12,
        justifyContent: "center",
        alignItems: "center"
    },

    icon: {
        borderRadius: 20,
        backgroundColor: "#fff",
        padding: 8,
        justifyContent: "center",
        alignItems: "center"
    },

    containerNoQR: {
        flex: "none"
    }
});
import { Modal, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

export default function BaseModal({ visible, onClose, animationType = "", children }) {
    return (
        <Modal visible={visible} transparent animationType={animationType} onRequestClose={onClose}>
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={() => {}}>
                    {children}
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center"
    },

    sheet: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 20,
        maxHeight: "80%"
    }
});
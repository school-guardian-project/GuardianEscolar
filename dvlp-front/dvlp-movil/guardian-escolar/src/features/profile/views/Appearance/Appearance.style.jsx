import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },

    sectionTitle: {
        fontSize: 13,
        fontWeight: "600",
        marginTop: 10,
        marginBottom: 12,
    },

    modeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
    },

    modeOption: {
        width: "48%",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 16,
        padding: 12,
    },

    phonePreview: {
        width: 100,
        height: 155,
        borderRadius: 15,
        borderWidth: 2,
        overflow: "hidden",
        marginBottom: 10,
    },

    phoneHeader: {
        height: 25,
    },

    lightContent: {
        padding: 8,
    },

    lightLineLarge: {
        height: 18,
        backgroundColor: "#F1F5F9",
        borderRadius: 4,
        marginBottom: 6,
    },

    lightLineSmall: {
        height: 8,
        width: "65%",
        backgroundColor: "#E2E8F0",
        borderRadius: 4,
        marginBottom: 10,
    },

    lightBox: {
        height: 35,
        backgroundColor: "#F1F5F9",
        borderRadius: 5,
    },

    darkContent: {
        padding: 8,
    },

    darkLineLarge: {
        height: 18,
        backgroundColor: "#1C1F26",
        borderRadius: 4,
        marginBottom: 6,
    },

    darkLineSmall: {
        height: 8,
        width: "65%",
        backgroundColor: "#252A34",
        borderRadius: 4,
        marginBottom: 10,
    },

    darkBox: {
        height: 35,
        backgroundColor: "#1C1F26",
        borderRadius: 5,
    },

    modeText: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 8,
    },

    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    colorsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    colorOption: {
        width: "48%",
        borderRadius: 12,
        borderWidth: 2,
        overflow: "hidden",
        marginBottom: 12,
    },

    colorPreview: {
        height: 50,
    },

    colorBottom: {
        minHeight: 38,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
    },

    colorText: {
        fontSize: 14,
        fontWeight: "600",
    },

    colorCheck: {
        position: "absolute",
        right: 8,
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
    },

});

export default styles;
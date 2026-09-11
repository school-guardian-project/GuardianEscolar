import { CommonActions } from "@react-navigation/native";

export function resetToSection(navigation, section) {
    navigation.dispatch(
        CommonActions.reset({
            index: 1,
            routes: [
                { name: "Profile" },
                { name: section },
            ],
        })
    );
}
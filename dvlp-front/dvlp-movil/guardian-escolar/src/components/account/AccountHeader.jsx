import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@core/services/ThemeService";

import styles from "@core/styles/accountScreen.style";
export default function AccountHeader({
     title,
    description,
}){
     const {theme}= useTheme();

     return(
        <View style={styles.headerContainer}>
            <Text style={[
                styles.title,
                { color: theme.textColor},
            ]}
            >
                {title}
            </Text>

            {description && (
                <Text style={[
                    styles.description,
                        { color: theme.textSecondary},
                ]}
                >
                    {description}
                </Text>
            )}
        </View>
     )
}
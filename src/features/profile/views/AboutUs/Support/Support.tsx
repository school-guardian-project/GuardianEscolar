import React, { useState } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import BackButton from "@components/buttons/BackButton";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";
import BottomTabBar from "@components/layout/BottomTabBar";
import PrimaryButton from "@components/buttons/PrimaryButton";

import styles from "@core/styles/profileScreen.style";


export default function Support() {
    const { theme } = useTheme();
    const { t } = useTranslation();

    const [message, setMessage] = useState("");
    return (
        <View
            style={[styles.container,
            { backgroundColor: theme.bgColor }

            ]}>

            <View style={[styles.header]}>
                <BackButton label={t("button.suport")} />
            </View>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.sectionTitle,
                { color: theme.textColor },
                ]}
                >
                    {t("support.title")}
                </Text>

                <TextInput
                    style={[
                        styles.textArea,
                        {
                            backgroundColor: theme.cardBg,
                            color: theme.textColor,
                            borderColor: theme.borderColor,
                            borderWidth: 1,
                        },
                    ]}
                    multiline
                    placeholder={t("support.placeholder")}
                    placeholderTextColor={theme.textSecondary}
                    textAlignVertical="top"
                    value={message}
                    onChangeText={setMessage}
                >

                </TextInput>

                <PrimaryButton
                    text={t("button.send")}
                    onPress={() => { }}
                />
            </ScrollView>
            <BottomTabBar />
        </View>
    );
}
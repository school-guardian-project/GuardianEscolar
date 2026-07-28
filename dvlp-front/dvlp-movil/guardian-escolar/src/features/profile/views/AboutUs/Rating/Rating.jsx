import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable} from "react-native";
import BackButton from "@components/buttons/BackButton";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";
import BottomTabBar from "@components/layout/BottomTabBar";
import PrimaryButton from "@components/buttons/PrimaryButton";

import { Ionicons } from "@expo/vector-icons";
import styles from "@core/styles/profileScreen.style";


export default function Support() {
    const { theme } = useTheme();
    const { t } = useTranslation();

    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(0);
    return (
        <View
            style={[styles.container,
            { backgroundColor: theme.bgColor }

            ]}>

            <View style={[styles.header]}>
                <BackButton label={t("button.rateUs")} />
            </View>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.sectionTitle,
                { color: theme.textColor },
                ]}
                >
                    {t("rateUs.title")}
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
                    placeholder={t("rateUs.placeholder")}
                    placeholderTextColor={theme.textSecondary}
                    textAlignVertical="top"
                    value={message}
                    onChangeText={setMessage}
                >

                </TextInput>


                <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 50, }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Pressable
                            key={star}
                            onPress={() => setRating(star)}
                            style={{ marginHorizontal: 5 }}
                        >
                            <Ionicons
                                name={star <= rating ? "star" : "star-outline"}
                                size={42}
                                color={star <= rating ? "#FFC107" : "#9CA3AF"}
                            />
                        </Pressable>
                    ))}
                </View>

                <PrimaryButton
                    text={t("button.send")}
                    onPress={() => { }}
                />
            </ScrollView>
            <BottomTabBar />
        </View>
    )
}
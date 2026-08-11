import React from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@core/services/ThemeService";
import { useTranslation } from "react-i18next";

import BackButton from "@components/buttons/BackButton";
import BottomTabBar from "@components/layout/BottomTabBar";
import styles from "./Appearance.style";
import style from "@core/styles/profileScreen.style";
export default function Appearance() {

    const {
        theme,
        themeName,
        isDark,
        toggleTheme,
        changeColor,
    } = useTheme();

    const { t } = useTranslation();

    return (
        <View
                    style={[
                        styles.container,
                        { backgroundColor: theme.bgColor },
                    ]}
                >
                    {/* Encabezado */}
                    <View style={style.header}>
                        <BackButton label={t("inputs.appearance")}
                            backTo="Profile" />
                    </View>
        
        
                    {/* Contenido */}
                    <ScrollView
                        contentContainerStyle={style.content}
                        showsVerticalScrollIndicator={false}
                    >

            
                {/* MODO DE APARIENCIA */}
               
                <Text
                    style={[
                        styles.sectionTitle,
                        {
                            color: theme.textSecondary,
                        },
                    ]}
                >
                    APARIENCIA
                </Text>

                <View style={styles.modeContainer}>

                    {/* CLARO */}

                    <Pressable
                        onPress={() => {
                            if (isDark) {
                                toggleTheme();
                            }
                        }}
                        style={[
                            styles.modeOption,
                            {
                                borderColor:
                                    !isDark
                                        ? theme.buttonApply
                                        : theme.borderColor,
                            },
                        ]}
                    >

                        <View
                            style={[
                                styles.phonePreview,
                                {
                                    backgroundColor: "#FFFFFF",
                                    borderColor: theme.borderColor,
                                },
                            ]}
                        >

                            <View
                                style={[
                                    styles.phoneHeader,
                                    {
                                        backgroundColor: theme.buttonApply,
                                    },
                                ]}
                            />

                            <View style={styles.lightContent}>
                                <View style={styles.lightLineLarge} />
                                <View style={styles.lightLineSmall} />
                                <View style={styles.lightBox} />
                            </View>

                        </View>

                        <Text
                            style={[
                                styles.modeText,
                                {
                                    color: theme.textColor,
                                },
                            ]}
                        >
                            Claro
                        </Text>

                        <View
                            style={[
                                styles.radio,
                                {
                                    borderColor: theme.borderColor,
                                    backgroundColor: !isDark
                                        ? theme.buttonApply
                                        : "transparent",
                                },
                            ]}
                        >
                            {!isDark && (
                                <Ionicons
                                    name="checkmark"
                                    size={16}
                                    color="#FFFFFF"
                                />
                            )}
                        </View>

                    </Pressable>


                    {/* OSCURO */}

                    <Pressable
                        onPress={() => {
                            if (!isDark) {
                                toggleTheme();
                            }
                        }}
                        style={[
                            styles.modeOption,
                            {
                                borderColor:
                                    isDark
                                        ? theme.buttonApply
                                        : theme.borderColor,
                            },
                        ]}
                    >

                        <View
                            style={[
                                styles.phonePreview,
                                {
                                    backgroundColor: "#101214",
                                    borderColor: theme.buttonApply,
                                },
                            ]}
                        >

                            <View
                                style={[
                                    styles.phoneHeader,
                                    {
                                        backgroundColor: theme.navbarColor,
                                    },
                                ]}
                            />

                            <View style={styles.darkContent}>
                                <View style={styles.darkLineLarge} />
                                <View style={styles.darkLineSmall} />
                                <View style={styles.darkBox} />
                            </View>

                        </View>

                        <Text
                            style={[
                                styles.modeText,
                                {
                                    color: theme.textColor,
                                },
                            ]}
                        >
                            Oscuro
                        </Text>

                        <View
                            style={[
                                styles.radio,
                                {
                                    borderColor: theme.borderColor,
                                    backgroundColor: isDark
                                        ? theme.buttonApply
                                        : "transparent",
                                },
                            ]}
                        >
                            {isDark && (
                                <Ionicons
                                    name="checkmark"
                                    size={16}
                                    color="#FFFFFF"
                                />
                            )}
                        </View>

                    </Pressable>

                </View>



                {/* COLOR */}


                <Text
                    style={[
                        styles.sectionTitle,
                        {
                            color: theme.textSecondary,
                        },
                    ]}
                >
                    COLOR
                </Text>


                <View style={styles.colorsContainer}>

                    {/* AZUL */}

                    <ColorOption
                        name="Azul"
                        color="#1A56DB"
                        selected={
                            themeName === "lightBlue" ||
                            themeName === "darkBlue"
                        }
                        onPress={() => changeColor("blue")}
                        theme={theme}
                    />


                    {/* VERDE */}

                    <ColorOption
                        name="Verde"
                        color="#16A34A"
                        selected={
                            themeName === "lightGreen" ||
                            themeName === "darkGreen"
                        }
                        onPress={() => changeColor("green")}
                        theme={theme}
                    />


                    {/* AMARILLO */}

                    <ColorOption
                        name="Amarillo"
                        color="#D4A017"
                        selected={
                            themeName === "lightYellow" ||
                            themeName === "darkYellow"
                        }
                        onPress={() => changeColor("yellow")}
                        theme={theme}
                    />


                    {/* ROJO */}

                    <ColorOption
                        name="Rojo"
                        color="#B42318"
                        selected={
                            themeName === "lightRed" ||
                            themeName === "darkRed"
                        }
                        onPress={() => changeColor("red")}
                        theme={theme}
                    />

                </View>

            </ScrollView>

            <BottomTabBar />

        </View>
    );
}



/* OPCIÓN DE COLOR */


function ColorOption({
    name,
    color,
    selected,
    onPress,
    theme,
}) {

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.colorOption,
                {
                    backgroundColor: theme.cardSecondaryBg,
                    borderColor: selected
                        ? color
                        : theme.borderColor,
                },
            ]}
        >

            <View
                style={[
                    styles.colorPreview,
                    {
                        backgroundColor: color,
                    },
                ]}
            />

            <View style={styles.colorBottom}>

                <Text
                    style={[
                        styles.colorText,
                        {
                            color: theme.textColor,
                        },
                    ]}
                >
                    {name}
                </Text>

                {selected && (
                    <View
                        style={[
                            styles.colorCheck,
                            {
                                backgroundColor: color,
                            },
                        ]}
                    >
                        <Ionicons
                            name="checkmark"
                            size={14}
                            color="#FFFFFF"
                        />
                    </View>
                )}

            </View>

        </Pressable>
    );
}




import React, {
    useState,
    createContext,
    useContext,
    useEffect,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    themes,
    defaultTheme,
} from "../constants/Colors";


// Clave para guardar el tema
const THEME_KEY = "@guardian_escolar_theme";


// Contexto del tema
export const ThemeContext = createContext();


// Hook para usar el tema en cualquier componente
export function useTheme() {
    return useContext(ThemeContext);
}


// Proveedor del tema
export function ThemeProvider({ children }) {

    const [themeName, setThemeName] = useState(defaultTheme);
    const [themeLoaded, setThemeLoaded] = useState(false);

    const theme = themes[themeName];


    // Saber si actualmente está en oscuro
    const isDark = themeName.startsWith("dark");


    // Cargar el tema guardado
    useEffect(() => {

        const loadTheme = async () => {

            try {

                const savedTheme =
                    await AsyncStorage.getItem(THEME_KEY);

                if (savedTheme && themes[savedTheme]) {
                    setThemeName(savedTheme);
                }

            } catch (error) {

                console.log(
                    "Error cargando el tema:",
                    error
                );

            } finally {

                setThemeLoaded(true);

            }
        };

        loadTheme();

    }, []);


    // Cambiar tema completo
    const changeTheme = async (name) => {

        if (!themes[name]) {
            return;
        }

        setThemeName(name);

        try {

            await AsyncStorage.setItem(
                THEME_KEY,
                name
            );

        } catch (error) {

            console.log(
                "Error guardando el tema:",
                error
            );

        }
    };


    // Cambiar solamente el color
    const changeColor = async (color) => {

        const newTheme = isDark
            ? `dark${capitalize(color)}`
            : `light${capitalize(color)}`;

        if (themes[newTheme]) {
            await changeTheme(newTheme);
        }
    };


    // Cambiar entre claro y oscuro
    const toggleTheme = async () => {

        const color = getCurrentColor(themeName);

        const newTheme = isDark
            ? `light${capitalize(color)}`
            : `dark${capitalize(color)}`;

        await changeTheme(newTheme);
    };


    // Mientras carga el tema guardado
    if (!themeLoaded) {
        return null;
    }


    return (
        <ThemeContext.Provider
            value={{
                theme,
                themeName,
                isDark,

                changeTheme,
                changeColor,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}


// Obtener el color actual
function getCurrentColor(themeName) {

    if (themeName.includes("Blue")) {
        return "blue";
    }

    if (themeName.includes("Green")) {
        return "green";
    }

    if (themeName.includes("Yellow")) {
        return "yellow";
    }

    if (themeName.includes("Red")) {
        return "red";
    }

    return "blue";
}


// Primera letra en mayúscula
function capitalize(text) {

    return text.charAt(0).toUpperCase() + text.slice(1);

}
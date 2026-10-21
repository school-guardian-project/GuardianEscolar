import * as Application from "expo-application";
import { Platform } from "react-native";

const LATEST_URL = process.env.EXPO_PUBLIC_APK_LATEST_URL;

// Devuelve null cuando no hay nada que hacer: iOS, modo desarrollo,
// variable sin configurar, sin internet o la app ya está al día.
export async function checkForApkUpdate() {
  if (Platform.OS !== "android" || __DEV__ || !LATEST_URL) return null;

  try {
    const res = await fetch(LATEST_URL, { cache: "no-store" });
    if (!res.ok) return null;

    const latest = await res.json();
    const current = Number(Application.nativeBuildVersion);
    if (!Number.isFinite(current) || latest.versionCode <= current) return null;

    return { ...latest, forced: current < latest.minVersionCode };
  } catch {
    return null;
  }
}

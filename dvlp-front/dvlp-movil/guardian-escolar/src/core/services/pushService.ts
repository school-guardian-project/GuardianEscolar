import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { registerDevice } from "@core/services/notificationApi";

export type PushRegistrationResult =
  | { status: "registered" }
  | { status: "permission-denied" }
  | { status: "no-project-id" }
  | { status: "failed"; error: unknown };

export interface RegisterPushOptions {
  prompt?: boolean;
}

/**
 * Presenta las notificaciones que llegan con la app en primer plano.
 * Se configura una sola vez, al arrancar la app.
 */
export function configureNotificationHandling(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

function projectIdOrNull(): string | null {
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  return typeof projectId === "string" && projectId !== "" ? projectId : null;
}

async function hasPermission(prompt: boolean): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }
  if (!prompt || !current.canAskAgain) {
    return false;
  }
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

async function resolveExpoToken(projectId: string): Promise<string> {
  const expo = await Notifications.getExpoPushTokenAsync({ projectId });
  return expo.data;
}

export async function registerPushDevice(
  options: RegisterPushOptions = {}
): Promise<PushRegistrationResult> {
  try {
    if (!(await hasPermission(options.prompt !== false))) {
      return { status: "permission-denied" };
    }

    const projectId = projectIdOrNull();
    if (!projectId) {
      return { status: "no-project-id" };
    }

    await registerDevice({ expoToken: await resolveExpoToken(projectId) });
    return { status: "registered" };
  } catch (error) {
    return { status: "failed", error };
  }
}

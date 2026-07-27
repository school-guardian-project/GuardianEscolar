import { useRoleSwitcher } from "@core/dev/RoleSwitcherContext";

export default function useSession() {
    const { role, userId, childId } = useRoleSwitcher();
    return { role, userId, childId }
}
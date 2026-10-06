import { useRoleSwitcher } from "@core/dev/RoleSwitcherContext";

export default function useSession() {
    const { role, setRole, applyAuthRole, userId, childId } = useRoleSwitcher();
    return { role, setRole, applyAuthRole, userId, childId }
}
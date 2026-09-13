import { useRoleSwitcher } from "@core/dev/RoleSwitcherContext";

export default function useSession() {
    const { role, userId, childId, session, setSession } = useRoleSwitcher();
    return { role, userId, childId, session, setSession }
}
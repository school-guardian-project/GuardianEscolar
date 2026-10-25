import React, { createContext, useContext, useState, useEffect } from "react";
import { roleKeyFromRoleId } from "@core/config/roles/roleConfig";

const RoleSwitcherContext = createContext(null);

let onAuthRoleChange = null;

export function RoleSwitcherProvider({ children }) {
    const [role, setRole] = useState(() => "student");
    const [initialized, setInitialized] = useState(false);

    const applyAuthRole = () => {
        // Role gets updated via notifyAuthRoleChange after refresh/login
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const authService = await import("@core/services/authService");
                const session = await authService.getSession();
                if (mounted && session?.roleId) {
                    setRole(roleKeyFromRoleId(session.roleId));
                }
            } catch (e) {
                console.warn("[RoleSwitcher] Error loading session:", e);
            } finally {
                if (mounted) setInitialized(true);
            }
        })();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        onAuthRoleChange = () => {
            setTimeout(() => {
                import("@core/services/authService").then(auth =>
                    auth.getSession().then(s => s?.roleId && setRole(roleKeyFromRoleId(s.roleId)))
                ).catch(console.warn);
            }, 0);
        };
        return () => { onAuthRoleChange = null; };
    }, []);

    const value = { role, setRole, applyAuthRole, userId: null, childId: null, initialized };

    return (
        <RoleSwitcherContext.Provider value={value}>{ children }</RoleSwitcherContext.Provider>
    );
}

export function useRoleSwitcher() {
    const ctx = useContext(RoleSwitcherContext);
    if (!ctx) throw new Error("useRoleSwitcher must be used within RoleSwitcherProvider");
    return ctx;
}

export function notifyAuthRoleChange() {
    if (onAuthRoleChange) onAuthRoleChange();
}
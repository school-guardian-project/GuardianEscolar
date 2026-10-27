import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { roleKeyFromRoleId } from "@core/config/roles/roleConfig";

const RoleSwitcherContext = createContext(null);

let onAuthRoleChange = null;

export function RoleSwitcherProvider({ children }) {
    const [role, setRole] = useState(() => "student");
    const [initialized, setInitialized] = useState(false);

    const loadRoleFromSession = useCallback(async () => {
        try {
            const authService = await import("@core/services/authService");
            const session = await authService.getSession();
            if (session?.roleId) {
                setRole(roleKeyFromRoleId(session.roleId));
            }
        } catch (e) {
            console.warn("[RoleSwitcher] Error loading session:", e);
        }
    }, []);

    const applyAuthRole = useCallback(async () => {
        await loadRoleFromSession();
    }, [loadRoleFromSession]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                await loadRoleFromSession();
            } finally {
                if (mounted) setInitialized(true);
            }
        })();
        return () => { mounted = false; };
    }, [loadRoleFromSession]);

    useEffect(() => {
        onAuthRoleChange = () => {
            // Synchronous role update - no setTimeout
            loadRoleFromSession();
        };
        return () => { onAuthRoleChange = null; };
    }, [loadRoleFromSession]);

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
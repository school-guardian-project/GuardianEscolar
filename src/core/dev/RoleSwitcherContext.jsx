import React, { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "@core/services/authService";
import { roleKeyFromRoleId } from "@core/config/roles/roleConfig";

const RoleSwitcherContext = createContext(null);

// Callback global que authService llama tras refresh para actualizar el rol
let onAuthRoleChange = null;

export function RoleSwitcherProvider({ children }) {
    // Inicializar desde sesión persistida (SecureStore) para tener rol correcto al arrancar
    const [role, setRole] = useState(() => "student"); // default temporal
    const [initialized, setInitialized] = useState(false);
    
    const applyAuthRole = () => setRole(roleKeyFromRoleId(getRoleId()));
    
    // Cargar rol real desde SecureStore al montar
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const session = await getSession();
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
    
    // Registrar callback para que authService nos avise tras refresh
    useEffect(() => {
        onAuthRoleChange = applyAuthRole;
        return () => { onAuthRoleChange = null; };
    }, []);

    const value = { role, setRole, applyAuthRole, userId: null, childId: null, initialized };

    return (
        <RoleSwitcherContext.Provider value={value}>{ children }</RoleSwitcherContext.Provider>
    );
}

export function useRoleSwitcher() {
    const ctx = useContext(RoleSwitcherContext);
    if (!ctx) throw new Error("useRoleSwitcher debe usarse dentro de RoleSwitcherProvider");
    return ctx;
}

// Llamado por authService tras refresh exitoso
export function notifyAuthRoleChange() {
    if (onAuthRoleChange) onAuthRoleChange();
}
import React, { createContext, useContext, useState } from "react";
import { getRoleId } from "@core/services/authService";
import { roleKeyFromRoleId } from "@core/config/roles/roleConfig";

const RoleSwitcherContext = createContext(null);

// Callback global que authService llama tras refresh para actualizar el rol
let onAuthRoleChange = null;

export function RoleSwitcherProvider({ children }) {
    // Arranca con el rol real del token; el overlay solo lo pisa en desarrollo.
    const [role, setRole] = useState(() => roleKeyFromRoleId(getRoleId()));
    
    const applyAuthRole = () => setRole(roleKeyFromRoleId(getRoleId()));
    
    // Registrar callback para que authService nos avise tras refresh
    React.useEffect(() => {
        onAuthRoleChange = applyAuthRole;
        return () => { onAuthRoleChange = null; };
    }, []);

    const value = { role, setRole, applyAuthRole, userId: null, childId: null };

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
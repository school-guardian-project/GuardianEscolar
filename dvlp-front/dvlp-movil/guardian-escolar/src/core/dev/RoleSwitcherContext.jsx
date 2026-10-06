import React, { createContext, useContext, useState } from "react";
import { getRoleId } from "@core/services/authService";
import { roleKeyFromRoleId } from "@core/config/roles/roleConfig";

const RoleSwitcherContext = createContext(null);

export function RoleSwitcherProvider({ children }) {
    // Arranca con el rol real del token; el overlay solo lo pisa en desarrollo.
    const [role, setRole] = useState(() => roleKeyFromRoleId(getRoleId()));
    const applyAuthRole = () => setRole(roleKeyFromRoleId(getRoleId()));
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
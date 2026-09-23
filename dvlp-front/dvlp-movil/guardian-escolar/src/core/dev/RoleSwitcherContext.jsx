import React, { createContext, useContext, useState } from "react";

const RoleSwitcherContext = createContext(null);

export function RoleSwitcherProvider({ children }) {
    const [role, setRole] = useState("student");
    const value = { role, setRole, userId: null, childId: null };

    return (
        <RoleSwitcherContext.Provider value={value}>{ children }</RoleSwitcherContext.Provider>
    );
}

export function useRoleSwitcher() {
    const ctx = useContext(RoleSwitcherContext);
    if (!ctx) throw new Error("useRoleSwitcher debe usarse dentro de RoleSwitcherProvider");
    return ctx;
}
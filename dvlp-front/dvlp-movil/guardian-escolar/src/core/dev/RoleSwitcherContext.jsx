import React, { createContext, useContext, useState } from "react";

const RoleSwitcherContext = createContext(null);

export function RoleSwitcherProvider({ children }) {
    const [role, setRole] = useState("student");
    const [session, setSession] = useState(null);
    const userId = session?.person?.email || null;
    const childId = session?.person?.email || null;
    const value = { role, setRole, session, setSession, userId, childId };

    return (
        <RoleSwitcherContext.Provider value={value}>{ children }</RoleSwitcherContext.Provider>
    );
}

export function useRoleSwitcher() {
    const ctx = useContext(RoleSwitcherContext);
    if (!ctx) throw new Error("useRoleSwitcher debe usarse dentro de RoleSwitcherProvider");
    return ctx;
}
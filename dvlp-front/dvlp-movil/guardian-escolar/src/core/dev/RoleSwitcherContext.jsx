import React, { createContext, useContext, useState } from "react";

const RoleSwitcherContext = createContext(null);

const MOCK_IDS = {
    student: { userId: "mock-student-1"},
    driver: { userId: "mock-driver-1"},
    father: { userId: "mock-father-1", childId: "mock-student-1"}
}

export function RoleSwitcherProvider({ children }) {
    const [role, setRole] = useState("student");
    const value = { role, setRole, ...MOCK_IDS[role] };

    return (
        <RoleSwitcherContext.Provider value={value}>{ children }</RoleSwitcherContext.Provider>
    );
}

export function useRoleSwitcher() {
    const ctx = useContext(RoleSwitcherContext);
    if (!ctx) throw new Error("useRoleSwitcher debe usarse dentro de RoleSwitcherProvider");
    return ctx;
}
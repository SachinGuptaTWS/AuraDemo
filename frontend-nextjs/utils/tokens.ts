// Animation and design tokens for consistent styling across the app

export const springConfig = {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
};

export const smoothConfig = {
    type: "tween" as const,
    duration: 0.3,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const colors = {
    void: "#020202",
    surface: "#09090B",
    glass: "rgba(255, 255, 255, 0.05)",
    border: "rgba(255, 255, 255, 0.1)",
    textPrimary: "#EDEDED",
    textSecondary: "#A1A1AA",
    accentBlue: "#3B82F6",
};

export const durations = {
    fast: 200,
    normal: 300,
    slow: 500,
};

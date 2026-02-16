import * as THREE from "three";

/**
 * CPK coloring scheme for chemical elements
 * Named after Corey, Pauling, and Koltun
 * Source: https://en.wikipedia.org/wiki/CPK_coloring
 */
export const CPK_COLORS: Record<string, string> = {
    H: "#FFFFFF",
    C: "#909090",
    N: "#3050F8",
    O: "#FF0D0D",
    F: "#90E050",
    Cl: "#1FF01F",
    Br: "#A62929",
    I: "#940094",
    S: "#FFFF30",
    P: "#FF8000",
    Fe: "#E06633",
    Ca: "#3DFF00",
    Mg: "#8AFF00",
    Zn: "#7D80B0",
    Na: "#AB5CF2",
    K: "#8F40D4",
};

/**
 * Get CPK color for an element symbol
 * Returns hot pink as default for unknown elements
 */
export function getCpkColor(symbol: string): string {
    return CPK_COLORS[symbol] || "#FF69B4";
}

/**
 * Get CPK color as a Three.js Color object
 */
export function getCpkColorAsThree(symbol: string): THREE.Color {
    return new THREE.Color(getCpkColor(symbol));
}

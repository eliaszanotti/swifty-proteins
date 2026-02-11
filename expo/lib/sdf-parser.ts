export interface Atom {
    id: number;
    x: number;
    y: number;
    z: number;
    symbol: string;
}

export interface Bond {
    atom1: number;
    atom2: number;
    type: number;
}

export interface MoleculeData {
    name: string;
    atoms: Atom[];
    bonds: Bond[];
}

export function parseSdfFile(sdfContent: string): MoleculeData {
    const lines = sdfContent.split("\n");

    const name = lines[0]?.trim() || "Unknown";

    const countsLine = lines[3];
    if (!countsLine) {
        throw new Error("Invalid SDF file: missing counts line");
    }

    const atomCount = parseInt(countsLine.substring(0, 3).trim(), 10);
    const bondCount = parseInt(countsLine.substring(3, 6).trim(), 10);

    if (isNaN(atomCount) || isNaN(bondCount)) {
        throw new Error("Invalid SDF file: could not parse atom/bond counts");
    }

    const atoms: Atom[] = [];
    for (let i = 0; i < atomCount; i++) {
        const line = lines[4 + i];
        if (!line) {
            throw new Error(`Invalid SDF file: missing atom line at index ${i}`);
        }
        const atom = parseAtomLine(line, i + 1);
        if (!atom) {
            throw new Error(`Invalid SDF file: could not parse atom at index ${i}`);
        }
        atoms.push(atom);
    }
    if (atoms.length !== atomCount) {
        throw new Error(
            `Invalid SDF file: parsed atom count (${atoms.length}) does not match counts line (${atomCount})`
        );
    }

    const bonds: Bond[] = [];
    const bondStartLine = 4 + atomCount;
    for (let i = 0; i < bondCount; i++) {
        const line = lines[bondStartLine + i];
        if (!line) {
            throw new Error(
                `Invalid SDF file: missing bond line at index ${i} (expected ${bondCount} bonds)`
            );
        }
        const bond = parseBondLine(line);
        if (!bond) {
            throw new Error(
                `Invalid SDF file: could not parse bond line at index ${i}`
            );
        }
        if (
            bond.atom1 < 1 ||
            bond.atom1 > atomCount ||
            bond.atom2 < 1 ||
            bond.atom2 > atomCount
        ) {
            throw new Error(
                `Invalid SDF file: bond references non-existent atom index (atom1: ${bond.atom1}, atom2: ${bond.atom2}, max: ${atomCount})`
            );
        }
        bonds.push(bond);
    }
    if (bonds.length !== bondCount) {
        throw new Error(
            `Invalid SDF file: bond count mismatch (expected ${bondCount}, parsed ${bonds.length})`
        );
    }

    return { name, atoms, bonds };
}

function parseAtomLine(line: string, id: number): Atom | null {
    if (line.length < 34) return null;

    const x = parseFloat(line.substring(0, 10).trim());
    const y = parseFloat(line.substring(10, 20).trim());
    const z = parseFloat(line.substring(20, 30).trim());
    const symbol = line.substring(30, 34).trim();

    if (isNaN(x) || isNaN(y) || isNaN(z) || !symbol) {
        return null;
    }

    return { id, x, y, z, symbol };
}

function parseBondLine(line: string): Bond | null {
    if (line.length < 9) return null;

    const atom1 = parseInt(line.substring(0, 3).trim(), 10);
    const atom2 = parseInt(line.substring(3, 6).trim(), 10);
    const type = parseInt(line.substring(6, 9).trim(), 10);

    if (isNaN(atom1) || isNaN(atom2) || isNaN(type)) {
        return null;
    }

    return { atom1, atom2, type };
}

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

export function getCpkColor(symbol: string): string {
    return CPK_COLORS[symbol] || "#FF69B4";
}

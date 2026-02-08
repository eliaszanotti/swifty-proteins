export interface Ligand {
    id: string;
    name: string;
}

export async function loadLigands(): Promise<Ligand[]> {
    try {
        // Load ligands from assets
        const file = require("@/assets/ligands.txt");
        const text = file.default || file;

        // Parse lines and create ligand objects
        const lines = text.split("\n").filter((line: string) => line.trim() !== "");

        return lines.map((line: string) => ({
            id: line.trim(),
            name: line.trim(),
        }));
    } catch (error) {
        console.error("Failed to load ligands:", error);
        return [];
    }
}

export async function fetchPdbFile(ligandId: string): Promise<string> {
    const url = `https://files.rcsb.org/download/${ligandId}.pdb`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch PDB file for ${ligandId}`);
    }

    return await response.text();
}

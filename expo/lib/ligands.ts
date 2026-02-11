import { Asset } from "expo-asset";

export interface Ligand {
    id: string;
    name: string;
}

export async function loadLigands(): Promise<Ligand[]> {
    try {
        // Load ligands from assets
        const asset = Asset.fromModule(require("@/assets/ligands.txt"));
        await asset.downloadAsync();

        // Fetch the text content from the downloaded asset
        const response = await fetch(asset.localUri || asset.uri);
        const text = await response.text();

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

export async function fetchLigandFile(ligandId: string): Promise<string> {
    const url = `https://files.rcsb.org/ligands/download/${ligandId}_ideal.sdf`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch ligand file for ${ligandId}`);
    }

    return await response.text();
}

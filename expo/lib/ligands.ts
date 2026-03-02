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

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(url, {
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Ligand not found (404). This ligand may not exist in the database.`);
            }
            throw new Error(`Failed to fetch ligand file (HTTP ${response.status})`);
        }

        const text = await response.text();

        if (!text || text.trim().length === 0) {
            throw new Error(`Failed to parse ligand data. The file may be corrupted.`);
        }

        return text;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw new Error(`Request timeout. Please try again.`);
        }
        if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
            throw new Error(`No internet connection. Please check your network.`);
        }
        throw error;
    }
}

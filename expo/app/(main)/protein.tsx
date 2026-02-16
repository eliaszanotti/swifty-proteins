import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Share, View, StyleSheet } from "react-native";
import {
    Button,
    Paragraph,
    Text,
    XStack,
    YStack,
    Card,
    Separator,
    Spinner,
} from "tamagui";
import { SafeView } from "@/components/safe-view";
import { fetchLigandFile } from "@/lib/ligands";
import { parseSdfFile, type MoleculeData, type Atom } from "@/lib/sdf-parser";
import { Molecule3DView } from "@/components/molecule-3d-view";
import { getCpkColor } from "@/lib/3d/cpk-colors";

export default function ProteinScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [molecule, setMolecule] = useState<MoleculeData | null>(null);
    const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);

    useEffect(() => {
        if (!id) {
            Alert.alert("Error", "No ligand ID provided", [
                { text: "OK", onPress: () => router.back() },
            ]);
            return;
        }

        loadLigandData(id);
    }, [id]);

    const loadLigandData = async (ligandId: string) => {
        setIsLoading(true);
        try {
            const sdfContent = await fetchLigandFile(ligandId);
            const moleculeData = parseSdfFile(sdfContent);
            setMolecule(moleculeData);
        } catch (error) {
            Alert.alert(
                "Loading Failed",
                `Could not load ligand "${ligandId}" from the RCSB database.`,
                [{ text: "OK", onPress: () => router.back() }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        if (!id) return;

        try {
            await Share.share({
                message: `Check out this ${molecule?.name || id} ligand!\nhttps://files.rcsb.org/ligands/view/${id}.html`,
                url: `https://files.rcsb.org/ligands/download/${id}_ideal.sdf`,
            });
        } catch (error) {
            // Share was dismissed or there was an error
            console.log("Share error:", error);
        }
    };

    const handleAtomSelect = (atom: Atom) => {
        setSelectedAtom(atom);
    };

    const handleDismissTooltip = () => {
        setSelectedAtom(null);
    };

    if (isLoading) {
        return (
            <SafeView flex={1}>
                <YStack flex={1} bg="$background" style={{ justifyContent: "center", alignItems: "center" }} gap="$3">
                    <Spinner size="large" color="$gray10" />
                    <Text color="$color10">
                        {id ? `Loading ligand ${id}...` : "Loading ligand..."}
                    </Text>
                </YStack>
            </SafeView>
        );
    }

    return (
        <SafeView flex={1}>
            <YStack flex={1} bg="$background" gap="$4">
                {/* Header */}
                <XStack gap="$2" p="$4" style={{ alignItems: "center" }}>
                    <Button size="$3" onPress={() => router.back()}>
                        Back
                    </Button>
                    <Text fontSize="$6" fontWeight="bold">
                        {id}
                    </Text>
                </XStack>

                {/* 3D View */}
                <View style={styles.viewContainer}>
                    {molecule ? (
                        <Molecule3DView
                            molecule={molecule}
                            onAtomSelect={handleAtomSelect}
                            onDismissTooltip={handleDismissTooltip}
                            style={styles.moleculeView}
                        />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text color="$color10">No data</Text>
                        </View>
                    )}

                    {/* Atom Tooltip Overlay */}
                    {selectedAtom && (
                        <Card style={styles.tooltip} bg="$backgroundHover">
                            <YStack gap="$2">
                                <XStack gap="$2" style={{ alignItems: "center" }}>
                                    <View
                                        style={[
                                            styles.colorDot,
                                            { backgroundColor: getCpkColor(selectedAtom.symbol) },
                                        ]}
                                    />
                                    <Text fontSize="$6" fontWeight="bold">
                                        {selectedAtom.symbol}
                                    </Text>
                                </XStack>
                                <Separator />
                                <YStack gap="$1">
                                    <Paragraph size="$1">
                                        <Text fontWeight="bold">ID:</Text> {selectedAtom.id}
                                    </Paragraph>
                                    <Paragraph size="$1">
                                        <Text fontWeight="bold">Position:</Text>
                                    </Paragraph>
                                    <XStack gap="$2">
                                        <Paragraph size="$1">X: {selectedAtom.x.toFixed(3)}</Paragraph>
                                        <Paragraph size="$1">Y: {selectedAtom.y.toFixed(3)}</Paragraph>
                                        <Paragraph size="$1">Z: {selectedAtom.z.toFixed(3)}</Paragraph>
                                    </XStack>
                                </YStack>
                                <Button
                                    size="$2"
                                    onPress={handleDismissTooltip}
                                    mt="$2"
                                >
                                    Close
                                </Button>
                            </YStack>
                        </Card>
                    )}
                </View>

                {/* Info Section */}
                <YStack px="$4" gap="$2">
                    {molecule && (
                        <Paragraph size="$1" color="$color10">
                            {molecule.atoms.length} atoms, {molecule.bonds.length} bonds
                        </Paragraph>
                    )}
                </YStack>

                {/* Actions */}
                <XStack px="$4" pb="$4">
                    <Button flex={1} onPress={handleShare}>
                        Share Model
                    </Button>
                </XStack>
            </YStack>
        </SafeView>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        position: "relative",
    },
    moleculeView: {
        flex: 1,
    },
    placeholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    tooltip: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 180,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    colorDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
});

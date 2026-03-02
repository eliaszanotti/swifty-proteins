import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View, StyleSheet } from "react-native";
import { Button, Paragraph, Text, XStack, YStack } from "tamagui";
import { SafeView } from "@/components/safe-view";
import { Molecule3DView } from "@/components/3d/molecule-3d-view";
import { LoadingView } from "@/components/ui/loading-view";
import { AtomTooltip } from "@/components/ui/atom-tooltip";
import { ShareButton } from "@/components/ui/share-button";
import { fetchLigandFile } from "@/lib/ligands";
import { parseSdfFile, type MoleculeData, type Atom } from "@/lib/sdf-parser";
import type { DisplayMode } from "@/lib/3d/MoleculeScene";

export default function ProteinScreen() {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const [isLoading, setIsLoading] = useState(true);
	const [molecule, setMolecule] = useState<MoleculeData | null>(null);
	const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
	const [displayMode, setDisplayMode] = useState<DisplayMode>('ball-and-stick');

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
		} catch (error: any) {
			const errorMessage = error?.message || `Could not load ligand "${ligandId}" from the RCSB database.`;
			Alert.alert(
				"Loading Failed",
				errorMessage,
				[{ text: "OK", onPress: () => router.back() }],
			);
		} finally {
			setIsLoading(false);
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
			<LoadingView
				message={id ? `Loading ligand ${id}...` : "Loading ligand..."}
			/>
		);
	}

	return (
		<SafeView flex={1}>
			<YStack flex={1} bg="$background" gap="$4">
				{/* Header */}
				<XStack gap="$2" p="$4" style={{ alignItems: "center" }}>
					<Button
						size="$3"
						onPress={() => router.back()}
						accessibilityLabel="Go back"
						accessibilityHint="Return to ligand list"
					>
						Back
					</Button>
					<Text fontSize="$6" fontWeight="bold">
						{id}
					</Text>
				</XStack>

				{/* 3D View */}
				<View
					style={styles.viewContainer}
					accessibilityLabel="3D molecular structure view"
					accessibilityHint="Interactive 3D visualization of the ligand. Use gestures to rotate and zoom"
				>
					{molecule ? (
						<Molecule3DView
							molecule={molecule}
							onAtomSelect={handleAtomSelect}
							onDismissTooltip={handleDismissTooltip}
							style={styles.moleculeView}
							displayMode={displayMode}
						/>
					) : (
						<View style={styles.placeholder}>
							<Text color="$color10">No data</Text>
						</View>
					)}

					{/* Atom Tooltip Overlay */}
					{selectedAtom && (
						<AtomTooltip
							atom={selectedAtom}
							onClose={handleDismissTooltip}
						/>
					)}
				</View>

				{/* Info Section */}
				<YStack px="$4" gap="$2">
					{molecule && (
						<Paragraph size="$1" color="$color10">
							{molecule.atoms.length} atoms,{" "}
							{molecule.bonds.length} bonds
						</Paragraph>
					)}
				</YStack>

				{/* Actions */}
				<XStack px="$4" pb="$4" gap="$2">
					{id && (
						<ShareButton
							ligandId={id}
							moleculeName={molecule?.name}
						/>
					)}
					<Button
						flex={1}
						onPress={() => setDisplayMode(
							displayMode === 'ball-and-stick' ? 'space-filling' : 'ball-and-stick'
						)}
						accessibilityLabel="Toggle display mode"
						accessibilityHint={`Switch to ${displayMode === 'ball-and-stick' ? 'space-filling' : 'ball and stick'} visualization`}
					>
						{displayMode === 'ball-and-stick' ? 'Space-Filling' : 'Ball & Stick'}
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
});

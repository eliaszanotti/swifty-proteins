import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
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
import { parseSdfFile, type MoleculeData } from "@/lib/sdf-parser";

export default function ProteinScreen() {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const [isLoading, setIsLoading] = useState(true);
	const [molecule, setMolecule] = useState<MoleculeData | null>(null);

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

	if (isLoading) {
		return (
			<SafeView flex={1}>
				<YStack flex={1} bg="$background" style={{ justifyContent: "center", alignItems: "center" }} gap="$3">
					<Spinner size="large" color="$gray10" />
					<Text color="$color10">Loading ligand {id}...</Text>
				</YStack>
			</SafeView>
		);
	}

	return (
		<SafeView flex={1}>
			<YStack flex={1} bg="$background" p="$4" gap="$4">
				<XStack gap="$2" alignItems="center">
					<Button size="$3" onPress={() => router.back()}>
						Back
					</Button>
					<Text fontSize="$6" fontWeight="bold">
						{id}
					</Text>
				</XStack>

				{/* 3D View Placeholder */}
				<Card
					flex={1}
					bg="$backgroundHover"
					style={{ justifyContent: "center", alignItems: "center" }}
				>
					{molecule ? (
						<YStack style={{ alignItems: "center" }} gap="$2">
							<Text fontSize="$12" color="$color10">
								🧬
							</Text>
							<Text color="$color10">3D Visualization</Text>
							<Paragraph size="$1" style={{ textAlign: "center" }}>
								{molecule.atoms.length} atoms, {molecule.bonds.length} bonds
							</Paragraph>
						</YStack>
					) : (
						<Text color="$color10">No data</Text>
					)}
				</Card>

				<Separator />

				{/* Actions */}
				<YStack gap="$2">
					<Button>Share Model</Button>
				</YStack>

				{/* Atom Info Placeholder */}
				<Card p="$3" bg="$backgroundHover">
					<Text fontSize="$4" fontWeight="bold" mb="$2">
						Atom Info
					</Text>
					<Paragraph size="$1" color="$color10">
						Tap on an atom to see details
					</Paragraph>
				</Card>
			</YStack>
		</SafeView>
	);
}

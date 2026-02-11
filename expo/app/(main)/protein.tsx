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

export default function ProteinScreen() {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const [isLoading, setIsLoading] = useState(true);
	const [ligandData, setLigandData] = useState<string | null>(null);

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
			const data = await fetchLigandFile(ligandId);
			setLigandData(data);
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
					<YStack alignItems="center" gap="$2">
						<Text fontSize="$12" color="$color10">
							🧬
						</Text>
						<Text color="$color10">3D Visualization</Text>
						<Paragraph size="$1" textAlign="center">
							3D protein model will be displayed here
						</Paragraph>
					</YStack>
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

import { useEffect, useState } from "react";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { Button, Paragraph, Text, YStack, Input, Spinner } from "tamagui";
import { SafeView } from "@/components/safe-view";
import { loadLigands, type Ligand } from "@/lib/ligands";

export default function LigandsScreen() {
	const [ligands, setLigands] = useState<Ligand[]>([]);
	const [filteredLigands, setFilteredLigands] = useState<Ligand[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadLigands().then((data) => {
			setLigands(data);
			setFilteredLigands(data);
			setIsLoading(false);
		});
	}, []);

	useEffect(() => {
		if (searchQuery.trim() === "") {
			setFilteredLigands(ligands);
		} else {
			const query = searchQuery.toLowerCase();
			const filtered = ligands.filter((ligand) =>
				ligand.name.toLowerCase().includes(query),
			);
			setFilteredLigands(filtered);
		}
	}, [searchQuery, ligands]);

	return (
		<SafeView flex={1}>
			<YStack flex={1} bg="$background">
				<YStack p="$4" gap="$4">
					<Text fontSize="$8" fontWeight="bold">
						Ligands
					</Text>
					<Paragraph>
						Select a ligand to visualize its 3D structure
					</Paragraph>

					<Input
						placeholder="Search ligands..."
						autoCapitalize="none"
						value={searchQuery}
						onChangeText={setSearchQuery}
						accessibilityLabel="Search ligands"
						accessibilityHint="Type to filter the ligand list"
					/>
				</YStack>

				{isLoading ? (
					<YStack
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
						gap="$3"
					>
						<Spinner size="large" color="$gray10" />
						<Text color="$color10">Loading ligands...</Text>
					</YStack>
				) : (
					<FlashList
						data={filteredLigands}
						renderItem={({ item }) => (
							<Button
								onPress={() =>
									router.push(`/(main)/protein?id=${item.id}`)
								}
								accessibilityLabel={`Ligand ${item.name}`}
								accessibilityHint="Double tap to view 3D structure"
							>
								{item.name}
							</Button>
						)}
						keyExtractor={(item) => item.id}
						contentContainerStyle={{ paddingHorizontal: 16 }}
						ItemSeparatorComponent={() => <YStack mt="$2" />}
						ListEmptyComponent={
							<YStack gap="$2">
								<Text color="$color10">No ligands found</Text>
							</YStack>
						}
					/>
				)}
			</YStack>
		</SafeView>
	);
}

import { router } from "expo-router";
import {
	Button,
	Paragraph,
	Text,
	XStack,
	YStack,
	Input,
	ScrollView,
} from "tamagui";
import { SafeView } from "@/components/safe-view";

// Dummy ligand data - 10 empty items
const DUMMY_LIGANDS = Array.from({ length: 10 }, (_, i) => ({
	id: i + 1,
	name: `Ligand ${i + 1}`,
}));

export default function LigandsScreen() {
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
					/>
				</YStack>

				<ScrollView flex={1} px="$4">
					<YStack gap="$2">
						{DUMMY_LIGANDS.map((ligand) => (
							<Button
								key={ligand.id}
								onPress={() =>
									router.push(
										`/(main)/protein?id=${ligand.id}`,
									)
								}
							>
								{ligand.name}
							</Button>
						))}
					</YStack>
				</ScrollView>
			</YStack>
		</SafeView>
	);
}

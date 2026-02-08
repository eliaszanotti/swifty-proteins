import { useLocalSearchParams, router } from "expo-router";
import {
    Button,
    Paragraph,
    Text,
    XStack,
    YStack,
    Card,
    Separator,
} from "tamagui";
import { SafeView } from "@/components/safe-view";

export default function ProteinScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();

    return (
        <SafeView>
            <YStack flex={1} bg="$background" p="$4" gap="$4">
                <XStack alignItems="center" gap="$2">
                    <Button
                        size="$2"
                        variant="outlined"
                        onPress={() => router.back()}
                    >
                        ← Back
                    </Button>
                    <Text fontSize="$6" fontWeight="bold">
                        Protein View
                    </Text>
                </XStack>

                <Paragraph>
                    Ligand ID: {id || "Unknown"}
                </Paragraph>

                {/* 3D View Placeholder */}
                <Card flex={1} bg="$backgroundHover" justifyContent="center" alignItems="center">
                    <YStack alignItems="center" gap="$2">
                        <Text fontSize="$12" color="$color10">
                            🧬
                        </Text>
                        <Text color="$color10">
                            3D Visualization
                        </Text>
                        <Paragraph size="$1" textAlign="center">
                            3D protein model will be displayed here
                        </Paragraph>
                    </YStack>
                </Card>

                <Separator />

                {/* Actions */}
                <YStack gap="$2">
                    <Button>
                        Share Model
                    </Button>
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

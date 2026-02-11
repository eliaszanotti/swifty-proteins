import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
    Button,
    Paragraph,
    Text,
    YStack,
    Input,
    ScrollView,
    Spinner,
} from "tamagui";
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
                ligand.name.toLowerCase().includes(query)
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
                    />
                </YStack>

                {isLoading ? (
                    <YStack style={{ flex: 1, justifyContent: "center", alignItems: "center" }} gap="$3">
                        <Spinner size="large" color="$gray10" />
                        <Text color="$color10">Loading ligands...</Text>
                    </YStack>
                ) : (
                    <ScrollView flex={1} px="$4">
                        <YStack gap="$2">
                            {filteredLigands.map((ligand) => (
                                <Button
                                    key={ligand.id}
                                    onPress={() =>
                                        router.push(`/(main)/protein?id=${ligand.id}`)
                                    }
                                >
                                    {ligand.name}
                                </Button>
                            ))}
                        </YStack>
                    </ScrollView>
                )}
            </YStack>
        </SafeView>
    );
}

import { View, StyleSheet } from "react-native";
import { Card, YStack, XStack, Text, Paragraph, Separator, Button } from "tamagui";
import type { Atom } from "@/lib/sdf-parser";
import { getCpkColor } from "@/lib/3d/cpk-colors";

interface AtomTooltipProps {
    atom: Atom;
    onClose: () => void;
}

export function AtomTooltip({ atom, onClose }: AtomTooltipProps) {
    return (
        <Card style={styles.tooltip} bg="$backgroundHover">
            <YStack gap="$2">
                <XStack gap="$2" style={{ alignItems: "center" }}>
                    <View
                        style={[
                            styles.colorDot,
                            { backgroundColor: getCpkColor(atom.symbol) },
                        ]}
                    />
                    <Text fontSize="$6" fontWeight="bold">
                        {atom.symbol}
                    </Text>
                </XStack>
                <Separator />
                <YStack gap="$1">
                    <Paragraph size="$1">
                        <Text fontWeight="bold">ID:</Text> {atom.id}
                    </Paragraph>
                    <Paragraph size="$1">
                        <Text fontWeight="bold">Position:</Text>
                    </Paragraph>
                    <XStack gap="$2">
                        <Paragraph size="$1">X: {atom.x.toFixed(3)}</Paragraph>
                        <Paragraph size="$1">Y: {atom.y.toFixed(3)}</Paragraph>
                        <Paragraph size="$1">Z: {atom.z.toFixed(3)}</Paragraph>
                    </XStack>
                </YStack>
                <Button size="$2" onPress={onClose} mt="$2">
                    Close
                </Button>
            </YStack>
        </Card>
    );
}

const styles = StyleSheet.create({
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

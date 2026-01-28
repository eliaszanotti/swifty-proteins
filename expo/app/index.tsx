import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText type="title">Swifty Proteins</ThemedText>
                <ThemedText type="subtitle">
                    Protein 3D Visualizer
                </ThemedText>
                <ThemedText style={styles.description}>
                    Explore protein structures in 3D with interactive visualizations.
                </ThemedText>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        gap: 10,
    },
    description: {
        marginTop: 20,
        textAlign: 'center',
    },
});

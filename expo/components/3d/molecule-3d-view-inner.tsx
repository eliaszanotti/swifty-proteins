import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import type { Atom, MoleculeData } from '@/lib/sdf-parser';
import { use3DScene } from '@/hooks/use-3d-scene';
import { usePanGesture } from '@/hooks/use-pan-gesture';
import { usePinchGesture } from '@/hooks/use-pinch-gesture';
import { useTapGesture } from '@/hooks/use-tap-gesture';

interface Molecule3DViewInnerProps {
    molecule: MoleculeData;
    onAtomSelect?: (atom: Atom) => void;
    onDismissTooltip?: () => void;
    width: number;
    height: number;
}

export function Molecule3DViewInner({
    molecule,
    onAtomSelect,
    onDismissTooltip,
    width,
    height,
}: Molecule3DViewInnerProps) {
    const [gl, setGl] = useState<ExpoWebGLRenderingContext | null>(null);
    const sceneRef = use3DScene(gl, molecule, width, height);

    const panGesture = usePanGesture();
    const pinchGesture = usePinchGesture();
    const tapGesture = useTapGesture(
        sceneRef,
        width,
        height,
        onAtomSelect,
        onDismissTooltip
    );

    const gestures = Gesture.Simultaneous(
        panGesture,
        pinchGesture,
        tapGesture
    );

    const onContextCreate = (glContext: ExpoWebGLRenderingContext) => {
        setGl(glContext);
    };

    return (
        <GestureDetector gesture={gestures}>
            <GLView
                key={molecule.name}
                style={styles.glView}
                onContextCreate={onContextCreate}
                msaaSamples={4}
                enableExperimentalWorkletSupport={false}
            />
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    glView: {
        width: '100%',
        height: '100%',
    },
});

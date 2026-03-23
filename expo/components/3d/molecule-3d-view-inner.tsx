import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import type { Atom, MoleculeData } from "@/lib/sdf-parser";
import type { DisplayMode } from "@/lib/3d/MoleculeScene";
import { use3DScene } from "@/hooks/use-3d-scene";
import { usePanGesture } from "@/hooks/use-pan-gesture";
import { usePinchGesture } from "@/hooks/use-pinch-gesture";
import { useTapGesture } from "@/hooks/use-tap-gesture";

interface Molecule3DViewInnerProps {
	molecule: MoleculeData;
	onAtomSelect?: (atom: Atom) => void;
	onDismissTooltip?: () => void;
	width: number;
	height: number;
	displayMode?: DisplayMode;
}

export interface Molecule3DViewHandle {
	takeSnapshotAsync: (options?: any) => Promise<any>;
}

export const Molecule3DViewInner = forwardRef<
	Molecule3DViewHandle,
	Molecule3DViewInnerProps
>(({ molecule, onAtomSelect, onDismissTooltip, width, height, displayMode = "ball-and-stick" }, ref) => {
	const [gl, setGl] = useState<ExpoWebGLRenderingContext | null>(null);
	const sceneRef = use3DScene(gl, molecule, width, height, displayMode);
	const glViewRef = useRef<GLView>(null);

	useImperativeHandle(ref, () => ({
		takeSnapshotAsync: async (options?: any) => {
			if (!glViewRef.current) {
				throw new Error("GLView not ready");
			}
			return glViewRef.current.takeSnapshotAsync(options);
		},
	}));

	const panGesture = usePanGesture(sceneRef);
	const pinchGesture = usePinchGesture(sceneRef);
	const tapGesture = useTapGesture(sceneRef, width, height, onAtomSelect, onDismissTooltip);

	const gestures = Gesture.Simultaneous(panGesture, pinchGesture, tapGesture);

	const onContextCreate = (glContext: ExpoWebGLRenderingContext) => {
		setGl(glContext);
	};

	return (
		<GestureDetector gesture={gestures}>
			<GLView
				ref={glViewRef}
				key={molecule.name}
				style={styles.glView}
				onContextCreate={onContextCreate}
				msaaSamples={4}
				enableExperimentalWorkletSupport={false}
			/>
		</GestureDetector>
	);
});

const styles = StyleSheet.create({
	glView: {
		width: "100%",
		height: "100%",
	},
});

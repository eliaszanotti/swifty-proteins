import { useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSharedValue, runOnJS } from "react-native-reanimated";
import type { Atom, MoleculeData } from "@/lib/sdf-parser";
import { setupMoleculeScene } from "./use-molecule-scene";
import { findAtomAtScreenPoint } from "@/lib/3d/raycasting";
import * as THREE from "three";

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
	const moleculeKey = `${molecule.name}-${molecule.atoms.length}-${molecule.bonds.length}`;

	const targetRotationX = useSharedValue(0);
	const targetRotationY = useSharedValue(0);
	const targetCameraDistance = useSharedValue(15);
	const baseCameraDistance = useSharedValue(15);

	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const cleanupRef = useRef<(() => void) | null>(null);

	const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
		if (cleanupRef.current) {
			cleanupRef.current();
			cleanupRef.current = null;
		}

		const sceneRefs = setupMoleculeScene({
			gl,
			molecule,
			width,
			height,
			targetRotationX,
			targetRotationY,
			targetCameraDistance,
			baseCameraDistance,
		});

		sceneRef.current = sceneRefs.sceneRef.current;
		cameraRef.current = sceneRefs.cameraRef.current;
		cleanupRef.current = sceneRefs.cleanup;
	};

	useEffect(() => {
		return () => {
			if (cleanupRef.current) {
				cleanupRef.current();
			}
		};
	}, []);

	const handleTap = (x: number, y: number) => {
		const scene = sceneRef.current;
		const camera = cameraRef.current;

		if (!camera || !scene) {
			return;
		}

		const result = findAtomAtScreenPoint(x, y, width, height, camera, scene);

		if (result && onAtomSelect) {
			onAtomSelect(result.atom);
		} else if (onDismissTooltip) {
			onDismissTooltip();
		}
	};

	const prevTranslationX = useSharedValue(0);
	const prevTranslationY = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.onStart(() => {
			"worklet";
			prevTranslationX.value = 0;
			prevTranslationY.value = 0;
		})
		.onUpdate((event: any) => {
			"worklet";
			const deltaX = event.translationX - prevTranslationX.value;
			const deltaY = event.translationY - prevTranslationY.value;

			prevTranslationX.value = event.translationX;
			prevTranslationY.value = event.translationY;

			targetRotationY.value -= deltaX * 0.02;
			targetRotationX.value += deltaY * 0.02;

			targetRotationX.value = Math.max(
				-Math.PI / 2 + 0.1,
				Math.min(Math.PI / 2 - 0.1, targetRotationX.value),
			);
		});

	const pinchGesture = Gesture.Pinch()
		.onStart(() => {
			"worklet";
			baseCameraDistance.value = targetCameraDistance.value;
		})
		.onUpdate((event: any) => {
			"worklet";
			if (event.scale !== undefined && !isNaN(event.scale)) {
				const newDistance = baseCameraDistance.value / event.scale;
				targetCameraDistance.value = Math.max(2, Math.min(200, newDistance));
			}
		});

	const tapGesture = Gesture.Tap().onEnd((event: any) => {
		"worklet";
		runOnJS(handleTap)(event.absoluteX, event.absoluteY);
	});

	const gestures = Gesture.Simultaneous(panGesture, pinchGesture, tapGesture);

	return (
		<GestureDetector gesture={gestures}>
			<GLView
				key={moleculeKey}
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
		width: "100%",
		height: "100%",
	},
});

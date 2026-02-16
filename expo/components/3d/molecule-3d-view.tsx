import { useState, useRef, useEffect } from "react";
import { View, StyleSheet, DimensionValue } from "react-native";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSharedValue, runOnJS } from "react-native-reanimated";
import type { Atom, MoleculeData } from "@/lib/sdf-parser";
import { setupMoleculeScene } from "./use-molecule-scene";
import { findAtomAtScreenPoint } from "@/lib/3d/raycasting";
import * as THREE from "three";

interface Molecule3DViewProps {
	molecule: MoleculeData;
	onAtomSelect?: (atom: Atom) => void;
	onDismissTooltip?: () => void;
	width?: DimensionValue;
	height?: DimensionValue;
	style?: any;
}

export function Molecule3DView({
	molecule,
	onAtomSelect,
	onDismissTooltip,
	width = "100%",
	height = "100%",
	style,
}: Molecule3DViewProps) {
	const [dimensions, setDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);

	const handleLayout = (event: any) => {
		const { width, height } = event.nativeEvent.layout;
		setDimensions({ width, height });
	};

	return (
		<View style={[{ width, height }, style]} onLayout={handleLayout}>
			{dimensions && (
				<Molecule3DViewInner
					molecule={molecule}
					onAtomSelect={onAtomSelect}
					onDismissTooltip={onDismissTooltip}
					width={dimensions.width}
					height={dimensions.height}
				/>
			)}
		</View>
	);
}

interface Molecule3DViewInnerProps {
	molecule: MoleculeData;
	onAtomSelect?: (atom: Atom) => void;
	onDismissTooltip?: () => void;
	width: number;
	height: number;
}

function Molecule3DViewInner({
	molecule,
	onAtomSelect,
	onDismissTooltip,
	width,
	height,
}: Molecule3DViewInnerProps) {
	// Unique key for molecule to force GLView recreation
	const moleculeKey = `${molecule.name}-${molecule.atoms.length}-${molecule.bonds.length}`;

	// Shared values for gesture control
	const targetRotationX = useSharedValue(0);
	const targetRotationY = useSharedValue(0);
	const targetCameraDistance = useSharedValue(15);
	const baseCameraDistance = useSharedValue(15);

	// Use useRef for scene and camera so they can be updated and accessed by callbacks
	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const animationFrameRef = useRef<number | null>(null);
	const cleanupRef = useRef<(() => void) | null>(null);

	// Scene setup callback - called when GLView context is created
	const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
		console.log("[View] onContextCreate called for molecule:", molecule.name);

		// Clean up any previous scene (shouldn't happen with key prop, but just in case)
		if (cleanupRef.current) {
			console.log("[View] Cleaning up previous scene");
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

		// Update refs
		sceneRef.current = sceneRefs.sceneRef.current;
		cameraRef.current = sceneRefs.cameraRef.current;
		animationFrameRef.current = sceneRefs.animationFrameRef.current;
		cleanupRef.current = sceneRefs.cleanup;

		console.log("[View] Scene setup complete - scene:", !!sceneRef.current, "camera:", !!cameraRef.current);
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (cleanupRef.current) {
				console.log("[View] Component unmounting - cleaning up scene");
				cleanupRef.current();
			}
		};
	}, []);

	// Tap handler - accesses refs via useRef so it always gets current values
	const handleTap = (x: number, y: number) => {
		const scene = sceneRef.current;
		const camera = cameraRef.current;
		console.log("[Gesture] Tap - scene:", !!scene, "camera:", !!camera);

		if (!camera || !scene) {
			console.log("[Gesture] No camera or scene ref - ignoring tap");
			return;
		}

		const result = findAtomAtScreenPoint(
			x,
			y,
			width,
			height,
			camera,
			scene,
		);

		if (result && onAtomSelect) {
			console.log("[Gesture] Atom selected:", result.atom.symbol);
			onAtomSelect(result.atom);
		} else if (onDismissTooltip) {
			onDismissTooltip();
		}
	};

	// Pan gesture for rotation
	const panGesture = Gesture.Pan()
		.onStart(() => {
			"worklet";
			console.log("[Gesture] Pan started");
		})
		.onUpdate((event: any) => {
			"worklet";
			if (event.changeX !== undefined && event.changeY !== undefined) {
				targetRotationY.value -= event.changeX * 0.005;
				targetRotationX.value += event.changeY * 0.005;

				// Clamp vertical rotation
				targetRotationX.value = Math.max(
					-Math.PI / 2 + 0.1,
					Math.min(Math.PI / 2 - 0.1, targetRotationX.value),
				);

				console.log("[Gesture] Pan - rotation:", targetRotationX.value.toFixed(2), targetRotationY.value.toFixed(2));
			}
		})
		.onEnd(() => {
			"worklet";
			console.log("[Gesture] Pan ended");
		});

	// Pinch gesture for zoom
	const pinchGesture = Gesture.Pinch()
		.onStart(() => {
			"worklet";
			baseCameraDistance.value = targetCameraDistance.value;
			console.log("[Gesture] Pinch started - base distance:", baseCameraDistance.value.toFixed(2));
		})
		.onUpdate((event: any) => {
			"worklet";
			if (event.scale !== undefined && !isNaN(event.scale)) {
				const newDistance = baseCameraDistance.value / event.scale;
				targetCameraDistance.value = Math.max(2, Math.min(200, newDistance));
				console.log("[Gesture] Pinch - scale:", event.scale.toFixed(2), "new distance:", targetCameraDistance.value.toFixed(2));
			}
		})
		.onEnd(() => {
			"worklet";
			console.log("[Gesture] Pinch ended");
		});

	// Tap gesture for atom selection
	const tapGesture = Gesture.Tap().onEnd((event: any) => {
		"worklet";
		console.log("[Gesture] Tap detected at:", event.absoluteX, event.absoluteY);
		runOnJS(handleTap)(event.absoluteX, event.absoluteY);
	});

	// Combine gestures
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

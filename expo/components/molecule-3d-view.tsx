import { useRef, useState, useEffect } from "react";
import { View, StyleSheet, DimensionValue } from "react-native";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import type { Atom, MoleculeData } from "@/lib/sdf-parser";
import {
	createAtomGeometry,
	createAtomMaterial,
} from "@/lib/3d/atom-geometries";
import { getCpkColor } from "@/lib/3d/cpk-colors";
import {
	createAllBondMeshes,
	calculateMoleculeCenter,
	calculateOptimalCameraDistance,
} from "@/lib/3d/bond-geometries";
import { findAtomAtScreenPoint } from "@/lib/3d/raycasting";

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

	// Handle layout to get actual pixel dimensions
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
	const rendererRef = useRef<Renderer | null>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const animationFrameRef = useRef<number | null>(null);

	// Current render values (read in render loop)
	const rotationX = useRef(0);
	const rotationY = useRef(0);
	const cameraDistance = useRef(15);

	// Gesture target values (set by gestures, read by render loop)
	const targetRotationX = useSharedValue(0);
	const targetRotationY = useSharedValue(0);
	const targetCameraDistance = useSharedValue(15);

	// Base distance for pinch gesture (also shared for worklet access)
	const baseCameraDistance = useSharedValue(15);

	// Initialize Three.js scene
	const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
		const renderer = new Renderer({ gl });
		rendererRef.current = renderer;

		// Create scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000000);
		sceneRef.current = scene;

		// Create camera
		const camera = new THREE.PerspectiveCamera(
			75,
			width / height,
			0.1,
			1000,
		);
		const center = calculateMoleculeCenter(molecule.atoms);
		const distance = calculateOptimalCameraDistance(molecule.atoms);

		// Initialize all values
		baseCameraDistance.value = distance;
		targetCameraDistance.value = distance;
		cameraDistance.current = distance;

		camera.position.set(0, 0, distance);
		camera.lookAt(0, 0, 0);
		cameraRef.current = camera;

		// Add lights
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(10, 10, 10);
		scene.add(directionalLight);

		const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
		backLight.position.set(-10, -10, -10);
		scene.add(backLight);

		// Create atom meshes
		for (const atom of molecule.atoms) {
			const geometry = createAtomGeometry(atom.symbol);
			const material = createAtomMaterial(getCpkColor(atom.symbol));
			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(
				atom.x - center.x,
				atom.y - center.y,
				atom.z - center.z,
			);
			mesh.userData = { atom };
			scene.add(mesh);
		}

		// Create bond meshes
		const bondMeshes = createAllBondMeshes(molecule.atoms, molecule.bonds);
		for (const bondMesh of bondMeshes) {
			bondMesh.position.sub(center);
			scene.add(bondMesh);
		}

		// Start animation loop
		const render = () => {
			// Smooth rotation interpolation
			rotationX.current +=
				(targetRotationX.value - rotationX.current) * 0.1;
			rotationY.current +=
				(targetRotationY.value - rotationY.current) * 0.1;

			// Smooth zoom interpolation
			cameraDistance.current +=
				(targetCameraDistance.value - cameraDistance.current) * 0.1;

			// Clamp camera distance to prevent it from going too far or too close
			cameraDistance.current = Math.max(
				2,
				Math.min(200, cameraDistance.current),
			);

			// Update camera position based on rotation
			const dist = cameraDistance.current;
			camera.position.x =
				dist *
				Math.sin(rotationY.current) *
				Math.cos(rotationX.current);
			camera.position.y = dist * Math.sin(rotationX.current);
			camera.position.z =
				dist *
				Math.cos(rotationY.current) *
				Math.cos(rotationX.current);
			camera.lookAt(0, 0, 0);

			(renderer as any).render(scene, camera);
			gl.endFrameEXP();

			animationFrameRef.current = requestAnimationFrame(render);
		};
		render();
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	// Pan gesture for rotation
	const panGesture = Gesture.Pan().onUpdate((event: any) => {
		"worklet";
		targetRotationY.value += event.changeX * 0.01;
		targetRotationX.value -= event.changeY * 0.01;

		// Clamp vertical rotation to avoid gimbal lock
		targetRotationX.value = Math.max(
			-Math.PI / 2 + 0.1,
			Math.min(Math.PI / 2 - 0.1, targetRotationX.value),
		);
	});

	// Pinch gesture for zoom
	const pinchGesture = Gesture.Pinch().onUpdate((event: any) => {
		"worklet";
		const newDistance = baseCameraDistance.value / event.scale;
		// Clamp to prevent extreme values
		targetCameraDistance.value = Math.max(2, Math.min(200, newDistance));
	});

	// Tap gesture for atom selection
	const tapGesture = Gesture.Tap().onEnd((event: any) => {
		if (!cameraRef.current || !sceneRef.current) return;

		const result = findAtomAtScreenPoint(
			event.absoluteX,
			event.absoluteY,
			width,
			height,
			cameraRef.current,
			sceneRef.current,
		);

		if (result && onAtomSelect) {
			onAtomSelect(result.atom);
		} else if (onDismissTooltip) {
			onDismissTooltip();
		}
	});

	const composedGesture = Gesture.Simultaneous(
		Gesture.Exclusive(panGesture, tapGesture),
		pinchGesture,
	);

	return (
		<GestureDetector gesture={composedGesture}>
			<GLView
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

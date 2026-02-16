import * as THREE from "three";
import type { ExpoWebGLRenderingContext } from "expo-gl";
import { Renderer } from "expo-three";
import type { MoleculeData } from "@/lib/sdf-parser";
import { createAtomGeometry, createAtomMaterial } from "@/lib/3d/atom-geometries";
import { getCpkColor } from "@/lib/3d/cpk-colors";
import { createAllBondMeshes, calculateMoleculeCenter, calculateOptimalCameraDistance } from "@/lib/3d/bond-geometries";

interface SceneRefs {
    rendererRef: { current: Renderer | null };
    sceneRef: { current: THREE.Scene | null };
    cameraRef: { current: THREE.PerspectiveCamera | null };
    animationFrameRef: { current: number | null };
    rotationX: { current: number };
    rotationY: { current: number };
    cameraDistance: { current: number };
}

interface SetupSceneParams {
    gl: ExpoWebGLRenderingContext;
    molecule: MoleculeData;
    width: number;
    height: number;
    targetRotationX: { value: number };
    targetRotationY: { value: number };
    targetCameraDistance: { value: number };
    baseCameraDistance: { value: number };
}

export function setupMoleculeScene({
    gl,
    molecule,
    width,
    height,
    targetRotationX,
    targetRotationY,
    targetCameraDistance,
    baseCameraDistance,
}: SetupSceneParams): SceneRefs {
    // Create ref objects manually (not using useRef since this is a regular function)
    const rendererRef: { current: Renderer | null } = { current: null };
    const sceneRef: { current: THREE.Scene | null } = { current: null };
    const cameraRef: { current: THREE.PerspectiveCamera | null } = { current: null };
    const animationFrameRef: { current: number | null } = { current: null };
    const rotationX: { current: number } = { current: 0 };
    const rotationY: { current: number } = { current: 0 };
    const cameraDistance: { current: number } = { current: 15 };

    // Debug log counter (log every 60 frames to avoid spam)
    let frameCount = 0;

    const renderer = new Renderer({ gl });
    rendererRef.current = renderer;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const center = calculateMoleculeCenter(molecule.atoms);
    const distance = calculateOptimalCameraDistance(molecule.atoms);

    // Initialize all values
    baseCameraDistance.value = distance;
    targetCameraDistance.value = distance;
    cameraDistance.current = distance;

    console.log("[Scene] Setup complete - initial distance:", distance);
    console.log("[Scene] Molecule has", molecule.atoms.length, "atoms and", molecule.bonds.length, "bonds");

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
    console.log("[Scene] Creating atom meshes...");
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
    console.log("[Scene] Atom meshes created, adding to scene...");

    // Create bond meshes
    const bondMeshes = createAllBondMeshes(molecule.atoms, molecule.bonds);
    for (const bondMesh of bondMeshes) {
        bondMesh.position.sub(center);
        scene.add(bondMesh);
    }

    console.log("[Scene] Created", molecule.atoms.length, "atoms and", molecule.bonds.length, "bonds");
    console.log("[Scene] Scene children count:", scene.children.length);
    console.log("[Scene] Camera initial position:", camera.position.toArray());

    // Start animation loop
    const render = () => {
        // Log debug info every 60 frames
        frameCount++;
        if (frameCount % 60 === 0) {
            console.log("[Render] Frame", frameCount);
            console.log("[Render] - targetRotation:", targetRotationX.value.toFixed(2), targetRotationY.value.toFixed(2));
            console.log("[Render] - currentRotation:", rotationX.current.toFixed(2), rotationY.current.toFixed(2));
            console.log("[Render] - cameraDistance:", cameraDistance.current.toFixed(2));
            console.log("[Render] - camera position:", camera.position.x.toFixed(2), camera.position.y.toFixed(2), camera.position.z.toFixed(2));
        }

        // Smooth rotation interpolation
        rotationX.current +=
            (targetRotationX.value - rotationX.current) * 0.1;
        rotationY.current +=
            (targetRotationY.value - rotationY.current) * 0.1;

        // Smooth zoom interpolation
        cameraDistance.current +=
            (targetCameraDistance.value - cameraDistance.current) * 0.1;

        // Clamp camera distance
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

    return {
        rendererRef,
        sceneRef,
        cameraRef,
        animationFrameRef,
        rotationX,
        rotationY,
        cameraDistance,
    };
}

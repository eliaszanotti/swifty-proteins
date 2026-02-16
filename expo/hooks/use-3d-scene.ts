import { useRef, useEffect } from "react";
import type { ExpoWebGLRenderingContext } from "expo-gl";
import type { MoleculeData } from "@/lib/sdf-parser";
import { MoleculeScene } from "@/lib/3d/MoleculeScene";

/**
 * Hook to manage the lifecycle of a MoleculeScene.
 * Creates a new scene when the molecule changes and disposes the old one.
 *
 * @param gl - The WebGL context from GLView
 * @param molecule - The molecule data to render
 * @param width - View width in pixels
 * @param height - View height in pixels
 * @returns A ref containing the current MoleculeScene instance
 */
export function use3DScene(
    gl: ExpoWebGLRenderingContext | null,
    molecule: MoleculeData | null,
    width: number,
    height: number,
) {
    const sceneRef = useRef<MoleculeScene | null>(null);

    useEffect(() => {
        if (!gl || !molecule) return;

        // Create and start the new scene
        const scene = new MoleculeScene(gl, molecule, width, height);
        scene.start();
        sceneRef.current = scene;

        // Cleanup on unmount or when molecule changes
        return () => {
            scene.dispose();
            sceneRef.current = null;
        };
    }, [gl, molecule?.name, width, height, molecule]);

    return sceneRef;
}

import * as THREE from 'three';
import type { ExpoWebGLRenderingContext } from 'expo-gl';
import { Renderer } from 'expo-three';
import type { MoleculeData } from '@/lib/sdf-parser';
import {
    createAtomGeometry,
    createAtomMaterial,
} from './atom-geometries';
import { getCpkColor } from './cpk-colors';
import {
    createAllBondMeshes,
    calculateMoleculeCenter,
    calculateOptimalCameraDistance,
} from './bond-geometries';
import { use3DStore } from '@/stores/use-3d-store';

/**
 * MoleculeScene encapsulates all Three.js logic for rendering a molecule.
 * It manages the scene, camera, renderer, and animation loop independently
 * from React, allowing for clean separation of concerns.
 */
export class MoleculeScene {
    private renderer: Renderer | null = null;
    private scene: THREE.Scene | null = null;
    private camera: THREE.PerspectiveCamera | null = null;
    private gl: ExpoWebGLRenderingContext;
    private width: number;
    private height: number;
    private animationFrameId: number | null = null;
    private initialCameraDistance: number;

    constructor(
        gl: ExpoWebGLRenderingContext,
        molecule: MoleculeData,
        width: number,
        height: number
    ) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.initialCameraDistance = this.setupScene(gl, molecule, width, height);
    }

    /**
     * Set up the Three.js scene with camera, lights, atoms, and bonds
     */
    private setupScene(
        gl: ExpoWebGLRenderingContext,
        molecule: MoleculeData,
        width: number,
        height: number
    ): number {
        // Create renderer
        this.renderer = new Renderer({ gl });

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const center = calculateMoleculeCenter(molecule.atoms);
        const distance = calculateOptimalCameraDistance(molecule.atoms);

        // Initialize the store with the optimal distance
        use3DStore.getState().setDistance(distance);

        this.camera.position.set(0, 0, distance);
        this.camera.lookAt(0, 0, 0);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
        backLight.position.set(-10, -10, -10);
        this.scene.add(backLight);

        // Create atom meshes
        for (const atom of molecule.atoms) {
            const geometry = createAtomGeometry(atom.symbol);
            const material = createAtomMaterial(getCpkColor(atom.symbol));
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                atom.x - center.x,
                atom.y - center.y,
                atom.z - center.z
            );
            mesh.userData = { atom };
            this.scene.add(mesh);
        }

        // Create bond meshes
        const bondMeshes = createAllBondMeshes(molecule.atoms, molecule.bonds);
        for (const bondMesh of bondMeshes) {
            bondMesh.position.sub(center);
            this.scene.add(bondMesh);
        }

        return distance;
    }

    /**
     * Update camera position based on rotation and distance from store
     */
    private updateCamera(): void {
        if (!this.camera) return;

        const { rotationX, rotationY, cameraDistance } = use3DStore.getState();

        // Clamp camera distance
        const dist = Math.max(2, Math.min(200, cameraDistance));

        // Update camera position based on rotation
        this.camera.position.x =
            dist * Math.sin(rotationY) * Math.cos(rotationX);
        this.camera.position.y = dist * Math.sin(rotationX);
        this.camera.position.z =
            dist * Math.cos(rotationY) * Math.cos(rotationX);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Render a single frame
     */
    private render = (): void => {
        if (!this.renderer || !this.scene || !this.camera) return;

        this.updateCamera();
        this.renderer.render(this.scene, this.camera);
        this.gl.endFrameEXP();

        this.animationFrameId = requestAnimationFrame(this.render);
    };

    /**
     * Start the animation loop
     */
    public start(): void {
        if (this.animationFrameId === null) {
            this.render();
        }
    }

    /**
     * Get the current scene for raycasting
     */
    public getScene(): THREE.Scene | null {
        return this.scene;
    }

    /**
     * Get the current camera for raycasting
     */
    public getCamera(): THREE.PerspectiveCamera | null {
        return this.camera;
    }

    /**
     * Clean up all Three.js resources
     */
    public dispose(): void {
        // Cancel animation frame
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Dispose all geometries and materials in the scene
        if (this.scene) {
            for (const child of this.scene.children) {
                if (child instanceof THREE.Mesh) {
                    child.geometry?.dispose();
                    if (child.material instanceof THREE.Material) {
                        child.material.dispose();
                    }
                }
            }
            this.scene.clear();
            this.scene = null;
        }

        // Dispose renderer
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }

        this.camera = null;
    }
}

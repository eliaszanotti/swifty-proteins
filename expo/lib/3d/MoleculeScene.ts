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

/**
 * MoleculeScene encapsulates all Three.js logic for rendering a molecule.
 * It manages the scene, camera, renderer, animation loop, and camera controls.
 */
export class MoleculeScene {
    private renderer: Renderer | null = null;
    private scene: THREE.Scene | null = null;
    private camera: THREE.PerspectiveCamera | null = null;
    private gl: ExpoWebGLRenderingContext;
    private width: number;
    private height: number;
    private animationFrameId: number | null = null;

    // Camera state managed internally
    private rotationX: number = 0;
    private rotationY: number = 0;
    private cameraDistance: number = 15;
    private minDistance: number = 2;
    private maxDistance: number = 200;

    constructor(
        gl: ExpoWebGLRenderingContext,
        molecule: MoleculeData,
        width: number,
        height: number
    ) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.setupScene(gl, molecule, width, height);
    }

    /**
     * Set up the Three.js scene with camera, lights, atoms, and bonds
     */
    private setupScene(
        gl: ExpoWebGLRenderingContext,
        molecule: MoleculeData,
        width: number,
        height: number
    ): void {
        // Create renderer
        this.renderer = new Renderer({ gl });

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const center = calculateMoleculeCenter(molecule.atoms);
        const distance = calculateOptimalCameraDistance(molecule.atoms);

        // Initialize camera state
        this.cameraDistance = distance;
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
    }

    /**
     * Rotate the camera by the given delta values.
     * Called from gesture handlers.
     */
    public rotate(deltaX: number, deltaY: number): void {
        this.rotationY -= deltaX * 0.02;
        this.rotationX += deltaY * 0.02;

        // Clamp vertical rotation
        this.rotationX = Math.max(
            -Math.PI / 2 + 0.1,
            Math.min(Math.PI / 2 - 0.1, this.rotationX)
        );
    }

    /**
     * Set the camera distance.
     * Called from gesture handlers.
     */
    public setDistance(distance: number): void {
        this.cameraDistance = Math.max(
            this.minDistance,
            Math.min(this.maxDistance, distance)
        );
    }

    /**
     * Reset camera to initial position.
     */
    public resetCamera(): void {
        this.rotationX = 0;
        this.rotationY = 0;
        this.cameraDistance = 15;
    }

    /**
     * Update camera position based on rotation and distance
     */
    private updateCamera(): void {
        if (!this.camera) return;

        // Update camera position based on rotation
        this.camera.position.x =
            this.cameraDistance * Math.sin(this.rotationY) * Math.cos(this.rotationX);
        this.camera.position.y = this.cameraDistance * Math.sin(this.rotationX);
        this.camera.position.z =
            this.cameraDistance * Math.cos(this.rotationY) * Math.cos(this.rotationX);
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

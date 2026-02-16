import * as THREE from "three";
import type { ExpoWebGLRenderingContext } from "expo-gl";
import { Renderer } from "expo-three";
import type { MoleculeData } from "@/lib/sdf-parser";
import { createAtomGeometry, createAtomMaterial } from "./atom-geometries";
import { getCpkColor } from "./cpk-colors";
import {
	createAllBondMeshes,
	calculateMoleculeCenter,
	calculateOptimalCameraDistance,
} from "./bond-geometries";

export type DisplayMode = "ball-and-stick" | "space-filling";

export class MoleculeScene {
	private renderer: Renderer | null = null;
	private scene: THREE.Scene | null = null;
	private camera: THREE.PerspectiveCamera | null = null;
	private gl: ExpoWebGLRenderingContext;
	private width: number;
	private height: number;
	private animationFrameId: number | null = null;

	private rotationX: number = 0;
	private rotationY: number = 0;
	private cameraDistance: number = 15;
	private minDistance: number = 2;
	private maxDistance: number = 200;

	private displayMode: DisplayMode;
	private atomMeshes: THREE.Mesh[] = [];
	private bondMeshes: THREE.Mesh[] = [];
	private moleculeData: MoleculeData;

	constructor(
		gl: ExpoWebGLRenderingContext,
		molecule: MoleculeData,
		width: number,
		height: number,
		displayMode: DisplayMode = "ball-and-stick",
	) {
		this.gl = gl;
		this.width = width;
		this.height = height;
		this.displayMode = displayMode;
		this.moleculeData = molecule;
		this.setupScene(gl, molecule, width, height);
	}

	private setupScene(
		gl: ExpoWebGLRenderingContext,
		molecule: MoleculeData,
		width: number,
		height: number,
	): void {
		this.renderer = new Renderer({ gl });

		// Create scene
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x000000);

		// Create camera
		this.camera = new THREE.PerspectiveCamera(
			75,
			width / height,
			0.1,
			1000,
		);
		const center = calculateMoleculeCenter(molecule.atoms);
		const distance = calculateOptimalCameraDistance(molecule.atoms);

		this.cameraDistance = distance;
		this.camera.position.set(0, 0, distance);
		this.camera.lookAt(0, 0, 0);

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		this.scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(10, 10, 10);
		this.scene.add(directionalLight);

		const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
		backLight.position.set(-10, -10, -10);
		this.scene.add(backLight);

		this.atomMeshes = [];
		const scaleFactor = this.displayMode === "space-filling" ? 2.5 : 1.0;
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
			mesh.scale.setScalar(scaleFactor);
			this.scene.add(mesh);
			this.atomMeshes.push(mesh);
		}

		this.bondMeshes = createAllBondMeshes(molecule.atoms, molecule.bonds);
		for (const bondMesh of this.bondMeshes) {
			bondMesh.position.sub(center);
			bondMesh.visible = this.displayMode === "ball-and-stick";
			this.scene.add(bondMesh);
		}
	}

	public rotate(deltaX: number, deltaY: number): void {
		this.rotationY -= deltaX * 0.02;
		this.rotationX += deltaY * 0.02;

		this.rotationX = Math.max(
			-Math.PI / 2 + 0.1,
			Math.min(Math.PI / 2 - 0.1, this.rotationX),
		);
	}

	public setDistance(distance: number): void {
		this.cameraDistance = Math.max(
			this.minDistance,
			Math.min(this.maxDistance, distance),
		);
	}

	public resetCamera(): void {
		this.rotationX = 0;
		this.rotationY = 0;
		this.cameraDistance = 15;
	}

	public getDisplayMode(): DisplayMode {
		return this.displayMode;
	}

	public setDisplayMode(mode: DisplayMode): void {
		if (this.displayMode === mode) return;

		this.displayMode = mode;
		const scaleFactor = mode === "space-filling" ? 2.5 : 1;
		const showBonds = mode === "ball-and-stick";

		for (const mesh of this.atomMeshes) {
			mesh.scale.setScalar(scaleFactor);
		}

		for (const mesh of this.bondMeshes) {
			mesh.visible = showBonds;
		}
	}

	private updateCamera(): void {
		if (!this.camera) return;

		this.camera.position.x =
			this.cameraDistance *
			Math.sin(this.rotationY) *
			Math.cos(this.rotationX);
		this.camera.position.y = this.cameraDistance * Math.sin(this.rotationX);
		this.camera.position.z =
			this.cameraDistance *
			Math.cos(this.rotationY) *
			Math.cos(this.rotationX);
		this.camera.lookAt(0, 0, 0);
	}

	private render = (): void => {
		if (!this.renderer || !this.scene || !this.camera) return;

		this.updateCamera();
		this.renderer.render(this.scene, this.camera);
		this.gl.endFrameEXP();

		this.animationFrameId = requestAnimationFrame(this.render);
	};

	public start(): void {
		if (this.animationFrameId === null) {
			this.render();
		}
	}

	public getScene(): THREE.Scene | null {
		return this.scene;
	}

	public getCamera(): THREE.PerspectiveCamera | null {
		return this.camera;
	}

	public dispose(): void {
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}

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

		if (this.renderer) {
			this.renderer.dispose();
			this.renderer = null;
		}

		this.camera = null;
	}
}

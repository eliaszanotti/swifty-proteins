import * as THREE from "three";
import type { Atom, Bond } from "@/lib/sdf-parser";

/**
 * Default thickness for bond cylinders
 */
const BOND_THICKNESS = 0.1;

/**
 * Create a cylinder mesh for a bond between two atoms
 */
export function createBondMesh(atom1: Atom, atom2: Atom): THREE.Mesh {
    const start = new THREE.Vector3(atom1.x, atom1.y, atom1.z);
    const end = new THREE.Vector3(atom2.x, atom2.y, atom2.z);

    // Calculate direction and length
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();

    // Calculate midpoint for cylinder position
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    // Create cylinder geometry (aligned along Y axis)
    const geometry = new THREE.CylinderGeometry(BOND_THICKNESS, BOND_THICKNESS, length, 16);

    // Create material (gray color for bonds)
    const material = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.5,
        metalness: 0.0,
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Position at midpoint
    mesh.position.copy(midpoint);

    // Rotate to align with bond direction
    // Cylinder is created along Y axis, so we rotate from (0,1,0) to bond direction
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(up, direction.clone().normalize());
    mesh.quaternion.copy(quaternion);

    return mesh;
}

/**
 * Create all bond meshes for a molecule
 */
export function createAllBondMeshes(atoms: Atom[], bonds: Bond[]): THREE.Mesh[] {
    const bondMeshes: THREE.Mesh[] = [];

    for (const bond of bonds) {
        // Bond indices are 1-based in SDF format
        const atom1 = atoms[bond.atom1 - 1];
        const atom2 = atoms[bond.atom2 - 1];

        if (atom1 && atom2) {
            bondMeshes.push(createBondMesh(atom1, atom2));
        }
    }

    return bondMeshes;
}

/**
 * Calculate the center point (centroid) of a set of atoms
 */
export function calculateMoleculeCenter(atoms: Atom[]): THREE.Vector3 {
    if (atoms.length === 0) {
        return new THREE.Vector3(0, 0, 0);
    }

    const center = new THREE.Vector3(0, 0, 0);
    for (const atom of atoms) {
        center.x += atom.x;
        center.y += atom.y;
        center.z += atom.z;
    }

    center.divideScalar(atoms.length);
    return center;
}

/**
 * Calculate the bounding box of a molecule
 */
export function calculateMoleculeBounds(atoms: Atom[]): THREE.Box3 {
    const box = new THREE.Box3();

    for (const atom of atoms) {
        box.expandByPoint(new THREE.Vector3(atom.x, atom.y, atom.z));
    }

    return box;
}

/**
 * Calculate the optimal camera distance based on molecule size
 */
export function calculateOptimalCameraDistance(atoms: Atom[]): number {
    const bounds = calculateMoleculeBounds(atoms);
    const size = new THREE.Vector3();
    bounds.getSize(size);

    const maxDimension = Math.max(size.x, size.y, size.z);

    // Camera distance to fit the molecule with some padding
    return maxDimension * 2.5 + 10;
}

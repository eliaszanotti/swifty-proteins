import * as THREE from "three";

/**
 * Convert screen coordinates to normalized device coordinates (NDC)
 * for use with Three.js raycaster
 */
export function screenToNdc(
    x: number,
    y: number,
    width: number,
    height: number
): THREE.Vector2 {
    const ndc = new THREE.Vector2();

    // NDC ranges from -1 to 1
    ndc.x = (x / width) * 2 - 1;
    ndc.y = -(y / height) * 2 + 1;

    return ndc;
}

/**
 * Cast a ray from camera through a screen point
 */
export function castRayFromScreenPoint(
    x: number,
    y: number,
    width: number,
    height: number,
    camera: THREE.Camera
): THREE.Ray {
    const raycaster = new THREE.Raycaster();
    const ndc = screenToNdc(x, y, width, height);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.ray;
}

/**
 * Find the first intersected object that has atom data
 */
export function findAtomAtScreenPoint(
    x: number,
    y: number,
    width: number,
    height: number,
    camera: THREE.Camera,
    scene: THREE.Scene
): { atom: any; point: THREE.Vector3 } | null {
    const raycaster = new THREE.Raycaster();
    const ndc = screenToNdc(x, y, width, height);
    raycaster.setFromCamera(ndc, camera);

    // Get all intersectable objects (atoms)
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (const intersect of intersects) {
        // Check if the object has atom data stored in userData
        if (intersect.object.userData.atom) {
            return {
                atom: intersect.object.userData.atom,
                point: intersect.point,
            };
        }
    }

    return null;
}

/**
 * Raycast and return all intersections
 */
export function getAllIntersections(
    x: number,
    y: number,
    width: number,
    height: number,
    camera: THREE.Camera,
    scene: THREE.Scene
): THREE.Intersection[] {
    const raycaster = new THREE.Raycaster();
    const ndc = screenToNdc(x, y, width, height);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.intersectObjects(scene.children, true);
}

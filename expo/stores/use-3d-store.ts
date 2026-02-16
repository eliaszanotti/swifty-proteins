import { create } from "zustand";

interface CameraState {
	rotationX: number;
	rotationY: number;
	cameraDistance: number;
	setRotation: (x: number, y: number) => void;
	setDistance: (distance: number) => void;
	reset: () => void;
}

const initialState = {
	rotationX: 0,
	rotationY: 0,
	cameraDistance: 15,
};

export const use3DStore = create<CameraState>((set) => ({
	...initialState,
	setRotation: (x, y) => set({ rotationX: x, rotationY: y }),
	setDistance: (distance) => set({ cameraDistance: distance }),
	reset: () => set(initialState),
}));

import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import type { RefObject } from "react";
import type { MoleculeScene } from "@/lib/3d/MoleculeScene";
import type { Atom } from "@/lib/sdf-parser";
import { findAtomAtScreenPoint } from "@/lib/3d/raycasting";

export function useTapGesture(
	sceneRef: RefObject<MoleculeScene | null>,
	width: number,
	height: number,
	onAtomSelect?: (atom: Atom) => void,
	onDismissTooltip?: () => void,
) {
	const handleTap = (x: number, y: number) => {
		const scene = sceneRef.current;
		if (!scene) return;

		const camera = scene.getCamera();
		const sceneObj = scene.getScene();

		if (!camera || !sceneObj) return;

		const result = findAtomAtScreenPoint(
			x,
			y,
			width,
			height,
			camera,
			sceneObj,
		);

		if (result && onAtomSelect) {
			onAtomSelect(result.atom);
		} else if (onDismissTooltip) {
			onDismissTooltip();
		}
	};

	return Gesture.Tap().onEnd((event: any) => {
		"worklet";
		runOnJS(handleTap)(event.absoluteX, event.absoluteY);
	});
}

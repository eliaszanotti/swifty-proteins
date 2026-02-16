import { Gesture } from "react-native-gesture-handler";
import { useSharedValue, runOnJS } from "react-native-reanimated";
import type { MoleculeScene } from "@/lib/3d/MoleculeScene";

export function usePinchGesture(
	sceneRef: React.RefObject<MoleculeScene | null>,
) {
	const baseDistance = useSharedValue(0);
	const currentDistance = useSharedValue(15);

	const handleZoom = (scale: number) => {
		if (sceneRef.current) {
			const newDistance = baseDistance.value / scale;
			const clampedDistance = Math.max(2, Math.min(200, newDistance));
			sceneRef.current.setDistance(clampedDistance);
			currentDistance.value = clampedDistance;
		}
	};

	return Gesture.Pinch()
		.onStart(() => {
			"useWorklet";
			baseDistance.value = currentDistance.value;
		})
		.onUpdate((event: any) => {
			"useWorklet";
			if (event.scale !== undefined && !isNaN(event.scale)) {
				runOnJS(handleZoom)(event.scale);
			}
		});
}

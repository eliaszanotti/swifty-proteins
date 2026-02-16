import { Gesture } from "react-native-gesture-handler";
import { useSharedValue, runOnJS } from "react-native-reanimated";
import type { MoleculeScene } from "@/lib/3d/MoleculeScene";

export function usePinchGesture(sceneRef: React.RefObject<MoleculeScene | null>) {
	const baseDistance = useSharedValue(0);

	const handleZoom = (scale: number) => {
		if (sceneRef.current) {
			const newDistance = 15 / scale;
			sceneRef.current.setDistance(Math.max(2, Math.min(200, newDistance)));
		}
	};

	return Gesture.Pinch()
		.onStart(() => {
			"useWorklet";
			baseDistance.value = 0;
		})
		.onUpdate((event: any) => {
			"useWorklet";
			if (event.scale !== undefined && !isNaN(event.scale)) {
				runOnJS(handleZoom)(event.scale);
			}
		});
}

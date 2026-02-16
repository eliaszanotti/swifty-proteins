import { Gesture } from "react-native-gesture-handler";
import { useSharedValue, runOnJS } from "react-native-reanimated";
import { useEffect } from "react";
import { use3DStore } from "@/stores/use-3d-store";

export function usePinchGesture() {
	const { cameraDistance, setDistance } = use3DStore();
	// Synchronize zustand value with SharedValue for worklet access
	const dist = useSharedValue(cameraDistance);
	const baseDistance = useSharedValue(cameraDistance);

	useEffect(() => {
		dist.value = cameraDistance;
	}, [cameraDistance, dist]);

	return Gesture.Pinch()
		.onStart(() => {
			"worklet";
			baseDistance.value = dist.value;
		})
		.onUpdate((event: any) => {
			"worklet";
			if (event.scale !== undefined && !isNaN(event.scale)) {
				const newDistance = baseDistance.value / event.scale;
				runOnJS(setDistance)(Math.max(2, Math.min(200, newDistance)));
			}
		});
}

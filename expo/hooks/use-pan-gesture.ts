import { Gesture } from "react-native-gesture-handler";
import { useSharedValue, runOnJS } from "react-native-reanimated";
import { useEffect } from "react";
import { use3DStore } from "@/stores/use-3d-store";

export function usePanGesture() {
	const { rotationX, rotationY, setRotation } = use3DStore();
	const prevX = useSharedValue(0);
	const prevY = useSharedValue(0);

	// Synchronize zustand values with SharedValues for worklet access
	const rotX = useSharedValue(rotationX);
	const rotY = useSharedValue(rotationY);

	useEffect(() => {
		rotX.value = rotationX;
		rotY.value = rotationY;
	}, [rotX, rotY, rotationX, rotationY]);

	return Gesture.Pan()
		.onStart(() => {
			"worklet";
			prevX.value = 0;
			prevY.value = 0;
		})
		.onUpdate((event: any) => {
			"worklet";
			const deltaX = event.translationX - prevX.value;
			const deltaY = event.translationY - prevY.value;

			prevX.value = event.translationX;
			prevY.value = event.translationY;

			const newX = rotX.value + deltaY * 0.02;
			const newY = rotY.value - deltaX * 0.02;

			const clampedX = Math.max(
				-Math.PI / 2 + 0.1,
				Math.min(Math.PI / 2 - 0.1, newX),
			);

			runOnJS(setRotation)(clampedX, newY);
		});
}

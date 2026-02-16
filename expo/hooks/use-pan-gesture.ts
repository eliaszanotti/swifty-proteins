import { Gesture } from "react-native-gesture-handler";
import { useSharedValue, runOnJS } from "react-native-reanimated";
import type { MoleculeScene } from "@/lib/3d/MoleculeScene";

export function usePanGesture(sceneRef: React.RefObject<MoleculeScene | null>) {
	const prevX = useSharedValue(0);
	const prevY = useSharedValue(0);

	const handleRotate = (deltaX: number, deltaY: number) => {
		if (sceneRef.current) {
			sceneRef.current.rotate(deltaX, deltaY);
		}
	};

	return Gesture.Pan()
		.onStart(() => {
			"useWorklet";
			prevX.value = 0;
			prevY.value = 0;
		})
		.onUpdate((event: any) => {
			"useWorklet";
			const deltaX = event.translationX - prevX.value;
			const deltaY = event.translationY - prevY.value;

			prevX.value = event.translationX;
			prevY.value = event.translationY;

			runOnJS(handleRotate)(deltaX, deltaY);
		});
}

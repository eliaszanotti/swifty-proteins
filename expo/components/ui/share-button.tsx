import { type RefObject, useState } from "react";
import { Alert } from "react-native";
import * as Sharing from "expo-sharing";
import { Button } from "tamagui";
import type { Molecule3DViewHandle } from "@/components/3d/molecule-3d-view";

interface ShareButtonProps {
	ligandId: string;
	moleculeName?: string;
	molecule3DRef: RefObject<Molecule3DViewHandle | null>;
}

export function ShareButton({
	ligandId,
	moleculeName,
	molecule3DRef,
}: ShareButtonProps) {
	const [isCapturing, setIsCapturing] = useState(false);

	const handleShare = async () => {
		if (!molecule3DRef.current) {
			Alert.alert("Error", "3D view is not ready yet");
			return;
		}

		setIsCapturing(true);

		try {
			const snapshot = await molecule3DRef.current.takeSnapshotAsync({
				format: "png",
				quality: 1.0,
				compress: 0.9,
			});

			const uri = snapshot.uri || snapshot.localUri;

			if (!uri) {
				throw new Error("Failed to capture screenshot");
			}

			const isSharingAvailable = await Sharing.isAvailableAsync();

			if (!isSharingAvailable) {
				Alert.alert("Error", "Sharing is not available on this device");
				return;
			}

			await Sharing.shareAsync(uri, {
				mimeType: "image/png",
				dialogTitle: `Share ${moleculeName || ligandId} 3D Structure`,
				UTI: "public.png",
			});
		} catch (error: any) {
			console.error("Share error:", error);
			Alert.alert(
				"Share Failed",
				error?.message || "Could not capture and share the screenshot",
			);
		} finally {
			setIsCapturing(false);
		}
	};

	return (
		<Button
			flex={1}
			onPress={handleShare}
			disabled={isCapturing}
			opacity={isCapturing ? 0.5 : 1}
		>
			{isCapturing ? "Capturing..." : "Share Screenshot"}
		</Button>
	);
}

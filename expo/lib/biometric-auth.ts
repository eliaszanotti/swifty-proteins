import * as LocalAuthentication from "expo-local-authentication";

export async function isBiometricAvailable(): Promise<boolean> {
	try {
		const hasHardware = await LocalAuthentication.hasHardwareAsync();
		const isEnrolled = await LocalAuthentication.isEnrolledAsync();
		return hasHardware && isEnrolled;
	} catch (error) {
		console.error("Error checking biometric availability:", error);
		return false;
	}
}

export async function authenticateWithBiometric(): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		const result = await LocalAuthentication.authenticateAsync({
			promptMessage: "Authenticate with FaceID",
			disableDeviceFallback: true,
		});

		if (result.success) {
			return { success: true };
		}

		return {
			success: false,
			error: "Authentication failed",
		};
	} catch (error) {
		console.error("Error during biometric authentication:", error);
		return {
			success: false,
			error: "An error occurred during authentication",
		};
	}
}

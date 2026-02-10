import * as SecureStore from "expo-secure-store";

const CREDENTIALS_KEY = "user_credentials";

interface StoredCredentials {
	email: string;
	password: string;
}

export async function saveCredentials(
	email: string,
	password: string,
): Promise<void> {
	try {
		const credentials: StoredCredentials = { email, password };
		await SecureStore.setItemAsync(
			CREDENTIALS_KEY,
			JSON.stringify(credentials),
		);
	} catch (error) {
		console.error("Failed to save credentials:", error);
		throw error;
	}
}

export async function getCredentials(): Promise<StoredCredentials | null> {
	try {
		const stored = await SecureStore.getItemAsync(CREDENTIALS_KEY);
		if (!stored) return null;
		return JSON.parse(stored) as StoredCredentials;
	} catch (error) {
		console.error("Failed to get credentials:", error);
		return null;
	}
}

export async function removeCredentials(): Promise<void> {
	try {
		await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
	} catch (error) {
		console.error("Failed to remove credentials:", error);
		throw error;
	}
}

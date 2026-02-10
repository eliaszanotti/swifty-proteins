import { Link, router } from "expo-router";
import {
	Button,
	Input,
	Paragraph,
	Text,
	XStack,
	YStack,
} from "tamagui";
import { SafeView } from "@/components/safe-view";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Alert } from "react-native";
import {
	isBiometricAvailable,
	authenticateWithBiometric,
} from "@/lib/biometric-auth";
import {
	saveCredentials,
	getCredentials,
} from "@/lib/credentials-storage";

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [biometricAvailable, setBiometricAvailable] = useState(false);

	useEffect(() => {
		checkBiometric();
	}, []);

	const checkBiometric = async () => {
		const available = await isBiometricAvailable();
		setBiometricAvailable(available);
	};

	const loginMutation = trpc.auth.login.useMutation({
		onSuccess: async (data) => {
			if (data.success) {
				router.replace("/(main)/ligands");
			} else {
				Alert.alert("Login Failed", data.message || "Invalid credentials");
			}
		},
		onError: (error) => {
			Alert.alert("Login Failed", error.message);
		},
	});

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		await saveCredentials(email, password);
		loginMutation.mutate({ email, password });
	};

	const handleBiometricLogin = async () => {
		const credentials = await getCredentials();

		if (!credentials) {
			Alert.alert(
				"No saved credentials",
				"Please login with your password first to enable biometric login",
			);
			return;
		}

		const result = await authenticateWithBiometric();

		if (result.success) {
			loginMutation.mutate({
				email: credentials.email,
				password: credentials.password,
			});
		} else {
			Alert.alert("Authentication Failed", result.error || "Please try again");
		}
	};

	return (
		<SafeView flex={1}>
			<YStack style={{ flex: 1, justifyContent: "center" }} bg="$background" p="$4" gap="$4">
				<Text fontSize="$8" fontWeight="bold">
					Swifty Proteins
				</Text>
				<Paragraph>
					Sign in to explore 3D protein structures
				</Paragraph>

				<Input
					placeholder="Email"
					autoCapitalize="none"
					keyboardType="email-address"
					value={email}
					onChangeText={setEmail}
				/>

				<Input
					placeholder="Password"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
				/>

				<YStack gap="$2">
					<Button
						onPress={handleLogin}
						disabled={loginMutation.isPending}
						opacity={loginMutation.isPending ? 0.5 : 1}
					>
						{loginMutation.isPending ? "Signing In..." : "Sign In"}
					</Button>

					{biometricAvailable && (
						<Button
							onPress={handleBiometricLogin}
							disabled={loginMutation.isPending}
							opacity={loginMutation.isPending ? 0.5 : 1}
						>
							Sign in with Face ID
						</Button>
					)}
				</YStack>

				<XStack style={{ justifyContent: "center" }} gap="$2">
					<Text>Don't have an account?</Text>
					<Link href="/register" asChild>
						<Text color="$blue10" fontWeight="600">
							Sign up
						</Text>
					</Link>
				</XStack>
			</YStack>
		</SafeView>
	);
}

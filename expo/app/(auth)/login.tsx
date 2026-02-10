import { Link, router } from "expo-router";
import {
	Anchor,
	Button,
	Card,
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
				await saveCredentials(email, password);
				router.replace("/(main)/ligands");
			} else {
				Alert.alert("Login Failed", data.message || "Invalid credentials");
			}
		},
		onError: (error) => {
			Alert.alert("Login Failed", error.message);
		},
	});

	const handleLogin = () => {
		if (!email || !password) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

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
		<SafeView>
			<YStack gap="$4" p="$4">
				<Text fontSize="$10" fontWeight="bold" color="$color">
					Swifty Proteins
				</Text>
				<Paragraph>Protein 3D Visualizer</Paragraph>

				<Card width="100%">
					<Card.Header>
						<Text>Login</Text>
					</Card.Header>
					<YStack gap="$4">
						<YStack gap="$2">
							<Text color="$color">Email</Text>
							<Input
								placeholder="your@email.com"
								autoCapitalize="none"
								keyboardType="email-address"
								value={email}
								onChangeText={setEmail}
							/>
						</YStack>

						<YStack gap="$2">
							<Text color="$color">Password</Text>
							<Input
								placeholder="••••••••"
								secureTextEntry
								value={password}
								onChangeText={setPassword}
							/>
						</YStack>

						<YStack gap="$2">
							<Button
								onPress={handleLogin}
								disabled={loginMutation.isPending}
							>
								{loginMutation.isPending ? "Signing In..." : "Sign In"}
							</Button>
							{biometricAvailable && (
								<Button
									variant="outlined"
									onPress={handleBiometricLogin}
									disabled={loginMutation.isPending}
								>
									Sign in with Fingerprint
								</Button>
							)}
						</YStack>
					</YStack>
				</Card>

				<XStack gap="$2">
					<Paragraph>Don&apos;t have an account?</Paragraph>
					<Link href="/register" asChild>
						<Text color="$blue10" style={{ textDecorationLine: 'underline' }}>
							Sign up
						</Text>
					</Link>
				</XStack>
			</YStack>
		</SafeView>
	);
}

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
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Alert } from "react-native";
import { saveCredentials } from "@/lib/credentials-storage";

export default function RegisterScreen() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const registerMutation = trpc.auth.register.useMutation({
		onSuccess: async (data) => {
			if (data.success) {
				await saveCredentials(email, password);
				Alert.alert(
					"Success",
					"Account created! Please login.",
					[{ text: "OK", onPress: () => router.replace("/login") }]
				);
			} else {
				Alert.alert("Registration Failed", data.message || "Please try again");
			}
		},
		onError: (error) => {
			Alert.alert("Registration Failed", error.message);
		},
	});

	const handleRegister = () => {
		if (!name || !email || !password || !confirmPassword) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match");
			return;
		}

		if (password.length < 8) {
			Alert.alert("Error", "Password must be at least 8 characters");
			return;
		}

		if (password.length > 20) {
			Alert.alert("Error", "Password must be 20 characters or less");
			return;
		}

		registerMutation.mutate({ name, email, password });
	};

	return (
		<SafeView flex={1}>
			<YStack style={{ flex: 1, justifyContent: "center" }} bg="$background" p="$4" gap="$4">
				<Text fontSize="$8" fontWeight="bold">
					Create Account
				</Text>
				<Paragraph>
					Join Swifty Proteins
				</Paragraph>

				<Input
					placeholder="Name"
					autoCapitalize="words"
					value={name}
					onChangeText={setName}
					accessibilityLabel="Name"
					accessibilityHint="Enter your full name"
				/>

				<Input
					placeholder="Email"
					autoCapitalize="none"
					keyboardType="email-address"
					value={email}
					onChangeText={setEmail}
					accessibilityLabel="Email address"
					accessibilityHint="Enter your email"
				/>

				<Input
					placeholder="Password"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
					accessibilityLabel="Password"
					accessibilityHint="Enter a password with at least 8 characters"
				/>

				<Input
					placeholder="Confirm Password"
					secureTextEntry
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					accessibilityLabel="Confirm password"
					accessibilityHint="Re-enter your password"
				/>

				<Button
					onPress={handleRegister}
					disabled={registerMutation.isPending}
					opacity={registerMutation.isPending ? 0.5 : 1}
					accessibilityLabel="Create account"
					accessibilityHint="Double tap to create your account"
				>
					{registerMutation.isPending ? "Creating Account..." : "Sign Up"}
				</Button>

				<XStack style={{ justifyContent: "center" }} gap="$2">
					<Text>Already have an account?</Text>
					<Link href="/login" asChild>
						<Text color="$blue10" fontWeight="600">
							Sign in
						</Text>
					</Link>
				</XStack>
			</YStack>
		</SafeView>
	);
}

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
		<SafeView>
			<YStack gap="$4" p="$4">
				<Text fontSize="$10" fontWeight="bold" color="$color">
					Create Account
				</Text>
				<Paragraph>Join Swifty Proteins</Paragraph>

				<Card width="100%">
					<Card.Header>
						<Text>Sign Up</Text>
					</Card.Header>
					<YStack gap="$4">
						<YStack gap="$2">
							<Text color="$color">Name</Text>
							<Input
								placeholder="Your name"
								autoCapitalize="words"
								value={name}
								onChangeText={setName}
							/>
						</YStack>

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
							<Text color="$color">Confirm Password</Text>
							<Input
								placeholder="••••••••"
								secureTextEntry
								value={confirmPassword}
								onChangeText={setConfirmPassword}
							/>
						</YStack>

						<YStack gap="$2">
							<Button
								onPress={handleRegister}
								disabled={registerMutation.isPending}
							>
								{registerMutation.isPending ? "Creating Account..." : "Sign Up"}
							</Button>
						</YStack>
					</YStack>
				</Card>

				<XStack gap="$2">
					<Paragraph>Already have an account?</Paragraph>
					<Link href="/login" asChild>
						<Text color="$blue10" style={{ textDecorationLine: 'underline' }}>
							Sign in
						</Text>
					</Link>
				</XStack>
			</YStack>
		</SafeView>
	);
}

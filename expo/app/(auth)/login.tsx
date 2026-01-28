import { Link, useRouter } from "expo-router";
import {
	Group,
	Anchor,
	Button,
	Card,
	Input,
	Paragraph,
	Spacer,
	Text,
	XStack,
	YStack,
} from "tamagui";

export default function LoginScreen() {
	return (
		<YStack
			flex={1}
			// backgroundColor="$background"
			// padding="$4"
			// justifyContent="center"
			// alignItems="center"
			gap="$4"
		>
			{/* Logo / Icon placeholder */}
			<Card
				width={100}
				height={100}
				borderRadius="$8"
				// backgroundColor="$backgroundStrong"
				justifyContent="center"
				alignItems="center"
			>
				<Text fontSize="$8">🧬</Text>
			</Card>

			{/* Title */}
			<Text fontSize="$12" fontWeight="bold" color="$color">
				Swifty Proteins
			</Text>
			<Paragraph color="$colorMuted">Protein 3D Visualizer</Paragraph>

			<Spacer />

			{/* Login Form Card */}
			<Card
				width="100%"
				maxWidth={400}
				padding="$6"
				gap="$4"
				shadowColor="#000"
				shadowOffset={{ width: 0, height: 2 }}
				shadowOpacity={0.1}
				shadowRadius={4}
			>
				<YStack gap="$4">
					<YStack gap="$2">
						<Text fontWeight="bold" color="$color">
							Email
						</Text>
						<Input
							placeholder="your@email.com"
							autoCapitalize="none"
							keyboardType="email-address"
						/>
					</YStack>

					<YStack gap="$2">
						<Text fontWeight="bold" color="$color">
							Password
						</Text>
						<Input placeholder="••••••••" secureTextEntry />
					</YStack>

					<YStack gap="$3">
						<Button
							size="$5"
							theme="blue"
							// onPress={handleLogin}
						>
							Sign In
						</Button>

						<Button
							size="$5"
							icon={() => <Text>👆</Text>}
							variant="outlined"
							borderColor="$borderColor"
							color="$color"
							// onPress={handleFingerprintAuth}
						>
							Sign in with Fingerprint
						</Button>
					</YStack>
				</YStack>
			</Card>

			{/* Register Link */}
			<XStack gap="$2">
				<Paragraph>Don&apos;t have an account?</Paragraph>
				<Link href="/register">
					<Anchor color="$blue10">Sign up</Anchor>
				</Link>
			</XStack>
		</YStack>
	);
}

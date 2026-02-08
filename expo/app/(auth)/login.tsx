import { Link } from "expo-router";
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

export default function LoginScreen() {
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
							/>
						</YStack>

						<YStack gap="$2">
							<Text color="$color">Password</Text>
							<Input placeholder="••••••••" secureTextEntry />
						</YStack>

						<YStack gap="$2">
							<Button>Sign In</Button>
							<Button variant="outlined">
								Sign in with Fingerprint
							</Button>
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

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

export default function RegisterScreen() {
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
							/>
						</YStack>

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
							<Text color="$color">Confirm Password</Text>
							<Input placeholder="••••••••" secureTextEntry />
						</YStack>

						<YStack gap="$2">
							<Button>Sign Up</Button>
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

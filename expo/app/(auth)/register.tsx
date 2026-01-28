import { Link } from 'expo-router';
import {
	Anchor,
	Button,
	Card,
	Input,
	Paragraph,
	Spacer,
	Text,
	XStack,
	YStack,
} from 'tamagui';

export default function RegisterScreen() {
	return (
		<YStack
			flex={1}
			backgroundColor="$background"
			padding="$4"
			justifyContent="center"
			alignItems="center"
			gap="$4"
		>
			{/* Logo / Icon placeholder */}
			<Card
				width={100}
				height={100}
				borderRadius="$8"
				backgroundColor="$backgroundStrong"
				justifyContent="center"
				alignItems="center"
			>
				<Text fontSize="$8">🧬</Text>
			</Card>

			{/* Title */}
			<Text fontSize="$12" fontWeight="bold" color="$color">
				Create Account
			</Text>
			<Paragraph color="$colorMuted">Join Swifty Proteins</Paragraph>

			<Spacer />

			{/* Register Form Card */}
			<Card
				width="100%"
				maxWidth={400}
				padding="$6"
				gap="$4"
				elevation
			>
				<YStack gap="$4">
					<YStack gap="$2">
						<Text fontWeight="bold" color="$color">
							Name
						</Text>
						<Input placeholder="Your name" />
					</YStack>

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

					<YStack gap="$2">
						<Text fontWeight="bold" color="$color">
							Confirm Password
						</Text>
						<Input placeholder="••••••••" secureTextEntry />
					</YStack>

					<Button
						size="$5"
						theme="blue"
						marginTop="$2"
						// onPress={handleRegister}
					>
						Sign Up
					</Button>
				</YStack>
			</Card>

			{/* Login Link */}
			<XStack gap="$2">
				<Paragraph color="$colorMuted">Already have an account?</Paragraph>
				<Link href="/login">
					<Anchor color="$blue10">Sign in</Anchor>
				</Link>
			</XStack>
		</YStack>
	);
}

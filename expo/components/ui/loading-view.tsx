import { YStack, Text, Spinner } from "tamagui";
import { SafeView } from "@/components/safe-view";

interface LoadingViewProps {
	message?: string;
}

export function LoadingView({ message = "Loading..." }: LoadingViewProps) {
	return (
		<SafeView flex={1}>
			<YStack
				flex={1}
				bg="$background"
				style={{ justifyContent: "center", alignItems: "center" }}
				gap="$3"
			>
				<Spinner size="large" color="$gray10" />
				<Text color="$color10">{message}</Text>
			</YStack>
		</SafeView>
	);
}

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, type ViewProps } from "tamagui";

export type SafeViewProps = ViewProps;

export function SafeView({ style, children, ...props }: SafeViewProps) {
	const insets = useSafeAreaInsets();

	return (
		<View
			style={{
				paddingTop: insets.top,
				paddingBottom: insets.bottom,
				paddingLeft: insets.left,
				paddingRight: insets.right,
			}}
			background="$background"
			{...props}
		>
			{children}
		</View>
	);
}

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, type ViewProps } from "tamagui";

export type SafeViewProps = ViewProps;

export function SafeView({ style, children, ...props }: SafeViewProps) {
	const insets = useSafeAreaInsets();

	return (
		<View
			style={[
				{
					flex: 1,
					paddingTop: insets.top,
					paddingBottom: insets.bottom,
					paddingLeft: insets.left,
					paddingRight: insets.right,
				},
				style,
			]}
			bg="$background"
			{...props}
		>
			{children}
		</View>
	);
}

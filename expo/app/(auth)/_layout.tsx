import { Stack } from 'expo-router';
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from '../../tamagui.config';

export default function AuthLayout() {
	return (
		<TamaguiProvider config={tamaguiConfig}>
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="login" />
				<Stack.Screen name="register" />
			</Stack>
		</TamaguiProvider>
	);
}

import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "@/lib/tamagui.config";
import { TRPCProvider } from "@/providers/trpc-provider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const DarkTheme = {
	dark: true,
	colors: {
		primary: "#0a7ea4",
		background: "#000000",
		card: "#000000",
		text: "#ffffff",
		border: "#272729",
		notification: "#ff453a",
	},
	fonts: {
		regular: { fontFamily: "System", fontWeight: "400" as const },
		medium: { fontFamily: "System", fontWeight: "500" as const },
		bold: { fontFamily: "System", fontWeight: "700" as const },
		heavy: { fontFamily: "System", fontWeight: "800" as const },
	},
};

export default function RootLayout() {
	const [loaded] = useFonts({
		Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
		InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<TRPCProvider>
			<TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
				<ThemeProvider value={DarkTheme}>
					<Stack
						screenOptions={{
							headerShown: false,
							contentStyle: { backgroundColor: "#000000" },
						}}
					>
						<Stack.Screen name="index" />
					</Stack>
					<StatusBar style="light" />
				</ThemeProvider>
			</TamaguiProvider>
		</TRPCProvider>
	);
}

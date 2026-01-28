import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Garder le splash screen visible pour l'effet de chargement
SplashScreen.preventAutoHideAsync();

export default function Index() {
    useEffect(() => {
        // Cacher le splash screen après un délai pour qu'il soit visible
        const timer = setTimeout(() => {
            SplashScreen.hideAsync();
        }, 2500); // 2.5 secondes de splash screen

        return () => clearTimeout(timer);
    }, []);

    // TOUJOURS rediriger vers le login (requis par le sujet)
    return <Redirect href="/login" />;
}

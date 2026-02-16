import { Share } from "react-native";
import { Button } from "tamagui";

interface ShareButtonProps {
	ligandId: string;
	moleculeName?: string;
}

export function ShareButton({ ligandId, moleculeName }: ShareButtonProps) {
	const handleShare = async () => {
		try {
			await Share.share({
				message: `Check out this ${moleculeName || ligandId} ligand!\nhttps://files.rcsb.org/ligands/view/${ligandId}.html`,
				url: `https://files.rcsb.org/ligands/download/${ligandId}_ideal.sdf`,
			});
		} catch (error) {
			console.log("Share error:", error);
		}
	};

	return (
		<Button flex={1} onPress={handleShare}>
			Share Model
		</Button>
	);
}

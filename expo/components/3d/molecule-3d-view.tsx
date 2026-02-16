import { useState } from "react";
import { View, DimensionValue } from "react-native";
import type { Atom, MoleculeData } from "@/lib/sdf-parser";
import type { DisplayMode } from "@/lib/3d/MoleculeScene";
import { Molecule3DViewInner } from "./molecule-3d-view-inner";

interface Molecule3DViewProps {
	molecule: MoleculeData;
	onAtomSelect?: (atom: Atom) => void;
	onDismissTooltip?: () => void;
	width?: DimensionValue;
	height?: DimensionValue;
	style?: any;
	displayMode?: DisplayMode;
}

export function Molecule3DView({
	molecule,
	onAtomSelect,
	onDismissTooltip,
	width = "100%",
	height = "100%",
	style,
	displayMode = 'ball-and-stick',
}: Molecule3DViewProps) {
	const [dimensions, setDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);

	const handleLayout = (event: any) => {
		const { width, height } = event.nativeEvent.layout;
		setDimensions({ width, height });
	};

	return (
		<View style={[{ width, height }, style]} onLayout={handleLayout}>
			{dimensions && (
				<Molecule3DViewInner
					molecule={molecule}
					onAtomSelect={onAtomSelect}
					onDismissTooltip={onDismissTooltip}
					width={dimensions.width}
					height={dimensions.height}
					displayMode={displayMode}
				/>
			)}
		</View>
	);
}

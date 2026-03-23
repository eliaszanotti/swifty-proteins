import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { DimensionValue, View } from "react-native";
import type { Atom, MoleculeData } from "@/lib/sdf-parser";
import type { DisplayMode } from "@/lib/3d/MoleculeScene";
import { Molecule3DViewInner, type Molecule3DViewHandle } from "./molecule-3d-view-inner";

export type { Molecule3DViewHandle };

interface Molecule3DViewProps {
	molecule: MoleculeData;
	onAtomSelect?: (atom: Atom) => void;
	onDismissTooltip?: () => void;
	width?: DimensionValue;
	height?: DimensionValue;
	style?: any;
	displayMode?: DisplayMode;
}

export const Molecule3DView = forwardRef<
	Molecule3DViewHandle,
	Molecule3DViewProps
>(
	(
		{
			molecule,
			onAtomSelect,
			onDismissTooltip,
			width = "100%",
			height = "100%",
			style,
			displayMode = "ball-and-stick",
		},
		ref,
	) => {
		const [dimensions, setDimensions] = useState<{
			width: number;
			height: number;
		} | null>(null);
		const innerViewRef = useRef<Molecule3DViewHandle>(null);

		useImperativeHandle(ref, () => ({
			takeSnapshotAsync: async (options?: any) => {
				if (!innerViewRef.current) {
					throw new Error("3D View not ready");
				}
				return innerViewRef.current.takeSnapshotAsync(options);
			},
		}));

		const handleLayout = (event: any) => {
			const { width, height } = event.nativeEvent.layout;
			setDimensions({ width, height });
		};

		return (
			<View style={[{ width, height }, style]} onLayout={handleLayout}>
				{dimensions && (
					<Molecule3DViewInner
						ref={innerViewRef}
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
	},
);

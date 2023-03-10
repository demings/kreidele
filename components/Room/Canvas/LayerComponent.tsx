import React, { memo } from "react";
import { useStorage } from "../../../liveblocks.config";
import { CanvasMode, LayerType } from "../../../shared/types";
import { colorToCss } from "../../../shared/utils";
import Ellipse from "./Ellipse";
import Path from "./Path";
import Rectangle from "./Rectangle";

type Props = {
  id: string;
  mode: CanvasMode;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
};

const LayerComponent = memo(
  ({ mode, onLayerPointerDown, id, selectionColor }: Props) => {
    const layer = useStorage((root) => root.layers.get(id));
    if (!layer) {
      return null;
    }

    const isAnimated =
      mode !== CanvasMode.Translating && mode !== CanvasMode.Resizing;

    switch (layer.type) {
      case LayerType.Ellipse:
        return (
          <Ellipse
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            isAnimated={isAnimated}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Path:
        return (
          <Path
            key={id}
            points={layer.points}
            isAnimated={isAnimated}
            onPointerDown={(e) => onLayerPointerDown(e, id)}
            x={layer.x}
            y={layer.y}
            fill={layer.fill ? colorToCss(layer.fill) : "#CCC"}
            stroke={selectionColor}
          />
        );
      case LayerType.Rectangle:
        return (
          <Rectangle
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            isAnimated={isAnimated}
            selectionColor={selectionColor}
          />
        );
      default:
        console.warn("Unknown layer type");
        return null;
    }
  }
);

export default LayerComponent;

import { LiveObject } from "@liveblocks/client";
import { nanoid } from "nanoid";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useDeleteLayers from "../../hooks/useDeleteLayers";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useSelf,
  useStorage,
} from "../../liveblocks.config";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from "../../shared/types";
import {
  colorToCss,
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "../../shared/utils";
import LayerComponent from "../LayerComponent";
import MultiplayerGuides from "../MultiplayerGuides";
import Path from "../Path";
import SelectionBox from "../SelectionBox";
import SelectionTools from "../SelectionTools";
import { ToolsBar } from "../ToolsBar/ToolsBar";

const MAX_LAYERS = 100;

export function Canvas() {
  const layerIds = useStorage((root) => root.layerIds);

  const pencilDraft = useSelf((me) => me.presence.pencilDraft);
  const [canvasState, setState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const deleteLayers = useDeleteLayers();

  /**
   * Hook used to listen to Undo / Redo and delete selected layers
   */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Backspace": {
          deleteLayers();
          break;
        }
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteLayers, history]);

  /**
   * Select the layer if not already selected and start translating the selection
   */
  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();
      const point = pointerEventToCanvasPoint(e, camera);
      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setState({ mode: CanvasMode.Translating, current: point });
    },
    [setState, camera, history, canvasState.mode]
  );

  /**
   * Start resizing the layer
   */
  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history]
  );

  /**
   * Insert an ellipse or a rectangle at the given position and select it
   */
  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType: LayerType.Ellipse | LayerType.Rectangle,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      });
      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setState({ mode: CanvasMode.None });
    },
    [lastUsedColor]
  );

  /**
   * Transform the drawing of the current user in a layer and reset the presence to delete the draft.
   */
  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const { pencilDraft } = self.presence;
      if (
        pencilDraft == null ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();
      liveLayers.set(
        id,
        new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor))
      );

      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);
      setMyPresence({ pencilDraft: null });
      setState({ mode: CanvasMode.Pencil });
    },
    [lastUsedColor]
  );

  /**
   * Move selected layers on the canvas
   */
  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }

      setState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState]
  );

  /**
   * Resize selected layer. Only resizing a single layer is allowed.
   */
  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);
      if (layer) {
        layer.update(bounds);
      }
    },
    [canvasState]
  );

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  /**
   * Insert the first path point and start drawing with the pencil
   */
  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor]
  );

  /**
   * Continue the drawing and send the current draft to other users in the room
   */
  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;
      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState.mode]
  );

  /**
   * Start multiselection with the selection net if the pointer move enough since pressed
   */
  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    // If the distance between the pointer position and the pointer position when it was pressed
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      // Start multi selection
      setState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  /**
   * Update the position of the selection net and select the layers accordingly
   */
  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();
      setState({
        mode: CanvasMode.SelectionNet,
        origin: origin,
        current,
      });
      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current
      );
      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  const selections = useOthersMapped((other) => other.presence.selection);

  /**
   * Create a map layerId to color based on the selection of all the users in the room
   */
  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;
      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    // Pan the camera based on the wheel delta
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }

      setState({ origin: point, mode: CanvasMode.Pressing });
    },
    [camera, canvasState.mode, setState, startDrawing]
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }
      setMyPresence({ cursor: current });
    },
    [
      camera,
      canvasState,
      continueDrawing,
      resizeSelectedLayer,
      startMultiSelection,
      translateSelectedLayers,
      updateSelectionNet,
    ]
  );

  const onPointerLeave = useMutation(
    ({ setMyPresence }) => setMyPresence({ cursor: null }),
    []
  );

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unselectLayers();
        setState({
          mode: CanvasMode.None,
        });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setState({
          mode: CanvasMode.None,
        });
      }
      history.resume();
    },
    [
      camera,
      canvasState,
      history,
      insertLayer,
      insertPath,
      setState,
      unselectLayers,
    ]
  );

  const canvasDivRef = useRef();
  const [canvasX, setCanvasX] = useState<number>();
  const [canvasY, setCanvasY] = useState<number>();

  const getPosition = () => {
    setCanvasX((canvasDivRef.current as any)?.offsetLeft ?? 0);
    setCanvasY((canvasDivRef.current as any)?.offsetTop ?? 0);
  };

  useEffect(() => {
    // Get the position of canvas in the beginning
    getPosition();

    // Re-calculate X and Y of the red box when the window is resized by the user
    window.addEventListener("resize", getPosition);
  }, []);

  return (
    <>
      {/**
      https://stackoverflow.com/questions/48124372/pointermove-event-not-working-with-touch-why-not

      After a short period of time, the (mobile) browser will claim the pointermove event for "native" behavior like panning the page.

      The designed, simple solution is to use the css property touch-action and set it to none on the container that has the event handler.
      */}
      <div
        className="touch-none col-span-2 row-span-2 w-96 h-96"
        ref={canvasDivRef as any}
      >
        <SelectionTools
          isAnimated={
            canvasState.mode !== CanvasMode.Translating &&
            canvasState.mode !== CanvasMode.Resizing
          }
          camera={camera}
          setLastUsedColor={setLastUsedColor}
          offset={{
            x: canvasX!,
            y: canvasY!,
          }}
        />
        <svg
          className=" bg-slate-50 flex w-full h-full"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onPointerUp={onPointerUp}
        >
          <g
            style={{
              transform: `translate(${camera.x - canvasX!}px, ${
                camera.y - canvasY!
              }px)`,
            }}
          >
            {layerIds.map((layerId) => (
              <LayerComponent
                key={layerId}
                id={layerId}
                mode={canvasState.mode}
                onLayerPointerDown={onLayerPointerDown}
                selectionColor={layerIdsToColorSelection[layerId]}
              />
            ))}
            {/* Blue square that show the selection of the current users. Also contains the resize handles. */}
            <SelectionBox
              onResizeHandlePointerDown={onResizeHandlePointerDown}
              isAnimated={
                canvasState.mode !== CanvasMode.Translating &&
                canvasState.mode !== CanvasMode.Resizing
              }
            />
            {/* Selection net that appears when the user is selecting multiple layers at once */}
            {canvasState.mode === CanvasMode.SelectionNet &&
              canvasState.current != null && (
                <rect
                  className="fill-blue-700 opacity-5"
                  x={Math.min(canvasState.origin.x, canvasState.current.x)}
                  y={Math.min(canvasState.origin.y, canvasState.current.y)}
                  width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                  height={Math.abs(
                    canvasState.origin.y - canvasState.current.y
                  )}
                />
              )}
            <MultiplayerGuides />
            {/* Drawing in progress. Still not commited to the storage. */}
            {pencilDraft != null && pencilDraft.length > 0 && (
              <Path
                points={pencilDraft}
                fill={colorToCss(lastUsedColor)}
                x={0}
                y={0}
              />
            )}
          </g>
        </svg>
      </div>

      <ToolsBar
        canvasState={canvasState}
        setCanvasState={setState}
        undo={history.undo}
        redo={history.redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </>
  );
}

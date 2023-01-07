import { useMutation } from "../liveblocks.config";

/**
 * Delete all the selected layers.
 */
export default function useDeleteAllLayers() {
  return useMutation(({ storage }) => {
    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");

    liveLayerIds.forEach((id) => {
      liveLayers.delete(id);
    });
  }, []);
}

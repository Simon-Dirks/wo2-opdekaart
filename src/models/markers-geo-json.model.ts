import {MarkerModel} from "./marker.model";
import {LngLatLike} from "mapbox-gl";

export type MarkersGeoJsonModel = {
    "type": string;
    "features": {
        properties: MarkerModel,
        type: string,
        geometry: { type: string, coordinates: LngLatLike }
    }[]
}
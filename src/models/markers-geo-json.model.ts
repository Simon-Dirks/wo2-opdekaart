import {MarkerPropertiesModel} from "./marker-properties.model";
import {LngLatLike} from "mapbox-gl";

export type MarkersGeoJsonModel = {
    "type": string;
    "features": {
        properties: MarkerPropertiesModel,
        type: string,
        geometry: { type: string, coordinates: LngLatLike }
    }[]
}
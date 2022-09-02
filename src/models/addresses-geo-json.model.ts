import {LngLatLike} from "mapbox-gl";
import {AddressModel} from "./address.model";

export type AddressesGeoJsonModel = {
    "type": string;
    "features": {
        properties: AddressModel,
        type: string,
        geometry: { type: string, coordinates: LngLatLike }
    }[]
}
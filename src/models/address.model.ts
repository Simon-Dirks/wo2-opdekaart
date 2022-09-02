import {DocumentModel} from "./document.model";
import {LngLatLike} from "mapbox-gl";

export type AddressModel = {
    id: string;
    label: string;
    coordinates: LngLatLike;
    houseLetter?: string;
    houseNumber?: string;
    houseNumberAddition?: string;
    streetName?: string;
    place?: string;

    documentCount: number;
    // documentIds: string[];
    documents: DocumentModel[];
}
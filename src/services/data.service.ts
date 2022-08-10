import {TripleStoreMarkerModel} from "../models/triple-store-marker.model";
import {MarkersGeoJsonModel} from "../models/markers-geo-json.model";
import {MarkerModel} from "../models/marker.model";
import {LngLatLike} from "mapbox-gl";
import {store} from "../store";

export class DataService {
    private static _instance: DataService;
    private readonly TRIPLY_TOKEN: string = import.meta.env.VITE_TRIPLY_TOKEN;
    private readonly MARKERS_QUERY_URL: string = 'https://api.data.netwerkdigitaalerfgoed.nl/queries/hetutrechtsarchief/Query-3/run?zoekterm=';

    constructor() {
        if (DataService._instance) {
            return DataService._instance
        }
        DataService._instance = this;
    }

    // TODO: Make query return all items without search term
    public async updateMarkersFromServer(searchTerm: string = 'Jan'): Promise<void> {
        console.log("Retrieving markers...");
        const headers: Headers = new Headers({
            'Authorization': this.TRIPLY_TOKEN
        });
        const rawResponse: void | Response = await fetch(this.MARKERS_QUERY_URL + searchTerm, {
            method: 'get',
            headers: headers
        }).catch((err) => {
            console.error(err);
        });
        if (!rawResponse) {
            // TODO: Use more beautiful alert box
            alert("ERROR: Could not retrieve data.");
            return Promise.reject();
        }
        const response: any = await rawResponse.json();
        if ('message' in response) {
            // TODO: Use more beautiful alert box
            alert("ERROR: " + response.message);
            return Promise.reject();
        }
        const markers: TripleStoreMarkerModel[] = response as TripleStoreMarkerModel[];
        const markersGeoJson: MarkersGeoJsonModel = this._parseMarkers(markers);
        store.commit("map/setGeoJson", markersGeoJson)

        return Promise.resolve();
    }

    private _parseMarkers(markers: TripleStoreMarkerModel[]): MarkersGeoJsonModel {
        const markersGeoJson: MarkersGeoJsonModel = {
            "type": "FeatureCollection",
            "features": []
        };

        for (const marker of markers) {
            console.log(marker);
            const markerProperties: MarkerModel = {
                "markerColor": '#D72F19',
                "label": marker.label,
                "imgUrl": marker.depicts
            }
            const coordinates: LngLatLike = [parseFloat(marker.long), parseFloat(marker.lat)];
            markersGeoJson['features'].push({
                properties: markerProperties,
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: coordinates
                }
            })
        }
        return markersGeoJson;
    }
}
import {MarkersGeoJsonModel} from "../../models/markers-geo-json.model";

interface MapState {
    geoJson: MarkersGeoJsonModel | null;
    isInitialized: boolean;
}

export const mapStoreModule = {
    namespaced: true,
    state() {
        return {
            geoJson: null,
            isInitialized: false
        };
    },
    getters: {
        getGeoJson(state: MapState) {
            return state.geoJson;
        },
        getIsInitialized(state: MapState) {
            return state.isInitialized;
        }
    },
    mutations: {
        setGeoJson: (state: MapState, geoJson: MarkersGeoJsonModel) => {
            state.geoJson = geoJson;
        },
        setIsInitialized: (state: MapState, isInitialized: boolean) => {
            state.isInitialized = isInitialized;
        }
    }
};
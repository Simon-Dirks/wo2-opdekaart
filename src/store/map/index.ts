import {AddressesGeoJsonModel} from "../../models/addresses-geo-json.model";

interface MapState {
    geoJson: AddressesGeoJsonModel | null;
    // documents: DocumentModel[];
    isInitialized: boolean;
}

export const mapStoreModule = {
    namespaced: true,
    state() {
        return {
            geoJson: null,
            // documents: [],
            isInitialized: false
        };
    },
    getters: {
        getGeoJson(state: MapState): AddressesGeoJsonModel | null {
            return state.geoJson;
        },
        // getDocuments(state: MapState): DocumentModel[] {
        //     return state.documents;
        // },
        // getDocumentsByIds: (state: MapState) => (documentIds: string[]) => {
        //     if(!documentIds) {
        //         console.warn("No document IDs passed...");
        //         return [];
        //     }
        //     return state.documents.filter((document) => documentIds.includes(document.id));
        // },
        getIsInitialized(state: MapState): boolean {
            return state.isInitialized;
        }
    },
    mutations: {
        setGeoJson: (state: MapState, geoJson: AddressesGeoJsonModel) => {
            state.geoJson = geoJson;
        },
        // setDocuments: (state: MapState, documents: DocumentModel[]) => {
        //     state.documents = documents;
        // },
        setIsInitialized: (state: MapState, isInitialized: boolean) => {
            state.isInitialized = isInitialized;
        }
    }
};
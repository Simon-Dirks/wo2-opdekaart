import {AddressesGeoJsonModel} from "../../models/addresses-geo-json.model";
import {ActionContext} from "vuex";
import {State} from "../index";
import {LngLatBounds} from "mapbox-gl";
import {AddressModel} from "../../models/address.model";

interface MapState {
    geoJson: AddressesGeoJsonModel | null;
    filteredGeoJson: AddressesGeoJsonModel | null;
    isInitialized: boolean;
}

export const mapStoreModule = {
    namespaced: true,
    state() {
        return {
            geoJson: null,
            filteredGeoJson: null,
            isInitialized: false
        };
    },
    getters: {
        getGeoJson(state: MapState): AddressesGeoJsonModel | null {
            return state.geoJson;
        },
        getFilteredGeoJson(state: MapState): AddressesGeoJsonModel | null {
            return state.filteredGeoJson;
        },
        getIsInitialized(state: MapState): boolean {
            return state.isInitialized;
        }
    },
    actions: {
        updateGeoJson: (context: ActionContext<MapState, State>, geoJson: AddressesGeoJsonModel) => {
            context.commit('setGeoJson', geoJson);
            context.commit('setFilteredGeoJson', geoJson);
        },
        getAddressesInBounds: (context: ActionContext<MapState, State>, mapBounds: LngLatBounds): Promise<AddressModel[]> => {
            const geoJson: AddressesGeoJsonModel | null = context.state.filteredGeoJson;
            if (!geoJson || !('features' in geoJson)) {
                return Promise.resolve([]);
            }

            // @ts-ignore
            const addressesWithinBounds: AddressModel[] = geoJson['features'].filter((feature: any) => {
                return mapBounds.contains(feature['geometry']['coordinates']);
            }).map((feature: any) => feature.properties);
            return Promise.resolve(addressesWithinBounds);
        },
    },
    mutations: {
        setGeoJson: (state: MapState, geoJson: AddressesGeoJsonModel) => {
            state.geoJson = geoJson;
        },
        setFilteredGeoJson: (state: MapState, geoJson: AddressesGeoJsonModel) => {
            state.filteredGeoJson = geoJson;
        },
        setIsInitialized: (state: MapState, isInitialized: boolean) => {
            state.isInitialized = isInitialized;
        }
    }
};
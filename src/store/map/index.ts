interface MapState {
    geoJson: any | null;
    isInitialized: boolean;
    // streetFilter: string;
    // filteredGeoJson: any | null;
}

export const mapStoreModule = {
    namespaced: true,
    state() {
        return {
            geoJson: null,
            isInitialized: false
            // streetFilter: ''
            // filteredGeoJson: null
        };
    },
    getters: {
        getGeoJson(state: MapState) {
            return state.geoJson;
        },
        getIsInitialized(state: MapState) {
            return state.isInitialized;
        }
        // getStreetFilter(state: MapState) {
        //     return state.streetFilter;
        // }
    },
    mutations: {
        setGeoJson: (state: MapState, geoJson: any) => {
            state.geoJson = geoJson;
        },
        setIsInitialized: (state: MapState, isInitialized: boolean) => {
            state.isInitialized = isInitialized;
        },
        // setStreetFilter: (state: MapState, streetFilter: string) => {
        //     state.streetFilter = streetFilter;
        // },
        // setFilteredGeoJson: (state: MapState, geoJson: any) => {
        //     state.filteredGeoJson = geoJson;
        // },
    }
};
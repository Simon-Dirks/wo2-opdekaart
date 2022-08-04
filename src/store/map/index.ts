interface MapState {
    geoJson: any | null;
    // streetFilter: string;
    // filteredGeoJson: any | null;
}

export const mapStoreModule = {
    namespaced: true,
    state() {
        return {
            geoJson: null,
            // streetFilter: ''
            // filteredGeoJson: null
        };
    },
    getters: {
        getGeoJson(state: MapState) {
            return state.geoJson;
        },
        // getStreetFilter(state: MapState) {
        //     return state.streetFilter;
        // }
    },
    mutations: {
        setGeoJson: (state: MapState, geoJson: any) => {
            state.geoJson = geoJson;
        },
        // setStreetFilter: (state: MapState, streetFilter: string) => {
        //     state.streetFilter = streetFilter;
        // },
        // setFilteredGeoJson: (state: MapState, geoJson: any) => {
        //     state.filteredGeoJson = geoJson;
        // },
    }
};
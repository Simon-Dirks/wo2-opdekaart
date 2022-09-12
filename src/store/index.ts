import {createStore} from 'vuex'
import {mapStoreModule} from "./map";
import {previewModalModule} from "./preview-modal";
import {paginationModule} from "./pagination";
import {AddressModel} from "../models/address.model";

export interface State {
    selectedAddress: AddressModel | null,
    searchTerm: string,
    shownSourceIds: Set<string>,
}

export const store = createStore<State>({
    modules: {
        map: mapStoreModule,
        previewModal: previewModalModule,
        pagination: paginationModule
    },
    state() {
        return {
            selectedAddress: null,
            searchTerm: '',
            shownSourceIds: new Set<string>([]),
        }
    },
    getters: {
        getSelectedItem(state) {
            return state.selectedAddress;
        },
        getSearchTerm(state) {
            return state.searchTerm;
        },
        getShownSourceIds(state): Set<string> {
            return state.shownSourceIds;
        },
        getSourceIdIsShown: (state) => (sourceId: string): boolean => {
            return state.shownSourceIds.has(sourceId);
        }
    },
    mutations: {
        updateSearchTerm(state: State, searchTerm: string) {
            state.searchTerm = searchTerm;
        },
        setShownSourceIds(state: State, shownSourceIds: Set<string>) {
            state.shownSourceIds = shownSourceIds;
        },
        selectAddress(state: State, selectedAddress: AddressModel) {
            state.selectedAddress = selectedAddress;
        },
        deselectAddress(state: State) {
            state.selectedAddress = null;
        },
    }
})
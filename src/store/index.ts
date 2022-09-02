import {createStore} from 'vuex'
import {mapStoreModule} from "./map";
import {previewModalModule} from "./preview-modal";
import {AddressModel} from "../models/address.model";

interface State {
    selectedAddress: AddressModel | null,
    searchTerm: string,
}

export const store = createStore<State>({
    modules: {
        map: mapStoreModule,
        previewModal: previewModalModule
    },
    state() {
        return {
            selectedAddress: null,
            searchTerm: '',
        }
    },
    getters: {
        getSelectedItem(state) {
            return state.selectedAddress;
        },
        getSearchTerm(state) {
            return state.searchTerm;
        }
    },
    mutations: {
        updateSearchTerm(state: State, searchTerm: string) {
            state.searchTerm = searchTerm;
        },
        selectAddress(state: State, selectedAddress: AddressModel) {
            state.selectedAddress = selectedAddress;
        },
        deselectAddress(state: State) {
            state.selectedAddress = null;
        },
    }
})